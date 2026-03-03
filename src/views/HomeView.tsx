import { useState, useEffect, useRef, useMemo } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import type { Id } from '../../convex/_generated/dataModel'
import type { ExcuseEvent } from '../types'
import type { UserId } from '../App'
import { isToday, isSameDay } from '../utils/date'
import {
  DELETE_TIMEOUT_MS, WEEK_MIN_EVENTS,
  WEEK_CONVERSION_THRESHOLD, MILESTONE_TEN, MILESTONE_FIRST,
} from '../constants'
import { useReminderNotification, requestNotificationPermission, isNotificationEnabled } from '../hooks/useReminderNotification'
import HomeTopBar from '../components/home/HomeTopBar'
import HomeCatHero from '../components/home/HomeCatHero'
import HomeStatsCard from '../components/home/HomeStatsCard'
import HomeStreakBadge from '../components/home/HomeStreakBadge'
import HomePartnerActivity from '../components/home/HomePartnerActivity'
import HomeEventsList from '../components/home/HomeEventsList'

interface Props {
  currentUser: UserId
  onSwitchUser: (user: UserId) => void
  onAddExcuse: () => void
  onNightClosure: (eventId: Id<'excuseEvents'>) => void
  onWeekly: () => void
  onMonthly: () => void
}

export default function HomeView({ currentUser, onSwitchUser, onAddExcuse, onNightClosure, onWeekly, onMonthly }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [pendingDeleteId, setPendingDeleteId] = useState<Id<'excuseEvents'> | null>(null)
  const [notifEnabled, setNotifEnabled] = useState(isNotificationEnabled)
  const deleteTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [milestone, setMilestone] = useState<string | null>(null)

  const partnerUser: UserId = currentUser === 'husband' ? 'wife' : 'husband'
  const eventsRaw = useQuery(api.excuseEvents.listByUser, { userId: currentUser })
  const partnerEventsRaw = useQuery(api.excuseEvents.listByUser, { userId: partnerUser })
  const deleteEvent = useMutation(api.excuseEvents.deleteEvent)

  const events = useMemo(() => (eventsRaw ?? []) as ExcuseEvent[], [eventsRaw])
  const partnerEvents = useMemo(() => (partnerEventsRaw ?? []).slice(0, 3) as ExcuseEvent[], [partnerEventsRaw])

  const todayEvents = useMemo(() => events.filter(e => isToday(e.timestamp)), [events])
  const unresolvedEvents = useMemo(() => events.filter(e => e.status === undefined), [events])
  const displayedUnresolved = useMemo(
    () => unresolvedEvents.filter(e => e._id !== pendingDeleteId),
    [unresolvedEvents, pendingDeleteId],
  )
  const recentCompleted = useMemo(
    () => events.filter(e => e.status === 'full' || e.status === 'minimal').slice(0, 5),
    [events],
  )

  const todayAvoidance = todayEvents.length
  const todayAction = todayEvents.filter(e => e.status === 'minimal' || e.status === 'full').length
  const todayRate = todayAvoidance > 0 ? Math.round((todayAction / todayAvoidance) * 100) : 0

  const streak = useMemo(() => {
    let count = 0
    let day = new Date()
    day.setHours(0, 0, 0, 0)
    while (true) {
      const dayEvents = events.filter(e => isSameDay(e.timestamp, day))
      if (dayEvents.length === 0) break
      if (!dayEvents.some(e => e.status === 'full' || e.status === 'minimal')) break
      count++
      day = new Date(day.getTime() - 86400000)
    }
    return count
  }, [events])

  const catSpeech = todayEvents.length === 0
    ? '今天還沒有任何藉口，繼續保持！'
    : unresolvedEvents.length === 0
      ? currentUser === 'wife'
        ? '你今天表現不錯，記得聯絡老公！'
        : '你今天表現不錯，迪教練稍微有點滿意。'
      : `還有 ${unresolvedEvents.length} 個待結案的藉口喔。`

  function handleDelete(ev: React.MouseEvent, id: Id<'excuseEvents'>) {
    ev.stopPropagation()
    if (pendingDeleteId && deleteTimerRef.current) {
      clearTimeout(deleteTimerRef.current)
      void deleteEvent({ id: pendingDeleteId })
    }
    setPendingDeleteId(id)
    deleteTimerRef.current = setTimeout(() => {
      void deleteEvent({ id })
      setPendingDeleteId(null)
      deleteTimerRef.current = null
    }, DELETE_TIMEOUT_MS)
  }

  function undoDelete() {
    if (deleteTimerRef.current) clearTimeout(deleteTimerRef.current)
    deleteTimerRef.current = null
    setPendingDeleteId(null)
  }

  useEffect(() => () => { if (deleteTimerRef.current) clearTimeout(deleteTimerRef.current) }, [])

  async function handleToggleReminder() {
    setMenuOpen(false)
    if (notifEnabled) {
      localStorage.setItem('reminderEnabled', '0')
      setNotifEnabled(false)
    } else {
      const granted = await requestNotificationPermission()
      if (granted) {
        localStorage.setItem('reminderEnabled', '1')
        setNotifEnabled(true)
      }
    }
  }

  useReminderNotification(currentUser, todayEvents, unresolvedEvents.length)

  // Milestone detection
  useEffect(() => {
    const completions = events.filter(e => e.status === 'full' || e.status === 'minimal')
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
    const weekEvts = events.filter(e => e.timestamp >= sevenDaysAgo)
    const weekAction = weekEvts.filter(e => e.status === 'full' || e.status === 'minimal').length
    const weekConversion = weekEvts.length >= WEEK_MIN_EVENTS ? weekAction / weekEvts.length : 0

    let msg: string | null = null
    if (completions.length >= MILESTONE_TEN && !localStorage.getItem(`ms_10_${currentUser}`)) {
      localStorage.setItem(`ms_10_${currentUser}`, '1')
      msg = '🎯 你已累積 10 次行動！迪教練非常驕傲。'
    } else if (weekConversion >= WEEK_CONVERSION_THRESHOLD && !localStorage.getItem(`ms_w50_${currentUser}`)) {
      localStorage.setItem(`ms_w50_${currentUser}`, '1')
      msg = '🏅 本週轉化率突破 50%！繼續保持。'
    } else if (completions.length >= MILESTONE_FIRST && !localStorage.getItem(`ms_first_${currentUser}`)) {
      localStorage.setItem(`ms_first_${currentUser}`, '1')
      msg = '🌟 第一次完成行動！迪教練對你有信心。'
    }

    if (msg !== null) {
      const t = setTimeout(() => setMilestone(msg), 0)
      return () => clearTimeout(t)
    }
  }, [events, currentUser])

  return (
    <div className="min-h-screen bg-bg font-sans">
      <HomeTopBar
        currentUser={currentUser}
        onSwitchUser={onSwitchUser}
        onWeekly={onWeekly}
        onMonthly={onMonthly}
        notifEnabled={notifEnabled}
        onToggleReminder={() => { void handleToggleReminder() }}
        menuOpen={menuOpen}
        onMenuToggle={() => setMenuOpen(v => !v)}
        onMenuClose={() => setMenuOpen(false)}
      />

      <div className="px-5 space-y-4 pb-12">
        <HomeCatHero
          unresolvedCount={unresolvedEvents.length}
          todayAction={todayAction}
          catSpeech={catSpeech}
        />

        <div className="animate-fade-up" style={{ animationDelay: '60ms' }}>
          <button className="btn-primary" onClick={onAddExcuse}>
            我該去運動了，但是＿＿
          </button>
        </div>

        {milestone && (
          <div className="flex items-center justify-between px-4 py-3 rounded-card border border-accent/30 bg-accentSoft/50 animate-fade-up">
            <span className="text-sm font-serif text-textPrimary">{milestone}</span>
            <button
              className="ml-3 flex-shrink-0 text-textSecondary/60 hover:text-textSecondary transition-colors"
              onClick={() => setMilestone(null)}
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        )}

        <HomeStatsCard todayAvoidance={todayAvoidance} todayAction={todayAction} todayRate={todayRate} />
        <HomeStreakBadge streak={streak} />
        <HomePartnerActivity currentUser={currentUser} partnerEvents={partnerEvents} />
        <HomeEventsList
          todayEvents={todayEvents}
          displayedUnresolved={displayedUnresolved}
          pendingDeleteId={pendingDeleteId}
          recentCompleted={recentCompleted}
          onNightClosure={onNightClosure}
          onDelete={handleDelete}
          onUndoDelete={undoDelete}
        />
      </div>
    </div>
  )
}

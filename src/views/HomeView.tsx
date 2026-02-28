import { useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import type { Id } from '../../convex/_generated/dataModel'
import CatView from '../components/CatView'
import { displayExcuse } from '../theme'
import { formatDistanceToNow } from 'date-fns'
import { zhTW } from 'date-fns/locale'
import type { ExcuseEvent } from '../types'
import type { UserId } from '../App'

interface Props {
  currentUser: UserId
  onSwitchUser: (user: UserId) => void
  onAddExcuse: () => void
  onNightClosure: (eventId: Id<'excuseEvents'>) => void
  onWeekly: () => void
  onMonthly: () => void
}

function isToday(ts: number) {
  const d = new Date(ts), now = new Date()
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate()
}

function isSameDay(ts: number, date: Date) {
  const d = new Date(ts)
  return d.getFullYear() === date.getFullYear() && d.getMonth() === date.getMonth() && d.getDate() === date.getDate()
}

export default function HomeView({ currentUser, onSwitchUser, onAddExcuse, onNightClosure, onWeekly, onMonthly }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const allEvents = (useQuery(api.excuseEvents.listAll) ?? []) as ExcuseEvent[]
  const deleteEvent = useMutation(api.excuseEvents.deleteEvent)

  const events = allEvents.filter((e: ExcuseEvent) => (e.userId ?? 'husband') === currentUser)
  const todayEvents = events.filter((e: ExcuseEvent) => isToday(e.timestamp))
  const unresolvedEvents = events.filter((e: ExcuseEvent) => e.status == null)

  const todayAvoidance = todayEvents.length
  const todayAction = todayEvents.filter((e: ExcuseEvent) => e.status === 'minimal' || e.status === 'full').length
  const todayRate = todayAvoidance > 0 ? Math.round((todayAction / todayAvoidance) * 100) : 0

  let streak = 0
  {
    let day = new Date()
    day.setHours(0, 0, 0, 0)
    while (true) {
      const dayEvents = events.filter((e: ExcuseEvent) => isSameDay(e.timestamp, day))
      if (dayEvents.length === 0) break
      const hasAction = dayEvents.some((e: ExcuseEvent) => e.status === 'full' || e.status === 'minimal')
      if (!hasAction) break
      streak++
      day = new Date(day.getTime() - 86400000)
    }
  }

  const catSpeech = todayEvents.length === 0
    ? '今天還沒有任何藉口，繼續保持！'
    : unresolvedEvents.length === 0
      ? currentUser === 'wife'
        ? '你今天表現不錯，記得聯絡老公！'
        : '你今天表現不錯，迪教練稍微有點滿意。'
      : `還有 ${unresolvedEvents.length} 個待結案的藉口喔。`

  return (
    <div className="min-h-screen bg-bg font-sans">
      {/* Top bar */}
      <div className="flex justify-between items-center px-5 pt-6 pb-2">
        <span className="font-serif text-sm font-semibold text-accent tracking-wide">迪教練</span>
        <div className="flex items-center gap-2">
          {/* User switcher */}
          <div className="flex rounded-full border border-border overflow-hidden text-xs font-medium">
            <button
              className={`px-3 py-1 transition-colors ${currentUser === 'husband' ? 'bg-accent text-white' : 'text-textSecondary hover:bg-accentSoft/40'}`}
              onClick={() => onSwitchUser('husband')}
            >我</button>
            <button
              className={`px-3 py-1 transition-colors ${currentUser === 'wife' ? 'bg-accent text-white' : 'text-textSecondary hover:bg-accentSoft/40'}`}
              onClick={() => onSwitchUser('wife')}
            >老婆</button>
          </div>
        <div className="relative">
          <button
            className="w-8 h-8 rounded-full flex items-center justify-center text-textSecondary hover:bg-accentSoft transition-colors"
            onClick={() => setMenuOpen(v => !v)}
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <circle cx="12" cy="5" r="1.2" fill="currentColor" />
              <circle cx="12" cy="12" r="1.2" fill="currentColor" />
              <circle cx="12" cy="19" r="1.2" fill="currentColor" />
            </svg>
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-9 z-20 card min-w-[120px] py-1 border border-border">
                <button
                  className="block w-full text-left px-4 py-2.5 text-sm text-textPrimary hover:bg-accentSoft/40 transition-colors font-sans"
                  onClick={() => { setMenuOpen(false); onWeekly() }}
                >本週回顧</button>
                <button
                  className="block w-full text-left px-4 py-2.5 text-sm text-textPrimary hover:bg-accentSoft/40 transition-colors font-sans"
                  onClick={() => { setMenuOpen(false); onMonthly() }}
                >本月總覽</button>
              </div>
            </>
          )}
        </div>
        </div>
      </div>

      <div className="px-5 space-y-4 pb-12">
        {/* Cat portrait hero */}
        <div className="flex flex-col items-center pt-2 pb-2 animate-fade-up" style={{ animationDelay: '0ms' }}>
          <div className="cat-portrait w-[108px] h-[108px]">
            <CatView expression={unresolvedEvents.length > 0 ? 'sideEye' : todayAction > 0 ? 'gentleSmile' : 'neutral'} size={86} />
          </div>
          <p className="font-serif italic text-[13px] text-textSecondary mt-3 text-center max-w-[220px] leading-relaxed">
            「{catSpeech}」
          </p>
        </div>

        {/* CTA */}
        <div className="animate-fade-up" style={{ animationDelay: '60ms' }}>
          <button className="btn-primary" onClick={onAddExcuse}>
            我該去運動了，但是＿＿
          </button>
        </div>

        {/* Stats ledger */}
        <div className="card animate-fade-up" style={{ animationDelay: '120ms' }}>
          <div className="grid grid-cols-3 divide-x divide-border">
            <StatCol label="今日逃避" value={todayAvoidance} unit="次" color="text-red" />
            <StatCol label="已行動" value={todayAction} unit="次" color="text-green" />
            <StatCol label="轉化率" value={todayRate} unit="%" color="text-accent" />
          </div>
        </div>

        {/* Streak */}
        {streak >= 2 && (
          <div
            className="flex items-center gap-2.5 px-4 py-3 rounded-card border border-accent/20 bg-accentSoft/30 animate-fade-up"
            style={{ animationDelay: '160ms' }}
          >
            <span className="text-lg">🔥</span>
            <span className="font-serif text-sm font-semibold text-accent">連續 {streak} 天行動</span>
          </div>
        )}

        {/* Events section */}
        <div className="animate-fade-up" style={{ animationDelay: '180ms' }}>
          {todayEvents.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-6">
              <div className="cat-portrait w-16 h-16">
                <CatView expression="gentleSmile" size={52} />
              </div>
              <p className="text-sm text-textSecondary font-serif italic">今天一片空白，保持下去。</p>
            </div>
          ) : unresolvedEvents.length === 0 ? (
            <div className="flex items-center gap-2 px-1 py-2">
              <span className="text-green font-mono text-base">✓</span>
              <span className="text-sm text-textSecondary">今日全部結案</span>
            </div>
          ) : (
            <div className="space-y-2">
              {/* Section header */}
              <div className="flex items-center gap-3 mb-1">
                <span className="label-section">未結案</span>
                <div className="flex-1 divider-dots" />
                <span className="font-mono text-[10px] text-textSecondary">{unresolvedEvents.length}</span>
              </div>

              {unresolvedEvents.map((event: ExcuseEvent, i: number) => (
                <div
                  key={event._id}
                  className="event-card animate-fade-up"
                  style={{ animationDelay: `${220 + i * 55}ms` }}
                >
                  <div className="event-card-bar" />
                  <button
                    className="flex-1 px-4 py-3.5 text-left min-w-0"
                    onClick={() => onNightClosure(event._id)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <span className="text-[11px] font-medium text-accent font-mono tracking-wide">{event.context}</span>
                        <p className="text-sm font-medium text-textPrimary mt-0.5 truncate">
                          {displayExcuse(event.excuse, event.customNote)}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-mono text-[10px] text-textSecondary tabular-nums leading-loose">
                          {formatDistanceToNow(event.timestamp, { addSuffix: true, locale: zhTW })}
                        </p>
                        <span className="text-xs text-textSecondary/50 block">›</span>
                      </div>
                    </div>
                  </button>
                  <button
                    className="px-3.5 flex items-center justify-center text-textSecondary/40 hover:text-red transition-colors flex-shrink-0"
                    onClick={(ev) => { ev.stopPropagation(); deleteEvent({ id: event._id }) }}
                  >
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StatCol({ label, value, unit, color }: { label: string; value: number; unit: string; color: string }) {
  return (
    <div className="flex flex-col items-center py-4 px-2">
      <div className="flex items-baseline gap-0.5">
        <span className={`stat-num text-[26px] leading-none ${color}`}>{value}</span>
        <span className={`font-mono text-xs ${color} opacity-70 ml-0.5`}>{unit}</span>
      </div>
      <span className="label-section mt-1.5">{label}</span>
    </div>
  )
}

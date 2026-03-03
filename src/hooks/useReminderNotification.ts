import { useEffect, useRef } from 'react'
import type { UserId } from '../App'
import type { ExcuseEvent } from '../types'
import { REMINDER_MORNING_HOUR, REMINDER_NIGHT_HOUR } from '../constants'

function getTodayKey() {
  const d = new Date()
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
}

function msUntilHour(hour: number): number {
  const now = new Date()
  const target = new Date(now)
  target.setHours(hour, 0, 0, 0)
  return target.getTime() - now.getTime()
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false
  if (Notification.permission === 'granted') return true
  if (Notification.permission === 'denied') return false
  const result = await Notification.requestPermission()
  return result === 'granted'
}

export function isNotificationEnabled(): boolean {
  return (
    'Notification' in window &&
    Notification.permission === 'granted' &&
    localStorage.getItem('reminderEnabled') === '1'
  )
}

export function useReminderNotification(
  currentUser: UserId,
  todayEvents: ExcuseEvent[],
  unresolvedCount: number,
) {
  const morningTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const nightTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const todayEventsRef = useRef(todayEvents)
  const unresolvedCountRef = useRef(unresolvedCount)

  useEffect(() => {
    todayEventsRef.current = todayEvents
  })

  useEffect(() => {
    unresolvedCountRef.current = unresolvedCount
  })

  // 6pm: remind to log if nothing recorded today
  useEffect(() => {
    if (!isNotificationEnabled()) return

    const sentKey = `reminder_sent_${currentUser}_${getTodayKey()}`
    if (localStorage.getItem(sentKey)) return

    const ms = msUntilHour(REMINDER_MORNING_HOUR)

    function fire() {
      if (todayEventsRef.current.length === 0) {
        localStorage.setItem(sentKey, '1')
        void new Notification('迪教練', {
          body: '今天還沒記錄，快來說說你的藉口！',
          icon: '/icon-192.png',
          badge: '/icon-192.png',
          tag: 'daily-reminder',
        })
      }
    }

    if (ms <= 0) { fire(); return }
    morningTimerRef.current = setTimeout(fire, ms)
    return () => { if (morningTimerRef.current) clearTimeout(morningTimerRef.current) }
  }, [currentUser])

  // 8pm: remind to close unresolved events
  useEffect(() => {
    if (!isNotificationEnabled()) return

    const sentKey = `night_reminder_sent_${currentUser}_${getTodayKey()}`
    if (localStorage.getItem(sentKey)) return

    const ms = msUntilHour(REMINDER_NIGHT_HOUR)

    function fireNight() {
      const count = unresolvedCountRef.current
      if (count > 0) {
        localStorage.setItem(sentKey, '1')
        void new Notification('迪教練', {
          body: `還有 ${count} 個藉口未結案，睡前來處理一下！`,
          icon: '/icon-192.png',
          badge: '/icon-192.png',
          tag: 'night-reminder',
        })
      }
    }

    if (ms <= 0) { fireNight(); return }
    nightTimerRef.current = setTimeout(fireNight, ms)
    return () => { if (nightTimerRef.current) clearTimeout(nightTimerRef.current) }
  }, [currentUser])
}

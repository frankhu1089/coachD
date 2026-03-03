import { describe, it, expect } from 'vitest'
import { isToday, isSameDay, startOfToday } from './date'

describe('isToday', () => {
  it('returns true for current timestamp', () => {
    expect(isToday(Date.now())).toBe(true)
  })

  it('returns true for earlier today (midnight)', () => {
    const midnight = new Date()
    midnight.setHours(0, 0, 0, 0)
    expect(isToday(midnight.getTime())).toBe(true)
  })

  it('returns false for yesterday', () => {
    expect(isToday(Date.now() - 86400000)).toBe(false)
  })

  it('returns false for tomorrow', () => {
    expect(isToday(Date.now() + 86400000)).toBe(false)
  })
})

describe('isSameDay', () => {
  it('returns true when ts and date are the same day', () => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    expect(isSameDay(d.getTime(), d)).toBe(true)
  })

  it('returns true for different times on the same day', () => {
    const morning = new Date()
    morning.setHours(8, 0, 0, 0)
    const evening = new Date()
    evening.setHours(22, 0, 0, 0)
    expect(isSameDay(morning.getTime(), evening)).toBe(true)
  })

  it('returns false for different days', () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const yesterday = new Date(today.getTime() - 86400000)
    expect(isSameDay(today.getTime(), yesterday)).toBe(false)
  })

  it('returns false across month boundary', () => {
    const firstOfMonth = new Date()
    firstOfMonth.setDate(1)
    firstOfMonth.setHours(0, 0, 0, 0)
    const lastOfPrevMonth = new Date(firstOfMonth.getTime() - 86400000)
    expect(isSameDay(firstOfMonth.getTime(), lastOfPrevMonth)).toBe(false)
  })
})

describe('startOfToday', () => {
  it('returns a timestamp at midnight', () => {
    const ts = startOfToday()
    const d = new Date(ts)
    expect(d.getHours()).toBe(0)
    expect(d.getMinutes()).toBe(0)
    expect(d.getSeconds()).toBe(0)
    expect(d.getMilliseconds()).toBe(0)
  })

  it('is less than or equal to Date.now()', () => {
    expect(startOfToday()).toBeLessThanOrEqual(Date.now())
  })
})

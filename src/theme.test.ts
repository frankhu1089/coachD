import { describe, it, expect } from 'vitest'
import { displayExcuse, suggestionsFor, autoContext, excuses, workoutPlanKeys, workoutPlans } from './theme'

describe('displayExcuse', () => {
  it('returns the excuse when not 其他', () => {
    expect(displayExcuse('疲累一天')).toBe('疲累一天')
    expect(displayExcuse('時間不夠')).toBe('時間不夠')
  })

  it('returns customNote when excuse is 其他 and note is present', () => {
    expect(displayExcuse('其他', '今天太熱了')).toBe('今天太熱了')
  })

  it('returns 其他 when excuse is 其他 and customNote is blank', () => {
    expect(displayExcuse('其他', '   ')).toBe('其他')
  })

  it('returns 其他 when excuse is 其他 and customNote is undefined', () => {
    expect(displayExcuse('其他', undefined)).toBe('其他')
  })

  it('returns 其他 when excuse is 其他 and no customNote arg', () => {
    expect(displayExcuse('其他')).toBe('其他')
  })
})

describe('suggestionsFor', () => {
  it('returns specific suggestions for each known excuse', () => {
    const knownExcuses = ['疲累一天', '時間不夠', '心情不好', '工作太忙', '身體不適', '不想出門', '休息一下']
    for (const excuse of knownExcuses) {
      const s = suggestionsFor(excuse)
      expect(s.length).toBeGreaterThan(0)
    }
  })

  it('returns疲累 suggestions for 疲累一天', () => {
    const s = suggestionsFor('疲累一天')
    expect(s).toContain('輕鬆伸展 5 分鐘')
  })

  it('returns time suggestions for 時間不夠', () => {
    const s = suggestionsFor('時間不夠')
    expect(s).toContain('5 分鐘 HIIT')
  })

  it('returns default suggestions for unknown excuse', () => {
    const s = suggestionsFor('不知道')
    expect(s.length).toBeGreaterThan(0)
  })

  it('never returns an empty array', () => {
    for (const excuse of [...excuses, 'random_unknown_excuse']) {
      expect(suggestionsFor(excuse).length).toBeGreaterThan(0)
    }
  })
})

describe('autoContext', () => {
  it('returns a non-empty string', () => {
    expect(typeof autoContext()).toBe('string')
    expect(autoContext().length).toBeGreaterThan(0)
  })

  it('returns one of the two valid context values', () => {
    const result = autoContext()
    expect(['下班後', '假日下午']).toContain(result)
  })
})

describe('workoutPlans', () => {
  it('every plan key has a matching plan', () => {
    for (const key of workoutPlanKeys) {
      expect(workoutPlans[key]).toBeDefined()
    }
  })

  it('every plan has warm, main, cool sections with items', () => {
    for (const key of workoutPlanKeys) {
      const plan = workoutPlans[key]
      expect(plan.warm.items.length).toBeGreaterThan(0)
      expect(plan.main.items.length).toBeGreaterThan(0)
      expect(plan.cool.items.length).toBeGreaterThan(0)
    }
  })

  it('every plan has a label and emoji', () => {
    for (const key of workoutPlanKeys) {
      expect(workoutPlans[key].label.length).toBeGreaterThan(0)
      expect(workoutPlans[key].emoji.length).toBeGreaterThan(0)
    }
  })
})

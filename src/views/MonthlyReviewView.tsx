import { useMemo } from 'react'
import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import CatView from '../components/CatView'
import { displayExcuse } from '../theme'
import { isSameDay } from '../utils/date'
import type { ExcuseEvent } from '../types'
import type { UserId } from '../App'

interface Props { currentUser: UserId; onClose: () => void }

function isSameMonth(ts: number) {
  const d = new Date(ts), now = new Date()
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
}

export default function MonthlyReviewView({ currentUser, onClose }: Props) {
  const eventsRaw = useQuery(api.excuseEvents.listByUser, { userId: currentUser })
  const events = useMemo(() => (eventsRaw ?? []) as ExcuseEvent[], [eventsRaw])
  const monthEvents = events.filter((e) => isSameMonth(e.timestamp))

  const fullCount = monthEvents.filter((e) => e.status === 'full').length
  const minimalCount = monthEvents.filter((e) => e.status === 'minimal').length
  const avoidanceCount = monthEvents.length
  const actionCount = fullCount + minimalCount
  const conversionRate = avoidanceCount > 0 ? Math.round(actionCount / avoidanceCount * 100) : 0

  const topExcuse = (() => {
    if (!monthEvents.length) return null
    const counts: Record<string, number> = {}
    monthEvents.forEach((e) => {
      const k = displayExcuse(e.excuse, e.customNote)
      counts[k] = (counts[k] ?? 0) + 1
    })
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]
    return top ? { name: top[0], count: top[1] } : null
  })()

  const now = new Date()
  const monthLabel = `${now.getFullYear()} 年 ${now.getMonth() + 1} 月`

  return (
    <div className="px-5 pb-8 font-sans">
      <div className="flex items-baseline justify-between pt-4 pb-5">
        <div>
          <h2 className="font-serif text-xl font-bold text-textPrimary">本月轉化率</h2>
          <p className="font-mono text-[10px] text-textSecondary mt-0.5 tracking-wide">{monthLabel}</p>
        </div>
        <button className="text-sm font-medium text-accent" onClick={onClose}>完成</button>
      </div>

      {monthEvents.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-10">
          <div className="cat-portrait w-24 h-24">
            <CatView expression="gentleSmile" size={80} />
          </div>
          <p className="font-serif italic text-sm text-textSecondary text-center px-10">「這個月還沒有記錄。」</p>
          <button className="text-sm font-medium text-accent mt-2" onClick={onClose}>好的</button>
        </div>
      ) : (
        <div className="space-y-4">
          <div
            className="rounded-card px-6 py-7 flex flex-col items-center"
            style={{ background: 'linear-gradient(135deg, #F0D9C8 0%, #FAF0E6 100%)' }}
          >
            <span className="label-section mb-2">本月轉化率</span>
            <div className="flex items-end gap-1">
              <span className="stat-num text-[62px] leading-none text-accent">{conversionRate}</span>
              <span className="stat-num text-2xl text-accent/70 mb-2">%</span>
            </div>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="font-mono text-[10px] text-accent/60 tracking-wide">{actionCount} 次行動</span>
              <span className="text-accent/30 text-xs">/</span>
              <span className="font-mono text-[10px] text-accent/60 tracking-wide">{avoidanceCount} 次逃避</span>
            </div>
          </div>

          <div className="card divide-y divide-border">
            <LedgerRow label="本月逃避" value={avoidanceCount} unit="次" />
            <LedgerRow label="仍然動了" value={actionCount} unit="次" color="text-green" />
            <LedgerRow label="完整運動" value={fullCount} unit="次" />
            <LedgerRow label="最小行動" value={minimalCount} unit="次" />
          </div>

          {topExcuse && (
            <div className="card px-4 py-4">
              <span className="label-section block mb-1.5">本月最常見藉口</span>
              <p className="text-sm font-semibold text-textPrimary">
                {topExcuse.name}
                <span className="font-mono text-xs text-textSecondary ml-2">× {topExcuse.count}</span>
              </p>
            </div>
          )}

          {(() => {
            const today = new Date(); today.setHours(0, 0, 0, 0)
            const year = today.getFullYear(); const month = today.getMonth()
            const daysInMonth = new Date(year, month + 1, 0).getDate()
            const startOffset = new Date(year, month, 1).getDay()
            const DAY_NAMES = ['日', '一', '二', '三', '四', '五', '六']
            const cells: (number | null)[] = [
              ...Array.from({ length: startOffset }, (): null => null),
              ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
            ]
            return (
              <div className="card px-4 py-4">
                <p className="label-section mb-3">本月日曆</p>
                <div className="grid grid-cols-7 gap-x-1 gap-y-0.5 mb-1.5">
                  {DAY_NAMES.map(d => (
                    <div key={d} className="text-center font-mono text-[9px] text-textSecondary">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-x-1 gap-y-1">
                  {cells.map((dayNum, i) => {
                    if (!dayNum) return <div key={i} />
                    const dayDate = new Date(year, month, dayNum)
                    const isFuture = dayDate > today
                    const dayEvts = isFuture ? [] : monthEvents.filter(e => isSameDay(e.timestamp, dayDate))
                    const hasFull = dayEvts.some(e => e.status === 'full')
                    const hasMin = dayEvts.some(e => e.status === 'minimal')
                    const hasNone = dayEvts.some(e => e.status === 'none')
                    return (
                      <div key={i} className="flex flex-col items-center gap-0.5">
                        <span className="font-mono text-[9px] text-textSecondary/60 tabular-nums">{dayNum}</span>
                        <span className={`text-sm leading-none ${isFuture ? 'text-border' : hasFull ? 'text-accent' : hasMin ? 'text-yellow' : hasNone ? 'text-red/60' : dayEvts.length > 0 ? 'text-textSecondary/40' : 'text-border'}`}>
                          {isFuture ? '·' : hasFull ? '●' : hasMin ? '◑' : hasNone ? '○' : '·'}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })()}

          <div className="flex flex-col items-center gap-3 py-4">
            <div className="cat-portrait w-20 h-20">
              <CatView expression="gentleSmile" size={66} />
            </div>
            <p className="font-serif text-base font-medium text-textPrimary text-center leading-relaxed px-6">
              你其實沒有那麼懶。<br />
              <span className="text-textSecondary font-normal">你只是偶爾不想開始而已。</span>
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

function LedgerRow({
  label, value, unit, color = 'text-textPrimary',
}: {
  label: string; value: number; unit: string; color?: string
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3.5">
      <span className="text-sm text-textSecondary">{label}</span>
      <span className={`stat-num text-base ${color}`}>
        {value}<span className="text-xs ml-0.5 opacity-70">{unit}</span>
      </span>
    </div>
  )
}

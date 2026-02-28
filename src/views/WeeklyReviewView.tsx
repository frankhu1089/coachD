import { useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import CatView from '../components/CatView'
import { displayExcuse } from '../theme'
import type { ExcuseEvent } from '../types'
import type { UserId } from '../App'

interface Props { currentUser: UserId; onClose: () => void }

export default function WeeklyReviewView({ currentUser, onClose }: Props) {
  const allEvents = (useQuery(api.excuseEvents.listAll) ?? []) as ExcuseEvent[]
  const events = allEvents.filter((e: ExcuseEvent) => (e.userId ?? 'husband') === currentUser)

  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
  const weekEvents = events.filter((e: ExcuseEvent) => e.timestamp >= sevenDaysAgo)

  const fullCount = weekEvents.filter((e: ExcuseEvent) => e.status === 'full').length
  const minimalCount = weekEvents.filter((e: ExcuseEvent) => e.status === 'minimal').length
  const avoidanceCount = weekEvents.length
  const actionCount = fullCount + minimalCount
  const conversionRate = avoidanceCount > 0 ? Math.round(actionCount / avoidanceCount * 100) : 0

  const topExcuse = (() => {
    if (!weekEvents.length) return null
    const counts: Record<string, number> = {}
    weekEvents.forEach((e: ExcuseEvent) => {
      const k = displayExcuse(e.excuse, e.customNote)
      counts[k] = (counts[k] ?? 0) + 1
    })
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]
    return top ? { name: top[0], count: top[1] } : null
  })()

  const catMessage = conversionRate >= 70
    ? '這週你做得不錯耶。迪教練有點驕傲，喵。'
    : conversionRate >= 40
      ? topExcuse
        ? `這週你講了 ${topExcuse.count} 次「${topExcuse.name}」。下週試著早點睡吧，喵。`
        : '有進步的空間，但你已經在意識到了，這很重要。'
      : '沒關係。你能打開這個 app，就已經比什麼都沒做要好了，喵。'

  return (
    <div className="px-5 pb-8 font-sans">
      {/* Header */}
      <div className="flex items-baseline justify-between pt-4 pb-5">
        <div>
          <h2 className="font-serif text-xl font-bold text-textPrimary">本週回顧</h2>
          <p className="font-mono text-[10px] text-textSecondary mt-0.5 tracking-wide uppercase">
            last 7 days
          </p>
        </div>
        <button className="text-sm font-medium text-accent" onClick={onClose}>完成</button>
      </div>

      {weekEvents.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-10">
          <div className="cat-portrait w-24 h-24">
            <CatView expression="gentleSmile" size={80} />
          </div>
          <p className="font-serif italic text-sm text-textSecondary text-center px-10">
            「這週還沒有記錄。先去試試看吧！」
          </p>
          <button className="text-sm font-medium text-accent mt-2" onClick={onClose}>好的</button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Cat */}
          <div className="flex justify-center">
            <div className="cat-portrait w-24 h-24">
              <CatView expression="gentleSmile" size={80} />
            </div>
          </div>

          {/* Stats ledger */}
          <div className="card divide-y divide-border">
            <LedgerRow label="本週逃避" value={avoidanceCount} unit="次" />
            <LedgerRow label="完整運動" value={fullCount} unit="次" color="text-green" />
            <LedgerRow label="最小行動" value={minimalCount} unit="次" color="text-yellow" />
            <LedgerRow label="轉化率" value={conversionRate} unit="%" color="text-accent" bold />
          </div>

          {/* Top excuse */}
          {topExcuse && (
            <div className="card px-4 py-4 flex items-center justify-between">
              <div>
                <span className="label-section block mb-1">Top 1 藉口</span>
                <p className="text-sm font-semibold text-textPrimary">
                  {topExcuse.name}
                  <span className="font-mono text-xs text-textSecondary ml-1.5">× {topExcuse.count}</span>
                </p>
              </div>
              <span className="text-2xl">🏆</span>
            </div>
          )}

          {/* Cat message */}
          <div className="px-2 py-2 text-center">
            <p className="font-serif italic text-sm text-textSecondary leading-relaxed">
              「{catMessage}」
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

function LedgerRow({
  label, value, unit, color = 'text-textPrimary', bold = false,
}: {
  label: string; value: number; unit: string; color?: string; bold?: boolean
}) {
  return (
    <div className="flex items-center justify-between px-4 py-3.5">
      <span className="text-sm text-textSecondary">{label}</span>
      <span className={`stat-num ${bold ? 'text-lg' : 'text-base'} ${color}`}>
        {value}<span className="text-xs ml-0.5 opacity-70">{unit}</span>
      </span>
    </div>
  )
}

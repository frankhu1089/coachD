import CatView from '../CatView'
import { displayExcuse } from '../../theme'
import { formatDistanceToNow } from 'date-fns'
import { zhTW } from 'date-fns/locale'
import type { ExcuseEvent } from '../../types'
import type { Id } from '../../../convex/_generated/dataModel'

interface Props {
  todayEvents: ExcuseEvent[]
  displayedUnresolved: ExcuseEvent[]
  pendingDeleteId: Id<'excuseEvents'> | null
  recentCompleted: ExcuseEvent[]
  onNightClosure: (id: Id<'excuseEvents'>) => void
  onDelete: (ev: React.MouseEvent, id: Id<'excuseEvents'>) => void
  onUndoDelete: () => void
}

export default function HomeEventsList({
  todayEvents, displayedUnresolved, pendingDeleteId,
  recentCompleted, onNightClosure, onDelete, onUndoDelete,
}: Props) {
  return (
    <>
      <div className="animate-fade-up" style={{ animationDelay: '200ms' }}>
        {todayEvents.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-6">
            <div className="cat-portrait w-16 h-16">
              <CatView expression="gentleSmile" size={52} />
            </div>
            <p className="text-sm text-textSecondary font-serif italic">今天一片空白，保持下去。</p>
          </div>
        ) : displayedUnresolved.length === 0 && !pendingDeleteId ? (
          <div className="flex items-center gap-2 px-1 py-2">
            <span className="text-green font-mono text-base">✓</span>
            <span className="text-sm text-textSecondary">今日全部結案</span>
          </div>
        ) : (
          <div className="space-y-2">
            {displayedUnresolved.length > 0 && (
              <>
                <div className="flex items-center gap-3 mb-1">
                  <span className="label-section">未結案</span>
                  <div className="flex-1 divider-dots" />
                  <span className="font-mono text-[10px] text-textSecondary">{displayedUnresolved.length}</span>
                </div>
                {displayedUnresolved.map((event, i) => (
                  <div
                    key={event._id}
                    className="event-card animate-fade-up"
                    style={{ animationDelay: `${240 + i * 55}ms` }}
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
                      onClick={(ev) => onDelete(ev, event._id)}
                    >
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                ))}
              </>
            )}
            {pendingDeleteId && (
              <div className="flex items-center justify-between px-4 py-2.5 rounded-card bg-textPrimary animate-fade-up">
                <span className="text-sm text-white/80">已刪除</span>
                <button
                  className="text-sm font-semibold text-accentSoft underline underline-offset-2"
                  onClick={onUndoDelete}
                >復原</button>
              </div>
            )}
          </div>
        )}
      </div>

      {recentCompleted.length > 0 && (
        <div className="animate-fade-up" style={{ animationDelay: '260ms' }}>
          <div className="flex items-center gap-3 mb-2">
            <span className="label-section">最近記錄</span>
            <div className="flex-1 divider-dots" />
          </div>
          <div className="space-y-1.5">
            {recentCompleted.map((e) => (
              <div key={e._id} className="flex items-center gap-3 px-4 py-2.5 rounded-card bg-card border border-border">
                <span className="text-base flex-shrink-0">{e.status === 'full' ? '✅' : '🟡'}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-textPrimary truncate">{displayExcuse(e.excuse, e.customNote)}</p>
                  <p className="font-mono text-[10px] text-textSecondary mt-0.5">{e.context}</p>
                </div>
                <span className="font-mono text-[10px] text-textSecondary tabular-nums flex-shrink-0">
                  {formatDistanceToNow(e.timestamp, { addSuffix: true, locale: zhTW })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

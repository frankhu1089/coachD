import { formatDistanceToNow } from 'date-fns'
import { zhTW } from 'date-fns/locale'
import type { ExcuseEvent } from '../../types'
import type { UserId } from '../../App'

interface Props {
  currentUser: UserId
  partnerEvents: ExcuseEvent[]
}

export default function HomePartnerActivity({ currentUser, partnerEvents }: Props) {
  if (partnerEvents.length === 0) return null
  return (
    <div className="card animate-fade-up" style={{ animationDelay: '180ms' }}>
      <div className="px-4 pt-3 pb-2">
        <span className="label-section">{currentUser === 'husband' ? '老婆最近' : '老公最近'}</span>
      </div>
      <div className="flex divide-x divide-border/50 pb-3">
        {partnerEvents.map((e) => (
          <div key={e._id} className="flex-1 flex flex-col items-center gap-1 py-1">
            <span className="text-xl">
              {e.status === 'full' ? '✅' : e.status === 'minimal' ? '🟡' : e.status === 'none' ? '🔴' : '⏳'}
            </span>
            <span className="font-mono text-[9px] text-textSecondary text-center leading-tight px-1">
              {formatDistanceToNow(e.timestamp, { addSuffix: false, locale: zhTW })}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

import { useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import type { Id } from '../../convex/_generated/dataModel'
import CatView from '../components/CatView'
import type { ExcuseEvent } from '../types'
import type { UserId } from '../App'
import { shareText } from '../utils'

interface Props {
  currentUser: UserId
  eventId: Id<'excuseEvents'>
  onClose: () => void
  onOpenWorkout: (id: Id<'excuseEvents'>) => void
}

type Phase = 'initial' | 'accepted' | 'fullWorkout' | 'declined'

export default function ActionSuggestionView({ currentUser, eventId, onClose, onOpenWorkout }: Props) {
  const [phase, setPhase] = useState<Phase>('initial')
  const updateStatus = useMutation(api.excuseEvents.updateStatus)
  const events = useQuery(api.excuseEvents.listAll) as ExcuseEvent[] | undefined
  const event = events?.find((e: ExcuseEvent) => e._id === eventId)

  if (!event) return (
    <div className="flex items-center justify-center" style={{ minHeight: 440 }}>
      <div className="w-6 h-6 rounded-full border-2 border-accent border-t-transparent animate-spin" />
    </div>
  )

  async function accept() {
    await updateStatus({ id: eventId, status: 'minimal' })
    setPhase('accepted')
  }

  async function acceptFull() {
    await updateStatus({ id: eventId, status: 'full' })
    setPhase('fullWorkout')
  }

  function decline() { setPhase('declined') }

  const catExpr = phase === 'accepted' || phase === 'fullWorkout' ? 'gentleSmile'
    : phase === 'declined' ? 'dramatic'
    : 'clipboard'

  return (
    <div className="flex flex-col px-5 pb-8 font-sans" style={{ minHeight: 440 }}>
      {/* Close */}
      <div className="flex justify-end pt-2 pb-4">
        <button
          className="w-8 h-8 rounded-full flex items-center justify-center text-textSecondary hover:bg-black/5 transition-colors"
          onClick={onClose}
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Cat + message */}
      <div className="flex-1 flex flex-col items-center justify-center gap-5">
        <div className="cat-portrait w-28 h-28 animate-fade-up">
          <CatView expression={catExpr} size={96} />
        </div>

        <div className="text-center px-4 animate-fade-up" style={{ animationDelay: '60ms' }}>
          {phase === 'initial' && (
            <>
              <p className="text-xs text-textSecondary mb-3 font-mono tracking-wide">今日建議行動</p>
              <p className="font-serif text-xl font-semibold text-textPrimary leading-snug">
                {event.suggestedAction}
              </p>
              <p className="text-xs text-textSecondary mt-3 font-serif italic">好啦，那我們至少做這個。</p>
            </>
          )}
          {phase === 'fullWorkout' && (
            <>
              <p className="font-serif text-xl font-semibold text-textPrimary">太棒了！今天完全制霸 💪</p>
              <p className="text-xs text-textSecondary mt-2 font-serif italic">迪教練感到非常非常驕傲。</p>
            </>
          )}
          {phase === 'accepted' && (
            <>
              <p className="font-serif text-xl font-semibold text-textPrimary">差點逃避，<br />但你還是動了 💪</p>
              <p className="text-xs text-textSecondary mt-2 font-serif italic">這就是習慣養成的方式。</p>
            </>
          )}
          {phase === 'declined' && (
            <>
              <p className="font-serif text-xl font-semibold text-textPrimary">欸⋯<br />真的連 5 分鐘都不給嗎？</p>
              <p className="text-xs text-textSecondary mt-2 font-serif italic">（迪教練嘆了一口氣）</p>
            </>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="space-y-3 animate-fade-up" style={{ animationDelay: '100ms' }}>
        {phase === 'initial' && (
          <>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                className="py-4 rounded-card text-sm font-medium text-textPrimary bg-card border border-border hover:bg-accentSoft/30 transition-colors"
                onClick={decline}
              >❌ 我還沒</button>
              <button
                className="py-4 rounded-card text-sm font-semibold text-white bg-green transition-colors"
                style={{ boxShadow: '0 2px 8px rgba(107,159,114,0.4)' }}
                onClick={accept}
              >✅ 好，我做了</button>
            </div>
            <button
              className="w-full text-xs text-textSecondary/70 underline underline-offset-2 py-1 font-serif italic"
              onClick={() => onOpenWorkout(eventId)}
            >「其實我打算去做完整運動」</button>
          </>
        )}

        {(phase === 'accepted' || phase === 'fullWorkout') && (
          <>
            <button
              className="btn-primary"
              onClick={() => shareText(
                phase === 'fullWorkout'
                  ? '我今天做了完整運動！完全制霸 💪'
                  : `我今天差點逃避，但我還是做到了：${event.suggestedAction} 💪`
              )}
            >{currentUser === 'wife' ? '聯絡老公' : '分享給太太'}</button>
            <button className="w-full py-3 text-sm text-textSecondary font-sans" onClick={onClose}>完成</button>
          </>
        )}

        {phase === 'declined' && (
          <div className="space-y-2.5">
            <button
              className="btn-primary"
              onClick={() => onOpenWorkout(eventId)}
            >我想做別的運動</button>
            <button
              className="w-full py-4 rounded-card text-sm font-medium text-textSecondary bg-card border border-border"
              onClick={onClose}
            >沒關係，今晚再來</button>
          </div>
        )}
      </div>
    </div>
  )
}

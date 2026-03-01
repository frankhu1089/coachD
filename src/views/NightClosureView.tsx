import { useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import type { Id } from '../../convex/_generated/dataModel'
import CatView from '../components/CatView'
import { displayExcuse } from '../theme'
import type { ExcuseEvent } from '../types'
import type { UserId } from '../App'

interface Props {
  currentUser: UserId
  eventId: Id<'excuseEvents'>
  onClose: () => void
}

type Phase = 'pick' | 'share'

export default function NightClosureView({ currentUser, eventId, onClose }: Props) {
  const [phase, setPhase] = useState<Phase>('pick')
  const [completedStatus, setCompletedStatus] = useState<'full' | 'minimal' | null>(null)
  const updateStatus = useMutation(api.excuseEvents.updateStatus)
  const events = useQuery(api.excuseEvents.listAll) as ExcuseEvent[] | undefined
  const event = events?.find((e: ExcuseEvent) => e._id === eventId)

  if (!event) return null

  async function close(status: 'full' | 'minimal' | 'none') {
    await updateStatus({ id: eventId, status })
    if (status === 'none') {
      onClose()
    } else {
      setCompletedStatus(status)
      setPhase('share')
    }
  }

  async function share() {
    const text = completedStatus === 'full'
      ? '我今天做了完整運動！完全制霸 💪'
      : `我今天差點逃避，但我還是做到了：${displayExcuse(event!.excuse, event!.customNote)} 💪`
    if (navigator.share) {
      try { await navigator.share({ text }) } catch { /**/ }
    } else {
      await navigator.clipboard.writeText(text)
      alert('已複製到剪貼板')
    }
  }

  if (phase === 'share') {
    return (
      <div className="flex flex-col px-5 pb-8 font-sans" style={{ minHeight: 440 }}>
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
        <div className="flex-1 flex flex-col items-center justify-center gap-5 animate-fade-up">
          <CatView expression="gentleSmile" size={96} />
          <div className="text-center px-4">
            {completedStatus === 'full' ? (
              <>
                <p className="font-serif text-xl font-semibold text-textPrimary">太棒了！今天完全制霸 💪</p>
                <p className="text-xs text-textSecondary mt-2 font-serif italic">迪教練感到非常非常驕傲。</p>
              </>
            ) : (
              <>
                <p className="font-serif text-xl font-semibold text-textPrimary">差點逃避，<br />但你還是動了 💪</p>
                <p className="text-xs text-textSecondary mt-2 font-serif italic">這就是習慣養成的方式。</p>
              </>
            )}
          </div>
          <div className="w-full space-y-3">
            <button className="btn-primary" onClick={share}>
              {currentUser === 'wife' ? '聯絡老公' : '分享給太太'}
            </button>
            <button className="w-full py-3 text-sm text-textSecondary font-sans" onClick={onClose}>完成</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center px-5 pb-8 font-sans">
      {/* Cat */}
      <div className="flex flex-col items-center gap-3 py-6">
        <div className="cat-portrait w-[108px] h-[108px] animate-fade-up">
          <CatView expression="armsCrossed" size={88} />
        </div>
        <div className="text-center animate-fade-up" style={{ animationDelay: '60ms' }}>
          <p className="font-serif text-lg font-semibold text-textPrimary">
            今天這個「但是」後來怎麼了？
          </p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="font-mono text-[11px] text-accent tracking-wide">{event.context}</span>
            <span className="text-textSecondary/40">·</span>
            <span className="text-sm text-textSecondary">{displayExcuse(event.excuse, event.customNote)}</span>
          </div>
        </div>
      </div>

      <div className="divider-dots w-full mb-5" />

      {/* Outcome buttons */}
      <div className="w-full space-y-2.5 animate-fade-up" style={{ animationDelay: '100ms' }}>
        <OutcomeBtn
          color="green"
          emoji="🟢"
          label="我去了完整運動"
          sublabel="完整運動 · full"
          bg="bg-green/8"
          border="border-green/25"
          onClick={() => close('full')}
        />
        <OutcomeBtn
          color="yellow"
          emoji="🟡"
          label="我做了最小行動"
          sublabel="最小行動 · minimal"
          bg="bg-yellow/8"
          border="border-yellow/25"
          onClick={() => close('minimal')}
        />
        <OutcomeBtn
          color="red"
          emoji="🔴"
          label="我沒去"
          sublabel="沒有行動 · none"
          bg="bg-card"
          border="border-border"
          onClick={() => close('none')}
        />
      </div>
    </div>
  )
}

function OutcomeBtn({
  emoji, label, sublabel, bg, border, onClick,
}: {
  color: string; emoji: string; label: string; sublabel: string
  bg: string; border: string; onClick: () => void
}) {
  return (
    <button
      className={`w-full flex items-center gap-3.5 px-5 py-4 rounded-card border ${bg} ${border} hover:brightness-95 transition-all`}
      onClick={onClick}
    >
      <span className="text-xl">{emoji}</span>
      <div className="text-left">
        <p className="text-sm font-semibold text-textPrimary">{label}</p>
        <p className="font-mono text-[10px] text-textSecondary mt-0.5 tracking-wide">{sublabel}</p>
      </div>
    </button>
  )
}

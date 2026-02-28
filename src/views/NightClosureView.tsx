import { useQuery, useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import type { Id } from '../../convex/_generated/dataModel'
import CatView from '../components/CatView'
import { displayExcuse } from '../theme'
import type { ExcuseEvent } from '../types'

interface Props {
  eventId: Id<'excuseEvents'>
  onClose: () => void
}

export default function NightClosureView({ eventId, onClose }: Props) {
  const updateStatus = useMutation(api.excuseEvents.updateStatus)
  const events = useQuery(api.excuseEvents.listAll) as ExcuseEvent[] | undefined
  const event = events?.find((e: ExcuseEvent) => e._id === eventId)

  if (!event) return null

  async function close(status: string) {
    await updateStatus({ id: eventId, status })
    onClose()
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

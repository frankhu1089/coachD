import { useState } from 'react'
import { useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import type { Id } from '../../convex/_generated/dataModel'
import CatView from '../components/CatView'
import { excuses, autoContext, suggestionsFor } from '../theme'
import type { UserId } from '../App'

interface Props {
  currentUser: UserId
  onClose: () => void
  onCreated: (eventId: Id<'excuseEvents'>) => void
}

export default function CreateExcuseView({ currentUser, onClose, onCreated }: Props) {
  const [context, setContext] = useState(autoContext())
  const [excuse, setExcuse] = useState('疲累一天')
  const [customNote, setCustomNote] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const create = useMutation(api.excuseEvents.create)

  async function submit() {
    if (submitting) return
    setSubmitting(true)
    try {
      const s = suggestionsFor(excuse)
      const suggestedAction = s[Math.floor(Math.random() * s.length)]
      const id = await create({
        timestamp: Date.now(),
        context,
        excuse,
        customNote: excuse === '其他' && customNote.trim() ? customNote.trim() : undefined,
        suggestedAction,
        userId: currentUser,
      })
      onCreated(id)
    } catch (err) {
      console.error('create failed', err)
      alert('出錯了，請再試一次')
      setSubmitting(false)
    }
  }

  return (
    <div className="p-5 space-y-5 pb-8 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <h2 className="font-serif text-[15px] font-semibold text-textPrimary">我該去運動了，但是＿＿</h2>
        <button
          className="text-xs text-textSecondary px-2 py-1 rounded-lg hover:bg-black/5 transition-colors"
          onClick={onClose}
        >取消</button>
      </div>

      {/* Cat */}
      <div className="flex flex-col items-center gap-2.5 py-1">
        <div className="cat-portrait w-24 h-24">
          <CatView expression="sideEye" size={78} />
        </div>
        <p className="font-serif italic text-[13px] text-textSecondary text-center px-6 leading-relaxed">
          「哼，我就知道。說吧，這次又是什麼藉口？」
        </p>
      </div>

      {/* Divider */}
      <div className="divider-dots" />

      {/* Context toggle */}
      <div className="space-y-2.5">
        <span className="label-section">時段</span>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {['下班後', '假日下午'].map(opt => (
            <button
              key={opt}
              className={context === opt ? 'chip-active' : 'chip-inactive'}
              onClick={() => setContext(opt)}
            >{opt}</button>
          ))}
        </div>
      </div>

      {/* Excuse grid */}
      <div className="space-y-2.5">
        <span className="label-section">藉口</span>
        <div className="grid grid-cols-3 gap-2 mt-2">
          {excuses.map(item => (
            <button
              key={item}
              className={`${excuse === item ? 'chip-active' : 'chip-inactive'} relative`}
              onClick={() => setExcuse(item)}
            >
              {item}
              {excuse === item && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-accent shadow-sm" />
              )}
            </button>
          ))}
        </div>
        {excuse === '其他' && (
          <input
            className="w-full bg-card rounded-chip px-3.5 py-3 text-sm text-textPrimary outline-none font-sans"
            style={{ boxShadow: '0 0 0 1.5px #D4956A, 0 2px 8px rgba(212,149,106,0.15)' }}
            placeholder="說說看…"
            value={customNote}
            onChange={e => setCustomNote(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && customNote.trim()) submit() }}
            autoFocus
          />
        )}
      </div>

      {/* Submit */}
      <button
        className="btn-primary"
        style={(excuse === '其他' && !customNote.trim()) || submitting ? { opacity: 0.4, pointerEvents: 'none' } : {}}
        onClick={submit}
      >
        {submitting ? '處理中…' : '下一步 →'}
      </button>
    </div>
  )
}

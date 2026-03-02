import { useState } from 'react'
import { useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import type { Id } from '../../convex/_generated/dataModel'
import CatView from '../components/CatView'
import { workoutPlans, workoutPlanKeys, type WorkoutPlanKey } from '../theme'
import type { UserId } from '../App'
import { shareText } from '../utils'

interface Props {
  currentUser: UserId
  eventId: Id<'excuseEvents'>
  onClose: () => void
}

type Phase = 'pick' | 'plan' | 'share'

export default function WorkoutPlanView({ currentUser, eventId, onClose }: Props) {
  const [phase, setPhase] = useState<Phase>('pick')
  const [picked, setPicked] = useState<WorkoutPlanKey | null>(null)
  const updateStatus = useMutation(api.excuseEvents.updateStatus)

  function pickPlan(key: WorkoutPlanKey | 'random') {
    if (key === 'random') {
      const idx = Math.floor(Math.random() * workoutPlanKeys.length)
      setPicked(workoutPlanKeys[idx])
    } else {
      setPicked(key)
    }
    setPhase('plan')
  }

  async function completePlan() {
    await updateStatus({ id: eventId, status: 'full' })
    setPhase('share')
  }

  const plan = picked ? workoutPlans[picked] : null

  return (
    <div className="flex flex-col px-5 pb-8 font-sans" style={{ minHeight: 440 }}>
      {/* Close */}
      <div className="flex justify-end pt-2 pb-4">
        <button
          className="w-8 h-8 rounded-full flex items-center justify-center text-textSecondary hover:bg-black/5 transition-colors"
          onClick={phase === 'plan' ? () => setPhase('pick') : onClose}
        >
          {phase === 'plan' ? (
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          ) : (
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          )}
        </button>
      </div>

      {phase === 'pick' && (
        <>
          <div className="flex flex-col items-center gap-3 mb-5 animate-fade-up">
            <CatView expression="clipboard" size={72} />
            <p className="font-serif text-lg font-semibold text-textPrimary">今天練什麼？</p>
            <p className="text-xs text-textSecondary font-serif italic">選個部位，迪教練幫你排好。</p>
          </div>

          <div className="grid grid-cols-2 gap-2.5 animate-fade-up" style={{ animationDelay: '60ms' }}>
            {workoutPlanKeys.map(key => {
              const p = workoutPlans[key]
              return (
                <button
                  key={key}
                  className="py-4 rounded-card border border-border bg-card hover:bg-accentSoft/30 transition-colors text-center"
                  onClick={() => pickPlan(key)}
                >
                  <span className="text-2xl block mb-1">{p.emoji}</span>
                  <span className="text-sm font-semibold text-textPrimary">{p.label}</span>
                </button>
              )
            })}
            <button
              className="py-4 rounded-card border border-dashed border-accent/40 bg-accentSoft/10 hover:bg-accentSoft/30 transition-colors text-center col-span-2"
              onClick={() => pickPlan('random')}
            >
              <span className="text-2xl block mb-1">🎲</span>
              <span className="text-sm font-semibold text-accent">還沒想好，幫我選</span>
            </button>
          </div>
        </>
      )}

      {phase === 'plan' && plan && (
        <div className="flex-1 overflow-y-auto animate-fade-up">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-3xl">{plan.emoji}</span>
            <div>
              <p className="font-serif text-xl font-semibold text-textPrimary">{plan.label} 訓練計劃</p>
              <p className="text-xs text-textSecondary font-serif italic">按步驟來，迪教練幫你安排好了。</p>
            </div>
          </div>

          <div className="space-y-4">
            {[plan.warm, plan.main, plan.cool].map(section => (
              <div key={section.title} className="bg-card rounded-card border border-border px-4 py-3">
                <p className="font-mono text-[10px] text-accent tracking-widest mb-2">{section.title.toUpperCase()}</p>
                <ul className="space-y-1.5">
                  {section.items.map(item => (
                    <li key={item} className="flex items-start gap-2 text-sm text-textPrimary">
                      <span className="text-accent mt-0.5">·</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-5 space-y-3">
            <button className="btn-primary" onClick={completePlan}>完成訓練 💪</button>
            <button className="w-full py-3 text-sm text-textSecondary font-sans" onClick={onClose}>先不做了</button>
          </div>
        </div>
      )}

      {phase === 'share' && plan && (
        <div className="flex-1 flex flex-col items-center justify-center gap-5 animate-fade-up">
          <CatView expression="gentleSmile" size={96} />
          <div className="text-center px-4">
            <p className="font-serif text-xl font-semibold text-textPrimary">完整訓練完成！🏆</p>
            <p className="text-xs text-textSecondary mt-2 font-serif italic">迪教練感到非常非常驕傲。</p>
          </div>
          <div className="w-full space-y-3">
            <button
              className="btn-primary"
              onClick={() => shareText(`我今天做了完整的${plan.label}訓練！完全制霸 💪`)}
            >{currentUser === 'wife' ? '聯絡老公' : '分享給太太'}</button>
            <button className="w-full py-3 text-sm text-textSecondary font-sans" onClick={onClose}>完成</button>
          </div>
        </div>
      )}
    </div>
  )
}

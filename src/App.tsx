import { useState, useEffect } from 'react'
import type { Id } from '../convex/_generated/dataModel'
import Modal from './components/Modal'
import HomeView from './views/HomeView'
import CreateExcuseView from './views/CreateExcuseView'
import ActionSuggestionView from './views/ActionSuggestionView'
import NightClosureView from './views/NightClosureView'
import WeeklyReviewView from './views/WeeklyReviewView'
import MonthlyReviewView from './views/MonthlyReviewView'

type ActiveModal =
  | { type: 'none' }
  | { type: 'create' }
  | { type: 'action'; eventId: Id<'excuseEvents'> }
  | { type: 'nightClosure'; eventId: Id<'excuseEvents'> }
  | { type: 'weekly' }
  | { type: 'monthly' }

function getWeekOfYear(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
}

export default function App() {
  const [modal, setModal] = useState<ActiveModal>({ type: 'none' })

  useEffect(() => {
    const day = new Date().getDay()
    if (day !== 0) return
    const thisWeek = getWeekOfYear(new Date())
    const shown = parseInt(localStorage.getItem('lastWeeklyReviewWeek') ?? '0', 10)
    if (shown !== thisWeek) {
      setModal({ type: 'weekly' })
      localStorage.setItem('lastWeeklyReviewWeek', String(thisWeek))
    }
  }, [])

  function closeModal() {
    setModal({ type: 'none' })
  }

  return (
    <div className="min-h-screen bg-bg">
      <HomeView
        onAddExcuse={() => setModal({ type: 'create' })}
        onNightClosure={(id) => setModal({ type: 'nightClosure', eventId: id })}
        onWeekly={() => setModal({ type: 'weekly' })}
        onMonthly={() => setModal({ type: 'monthly' })}
      />

      {modal.type === 'create' && (
        <Modal onClose={closeModal}>
          <CreateExcuseView
            onClose={closeModal}
            onCreated={(id) => setModal({ type: 'action', eventId: id })}
          />
        </Modal>
      )}

      {modal.type === 'action' && (
        <Modal onClose={closeModal}>
          <ActionSuggestionView eventId={modal.eventId} onClose={closeModal} />
        </Modal>
      )}

      {modal.type === 'nightClosure' && (
        <Modal onClose={closeModal}>
          <NightClosureView eventId={modal.eventId} onClose={closeModal} />
        </Modal>
      )}

      {modal.type === 'weekly' && (
        <Modal onClose={closeModal}>
          <WeeklyReviewView onClose={closeModal} />
        </Modal>
      )}

      {modal.type === 'monthly' && (
        <Modal onClose={closeModal}>
          <MonthlyReviewView onClose={closeModal} />
        </Modal>
      )}
    </div>
  )
}

import { useEffect } from 'react'

interface Props {
  onClose?: () => void
  children: React.ReactNode
}

export default function Modal({ onClose, children }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/25 backdrop-blur-[3px] animate-fade-in"
        onClick={onClose}
      />
      {/* Sheet */}
      <div className="relative z-10 w-full max-w-md bg-bg rounded-t-[28px] sm:rounded-[28px] max-h-[92vh] overflow-y-auto animate-slide-up"
        style={{ boxShadow: '0 -4px 40px rgba(44, 26, 14, 0.12), 0 0 0 1px rgba(44,26,14,0.06)' }}
      >
        {/* Drag handle */}
        <div className="sticky top-0 flex justify-center pt-3 pb-0 bg-bg">
          <div className="w-9 h-[3.5px] rounded-full bg-black/10" />
        </div>
        {children}
      </div>
    </div>
  )
}

import type { UserId } from '../../App'

interface Props {
  currentUser: UserId
  onSwitchUser: (user: UserId) => void
  onWeekly: () => void
  onMonthly: () => void
  notifEnabled: boolean
  onToggleReminder: () => void
  menuOpen: boolean
  onMenuToggle: () => void
  onMenuClose: () => void
}

export default function HomeTopBar({
  currentUser, onSwitchUser, onWeekly, onMonthly,
  notifEnabled, onToggleReminder, menuOpen, onMenuToggle, onMenuClose,
}: Props) {
  return (
    <div className="flex justify-between items-center px-5 pt-6 pb-2">
      <span className="font-serif text-sm font-semibold text-accent tracking-wide">迪教練</span>
      <div className="flex items-center gap-2">
        <div className="flex rounded-full border border-border overflow-hidden text-xs font-medium">
          <button
            className={`px-3 py-1 transition-colors ${currentUser === 'husband' ? 'bg-accent text-white' : 'text-textSecondary hover:bg-accentSoft/40'}`}
            onClick={() => onSwitchUser('husband')}
          >我</button>
          <button
            className={`px-3 py-1 transition-colors ${currentUser === 'wife' ? 'bg-accent text-white' : 'text-textSecondary hover:bg-accentSoft/40'}`}
            onClick={() => onSwitchUser('wife')}
          >老婆</button>
        </div>
        <div className="relative">
          <button
            className="w-8 h-8 rounded-full flex items-center justify-center text-textSecondary hover:bg-accentSoft transition-colors"
            onClick={onMenuToggle}
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <circle cx="12" cy="5" r="1.2" fill="currentColor" />
              <circle cx="12" cy="12" r="1.2" fill="currentColor" />
              <circle cx="12" cy="19" r="1.2" fill="currentColor" />
            </svg>
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={onMenuClose} />
              <div className="absolute right-0 top-9 z-20 card min-w-[120px] py-1 border border-border">
                <button
                  className="block w-full text-left px-4 py-2.5 text-sm text-textPrimary hover:bg-accentSoft/40 transition-colors font-sans"
                  onClick={() => { onMenuClose(); onWeekly() }}
                >本週回顧</button>
                <button
                  className="block w-full text-left px-4 py-2.5 text-sm text-textPrimary hover:bg-accentSoft/40 transition-colors font-sans"
                  onClick={() => { onMenuClose(); onMonthly() }}
                >本月總覽</button>
                <div className="border-t border-border/50 my-1" />
                <button
                  className="flex w-full text-left px-4 py-2.5 text-sm text-textPrimary hover:bg-accentSoft/40 transition-colors font-sans items-center gap-2"
                  onClick={onToggleReminder}
                >
                  <span>{notifEnabled ? '🔔' : '🔕'}</span>
                  <span>{notifEnabled ? '關閉提醒' : '開啟提醒'}</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

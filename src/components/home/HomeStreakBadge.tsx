import { STREAK_THRESHOLD } from '../../constants'

interface Props { streak: number }

export default function HomeStreakBadge({ streak }: Props) {
  if (streak < STREAK_THRESHOLD) return null
  return (
    <div
      className="flex items-center gap-2.5 px-4 py-3 rounded-card border border-accent/20 bg-accentSoft/30 animate-fade-up"
      style={{ animationDelay: '160ms' }}
    >
      <span className="text-lg">🔥</span>
      <span className="font-serif text-sm font-semibold text-accent">連續 {streak} 天行動</span>
    </div>
  )
}

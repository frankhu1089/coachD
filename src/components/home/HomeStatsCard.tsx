interface Props {
  todayAvoidance: number
  todayAction: number
  todayRate: number
}

function StatCol({ label, value, unit, color }: { label: string; value: number; unit: string; color: string }) {
  return (
    <div className="flex flex-col items-center py-4 px-2">
      <div className="flex items-baseline gap-0.5">
        <span className={`stat-num text-[26px] leading-none ${color}`}>{value}</span>
        <span className={`font-mono text-xs ${color} opacity-70 ml-0.5`}>{unit}</span>
      </div>
      <span className="label-section mt-1.5">{label}</span>
    </div>
  )
}

export default function HomeStatsCard({ todayAvoidance, todayAction, todayRate }: Props) {
  return (
    <div className="card animate-fade-up" style={{ animationDelay: '120ms' }}>
      <div className="grid grid-cols-3 divide-x divide-border">
        <StatCol label="今日逃避" value={todayAvoidance} unit="次" color="text-red" />
        <StatCol label="已行動" value={todayAction} unit="次" color="text-green" />
        <StatCol label="轉化率" value={todayRate} unit="%" color="text-accent" />
      </div>
    </div>
  )
}

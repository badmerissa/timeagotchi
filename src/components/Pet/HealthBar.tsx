interface Props {
  healthPct: number
}

export function HealthBar({ healthPct }: Props) {
  const color =
    healthPct >= 65
      ? 'bg-tama-green'
      : healthPct >= 35
        ? 'bg-tama-yellow'
        : 'bg-tama-red'

  const blocks = 10
  const filled = Math.round((healthPct / 100) * blocks)

  return (
    <div className="w-full">
      <div className="flex justify-between mb-1 text-xs" style={{ fontSize: '8px' }}>
        <span className="text-gray-400">HP</span>
        <span className={healthPct >= 65 ? 'text-tama-green' : healthPct >= 35 ? 'text-tama-yellow' : 'text-tama-red'}>
          {healthPct}%
        </span>
      </div>
      <div className="flex gap-0.5">
        {Array.from({ length: blocks }).map((_, i) => (
          <div
            key={i}
            className={`h-3 flex-1 border border-tama-border transition-all duration-300 ${
              i < filled ? color : 'bg-tama-screen'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

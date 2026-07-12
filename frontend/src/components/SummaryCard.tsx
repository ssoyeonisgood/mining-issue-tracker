interface SummaryCardProps {
  label: string
  value: string | number
  hint?: string
  accent?: 'default' | 'warning' | 'critical' | 'success'
  delayClass?: string
}

const accentClasses = {
  default: 'metric-card--default',
  warning: 'metric-card--warning',
  critical: 'metric-card--critical',
  success: 'metric-card--success',
}

export default function SummaryCard({
  label,
  value,
  hint,
  accent = 'default',
  delayClass = '',
}: SummaryCardProps) {
  return (
    <div className={`metric-card animate-metric ${accentClasses[accent]} ${delayClass}`}>
      <p className="text-[0.625rem] font-semibold uppercase tracking-[0.08em] text-[var(--color-muted)]">
        {label}
      </p>
      <p className="font-mono-data mt-2 text-2xl font-semibold tracking-tight text-[var(--color-navy)]">
        {value}
      </p>
      {hint ? <p className="mt-1 text-xs text-[var(--color-muted)]">{hint}</p> : null}
    </div>
  )
}

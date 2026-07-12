interface SummaryCardProps {
  label: string
  value: string | number
  hint?: string
  accent?: 'default' | 'warning' | 'success'
}

const accents = {
  default: 'border-slate-200 bg-white',
  warning: 'border-amber-200 bg-amber-50',
  success: 'border-emerald-200 bg-emerald-50',
}

export default function SummaryCard({
  label,
  value,
  hint,
  accent = 'default',
}: SummaryCardProps) {
  return (
    <div className={`rounded-xl border p-5 shadow-sm ${accents[accent]}`}>
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
        {value}
      </p>
      {hint ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}
    </div>
  )
}

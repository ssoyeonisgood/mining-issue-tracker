import type { IssuePriority } from '../types/issue'
import { priorityLabels } from '../utils/labels'

const styles: Record<IssuePriority, string> = {
  0: 'bg-slate-100 text-slate-700 ring-slate-200',
  1: 'bg-amber-50 text-amber-800 ring-amber-200',
  2: 'bg-red-50 text-red-700 ring-red-200',
}

export default function PriorityBadge({ priority }: { priority: IssuePriority }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${styles[priority]}`}
    >
      {priorityLabels[priority]}
    </span>
  )
}

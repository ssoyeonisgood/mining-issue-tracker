import type { IssueStatus } from '../types/issue'
import { statusLabels } from '../utils/labels'

const styles: Record<IssueStatus, string> = {
  0: 'bg-blue-50 text-blue-700 ring-blue-200',
  1: 'bg-amber-50 text-amber-800 ring-amber-200',
  2: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
}

export default function StatusBadge({ status }: { status: IssueStatus }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${styles[status]}`}
    >
      {statusLabels[status]}
    </span>
  )
}

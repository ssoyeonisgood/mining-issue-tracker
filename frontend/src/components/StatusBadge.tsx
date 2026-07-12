import type { IssueStatus } from '../types/issue'
import { statusLabels } from '../utils/labels'

const styles: Record<IssueStatus, string> = {
  0: 'badge-open',
  1: 'badge-progress',
  2: 'badge-resolved',
}

export default function StatusBadge({ status }: { status: IssueStatus }) {
  return <span className={`badge ${styles[status]}`}>{statusLabels[status]}</span>
}

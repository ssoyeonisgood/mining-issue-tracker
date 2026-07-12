import type { IssuePriority } from '../types/issue'
import { priorityLabels } from '../utils/labels'

const styles: Record<IssuePriority, string> = {
  0: 'badge-priority-low',
  1: 'badge-priority-medium',
  2: 'badge-priority-high',
}

export default function PriorityBadge({ priority }: { priority: IssuePriority }) {
  return <span className={`badge ${styles[priority]}`}>{priorityLabels[priority]}</span>
}

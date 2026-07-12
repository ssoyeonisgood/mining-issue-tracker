import { IssuePriority, IssueStatus } from '../types/issue'

export const statusLabels: Record<IssueStatus, string> = {
  [IssueStatus.Open]: 'Open',
  [IssueStatus.InProgress]: 'In Progress',
  [IssueStatus.Resolved]: 'Resolved',
}

export const priorityLabels: Record<IssuePriority, string> = {
  [IssuePriority.Low]: 'Low',
  [IssuePriority.Medium]: 'Medium',
  [IssuePriority.High]: 'High',
}

export function formatDate(value: string): string {
  return new Date(value).toLocaleString('en-AU', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

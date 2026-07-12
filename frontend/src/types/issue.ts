export const IssueStatus = {
  Open: 0,
  InProgress: 1,
  Resolved: 2,
} as const

export type IssueStatus = (typeof IssueStatus)[keyof typeof IssueStatus]

export const IssuePriority = {
  Low: 0,
  Medium: 1,
  High: 2,
} as const

export type IssuePriority = (typeof IssuePriority)[keyof typeof IssuePriority]

export interface Site {
  id: number
  name: string
  location?: string | null
}

export interface Equipment {
  id: number
  name: string
  type?: string | null
  siteId: number
}

export interface Issue {
  id: number
  title: string
  description: string
  category: string
  priority: IssuePriority
  status: IssueStatus
  siteId: number
  equipmentId?: number | null
  assignedTo?: string | null
  createdAt: string
  resolvedAt?: string | null
  site?: Site | null
  equipment?: Equipment | null
}

export interface CreateIssueRequest {
  title: string
  description: string
  category: string
  priority: IssuePriority
  siteId: number
  equipmentId?: number | null
  assignedTo?: string | null
}

export interface DashboardSummary {
  openIssues: number
  inProgressIssues: number
  highPriorityIssues: number
  averageResolutionHours: number
}

export interface IssueFilters {
  status?: IssueStatus
  priority?: IssuePriority
  siteId?: number
}

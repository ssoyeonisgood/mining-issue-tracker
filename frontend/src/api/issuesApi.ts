import api from './client'
import type {
  CreateIssueRequest,
  DashboardSummary,
  Issue,
  IssueFilters,
  IssueStatus,
} from '../types/issue'

export async function getIssues(filters: IssueFilters = {}): Promise<Issue[]> {
  const { data } = await api.get<Issue[]>('/api/issues', { params: filters })
  return data
}

export async function getIssue(id: number): Promise<Issue> {
  const { data } = await api.get<Issue>(`/api/issues/${id}`)
  return data
}

export async function createIssue(request: CreateIssueRequest): Promise<Issue> {
  const { data } = await api.post<Issue>('/api/issues', request)
  return data
}

export async function updateIssueStatus(
  id: number,
  status: IssueStatus,
): Promise<Issue> {
  const { data } = await api.patch<Issue>(`/api/issues/${id}/status`, { status })
  return data
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const { data } = await api.get<DashboardSummary>('/api/dashboard/summary')
  return data
}

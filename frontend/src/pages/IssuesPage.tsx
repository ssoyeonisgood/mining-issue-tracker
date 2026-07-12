import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getIssues } from '../api/issuesApi'
import { getSites } from '../api/sitesApi'
import PriorityBadge from '../components/PriorityBadge'
import StatusBadge from '../components/StatusBadge'
import Alert from '../components/ui/Alert'
import LoadingState from '../components/ui/LoadingState'
import PageHeader from '../components/ui/PageHeader'
import {
  IssuePriority,
  IssueStatus,
  type Issue,
  type Site,
} from '../types/issue'
import { formatDate } from '../utils/labels'

export default function IssuesPage() {
  const navigate = useNavigate()
  const [issues, setIssues] = useState<Issue[]>([])
  const [sites, setSites] = useState<Site[]>([])
  const [status, setStatus] = useState<string>('')
  const [priority, setPriority] = useState<string>('')
  const [siteId, setSiteId] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadSites() {
      try {
        const data = await getSites()
        setSites(data)
      } catch {
        setError('Could not load sites.')
      }
    }

    loadSites()
  }, [])

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const data = await getIssues({
          status: status === '' ? undefined : Number(status) as IssueStatus,
          priority: priority === '' ? undefined : Number(priority) as IssuePriority,
          siteId: siteId === '' ? undefined : Number(siteId),
        })
        setIssues(data)
      } catch {
        setError('Could not load issues.')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [status, priority, siteId])

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Issue Management"
        title="Issues"
        description="Track and filter operational issues across all sites."
        action={
          <Link to="/issues/new" className="btn btn-primary">
            Log New Issue
          </Link>
        }
      />

      <div className="panel animate-panel delay-1 grid gap-4 p-4 sm:grid-cols-3">
        <label>
          <span className="field-label">Status</span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="field-input"
          >
            <option value="">All</option>
            <option value={IssueStatus.Open}>Open</option>
            <option value={IssueStatus.InProgress}>In Progress</option>
            <option value={IssueStatus.Resolved}>Resolved</option>
          </select>
        </label>
        <label>
          <span className="field-label">Priority</span>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="field-input"
          >
            <option value="">All</option>
            <option value={IssuePriority.Low}>Low</option>
            <option value={IssuePriority.Medium}>Medium</option>
            <option value={IssuePriority.High}>High</option>
          </select>
        </label>
        <label>
          <span className="field-label">Site</span>
          <select
            value={siteId}
            onChange={(e) => setSiteId(e.target.value)}
            className="field-input"
          >
            <option value="">All</option>
            {sites.map((site) => (
              <option key={site.id} value={site.id}>
                {site.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {loading ? (
        <LoadingState message="Loading issues..." />
      ) : error ? (
        <Alert>{error}</Alert>
      ) : issues.length === 0 ? (
        <Alert variant="empty">No issues match the selected filters.</Alert>
      ) : (
        <div className="panel animate-panel delay-2 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-[var(--color-border-subtle)] bg-[var(--color-elevated)]">
                  <th className="table-head px-4 py-2.5 text-left">
                    Issue
                  </th>
                  <th className="table-head px-4 py-2.5 text-left">
                    Site
                  </th>
                  <th className="table-head px-4 py-2.5 text-left">
                    Priority
                  </th>
                  <th className="table-head px-4 py-2.5 text-left">
                    Status
                  </th>
                  <th className="hidden table-head px-4 py-2.5 text-left sm:table-cell">
                    Created
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
              {issues.map((issue, index) => (
                <tr
                  key={issue.id}
                  onClick={() => navigate(`/issues/${issue.id}`)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      navigate(`/issues/${issue.id}`)
                    }
                  }}
                  tabIndex={0}
                  role="link"
                  aria-label={`View issue: ${issue.title}`}
                  className="table-row animate-row"
                  style={{ animationDelay: `${0.28 + index * 0.05}s` }}
                >
                    <td className="px-4 py-3.5">
                      <p className="font-medium text-[var(--color-text)]">{issue.title}</p>
                      <p className="mt-0.5 text-sm text-[var(--color-muted)]">{issue.category}</p>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-[var(--color-muted)]">
                      {issue.site?.name ?? `Site ${issue.siteId}`}
                    </td>
                    <td className="px-4 py-3.5">
                      <PriorityBadge priority={issue.priority} />
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={issue.status} />
                    </td>
                    <td className="hidden px-4 py-3.5 font-mono-data text-xs text-[var(--color-muted)] sm:table-cell">
                      {formatDate(issue.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

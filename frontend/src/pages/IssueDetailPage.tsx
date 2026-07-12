import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getIssue, updateIssueStatus } from '../api/issuesApi'
import PriorityBadge from '../components/PriorityBadge'
import StatusBadge from '../components/StatusBadge'
import Alert from '../components/ui/Alert'
import LoadingState from '../components/ui/LoadingState'
import { IssueStatus, type Issue } from '../types/issue'
import { formatDate, statusLabels } from '../utils/labels'

export default function IssueDetailPage() {
  const { id } = useParams()
  const issueId = Number(id)
  const [issue, setIssue] = useState<Issue | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const data = await getIssue(issueId)
        setIssue(data)
      } catch {
        setError('Issue not found.')
      } finally {
        setLoading(false)
      }
    }

    if (!Number.isNaN(issueId)) {
      load()
    } else {
      setError('Invalid issue id.')
      setLoading(false)
    }
  }, [issueId])

  async function handleStatusChange(nextStatus: IssueStatus) {
    if (!issue) return
    setUpdating(true)
    try {
      const updated = await updateIssueStatus(issue.id, nextStatus)
      setIssue((current) => (current ? { ...current, ...updated } : current))
    } catch {
      setError('Could not update issue status.')
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return <LoadingState message="Loading issue..." />
  }

  if (error || !issue) {
    return (
      <div className="space-y-4">
        <Alert>{error ?? 'Issue unavailable'}</Alert>
        <Link to="/issues" className="link-accent">
          ← Back to issues
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link to="/issues" className="link-accent animate-fade inline-flex items-center gap-1">
        ← Back to issues
      </Link>

      <article className="panel animate-panel delay-1 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="page-eyebrow">Issue #{issue.id}</p>
            <h2 className="page-title mt-1">{issue.title}</h2>
          </div>
          <div className="flex gap-2">
            <PriorityBadge priority={issue.priority} />
            <StatusBadge status={issue.status} />
          </div>
        </div>

        <dl className="detail-dl mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <dt>Category</dt>
            <dd>{issue.category}</dd>
          </div>
          <div>
            <dt>Site</dt>
            <dd>{issue.site?.name ?? `Site ${issue.siteId}`}</dd>
          </div>
          <div>
            <dt>Equipment</dt>
            <dd>{issue.equipment?.name ?? 'Not specified'}</dd>
          </div>
          <div>
            <dt>Assigned To</dt>
            <dd>{issue.assignedTo ?? 'Unassigned'}</dd>
          </div>
          <div>
            <dt>Created</dt>
            <dd className="font-mono-data text-sm">{formatDate(issue.createdAt)}</dd>
          </div>
          <div>
            <dt>Resolved</dt>
            <dd className="font-mono-data text-sm">
              {issue.resolvedAt ? formatDate(issue.resolvedAt) : '—'}
            </dd>
          </div>
        </dl>

        <div className="mt-6 border-t border-[var(--color-border)] pt-6">
          <h3 className="field-label">Description</h3>
          <p className="mt-2 whitespace-pre-wrap leading-relaxed text-[var(--color-text)]">
            {issue.description}
          </p>
        </div>
      </article>

      <section className="panel animate-panel delay-2 p-6">
        <h3 className="section-title">Update Status</h3>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          Current status:{' '}
          <span className="font-medium text-[var(--color-text)]">
            {statusLabels[issue.status]}
          </span>
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {[IssueStatus.Open, IssueStatus.InProgress, IssueStatus.Resolved].map((status) => (
            <button
              key={status}
              type="button"
              disabled={updating || issue.status === status}
              onClick={() => handleStatusChange(status)}
              className={`status-btn ${issue.status === status ? 'status-btn--active' : ''}`}
            >
              Mark {statusLabels[status]}
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}

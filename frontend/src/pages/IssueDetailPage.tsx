import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getIssue, updateIssueStatus } from '../api/issuesApi'
import PriorityBadge from '../components/PriorityBadge'
import StatusBadge from '../components/StatusBadge'
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
    return <p className="text-slate-600">Loading issue...</p>
  }

  if (error || !issue) {
    return (
      <div className="space-y-4">
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          {error ?? 'Issue unavailable'}
        </div>
        <Link to="/issues" className="text-sm font-medium text-amber-700 hover:text-amber-800">
          Back to issues
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link to="/issues" className="text-sm font-medium text-amber-700 hover:text-amber-800">
        ← Back to issues
      </Link>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Issue #{issue.id}</p>
            <h2 className="mt-1 text-2xl font-semibold text-slate-900">{issue.title}</h2>
          </div>
          <div className="flex gap-2">
            <PriorityBadge priority={issue.priority} />
            <StatusBadge status={issue.status} />
          </div>
        </div>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-slate-500">Category</dt>
            <dd className="mt-1 text-slate-900">{issue.category}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-slate-500">Site</dt>
            <dd className="mt-1 text-slate-900">
              {issue.site?.name ?? `Site ${issue.siteId}`}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-slate-500">Equipment</dt>
            <dd className="mt-1 text-slate-900">
              {issue.equipment?.name ?? 'Not specified'}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-slate-500">Assigned To</dt>
            <dd className="mt-1 text-slate-900">{issue.assignedTo ?? 'Unassigned'}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-slate-500">Created</dt>
            <dd className="mt-1 text-slate-900">{formatDate(issue.createdAt)}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-slate-500">Resolved</dt>
            <dd className="mt-1 text-slate-900">
              {issue.resolvedAt ? formatDate(issue.resolvedAt) : '—'}
            </dd>
          </div>
        </dl>

        <div className="mt-6">
          <h3 className="text-sm font-medium text-slate-500">Description</h3>
          <p className="mt-2 whitespace-pre-wrap text-slate-800">{issue.description}</p>
        </div>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="font-semibold text-slate-900">Update Status</h3>
        <p className="mt-1 text-sm text-slate-600">
          Current status: {statusLabels[issue.status]}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {[IssueStatus.Open, IssueStatus.InProgress, IssueStatus.Resolved].map((status) => (
            <button
              key={status}
              type="button"
              disabled={updating || issue.status === status}
              onClick={() => handleStatusChange(status)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Mark {statusLabels[status]}
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getIssues } from '../api/issuesApi'
import PriorityBadge from '../components/PriorityBadge'
import StatusBadge from '../components/StatusBadge'
import { SITES } from '../constants/sites'
import {
  IssuePriority,
  IssueStatus,
  type Issue,
} from '../types/issue'
import { formatDate } from '../utils/labels'

export default function IssuesPage() {
  const [issues, setIssues] = useState<Issue[]>([])
  const [status, setStatus] = useState<string>('')
  const [priority, setPriority] = useState<string>('')
  const [siteId, setSiteId] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Issues</h2>
          <p className="mt-1 text-slate-600">Track and filter operational issues.</p>
        </div>
        <Link
          to="/issues/new"
          className="inline-flex items-center justify-center rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600"
        >
          Log New Issue
        </Link>
      </div>

      <div className="grid gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-3">
        <label className="text-sm">
          <span className="mb-1 block font-medium text-slate-700">Status</span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          >
            <option value="">All</option>
            <option value={IssueStatus.Open}>Open</option>
            <option value={IssueStatus.InProgress}>In Progress</option>
            <option value={IssueStatus.Resolved}>Resolved</option>
          </select>
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-medium text-slate-700">Priority</span>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          >
            <option value="">All</option>
            <option value={IssuePriority.Low}>Low</option>
            <option value={IssuePriority.Medium}>Medium</option>
            <option value={IssuePriority.High}>High</option>
          </select>
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-medium text-slate-700">Site</span>
          <select
            value={siteId}
            onChange={(e) => setSiteId(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
          >
            <option value="">All</option>
            {SITES.map((site) => (
              <option key={site.id} value={site.id}>
                {site.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {loading ? (
        <p className="text-slate-600">Loading issues...</p>
      ) : error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      ) : issues.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
          No issues match the selected filters.
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Issue
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Site
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Priority
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Created
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {issues.map((issue) => (
                <tr key={issue.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <Link
                      to={`/issues/${issue.id}`}
                      className="font-medium text-slate-900 hover:text-amber-700"
                    >
                      {issue.title}
                    </Link>
                    <p className="text-sm text-slate-500">{issue.category}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {issue.site?.name ?? `Site ${issue.siteId}`}
                  </td>
                  <td className="px-4 py-3">
                    <PriorityBadge priority={issue.priority} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={issue.status} />
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">
                    {formatDate(issue.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

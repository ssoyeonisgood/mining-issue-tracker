import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getDashboardSummary, getIssues } from '../api/issuesApi'
import SummaryCard from '../components/SummaryCard'
import PriorityBadge from '../components/PriorityBadge'
import StatusBadge from '../components/StatusBadge'
import type { DashboardSummary, Issue } from '../types/issue'
import { formatDate } from '../utils/labels'

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [recentIssues, setRecentIssues] = useState<Issue[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [summaryData, issues] = await Promise.all([
          getDashboardSummary(),
          getIssues(),
        ])
        setSummary(summaryData)
        setRecentIssues(issues.slice(0, 5))
      } catch {
        setError('Could not load dashboard data. Is the API running on port 5253?')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  if (loading) {
    return <p className="text-slate-600">Loading dashboard...</p>
  }

  if (error || !summary) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
        {error ?? 'Dashboard unavailable'}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Executive Summary</h2>
        <p className="mt-1 text-slate-600">
          Operational issue overview across mining sites.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard label="Open Issues" value={summary.openIssues} />
        <SummaryCard
          label="In Progress"
          value={summary.inProgressIssues}
          accent="warning"
        />
        <SummaryCard
          label="High Priority"
          value={summary.highPriorityIssues}
          accent="warning"
        />
        <SummaryCard
          label="Avg Resolution"
          value={`${summary.averageResolutionHours}h`}
          hint="Resolved issues only"
          accent="success"
        />
      </div>

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h3 className="font-semibold text-slate-900">Recent Issues</h3>
          <Link
            to="/issues"
            className="text-sm font-medium text-amber-700 hover:text-amber-800"
          >
            View all
          </Link>
        </div>
        {recentIssues.length === 0 ? (
          <p className="px-5 py-8 text-sm text-slate-500">No issues logged yet.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {recentIssues.map((issue) => (
              <li key={issue.id}>
                <Link
                  to={`/issues/${issue.id}`}
                  className="flex flex-col gap-2 px-5 py-4 transition-colors hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium text-slate-900">{issue.title}</p>
                    <p className="text-sm text-slate-500">
                      {issue.site?.name ?? `Site ${issue.siteId}`} · {formatDate(issue.createdAt)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <PriorityBadge priority={issue.priority} />
                    <StatusBadge status={issue.status} />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

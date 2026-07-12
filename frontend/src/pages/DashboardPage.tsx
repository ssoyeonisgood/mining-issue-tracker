import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getDashboardSummary, getIssues } from '../api/issuesApi'
import SummaryCard from '../components/SummaryCard'
import PriorityBadge from '../components/PriorityBadge'
import StatusBadge from '../components/StatusBadge'
import Alert from '../components/ui/Alert'
import LoadingState from '../components/ui/LoadingState'
import PageHeader from '../components/ui/PageHeader'
import type { DashboardSummary, Issue } from '../types/issue'
import { formatDate } from '../utils/labels'

export default function DashboardPage() {
  const navigate = useNavigate()
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
    return <LoadingState message="Loading dashboard..." />
  }

  if (error || !summary) {
    return <Alert>{error ?? 'Dashboard unavailable'}</Alert>
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Operations Dashboard"
        title="Executive Summary"
        description="Operational issue overview across mining sites."
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard label="Open Issues" value={summary.openIssues} delayClass="delay-1" />
        <SummaryCard
          label="In Progress"
          value={summary.inProgressIssues}
          accent="warning"
          delayClass="delay-2"
        />
        <SummaryCard
          label="High Priority"
          value={summary.highPriorityIssues}
          accent="critical"
          delayClass="delay-3"
        />
        <SummaryCard
          label="Avg Resolution"
          value={`${summary.averageResolutionHours}h`}
          hint="Resolved issues only"
          accent="success"
          delayClass="delay-4"
        />
      </div>

      <section className="panel animate-panel delay-5">
        <div className="panel-header">
          <h3 className="section-title">Recent Issues</h3>
          <Link to="/issues" className="link-accent">
            View all
          </Link>
        </div>
        {recentIssues.length === 0 ? (
          <p className="px-5 py-8 text-sm text-[var(--color-muted)]">No issues logged yet.</p>
        ) : (
          <ul className="divide-y divide-[var(--color-border)]">
            {recentIssues.map((issue, index) => (
              <li key={issue.id}>
                <button
                  type="button"
                  onClick={() => navigate(`/issues/${issue.id}`)}
                  className="list-row animate-row w-full cursor-pointer border-0 bg-transparent text-left"
                  style={{ animationDelay: `${0.45 + index * 0.07}s` }}
                >
                  <div>
                    <p className="font-medium text-[var(--color-text)]">{issue.title}</p>
                    <p className="mt-0.5 text-sm text-[var(--color-muted)]">
                      {issue.site?.name ?? `Site ${issue.siteId}`} ·{' '}
                      <span className="font-mono-data text-xs">{formatDate(issue.createdAt)}</span>
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <PriorityBadge priority={issue.priority} />
                    <StatusBadge status={issue.status} />
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

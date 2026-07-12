import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { createIssue } from '../api/issuesApi'
import { getEquipment, getSites } from '../api/sitesApi'
import Alert from '../components/ui/Alert'
import LoadingState from '../components/ui/LoadingState'
import PageHeader from '../components/ui/PageHeader'
import { CATEGORIES } from '../constants/sites'
import { IssuePriority, type CreateIssueRequest, type Equipment, type Site } from '../types/issue'

export default function NewIssuePage() {
  const navigate = useNavigate()
  const [sites, setSites] = useState<Site[]>([])
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [siteId, setSiteId] = useState<number | null>(null)
  const [equipmentId, setEquipmentId] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    async function loadSites() {
      try {
        const data = await getSites()
        setSites(data)
        setSiteId(data[0]?.id ?? null)
      } catch {
        setError('Could not load sites. Is the API running on port 5253?')
      } finally {
        setLoading(false)
      }
    }

    loadSites()
  }, [])

  useEffect(() => {
    if (siteId === null) {
      setEquipment([])
      return
    }

    const selectedSiteId = siteId

    async function loadEquipment() {
      try {
        const data = await getEquipment(selectedSiteId)
        setEquipment(data)
      } catch {
        setError('Could not load equipment for the selected site.')
      }
    }

    loadEquipment()
  }, [siteId])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    setError(null)

    const form = new FormData(event.currentTarget)
    const request: CreateIssueRequest = {
      title: String(form.get('title') ?? ''),
      description: String(form.get('description') ?? ''),
      category: String(form.get('category') ?? ''),
      priority: Number(form.get('priority')) as IssuePriority,
      siteId: siteId!,
      equipmentId: equipmentId === '' ? null : Number(equipmentId),
      assignedTo: String(form.get('assignedTo') ?? '') || null,
    }

    try {
      const issue = await createIssue(request)
      navigate(`/issues/${issue.id}`)
    } catch {
      setError('Could not create issue. Check the form values and API connection.')
      setSubmitting(false)
    }
  }

  if (loading) {
    return <LoadingState message="Loading form..." />
  }

  if (sites.length === 0) {
    return <Alert>{error ?? 'No sites available. Check the API connection.'}</Alert>
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader
        eyebrow="Issue Management"
        title="Log New Issue"
        description="Record an equipment failure, safety concern, or maintenance request."
      />

      <form onSubmit={handleSubmit} className="panel animate-panel delay-1 space-y-5 p-6">
        <label className="block">
          <span className="field-label">Title</span>
          <input
            name="title"
            required
            className="field-input"
            placeholder="Crusher failure on shift B"
          />
        </label>

        <label className="block">
          <span className="field-label">Description</span>
          <textarea
            name="description"
            required
            rows={4}
            className="field-input resize-y"
            placeholder="Describe what happened and any immediate impact."
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="field-label">Category</span>
            <select name="category" required className="field-input" defaultValue={CATEGORIES[0]}>
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="field-label">Priority</span>
            <select
              name="priority"
              required
              className="field-input"
              defaultValue={IssuePriority.Medium}
            >
              <option value={IssuePriority.Low}>Low</option>
              <option value={IssuePriority.Medium}>Medium</option>
              <option value={IssuePriority.High}>High</option>
            </select>
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="field-label">Site</span>
            <select
              value={siteId ?? ''}
              onChange={(e) => {
                setSiteId(Number(e.target.value))
                setEquipmentId('')
              }}
              className="field-input"
            >
              {sites.map((site) => (
                <option key={site.id} value={site.id}>
                  {site.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="field-label">Equipment</span>
            <select
              value={equipmentId}
              onChange={(e) => setEquipmentId(e.target.value)}
              className="field-input"
            >
              <option value="">None</option>
              {equipment.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="block">
          <span className="field-label">Assigned To</span>
          <input name="assignedTo" className="field-input" placeholder="John Smith" />
        </label>

        {error ? <Alert>{error}</Alert> : null}

        <button
          type="submit"
          disabled={submitting || siteId === null}
          className="btn btn-primary w-full sm:w-auto"
        >
          {submitting ? 'Submitting...' : 'Create Issue'}
        </button>
      </form>
    </div>
  )
}

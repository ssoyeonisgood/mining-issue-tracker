import { useMemo, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { createIssue } from '../api/issuesApi'
import { CATEGORIES, EQUIPMENT, SITES } from '../constants/sites'
import { IssuePriority, type CreateIssueRequest } from '../types/issue'

const inputClass =
  'w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200'

export default function NewIssuePage() {
  const navigate = useNavigate()
  const [siteId, setSiteId] = useState<number>(1)
  const [equipmentId, setEquipmentId] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const equipmentOptions = useMemo(
    () => EQUIPMENT.filter((item) => item.siteId === siteId),
    [siteId],
  )

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
      siteId,
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

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Log New Issue</h2>
        <p className="mt-1 text-slate-600">
          Record an equipment failure, safety concern, or maintenance request.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <label className="block text-sm">
          <span className="mb-1 block font-medium text-slate-700">Title</span>
          <input name="title" required className={inputClass} placeholder="Crusher failure" />
        </label>

        <label className="block text-sm">
          <span className="mb-1 block font-medium text-slate-700">Description</span>
          <textarea
            name="description"
            required
            rows={4}
            className={inputClass}
            placeholder="Describe what happened and any immediate impact."
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-slate-700">Category</span>
            <select name="category" required className={inputClass} defaultValue={CATEGORIES[0]}>
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm">
            <span className="mb-1 block font-medium text-slate-700">Priority</span>
            <select
              name="priority"
              required
              className={inputClass}
              defaultValue={IssuePriority.Medium}
            >
              <option value={IssuePriority.Low}>Low</option>
              <option value={IssuePriority.Medium}>Medium</option>
              <option value={IssuePriority.High}>High</option>
            </select>
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="mb-1 block font-medium text-slate-700">Site</span>
            <select
              value={siteId}
              onChange={(e) => {
                setSiteId(Number(e.target.value))
                setEquipmentId('')
              }}
              className={inputClass}
            >
              {SITES.map((site) => (
                <option key={site.id} value={site.id}>
                  {site.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm">
            <span className="mb-1 block font-medium text-slate-700">Equipment</span>
            <select
              value={equipmentId}
              onChange={(e) => setEquipmentId(e.target.value)}
              className={inputClass}
            >
              <option value="">None</option>
              {equipmentOptions.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="block text-sm">
          <span className="mb-1 block font-medium text-slate-700">Assigned To</span>
          <input name="assignedTo" className={inputClass} placeholder="John Smith" />
        </label>

        {error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600 disabled:opacity-60"
        >
          {submitting ? 'Submitting...' : 'Create Issue'}
        </button>
      </form>
    </div>
  )
}

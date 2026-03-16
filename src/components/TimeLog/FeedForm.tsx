import { useState } from 'react'
import { useTimeStore } from '../../store/useTimeStore'
import { todayISO } from '../../utils/dateHelpers'

interface Props {
  onSubmit?: () => void
}

export function FeedForm({ onSubmit }: Props) {
  const addEntry = useTimeStore((s) => s.addEntry)
  const entries = useTimeStore((s) => s.entries)
  const [date, setDate] = useState(todayISO())
  const [project, setProject] = useState('')
  const [description, setDescription] = useState('')
  const [hours, setHours] = useState('')
  const [error, setError] = useState('')

  // Build autocomplete list from past projects
  const pastProjects = [...new Set(entries.map((e) => e.project))].slice(0, 10)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    const parsedHours = parseFloat(hours)
    if (!project.trim()) return setError('Project name is required')
    if (isNaN(parsedHours) || parsedHours <= 0) return setError('Enter a valid number of hours')
    if (!date) return setError('Date is required')

    addEntry({ date, project: project.trim(), description: description.trim(), hours: parsedHours })
    setProject('')
    setDescription('')
    setHours('')
    setDate(todayISO())
    onSubmit?.()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm mx-auto">
      <div className="text-center font-pixel text-tama-green mb-2" style={{ fontSize: '11px' }}>
        FEED YOUR PET
      </div>
      <div className="text-center text-gray-500 font-pixel mb-2" style={{ fontSize: '8px' }}>
        Log time to keep your pet happy
      </div>

      {error && (
        <div className="text-tama-red font-pixel text-center border border-tama-red p-2" style={{ fontSize: '8px' }}>
          {error}
        </div>
      )}

      <div>
        <label className="block text-gray-400 font-pixel mb-1" style={{ fontSize: '8px' }}>
          DATE
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="pixel-input"
          required
        />
      </div>

      <div>
        <label className="block text-gray-400 font-pixel mb-1" style={{ fontSize: '8px' }}>
          PROJECT *
        </label>
        <input
          type="text"
          value={project}
          onChange={(e) => setProject(e.target.value)}
          placeholder="Client A, Internal..."
          className="pixel-input"
          list="project-suggestions"
          required
        />
        {pastProjects.length > 0 && (
          <datalist id="project-suggestions">
            {pastProjects.map((p) => (
              <option key={p} value={p} />
            ))}
          </datalist>
        )}
      </div>

      <div>
        <label className="block text-gray-400 font-pixel mb-1" style={{ fontSize: '8px' }}>
          DESCRIPTION
        </label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What did you work on?"
          className="pixel-input"
        />
      </div>

      <div>
        <label className="block text-gray-400 font-pixel mb-1" style={{ fontSize: '8px' }}>
          HOURS *
        </label>
        <input
          type="number"
          value={hours}
          onChange={(e) => setHours(e.target.value)}
          placeholder="1.5"
          min="0.01"
          step="any"
          className="pixel-input"
          required
        />
      </div>

      <button
        type="submit"
        className="pixel-btn border-tama-green text-tama-green hover:bg-tama-green hover:text-tama-bg font-pixel w-full"
        style={{ fontSize: '10px', padding: '10px' }}
      >
        LOG TIME
      </button>
    </form>
  )
}

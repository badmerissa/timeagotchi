import { useTimeStore } from '../../store/useTimeStore'
import type { TimeEntry } from '../../types'

interface Props {
  entry: TimeEntry
}

export function EntryRow({ entry }: Props) {
  const deleteEntry = useTimeStore((s) => s.deleteEntry)

  return (
    <div className="flex items-center gap-2 p-2 border border-tama-border bg-tama-screen rounded hover:border-tama-green transition-colors group">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-tama-green font-pixel truncate" style={{ fontSize: '9px' }}>
            {entry.project}
          </span>
          <span className="text-tama-yellow font-pixel ml-auto shrink-0" style={{ fontSize: '9px' }}>
            {entry.hours}h
          </span>
        </div>
        {entry.description && (
          <div className="text-gray-500 truncate mt-0.5" style={{ fontSize: '7px' }}>
            {entry.description}
          </div>
        )}
      </div>
      <button
        onClick={() => deleteEntry(entry.id)}
        className="text-gray-600 hover:text-tama-red font-pixel shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ fontSize: '10px' }}
        aria-label="Delete entry"
        title="Delete"
      >
        ✖
      </button>
    </div>
  )
}

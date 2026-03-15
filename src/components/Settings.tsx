import { useState } from 'react'
import { useTimeStore } from '../store/useTimeStore'

export function Settings() {
  const { settings, updateSettings } = useTimeStore()
  const [saved, setSaved] = useState(false)
  const [petName, setPetName] = useState(settings.petName)
  const [targetHours, setTargetHours] = useState(String(settings.weeklyTargetHours))
  const [weekStartsOn, setWeekStartsOn] = useState<0 | 1>(settings.weekStartsOn)

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    const hours = parseFloat(targetHours)
    if (isNaN(hours) || hours <= 0 || hours > 168) return
    updateSettings({
      petName: petName.trim() || 'Tama',
      weeklyTargetHours: hours,
      weekStartsOn,
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-6 max-w-sm mx-auto">
      <div className="text-center font-pixel text-tama-green mb-2" style={{ fontSize: '11px' }}>
        SETTINGS
      </div>

      <div>
        <label className="block text-gray-400 font-pixel mb-1" style={{ fontSize: '8px' }}>
          PET NAME
        </label>
        <input
          type="text"
          value={petName}
          onChange={(e) => setPetName(e.target.value)}
          maxLength={12}
          className="pixel-input"
          placeholder="Tama"
        />
      </div>

      <div>
        <label className="block text-gray-400 font-pixel mb-1" style={{ fontSize: '8px' }}>
          WEEKLY HOUR TARGET
        </label>
        <input
          type="number"
          value={targetHours}
          onChange={(e) => setTargetHours(e.target.value)}
          min="1"
          max="168"
          step="1"
          className="pixel-input"
          placeholder="40"
        />
        <div className="flex gap-1 mt-2">
          {[20, 30, 35, 40].map((h) => (
            <button
              key={h}
              type="button"
              onClick={() => setTargetHours(String(h))}
              className="flex-1 pixel-btn border-tama-border text-gray-400 hover:border-tama-green hover:text-tama-green"
              style={{ fontSize: '7px', padding: '4px 2px' }}
            >
              {h}h
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-gray-400 font-pixel mb-2" style={{ fontSize: '8px' }}>
          WEEK STARTS ON
        </label>
        <div className="flex gap-2">
          {([1, 0] as const).map((day) => (
            <button
              key={day}
              type="button"
              onClick={() => setWeekStartsOn(day)}
              className={`flex-1 pixel-btn font-pixel transition-colors ${
                weekStartsOn === day
                  ? 'border-tama-green text-tama-green'
                  : 'border-tama-border text-gray-400 hover:border-tama-green'
              }`}
              style={{ fontSize: '9px', padding: '8px' }}
            >
              {day === 1 ? 'MON' : 'SUN'}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="pixel-btn border-tama-green text-tama-green hover:bg-tama-green hover:text-tama-bg font-pixel"
        style={{ fontSize: '10px', padding: '10px' }}
      >
        {saved ? 'SAVED!' : 'SAVE SETTINGS'}
      </button>

      {saved && (
        <div className="text-center text-tama-green font-pixel" style={{ fontSize: '8px' }}>
          Settings saved successfully!
        </div>
      )}
    </form>
  )
}

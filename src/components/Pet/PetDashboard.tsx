import { useState, useEffect } from 'react'
import { PetSprite } from './PetSprite'
import { HealthBar } from './HealthBar'
import { usePetState } from '../../store/petSelectors'
import { useTimeStore } from '../../store/useTimeStore'
import { getMoodMessage, getLevelLabel } from '../../utils/petLogic'

interface Props {
  onFeedClick: () => void
  isFeeding: boolean
}

export function PetDashboard({ onFeedClick, isFeeding }: Props) {
  const pet = usePetState()
  const { settings, evolution } = useTimeStore()
  const [message, setMessage] = useState('')

  useEffect(() => {
    setMessage(getMoodMessage(pet.mood, settings.petName))
    const interval = setInterval(() => {
      setMessage(getMoodMessage(pet.mood, settings.petName))
    }, 30000)
    return () => clearInterval(interval)
  }, [pet.mood, settings.petName])

  const moodEmoji = {
    thriving: '★',
    happy: '♥',
    neutral: '●',
    hungry: '▼',
    critical: '✖',
  }[pet.mood]

  const moodColor = {
    thriving: 'text-tama-green',
    happy: 'text-tama-blue',
    neutral: 'text-tama-purple',
    hungry: 'text-tama-yellow',
    critical: 'text-tama-red',
  }[pet.mood]

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Pet name + level */}
      <div className="text-center">
        <div className="text-tama-green font-pixel text-sm">{settings.petName}</div>
        <div className="text-gray-500 font-pixel mt-1" style={{ fontSize: '8px' }}>
          Lv.{evolution.level} {getLevelLabel(evolution.level)}
        </div>
      </div>

      {/* LCD Screen */}
      <div className="relative pixel-panel screen-glow scanlines w-48 h-48 flex items-center justify-center bg-tama-screen">
        <PetSprite
          mood={pet.mood}
          level={evolution.level}
          activeAccessory={evolution.activeAccessory}
          isFeeding={isFeeding}
        />
      </div>

      {/* Mood badge */}
      <div className={`font-pixel text-xs ${moodColor} flex items-center gap-2`} style={{ fontSize: '9px' }}>
        <span>{moodEmoji}</span>
        <span className="uppercase">{pet.mood}</span>
      </div>

      {/* Health bar */}
      <div className="w-48">
        <HealthBar healthPct={pet.healthPct} />
      </div>

      {/* Hours */}
      <div className="font-pixel text-center" style={{ fontSize: '9px' }}>
        <span className="text-tama-green">{pet.weekHoursLogged.toFixed(1)}</span>
        <span className="text-gray-500"> / </span>
        <span className="text-gray-400">{pet.weekHoursTarget} hrs</span>
        <div className="text-gray-600 mt-1">this week</div>
      </div>

      {/* Message */}
      <div
        className="text-center text-gray-400 border border-tama-border bg-tama-screen p-2 rounded w-64"
        style={{ fontSize: '8px', lineHeight: '1.6' }}
      >
        {message}
      </div>

      {/* Feed button */}
      <button
        onClick={onFeedClick}
        className="pixel-btn border-tama-green text-tama-green hover:bg-tama-green hover:text-tama-bg font-pixel text-xs"
        style={{ fontSize: '10px' }}
      >
        + FEED PET
      </button>

      {/* Last fed */}
      {pet.lastFedAt && (
        <div className="text-gray-600 font-pixel" style={{ fontSize: '7px' }}>
          Last fed: {new Date(pet.lastFedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      )}
    </div>
  )
}

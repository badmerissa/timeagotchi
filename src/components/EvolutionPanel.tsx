import { useTimeStore } from '../store/useTimeStore'
import { ACCESSORIES, getLevelLabel } from '../utils/petLogic'
import { PetSprite } from './Pet/PetSprite'
import { usePetState } from '../store/petSelectors'

export function EvolutionPanel() {
  const { evolution, updateEvolution } = useTimeStore()
  const pet = usePetState()

  function selectAccessory(acc: string | null) {
    updateEvolution({ activeAccessory: acc })
  }

  const progressToNextLevel = evolution.consecutiveGoodWeeks % 2
  const weeksNeeded = 2 - progressToNextLevel

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center font-pixel text-tama-green mb-2" style={{ fontSize: '11px' }}>
        EVOLUTION
      </div>

      {/* Level display */}
      <div className="pixel-panel p-4 flex flex-col items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="text-center">
            <div className="text-tama-yellow font-pixel" style={{ fontSize: '24px' }}>
              Lv.{evolution.level}
            </div>
            <div className="text-gray-400 font-pixel" style={{ fontSize: '9px' }}>
              {getLevelLabel(evolution.level)}
            </div>
          </div>
          <PetSprite
            mood={pet.mood}
            level={evolution.level}
            activeAccessory={evolution.activeAccessory}
          />
        </div>

        {/* Consecutive weeks */}
        <div className="w-full text-center">
          <div className="text-gray-500 font-pixel mb-2" style={{ fontSize: '7px' }}>
            CONSECUTIVE GREAT WEEKS (≥85%)
          </div>
          <div className="flex justify-center gap-1">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className={`w-4 h-4 border border-tama-border ${
                  i < evolution.consecutiveGoodWeeks ? 'bg-tama-green' : 'bg-tama-screen'
                }`}
              />
            ))}
          </div>
          <div className="text-gray-600 font-pixel mt-2" style={{ fontSize: '7px' }}>
            {evolution.level < 5
              ? `${weeksNeeded} more great week${weeksNeeded !== 1 ? 's' : ''} to level up`
              : 'MAX LEVEL REACHED!'}
          </div>
        </div>
      </div>

      {/* Level roadmap */}
      <div className="pixel-panel p-3">
        <div className="font-pixel text-gray-400 mb-3" style={{ fontSize: '8px' }}>LEVEL ROADMAP</div>
        <div className="flex flex-col gap-2">
          {[1, 2, 3, 4, 5].map((lvl) => (
            <div
              key={lvl}
              className={`flex items-center gap-3 font-pixel p-1.5 rounded ${
                lvl === evolution.level ? 'border border-tama-green bg-tama-screen' : ''
              }`}
            >
              <div
                className={`w-6 h-6 flex items-center justify-center border ${
                  lvl <= evolution.level ? 'border-tama-green text-tama-green' : 'border-tama-border text-gray-600'
                }`}
                style={{ fontSize: '9px' }}
              >
                {lvl}
              </div>
              <div>
                <div className={`${lvl <= evolution.level ? 'text-white' : 'text-gray-600'}`} style={{ fontSize: '9px' }}>
                  {getLevelLabel(lvl)}
                </div>
                <div className="text-gray-600" style={{ fontSize: '7px' }}>
                  {lvl === 1 ? 'Starting' : `${(lvl - 1) * 2} great weeks`}
                </div>
              </div>
              {lvl === evolution.level && (
                <span className="ml-auto text-tama-green" style={{ fontSize: '8px' }}>← HERE</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Accessories */}
      <div className="pixel-panel p-3">
        <div className="font-pixel text-gray-400 mb-3" style={{ fontSize: '8px' }}>
          ACCESSORIES ({evolution.unlockedAccessories.length}/{ACCESSORIES.length} unlocked)
        </div>
        <div className="grid grid-cols-3 gap-2">
          {/* None option */}
          <button
            onClick={() => selectAccessory(null)}
            className={`pixel-btn font-pixel flex flex-col items-center gap-1 transition-colors ${
              evolution.activeAccessory === null
                ? 'border-tama-green text-tama-green'
                : 'border-tama-border text-gray-500 hover:border-tama-green'
            }`}
            style={{ fontSize: '7px', padding: '8px 4px' }}
          >
            <span className="text-lg">✕</span>
            <span>NONE</span>
          </button>

          {ACCESSORIES.map((acc) => {
            const isUnlocked = evolution.unlockedAccessories.includes(acc)
            const isActive = evolution.activeAccessory === acc
            const emoji = {
              hat: '🎩',
              sunglasses: '🕶️',
              bow: '🎀',
              crown: '👑',
              cape: '🦸',
            }[acc]

            return (
              <button
                key={acc}
                onClick={() => isUnlocked && selectAccessory(acc)}
                disabled={!isUnlocked}
                className={`pixel-btn font-pixel flex flex-col items-center gap-1 transition-colors ${
                  !isUnlocked
                    ? 'border-tama-border text-gray-700 cursor-not-allowed opacity-40'
                    : isActive
                    ? 'border-tama-green text-tama-green'
                    : 'border-tama-border text-gray-400 hover:border-tama-green'
                }`}
                style={{ fontSize: '7px', padding: '8px 4px' }}
              >
                <span className="text-lg">{isUnlocked ? emoji : '🔒'}</span>
                <span className="uppercase">{acc}</span>
              </button>
            )
          })}
        </div>
        <div className="text-gray-600 font-pixel mt-3 text-center" style={{ fontSize: '7px' }}>
          Unlock accessories by completing great weeks (≥85% target)
        </div>
      </div>
    </div>
  )
}

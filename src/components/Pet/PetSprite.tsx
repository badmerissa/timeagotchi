import type { PetMood } from '../../types'

interface Props {
  mood: PetMood
  level: number
  activeAccessory: string | null
  isFeeding?: boolean
}

// Pixel art pet using SVG — different expressions per mood
export function PetSprite({ mood, level, activeAccessory, isFeeding = false }: Props) {
  const animClass = {
    thriving: 'animate-bounce_pet',
    happy: 'animate-blink',
    neutral: '',
    hungry: 'animate-droop',
    critical: '',
  }[mood]

  const bodyColor = {
    thriving: '#39ff14',
    happy: '#00d4ff',
    neutral: '#c084fc',
    hungry: '#ffd700',
    critical: '#ff4444',
  }[mood]

  const bgGlow = {
    thriving: 'rgba(57,255,20,0.25)',
    happy: 'rgba(0,212,255,0.2)',
    neutral: 'rgba(192,132,252,0.15)',
    hungry: 'rgba(255,215,0,0.2)',
    critical: 'rgba(255,68,68,0.3)',
  }[mood]

  const eyeExpression = mood === 'critical' ? 'x' : mood === 'hungry' ? 'sad' : 'normal'
  const mouthExpression = mood === 'thriving' ? 'big-smile' : mood === 'happy' ? 'smile' : mood === 'critical' ? 'frown' : 'neutral'

  return (
    <div className="relative flex items-center justify-center">
      {/* Glow backdrop */}
      <div
        className="absolute inset-0 rounded-full blur-xl"
        style={{ background: bgGlow, transform: 'scale(1.5)' }}
      />

      {/* Sparkles for thriving */}
      {mood === 'thriving' && (
        <>
          <div className="absolute -top-4 -left-4 text-yellow-300 animate-sparkle text-lg" style={{ animationDelay: '0s' }}>✦</div>
          <div className="absolute -top-2 -right-5 text-tama-green animate-sparkle text-sm" style={{ animationDelay: '0.3s' }}>✦</div>
          <div className="absolute -bottom-2 -left-5 text-tama-blue animate-sparkle text-xs" style={{ animationDelay: '0.6s' }}>✦</div>
        </>
      )}

      <div className={`relative ${animClass} ${isFeeding ? 'animate-fed' : ''}`}>
        <svg
          width="96"
          height="96"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          style={{ imageRendering: 'pixelated' }}
        >
          {/* Body */}
          <rect x="6" y="8" width="12" height="12" rx="1" fill={bodyColor} />
          {/* Head bump */}
          <rect x="8" y="5" width="8" height="5" rx="1" fill={bodyColor} />
          {/* Ears */}
          <rect x="5" y="4" width="4" height="4" rx="1" fill={bodyColor} />
          <rect x="15" y="4" width="4" height="4" rx="1" fill={bodyColor} />
          {/* Belly */}
          <rect x="9" y="12" width="6" height="5" rx="1" fill="rgba(255,255,255,0.2)" />
          {/* Feet */}
          <rect x="7" y="19" width="4" height="3" rx="1" fill={bodyColor} />
          <rect x="13" y="19" width="4" height="3" rx="1" fill={bodyColor} />
          {/* Arms */}
          <rect x="3" y="10" width="4" height="3" rx="1" fill={bodyColor} />
          <rect x="17" y="10" width="4" height="3" rx="1" fill={bodyColor} />

          {/* Eyes */}
          {eyeExpression === 'normal' && (
            <>
              <rect x="9" y="7" width="2" height="2" fill="#1a1a2e" />
              <rect x="13" y="7" width="2" height="2" fill="#1a1a2e" />
              {/* Shines */}
              <rect x="9" y="7" width="1" height="1" fill="white" />
              <rect x="13" y="7" width="1" height="1" fill="white" />
            </>
          )}
          {eyeExpression === 'sad' && (
            <>
              <rect x="9" y="7" width="2" height="2" fill="#1a1a2e" />
              <rect x="13" y="7" width="2" height="2" fill="#1a1a2e" />
              {/* Tear */}
              <rect x="10" y="9" width="1" height="2" fill="#00d4ff" />
            </>
          )}
          {eyeExpression === 'x' && (
            <>
              <rect x="9" y="7" width="1" height="1" fill="#1a1a2e" />
              <rect x="10" y="8" width="1" height="1" fill="#1a1a2e" />
              <rect x="10" y="7" width="1" height="1" fill="#1a1a2e" />
              <rect x="9" y="8" width="1" height="1" fill="#1a1a2e" />
              <rect x="13" y="7" width="1" height="1" fill="#1a1a2e" />
              <rect x="14" y="8" width="1" height="1" fill="#1a1a2e" />
              <rect x="14" y="7" width="1" height="1" fill="#1a1a2e" />
              <rect x="13" y="8" width="1" height="1" fill="#1a1a2e" />
            </>
          )}

          {/* Mouth */}
          {mouthExpression === 'big-smile' && (
            <>
              <rect x="9" y="11" width="1" height="1" fill="#1a1a2e" />
              <rect x="10" y="12" width="4" height="1" fill="#1a1a2e" />
              <rect x="14" y="11" width="1" height="1" fill="#1a1a2e" />
            </>
          )}
          {mouthExpression === 'smile' && (
            <>
              <rect x="10" y="11" width="4" height="1" fill="#1a1a2e" />
            </>
          )}
          {mouthExpression === 'neutral' && (
            <rect x="10" y="11" width="4" height="1" fill="#1a1a2e" />
          )}
          {mouthExpression === 'frown' && (
            <>
              <rect x="9" y="12" width="1" height="1" fill="#1a1a2e" />
              <rect x="10" y="11" width="4" height="1" fill="#1a1a2e" />
              <rect x="14" y="12" width="1" height="1" fill="#1a1a2e" />
            </>
          )}

          {/* Accessory overlays */}
          {activeAccessory === 'hat' && (
            <>
              <rect x="8" y="2" width="8" height="3" rx="0" fill="#ffd700" />
              <rect x="7" y="4" width="10" height="1" fill="#ffd700" />
            </>
          )}
          {activeAccessory === 'sunglasses' && (
            <>
              <rect x="8" y="7" width="3" height="2" rx="0" fill="#1a1a2e" opacity="0.8" />
              <rect x="13" y="7" width="3" height="2" rx="0" fill="#1a1a2e" opacity="0.8" />
              <rect x="11" y="8" width="2" height="1" fill="#1a1a2e" opacity="0.6" />
            </>
          )}
          {activeAccessory === 'bow' && (
            <>
              <rect x="7" y="3" width="2" height="2" fill="#ff69b4" />
              <rect x="11" y="3" width="2" height="2" fill="#ff69b4" />
              <rect x="9" y="4" width="2" height="1" fill="#ff69b4" />
            </>
          )}
          {activeAccessory === 'crown' && (
            <>
              <rect x="8" y="3" width="1" height="2" fill="#ffd700" />
              <rect x="10" y="2" width="1" height="3" fill="#ffd700" />
              <rect x="12" y="1" width="1" height="4" fill="#ffd700" />
              <rect x="14" y="2" width="1" height="3" fill="#ffd700" />
              <rect x="16" y="3" width="1" height="2" fill="#ffd700" />
              <rect x="8" y="4" width="9" height="1" fill="#ffd700" />
            </>
          )}
          {activeAccessory === 'cape' && (
            <>
              <rect x="2" y="9" width="3" height="8" rx="1" fill="#c084fc" />
              <rect x="19" y="9" width="3" height="8" rx="1" fill="#c084fc" />
            </>
          )}

          {/* Level indicator — small stars under feet */}
          {Array.from({ length: Math.min(level, 5) }).map((_, i) => (
            <rect key={i} x={8 + i * 2} y="23" width="1" height="1" fill="#ffd700" />
          ))}
        </svg>
      </div>
    </div>
  )
}

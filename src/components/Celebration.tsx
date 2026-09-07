import { useState, useRef, useCallback, useEffect, useMemo } from 'react'

const ENCOURAGEMENTS = [
  'Wonderful! You remembered!',
  'Well done! You got it right!',
  'You got it! Excellent memory!',
  'Brilliant! Perfectly done!',
  'Beautiful! That is exactly right!',
  "Spot on! That's the one!",
  'Splendid! Your mind is shining!',
  'Shabash! Great work!',
  'Terrific! Keep it up!',
  'Very well done! So proud of you!',
]

const CONFETTI_COLORS = [
  '#E8A838', '#C4622D', '#0F6E56',
  '#D4526E', '#534AB7', '#F2C96C',
  '#2A7A63', '#BA7517',
]

const FLOATING_EMOJIS = ['✨', '🌸', '⭐', '🌟', '🎉', '💛']

type Particle = {
  tx: number
  ty: number
  color: string
  size: number
  rotation: number
  delay: number
  emoji?: string
}

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.8
    const dist = 75 + Math.random() * 110
    const isEmoji = i % 4 === 0
    return {
      tx: Math.cos(angle) * dist,
      ty: Math.sin(angle) * dist - 40,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      size: isEmoji ? 22 : 9 + Math.random() * 8,
      rotation: Math.random() * 720 - 360,
      delay: Math.random() * 0.12,
      emoji: isEmoji ? FLOATING_EMOJIS[Math.floor(Math.random() * FLOATING_EMOJIS.length)] : undefined,
    }
  })
}

// ─── Harmonious Positive Celebration Chime ─────────────────────────────────────
export function playCelebrationSound() {
  if (!('AudioContext' in window || 'webkitAudioContext' in window)) return
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
    const ctx = new AudioCtx()
    const now = ctx.currentTime

    // Warm, welcoming pentatonic glissando (C5, E5, G5, B5, C6)
    const notes = [523.25, 659.25, 783.99, 987.77, 1046.5]
    notes.forEach((freq, idx) => {
      const t = now + idx * 0.065

      // Sine fundamental (clear, warm bell)
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, t)

      gain.gain.setValueAtTime(0, t)
      gain.gain.linearRampToValueAtTime(0.18, t + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.65)

      // Soft harmonic sparkle
      const overtone = ctx.createOscillator()
      const overGain = ctx.createGain()
      overtone.type = 'triangle'
      overtone.frequency.setValueAtTime(freq * 2, t)
      overGain.gain.setValueAtTime(0, t)
      overGain.gain.linearRampToValueAtTime(0.06, t + 0.015)
      overGain.gain.exponentialRampToValueAtTime(0.001, t + 0.35)

      osc.connect(gain)
      gain.connect(ctx.destination)
      overtone.connect(overGain)
      overGain.connect(ctx.destination)

      osc.start(t)
      osc.stop(t + 0.7)
      overtone.start(t)
      overtone.stop(t + 0.4)
    })

    setTimeout(() => ctx.close(), 1500)
  } catch {
    // Silent fallback
  }
}

// ─── Gentle Spoken Feedback ───────────────────────────────────────────────────
export function speakPraise(text: string) {
  if (!('speechSynthesis' in window)) return
  try {
    window.speechSynthesis.cancel() // cancel previous utterance
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.9 // gentle and warm pacing for elderly
    utterance.pitch = 1.05
    utterance.lang = 'en-IN'

    // Choose friendly voice if available
    const voices = window.speechSynthesis.getVoices()
    const indianVoice = voices.find(v => v.lang.includes('IN') || v.name.includes('India'))
    if (indianVoice) utterance.voice = indianVoice

    window.speechSynthesis.speak(utterance)
  } catch {}
}

export function useCelebration(soundEnabled: boolean) {
  const [state, setState] = useState<{ active: boolean; message: string; key: number; sub?: string }>({
    active: false, message: '', key: 0, sub: '',
  })
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const celebrate = useCallback((customMessage?: string, spokenText?: string, subText?: string) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    const msg = customMessage || ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)]
    setState(s => ({ active: true, message: msg, key: s.key + 1, sub: subText || '' }))

    if (soundEnabled) {
      playCelebrationSound()
      if (spokenText) {
        setTimeout(() => speakPraise(spokenText), 200)
      }
    }

    timerRef.current = setTimeout(() => setState(s => ({ ...s, active: false })), 2400)
  }, [soundEnabled])

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, [])

  return { celebrating: state.active, message: state.message, sub: state.sub, celebKey: state.key, celebrate }
}

interface OverlayProps { active: boolean; message: string; sub?: string }

export function CelebrationOverlay({ active, message, sub }: OverlayProps) {
  const reducedMotion = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, [])
  const particles = useMemo(() => generateParticles(26), [])

  if (!active) return null

  if (reducedMotion) {
    return (
      <div className="fixed inset-0 pointer-events-none z-50 flex items-start justify-center pt-[22%] px-4">
        <div className="bg-white rounded-2xl px-8 py-5 border-2 border-forest shadow-2xl text-center">
          <p className="text-5xl mb-2">🌟</p>
          <p className="font-serif text-bark text-3xl font-bold">{message}</p>
          {sub && <p className="text-forest text-lg font-semibold mt-1">{sub}</p>}
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* Rewarding celebration modal toast */}
      <div
        className="absolute w-full max-w-sm px-4"
        style={{
          left: '50%',
          top: '32%',
          transform: 'translate(-50%, -50%)',
          animation: 'celebToast 2.4s ease-out forwards',
        }}
      >
        <div className="bg-white/98 border-2 border-forest rounded-2xl px-6 py-5 shadow-2xl text-center backdrop-blur-sm">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-forest/10 text-forest text-2xl mb-2">
            ✓
          </div>
          <p className="font-serif text-bark text-3xl font-bold leading-tight">{message}</p>
          {sub ? (
            <p className="text-forest text-base font-semibold mt-1.5">{sub}</p>
          ) : (
            <p className="text-bark/60 text-xs font-semibold uppercase tracking-wider mt-1">
              ✨ Great Memory & Focus
            </p>
          )}
        </div>
      </div>

      {/* Confetti and floating star particles */}
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute flex items-center justify-center select-none"
          style={{
            left: '50%',
            top: '32%',
            width: p.size,
            height: p.emoji ? p.size : p.size * 0.6,
            background: p.emoji ? 'transparent' : p.color,
            borderRadius: p.emoji ? '0' : '3px',
            fontSize: p.emoji ? `${p.size}px` : undefined,
            ['--tx' as string]: `${p.tx}px`,
            ['--ty' as string]: `${p.ty}px`,
            ['--rot' as string]: `${p.rotation}deg`,
            animation: `confettiBurst 1.6s ease-out ${p.delay}s forwards`,
            opacity: 0,
          }}
        >
          {p.emoji}
        </div>
      ))}
    </div>
  )
}

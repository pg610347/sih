import { useState, useRef, useCallback, useEffect, useMemo } from 'react'

const ENCOURAGEMENTS = [
  'Wonderful! You remembered!',
  'Well done!',
  'You got it!',
  'Excellent work!',
  'Beautifully done!',
  "That's right!",
  'Perfect!',
  'Marvellous!',
  'Very well done!',
]

const CONFETTI_COLORS = [
  '#E8A838', '#C4622D', '#1B5E4E',
  '#D4526E', '#7BA08C', '#F2C96C',
  '#2A7A63', '#4A1942',
]

type Particle = { tx: number; ty: number; color: string; size: number; rotation: number; delay: number }

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.9
    const dist = 65 + Math.random() * 95
    return {
      tx: Math.cos(angle) * dist,
      ty: Math.sin(angle) * dist - 32,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      size: 8 + Math.random() * 8,
      rotation: Math.random() * 720 - 360,
      delay: Math.random() * 0.13,
    }
  })
}

function playCelebrationSound() {
  if (!('AudioContext' in window)) return
  try {
    const ctx = new AudioContext()

    const popOsc = ctx.createOscillator()
    const popGain = ctx.createGain()
    popOsc.type = 'sine'
    popOsc.frequency.value = 320
    popGain.gain.setValueAtTime(0.28, ctx.currentTime)
    popGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09)
    popOsc.connect(popGain)
    popGain.connect(ctx.destination)
    popOsc.start()
    popOsc.stop(ctx.currentTime + 0.09)

    ;[523.25, 659.25, 783.99].forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      const t = ctx.currentTime + 0.07 + i * 0.1
      osc.type = 'sine'
      osc.frequency.value = freq
      gain.gain.setValueAtTime(0, t)
      gain.gain.linearRampToValueAtTime(0.16, t + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.52)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(t)
      osc.stop(t + 0.55)
    })

    setTimeout(() => ctx.close(), 1200)
  } catch {
    // AudioContext blocked by browser — silent
  }
}

export function useCelebration(soundEnabled: boolean) {
  const [state, setState] = useState<{ active: boolean; message: string; key: number }>({
    active: false, message: '', key: 0,
  })
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const celebrate = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    const msg = ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)]
    setState(s => ({ active: true, message: msg, key: s.key + 1 }))
    if (soundEnabled) playCelebrationSound()
    timerRef.current = setTimeout(() => setState(s => ({ ...s, active: false })), 1900)
  }, [soundEnabled])

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, [])

  return { celebrating: state.active, message: state.message, celebKey: state.key, celebrate }
}

interface OverlayProps { active: boolean; message: string }

export function CelebrationOverlay({ active, message }: OverlayProps) {
  const reducedMotion = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, [])
  const particles = useMemo(() => generateParticles(22), [])

  if (!active) return null

  if (reducedMotion) {
    return (
      <div className="fixed inset-0 pointer-events-none z-40 flex items-start justify-center pt-[28%]">
        <div className="bg-amber rounded-3xl px-8 py-5 border-2 border-amber-light shadow-xl text-center">
          <p className="text-5xl mb-2">✅</p>
          <p className="font-serif text-bark text-3xl font-bold">{message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {/* Toast message */}
      <div className="absolute" style={{ left: '50%', top: '36%', animation: 'celebToast 1.9s ease-out forwards' }}>
        <div className="bg-white/96 border-2 border-amber rounded-3xl px-8 py-4 shadow-2xl whitespace-nowrap text-center">
          <p className="font-serif text-bark text-3xl font-bold leading-tight">{message}</p>
        </div>
      </div>

      {/* Confetti particles */}
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-sm"
          style={{
            left: '50%',
            top: '36%',
            width: p.size,
            height: p.size * 0.55,
            background: p.color,
            ['--tx' as string]: `${p.tx}px`,
            ['--ty' as string]: `${p.ty}px`,
            ['--rot' as string]: `${p.rotation}deg`,
            animation: `confettiBurst 1.35s ease-out ${p.delay}s forwards`,
            opacity: 0,
          }}
        />
      ))}
    </div>
  )
}

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import type { Language } from '../App'
import { t, type PatientStrings } from '../i18n'
import { MUSIC_TRACKS, type MusicTrack, TWINKLE_NOTES } from '../musicTracks'
import AICompanionView from './AICompanionView'
import LanguageSelectView from './LanguageSelectView'
import SavedMemoriesView from './SavedMemoriesView'
import { useCelebration, CelebrationOverlay } from '../components/Celebration'
import { useStreak, getStreakEmoji, getWeekDotDates, MILESTONES, type Milestone } from '../hooks/useStreak'
import { useMemories, type SavedMemory } from '../hooks/useMemories'

// ─── Utilities ─────────────────────────────────────────────────────────────────

function shuffled<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}

// ─── Web Audio melody player ───────────────────────────────────────────────────

function useMelodyPlayer() {
  const ctxRef = useRef<AudioContext | null>(null)

  const stop = useCallback(() => {
    if (ctxRef.current) { ctxRef.current.close().catch(() => {}); ctxRef.current = null }
  }, [])

  useEffect(() => () => stop(), [stop])

  const play = useCallback((notes: number[], bpm: number, onEnd?: () => void) => {
    stop()
    ctxRef.current = new AudioContext()
    const ctx = ctxRef.current
    const dur = 60 / bpm
    let t = ctx.currentTime + 0.08

    notes.forEach(freq => {
      if (freq === 0) { t += dur * 0.5; return }
      const osc = ctx.createOscillator(), harm = ctx.createOscillator(), gain = ctx.createGain()
      osc.type = 'sine'; harm.type = 'sine'
      osc.frequency.value = freq; harm.frequency.value = freq * 2.01
      osc.connect(gain); harm.connect(gain); gain.connect(ctx.destination)
      gain.gain.setValueAtTime(0, t)
      gain.gain.linearRampToValueAtTime(0.22, t + 0.05)
      gain.gain.setValueAtTime(0.18, t + dur * 0.68)
      gain.gain.linearRampToValueAtTime(0, t + dur * 0.92)
      osc.start(t); osc.stop(t + dur); harm.start(t); harm.stop(t + dur)
      t += dur
    })

    const drone = ctx.createOscillator(), dg = ctx.createGain()
    drone.type = 'sine'; drone.frequency.value = (notes.find(n => n > 0) ?? 261) / 2
    dg.gain.value = 0.06; drone.connect(dg); dg.connect(ctx.destination)
    drone.start(ctx.currentTime + 0.08); drone.stop(t + 0.5)

    if (onEnd) setTimeout(onEnd, (t - ctx.currentTime + 0.2) * 1000)
  }, [stop])

  return { play, stop }
}

// ─── Sound Effects for Cognitive Games ─────────────────────────────────────────

function playSoundEffect(type: 'tap' | 'flip' | 'match' | 'fanfare' | 'hint' | 'undo') {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!AudioCtx) return
    const ctx = new AudioCtx()
    const now = ctx.currentTime

    if (type === 'tap' || type === 'flip') {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(type === 'flip' ? 440 : 330, now)
      osc.frequency.exponentialRampToValueAtTime(type === 'flip' ? 660 : 220, now + 0.08)
      gain.gain.setValueAtTime(0.08, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now)
      osc.stop(now + 0.09)
    } else if (type === 'match') {
      [523.25, 659.25, 783.99].forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(freq, now + i * 0.07)
        gain.gain.setValueAtTime(0.12, now + i * 0.07)
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.3)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(now + i * 0.07)
        osc.stop(now + i * 0.07 + 0.32)
      })
    } else if (type === 'fanfare') {
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, now + i * 0.09)
        gain.gain.setValueAtTime(0.14, now + i * 0.09)
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.09 + 0.45)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(now + i * 0.09)
        osc.stop(now + i * 0.09 + 0.48)
      })
    } else if (type === 'hint') {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(587.33, now)
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.18)
      gain.gain.setValueAtTime(0.1, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now)
      osc.stop(now + 0.26)
    } else if (type === 'undo') {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(392, now)
      osc.frequency.exponentialRampToValueAtTime(261.63, now + 0.12)
      gain.gain.setValueAtTime(0.08, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(now)
      osc.stop(now + 0.13)
    }
  } catch {
    // Audio context may fail if unsupported or muted
  }
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const NER_OBJECTS = [
  { id: 'diya',     emoji: '🪔', name: 'Diya',     localName: 'দিয়া',       scene: 'Rows of tiny clay lamps glow in the courtyard at Bihu dawn.', sensory: 'Warm smell of sesame oil and smoke on a Bihu morning', prompt: 'Where in your home did you keep the diyas?' },
  { id: 'jhapi',    emoji: '🧺', name: 'Jhapi',    localName: 'জাপি',      scene: 'Bamboo baskets woven by your grandmother — rice, vegetables, fish from market.', sensory: 'Clean earthy scent of fresh bamboo on a rainy morning', prompt: 'What did your family carry in the jhapi?' },
  { id: 'lota',     emoji: '🫙', name: 'Lota',     localName: 'লোটা',     scene: 'Brass lota gleaming on the kitchen shelf, filled with water from the well.', sensory: 'Cold water from a brass pot — the cleanest water you ever tasted', prompt: 'Do you remember how your family polished the lota?' },
  { id: 'silbatta', emoji: '🪨', name: 'Silbatta', localName: 'শিলবট্টা',  scene: 'Every morning — ginger, turmeric, mustard crushed to paste. The smell fills the whole house.', sensory: 'Fresh turmeric paste — golden yellow staining your palms', prompt: 'What spices did your family grind most often?' },
  { id: 'chula',    emoji: '🏺', name: 'Chula',    localName: 'চুলা',     scene: 'Three mud bricks. A handful of twigs. Rice simmering, dal bubbling, woodsmoke curling upward.', sensory: 'Woodsmoke clinging to clothes, and rice that tasted of the fire', prompt: 'What did your family cook on the chula that you miss most?' },
  { id: 'dheki',    emoji: '🪵', name: 'Dheki',    localName: 'ঢেঁকি',    scene: 'Two women working together — one foot pushing the long wooden beam, feeding rice into the hollow. Thump. Thump. Thump.', sensory: 'The steady thump of the dheki and powdery smell of fresh rice flour', prompt: 'When did your family use the dheki? For which festivals?' },
  { id: 'gamosa',   emoji: '🧣', name: 'Gamosa',   localName: 'গামোচা',   scene: 'White cotton with red borders, handwoven on the taat loom. Given at Bihu as a sign of love and respect.', sensory: 'Soft crispness of freshly washed cotton, warm from the sun', prompt: 'Did your family weave gamosa at home or buy from the market?' },
]

// Music data (50+ songs across all 8 languages with lyrics and YouTube links) imported from ../musicTracks

const PAIR_CARDS = [
  { pairId: 'a', emoji: '🪔', name: 'Diya' },
  { pairId: 'b', emoji: '🧺', name: 'Jhapi' },
  { pairId: 'c', emoji: '🫙', name: 'Lota' },
  { pairId: 'd', emoji: '🪨', name: 'Silbatta' },
  { pairId: 'e', emoji: '🏺', name: 'Chula' },
  { pairId: 'f', emoji: '🧣', name: 'Gamosa' },
  { pairId: 'g', emoji: '☕', name: 'Chai Cup' },
  { pairId: 'h', emoji: '🔔', name: 'Puja Bell' },
  { pairId: 'i', emoji: '🌸', name: 'Marigold' },
  { pairId: 'j', emoji: '🌾', name: 'Golden Rice' },
]

type SortItem = { emoji: string; name: string; localName: string; bin: 0 | 1; hint: string }
const SORT_ITEMS: SortItem[] = [
  { emoji: '🪨', name: 'Silbatta',      localName: 'শিলবট্টা', bin: 0, hint: 'The silbatta grinds fresh ginger and turmeric in the kitchen.' },
  { emoji: '🌾', name: 'Rice Paddy',    localName: 'ধান খেতি', bin: 1, hint: 'Rice stalks grow under the warm sunshine in the open field.' },
  { emoji: '🫙', name: 'Lota',          localName: 'লোটা',      bin: 0, hint: 'The brass lota holds clean water on the kitchen counter.' },
  { emoji: '🌿', name: 'Bamboo Grove',  localName: 'বাঁহনি',     bin: 1, hint: 'Tall bamboo groves grow outdoors in the village.' },
  { emoji: '🧣', name: 'Gamosa Loom',   localName: 'গামোচা',    bin: 1, hint: 'The wooden weaving loom sits outside in the courtyard verandah.' },
  { emoji: '🏺', name: 'Chula',         localName: 'চুলা',      bin: 0, hint: 'The clay chula is the heart of the kitchen where meals simmer.' },
  { emoji: '🧺', name: 'Jhapi',         localName: 'জাপি',      bin: 1, hint: 'The woven jhapi protects farmers from rain out in the fields.' },
  { emoji: '🥣', name: 'Mortar (Kharal)', localName: 'খৰাল',    bin: 0, hint: 'The stone mortar crushes spices and herbs in the kitchen.' },
  { emoji: '🌱', name: 'Paddy Seedling', localName: 'পুলি',     bin: 1, hint: 'Tender green seedlings are transplanted into wet field soil.' },
  { emoji: '🪔', name: 'Diya',          localName: 'দিয়া',      bin: 0, hint: 'Diyas are filled with mustard oil and lit in the prayer room.' },
  { emoji: '🍳', name: 'Kadai (Wok)',   localName: 'কেৰাহী',    bin: 0, hint: 'The iron kadai fries crispy delicacies in the kitchen.' },
  { emoji: '🪵', name: 'Firewood Stack', localName: 'খৰিৰ স্তূপ', bin: 1, hint: 'Firewood is gathered from the forest and stacked outside in the yard.' },
  { emoji: '🍵', name: 'Clay Kulhad',   localName: 'মাটিৰ কাপ',  bin: 0, hint: 'Earthen tea cups hold steaming spiced chai in the kitchen.' },
  { emoji: '🐃', name: 'Plow & Bullocks', localName: 'হাল',     bin: 1, hint: 'Bullocks plow the deep earth in the paddy fields at dawn.' },
  { emoji: '🥄', name: 'Wooden Ladle',  localName: 'হেতা',      bin: 0, hint: 'The wooden ladle stirs boiling dal and vegetable curry.' },
  { emoji: '🪴', name: 'Tulsi Courtyard', localName: 'তুলসী ভেটি', bin: 1, hint: 'The holy Tulsi shrine is nurtured outside in the central courtyard.' },
]

type PatternRound = { seq: string[]; answer: string; wrong: string; hint: string }
const PATTERN_ROUNDS: PatternRound[] = [
  { seq: ['🪔', '🧺', '🪔'], answer: '🧺', wrong: '🏺', hint: 'The pattern alternates: Diya, Basket, Diya... next is the Basket!' },
  { seq: ['🌾', '🪔', '🌾'], answer: '🪔', wrong: '🧺', hint: 'Rice, Diya, Rice... next comes the glowing Diya!' },
  { seq: ['🧺', '🫙', '🧺'], answer: '🫙', wrong: '🌾', hint: 'Basket, Lota, Basket... next comes the brass Lota!' },
  { seq: ['🏺', '🌿', '🏺'], answer: '🌿', wrong: '🧺', hint: 'Clay Chula, Green Leaf, Clay Chula... next is the Green Leaf!' },
  { seq: ['🪔', '🧣', '🪔'], answer: '🧣', wrong: '🏺', hint: 'Diya, Gamosa, Diya... next comes the festive Gamosa!' },
  { seq: ['🌾', '🧺', '🌾'], answer: '🧺', wrong: '🪔', hint: 'Golden Rice, Basket, Golden Rice... next is the Basket!' },
  { seq: ['🫙', '🪔', '🫙'], answer: '🪔', wrong: '🌾', hint: 'Brass Lota, Diya, Brass Lota... next comes the Diya!' },
  { seq: ['🧣', '🪨', '🧣'], answer: '🪨', wrong: '🧺', hint: 'Gamosa, Silbatta, Gamosa... next is the Silbatta!' },
  { seq: ['🌸', '🌸', '🪔', '🌸', '🌸'], answer: '🪔', wrong: '🌸', hint: 'Two flowers, then one Diya. After two flowers comes the Diya!' },
  { seq: ['🔔', '🪔', '🔔', '🪔'], answer: '🔔', wrong: '🏺', hint: 'Bell, Diya, Bell, Diya... rhythm repeats with the Bell!' },
  { seq: ['☕', '🍵', '☕'], answer: '🍵', wrong: '🫙', hint: 'Chai cup, Green tea, Chai cup... next is Green tea!' },
  { seq: ['🌱', '🌿', '🌱'], answer: '🌿', wrong: '🌾', hint: 'Seedling, Leaf, Seedling... next grows into a Leaf!' },
]

type SeqTask = { title: string; emoji: string; steps: { emoji: string; text: string }[] }
const SEQUENCE_TASKS: SeqTask[] = [
  {
    title: 'Making Morning Chai',
    emoji: '🍵',
    steps: [
      { emoji: '🪣', text: 'Fetch fresh water & milk' },
      { emoji: '🔥', text: 'Boil water with crushed ginger' },
      { emoji: '🍃', text: 'Add fragrant tea leaves' },
      { emoji: '☕', text: 'Pour warm chai into cups' },
    ],
  },
  {
    title: 'Lighting a Diya for Puja',
    emoji: '🪔',
    steps: [
      { emoji: '🫙', text: 'Fill the clay diya with oil' },
      { emoji: '🧵', text: 'Gently place the cotton wick' },
      { emoji: '🔥', text: 'Light with a matchstick' },
    ],
  },
  {
    title: 'Cooking Rice on the Chula',
    emoji: '🍚',
    steps: [
      { emoji: '🪣', text: 'Rinse rice in clean water' },
      { emoji: '🏺', text: 'Place pot on the warm chula' },
      { emoji: '♨️', text: 'Simmer until tender & fluffy' },
    ],
  },
  {
    title: 'Grinding Fresh Spices on Silbatta',
    emoji: '🌶️',
    steps: [
      { emoji: '💧', text: 'Wet the grinding stone clean' },
      { emoji: '🫚', text: 'Place ginger and fresh turmeric' },
      { emoji: '🪨', text: 'Roll stone back & forth smoothly' },
    ],
  },
  {
    title: 'Watering the Sacred Tulsi Altar',
    emoji: '🪴',
    steps: [
      { emoji: '🫙', text: 'Fill brass lota with well water' },
      { emoji: '🚶', text: 'Walk to the courtyard Tulsi shrine' },
      { emoji: '💧', text: 'Pour gently at the roots with prayer' },
    ],
  },
  {
    title: 'Serving a Festive Meal on Banana Leaf',
    emoji: '🍽️',
    steps: [
      { emoji: '🍃', text: 'Lay fresh green banana leaves' },
      { emoji: '🍚', text: 'Serve warm rice with golden ghee' },
      { emoji: '🥗', text: 'Add vegetable curries and dal' },
    ],
  },
  {
    title: 'Weaving the Traditional Gamosa',
    emoji: '🧣',
    steps: [
      { emoji: '🧵', text: 'Thread loom with soft white cotton' },
      { emoji: '🔴', text: 'Set red thread for floral borders' },
      { emoji: '✨', text: 'Weave row by row with patience' },
    ],
  },
  {
    title: 'Evening Routine for Peaceful Sleep',
    emoji: '🌙',
    steps: [
      { emoji: '🛏️', text: 'Smooth clean sheets on bed' },
      { emoji: '🪔', text: 'Turn down room lights softly' },
      { emoji: '🙏', text: 'Close eyes with a calming prayer' },
    ],
  },
]

function getDynamicOrientationQuestions() {
  const now = new Date()
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const todayDay = days[now.getDay()]
  
  const hour = now.getHours()
  let currentTimeOfDay = 'Daytime'
  if (hour >= 5 && hour < 12) currentTimeOfDay = 'Early Morning'
  else if (hour >= 12 && hour < 17) currentTimeOfDay = 'Afternoon'
  else if (hour >= 17 && hour < 21) currentTimeOfDay = 'Evening'
  else currentTimeOfDay = 'Night'

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const currentMonth = months[now.getMonth()]

  return [
    {
      icon: '📅',
      q: 'What day of the week is it today?',
      correct: todayDay,
      options: [todayDay, ...days.filter(d => d !== todayDay).slice(0, 3)].sort(() => 0.5 - Math.random()),
      feedback: `Today is ${todayDay}! A wonderful day filled with peaceful moments.`
    },
    {
      icon: '🌤️',
      q: 'What part of the day is it right now?',
      correct: currentTimeOfDay,
      options: ['Early Morning', 'Afternoon', 'Evening', 'Night'],
      feedback: `Right now it is ${currentTimeOfDay.toLowerCase()}. Take a gentle breath and relax.`
    },
    {
      icon: '🗓️',
      q: 'Which month of the year are we in?',
      correct: currentMonth,
      options: [currentMonth, ...months.filter(m => m !== currentMonth).slice(0, 3)].sort(() => 0.5 - Math.random()),
      feedback: `We are currently in ${currentMonth}. Nature and the days keep moving gracefully.`
    },
    {
      icon: '🌊',
      q: 'Which majestic river flows through Assam?',
      correct: 'The Brahmaputra',
      options: ['The Brahmaputra', 'The Ganga', 'The Barak', 'The Yamuna'],
      feedback: 'The mighty Brahmaputra river brings life, water, and greenery to all of Assam.'
    },
    {
      icon: '🎉',
      q: 'Which festival brings songs and joy in spring?',
      correct: 'Bihu Festival',
      options: ['Bihu Festival', 'Hornbill Festival', 'Sangai Festival', 'Chhath Puja'],
      feedback: 'Bihu is the joyous celebration of spring, harvest, singing, and togetherness!'
    },
    {
      icon: '🦏',
      q: 'Which animal is cherished as the pride of Assam?',
      correct: 'One-Horned Rhinoceros',
      options: ['One-Horned Rhinoceros', 'Royal Bengal Tiger', 'Great Hornbill', 'Snow Leopard'],
      feedback: 'The famous one-horned rhinoceros of Kaziranga is a symbol of strength and peace.'
    },
  ]
}

type Screen = 'home' | 'reminiscence' | 'music' | 'diary' | 'orientation' | 'pairs' | 'sort' | 'pattern' | 'sequence' | 'ai' | 'settings' | 'memories'
type DiaryPhase = 'ready' | 'recording' | 'stopping' | 'playback' | 'done' | 'saved'
type MusicPhase = 'intro' | 'playing' | 'responded'

// ─── Shared components ─────────────────────────────────────────────────────────

function BigBtn({ onClick, children, color = 'amber', full = false }: {
  onClick: () => void; children: React.ReactNode
  color?: 'amber' | 'forest' | 'terracotta' | 'white' | 'rose' | 'plum'; full?: boolean
}) {
  const pal = {
    amber:      'bg-amber text-bark active:bg-amber-light shadow-amber/20',
    forest:     'bg-forest text-parchment active:bg-forest-light shadow-forest/20',
    terracotta: 'bg-terracotta text-parchment active:bg-terracotta-light shadow-terracotta/20',
    white:      'bg-white text-bark border-2 border-sand active:bg-sand shadow-bark/10',
    rose:       'bg-rose text-white active:bg-rose/80 shadow-rose/20',
    plum:       'bg-plum text-parchment active:bg-plum/80 shadow-plum/20',
  }
  return (
    <button onClick={onClick}
      className={`flex items-center justify-center gap-3 rounded-3xl font-bold text-2xl leading-tight transition-transform active:scale-95 py-7 px-8 shadow-lg ${pal[color]} ${full ? 'w-full' : ''}`}
    >{children}</button>
  )
}

function BackBar({ onBack, label = '← Go Back' }: { onBack: () => void; label?: string }) {
  return (
    <button onClick={onBack}
      className="flex items-center gap-3 text-bark/60 hover:text-bark py-5 px-6 text-xl font-bold transition-colors text-left"
    >
      {label}
    </button>
  )
}

function PraiseScreen({ onNext, sub, emoji = '🌟' }: { onNext: () => void; sub?: string; emoji?: string }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-amber/10 px-8 py-12 text-center gap-8 animate-fadeUp">
      <div className="text-[120px] leading-none animate-bounce">{emoji}</div>
      <p className="font-serif text-bark text-5xl font-bold">Wonderful!</p>
      {sub && <p className="text-bark/70 text-2xl leading-relaxed max-w-sm font-serif italic">"{sub}"</p>}
      <BigBtn onClick={onNext} color="forest">Continue →</BigBtn>
    </div>
  )
}

// ─── Milestone screen ──────────────────────────────────────────────────────────

function MilestoneScreen({ milestone, streak, onContinue }: { milestone: Milestone; streak: number; onContinue: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-parchment px-8 py-12 text-center gap-8 animate-fadeUp">
      <div className="text-[120px] leading-none animate-bounce">{milestone.emoji}</div>
      <div>
        <p className="font-serif text-bark text-5xl font-bold">Wonderful! {milestone.emoji}</p>
        <p className="text-bark/70 text-2xl mt-3 leading-relaxed max-w-sm font-serif italic">
          "You have shared a memory moment for {streak} {streak === 1 ? 'day' : 'days'}."
        </p>
      </div>
      <div className="bg-amber/15 rounded-3xl px-8 py-5 border border-amber/30 max-w-sm w-full">
        <p className="font-serif text-bark text-2xl leading-relaxed">{milestone.label}</p>
        <p className="text-bark/50 text-lg mt-2">Let's keep enjoying these moments together.</p>
      </div>
      <BigBtn onClick={onContinue} color="forest">Continue →</BigBtn>
    </div>
  )
}

// ─── Streak card ───────────────────────────────────────────────────────────────

function StreakCard({ streak, doneToday, isReturning, weekDotDates, weekDates, tr }: {
  streak: number
  doneToday: boolean
  isReturning: boolean
  weekDotDates: ReturnType<typeof getWeekDotDates>
  weekDates: string[]
  tr: PatientStrings
}) {
  const hasHistory = streak > 0 || isReturning

  if (!hasHistory) {
    return (
      <div className="rounded-xl border border-[#D3D1C7] p-6 bg-[#F9F8F6]">
        <div className="flex items-center gap-4">
          <span className="text-4xl leading-none">🌱</span>
          <div>
            <p className="font-bold text-bark text-lg">{tr.streakBegin}</p>
            <p className="text-bark/60 text-sm mt-1">{tr.streakBeginDesc}</p>
          </div>
        </div>
      </div>
    )
  }

  const icon = getStreakEmoji(streak)
  const statusText = doneToday
    ? tr.streakDoneToday
    : isReturning
    ? tr.streakWelcomeBack
    : tr.streakReady

  return (
    <div
      className={`rounded-xl border p-6 ${doneToday ? 'bg-forest/5 border-forest/25' : 'bg-[#F9F8F6] border-[#D3D1C7]'}`}
      aria-label={`Your current Memory Streak is ${streak} ${streak === 1 ? 'day' : 'days'}.`}
    >
      <div className="flex items-start gap-4 mb-4">
        <span className="text-4xl leading-none shrink-0">{icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-bold text-bark text-lg leading-tight">{tr.streakTitle}</p>
            <span className="bg-amber text-bark text-sm font-bold px-2.5 py-0.5 rounded-full shrink-0">
              {streak} {streak === 1 ? 'day' : 'days'}
            </span>
          </div>
          <p className="text-bark/60 text-sm mt-1">{statusText}</p>
        </div>
      </div>

      <div className="flex justify-between">
        {weekDotDates.map(({ iso, day, isToday }) => {
          const done = weekDates.includes(iso)
          return (
            <div key={iso} className="flex flex-col items-center gap-1.5">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                done    ? 'bg-forest text-parchment' :
                isToday ? 'bg-amber/30 border-2 border-amber' :
                          'bg-sand/60'
              }`}>
                {done ? '✓' : ''}
              </div>
              <span className={`text-xs ${isToday ? 'font-bold text-bark' : 'text-bark/40'}`}>{day}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Home screen ───────────────────────────────────────────────────────────────

const now = new Date()
const dateStr = now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })

const AI_SCREEN: Screen = 'ai'

function HomeScreen({ onSelect, soundEnabled, setSoundEnabled, streak, doneToday, isReturning, weekDotDates, weekDates, tr, userName }: {
  onSelect: (s: Screen) => void
  soundEnabled: boolean
  setSoundEnabled: (v: boolean) => void
  streak: number
  doneToday: boolean
  isReturning: boolean
  weekDotDates: ReturnType<typeof getWeekDotDates>
  weekDates: string[]
  tr: PatientStrings
  userName?: string
}) {
  const activities = [
    { screen: 'reminiscence' as Screen, emoji: '🖼️', title: tr.rememberThis,   desc: tr.rememberThisDesc,    color: 'bg-amber/20 border-amber' },
    { screen: 'music'        as Screen, emoji: '🎵', title: tr.listenToMusic,  desc: tr.listenToMusicDesc,   color: 'bg-plum/10 border-plum/30' },
    { screen: 'diary'        as Screen, emoji: '📔', title: tr.dearDiary,      desc: tr.dearDiaryDesc,        color: 'bg-rose/10 border-rose/30' },
    { screen: 'memories'     as Screen, emoji: '📖', title: 'Saved Memories',  desc: 'Listen to your recorded memories', color: 'bg-terracotta/10 border-terracotta/40' },
    { screen: 'orientation'  as Screen, emoji: '🌍', title: tr.whatDay,         desc: tr.whatDayDesc,         color: 'bg-forest/10 border-forest/30' },
  ]
  const brainGames = [
    { screen: 'pairs'    as Screen, emoji: '🃏', title: tr.memoryPairs,    desc: tr.memoryPairsDesc,      color: 'bg-sage/20 border-sage' },
    { screen: 'sort'     as Screen, emoji: '🧺', title: tr.kitchenOrField, desc: tr.kitchenOrFieldDesc,   color: 'bg-amber/15 border-amber/50' },
    { screen: 'pattern'  as Screen, emoji: '🔄', title: tr.whatComesNext,  desc: tr.whatComesNextDesc,    color: 'bg-terracotta/10 border-terracotta/40' },
    { screen: 'sequence' as Screen, emoji: '📋', title: tr.putInOrder,     desc: tr.putInOrderDesc,       color: 'bg-forest/10 border-forest/30' },
  ]

  const [sosSent, setSosSent] = useState(false)
  const [showSosConfirm, setShowSosConfirm] = useState(false)

  const triggerSOS = () => {
    try {
      const raw = JSON.parse(localStorage.getItem('nercare_sos_v1') || '[]')
      const event = { timestamp: new Date().toISOString(), resolved: false }
      localStorage.setItem('nercare_sos_v1', JSON.stringify([event, ...raw]))
      setSosSent(true)
      setShowSosConfirm(false)
      setTimeout(() => setSosSent(false), 5000)
    } catch {
      // ignore
    }
  }

  return (
    <div className="min-h-screen bg-parchment flex flex-col px-5 py-7 gap-5 overflow-auto">
      <div className="bg-white rounded-xl p-6 border-2 border-sand shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">🪔</span>
          <span className="text-forest text-xs font-bold tracking-[0.2em] uppercase">Smaran · स्मरण Care</span>
        </div>
        <p className="text-bark/60 text-lg">{dateStr}</p>
        <p className="font-serif text-bark text-4xl sm:text-5xl font-bold mt-1">{tr.greeting}, {userName || 'Priya'} 👋</p>
        <p className="text-forest font-semibold text-xl mt-1">{timeStr}</p>
        <div className="flex items-center gap-3 mt-4 flex-wrap">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="flex items-center gap-2 text-bark text-base font-semibold rounded-xl border border-sand bg-parchment hover:bg-sand/40 px-4 py-2.5 active:scale-95 transition-transform min-h-[48px]"
          >
            {soundEnabled ? tr.soundOn : tr.soundOff}
          </button>
          <button
            onClick={() => onSelect('settings')}
            className="flex items-center gap-2 text-bark text-base font-semibold rounded-xl border border-sand bg-parchment hover:bg-sand/40 px-4 py-2.5 active:scale-95 transition-transform min-h-[48px]"
          >
            ⚙️ {tr.settings}
          </button>
        </div>
      </div>

      <StreakCard streak={streak} doneToday={doneToday} isReturning={isReturning} weekDotDates={weekDotDates} weekDates={weekDates} tr={tr} />

      {/* Companion — featured with warm, human presence */}
      <button onClick={() => onSelect(AI_SCREEN)}
        className="flex items-center gap-5 p-6 rounded-xl border-2 text-left transition-all active:scale-[0.98] bg-white border-forest/30 shadow-xs hover:border-forest"
      >
        <span className="text-6xl leading-none shrink-0">🌸</span>
        <div className="flex-1">
          <div className="font-bold text-bark text-2xl leading-tight">{tr.talkToMe}</div>
          <div className="text-bark/70 text-lg mt-1">{tr.companionTagline}</div>
        </div>
        <span className="text-forest text-2xl font-bold">→</span>
      </button>

      <p className="text-bark text-2xl font-bold px-1 mt-1">{tr.yourActivities}</p>
      <div className="flex flex-col gap-4">
        {activities.map(a => (
          <button key={a.screen} onClick={() => onSelect(a.screen)}
            className={`flex items-center gap-5 p-6 rounded-xl border-2 text-left transition-all active:scale-[0.98] shadow-xs ${a.color}`}
          >
            <span className="text-6xl leading-none shrink-0">{a.emoji}</span>
            <div className="flex-1">
              <div className="font-bold text-bark text-2xl leading-tight">{a.title}</div>
              <div className="text-bark/70 text-lg mt-1">{a.desc}</div>
            </div>
            <span className="text-bark/50 text-2xl font-bold">→</span>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3 mt-2">
        <p className="text-bark text-2xl font-bold px-1">{tr.brainGames}</p>
        <span className="bg-forest/10 text-forest text-sm font-bold px-3 py-1 rounded-xl border border-forest/20">{tr.helpsMemory}</span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {brainGames.map(g => (
          <button key={g.screen} onClick={() => onSelect(g.screen)}
            className={`flex flex-col items-start gap-3 p-5 rounded-xl border-2 text-left transition-all active:scale-[0.98] shadow-xs ${g.color}`}
          >
            <span className="text-4xl leading-none">{g.emoji}</span>
            <div>
              <div className="font-bold text-bark text-lg leading-tight">{g.title}</div>
              <div className="text-bark/70 text-sm mt-1">{g.desc}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Reassuring Caregiver Help Button — Large, dignified, high-contrast touch target */}
      <div className="mt-4 pt-4 border-t border-sand">
        {sosSent ? (
          <div className="bg-forest/10 border-2 border-forest rounded-xl p-5 text-center animate-fadeUp">
            <p className="font-bold text-forest text-xl">✅ Help alert sent to your caregiver</p>
            <p className="text-bark/70 text-base mt-1">They have been notified and will check in on you shortly.</p>
          </div>
        ) : (
          <button
            onClick={() => setShowSosConfirm(true)}
            className="w-full flex items-center justify-center gap-3 py-5 px-6 rounded-xl bg-white border-2 border-rose/40 text-rose hover:bg-rose/5 active:scale-[0.98] transition-all shadow-xs min-h-[56px]"
          >
            <span className="text-3xl leading-none">🆘</span>
            <div className="text-left">
              <p className="font-bold text-xl leading-tight text-rose">Need Help from Caregiver?</p>
              <p className="text-bark/60 text-sm">Press here to send a gentle emergency alert</p>
            </div>
          </button>
        )}
      </div>

      {/* Confirmation modal before sending alert — prevents accidental taps */}
      {showSosConfirm && (
        <div className="fixed inset-0 z-50 bg-bark/40 flex items-end sm:items-center justify-center p-4 animate-fadeUp" onClick={() => setShowSosConfirm(false)}>
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center border-2 border-sand shadow-xl" onClick={e => e.stopPropagation()}>
            <span className="text-5xl mb-3 block">🆘</span>
            <p className="font-serif text-bark text-2xl font-bold">Call for Your Caregiver?</p>
            <p className="text-bark/70 text-base mt-2 leading-relaxed">
              This will notify your family and caregiver immediately that you would like assistance.
            </p>
            <div className="flex flex-col gap-3 mt-6">
              <button
                onClick={triggerSOS}
                className="w-full py-4 bg-rose text-white font-bold text-xl rounded-2xl active:scale-95 transition-transform shadow-md"
              >
                Yes, Send Alert Now
              </button>
              <button
                onClick={() => setShowSosConfirm(false)}
                className="w-full py-3.5 bg-sand/60 text-bark font-bold text-lg rounded-2xl hover:bg-sand active:scale-95 transition-transform"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Speech Synthesis Helper ──────────────────────────────────────────────────

function speakSingAlong(text: string, langCode: string) {
  if (!('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
  const utt = new SpeechSynthesisUtterance(text)
  utt.lang = langCode || 'hi-IN'
  utt.rate = 0.78
  utt.pitch = 1.05
  utt.volume = 1
  window.speechSynthesis.speak(utt)
}

function stopSingAlong() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel()
  }
}

// ─── Reminiscence game ─────────────────────────────────────────────────────────

function ReminiscenceGame({ onBack, soundEnabled, recordActivity }: { onBack: () => void; soundEnabled: boolean; recordActivity: (n: string) => void }) {
  const [idx, setIdx] = useState(0)
  const [phase, setPhase] = useState<'show' | 'memory'>('show')
  const [isNarrating, setIsNarrating] = useState(false)
  const { celebrating, message, celebKey, celebrate } = useCelebration(soundEnabled)
  const obj = NER_OBJECTS[idx % NER_OBJECTS.length]

  const handleBack = () => {
    stopSingAlong()
    setIsNarrating(false)
    onBack()
  }

  const next = () => {
    stopSingAlong()
    setIsNarrating(false)
    if (soundEnabled) playSoundEffect('tap')
    setIdx(i => i + 1)
    setPhase('show')
  }

  const toggleNarration = () => {
    if (isNarrating) {
      stopSingAlong()
      setIsNarrating(false)
    } else {
      if (soundEnabled) playSoundEffect('hint')
      setIsNarrating(true)
      const narrationText = `${obj.name}. ${obj.scene}. ${obj.sensory}. ${obj.prompt}`
      speakSingAlong(narrationText, 'en-IN')
    }
  }

  if (phase === 'memory') return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-amber/5 px-6 py-10 gap-6 text-center animate-fadeUp">
      <span className="text-[110px] leading-none">{obj.emoji}</span>
      <div>
        <p className="font-serif text-bark text-4xl font-bold">{obj.name}</p>
        <p className="text-bark/50 text-xl font-serif italic">{obj.localName}</p>
      </div>

      <div className="bg-white rounded-3xl p-7 border border-sand max-w-sm text-left shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <p className="text-bark/50 text-lg font-bold tracking-wide uppercase">A Cherished Memory</p>
          <button
            onClick={toggleNarration}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95 ${
              isNarrating ? 'bg-forest text-white animate-pulse' : 'bg-sand/60 text-bark hover:bg-sand'
            }`}
          >
            <span>{isNarrating ? '⏹️ Stop' : '🔊 Listen'}</span>
          </button>
        </div>
        <p className="text-bark text-2xl leading-relaxed">{obj.scene}</p>
        <p className="text-bark/60 text-xl mt-4 italic border-t border-sand/60 pt-3">{obj.sensory}</p>
      </div>

      <div className="bg-forest/10 rounded-2xl px-6 py-4 border border-forest/20 max-w-sm w-full">
        <p className="text-forest text-xl font-semibold">💬 {obj.prompt}</p>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-sm">
        <BigBtn onClick={next} color="forest" full>Show me another memory →</BigBtn>
        <BackBar onBack={handleBack} />
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex flex-col bg-parchment">
      <CelebrationOverlay key={celebKey} active={celebrating} message={message} />
      <BackBar onBack={handleBack} />
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-6 gap-8 text-center animate-fadeUp">
        <p className="text-bark/50 text-2xl">Do you recognise this?</p>
        <span className="text-[150px] leading-none">{obj.emoji}</span>
        <div>
          <p className="font-serif text-bark text-5xl font-bold">{obj.name}</p>
          <p className="text-bark/50 text-2xl font-serif italic mt-2">{obj.localName}</p>
        </div>
        <div className="flex flex-col gap-4 w-full max-w-sm">
          <BigBtn onClick={() => {
            if (soundEnabled) playSoundEffect('match')
            celebrate()
            recordActivity('Remember This')
            setPhase('memory')
          }} color="amber" full>❤️  Yes, I remember this</BigBtn>
          <BigBtn onClick={next} color="white" full>Show me another →</BigBtn>
        </div>
      </div>
    </div>
  )
}

// ─── Music game ────────────────────────────────────────────────────────────────

function extractYoutubeId(input: string): string | null {
  if (!input) return null
  const trimmed = input.trim()
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed
  const match = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/)
  return match ? match[1] : null
}

function MusicGame({ onBack, soundEnabled, recordActivity, language }: { onBack: () => void; soundEnabled: boolean; recordActivity: (n: string) => void; language: Language }) {
  const [idx, setIdx] = useState(0)
  const [phase, setPhase] = useState<MusicPhase>('intro')
  const [filter, setFilter] = useState<'lang' | 'popular' | 'angrybirds' | 'all'>('lang')
  const [showLyricsSheet, setShowLyricsSheet] = useState(false)
  const [scriptMode, setScriptMode] = useState<'native' | 'roman'>('native')
  const [isSinging, setIsSinging] = useState(false)
  const [showYoutube, setShowYoutube] = useState(false)
  const [customYtModal, setCustomYtModal] = useState(false)
  const [customYtInput, setCustomYtInput] = useState('')
  const [customTrack, setCustomTrack] = useState<MusicTrack | null>(null)

  const { play, stop } = useMelodyPlayer()
  const { celebrating, message, celebKey, celebrate } = useCelebration(soundEnabled)

  // Filtered playlist based on active filter
  const playlist = useMemo(() => {
    let list = MUSIC_TRACKS
    if (filter === 'popular') {
      list = MUSIC_TRACKS.filter(t => t.isPopular)
    } else if (filter === 'angrybirds') {
      list = MUSIC_TRACKS.filter(t => t.id.startsWith('angry-birds'))
    } else if (filter === 'lang') {
      const myLang = MUSIC_TRACKS.filter(t => t.lang === language)
      const others = MUSIC_TRACKS.filter(t => t.lang !== language)
      list = [...myLang, ...others]
    }
    return customTrack ? [customTrack, ...list] : list
  }, [filter, language, customTrack])

  const track = playlist[idx % playlist.length]

  const handlePlay = () => {
    setShowYoutube(false)
    setPhase('playing')
    play(track.notes, track.bpm, () => {
      celebrate()
      recordActivity('Music')
      setPhase('responded')
      setIsSinging(false)
      stopSingAlong()
    })
  }

  const handleSingAlong = () => {
    setShowYoutube(false)
    setIsSinging(true)
    handlePlay()
    const lyricsToRead = track.fullLyrics ? track.fullLyrics.join('. ') : track.lyric
    const speechLang = track.lang === 'english' ? 'en-IN' : track.lang === 'bengali' ? 'bn-IN' : track.lang === 'assamese' ? 'as-IN' : 'hi-IN'
    speakSingAlong(lyricsToRead, speechLang)
  }

  const handlePlayYoutube = () => {
    stop()
    stopSingAlong()
    setIsSinging(false)
    setShowYoutube(true)
    setPhase('intro')
    recordActivity('Music')
  }

  const handleStop = () => {
    stop()
    stopSingAlong()
    setIsSinging(false)
    celebrate()
    recordActivity('Music')
    setPhase('responded')
  }

  const nextTrack = () => {
    stop()
    stopSingAlong()
    setIsSinging(false)
    setShowYoutube(false)
    setIdx(i => i + 1)
    setPhase('intro')
  }

  const prevTrack = () => {
    stop()
    stopSingAlong()
    setIsSinging(false)
    setShowYoutube(false)
    setIdx(i => (i - 1 + playlist.length) % playlist.length)
    setPhase('intro')
  }

  useEffect(() => {
    setPhase('intro')
    stop()
    stopSingAlong()
    setIsSinging(false)
    setShowYoutube(false)
  }, [idx, stop, filter])

  const isCurrentLang = track.lang === language

  if (phase === 'responded') return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-amber/10 px-8 py-12 text-center gap-7 animate-fadeUp">
      <span className="text-[110px] leading-none">{track.emoji}</span>
      <div>
        {track.isPopular && (
          <span className="inline-block bg-amber text-bark text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2 mr-2">
            🔥 Popular Hit
          </span>
        )}
        {isCurrentLang && (
          <span className="inline-block bg-forest/20 text-forest text-sm font-bold px-3.5 py-1 rounded-full border border-forest/30 mb-2">
            ⭐ In Your Language
          </span>
        )}
        <p className="text-bark/50 text-xl">{track.artist ? `${track.artist} · ${track.region}` : track.region}</p>
        <p className="font-serif text-bark text-4xl font-bold mt-1 leading-tight">{track.title}</p>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-sand max-w-sm text-left shadow-sm">
        <p className="text-bark/50 text-lg font-bold uppercase tracking-wide mb-2">{track.instrument}</p>
        <p className="text-bark text-xl leading-relaxed">{track.scene}</p>
      </div>

      <div className="bg-forest/10 rounded-3xl px-6 py-5 border border-forest/20 max-w-sm w-full font-serif text-center">
        <p className="text-bark text-xl font-semibold leading-relaxed whitespace-pre-line">{track.lyric}</p>
        {track.romanLyric && (
          <p className="text-bark/60 text-base mt-2 font-sans italic">{track.romanLyric}</p>
        )}
        <p className="text-bark/50 text-sm mt-3 border-t border-forest/20 pt-2">{track.lyricEng}</p>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-sm">
        {track.youtubeId && (
          <button
            type="button"
            onClick={handlePlayYoutube}
            className="w-full py-4 bg-[#E62117] hover:bg-[#CC181E] text-white font-bold text-xl rounded-2xl active:scale-95 shadow-md flex items-center justify-center gap-2"
          >
            <span>▶</span> Watch on YouTube
          </button>
        )}
        <button
          onClick={() => setShowLyricsSheet(true)}
          className="w-full py-4 bg-white border-2 border-forest text-forest font-bold text-xl rounded-2xl active:scale-95 shadow-sm flex items-center justify-center gap-2"
        >
          📜 View Full Sing-Along Lyrics
        </button>
        <BigBtn onClick={nextTrack} color="forest" full>Play the next song →</BigBtn>
      </div>
      <BackBar onBack={() => { stop(); stopSingAlong(); onBack() }} />

      {/* Full Lyrics Modal */}
      {showLyricsSheet && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeUp">
          <div className="bg-white rounded-3xl max-w-md w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl border-2 border-sand">
            <div className="p-6 bg-cream border-b border-sand flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-forest uppercase tracking-wider">Full Song Lyrics</p>
                <h3 className="font-serif text-2xl font-bold text-bark mt-0.5">{track.title}</h3>
                {track.artist && <p className="text-bark/60 text-sm">{track.artist}</p>}
              </div>
              <button
                onClick={() => setShowLyricsSheet(false)}
                className="w-10 h-10 rounded-full bg-sand flex items-center justify-center font-bold text-bark hover:bg-sand/70"
              >
                ✕
              </button>
            </div>

            {/* Script Toggle if romanized available */}
            {track.romanLyric && (
              <div className="flex bg-sand/30 p-2 gap-2 border-b border-sand px-6">
                <button
                  onClick={() => setScriptMode('native')}
                  className={`flex-1 py-1.5 rounded-lg text-sm font-bold transition-all ${
                    scriptMode === 'native' ? 'bg-forest text-white' : 'text-bark/60'
                  }`}
                >
                  Original Script
                </button>
                <button
                  onClick={() => setScriptMode('roman')}
                  className={`flex-1 py-1.5 rounded-lg text-sm font-bold transition-all ${
                    scriptMode === 'roman' ? 'bg-forest text-white' : 'text-bark/60'
                  }`}
                >
                  Roman English (Sing Along)
                </button>
              </div>
            )}

            <div className="p-6 overflow-auto space-y-4 flex-1">
              <div className="bg-forest/5 p-5 rounded-2xl border border-forest/15">
                <p className="font-serif text-bark text-2xl font-medium leading-loose whitespace-pre-line text-center">
                  {scriptMode === 'roman' && track.romanLyric ? track.romanLyric : (track.fullLyrics ? track.fullLyrics.join('\n\n') : track.lyric)}
                </p>
              </div>

              <div className="bg-amber/10 p-4 rounded-xl border border-amber/20">
                <p className="text-xs font-bold text-bark/60 uppercase mb-1">English Meaning</p>
                <p className="text-bark/80 text-sm italic">{track.lyricEng}</p>
              </div>
            </div>

            <div className="p-4 bg-cream border-t border-sand">
              <button
                onClick={() => setShowLyricsSheet(false)}
                className="w-full py-4 bg-forest text-white font-bold text-lg rounded-xl active:scale-95"
              >
                Close Lyrics
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className="min-h-screen flex flex-col bg-parchment">
      <CelebrationOverlay key={celebKey} active={celebrating} message={message} />
      <BackBar onBack={() => { stop(); stopSingAlong(); onBack() }} />

      {/* Category Filter Tabs + Custom Link Button */}
      <div className="px-5 pt-1 pb-3 flex gap-2 overflow-x-auto items-center justify-start md:justify-center">
        <button
          onClick={() => { setFilter('lang'); setIdx(0) }}
          className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
            filter === 'lang'
              ? 'bg-forest text-white shadow-sm'
              : 'bg-white text-bark/70 border border-sand hover:bg-sand'
          }`}
        >
          ⭐ In Your Language
        </button>
        <button
          onClick={() => { setFilter('popular'); setIdx(0) }}
          className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
            filter === 'popular'
              ? 'bg-forest text-white shadow-sm'
              : 'bg-white text-bark/70 border border-sand hover:bg-sand'
          }`}
        >
          🔥 Popular Hits
        </button>
        <button
          onClick={() => { setFilter('angrybirds'); setIdx(0) }}
          className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
            filter === 'angrybirds'
              ? 'bg-forest text-white shadow-sm'
              : 'bg-white text-bark/70 border border-sand hover:bg-sand'
          }`}
        >
          🐦 Angry Birds
        </button>
        <button
          onClick={() => { setFilter('all'); setIdx(0) }}
          className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
            filter === 'all'
              ? 'bg-forest text-white shadow-sm'
              : 'bg-white text-bark/70 border border-sand hover:bg-sand'
          }`}
        >
          🎶 All ({playlist.length})
        </button>
        <button
          onClick={() => setCustomYtModal(true)}
          className="px-3.5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all bg-[#E62117]/10 text-[#E62117] border border-[#E62117]/30 hover:bg-[#E62117]/20 flex items-center gap-1.5"
        >
          <span>➕</span> Paste YouTube Link
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-4 gap-5 text-center animate-fadeUp">
        {/* Track counter & tag */}
        <div className="flex items-center justify-between w-full max-w-xs px-2">
          <span className="text-bark/40 text-sm font-bold">
            Song {(idx % playlist.length) + 1} of {playlist.length}
          </span>
          <div className="flex gap-1.5">
            {track.youtubeId && (
              <span className="bg-[#E62117]/15 text-[#E62117] text-xs font-bold px-2 py-0.5 rounded-full border border-[#E62117]/20">
                ▶ YouTube
              </span>
            )}
            {track.isPopular && (
              <span className="bg-amber/30 text-bark text-xs font-bold px-2.5 py-0.5 rounded-full">
                🔥 Popular
              </span>
            )}
            {isCurrentLang && (
              <span className="bg-forest/15 text-forest text-xs font-bold px-2.5 py-0.5 rounded-full border border-forest/30">
                ⭐ Language
              </span>
            )}
          </div>
        </div>

        {/* Media Player: YouTube Video OR Big Emoji */}
        {showYoutube && track.youtubeId ? (
          <div className="w-full max-w-sm flex flex-col items-center gap-2">
            <div className="w-full aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-black">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${track.youtubeId}?autoplay=1&rel=0`}
                title={track.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <div className="flex items-center justify-between w-full px-2">
              <span className="text-forest text-xs font-bold flex items-center gap-1">
                <span>🔊</span> Playing original audio
              </span>
              <button
                type="button"
                onClick={() => setShowYoutube(false)}
                className="text-xs font-bold px-3 py-1 bg-sand text-bark rounded-full hover:bg-sand/70 active:scale-95"
              >
                ✕ Close Video
              </button>
            </div>
          </div>
        ) : (
          <span className="text-[95px] leading-none">{track.emoji}</span>
        )}

        <div>
          <p className="text-bark/50 text-lg">{track.artist ? `${track.artist} · ${track.region}` : track.region}</p>
          <p className="font-serif text-bark text-3xl font-bold mt-0.5 leading-tight">{track.title}</p>
          <p className="text-bark/50 text-base mt-0.5">{track.instrument}</p>
        </div>

        {phase === 'playing' ? (
          <>
            <div className="flex items-end justify-center gap-2 h-16 px-4">
              {Array.from({ length: 16 }).map((_, i) => (
                <div
                  key={i}
                  className="wave-bar"
                  style={{ animationDelay: `${i * 0.07}s`, animationDuration: `${0.42 + (i % 5) * 0.14}s` }}
                />
              ))}
            </div>
            <p className="text-rose text-2xl font-bold">
              {isSinging ? '🎤 Singing Along with You...' : '♪ Playing Melody...'}
            </p>

            {/* Live Lyric Box while playing */}
            <div className="bg-forest/10 rounded-3xl p-5 border border-forest/20 max-w-xs font-serif text-center">
              <p className="text-bark text-2xl font-semibold leading-relaxed whitespace-pre-line">
                {track.lyric}
              </p>
              {track.romanLyric && (
                <p className="text-bark/60 text-base mt-2 font-sans italic">{track.romanLyric}</p>
              )}
            </div>

            <BigBtn onClick={handleStop} color="white" full>⏹  Stop</BigBtn>
          </>
        ) : (
          <>
            {/* Song Lyric Preview Box */}
            <div className="bg-forest/10 rounded-3xl p-5 border border-forest/20 max-w-xs font-serif text-center relative shadow-sm">
              <p className="text-bark text-xl font-semibold leading-relaxed whitespace-pre-line">{track.lyric}</p>
              {track.romanLyric && (
                <p className="text-bark/60 text-sm mt-2 font-sans italic">{track.romanLyric}</p>
              )}
              <p className="text-bark/50 text-xs mt-2.5 border-t border-forest/15 pt-2">{track.lyricEng}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2.5 w-full max-w-xs">
              {track.youtubeId && !showYoutube && (
                <button
                  type="button"
                  onClick={handlePlayYoutube}
                  className="w-full py-3.5 bg-[#E62117] hover:bg-[#CC181E] text-white font-bold text-lg rounded-2xl active:scale-95 shadow-md flex items-center justify-center gap-2 transition-transform"
                >
                  <span className="text-xl leading-none">▶</span> Play Original (YouTube)
                </button>
              )}

              <BigBtn onClick={handlePlay} color="amber" full>🎵  Play Melody</BigBtn>
              
              <button
                type="button"
                onClick={handleSingAlong}
                className="w-full py-3.5 bg-forest text-white font-bold text-lg rounded-2xl active:scale-95 shadow-md flex items-center justify-center gap-2"
              >
                🎤 Sing Along (With Vocals)
              </button>

              <button
                type="button"
                onClick={() => setShowLyricsSheet(true)}
                className="w-full py-3 bg-white border-2 border-forest/40 text-forest font-bold text-base rounded-2xl active:scale-95 shadow-sm"
              >
                📜 Read Full Lyrics
              </button>

              {/* Prev / Next Track */}
              <div className="flex gap-2 w-full pt-0.5">
                <button
                  type="button"
                  onClick={prevTrack}
                  className="flex-1 py-2.5 bg-white border border-sand rounded-xl font-bold text-base text-bark active:scale-95 shadow-sm"
                >
                  ← Prev
                </button>
                <button
                  type="button"
                  onClick={nextTrack}
                  className="flex-1 py-2.5 bg-white border border-sand rounded-xl font-bold text-base text-bark active:scale-95 shadow-sm"
                >
                  Next →
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Full Lyrics Modal */}
      {showLyricsSheet && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeUp">
          <div className="bg-white rounded-3xl max-w-md w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl border-2 border-sand">
            <div className="p-6 bg-cream border-b border-sand flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-forest uppercase tracking-wider">Full Song Lyrics</p>
                <h3 className="font-serif text-2xl font-bold text-bark mt-0.5">{track.title}</h3>
                {track.artist && <p className="text-bark/60 text-sm">{track.artist}</p>}
              </div>
              <button
                onClick={() => setShowLyricsSheet(false)}
                className="w-10 h-10 rounded-full bg-sand flex items-center justify-center font-bold text-bark hover:bg-sand/70"
              >
                ✕
              </button>
            </div>

            {/* Script Toggle if romanized available */}
            {track.romanLyric && (
              <div className="flex bg-sand/30 p-2 gap-2 border-b border-sand px-6">
                <button
                  onClick={() => setScriptMode('native')}
                  className={`flex-1 py-1.5 rounded-lg text-sm font-bold transition-all ${
                    scriptMode === 'native' ? 'bg-forest text-white' : 'text-bark/60'
                  }`}
                >
                  Original Script
                </button>
                <button
                  onClick={() => setScriptMode('roman')}
                  className={`flex-1 py-1.5 rounded-lg text-sm font-bold transition-all ${
                    scriptMode === 'roman' ? 'bg-forest text-white' : 'text-bark/60'
                  }`}
                >
                  Roman English (Sing Along)
                </button>
              </div>
            )}

            <div className="p-6 overflow-auto space-y-4 flex-1">
              {track.youtubeId && !showYoutube && (
                <button
                  type="button"
                  onClick={() => { setShowLyricsSheet(false); handlePlayYoutube() }}
                  className="w-full py-3 bg-[#E62117] text-white font-bold text-base rounded-xl active:scale-95 flex items-center justify-center gap-2 shadow-sm"
                >
                  ▶ Watch Video While Reading Lyrics
                </button>
              )}

              <div className="bg-forest/5 p-5 rounded-2xl border border-forest/15">
                <p className="font-serif text-bark text-2xl font-medium leading-loose whitespace-pre-line text-center">
                  {scriptMode === 'roman' && track.romanLyric ? track.romanLyric : (track.fullLyrics ? track.fullLyrics.join('\n\n') : track.lyric)}
                </p>
              </div>

              <div className="bg-amber/10 p-4 rounded-xl border border-amber/20">
                <p className="text-xs font-bold text-bark/60 uppercase mb-1">English Meaning</p>
                <p className="text-bark/80 text-sm italic">{track.lyricEng}</p>
              </div>
            </div>

            <div className="p-4 bg-cream border-t border-sand flex gap-2">
              <button
                onClick={() => { setShowLyricsSheet(false); handleSingAlong() }}
                className="flex-1 py-3.5 bg-forest text-white font-bold text-base rounded-xl active:scale-95 flex items-center justify-center gap-2"
              >
                🎤 Sing Along Now
              </button>
              <button
                onClick={() => setShowLyricsSheet(false)}
                className="px-5 py-3.5 bg-sand text-bark font-bold text-base rounded-xl active:scale-95"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom YouTube Link Modal */}
      {customYtModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeUp">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-2 border-sand flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-2xl font-bold text-bark flex items-center gap-2">
                <span className="text-[#E62117]">▶</span> Play Any YouTube Song
              </h3>
              <button
                onClick={() => setCustomYtModal(false)}
                className="w-9 h-9 rounded-full bg-sand flex items-center justify-center font-bold text-bark hover:bg-sand/70"
              >
                ✕
              </button>
            </div>
            <p className="text-bark/70 text-sm leading-relaxed">
              Caregivers and family members can paste any YouTube song link, prayer, bhajan, or folk music URL to play it directly in the app.
            </p>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase text-bark/60 tracking-wider">
                YouTube URL or Video ID
              </label>
              <input
                type="text"
                value={customYtInput}
                onChange={e => setCustomYtInput(e.target.value)}
                placeholder="e.g. https://www.youtube.com/watch?v=... or ID"
                className="w-full px-4 py-3.5 border-2 border-sand rounded-xl text-base focus:border-forest outline-none text-bark font-mono"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCustomYtModal(false)}
                className="flex-1 py-3 bg-sand text-bark font-bold text-base rounded-xl active:scale-95"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const vidId = extractYoutubeId(customYtInput)
                  if (!vidId) {
                    alert('Please enter a valid YouTube video URL or ID (e.g. https://www.youtube.com/watch?v=...)')
                    return
                  }
                  const customItem: MusicTrack = {
                    id: `custom-${Date.now()}`,
                    emoji: '🎵',
                    title: 'Caregiver Song Choice',
                    artist: 'YouTube Video',
                    region: 'Caregiver Memory Playlist',
                    instrument: 'Original YouTube Audio',
                    lyric: 'Playing your personalized song from YouTube.\nSing along with your loved one!',
                    lyricEng: 'Personal memory song selected for comfort and familiar recall.',
                    scene: 'Comforting music chosen especially by family to bring smiles and peaceful nostalgia.',
                    notes: [329.63, 392, 440, 493.88, 523.25, 493.88, 440, 392],
                    bpm: 80,
                    youtubeId: vidId
                  }
                  setCustomTrack(customItem)
                  setIdx(0)
                  setCustomYtModal(false)
                  setCustomYtInput('')
                  setShowYoutube(true)
                  stop()
                  stopSingAlong()
                  recordActivity('Music')
                }}
                className="flex-1 py-3 bg-forest text-white font-bold text-base rounded-xl active:scale-95 shadow-md flex items-center justify-center gap-1.5"
              >
                <span>▶</span> Play Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Dear Diary ────────────────────────────────────────────────────────────────

const DIARY_PROMPTS = [
  'Tell me about a Bihu morning you remember',
  'What did your mother cook on the chula?',
  'Share a memory from your childhood home',
  'Who did you love most when you were young?',
  'What festival do you remember most clearly?',
]

function DiaryGame({ onBack, recordActivity, saveMemory, onViewMemories }: {
  onBack: () => void
  recordActivity: (n: string) => void
  saveMemory: (meta: Omit<SavedMemory, 'id'>, blob?: Blob | null) => Promise<string>
  onViewMemories: () => void
}) {
  const [phase, setPhase] = useState<DiaryPhase>('ready')
  const [prompt, setPrompt] = useState<string | null>(null)
  const [seconds, setSeconds] = useState(0)
  const [mood, setMood] = useState<string | null>(null)
  const [moodLabel, setMoodLabel] = useState<string | null>(null)
  const [micError, setMicError] = useState<string | null>(null)
  const [playbackUrl, setPlaybackUrl] = useState<string | null>(null)
  const [pbPlaying, setPbPlaying] = useState(false)
  const [pbElapsed, setPbElapsed] = useState(0)

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const recordedBlobRef = useRef<Blob | null>(null)
  const pbAudioRef = useRef<HTMLAudioElement | null>(null)

  // Revoke blob URL on unmount or re-record
  useEffect(() => {
    return () => {
      pbAudioRef.current?.pause()
      if (playbackUrl) URL.revokeObjectURL(playbackUrl)
    }
  }, [playbackUrl])

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  // ─── Start recording ───

  const start = async () => {
    setSeconds(0)
    setMicError(null)
    setPlaybackUrl(null)
    setPbPlaying(false)
    setPbElapsed(0)
    chunksRef.current = []
    recordedBlobRef.current = null
    pbAudioRef.current?.pause()
    pbAudioRef.current = null

    try {
      // Check for secure context (required for getUserMedia)
      if (!window.isSecureContext) {
        throw new DOMException(
          'getUserMedia requires a secure context (HTTPS or localhost)',
          'SecurityError'
        )
      }
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new TypeError('navigator.mediaDevices.getUserMedia is not available')
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })

      // Verify we actually got an audio track
      if (stream.getAudioTracks().length === 0) {
        stream.getTracks().forEach(t => t.stop())
        throw new DOMException('No audio tracks in returned stream', 'NotFoundError')
      }

      streamRef.current = stream

      // Pick the best supported MIME type in priority order
      const candidates = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/ogg;codecs=opus',
        'audio/ogg',
        'audio/mp4',
      ]
      const mimeType = candidates.find(t => MediaRecorder.isTypeSupported(t)) ?? ''
      const options: MediaRecorderOptions = mimeType ? { mimeType } : {}

      const mr = new MediaRecorder(stream, options)
      mediaRecorderRef.current = mr

      mr.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data)
      }

      mr.start(200) // 200ms timeslice — reliable across browsers

      // ONLY enter recording state after mic + recorder are confirmed working
      setPhase('recording')
      timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000)

    } catch (err: unknown) {
      // Clean up any partial stream
      streamRef.current?.getTracks().forEach(t => t.stop())
      streamRef.current = null
      mediaRecorderRef.current = null

      const domErr = err instanceof DOMException ? err : null
      const errName = domErr?.name ?? (err instanceof TypeError ? 'TypeError' : 'Unknown')

      console.error('Dear Diary — microphone error:', errName, err)

      // Detect iframe restriction
      const inIframe = window.self !== window.top

      let message: string
      switch (errName) {
        case 'NotAllowedError':
          message = inIframe
            ? 'Microphone access is blocked in this preview. Please open the app directly in your browser to record.'
            : 'Microphone permission was denied. Please allow microphone access in your browser settings and try again.'
          break
        case 'NotFoundError':
          message = 'No microphone was found on this device. Please connect a microphone and try again.'
          break
        case 'NotReadableError':
          message = 'Your microphone is busy or unavailable. Please close other apps using the microphone and try again.'
          break
        case 'SecurityError':
          message = 'Microphone recording requires a secure connection (HTTPS). Please open the app in a supported browser.'
          break
        case 'TypeError':
          message = 'Your browser does not support audio recording. Please use a modern browser like Chrome or Edge.'
          break
        default:
          message = inIframe
            ? 'Microphone access is not available in this preview environment. Please open the app directly in your browser.'
            : 'Something went wrong with the microphone. Please try again.'
      }

      setMicError(message)
      // Do NOT enter recording phase — stay on 'ready'
    }
  }

  // ─── Stop recording ───

  const stop = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    setPhase('stopping')

    const mr = mediaRecorderRef.current
    if (!mr || mr.state === 'inactive') {
      // No recorder running — go straight to mood selection
      mediaRecorderRef.current = null
      streamRef.current?.getTracks().forEach(t => t.stop())
      streamRef.current = null
      setPhase('done')
      return
    }

    mediaRecorderRef.current = null

    // onstop fires after requestData() + stop() complete — blob guaranteed ready here
    mr.addEventListener('stop', () => {
      streamRef.current?.getTracks().forEach(t => t.stop())
      streamRef.current = null

      if (chunksRef.current.length > 0) {
        // Use the recorder's actual mimeType for the blob
        const blob = new Blob(chunksRef.current, { type: mr.mimeType || 'audio/webm' })
        recordedBlobRef.current = blob
        const url = URL.createObjectURL(blob)
        setPlaybackUrl(url)
        setPhase('playback')
      } else {
        // No data captured (mic blocked or stopped immediately) — skip to mood
        setPhase('done')
      }
    }, { once: true })

    mr.requestData() // flush any buffered audio before stopping
    mr.stop()
  }

  // ─── Playback preview controls ───

  const startPlayback = () => {
    if (!playbackUrl) return
    const audio = new Audio(playbackUrl)
    pbAudioRef.current = audio
    audio.onended = () => { setPbPlaying(false); setPbElapsed(0) }
    audio.ontimeupdate = () => setPbElapsed(Math.floor(audio.currentTime))
    audio.play()
    setPbPlaying(true)
  }

  const togglePlayback = () => {
    const a = pbAudioRef.current
    if (!a) { startPlayback(); return }
    if (pbPlaying) { a.pause(); setPbPlaying(false) }
    else { a.play(); setPbPlaying(true) }
  }

  // ─── Save ───

  const handleSave = async () => {
    pbAudioRef.current?.pause()
    recordActivity('Dear Diary')
    const title = prompt
      ? (prompt.length > 42 ? prompt.slice(0, 40) + '…' : prompt)
      : 'A memory I shared'
    await saveMemory(
      { title, date: new Date().toISOString(), duration: seconds, mood, moodLabel, prompt, hasAudio: !!recordedBlobRef.current },
      recordedBlobRef.current
    )
    setPhase('saved')
  }

  const reset = () => {
    pbAudioRef.current?.pause()
    setPhase('ready')
    setMood(null); setMoodLabel(null); setPrompt(null)
    setPlaybackUrl(null); setPbPlaying(false); setPbElapsed(0)
  }

  const MOODS = [
    { emoji: '😊', label: 'Happy' },
    { emoji: '😌', label: 'Peaceful' },
    { emoji: '😔', label: 'Sad' },
    { emoji: '😤', label: 'Restless' },
  ]

  // ─── Saved confirmation ───
  if (phase === 'saved') return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-forest/5 px-8 py-12 text-center gap-7 animate-fadeUp">
      <span className="text-[110px] leading-none">📔</span>
      <div>
        <p className="font-serif text-bark text-4xl font-bold">✅ Your memory was saved!</p>
        <p className="text-bark/60 text-xl mt-2 leading-relaxed max-w-xs mx-auto">
          🔒 Private Memory — kept safely on this device.
        </p>
      </div>
      {mood && <p className="text-6xl">{mood}</p>}
      <div className="flex flex-col gap-4 w-full max-w-xs">
        <BigBtn onClick={onViewMemories} color="forest" full>📖 View Saved Memories</BigBtn>
        <BigBtn onClick={reset} color="white" full>Record another memory</BigBtn>
      </div>
      <BackBar onBack={onBack} />
    </div>
  )

  // ─── Mood selection + save ───
  if (phase === 'done') return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-parchment px-8 py-12 gap-8 animate-fadeUp">
      <p className="font-serif text-bark text-4xl font-bold text-center">How are you feeling?</p>
      <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
        {MOODS.map(m => (
          <button key={m.emoji}
            onClick={() => { setMood(m.emoji === mood ? null : m.emoji); setMoodLabel(m.emoji === mood ? null : m.label) }}
            className={`flex flex-col items-center justify-center gap-3 rounded-3xl py-7 border-2 transition-all active:scale-95 ${mood === m.emoji ? 'bg-amber border-amber' : 'bg-white border-sand'}`}
          >
            <span className="text-6xl leading-none">{m.emoji}</span>
            <span className="text-bark text-xl font-bold">{m.label}</span>
          </button>
        ))}
      </div>
      <BigBtn onClick={handleSave} color="forest" full>✅ Save my memory</BigBtn>
      <p className="text-bark/40 text-lg">You can skip mood selection — just tap Save</p>
    </div>
  )

  // ─── Playback preview before saving ───
  if (phase === 'playback') {
    const progress = seconds > 0 ? Math.min(pbElapsed / seconds, 1) : 0
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-parchment px-8 py-12 gap-7 text-center animate-fadeUp">
        <span className="text-[90px] leading-none">🎙️</span>
        <div>
          <p className="font-serif text-bark text-4xl font-bold">Listen before saving</p>
          <p className="text-bark/60 text-2xl mt-1">Does it sound right?</p>
        </div>

        {/* Playback player */}
        <div className="bg-white rounded-2xl border border-sand p-6 w-full max-w-xs flex flex-col gap-4">
          <div className="relative h-3 bg-sand rounded-full overflow-hidden">
            <div className="absolute left-0 top-0 h-full bg-rose rounded-full transition-all" style={{ width: `${progress * 100}%` }} />
          </div>
          <div className="flex justify-between text-bark/50 text-lg font-mono">
            <span>{fmt(pbElapsed)}</span>
            <span>{fmt(seconds)}</span>
          </div>
          <button
            onClick={togglePlayback}
            className="w-20 h-20 mx-auto rounded-full bg-rose text-parchment text-4xl flex items-center justify-center shadow-lg active:scale-95 transition-transform"
            aria-label={pbPlaying ? 'Pause' : 'Play recording'}
          >
            {pbPlaying ? '⏸' : '▶'}
          </button>
        </div>

        <div className="flex flex-col gap-4 w-full max-w-xs">
          <BigBtn onClick={() => { pbAudioRef.current?.pause(); setPhase('done') }} color="forest" full>
            Sounds good → Continue
          </BigBtn>
          <BigBtn onClick={reset} color="white" full>Record again</BigBtn>
        </div>
      </div>
    )
  }

  // ─── Stopping (brief transition state) ───
  if (phase === 'stopping') return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-rose/5 px-8 py-12 gap-8 text-center">
      <div className="w-20 h-20 rounded-full border-4 border-rose border-t-transparent animate-spin" />
      <p className="text-bark/60 text-2xl font-semibold">Saving your recording…</p>
    </div>
  )

  // ─── Recording ───
  if (phase === 'recording') return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-rose/5 px-8 py-12 gap-8 text-center animate-fadeUp">
      <p className="text-rose text-2xl font-bold">Recording your words...</p>
      {prompt && (
        <div className="bg-white rounded-2xl px-6 py-4 border border-sand max-w-xs">
          <p className="text-bark text-2xl font-serif italic">"{prompt}"</p>
        </div>
      )}
      <div className="flex items-end justify-center gap-2 h-20">
        {Array.from({ length: 18 }).map((_, i) => (
          <div key={i} className="wave-bar" style={{ animationDelay: `${i * 0.06}s`, animationDuration: `${0.45 + (i % 4) * 0.12}s` }} />
        ))}
      </div>
      <p className="font-mono text-bark text-6xl font-bold tracking-widest">{fmt(seconds)}</p>
      <p className="text-bark/50 text-2xl">Take your time. Say as much as you like.</p>
      <button
        onClick={stop}
        className="w-44 h-44 rounded-full bg-bark text-white text-6xl flex items-center justify-center shadow-2xl active:scale-95 transition-transform"
      >⏹</button>
      <p className="text-bark/60 text-2xl font-semibold">Tap to stop</p>
    </div>
  )

  // ─── Ready ───
  return (
    <div className="min-h-screen flex flex-col bg-parchment">
      <BackBar onBack={onBack} />
      <div className="flex-1 flex flex-col items-center justify-center px-7 py-6 gap-7 text-center animate-fadeUp">
        <span className="text-[110px] leading-none">📔</span>
        <div>
          <p className="font-serif text-bark text-5xl font-bold">Dear Diary</p>
          <p className="text-bark/60 text-2xl mt-3 leading-relaxed max-w-xs mx-auto">
            Speak any memory. Share a feeling. There are no wrong answers.
          </p>
        </div>
        <div className="w-full max-w-sm">
          <p className="text-bark/50 text-xl font-semibold mb-3">Choose a prompt (or just start talking):</p>
          <div className="flex flex-col gap-3">
            {DIARY_PROMPTS.map(p => (
              <button key={p} onClick={() => setPrompt(p === prompt ? null : p)}
                className={`rounded-2xl py-4 px-5 text-xl font-semibold border-2 text-left transition-all active:scale-95 ${prompt === p ? 'bg-terracotta text-parchment border-terracotta' : 'bg-white border-sand text-bark/70'}`}
              >{p}</button>
            ))}
          </div>
        </div>
        {micError && (
          <div className="bg-amber/20 rounded-2xl px-6 py-5 border border-amber/40 max-w-sm text-center">
            <p className="text-bark font-bold text-xl">🎙️ Could not access microphone</p>
            <p className="text-bark/70 text-lg mt-2 leading-relaxed">{micError}</p>
          </div>
        )}
        <button
          onClick={start}
          className="animate-record w-44 h-44 rounded-full bg-rose text-white text-7xl flex items-center justify-center shadow-2xl active:scale-95 transition-transform mt-2"
        >🎙️</button>
        <p className="text-bark/60 text-2xl font-semibold">{micError ? 'Tap to try again' : 'Tap to start recording'}</p>
      </div>
    </div>
  )
}

// ─── Orientation game ──────────────────────────────────────────────────────────

function OrientationGame({ onBack, soundEnabled, recordActivity }: { onBack: () => void; soundEnabled: boolean; recordActivity: (n: string) => void }) {
  const [questions] = useState(() => getDynamicOrientationQuestions())
  const [idx, setIdx] = useState(0)
  const [chosen, setChosen] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const { celebrating, message, celebKey, celebrate } = useCelebration(soundEnabled)

  const q = questions[idx % questions.length]

  const handleChoose = (opt: string) => {
    setChosen(opt)
    const isCorrect = opt === q.correct
    if (isCorrect) {
      if (soundEnabled) playSoundEffect('match')
      celebrate()
    } else {
      if (soundEnabled) playSoundEffect('tap')
    }
    recordActivity('Orientation')
  }

  const next = () => {
    setChosen(null)
    if (idx + 1 >= questions.length) {
      if (soundEnabled) playSoundEffect('fanfare')
      setDone(true)
    } else {
      if (soundEnabled) playSoundEffect('tap')
      setIdx(i => i + 1)
    }
  }

  if (done) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-amber/10 px-8 py-12 text-center gap-7 animate-fadeUp">
      <div className="text-[110px] leading-none animate-bounce">🌍</div>
      <p className="font-serif text-bark text-5xl font-bold">Orientation Complete!</p>
      <p className="text-bark/70 text-2xl max-w-sm leading-relaxed">
        Staying mindful of time, nature, and home keeps your spirit peaceful and grounded.
      </p>
      <div className="flex flex-col gap-4 w-full max-w-xs">
        <BigBtn onClick={() => { setIdx(0); setChosen(null); setDone(false) }} color="forest" full>Practice again</BigBtn>
        <BackBar onBack={onBack} />
      </div>
    </div>
  )

  const isChosenCorrect = chosen === q.correct

  return (
    <div className="min-h-screen flex flex-col bg-parchment">
      <CelebrationOverlay key={celebKey} active={celebrating} message={message} />
      <BackBar onBack={onBack} />
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-6 gap-6 text-center animate-fadeUp max-w-sm mx-auto w-full">
        <div className="text-bark/40 text-sm font-bold uppercase tracking-wider">
          Question {idx + 1} of {questions.length}
        </div>
        <span className="text-[100px] leading-none">{q.icon}</span>
        <p className="font-serif text-bark text-4xl font-bold leading-tight max-w-xs">{q.q}</p>
        {chosen === null ? (
          <div className="flex flex-col gap-3.5 w-full max-w-xs">
            {q.options.map((opt, i) => (
              <BigBtn
                key={i}
                onClick={() => handleChoose(opt)}
                color="white"
                full
              >
                {opt}
              </BigBtn>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6 animate-fadeUp w-full max-w-xs">
            <div className={`rounded-3xl p-7 border-2 text-center w-full ${isChosenCorrect ? 'bg-amber/20 border-amber/50' : 'bg-sand/30 border-sand'}`}>
              <p className="text-5xl mb-3">{isChosenCorrect ? '🌟' : '💛'}</p>
              <p className="font-serif text-bark text-3xl font-bold">
                {isChosenCorrect ? 'Wonderful!' : 'You said:'}
              </p>
              <p className="text-bark text-2xl mt-1 leading-snug font-medium">"{chosen}"</p>
              <p className="text-bark/75 text-xl mt-3 leading-relaxed">{q.feedback}</p>
            </div>
            <BigBtn onClick={next} color="forest" full>Next question →</BigBtn>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Memory Pairs game ─────────────────────────────────────────────────────────

type Card = { id: string; pairId: string; emoji: string; name: string; state: 'hidden' | 'revealed' | 'matched' }

function MemoryPairsGame({ onBack, soundEnabled, recordActivity }: { onBack: () => void; soundEnabled: boolean; recordActivity: (n: string) => void }) {
  const [level, setLevel] = useState<2 | 3 | 4>(2) // 2 pairs (4 cards), 3 pairs (6 cards), 4 pairs (8 cards)
  const [cards, setCards] = useState<Card[]>(() => buildCards(2))
  const [firstId, setFirstId] = useState<string | null>(null)
  const [locked, setLocked] = useState(false)
  const [praise, setPraise] = useState(false)
  const [moves, setMoves] = useState(0)
  const [peeking, setPeeking] = useState(false)
  const { celebrating, message, celebKey, celebrate } = useCelebration(soundEnabled)

  function buildCards(pairs: 2 | 3 | 4): Card[] {
    return shuffled(
      shuffled(PAIR_CARDS).slice(0, pairs).flatMap(p => [
        { id: `${p.pairId}-1`, pairId: p.pairId, emoji: p.emoji, name: p.name, state: 'hidden' as const },
        { id: `${p.pairId}-2`, pairId: p.pairId, emoji: p.emoji, name: p.name, state: 'hidden' as const },
      ])
    )
  }

  const tap = (card: Card) => {
    if (locked || peeking || card.state !== 'hidden') return

    if (soundEnabled) playSoundEffect('flip')
    const revealed = cards.map(c => c.id === card.id ? { ...c, state: 'revealed' as const } : c)
    setCards(revealed)

    if (!firstId) {
      setFirstId(card.id)
      return
    }

    setMoves(m => m + 1)
    setLocked(true)
    const first = revealed.find(c => c.id === firstId)!

    setTimeout(() => {
      if (first.pairId === card.pairId) {
        if (soundEnabled) playSoundEffect('match')
        const next = revealed.map(c => c.id === firstId || c.id === card.id ? { ...c, state: 'matched' as const } : c)
        setCards(next)
        celebrate()
        recordActivity('Memory Pairs')
        if (next.every(c => c.state === 'matched')) {
          if (soundEnabled) playSoundEffect('fanfare')
          setTimeout(() => setPraise(true), 1200)
        }
      } else {
        setCards(cs => cs.map(c => c.state === 'revealed' ? { ...c, state: 'hidden' as const } : c))
      }
      setFirstId(null)
      setLocked(false)
    }, 1200)
  }

  const handlePeek = () => {
    if (locked || peeking) return
    if (soundEnabled) playSoundEffect('hint')
    setPeeking(true)
    setTimeout(() => {
      setPeeking(false)
    }, 2200)
  }

  const restart = (nextLevel?: 2 | 3 | 4) => {
    const l = nextLevel ?? level
    setLevel(l)
    setCards(buildCards(l))
    setFirstId(null)
    setLocked(false)
    setPraise(false)
    setMoves(0)
    setPeeking(false)
  }

  if (praise) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-amber/10 px-8 py-12 text-center gap-7 animate-fadeUp">
      <div className="text-[120px] leading-none animate-bounce">🎉</div>
      <p className="font-serif text-bark text-5xl font-bold">All pairs found!</p>
      <p className="text-bark/70 text-2xl">
        Completed in <strong>{moves} tries</strong>. Your memory is shining today!
      </p>
      <div className="flex flex-col gap-4 w-full max-w-xs">
        {level === 2 && <BigBtn onClick={() => restart(3)} color="forest" full>Try 3 pairs (Balanced) →</BigBtn>}
        {level === 3 && <BigBtn onClick={() => restart(4)} color="forest" full>Try 4 pairs (Challenge) →</BigBtn>}
        <BigBtn onClick={() => restart()} color="amber" full>Play again</BigBtn>
        <BackBar onBack={onBack} />
      </div>
    </div>
  )

  const cols = level === 2 ? 'grid-cols-2' : level === 3 ? 'grid-cols-3' : 'grid-cols-4'

  return (
    <div className="min-h-screen flex flex-col bg-parchment">
      <CelebrationOverlay key={celebKey} active={celebrating} message={message} />
      <BackBar onBack={onBack} />
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-4 gap-5 animate-fadeUp max-w-md mx-auto w-full">
        <div className="text-center">
          <p className="font-serif text-bark text-4xl font-bold">Memory Pairs</p>
          <p className="text-bark/50 text-xl mt-1">Tap two cards to find matching treasures</p>
        </div>

        {/* Level Selector Tabs */}
        <div className="flex bg-sand/30 p-1.5 rounded-2xl gap-2 w-full max-w-xs justify-center border border-sand">
          <button
            onClick={() => restart(2)}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${level === 2 ? 'bg-forest text-white shadow-sm' : 'text-bark/60'}`}
          >
            2 Pairs
          </button>
          <button
            onClick={() => restart(3)}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${level === 3 ? 'bg-forest text-white shadow-sm' : 'text-bark/60'}`}
          >
            3 Pairs
          </button>
          <button
            onClick={() => restart(4)}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${level === 4 ? 'bg-forest text-white shadow-sm' : 'text-bark/60'}`}
          >
            4 Pairs
          </button>
        </div>

        {/* Status + Peek Hint */}
        <div className="flex items-center justify-between w-full px-2 text-bark/60 text-sm font-semibold">
          <span>{cards.filter(c => c.state === 'matched').length / 2} of {level} pairs</span>
          <span>Moves: {moves}</span>
          <button
            onClick={handlePeek}
            disabled={peeking || locked}
            className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${
              peeking ? 'bg-amber text-bark border-amber animate-pulse' : 'bg-white text-bark/70 border-sand hover:border-amber/50'
            }`}
          >
            {peeking ? '👀 Peeking...' : '💡 Peek Cards'}
          </button>
        </div>

        {/* Cards Grid */}
        <div className={`grid ${cols} gap-3.5 w-full`}>
          {cards.map(card => {
            const isShown = card.state === 'revealed' || card.state === 'matched' || peeking
            return (
              <button
                key={card.id}
                onClick={() => tap(card)}
                disabled={card.state !== 'hidden' || locked || peeking}
                className={`rounded-2xl flex flex-col items-center justify-center p-3 transition-all active:scale-95 min-h-[110px] border-2 shadow-sm ${
                  card.state === 'matched'
                    ? 'bg-forest/10 border-forest/40 opacity-75'
                    : isShown
                    ? 'bg-amber/20 border-amber shadow-md'
                    : 'bg-white border-sand hover:border-amber/40'
                }`}
              >
                {!isShown ? (
                  <span className="text-3xl">🌿</span>
                ) : (
                  <>
                    <span className="text-4xl leading-none">{card.emoji}</span>
                    <span className="text-bark text-sm font-bold mt-1 text-center truncate max-w-full">{card.name}</span>
                    {card.state === 'matched' && <span className="text-forest text-xs font-bold mt-0.5">✓ Matched</span>}
                  </>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── Category Sort game ────────────────────────────────────────────────────────

function CategorySortGame({ onBack, soundEnabled, recordActivity }: { onBack: () => void; soundEnabled: boolean; recordActivity: (n: string) => void }) {
  const [items] = useState(() => shuffled(SORT_ITEMS))
  const [idx, setIdx] = useState(0)
  const [feedback, setFeedback] = useState<{ correct: boolean; hint: string } | null>(null)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [done, setDone] = useState(false)
  const { celebrating, message, celebKey, celebrate } = useCelebration(soundEnabled)

  const item = items[idx]

  const pick = (bin: 0 | 1) => {
    const correct = bin === item.bin
    if (correct) {
      setScore(s => s + 1)
      setStreak(s => s + 1)
      if (soundEnabled) playSoundEffect('match')
      celebrate()
    } else {
      setStreak(0)
      if (soundEnabled) playSoundEffect('tap')
    }
    recordActivity('Kitchen or Field?')
    setFeedback({ correct, hint: item.hint })
    setShowHint(false)
  }

  const next = () => {
    setFeedback(null)
    setShowHint(false)
    if (idx + 1 >= items.length) {
      if (soundEnabled) playSoundEffect('fanfare')
      setDone(true)
    } else {
      if (soundEnabled) playSoundEffect('tap')
      setIdx(i => i + 1)
    }
  }

  if (done) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-amber/10 px-8 py-12 text-center gap-7 animate-fadeUp">
      <div className="text-[120px] leading-none animate-bounce">🌾</div>
      <p className="font-serif text-bark text-5xl font-bold">Sorting Master!</p>
      <p className="text-bark/70 text-2xl">
        You sorted <strong>{score} out of {items.length}</strong> items correctly.
      </p>
      <p className="text-bark/50 text-xl">Every simple exercise keeps your thoughts clear and active.</p>
      <BigBtn onClick={() => { setIdx(0); setScore(0); setStreak(0); setDone(false); setFeedback(null) }} color="forest" full>Play again</BigBtn>
      <BackBar onBack={onBack} />
    </div>
  )

  return (
    <div className="min-h-screen flex flex-col bg-parchment">
      <CelebrationOverlay key={celebKey} active={celebrating} message={message} />
      <BackBar onBack={onBack} />
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-6 gap-6 text-center animate-fadeUp max-w-md mx-auto w-full">
        <div>
          <p className="font-serif text-bark text-4xl font-bold">Kitchen or Field?</p>
          <div className="flex items-center justify-center gap-3 mt-1">
            <span className="text-bark/50 text-sm font-semibold">Item {idx + 1} of {items.length}</span>
            {streak >= 2 && (
              <span className="bg-amber text-bark text-xs font-bold px-2.5 py-0.5 rounded-full animate-bounce">
                🔥 {streak} in a row!
              </span>
            )}
          </div>
        </div>

        <span className="text-[120px] leading-none drop-shadow-sm">{item.emoji}</span>
        <div>
          <p className="font-serif text-bark text-5xl font-bold">{item.name}</p>
          <p className="text-bark/50 text-2xl font-serif italic mt-1">{item.localName}</p>
        </div>

        {!feedback ? (
          <>
            <p className="text-bark text-2xl font-medium">Where does this belong?</p>
            <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
              <BigBtn onClick={() => pick(0)} color="terracotta" full>🍳 Kitchen</BigBtn>
              <BigBtn onClick={() => pick(1)} color="forest" full>🌾 Field</BigBtn>
            </div>
            {!showHint ? (
              <button
                onClick={() => { setShowHint(true); if (soundEnabled) playSoundEffect('hint') }}
                className="text-bark/50 text-sm font-semibold hover:text-bark underline decoration-dotted"
              >
                💡 Need a gentle hint?
              </button>
            ) : (
              <div className="bg-sand/40 border border-sand rounded-2xl p-4 text-bark/70 text-sm animate-fadeUp">
                💡 {item.hint}
              </div>
            )}
          </>
        ) : (
          <div className="animate-fadeUp flex flex-col items-center gap-5 w-full max-w-sm">
            <div className={`rounded-3xl p-6 border-2 w-full text-center ${feedback.correct ? 'bg-amber/20 border-amber' : 'bg-rose/10 border-rose/30'}`}>
              <p className="text-4xl mb-2">{feedback.correct ? '🌟' : '💛'}</p>
              <p className="font-serif text-bark text-2xl font-bold">{feedback.correct ? 'That is right!' : 'Good try!'}</p>
              <p className="text-bark/70 text-xl mt-2 leading-relaxed">{feedback.hint}</p>
            </div>
            <BigBtn onClick={next} color="forest" full>Next item →</BigBtn>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Pattern game ──────────────────────────────────────────────────────────────

function PatternGame({ onBack, soundEnabled, recordActivity }: { onBack: () => void; soundEnabled: boolean; recordActivity: (n: string) => void }) {
  const [rounds] = useState(() => shuffled(PATTERN_ROUNDS))
  const [idx, setIdx] = useState(0)
  const [chosen, setChosen] = useState<string | null>(null)
  const [showHint, setShowHint] = useState(false)
  const [streak, setStreak] = useState(0)
  const { celebrating, message, celebKey, celebrate } = useCelebration(soundEnabled)
  const round = rounds[idx % rounds.length]

  const [currentChoices, setCurrentChoices] = useState(() =>
    Math.random() > 0.5 ? [round.answer, round.wrong] : [round.wrong, round.answer]
  )

  const pick = (val: string) => {
    setChosen(val)
    if (val === round.answer) {
      setStreak(s => s + 1)
      if (soundEnabled) playSoundEffect('match')
      celebrate()
    } else {
      setStreak(0)
      if (soundEnabled) playSoundEffect('tap')
    }
    recordActivity('Pattern Game')
  }

  const next = () => {
    setIdx(i => i + 1)
    setChosen(null)
    setShowHint(false)
    if (soundEnabled) playSoundEffect('tap')
    const nextRound = rounds[(idx + 1) % rounds.length]
    setCurrentChoices(Math.random() > 0.5 ? [nextRound.answer, nextRound.wrong] : [nextRound.wrong, nextRound.answer])
  }

  const correct = chosen === round.answer

  return (
    <div className="min-h-screen flex flex-col bg-parchment">
      <CelebrationOverlay key={celebKey} active={celebrating} message={message} />
      <BackBar onBack={onBack} />
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-6 gap-7 text-center animate-fadeUp max-w-md mx-auto w-full">
        <div>
          <p className="font-serif text-bark text-4xl font-bold">What Comes Next?</p>
          <div className="flex items-center justify-center gap-2 mt-1">
            <span className="text-bark/50 text-sm font-semibold">Pattern {(idx % rounds.length) + 1} of {rounds.length}</span>
            {streak >= 2 && (
              <span className="bg-amber text-bark text-xs font-bold px-2 py-0.5 rounded-full">
                🔥 {streak} Streak
              </span>
            )}
          </div>
        </div>

        {/* Pattern sequence row */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {round.seq.map((emoji, i) => (
            <div key={i} className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border-2 border-sand flex items-center justify-center text-3xl sm:text-4xl shadow-sm">
              {emoji}
            </div>
          ))}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 border-dashed border-amber flex items-center justify-center text-3xl sm:text-4xl bg-amber/10 animate-pulse font-bold text-bark">
            {chosen ?? '?'}
          </div>
        </div>

        {!chosen ? (
          <>
            <p className="text-bark text-2xl font-medium">Which one comes next?</p>
            <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
              {currentChoices.map(opt => (
                <button
                  key={opt}
                  onClick={() => pick(opt)}
                  className="flex items-center justify-center rounded-3xl bg-white border-2 border-sand hover:border-amber active:scale-95 transition-all h-28 text-6xl shadow-sm hover:shadow-md"
                >
                  {opt}
                </button>
              ))}
            </div>
            {!showHint ? (
              <button
                onClick={() => { setShowHint(true); if (soundEnabled) playSoundEffect('hint') }}
                className="text-bark/50 text-sm font-semibold hover:text-bark underline decoration-dotted mt-1"
              >
                💡 Need a clue?
              </button>
            ) : (
              <div className="bg-sand/40 border border-sand rounded-2xl p-4 text-bark/75 text-sm animate-fadeUp">
                💡 {round.hint}
              </div>
            )}
          </>
        ) : (
          <div className="animate-fadeUp flex flex-col items-center gap-5 w-full max-w-sm">
            <div className={`rounded-3xl p-6 border-2 w-full text-center ${correct ? 'bg-amber/20 border-amber' : 'bg-rose/10 border-rose/30'}`}>
              <p className="text-4xl mb-2">{correct ? '🌟' : '💛'}</p>
              <p className="font-serif text-bark text-2xl font-bold">{correct ? 'Exactly right!' : 'Good try!'}</p>
              {!correct && (
                <p className="text-bark/70 text-xl mt-2">
                  The pattern continues with <strong>{round.answer}</strong>
                </p>
              )}
            </div>
            <BigBtn onClick={next} color="forest" full>Next pattern →</BigBtn>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Sequence game ─────────────────────────────────────────────────────────────

function SequenceGame({ onBack, soundEnabled, recordActivity }: { onBack: () => void; soundEnabled: boolean; recordActivity: (n: string) => void }) {
  const [tasks] = useState(() => shuffled(SEQUENCE_TASKS))
  const [taskIdx, setTaskIdx] = useState(0)
  const task = tasks[taskIdx % tasks.length]
  const [shuffledSteps, setShuffledSteps] = useState(() => shuffled(task.steps.map((s, i) => ({ ...s, order: i }))))
  const [order, setOrder] = useState<number[]>([]) // indices in shuffledSteps, in user selection order
  const [phase, setPhase] = useState<'placing' | 'result'>('placing')
  const { celebrating, message, celebKey, celebrate } = useCelebration(soundEnabled)

  const tap = (i: number) => {
    if (phase !== 'placing' || order.includes(i)) return
    if (soundEnabled) playSoundEffect('tap')
    const next = [...order, i]
    setOrder(next)
    if (next.length === task.steps.length) {
      const isCorrect = next.every((stepIdx, pos) => shuffledSteps[stepIdx].order === pos)
      if (isCorrect) {
        if (soundEnabled) playSoundEffect('fanfare')
        celebrate()
      } else {
        if (soundEnabled) playSoundEffect('undo')
      }
      recordActivity('Sequence Game')
      setPhase('result')
    }
  }

  const undoLastStep = () => {
    if (order.length === 0 || phase !== 'placing') return
    if (soundEnabled) playSoundEffect('undo')
    setOrder(order.slice(0, -1))
  }

  const correct = phase === 'result' && (() => {
    for (let pos = 0; pos < order.length; pos++) {
      if (shuffledSteps[order[pos]].order !== pos) return false
    }
    return true
  })()

  const reset = () => {
    setOrder([])
    setPhase('placing')
  }

  const nextTask = () => {
    const nextIdx = (taskIdx + 1) % tasks.length
    setTaskIdx(nextIdx)
    setShuffledSteps(shuffled(tasks[nextIdx].steps.map((s, i) => ({ ...s, order: i }))))
    setOrder([])
    setPhase('placing')
    if (soundEnabled) playSoundEffect('tap')
  }

  return (
    <div className="min-h-screen flex flex-col bg-parchment">
      <CelebrationOverlay key={celebKey} active={celebrating} message={message} />
      <BackBar onBack={onBack} />
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-6 gap-5 text-center animate-fadeUp max-w-md mx-auto w-full">
        <span className="text-[90px] leading-none">{task.emoji}</span>
        <div>
          <p className="font-serif text-bark text-4xl font-bold leading-tight">{task.title}</p>
          <p className="text-bark/60 text-lg mt-2 font-medium">
            {phase === 'placing'
              ? `Tap step ${order.length + 1} of ${task.steps.length}:`
              : correct
              ? 'Perfect sequence!'
              : "Let's review together!"}
          </p>
        </div>

        {/* Step cards */}
        <div className="flex flex-col gap-3 w-full">
          {shuffledSteps.map((step, i) => {
            const tapPos = order.indexOf(i)
            const tapped = tapPos !== -1
            return (
              <button
                key={i}
                onClick={() => tap(i)}
                disabled={tapped || phase === 'result'}
                className={`flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all active:scale-98 min-h-[75px] shadow-sm ${
                  phase === 'result' && correct && tapped
                    ? 'bg-forest/10 border-forest'
                    : phase === 'result' && !correct && tapped
                    ? 'bg-rose/10 border-rose/30'
                    : tapped
                    ? 'bg-amber/20 border-amber shadow-md'
                    : 'bg-white border-sand hover:border-amber/50'
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center text-xl font-bold shrink-0 shadow-sm ${
                    tapped ? 'bg-amber text-bark' : 'bg-sand/60 text-bark/40'
                  }`}
                >
                  {tapped ? tapPos + 1 : '—'}
                </div>
                <span className="text-3xl leading-none">{step.emoji}</span>
                <span className="text-bark text-lg font-semibold leading-tight flex-1">{step.text}</span>
              </button>
            )
          })}
        </div>

        {/* Undo Step button */}
        {phase === 'placing' && order.length > 0 && (
          <button
            onClick={undoLastStep}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-bark/60 bg-sand/40 hover:bg-sand border border-sand transition-all active:scale-95"
          >
            <span>↩</span> Undo Last Step
          </button>
        )}

        {phase === 'result' && (
          <div className="animate-fadeUp flex flex-col items-center gap-4 w-full">
            {correct ? (
              <>
                <div className="bg-amber/20 rounded-3xl p-5 border border-amber/40 w-full text-center">
                  <p className="text-4xl mb-1">🌟</p>
                  <p className="font-serif text-bark text-2xl font-bold">Perfect order!</p>
                  <p className="text-bark/70 text-lg mt-1">Your understanding of this daily rhythm is wonderful.</p>
                </div>
                <BigBtn onClick={nextTask} color="forest" full>Try next daily task →</BigBtn>
              </>
            ) : (
              <>
                <div className="bg-amber/10 rounded-3xl p-5 border border-amber/30 w-full text-center">
                  <p className="text-4xl mb-1">💛</p>
                  <p className="font-serif text-bark text-2xl font-bold">Good effort!</p>
                  <p className="text-bark/70 text-lg mt-1">Practice makes everything feel familiar and easy.</p>
                </div>
                <BigBtn onClick={reset} color="amber" full>Try again</BigBtn>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Settings screen ───────────────────────────────────────────────────────────

function SettingsScreen({ language, onChangeLanguage, soundEnabled, setSoundEnabled, onBack, tr }: {
  language: Language
  onChangeLanguage: (l: Language) => void
  soundEnabled: boolean
  setSoundEnabled: (v: boolean) => void
  onBack: () => void
  tr: PatientStrings
}) {
  return (
    <div className="min-h-screen bg-parchment flex flex-col">
      <BackBar onBack={onBack} label={tr.goBack} />
      <div className="px-5 py-4">
        <h1 className="font-serif text-bark text-4xl font-bold mb-6">{tr.settings}</h1>

        {/* Sound toggle */}
        <div className="bg-white rounded-2xl border border-sand p-6 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-bark text-2xl">{soundEnabled ? tr.soundOn : tr.soundOff}</p>
              <p className="text-bark/50 text-lg mt-0.5">Game sounds and celebrations</p>
            </div>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`w-16 h-9 rounded-full transition-colors relative ${soundEnabled ? 'bg-forest' : 'bg-sand'}`}
            >
              <span className={`absolute top-1 w-7 h-7 bg-white rounded-full shadow transition-all ${soundEnabled ? 'left-8' : 'left-1'}`} />
            </button>
          </div>
        </div>

        {/* Language selection */}
        <div className="bg-white rounded-2xl border border-sand overflow-hidden">
          <div className="px-6 pt-5 pb-3">
            <p className="font-bold text-bark text-2xl">{tr.language}</p>
            <p className="text-bark/50 text-lg mt-0.5">{tr.changeLanguage}</p>
          </div>
          <LanguageSelectView
            current={language}
            onSelect={onChangeLanguage}
            onContinue={onBack}
            compact
          />
          <div className="px-5 pb-5">
            <button
              onClick={onBack}
              className="w-full bg-forest text-parchment font-bold text-xl py-5 rounded-2xl active:scale-[0.98] transition-transform mt-2"
            >
              {tr.continue}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Root ──────────────────────────────────────────────────────────────────────

interface Props { language: Language; onChangeLanguage: (l: Language) => void; onBack: () => void; userName?: string }

export default function PatientView({ language, onChangeLanguage, onBack, userName }: Props) {
  const [screen, setScreen] = useState<Screen>('home')
  const [soundEnabled, setSoundEnabled] = useState(true)
  const { streak, doneToday, isReturning, weekDotDates, weekDates, milestone, clearMilestone, recordActivity } = useStreak()
  const { memories, saveMemory, deleteMemory, getAudioUrl } = useMemories()
  const tr = t(language)

  if (milestone) return (
    <MilestoneScreen milestone={milestone} streak={streak} onContinue={() => { clearMilestone(); setScreen('home') }} />
  )

  const renderScreen = () => {
    if (screen === 'settings') return (
      <SettingsScreen
        language={language}
        onChangeLanguage={onChangeLanguage}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        onBack={() => setScreen('home')}
        tr={tr}
      />
    )
    if (screen === 'home') return (
      <HomeScreen
        onSelect={setScreen}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        streak={streak}
        doneToday={doneToday}
        isReturning={isReturning}
        weekDotDates={weekDotDates}
        weekDates={weekDates}
        tr={tr}
        userName={userName}
      />
    )
    if (screen === 'reminiscence') return <ReminiscenceGame onBack={() => setScreen('home')} soundEnabled={soundEnabled} recordActivity={recordActivity} />
    if (screen === 'music')        return <MusicGame        onBack={() => setScreen('home')} soundEnabled={soundEnabled} recordActivity={recordActivity} language={language} />
    if (screen === 'diary')        return <DiaryGame        onBack={() => setScreen('home')} recordActivity={recordActivity} saveMemory={saveMemory} onViewMemories={() => setScreen('memories')} />
    if (screen === 'memories')     return <SavedMemoriesView memories={memories} getAudioUrl={getAudioUrl} deleteMemory={deleteMemory} onBack={() => setScreen('home')} onGoToDiary={() => setScreen('diary')} />
    if (screen === 'orientation')  return <OrientationGame  onBack={() => setScreen('home')} soundEnabled={soundEnabled} recordActivity={recordActivity} />
    if (screen === 'pairs')        return <MemoryPairsGame  onBack={() => setScreen('home')} soundEnabled={soundEnabled} recordActivity={recordActivity} />
    if (screen === 'sort')         return <CategorySortGame onBack={() => setScreen('home')} soundEnabled={soundEnabled} recordActivity={recordActivity} />
    if (screen === 'pattern')      return <PatternGame      onBack={() => setScreen('home')} soundEnabled={soundEnabled} recordActivity={recordActivity} />
    if (screen === 'sequence')     return <SequenceGame     onBack={() => setScreen('home')} soundEnabled={soundEnabled} recordActivity={recordActivity} />
    if (screen === 'ai')           return <AICompanionView  onBack={() => setScreen('home')} onNavigate={s => setScreen(s as Screen)} userName={userName} />
    return null
  }

  return (
    <div className="relative min-h-screen pb-24 bg-parchment">
      {renderScreen()}

      {/* ─── Bottom Navigation Bar (Figma Design Brief Section 23) ─── */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-sand z-30 px-3 py-1 flex items-center justify-around shadow-lg">
        <button
          onClick={() => setScreen('home')}
          className={`flex-1 flex flex-col items-center justify-center py-2 px-2 rounded-xl min-h-[56px] transition-all active:scale-95 ${
            screen === 'home' ? 'text-forest font-bold border-b-2 border-forest' : 'text-bark/60 hover:text-bark'
          }`}
          aria-label="Home"
        >
          <span className="text-2xl">🏠</span>
          <span className="text-xs font-semibold mt-0.5">{(tr as any).home || 'Home'}</span>
        </button>

        <button
          onClick={() => setScreen('music')}
          className={`flex-1 flex flex-col items-center justify-center py-2 px-2 rounded-xl min-h-[56px] transition-all active:scale-95 ${
            screen === 'music' ? 'text-forest font-bold border-b-2 border-forest' : 'text-bark/60 hover:text-bark'
          }`}
          aria-label="Music"
        >
          <span className="text-2xl">🎵</span>
          <span className="text-xs font-semibold mt-0.5">{tr.listenToMusic || 'Music'}</span>
        </button>

        <button
          onClick={() => setScreen('diary')}
          className={`flex-1 flex flex-col items-center justify-center py-2 px-2 rounded-xl min-h-[56px] transition-all active:scale-95 ${
            screen === 'diary' || screen === 'memories' ? 'text-forest font-bold border-b-2 border-forest' : 'text-bark/60 hover:text-bark'
          }`}
          aria-label="Diary"
        >
          <span className="text-2xl">📔</span>
          <span className="text-xs font-semibold mt-0.5">{tr.dearDiary || 'Diary'}</span>
        </button>

        <button
          onClick={() => setScreen('ai')}
          className={`flex-1 flex flex-col items-center justify-center py-2 px-2 rounded-xl min-h-[56px] transition-all active:scale-95 ${
            screen === 'ai' ? 'text-forest font-bold border-b-2 border-forest' : 'text-bark/60 hover:text-bark'
          }`}
          aria-label="Devi Companion"
        >
          <span className="text-2xl">🌸</span>
          <span className="text-xs font-semibold mt-0.5">Devi</span>
        </button>

        <button
          onClick={() => setScreen('settings')}
          className={`flex-1 flex flex-col items-center justify-center py-2 px-2 rounded-xl min-h-[56px] transition-all active:scale-95 ${
            screen === 'settings' ? 'text-forest font-bold border-b-2 border-forest' : 'text-bark/60 hover:text-bark'
          }`}
          aria-label="Settings"
        >
          <span className="text-2xl">⚙️</span>
          <span className="text-xs font-semibold mt-0.5">{tr.settings || 'Settings'}</span>
        </button>
      </nav>
    </div>
  )
}

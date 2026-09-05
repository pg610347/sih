import { useState, useEffect, useRef, useCallback } from 'react'
import type { Language } from '../App'
import { t, type PatientStrings } from '../i18n'
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

const MUSIC_TRACKS = [
  { id: 'bihu', emoji: '🪗', title: 'O Mur Apunar Deh', region: 'Assam — Rongali Bihu', instrument: 'Pepa flute & Dhol drum', lyric: 'আহা মোৰ অপুনাৰ দেহ\nহাঁহি হাঁহি কথা কোৱা...', lyricEng: '"O my own beloved, speak to me with a smile..."', scene: 'Young women in red mekhela-chador dance in dew-wet paddy fields while the pepa horn rings across the valley.', notes: [329.63, 0, 392, 440, 392, 329.63, 0, 293.66, 261.63, 293.66, 329.63, 392, 0, 440, 493.88, 440, 392, 329.63, 0, 293.66, 329.63], bpm: 88 },
  { id: 'manipuri', emoji: '🥁', title: 'Ras Lila Kirtan', region: 'Manipur — Ras Mahotsav', instrument: 'Pung drum & Kartal cymbals', lyric: 'হে কৃষ্ণ হে মুৰলীধৰ\nহে নন্দনন্দন...', lyricEng: '"O Krishna, O flute-bearer, O son of Nanda..."', scene: 'November full moon at Govindaji temple, Imphal. Dancers in gold Potloi dresses circle the mandap.', notes: [261.63, 293.66, 329.63, 0, 349.23, 329.63, 293.66, 0, 261.63, 246.94, 261.63, 293.66, 0, 349.23, 392, 349.23, 329.63, 261.63], bpm: 62 },
  { id: 'khasi', emoji: '🎵', title: 'Nongkynmaw', region: 'Meghalaya — Nongkrem Festival', instrument: 'Tangmuri flute & Ksing drum', lyric: 'Ia phi ba ïaleh\nia phi ba ïaneh...', lyricEng: '"Go and come back, go and return to us..."', scene: 'Autumn harvest at Smit village. Women in jainsem silks dance in circles on the hilltop as clouds touch the dancers.', notes: [261.63, 293.66, 349.23, 0, 392, 349.23, 293.66, 261.63, 0, 293.66, 349.23, 392, 0, 440, 392, 349.23, 293.66, 261.63], bpm: 80 },
  { id: 'nagamese', emoji: '🪘', title: 'Ura Ura Ke', region: 'Nagaland — Hornbill Festival', instrument: 'Log drum & bamboo flute', lyric: 'Ura ura ke\nmor ghorer ghora ke...', lyricEng: '"Fly, fly, like a bird — come back to my home..."', scene: 'Warriors in hornbill headdresses beat enormous log drums around the bonfire at Kisama, Kohima.', notes: [392, 440, 0, 392, 329.63, 293.66, 329.63, 0, 392, 440, 493.88, 0, 440, 392, 329.63, 392, 0, 440, 392], bpm: 110 },
  { id: 'borgeet', emoji: '🎙️', title: 'Manuhor Manuhe', region: 'Assam — Sankardeva Borgeet', instrument: 'Khol drum & Taal cymbals', lyric: 'মানুহৰ মানুহে হয়\nসেইটো নিশ্চয়...', lyricEng: '"A person becomes human through love for others — this is certain..."', scene: "Composed 500 years ago by Srimanta Sankardeva. Sung every morning in Assam's sattras.", notes: [329.63, 349.23, 392, 0, 440, 392, 349.23, 0, 329.63, 293.66, 261.63, 293.66, 329.63, 0, 349.23, 392, 440, 392, 349.23, 329.63, 293.66, 261.63], bpm: 68 },
]

const PAIR_CARDS = [
  { pairId: 'a', emoji: '🪔', name: 'Diya' },
  { pairId: 'b', emoji: '🧺', name: 'Jhapi' },
  { pairId: 'c', emoji: '🫙', name: 'Lota' },
  { pairId: 'd', emoji: '🪨', name: 'Silbatta' },
  { pairId: 'e', emoji: '🏺', name: 'Chula' },
  { pairId: 'f', emoji: '🧣', name: 'Gamosa' },
]

type SortItem = { emoji: string; name: string; localName: string; bin: 0 | 1; hint: string }
const SORT_ITEMS: SortItem[] = [
  { emoji: '🪨', name: 'Silbatta',      localName: 'শিলবট্টা', bin: 0, hint: 'The silbatta is used to grind spices in the kitchen.' },
  { emoji: '🌾', name: 'Rice Paddy',    localName: 'ধান',       bin: 1, hint: 'Rice grows in the paddy field, not the kitchen.' },
  { emoji: '🫙', name: 'Lota',          localName: 'লোটা',      bin: 0, hint: 'The brass lota holds water in the kitchen.' },
  { emoji: '🌿', name: 'Bamboo Shoot',  localName: 'বাঁহ গাজ',  bin: 1, hint: 'Bamboo shoots grow in the field or forest.' },
  { emoji: '🧣', name: 'Gamosa',        localName: 'গামোচা',    bin: 1, hint: 'The gamosa is woven on the loom, outside on the verandah.' },
  { emoji: '🏺', name: 'Chula',         localName: 'চুলা',      bin: 0, hint: 'The clay chula is the stove — it lives in the kitchen.' },
  { emoji: '🧺', name: 'Jhapi',         localName: 'জাপি',      bin: 1, hint: 'The jhapi carries things from the field to the home.' },
  { emoji: '🥣', name: 'Mortar',        localName: 'খৰাল',      bin: 0, hint: 'The wooden mortar is used to pound herbs in the kitchen.' },
  { emoji: '🌱', name: 'Seedling',      localName: 'পুলি',      bin: 1, hint: 'Seedlings are planted in the paddy field.' },
  { emoji: '🪔', name: 'Diya',          localName: 'দিয়া',      bin: 0, hint: 'Diyas are lit inside the home during prayers and festivals.' },
]

type PatternRound = { seq: string[]; answer: string; wrong: string }
const PATTERN_ROUNDS: PatternRound[] = [
  { seq: ['🪔', '🧺', '🪔'], answer: '🧺', wrong: '🏺' },
  { seq: ['🌾', '🪔', '🌾'], answer: '🪔', wrong: '🧺' },
  { seq: ['🧺', '🫙', '🧺'], answer: '🫙', wrong: '🌾' },
  { seq: ['🏺', '🌿', '🏺'], answer: '🌿', wrong: '🧺' },
  { seq: ['🪔', '🧣', '🪔'], answer: '🧣', wrong: '🏺' },
  { seq: ['🌾', '🧺', '🌾'], answer: '🧺', wrong: '🪔' },
  { seq: ['🫙', '🪔', '🫙'], answer: '🪔', wrong: '🌾' },
  { seq: ['🧣', '🪨', '🧣'], answer: '🪨', wrong: '🧺' },
]

type SeqTask = { title: string; emoji: string; steps: { emoji: string; text: string }[] }
const SEQUENCE_TASKS: SeqTask[] = [
  { title: 'Making Assamese Morning Tea', emoji: '🍵',
    steps: [
      { emoji: '🪣', text: 'Fetch water from the well' },
      { emoji: '🔥', text: 'Boil it on the chula' },
      { emoji: '🍃', text: 'Add tea leaves' },
    ],
  },
  { title: 'Lighting a Diya for Puja', emoji: '🪔',
    steps: [
      { emoji: '🫙', text: 'Fill the diya with mustard oil' },
      { emoji: '🧵', text: 'Place the cotton wick' },
      { emoji: '🔥', text: 'Light it with a matchstick' },
    ],
  },
  { title: 'Cooking Rice on the Chula', emoji: '🍚',
    steps: [
      { emoji: '🪣', text: 'Wash the rice with clean water' },
      { emoji: '🏺', text: 'Put it in the pot on the chula' },
      { emoji: '♨️', text: 'Wait until the water is gone' },
    ],
  },
  { title: 'Grinding Spices on Silbatta', emoji: '🌶️',
    steps: [
      { emoji: '💧', text: 'Wet the grinding stone' },
      { emoji: '🫚', text: 'Place ginger and turmeric on it' },
      { emoji: '🪨', text: 'Roll the stone back and forth' },
    ],
  },
  { title: 'Weaving the Gamosa', emoji: '🧣',
    steps: [
      { emoji: '🧵', text: 'Thread the loom with white cotton' },
      { emoji: '🔴', text: 'Add red thread for the border' },
      { emoji: '🧵', text: 'Weave row by row with care' },
    ],
  },
]

const ORI_QUESTIONS = [
  { icon: '🌤️', q: 'What time of day is it right now?', options: ['🌅  Early morning', '☀️  Daytime', '🌆  Evening', '🌙  Night'] },
  { icon: '🌾', q: 'What season is it in Assam right now?', options: ['🌸  Bihu season — spring', '🌧️  Monsoon — the rains', '🍂  Autumn — harvest time', '❄️  Winter — foggy mornings'] },
  { icon: '🌊', q: 'Which river flows through Assam?', options: ['🌊  The Brahmaputra', '🏔️  The Ganga', '🌿  The Barak', '🦅  The Imphal'] },
  { icon: '🎉', q: 'Which festival is celebrated in April in Assam?', options: ['🪔  Bihu — the harvest festival', '🥁  Hornbill Festival', '🎋  Sangai Festival', '🌺  Pung Cholom'] },
  { icon: '🦏', q: 'Which animal is the pride of Assam?', options: ['🦏  The one-horned rhinoceros', '🐅  The Royal Bengal Tiger', '🦅  The Hornbill bird', '🐬  The river dolphin'] },
]

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

  return (
    <div className="min-h-screen bg-parchment flex flex-col px-5 py-7 gap-5 overflow-auto">
      <div className="bg-white rounded-3xl p-6 border border-sand">
        <p className="text-bark/50 text-xl">{dateStr}</p>
        <p className="font-serif text-bark text-5xl font-bold mt-2">{tr.greeting}, {userName || 'Priya'} 👋</p>
        <p className="text-bark/60 text-2xl mt-1">{timeStr}</p>
        <div className="flex items-center gap-3 mt-4 flex-wrap">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="flex items-center gap-2 text-bark/50 text-xl font-semibold rounded-full border border-sand px-4 py-2 active:scale-95 transition-transform"
          >
            {soundEnabled ? tr.soundOn : tr.soundOff}
          </button>
          <button
            onClick={() => onSelect('settings')}
            className="flex items-center gap-2 text-bark/50 text-xl font-semibold rounded-full border border-sand px-4 py-2 active:scale-95 transition-transform"
          >
            ⚙️ {tr.settings}
          </button>
        </div>
      </div>

      <StreakCard streak={streak} doneToday={doneToday} isReturning={isReturning} weekDotDates={weekDotDates} weekDates={weekDates} tr={tr} />

      {/* Companion — featured */}
      <button onClick={() => onSelect(AI_SCREEN)}
        className="flex items-center gap-5 p-7 rounded-3xl border-2 text-left transition-transform active:scale-[0.98] bg-sage/15 border-sage/50"
      >
        <span className="text-7xl leading-none shrink-0">💬</span>
        <div className="flex-1">
          <div className="font-bold text-bark text-3xl leading-tight">{tr.talkToMe}</div>
          <div className="text-bark/60 text-xl mt-1">{tr.companionTagline}</div>
        </div>
      </button>

      <p className="text-bark/50 text-2xl font-bold px-1 mt-1">{tr.yourActivities}</p>
      <div className="flex flex-col gap-4">
        {activities.map(a => (
          <button key={a.screen} onClick={() => onSelect(a.screen)}
            className={`flex items-center gap-5 p-7 rounded-3xl border-2 text-left transition-transform active:scale-[0.98] ${a.color}`}
          >
            <span className="text-7xl leading-none shrink-0">{a.emoji}</span>
            <div>
              <div className="font-bold text-bark text-3xl leading-tight">{a.title}</div>
              <div className="text-bark/60 text-xl mt-1">{a.desc}</div>
            </div>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3 mt-2">
        <p className="text-bark/50 text-2xl font-bold px-1">{tr.brainGames}</p>
        <span className="bg-forest/10 text-forest text-sm font-bold px-3 py-1 rounded-full">{tr.helpsMemory}</span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {brainGames.map(g => (
          <button key={g.screen} onClick={() => onSelect(g.screen)}
            className={`flex flex-col items-start gap-3 p-6 rounded-3xl border-2 text-left transition-transform active:scale-[0.98] ${g.color}`}
          >
            <span className="text-5xl leading-none">{g.emoji}</span>
            <div>
              <div className="font-bold text-bark text-xl leading-tight">{g.title}</div>
              <div className="text-bark/50 text-base mt-1">{g.desc}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Reminiscence game ─────────────────────────────────────────────────────────

function ReminiscenceGame({ onBack, soundEnabled, recordActivity }: { onBack: () => void; soundEnabled: boolean; recordActivity: (n: string) => void }) {
  const [idx, setIdx] = useState(0)
  const [phase, setPhase] = useState<'show' | 'memory'>('show')
  const { celebrating, message, celebKey, celebrate } = useCelebration(soundEnabled)
  const obj = NER_OBJECTS[idx % NER_OBJECTS.length]
  const next = () => { setIdx(i => i + 1); setPhase('show') }

  if (phase === 'memory') return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-amber/5 px-6 py-10 gap-7 text-center animate-fadeUp">
      <span className="text-[110px] leading-none">{obj.emoji}</span>
      <p className="font-serif text-bark text-4xl font-bold">{obj.name}</p>
      <div className="bg-white rounded-3xl p-7 border border-sand max-w-sm text-left">
        <p className="text-bark/50 text-lg font-bold tracking-wide uppercase mb-3">A memory</p>
        <p className="text-bark text-2xl leading-relaxed">{obj.scene}</p>
        <p className="text-bark/50 text-xl mt-4 italic">{obj.sensory}</p>
      </div>
      <div className="bg-forest/10 rounded-2xl px-6 py-4 border border-forest/20 max-w-sm w-full">
        <p className="text-forest text-xl font-semibold">💬 {obj.prompt}</p>
      </div>
      <BigBtn onClick={next} color="forest" full>Show me another →</BigBtn>
      <BackBar onBack={onBack} />
    </div>
  )

  return (
    <div className="min-h-screen flex flex-col bg-parchment">
      <CelebrationOverlay key={celebKey} active={celebrating} message={message} />
      <BackBar onBack={onBack} />
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-6 gap-8 text-center animate-fadeUp">
        <p className="text-bark/50 text-2xl">Do you recognise this?</p>
        <span className="text-[150px] leading-none">{obj.emoji}</span>
        <div>
          <p className="font-serif text-bark text-5xl font-bold">{obj.name}</p>
          <p className="text-bark/50 text-2xl font-serif italic mt-2">{obj.localName}</p>
        </div>
        <div className="flex flex-col gap-4 w-full max-w-sm">
          <BigBtn onClick={() => { celebrate(); recordActivity('Remember This'); setPhase('memory') }} color="amber" full>❤️  Yes, I remember this</BigBtn>
          <BigBtn onClick={next} color="white" full>Show me another →</BigBtn>
        </div>
      </div>
    </div>
  )
}

// ─── Music game ────────────────────────────────────────────────────────────────

function MusicGame({ onBack, soundEnabled, recordActivity }: { onBack: () => void; soundEnabled: boolean; recordActivity: (n: string) => void }) {
  const [idx, setIdx] = useState(0)
  const [phase, setPhase] = useState<MusicPhase>('intro')
  const { play, stop } = useMelodyPlayer()
  const { celebrating, message, celebKey, celebrate } = useCelebration(soundEnabled)
  const track = MUSIC_TRACKS[idx % MUSIC_TRACKS.length]

  const handlePlay = () => { setPhase('playing'); play(track.notes, track.bpm, () => { celebrate(); recordActivity('Music'); setPhase('responded') }) }
  const handleStop = () => { stop(); celebrate(); recordActivity('Music'); setPhase('responded') }
  const nextTrack = () => { stop(); setIdx(i => i + 1); setPhase('intro') }
  useEffect(() => { setPhase('intro'); stop() }, [idx, stop])

  if (phase === 'responded') return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-amber/10 px-8 py-12 text-center gap-7 animate-fadeUp">
      <span className="text-[110px] leading-none">{track.emoji}</span>
      <div><p className="text-bark/50 text-xl">{track.region}</p><p className="font-serif text-bark text-4xl font-bold mt-1 leading-tight">{track.title}</p></div>
      <div className="bg-white rounded-3xl p-6 border border-sand max-w-sm text-left">
        <p className="text-bark/50 text-lg font-bold uppercase tracking-wide mb-3">{track.instrument}</p>
        <p className="text-bark text-2xl leading-relaxed">{track.scene}</p>
      </div>
      <div className="bg-forest/10 rounded-3xl px-6 py-5 border border-forest/20 max-w-sm w-full font-serif">
        <p className="text-bark text-xl leading-relaxed whitespace-pre-line">{track.lyric}</p>
        <p className="text-bark/50 text-lg mt-2 italic">{track.lyricEng}</p>
      </div>
      <BigBtn onClick={nextTrack} color="forest" full>Play the next song →</BigBtn>
      <BackBar onBack={() => { stop(); onBack() }} />
    </div>
  )

  return (
    <div className="min-h-screen flex flex-col bg-parchment">
      <CelebrationOverlay key={celebKey} active={celebrating} message={message} />
      <BackBar onBack={() => { stop(); onBack() }} />
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-6 gap-8 text-center animate-fadeUp">
        <span className="text-[110px] leading-none">{track.emoji}</span>
        <div>
          <p className="text-bark/50 text-xl">{track.region}</p>
          <p className="font-serif text-bark text-4xl font-bold mt-1 leading-tight">{track.title}</p>
          <p className="text-bark/50 text-xl mt-1">{track.instrument}</p>
        </div>
        {phase === 'playing' ? (
          <>
            <div className="flex items-end justify-center gap-2 h-20 px-4">
              {Array.from({ length: 16 }).map((_, i) => <div key={i} className="wave-bar" style={{ animationDelay: `${i * 0.07}s`, animationDuration: `${0.42 + (i % 5) * 0.14}s` }} />)}
            </div>
            <p className="text-rose text-2xl font-bold">♪ Playing...</p>
            <BigBtn onClick={handleStop} color="white" full>⏹  Stop</BigBtn>
          </>
        ) : (
          <>
            <div className="bg-forest/10 rounded-3xl p-6 border border-forest/20 max-w-xs font-serif text-center">
              <p className="text-bark text-2xl leading-relaxed whitespace-pre-line">{track.lyric}</p>
              <p className="text-bark/50 text-lg mt-3 italic">{track.lyricEng}</p>
            </div>
            <BigBtn onClick={handlePlay} color="amber" full>▶  Play this song</BigBtn>
            <BigBtn onClick={nextTrack} color="white" full>Skip to next song →</BigBtn>
          </>
        )}
      </div>
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
  const [idx, setIdx] = useState(0)
  const [chosen, setChosen] = useState<number | null>(null)
  const { celebrating, message, celebKey, celebrate } = useCelebration(soundEnabled)
  const q = ORI_QUESTIONS[idx % ORI_QUESTIONS.length]
  const next = () => { setIdx(qi => qi + 1); setChosen(null) }

  return (
    <div className="min-h-screen flex flex-col bg-parchment">
      <CelebrationOverlay key={celebKey} active={celebrating} message={message} />
      <BackBar onBack={onBack} />
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-6 gap-8 text-center animate-fadeUp">
        <span className="text-[100px] leading-none">{q.icon}</span>
        <p className="font-serif text-bark text-4xl font-bold leading-tight max-w-xs">{q.q}</p>
        {chosen === null ? (
          <div className="flex flex-col gap-4 w-full max-w-xs">
            {q.options.map((opt, i) => <BigBtn key={i} onClick={() => { setChosen(i); celebrate(); recordActivity('Orientation') }} color="white" full>{opt}</BigBtn>)}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6 animate-fadeUp w-full max-w-xs">
            <div className="bg-amber/20 rounded-3xl p-7 border border-amber/40 text-center w-full">
              <p className="text-5xl mb-3">🌟</p>
              <p className="font-serif text-bark text-3xl font-bold">You said:</p>
              <p className="text-bark text-2xl mt-2 leading-snug">{q.options[chosen]}</p>
              <p className="text-bark/60 text-xl mt-3">That is perfectly alright.</p>
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
  const [level, setLevel] = useState<2 | 3>(2) // 2 pairs = 4 cards, 3 pairs = 6 cards
  const [cards, setCards] = useState<Card[]>(() => buildCards(2))
  const [firstId, setFirstId] = useState<string | null>(null)
  const [locked, setLocked] = useState(false)
  const [praise, setPraise] = useState(false)
  const { celebrating, message, celebKey, celebrate } = useCelebration(soundEnabled)

  function buildCards(pairs: 2 | 3): Card[] {
    return shuffled(
      shuffled(PAIR_CARDS).slice(0, pairs).flatMap(p => [
        { id: `${p.pairId}-1`, pairId: p.pairId, emoji: p.emoji, name: p.name, state: 'hidden' as const },
        { id: `${p.pairId}-2`, pairId: p.pairId, emoji: p.emoji, name: p.name, state: 'hidden' as const },
      ])
    )
  }

  const tap = (card: Card) => {
    if (locked || card.state !== 'hidden') return

    const revealed = cards.map(c => c.id === card.id ? { ...c, state: 'revealed' as const } : c)
    setCards(revealed)

    if (!firstId) { setFirstId(card.id); return }

    setLocked(true)
    const first = revealed.find(c => c.id === firstId)!

    setTimeout(() => {
      if (first.pairId === card.pairId) {
        const next = revealed.map(c => c.id === firstId || c.id === card.id ? { ...c, state: 'matched' as const } : c)
        setCards(next)
        celebrate()
        recordActivity('Memory Pairs')
        if (next.every(c => c.state === 'matched')) {
          setTimeout(() => setPraise(true), 1950)
        }
      } else {
        setCards(cs => cs.map(c => c.state === 'revealed' ? { ...c, state: 'hidden' as const } : c))
      }
      setFirstId(null)
      setLocked(false)
    }, 1600)
  }

  const restart = (nextLevel?: 2 | 3) => {
    const l = nextLevel ?? level
    setLevel(l); setCards(buildCards(l)); setFirstId(null); setLocked(false); setPraise(false)
  }

  if (praise) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-amber/10 px-8 py-12 text-center gap-7 animate-fadeUp">
      <div className="text-[120px] leading-none animate-bounce">🎉</div>
      <p className="font-serif text-bark text-5xl font-bold">All matched!</p>
      <p className="text-bark/70 text-2xl">Your memory is working beautifully.</p>
      <div className="flex flex-col gap-4 w-full max-w-xs">
        {level === 2 && <BigBtn onClick={() => restart(3)} color="forest" full>Try 3 pairs (harder) →</BigBtn>}
        <BigBtn onClick={() => restart()} color="amber" full>Play again</BigBtn>
        <BackBar onBack={onBack} />
      </div>
    </div>
  )

  const cols = level === 2 ? 'grid-cols-2' : 'grid-cols-3'

  return (
    <div className="min-h-screen flex flex-col bg-parchment">
      <CelebrationOverlay key={celebKey} active={celebrating} message={message} />
      <BackBar onBack={onBack} />
      <div className="flex-1 flex flex-col items-center justify-center px-5 py-4 gap-6 animate-fadeUp">
        <div className="text-center">
          <p className="font-serif text-bark text-4xl font-bold">Memory Pairs</p>
          <p className="text-bark/50 text-2xl mt-1">Tap two cards — find the matching pair</p>
        </div>
        <div className={`grid ${cols} gap-4 w-full max-w-sm`}>
          {cards.map(card => (
            <button
              key={card.id}
              onClick={() => tap(card)}
              disabled={card.state !== 'hidden' || locked}
              className={`rounded-3xl flex flex-col items-center justify-center gap-2 transition-all active:scale-95 min-h-[120px] border-2 ${
                card.state === 'matched'   ? 'bg-forest/10 border-forest/30 opacity-70' :
                card.state === 'revealed'  ? 'bg-amber/20 border-amber' :
                'bg-white border-sand hover:border-amber/50'
              }`}
            >
              {card.state === 'hidden' ? (
                <span className="text-4xl">🌿</span>
              ) : (
                <>
                  <span className="text-5xl leading-none">{card.emoji}</span>
                  <span className="text-bark text-lg font-bold">{card.name}</span>
                  {card.state === 'matched' && <span className="text-forest text-xl">✓</span>}
                </>
              )}
            </button>
          ))}
        </div>
        <p className="text-bark/40 text-xl">{cards.filter(c => c.state === 'matched').length / 2} / {level} pairs found</p>
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
  const [done, setDone] = useState(false)
  const { celebrating, message, celebKey, celebrate } = useCelebration(soundEnabled)

  const item = items[idx]

  const pick = (bin: 0 | 1) => {
    const correct = bin === item.bin
    if (correct) { setScore(s => s + 1); celebrate() }
    recordActivity('Kitchen or Field?')
    setFeedback({ correct, hint: item.hint })
  }

  const next = () => {
    setFeedback(null)
    if (idx + 1 >= items.length) { setDone(true) } else { setIdx(i => i + 1) }
  }

  if (done) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-amber/10 px-8 py-12 text-center gap-7 animate-fadeUp">
      <div className="text-[120px] leading-none animate-bounce">🌾</div>
      <p className="font-serif text-bark text-5xl font-bold">All done!</p>
      <p className="text-bark/70 text-2xl">You sorted <strong>{score} out of {items.length}</strong> correctly.</p>
      <p className="text-bark/50 text-xl">Every answer helps your mind stay sharp.</p>
      <BigBtn onClick={() => { setIdx(0); setScore(0); setDone(false); setFeedback(null) }} color="forest" full>Play again</BigBtn>
      <BackBar onBack={onBack} />
    </div>
  )

  return (
    <div className="min-h-screen flex flex-col bg-parchment">
      <CelebrationOverlay key={celebKey} active={celebrating} message={message} />
      <BackBar onBack={onBack} />
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-6 gap-7 text-center animate-fadeUp">
        <div>
          <p className="font-serif text-bark text-4xl font-bold">Kitchen or Field?</p>
          <p className="text-bark/50 text-xl mt-1">Question {idx + 1} of {items.length}</p>
        </div>

        <span className="text-[130px] leading-none">{item.emoji}</span>
        <div>
          <p className="font-serif text-bark text-5xl font-bold">{item.name}</p>
          <p className="text-bark/50 text-2xl font-serif italic mt-1">{item.localName}</p>
        </div>

        {!feedback ? (
          <>
            <p className="text-bark text-2xl">Where does this belong?</p>
            <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
              <BigBtn onClick={() => pick(0)} color="terracotta" full>🍳 Kitchen</BigBtn>
              <BigBtn onClick={() => pick(1)} color="forest" full>🌾 Field</BigBtn>
            </div>
          </>
        ) : (
          <div className="animate-fadeUp flex flex-col items-center gap-5 w-full max-w-sm">
            <div className={`rounded-3xl p-6 border-2 w-full text-center ${feedback.correct ? 'bg-amber/20 border-amber' : 'bg-rose/10 border-rose/30'}`}>
              <p className="text-4xl mb-2">{feedback.correct ? '🌟' : '💛'}</p>
              <p className="font-serif text-bark text-2xl font-bold">{feedback.correct ? 'That is right!' : 'Good try!'}</p>
              <p className="text-bark/70 text-xl mt-2 leading-relaxed">{feedback.hint}</p>
            </div>
            <BigBtn onClick={next} color="forest" full>Next →</BigBtn>
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
  const { celebrating, message, celebKey, celebrate } = useCelebration(soundEnabled)
  const round = rounds[idx % rounds.length]
  const [choices] = useState(() => Math.random() > 0.5
    ? [round.answer, round.wrong]
    : [round.wrong, round.answer])

  const [currentChoices, setCurrentChoices] = useState(choices)

  const pick = (val: string) => {
    setChosen(val)
    if (val === round.answer) celebrate()
    recordActivity('Pattern Game')
  }

  const next = () => {
    setIdx(i => i + 1)
    setChosen(null)
    const next = rounds[(idx + 1) % rounds.length]
    setCurrentChoices(Math.random() > 0.5 ? [next.answer, next.wrong] : [next.wrong, next.answer])
  }

  const correct = chosen === round.answer

  return (
    <div className="min-h-screen flex flex-col bg-parchment">
      <CelebrationOverlay key={celebKey} active={celebrating} message={message} />
      <BackBar onBack={onBack} />
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-6 gap-8 text-center animate-fadeUp">
        <div>
          <p className="font-serif text-bark text-4xl font-bold">What Comes Next?</p>
          <p className="text-bark/50 text-xl mt-1">Complete the pattern</p>
        </div>

        {/* Pattern row */}
        <div className="flex items-center justify-center gap-3">
          {round.seq.map((emoji, i) => (
            <div key={i} className="w-20 h-20 rounded-2xl bg-white border-2 border-sand flex items-center justify-center text-4xl shadow-sm">
              {emoji}
            </div>
          ))}
          <div className="w-20 h-20 rounded-2xl border-2 border-dashed border-amber flex items-center justify-center text-4xl bg-amber/5">
            {chosen ?? '?'}
          </div>
        </div>

        {!chosen ? (
          <>
            <p className="text-bark text-2xl">Which one comes next?</p>
            <div className="grid grid-cols-2 gap-5 w-full max-w-xs">
              {currentChoices.map(opt => (
                <button key={opt} onClick={() => pick(opt)}
                  className="flex items-center justify-center rounded-3xl bg-white border-2 border-sand hover:border-amber active:scale-95 transition-all h-28 text-6xl shadow-sm"
                >{opt}</button>
              ))}
            </div>
          </>
        ) : (
          <div className="animate-fadeUp flex flex-col items-center gap-5 w-full max-w-sm">
            <div className={`rounded-3xl p-6 border-2 w-full text-center ${correct ? 'bg-amber/20 border-amber' : 'bg-rose/10 border-rose/30'}`}>
              <p className="text-4xl mb-2">{correct ? '🌟' : '💛'}</p>
              <p className="font-serif text-bark text-2xl font-bold">{correct ? 'Exactly right!' : 'Good try!'}</p>
              {!correct && <p className="text-bark/70 text-xl mt-2">The pattern continues with <strong>{round.answer}</strong></p>}
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
  const [shuffledSteps] = useState(() => shuffled(task.steps.map((s, i) => ({ ...s, order: i }))))
  const [order, setOrder] = useState<number[]>([]) // indices in shuffledSteps, in the order the user taps them
  const [phase, setPhase] = useState<'placing' | 'result'>('placing')
  const { celebrating, message, celebKey, celebrate } = useCelebration(soundEnabled)

  const tap = (i: number) => {
    if (phase !== 'placing' || order.includes(i)) return
    const next = [...order, i]
    setOrder(next)
    if (next.length === task.steps.length) {
      const isCorrect = next.every((stepIdx, pos) => shuffledSteps[stepIdx].order === pos)
      if (isCorrect) celebrate()
      recordActivity('Sequence Game')
      setPhase('result')
    }
  }

  const correct = phase === 'result' && (() => {
    for (let pos = 0; pos < order.length; pos++) {
      if (shuffledSteps[order[pos]].order !== pos) return false
    }
    return true
  })()

  const reset = () => { setOrder([]); setPhase('placing') }
  const nextTask = () => {
    setTaskIdx(i => i + 1)
    setOrder([])
    setPhase('placing')
  }

  return (
    <div className="min-h-screen flex flex-col bg-parchment">
      <CelebrationOverlay key={celebKey} active={celebrating} message={message} />
      <BackBar onBack={onBack} />
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-6 gap-6 text-center animate-fadeUp">
        <span className="text-[90px] leading-none">{task.emoji}</span>
        <div>
          <p className="font-serif text-bark text-4xl font-bold leading-tight">{task.title}</p>
          <p className="text-bark/50 text-xl mt-2">
            {phase === 'placing' ? `Tap the steps in order: 1st, 2nd, 3rd` : correct ? 'Perfect order!' : "Let's try again!"}
          </p>
        </div>

        {/* Step cards */}
        <div className="flex flex-col gap-3 w-full max-w-sm">
          {shuffledSteps.map((step, i) => {
            const tapPos = order.indexOf(i)
            const tapped = tapPos !== -1
            return (
              <button key={i} onClick={() => tap(i)} disabled={tapped || phase === 'result'}
                className={`flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all active:scale-98 min-h-[80px] ${
                  phase === 'result' && correct && tapped ? 'bg-forest/10 border-forest' :
                  phase === 'result' && !correct && tapped ? 'bg-rose/10 border-rose/30' :
                  tapped ? 'bg-amber/20 border-amber' :
                  'bg-white border-sand hover:border-amber/50'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold shrink-0 ${
                  tapped ? 'bg-amber text-bark' : 'bg-sand text-bark/40'
                }`}>
                  {tapped ? tapPos + 1 : '?'}
                </div>
                <span className="text-4xl leading-none">{step.emoji}</span>
                <span className="text-bark text-xl font-semibold leading-tight">{step.text}</span>
              </button>
            )
          })}
        </div>

        {phase === 'result' && (
          <div className="animate-fadeUp flex flex-col items-center gap-4 w-full max-w-sm">
            {correct ? (
              <>
                <div className="bg-amber/20 rounded-3xl p-5 border border-amber/40 w-full">
                  <p className="text-4xl mb-1">🌟</p>
                  <p className="font-serif text-bark text-2xl font-bold">Perfect order!</p>
                  <p className="text-bark/60 text-xl mt-1">Your memory of this task is wonderful.</p>
                </div>
                <BigBtn onClick={nextTask} color="forest" full>Try the next task →</BigBtn>
              </>
            ) : (
              <>
                <div className="bg-amber/10 rounded-3xl p-5 border border-amber/30 w-full">
                  <p className="text-4xl mb-1">💛</p>
                  <p className="font-serif text-bark text-2xl font-bold">Good try!</p>
                  <p className="text-bark/60 text-xl mt-1">Let us try once more together.</p>
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
  if (screen === 'music')        return <MusicGame        onBack={() => setScreen('home')} soundEnabled={soundEnabled} recordActivity={recordActivity} />
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

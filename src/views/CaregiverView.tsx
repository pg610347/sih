import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { readStreakForDisplay } from '../hooks/useStreak'

// ─── SOS Alert Banner ────────────────────────────────────────────────────────

interface SOSEvent { timestamp: string; resolved: boolean }

function SOSAlertBanner() {
  const [events, setEvents] = useState<SOSEvent[]>([])

  const refresh = useCallback(() => {
    const raw: SOSEvent[] = JSON.parse(localStorage.getItem('nercare_sos_v1') || '[]')
    setEvents(raw.filter(e => !e.resolved))
  }, [])

  useEffect(() => {
    refresh()
    const t = setInterval(refresh, 5000)
    return () => clearInterval(t)
  }, [refresh])

  const resolve = () => {
    const raw: SOSEvent[] = JSON.parse(localStorage.getItem('nercare_sos_v1') || '[]')
    const updated = raw.map(e => ({ ...e, resolved: true }))
    localStorage.setItem('nercare_sos_v1', JSON.stringify(updated))
    setEvents([])
  }

  if (events.length === 0) return null

  const latest = new Date(events[0].timestamp)
  const timeStr = latest.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  return (
    <div className="bg-rose text-white rounded-2xl p-4 border-2 border-rose/80 shadow-lg animate-fadeUp">
      <div className="flex items-center gap-3">
        <span className="text-3xl shrink-0">🆘</span>
        <div className="flex-1">
          <p className="font-bold text-lg leading-tight">SOS Alert — Priya needs help</p>
          <p className="text-white/80 text-sm">Triggered at {timeStr} · Patient pressed the emergency button</p>
        </div>
        <button
          onClick={resolve}
          className="px-4 py-2 rounded-xl bg-white/20 border border-white/30 text-white text-sm font-bold shrink-0 hover:bg-white/30 active:scale-95 transition-all"
        >
          Mark resolved
        </button>
      </div>
    </div>
  )
}

type Tab = 'overview' | 'diary' | 'medications' | 'activity' | 'chat' | 'ai'

// ─── Care Assistant ───────────────────────────────────────────────────────────

interface AIMsg { id: number; role: 'user' | 'ai'; text: string; tab?: Tab }

const CARE_AI_RESPONSES: { pattern: RegExp; text: string; tab?: Tab }[] = [
  { pattern: /\b(today|how was|day|summary)\b/i,      tab: 'activity',    text: "Today Priya had a good day ❤️ She played the Reminiscence game (4⭐) and recorded a 4-min diary entry — she sounded happy and mentioned her grandchildren and Bihu. Medication: 3 of 5 taken. Evening Memantine is still pending." },
  { pattern: /\b(diary|entries|record|spoke|said)\b/i,tab: 'diary',       text: "Recent diary mood trend is positive 😊 Today's entry (4:32 min) — mood: Happy. She spoke warmly about Bihu and her grandchildren. Yesterday (6:10 min) — Peaceful. She mentioned some knee discomfort. Sep 2 — Sad, she mentioned missing her late husband. Consider a gentle check-in." },
  { pattern: /\b(medicine|tablet|pill|medication|dose|missed|taken)\b/i, tab: 'medications', text: "⚠️ 2 medications pending today:\n• Memantine 20mg — evening dose, with dinner\n• B12 Supplement 500mcg — missed this morning\n\nCompleted ✓: Donepezil 10mg, Vitamin D3, Omega-3.\n\nReminder: B12 deficiency is common in NER diets — consistent supplementation is important." },
  { pattern: /\b(mood|feel|emotion|happy|sad|emotional|mental)\b/i, tab: 'overview',    text: "7-day mood summary:\nMon 😌 Tue 😊 Wed 😔 Thu 😊 Fri 😊 Sat 😌 Sun 😊\n\nOverall: Improving. Wednesday's lower mood followed a diary entry where she mentioned missing her late husband — this is a recurring theme. Engagement score is 78/100 and rising." },
  { pattern: /\b(activity|game|play|engagement|session|week|how active)\b/i, tab: 'activity', text: "This week Priya completed:\n🎮 Reminiscence Game: 3 sessions (avg 4⭐)\n🎵 Music Recognition: 2 sessions (loves Bihu)\n🃏 Memory Pairs: 1 session\n📔 Diary entries: 4 recordings\n\nMost loved: Bihu music — consistently 5⭐. Engagement score: 78/100 — up from 71 last week." },
  { pattern: /\b(food|eat|diet|meal|breakfast|lunch|dinner|nutrition|hungry)\b/i, tab: 'overview', text: "Today's meals recorded:\n🌅 Breakfast: Panta bhat, bamboo shoot chutney, dal\n☀️ Lunch: Rice, fish curry, leafy vegetables\n🌆 Dinner: Not yet recorded\n\n⚠️ Note: B12 supplement missed today. Bloodwork (Aug 20) showed level 180 pg/mL — deficient. Consistent supplementation is important." },
  { pattern: /\b(diary.*summarize|summarize.*diary|what.*said|transcript)\b/i, tab: 'diary', text: "30-day diary summary:\n\nEmotional themes: Joy (48%), Peaceful (28%), Sad (16%)\n\nTop topics mentioned: Family (18), Memories (14), Food (9), Health (6), Festivals (5)\n\n⚠️ Concern: Sep 2 entry shows signs of loneliness (missing her husband). Recommend: increased social contact and reminiscence activities around family photos." },
]

function getCareResponse(input: string): { text: string; tab?: Tab } {
  for (const r of CARE_AI_RESPONSES) {
    if (r.pattern.test(input)) return { text: r.text, tab: r.tab }
  }
  return { text: "I can help you understand Priya's daily summary, diary entries, medication status, mood trends, activity log, and diet. What would you like to know?" }
}

let careAiId = 0

function CareAssistant({ onJumpTo }: { onJumpTo: (tab: Tab) => void }) {
  const [messages, setMessages] = useState<AIMsg[]>([
    { id: 0, role: 'ai', text: "Hello! 🤖 I am your Care Assistant. I have access to Priya's full health summary. Ask me anything about her day, mood, medications, diary, or activity." }
  ])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, thinking])

  const send = (text: string) => {
    if (!text.trim()) return
    careAiId++
    setMessages(m => [...m, { id: careAiId, role: 'user', text }])
    setInput('')
    setThinking(true)
    setTimeout(() => {
      const res = getCareResponse(text)
      careAiId++
      setMessages(m => [...m, { id: careAiId, role: 'ai', text: res.text, tab: res.tab }])
      setThinking(false)
    }, 800)
  }

  const QUICK = ["How was Mom today?", "Any medicines missed?", "How has her mood been?", "Summarize her diary", "What did she eat?", "How active was she this week?"]

  return (
    <div className="flex flex-col h-full min-h-[500px]">
      <div className="flex items-center gap-3 mb-4 p-4 bg-sage/10 rounded-2xl border border-sage/30">
        <div className="w-10 h-10 rounded-full bg-terracotta/15 border border-terracotta/25 flex items-center justify-center text-xl shrink-0">💊</div>
        <div>
          <p className="font-bold text-bark">Care Assistant</p>
          <p className="text-bark/50 text-xs">AI-assisted · Always confirm with your clinical team before acting</p>
        </div>
      </div>

      <div className="flex-1 overflow-auto space-y-3 mb-4 min-h-[300px]">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[88%] space-y-2`}>
              <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
                msg.role === 'user' ? 'bg-terracotta text-white rounded-br-sm' : 'bg-white border border-sand text-bark rounded-bl-sm'
              }`}>
                {msg.role === 'ai' && <span className="text-xs text-bark/40 font-bold block mb-1">Care Assistant</span>}
                {msg.text}
              </div>
              {msg.tab && (
                <button onClick={() => onJumpTo(msg.tab!)}
                  className="text-xs font-bold text-terracotta bg-terracotta/10 border border-terracotta/30 px-3 py-1.5 rounded-full hover:bg-terracotta/20 transition-colors"
                >→ View {msg.tab}</button>
              )}
            </div>
          </div>
        ))}
        {thinking && (
          <div className="flex justify-start">
            <div className="bg-white border border-sand rounded-2xl px-4 py-3 flex gap-2">
              {[0,1,2].map(i => <div key={i} className="think-dot w-2.5 h-2.5 rounded-full bg-bark/30" style={{ animationDelay: `${i * 0.2}s` }} />)}
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        {QUICK.map(q => (
          <button key={q} onClick={() => send(q)} className="text-xs font-semibold bg-sand text-bark/70 px-3 py-1.5 rounded-full hover:bg-sage/20 transition-colors">{q}</button>
        ))}
      </div>

      <div className="flex gap-2">
        <input className="flex-1 border border-sand rounded-xl px-3 py-2.5 text-sm text-bark focus:outline-none focus:border-terracotta"
          placeholder="Ask about Priya's health..."
          value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send(input)} />
        <button onClick={() => send(input)} className="bg-terracotta text-parchment px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-terracotta-light transition-colors">Send</button>
      </div>
    </div>
  )
}

// ─── Memory Engagement Card ───────────────────────────────────────────────────

function MemoryEngagementCard() {
  const info = useMemo(() => {
    const real = readStreakForDisplay()
    return real ?? { streak: 5, doneToday: true, lastActivity: 'Music Recognition', monthCount: 18 }
  }, [])

  return (
    <div className="bg-white rounded-2xl border border-sand p-5">
      <h3 className="font-serif text-bark font-semibold mb-4 flex items-center gap-2">
        🔥 Memory Engagement
        {info.doneToday && (
          <span className="bg-forest/15 text-forest text-xs font-bold px-2.5 py-0.5 rounded-full">Active today</span>
        )}
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        {[
          { label: 'Day streak', value: String(info.streak), color: 'bg-amber/15 text-bark' },
          { label: 'Active today', value: info.doneToday ? 'Yes ✓' : 'Not yet', color: info.doneToday ? 'bg-forest/10 text-forest' : 'bg-sand text-bark/50' },
          { label: 'Days this month', value: String(info.monthCount), color: 'bg-sage/15 text-bark' },
          { label: 'Last activity', value: info.lastActivity || 'None recorded', color: 'bg-plum/10 text-plum' },
        ].map(s => (
          <div key={s.label} className={`rounded-xl p-3 text-center ${s.color}`}>
            <div className="font-bold text-base leading-tight truncate">{s.value}</div>
            <div className="text-xs opacity-70 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>
      {!info.doneToday && (
        <p className="text-bark/50 text-sm bg-sand/50 rounded-lg px-4 py-2.5 leading-relaxed">
          🌷 No activity recorded today. A gentle check-in may be helpful.
        </p>
      )}
    </div>
  )
}

const PATIENT = {
  name: 'Priya Devi Borah',
  age: 72,
  state: 'Assam',
  stage: 'Moderate',
  language: 'Assamese',
  lastSeen: '2 hours ago',
  engagementScore: 78,
}

const DIARY_ENTRIES = [
  { date: 'Today, 10:14 AM', duration: '4:32', mood: '😊', language: 'অসমীয়া', topics: ['Family', 'Memories'], summary: 'Patient spoke warmly about grandchildren and Bihu festival preparations. Sounded happy and engaged.', transcription: 'আজি মই মোৰ নাতি-নাতিনীৰ কথা মনত পৰিল... বিহু উৎসৱত আমি একেলগে থিয়াত্ৰ চাবলৈ যাওঁহে...' },
  { date: 'Yesterday, 3:45 PM', duration: '6:10', mood: '😌', language: 'অসমীয়া', topics: ['Health', 'Daily life'], summary: 'Patient discussed her daily routine and mentioned some discomfort in her knee. Generally peaceful.', transcription: 'আজি গাঁঠিত অলপ বিষ আছে... কিন্তু ভাল লাগিছে...' },
  { date: 'Sep 2, 11:30 AM', duration: '2:45', mood: '😔', language: 'অসমীয়া', topics: ['Nostalgia', 'Family'], summary: 'Patient mentioned missing her late husband. Expressed some sadness. Consider a check-in call.', transcription: 'মোৰ স্বামীৰ কথা বহুত মনত পৰে... তেওঁ মোক বহুত ভাল পাইছিল...' },
  { date: 'Sep 1, 9:15 AM', duration: '5:20', mood: '😊', language: 'অসমীয়া', topics: ['Food', 'Memories'], summary: 'Patient described preparing traditional Assamese dishes. Very animated and detailed memories.', transcription: 'পিঠা বনোৱাৰ কথা মনত আছে... গুৰ আৰু নাৰিকল দি...' },
]

const MEDICATIONS = [
  { name: 'Donepezil', dose: '10mg', time: 'Morning', taken: true, notes: 'With breakfast' },
  { name: 'Memantine', dose: '20mg', time: 'Evening', taken: false, notes: 'With dinner' },
  { name: 'Vitamin D3', dose: '60,000 IU', time: 'Weekly (Sunday)', taken: true, notes: 'NER diet often deficient' },
  { name: 'Omega-3', dose: '1000mg', time: 'Morning', taken: true, notes: 'Brain health support' },
  { name: 'B12 Supplement', dose: '500mcg', time: 'Morning', taken: false, notes: 'Common deficiency in NER diet' },
]

const ACTIVITY_LOG = [
  { time: '10:14 AM', type: 'Diary', detail: 'Recorded a 4-min audio entry', emoji: '📔', engagement: 5 },
  { time: '9:45 AM', type: 'Game', detail: 'Reminiscence Game — Silbatta & Jhapi', emoji: '🖼️', engagement: 4 },
  { time: '9:20 AM', type: 'Medication', detail: 'Donepezil 10mg taken', emoji: '💊', engagement: null },
  { time: '8:55 AM', type: 'Breakfast', detail: 'Panta bhat, bamboo shoot chutney, dal', emoji: '🍚', engagement: null },
  { time: 'Yesterday 4:30 PM', type: 'Game', detail: 'Music Recognition — Bihu songs', emoji: '🎵', engagement: 5 },
  { time: 'Yesterday 2:15 PM', type: 'Game', detail: 'Memory Challenge — 3 objects', emoji: '🧩', engagement: 3 },
]

const CHAT_MESSAGES = [
  { from: 'doctor', name: 'Dr. Sharma', time: '9:00 AM', text: 'Good morning. I reviewed Priya\'s diary trends from last week. Her mood scores are improving. Please continue the current game schedule and ensure Memantine is taken with dinner.' },
  { from: 'caregiver', name: 'You', time: '9:15 AM', text: 'Thank you Doctor. She has been enjoying the Bihu music games a lot. I noticed she remembered the Borgeet lyrics clearly.' },
  { from: 'doctor', name: 'Dr. Sharma', time: '9:20 AM', text: 'That is excellent — music memory often remains intact longer in Alzheimer\'s patients. Document which songs engage her most. Also check Vitamin B12 levels this month — common in NER diets.' },
  { from: 'caregiver', name: 'You', time: '9:35 AM', text: 'Understood. I will schedule the blood test this week. She also mentioned her knee pain again — should I note this for the next appointment?' },
]

const MOOD_TREND = [
  { day: 'Mon', score: 3, emoji: '😌' },
  { day: 'Tue', score: 4, emoji: '😊' },
  { day: 'Wed', score: 2, emoji: '😔' },
  { day: 'Thu', score: 4, emoji: '😊' },
  { day: 'Fri', score: 5, emoji: '😊' },
  { day: 'Sat', score: 3, emoji: '😌' },
  { day: 'Sun', score: 4, emoji: '😊' },
]

const NAV_ITEMS: { tab: Tab; emoji: string; label: string }[] = [
  { tab: 'overview',    emoji: '📊', label: 'Overview'   },
  { tab: 'diary',       emoji: '📔', label: 'Diary'      },
  { tab: 'medications', emoji: '💊', label: 'Medications'},
  { tab: 'activity',    emoji: '🕐', label: 'Activity'   },
  { tab: 'chat',        emoji: '💬', label: 'Doctor Chat'},
  { tab: 'ai',          emoji: '💡', label: 'Care Insights'},
]

interface Props { onBack: () => void; userName?: string }

export default function CaregiverView({ onBack, userName }: Props) {
  const [tab, setTab] = useState<Tab>('overview')
  const [expandedDiary, setExpandedDiary] = useState<number | null>(null)
  const [medChecked, setMedChecked] = useState<Set<string>>(
    new Set(MEDICATIONS.filter(m => m.taken).map(m => m.name))
  )
  const [chatInput, setChatInput] = useState('')

  const toggleMed = (name: string) =>
    setMedChecked(s => { const next = new Set(s); next.has(name) ? next.delete(name) : next.add(name); return next })

  return (
    <div className="min-h-full flex flex-col bg-cream">
      {/* Header */}
      <header className="bg-terracotta text-parchment px-5 py-4 flex items-center gap-4 sticky top-0 z-10 shadow-sm">
        <button
          onClick={onBack}
          className="w-11 h-11 flex items-center justify-center rounded-full bg-parchment/15 hover:bg-parchment/25 transition-colors text-xl shrink-0"
        >
          ←
        </button>
        <div className="flex-1">
          <p className="text-parchment/60 text-xs font-semibold tracking-wide">Smaran · Caregiver Dashboard {userName ? `· ${userName}` : ''}</p>
          <h1 className="font-serif text-parchment text-lg font-semibold">{PATIENT.name}</h1>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-parchment/60 text-xs">Last seen</p>
          <p className="text-parchment text-sm font-semibold">{PATIENT.lastSeen}</p>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <nav className="w-16 md:w-52 bg-white border-r border-sand flex flex-col py-4 shrink-0">
          {NAV_ITEMS.map(item => (
            <button
              key={item.tab}
              onClick={() => setTab(item.tab)}
              className={`flex items-center gap-3 px-3 md:px-5 py-3.5 text-left transition-all ${
                tab === item.tab
                  ? 'bg-terracotta/10 border-r-2 border-terracotta text-terracotta font-bold'
                  : 'text-bark/60 hover:bg-sand/60 hover:text-bark'
              }`}
            >
              <span className="text-xl shrink-0">{item.emoji}</span>
              <span className="hidden md:block text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Main */}
        <main className="flex-1 overflow-auto p-5">

          {/* ── Overview ── */}
          {tab === 'overview' && (
            <div className="animate-fadeUp space-y-5">
              {/* SOS Alert */}
              <SOSAlertBanner />
              {/* Stats row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { label: 'Engagement', value: `${PATIENT.engagementScore}/100`, emoji: '⭐', color: 'text-amber' },
                  { label: 'Games Today', value: '2 played', emoji: '🎮', color: 'text-forest' },
                  { label: 'Meds Taken', value: '3 / 5', emoji: '💊', color: 'text-terracotta' },
                  { label: 'Mood Trend', value: '↑ Improving', emoji: '😊', color: 'text-sage' },
                ].map(s => (
                  <div key={s.label} className="bg-white rounded-xl p-4 border border-sand">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{s.emoji}</span>
                      <span className={`text-xs font-bold tracking-wide ${s.color}`}>{s.label.toUpperCase()}</span>
                    </div>
                    <div className="font-bold text-bark text-lg">{s.value}</div>
                  </div>
                ))}
              </div>

              {/* Memory Engagement card */}
              <MemoryEngagementCard />

              {/* Patient card */}
              <div className="bg-white rounded-2xl border border-sand p-5">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full bg-terracotta/20 flex items-center justify-center text-3xl shrink-0">👵</div>
                  <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-y-2 text-sm">
                    <div><span className="text-bark/40 block text-xs">Age</span><span className="font-semibold">{PATIENT.age} years</span></div>
                    <div><span className="text-bark/40 block text-xs">State</span><span className="font-semibold">{PATIENT.state}</span></div>
                    <div><span className="text-bark/40 block text-xs">Stage</span><span className="font-semibold text-terracotta">{PATIENT.stage} Dementia</span></div>
                    <div><span className="text-bark/40 block text-xs">Language</span><span className="font-semibold">{PATIENT.language}</span></div>
                    <div><span className="text-bark/40 block text-xs">Assigned Doctor</span><span className="font-semibold">Dr. R. Sharma</span></div>
                    <div><span className="text-bark/40 block text-xs">Region</span><span className="font-semibold">Jorhat, Assam</span></div>
                  </div>
                </div>
              </div>

              {/* Mood trend */}
              <div className="bg-white rounded-2xl border border-sand p-5">
                <h3 className="font-serif text-bark font-semibold mb-4">7-Day Mood Trend</h3>
                <div className="flex items-end gap-2 h-28">
                  {MOOD_TREND.map(m => (
                    <div key={m.day} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-sm">{m.emoji}</span>
                      <div
                        className="w-full rounded-t-lg bg-terracotta/70 transition-all"
                        style={{ height: `${m.score * 18}px` }}
                      />
                      <span className="text-bark/40 text-xs">{m.day}</span>
                    </div>
                  ))}
                </div>
                <p className="text-bark/40 text-xs mt-3">Based on diary entries and caregiver ratings</p>
              </div>

              {/* Alerts */}
              <div className="bg-amber/10 border border-amber/40 rounded-xl p-4">
                <p className="font-bold text-bark text-sm mb-2">⚠️ Today's Reminders</p>
                <ul className="space-y-1 text-sm text-bark/70">
                  <li>• Memantine (evening dose) not yet marked as taken</li>
                  <li>• B12 supplement missed this morning</li>
                  <li>• Patient mentioned knee pain — log for Dr. Sharma</li>
                  <li>• Consider scheduling B12 blood test this week</li>
                </ul>
              </div>
            </div>
          )}

          {/* ── Diary ── */}
          {tab === 'diary' && (
            <div className="animate-fadeUp space-y-3">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif text-bark text-xl">Diary Entries</h2>
                <span className="text-bark/40 text-sm">🔒 Encrypted & Private</span>
              </div>
              {DIARY_ENTRIES.map((entry, i) => (
                <div key={i} className="bg-white rounded-2xl border border-sand overflow-hidden">
                  <button
                    className="w-full p-4 flex items-center gap-4 text-left hover:bg-sand/30 transition-colors"
                    onClick={() => setExpandedDiary(expandedDiary === i ? null : i)}
                  >
                    <span className="text-3xl">{entry.mood}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-bark text-sm">{entry.date}</span>
                        <span className="text-bark/40 text-xs">{entry.language}</span>
                        {entry.topics.map(t => (
                          <span key={t} className="bg-forest/10 text-forest text-xs px-2 py-0.5 rounded-full font-semibold">{t}</span>
                        ))}
                      </div>
                      <p className="text-bark/50 text-xs mt-0.5">Duration: {entry.duration}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button className="bg-terracotta/10 text-terracotta text-xs font-bold px-3 py-1.5 rounded-full hover:bg-terracotta/20 transition-colors">
                        ▶ Play
                      </button>
                      <span className="text-bark/30 text-sm">{expandedDiary === i ? '▲' : '▼'}</span>
                    </div>
                  </button>
                  {expandedDiary === i && (
                    <div className="border-t border-sand px-4 pb-4 animate-fadeUp">
                      <div className="bg-forest/5 rounded-xl p-3 mb-3 mt-3">
                        <p className="text-xs text-forest font-bold mb-1">AUTO-TRANSCRIPTION ({entry.language})</p>
                        <p className="text-bark/70 text-sm italic font-serif">"{entry.transcription}"</p>
                      </div>
                      <div className="bg-amber/10 rounded-xl p-3 mb-3">
                        <p className="text-xs text-bark/50 font-bold mb-1">CAREGIVER SUMMARY</p>
                        <p className="text-bark text-sm">{entry.summary}</p>
                      </div>
                      <div>
                        <p className="text-xs text-bark/40 font-bold mb-2">ADD CAREGIVER NOTE</p>
                        <textarea
                          className="w-full border border-sand rounded-lg p-2 text-sm text-bark resize-none focus:outline-none focus:border-terracotta"
                          rows={2}
                          placeholder="Add a private note about this entry..."
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ── Medications ── */}
          {tab === 'medications' && (
            <div className="animate-fadeUp space-y-3">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-serif text-bark text-xl">Today's Medications</h2>
                <span className="bg-terracotta/10 text-terracotta text-xs font-bold px-3 py-1 rounded-full">
                  {medChecked.size} / {MEDICATIONS.length} taken
                </span>
              </div>
              {MEDICATIONS.map(med => (
                <div
                  key={med.name}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                    medChecked.has(med.name) ? 'bg-forest/5 border-forest/20' : 'bg-white border-sand'
                  }`}
                >
                  <button
                    onClick={() => toggleMed(med.name)}
                    className={`w-9 h-9 rounded-full border-2 flex items-center justify-center text-base transition-all shrink-0 ${
                      medChecked.has(med.name) ? 'bg-forest border-forest text-white' : 'border-sand hover:border-forest/50'
                    }`}
                  >
                    {medChecked.has(med.name) ? '✓' : ''}
                  </button>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-bark">{med.name}</span>
                      <span className="bg-sand text-bark/60 text-xs px-2 py-0.5 rounded-full">{med.dose}</span>
                      <span className="text-bark/50 text-xs">{med.time}</span>
                    </div>
                    <p className="text-bark/40 text-xs mt-0.5">{med.notes}</p>
                  </div>
                  {!medChecked.has(med.name) && (
                    <span className="text-terracotta text-xs font-bold shrink-0">PENDING</span>
                  )}
                </div>
              ))}
              <div className="bg-forest/5 border border-forest/20 rounded-xl p-4 mt-4">
                <p className="text-forest font-bold text-sm mb-1">🥦 NER Diet Note</p>
                <p className="text-bark/60 text-sm">Traditional NER diets (bamboo shoots, fermented vegetables, sticky rice) can be low in B12 and Vitamin D. Today's supplement adherence is important.</p>
              </div>
            </div>
          )}

          {/* ── Activity ── */}
          {tab === 'activity' && (
            <div className="animate-fadeUp">
              <h2 className="font-serif text-bark text-xl mb-4">Activity Log</h2>
              <div className="relative">
                <div className="absolute left-8 top-0 bottom-0 w-px bg-sand" />
                <div className="space-y-4">
                  {ACTIVITY_LOG.map((a, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="w-16 shrink-0 text-right">
                        <span className="text-bark/40 text-xs">{a.time.split(' ').pop()}</span>
                      </div>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-base shrink-0 z-10 ${
                        a.type === 'Medication' ? 'bg-terracotta/15' : a.type === 'Game' ? 'bg-forest/15' : a.type === 'Diary' ? 'bg-rose/15' : 'bg-amber/15'
                      }`}>
                        {a.emoji}
                      </div>
                      <div className="flex-1 bg-white rounded-xl border border-sand p-3 -mt-1">
                        <div className="flex items-center gap-2 justify-between">
                          <span className="font-semibold text-bark text-sm">{a.type}</span>
                          {a.engagement && (
                            <span className="text-amber text-xs">{'⭐'.repeat(a.engagement)}</span>
                          )}
                        </div>
                        <p className="text-bark/60 text-xs mt-0.5">{a.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── AI Assistant ── */}
          {tab === 'ai' && (
            <div className="animate-fadeUp">
              <CareAssistant onJumpTo={setTab} />
            </div>
          )}

          {/* ── Chat ── */}
          {tab === 'chat' && (
            <div className="animate-fadeUp flex flex-col h-full" style={{ minHeight: '500px' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-forest/20 flex items-center justify-center text-xl">👨‍⚕️</div>
                <div>
                  <p className="font-bold text-bark">Dr. R. Sharma</p>
                  <p className="text-bark/40 text-xs">Neurologist · GMCH, Guwahati</p>
                </div>
                <span className="ml-auto w-2 h-2 rounded-full bg-forest animate-pulse" />
              </div>
              <div className="flex-1 space-y-3 mb-4 overflow-auto">
                {CHAT_MESSAGES.map((msg, i) => (
                  <div key={i} className={`flex ${msg.from === 'caregiver' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.from === 'caregiver'
                        ? 'bg-terracotta text-white rounded-br-sm'
                        : 'bg-white border border-sand text-bark rounded-bl-sm'
                    }`}>
                      <p>{msg.text}</p>
                      <p className={`text-xs mt-1 ${msg.from === 'caregiver' ? 'text-white/60' : 'text-bark/40'}`}>{msg.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 bg-white rounded-2xl border border-sand p-3">
                <input
                  className="flex-1 text-sm text-bark placeholder-bark/30 focus:outline-none bg-transparent"
                  placeholder="Type a message to Dr. Sharma..."
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                />
                <button
                  className="bg-terracotta text-parchment px-4 py-2 rounded-xl font-semibold text-sm hover:bg-terracotta-light transition-colors shrink-0"
                  onClick={() => setChatInput('')}
                >
                  Send
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

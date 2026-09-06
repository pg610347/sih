import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { readStreakForDisplay } from '../hooks/useStreak'

// ─── SOS Alert Banner ────────────────────────────────────────────────────────

interface SOSEvent { timestamp: string; resolved: boolean }

function DoctorSOSBanner() {
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
    localStorage.setItem('nercare_sos_v1', JSON.stringify(raw.map(e => ({ ...e, resolved: true }))))
    setEvents([])
  }

  if (events.length === 0) return null

  const timeStr = new Date(events[0].timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

  return (
    <div className="bg-rose text-white rounded-2xl p-4 border-2 border-rose/80 shadow-lg mb-4 animate-fadeUp">
      <div className="flex items-center gap-3">
        <span className="text-3xl shrink-0">🆘</span>
        <div className="flex-1">
          <p className="font-bold text-lg leading-tight">SOS Alert — Patient Emergency</p>
          <p className="text-white/80 text-sm">Priya triggered an SOS at {timeStr} · Check with caregiver</p>
        </div>
        <button
          onClick={resolve}
          className="px-4 py-2 rounded-xl bg-white/20 border border-white/30 text-white text-sm font-bold shrink-0 hover:bg-white/30 active:scale-95 transition-all"
        >
          Acknowledge
        </button>
      </div>
    </div>
  )
}

type DoctorTab = 'patients' | 'profile' | 'regional' | 'ai'

// ─── Clinical Assistant ───────────────────────────────────────────────────────

interface ClinMsg { id: number; role: 'user' | 'ai'; text: string; tab?: DoctorTab }

const CLINICAL_RESPONSES: { pattern: RegExp; text: string; tab?: DoctorTab }[] = [
  { pattern: /\b(summary|overview|brief|who is|give me|patient)\b/i, tab: 'profile',
    text: "Patient: Priya Devi Borah, 72F, Jorhat, Assam.\nDiagnosis: Moderate Alzheimer's Disease\nLanguage: Assamese | Preferred activity: Bihu music\n\nKey Metrics:\n• Engagement Score: 78/100 (↑ +73% since onboarding)\n• Medication Adherence: 60% (2 missed today)\n• Mood: Improving — 5 of 7 days positive this week\n• Diary: 25 entries this month\n\n⚠️ Clinical Concern: B12 level 180 pg/mL (deficient, Aug 20). Knee pain noted in diary — consider orthopedic referral.\n\n🏷️ AI-assisted insight · Requires professional review" },
  { pattern: /\b(engagement|engagement.*change|active|playing|games)\b/i, tab: 'profile',
    text: "8-Week Engagement Trend:\nW1: 45 → W2: 58 → W3: 62 → W4: 71 → W5: 78 → W6: 74 → W7: 82 → W8: 78\n\nBest-performing activity: Bihu music recognition (consistently 5/5). Reminiscence games: 4-5/5. Memory Pairs: 3-4/5.\n\nRecommendation: Continue music therapy. Introduce Sequence game (procedural memory support).\n\n🏷️ AI-assisted insight · Requires professional review" },
  { pattern: /\b(diary|entries|emotional|transcript|mood.*diary|diary.*mood)\b/i, tab: 'profile',
    text: "30-Day Diary Analysis (25 entries):\n\nMood Distribution:\n😊 Joy: 48% (12 entries)\n😌 Peaceful: 28% (7 entries)\n😔 Sad: 16% (4 entries)\n😤 Restless: 8% (2 entries)\n\nTop Topics: Family (18), Memories (14), Food (9), Health (6), Festivals (5)\n\n⚠️ Alert: Sep 2 entry — signs of loneliness, patient missed late husband. Consider psychosocial intervention or increased caregiver check-ins.\n\n🏷️ AI-assisted insight · Requires professional review" },
  { pattern: /\b(medication|adherence|medicine|tablet|missed|compliance)\b/i, tab: 'profile',
    text: "Medication Adherence Report:\n• Donepezil 10mg: 85% ✓ (good)\n• Memantine 20mg: 52% ⚠️ (often missed — evening dose)\n• Vitamin D3 60,000 IU: 90% ✓\n• Omega-3 1000mg: 88% ✓\n• B12 500mcg: 48% ⚠️ (critical — deficiency confirmed)\n\nRecommendation: Set caregiver alert for Memantine evening dose. Discuss B12 injection as alternative if oral adherence remains low.\n\n🏷️ AI-assisted insight · Requires professional review" },
  { pattern: /\b(nutrition|diet|food|b12|vitamin|deficiency|eat|weight)\b/i, tab: 'regional',
    text: "Nutritional Summary:\nCaloric intake: ~1,450 kcal/day (adequate for age/weight)\nProtein: Moderate (dal, fish)\n\n⚠️ Deficiencies:\n• B12: 180 pg/mL — Deficient. Supplementation started Aug 20. Adherence: 48%.\n• Vitamin D: Low-normal. Weekly supplementation ongoing.\n• Iron: Within normal range.\n\nRegional Context: Traditional Assamese diet (bamboo shoots, fermented vegetables, sticky rice) is nutrient-rich but may lack B12, especially in patients with reduced animal protein intake.\n\n🏷️ AI-assisted insight · Requires professional review" },
  { pattern: /\b(progress|report|generate|export|summary.*report)\b/i, tab: 'profile',
    text: "Patient Progress Report — September 2026\n\n✅ Engagement: 78/100 — Strong improvement\n✅ Mood: Mostly positive, improving weekly\n⚠️ Medication: B12 and Memantine adherence low\n⚠️ Clinical: B12 deficiency, knee pain (new)\n✅ Cognitive: Music memory intact; procedural memory exercises begun\n✅ Diary: 25 entries (high frequency — good sign)\n\nNext Steps: B12 injection review, Memantine adherence intervention, knee assessment.\n\n🏷️ AI-assisted insight · Requires professional review" },
  { pattern: /\b(regional|assam|northeast|ner|all patients|population)\b/i, tab: 'regional',
    text: "NER Regional Snapshot (7 states, 135 patients):\n\nHighest Engagement: Mizoram (80/100 avg)\nLowest Engagement: Nagaland (55/100 avg)\n\nCommon Deficiencies across NER:\n• B12: All states — linked to plant-heavy traditional diets\n• Vitamin D: Manipur, Mizoram — limited sun exposure in highlands\n• Iron: Nagaland, Tripura\n\nPatterns: Mild-stage patients in Meghalaya show highest medication adherence (95%). Moderate-stage patients in Manipur show concerning disengagement.\n\n🏷️ AI-assisted insight · Requires professional review" },
]

function getClinicalResponse(input: string): { text: string; tab?: DoctorTab } {
  for (const r of CLINICAL_RESPONSES) {
    if (r.pattern.test(input)) return { text: r.text, tab: r.tab }
  }
  return { text: "I can provide clinical summaries, engagement trends, diary emotional analysis, medication adherence reports, nutritional assessments, and regional NER health data. What would you like to review?\n\n🏷️ AI-assisted insight · Requires professional review" }
}

let clinId = 0

function ClinicalAssistant({ onJumpTo }: { onJumpTo: (tab: DoctorTab) => void }) {
  const [messages, setMessages] = useState<ClinMsg[]>([
    { id: 0, role: 'ai', text: "Hello, Doctor. 🤖 I am the Clinical Assistant. I have access to Priya's full clinical record. Ask me for a patient summary, diary analysis, medication adherence report, engagement trends, or nutritional assessment.\n\n🏷️ AI-assisted insight · Requires professional review" }
  ])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, thinking])

  const send = (text: string) => {
    if (!text.trim()) return
    clinId++
    setMessages(m => [...m, { id: clinId, role: 'user', text }])
    setInput('')
    setThinking(true)
    setTimeout(() => {
      const res = getClinicalResponse(text)
      clinId++
      setMessages(m => [...m, { id: clinId, role: 'ai', text: res.text, tab: res.tab }])
      setThinking(false)
    }, 900)
  }

  const QUICK = [
    "Give me a patient summary",
    "How has engagement changed?",
    "Summarize 30 days of diary",
    "Show medication adherence",
    "Any nutritional concerns?",
    "Generate progress report",
    "NER regional patterns",
  ]

  return (
    <div className="flex flex-col min-h-[500px]">
      <div className="flex items-center gap-3 mb-4 p-4 bg-forest/5 rounded-2xl border border-forest/20">
        <div className="w-10 h-10 rounded-full bg-forest/10 border border-forest/20 flex items-center justify-center text-xl shrink-0">🩺</div>
        <div>
          <p className="font-bold text-bark">Clinical Assistant</p>
          <p className="text-bark/50 text-xs">AI-assisted · All outputs require professional review before clinical action</p>
        </div>
      </div>

      <div className="flex-1 overflow-auto space-y-3 mb-4 min-h-[300px] max-h-[400px]">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className="max-w-[90%] space-y-2">
              <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${
                msg.role === 'user' ? 'bg-forest-dark text-parchment rounded-br-sm' : 'bg-white border border-sand text-bark rounded-bl-sm'
              }`}>
                {msg.role === 'ai' && <span className="text-xs text-bark/40 font-bold block mb-1">🤖 Clinical Assistant</span>}
                {msg.text}
              </div>
              {msg.tab && (
                <button onClick={() => onJumpTo(msg.tab!)}
                  className="text-xs font-bold text-forest bg-forest/10 border border-forest/30 px-3 py-1.5 rounded-full hover:bg-forest/20 transition-colors"
                >→ View Supporting Data</button>
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
          <button key={q} onClick={() => send(q)} className="text-xs font-semibold bg-sand text-bark/70 px-3 py-1.5 rounded-full hover:bg-forest/10 transition-colors">{q}</button>
        ))}
      </div>

      <div className="flex gap-2">
        <input className="flex-1 border border-sand rounded-xl px-3 py-2.5 text-sm text-bark focus:outline-none focus:border-forest"
          placeholder="Ask a clinical question..."
          value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send(input)} />
        <button onClick={() => send(input)} className="bg-forest-dark text-parchment px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-forest transition-colors">Send</button>
      </div>
    </div>
  )
}

// ─── Engagement Consistency Card ──────────────────────────────────────────────

const DEMO_ENGAGEMENT: Record<number, { streak: number; doneToday: boolean; lastActivity: string; monthCount: number; preferred: string; trend: string }> = {
  1: { streak: 5, doneToday: true,  lastActivity: 'Today',    monthCount: 18, preferred: 'Music Recognition', trend: 'Engagement has remained consistent over the past 2 weeks.' },
  2: { streak: 9, doneToday: true,  lastActivity: 'Today',    monthCount: 22, preferred: 'Memory Pairs',      trend: 'Engagement has improved steadily over the past month.' },
  3: { streak: 1, doneToday: false, lastActivity: 'Yesterday',monthCount: 8,  preferred: 'Orientation',       trend: 'Engagement has decreased compared with the previous 2 weeks.' },
  4: { streak: 0, doneToday: false, lastActivity: '3 days ago',monthCount: 4, preferred: 'Pattern Game',      trend: 'Engagement has been minimal. A caregiver check-in is recommended.' },
  5: { streak: 12,doneToday: true,  lastActivity: 'Today',    monthCount: 25, preferred: 'Reminiscence',      trend: 'Engagement has remained consistently high.' },
  6: { streak: 3, doneToday: false, lastActivity: 'Yesterday',monthCount: 14, preferred: 'Kitchen or Field?', trend: 'Engagement is moderate and stable.' },
}

function EngagementConsistencyCard({ patientId }: { patientId: number }) {
  const info = useMemo(() => {
    const real = patientId === 1 ? readStreakForDisplay() : null
    if (real) {
      return { ...real, preferred: 'Music Recognition', trend: real.streak >= 7 ? 'Engagement has remained consistent over the past 2 weeks.' : 'Engagement is building steadily.' }
    }
    return DEMO_ENGAGEMENT[patientId] ?? DEMO_ENGAGEMENT[1]
  }, [patientId])

  const trendPositive = info.trend.includes('consistent') || info.trend.includes('improved') || info.trend.includes('high')

  return (
    <div className="bg-white rounded-2xl border border-sand p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-serif text-bark font-semibold">📊 Engagement Consistency</h3>
        <span className="text-xs text-bark/40 font-semibold bg-sand px-2.5 py-1 rounded-full">AI insight</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        {[
          { label: 'Current streak', value: `${info.streak} ${info.streak === 1 ? 'day' : 'days'}`, color: 'bg-amber/15 text-bark' },
          { label: 'Active days / month', value: `${info.monthCount} / 30`, color: 'bg-forest/10 text-forest' },
          { label: 'Last activity', value: info.lastActivity, color: 'bg-sage/15 text-bark' },
          { label: 'Preferred activity', value: info.preferred, color: 'bg-plum/10 text-plum' },
        ].map(s => (
          <div key={s.label} className={`rounded-xl p-3 ${s.color}`}>
            <div className="font-bold text-sm leading-tight">{s.value}</div>
            <div className="text-xs opacity-60 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>
      <div className={`rounded-xl px-4 py-3 text-sm leading-relaxed ${trendPositive ? 'bg-forest/5 border border-forest/20 text-forest' : 'bg-terracotta/5 border border-terracotta/20 text-terracotta'}`}>
        {info.trend}
      </div>
      <p className="text-bark/30 text-xs mt-2">🏷️ AI-assisted insight · Engagement data should not be treated as a clinical diagnosis</p>
    </div>
  )
}

const PATIENTS = [
  { id: 1, name: 'Priya Devi Borah',    age: 72, state: 'Assam',     stage: 'Moderate', engagement: 78, adherence: 60, mood: '😊', language: 'Assamese',  alert: null,              lastActive: '2h ago'  },
  { id: 2, name: 'Lalthansangi Ralte',  age: 68, state: 'Mizoram',   stage: 'Mild',     engagement: 91, adherence: 88, mood: '😌', language: 'Mizo',      alert: null,              lastActive: '4h ago'  },
  { id: 3, name: 'Khuphang Maring',     age: 75, state: 'Manipur',   stage: 'Moderate', engagement: 44, adherence: 52, mood: '😔', language: 'Manipuri',  alert: 'Low engagement',  lastActive: '1d ago'  },
  { id: 4, name: 'Abilash Khongdup',    age: 80, state: 'Nagaland',  stage: 'Severe',   engagement: 29, adherence: 40, mood: '😤', language: 'Nagamese',  alert: 'Medication missed',lastActive: '3h ago' },
  { id: 5, name: 'Phunga Syiem',        age: 65, state: 'Meghalaya', stage: 'Mild',     engagement: 85, adherence: 95, mood: '😊', language: 'Khasi',     alert: null,              lastActive: '1h ago'  },
  { id: 6, name: 'Ratan Barua',         age: 70, state: 'Assam',     stage: 'Moderate', engagement: 62, adherence: 71, mood: '😌', language: 'Assamese',  alert: 'B12 deficiency',  lastActive: '5h ago'  },
]

const ENGAGEMENT_HISTORY = [
  { week: 'W1', score: 45 },
  { week: 'W2', score: 58 },
  { week: 'W3', score: 62 },
  { week: 'W4', score: 71 },
  { week: 'W5', score: 78 },
  { week: 'W6', score: 74 },
  { week: 'W7', score: 82 },
  { week: 'W8', score: 78 },
]

const DIARY_INSIGHTS = {
  moodBreakdown: [
    { label: 'Joyful', count: 12, color: 'bg-amber', pct: 48 },
    { label: 'Peaceful', count: 7, color: 'bg-sage', pct: 28 },
    { label: 'Sad', count: 4, color: 'bg-plum/60', pct: 16 },
    { label: 'Frustrated', count: 2, color: 'bg-terracotta', pct: 8 },
  ],
  topics: ['Family (18)', 'Memories (14)', 'Food (9)', 'Health (6)', 'Festivals (5)'],
  recentAlert: 'Entry from Sep 2 shows signs of loneliness. Consider caregiver check-in and social activity.',
}

const CLINICAL_NOTES = [
  { date: 'Sep 4', note: 'Patient showing improved music memory recall. Bihu song recognition 100%. Continue music therapy protocol.' },
  { date: 'Aug 28', note: 'Adjusted Donepezil to 10mg after tolerability assessment. Monitor for GI side effects.' },
  { date: 'Aug 20', note: 'B12 level = 180 pg/mL (low). Prescribed supplementation. Common in NER dietary pattern — limited animal protein.' },
]

const REGIONAL_DATA = [
  { state: 'Assam',     patients: 42, avgEngagement: 69, commonDeficiency: 'B12, Iron',   commonStage: 'Moderate' },
  { state: 'Manipur',   patients: 28, avgEngagement: 61, commonDeficiency: 'Vitamin D',   commonStage: 'Mild'     },
  { state: 'Meghalaya', patients: 19, avgEngagement: 74, commonDeficiency: 'B12',          commonStage: 'Mild'     },
  { state: 'Nagaland',  patients: 15, avgEngagement: 55, commonDeficiency: 'Iron, B12',    commonStage: 'Moderate' },
  { state: 'Mizoram',   patients: 12, avgEngagement: 80, commonDeficiency: 'Vitamin D',   commonStage: 'Mild'     },
  { state: 'Tripura',   patients: 11, avgEngagement: 58, commonDeficiency: 'Protein, B12', commonStage: 'Moderate' },
  { state: 'Sikkim',    patients: 8,  avgEngagement: 71, commonDeficiency: 'Iron',          commonStage: 'Mild'     },
]

function StageChip({ stage }: { stage: string }) {
  const colors: Record<string, string> = {
    Mild: 'bg-forest/15 text-forest',
    Moderate: 'bg-amber/20 text-bark',
    Severe: 'bg-terracotta/20 text-terracotta',
  }
  return <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${colors[stage] ?? 'bg-sand text-bark/60'}`}>{stage}</span>
}

function ScoreBar({ score, color }: { score: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-sand rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-xs text-bark/50 w-8 text-right">{score}%</span>
    </div>
  )
}

interface Props { onBack: () => void; userName?: string }

export default function DoctorView({ onBack, userName }: Props) {
  const [tab, setTab] = useState<DoctorTab>('patients')
  const [selectedPatient, setSelectedPatient] = useState(PATIENTS[0])
  const [filter, setFilter] = useState<'all' | 'alert'>('all')
  const [noteInput, setNoteInput] = useState('')

  const filtered = filter === 'alert' ? PATIENTS.filter(p => p.alert) : PATIENTS

  const openProfile = (p: typeof PATIENTS[0]) => {
    setSelectedPatient(p)
    setTab('profile')
  }

  return (
    <div className="min-h-full flex flex-col bg-cream">
      {/* Header */}
      <header className="bg-forest-dark text-parchment px-5 py-4 flex items-center gap-4 sticky top-0 z-10 shadow-sm">
        <button
          onClick={tab === 'patients' ? onBack : () => setTab('patients')}
          className="w-11 h-11 flex items-center justify-center rounded-full bg-parchment/10 hover:bg-parchment/20 transition-colors text-xl shrink-0"
        >
          ←
        </button>
        <div className="flex-1">
          <p className="text-parchment/60 text-xs font-semibold tracking-wide">Smaran · Clinical Portal {userName ? `· ${userName}` : ''}</p>
          <h1 className="font-serif text-parchment text-lg font-semibold">
            {tab === 'patients'  && 'All Patients'}
            {tab === 'profile'   && selectedPatient.name}
            {tab === 'regional'  && 'Regional Insights'}
          </h1>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setTab('regional')}
            className={`text-xs font-bold px-3 py-1.5 rounded-full transition-colors ${tab === 'regional' ? 'bg-amber text-bark' : 'bg-parchment/10 text-parchment/70 hover:bg-parchment/20'}`}
          >🗺️ Regional</button>
          <button onClick={() => setTab('ai')}
            className={`text-xs font-bold px-3 py-1.5 rounded-full transition-colors ${tab === 'ai' ? 'bg-sage text-bark' : 'bg-parchment/10 text-parchment/70 hover:bg-parchment/20'}`}
          >🤖 Clinical AI</button>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-5">

        {/* ── Patient List ── */}
        {tab === 'patients' && (
          <div className="animate-fadeUp">
            <DoctorSOSBanner />
            {/* Filters */}
            <div className="flex items-center gap-3 mb-5">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${filter === 'all' ? 'bg-forest text-parchment' : 'bg-white border border-sand text-bark/60 hover:border-forest/40'}`}
              >
                All Patients ({PATIENTS.length})
              </button>
              <button
                onClick={() => setFilter('alert')}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${filter === 'alert' ? 'bg-terracotta text-parchment' : 'bg-white border border-sand text-bark/60 hover:border-terracotta/40'}`}
              >
                ⚠️ Needs Attention ({PATIENTS.filter(p => p.alert).length})
              </button>
            </div>

            <div className="space-y-3">
              {filtered.map(p => (
                <button
                  key={p.id}
                  onClick={() => openProfile(p)}
                  className="w-full bg-white rounded-2xl border border-sand p-4 text-left hover:border-forest/30 hover:shadow-sm transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-full bg-forest/10 flex items-center justify-center text-2xl shrink-0">
                      {p.mood}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-bold text-bark">{p.name}</span>
                        <StageChip stage={p.stage} />
                        {p.alert && (
                          <span className="bg-terracotta/15 text-terracotta text-xs font-bold px-2 py-0.5 rounded-full">⚠️ {p.alert}</span>
                        )}
                      </div>
                      <p className="text-bark/50 text-xs mb-2">{p.age} yrs · {p.state} · {p.language} · Last active {p.lastActive}</p>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                        <div>
                          <span className="text-bark/40 text-xs">Engagement</span>
                          <ScoreBar score={p.engagement} color="bg-forest" />
                        </div>
                        <div>
                          <span className="text-bark/40 text-xs">Medication Adherence</span>
                          <ScoreBar score={p.adherence} color="bg-terracotta" />
                        </div>
                      </div>
                    </div>
                    <span className="text-bark/30 shrink-0 mt-2">→</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Patient Profile ── */}
        {tab === 'profile' && (
          <div className="animate-fadeUp space-y-5 max-w-2xl">
            {/* Header card */}
            <div className="bg-white rounded-2xl border border-sand p-5">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-forest/10 flex items-center justify-center text-4xl shrink-0">
                  {selectedPatient.mood}
                </div>
                <div>
                  <h2 className="font-serif text-bark text-xl font-semibold">{selectedPatient.name}</h2>
                  <p className="text-bark/50 text-sm">{selectedPatient.age} years · {selectedPatient.state} · {selectedPatient.language}</p>
                  <div className="flex gap-2 mt-1">
                    <StageChip stage={selectedPatient.stage} />
                    {selectedPatient.alert && (
                      <span className="bg-terracotta/15 text-terracotta text-xs font-bold px-2 py-0.5 rounded-full">⚠️ {selectedPatient.alert}</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                {[
                  { label: 'Engagement', value: selectedPatient.engagement, suffix: '/100', color: 'text-forest' },
                  { label: 'Adherence', value: selectedPatient.adherence, suffix: '%', color: 'text-terracotta' },
                  { label: 'Diary Entries', value: 25, suffix: ' this month', color: 'text-plum' },
                ].map(m => (
                  <div key={m.label} className="bg-parchment rounded-xl p-3">
                    <div className={`font-bold text-xl ${m.color}`}>{m.value}<span className="text-xs text-bark/40">{m.suffix}</span></div>
                    <div className="text-bark/50 text-xs">{m.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Engagement Consistency */}
            <EngagementConsistencyCard patientId={selectedPatient.id} />

            {/* Engagement trend */}
            <div className="bg-white rounded-2xl border border-sand p-5">
              <h3 className="font-serif text-bark font-semibold mb-4">8-Week Engagement Trend</h3>
              <div className="flex items-end gap-2 h-24">
                {ENGAGEMENT_HISTORY.map(w => (
                  <div key={w.week} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full rounded-t-lg bg-forest/70 transition-all"
                      style={{ height: `${(w.score / 100) * 80}px` }}
                    />
                    <span className="text-bark/40 text-xs">{w.week}</span>
                  </div>
                ))}
              </div>
              <p className="text-bark/40 text-xs mt-2">Score out of 100 — based on game completion, diary frequency, and mood ratings</p>
            </div>

            {/* Diary Insights */}
            <div className="bg-white rounded-2xl border border-sand p-5">
              <h3 className="font-serif text-bark font-semibold mb-1">📔 Diary Insights (Last 30 Days)</h3>
              <div className="bg-terracotta/10 border border-terracotta/30 rounded-xl p-3 mb-4 text-sm">
                <p className="font-bold text-terracotta text-xs mb-0.5">⚠️ ALERT</p>
                <p className="text-bark/70">{DIARY_INSIGHTS.recentAlert}</p>
              </div>
              <p className="text-bark/50 text-xs mb-2 font-semibold">MOOD BREAKDOWN</p>
              <div className="space-y-2 mb-4">
                {DIARY_INSIGHTS.moodBreakdown.map(m => (
                  <div key={m.label} className="flex items-center gap-3">
                    <span className="text-bark/60 text-xs w-16">{m.label}</span>
                    <div className="flex-1 h-2 bg-sand rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${m.color}`} style={{ width: `${m.pct}%` }} />
                    </div>
                    <span className="text-bark/40 text-xs w-6">{m.count}</span>
                  </div>
                ))}
              </div>
              <p className="text-bark/50 text-xs mb-2 font-semibold">TOP TOPICS MENTIONED</p>
              <div className="flex flex-wrap gap-2">
                {DIARY_INSIGHTS.topics.map(t => (
                  <span key={t} className="bg-forest/10 text-forest text-xs px-3 py-1 rounded-full font-semibold">{t}</span>
                ))}
              </div>
            </div>

            {/* Clinical Notes */}
            <div className="bg-white rounded-2xl border border-sand p-5">
              <h3 className="font-serif text-bark font-semibold mb-4">Clinical Notes</h3>
              <div className="space-y-3 mb-4">
                {CLINICAL_NOTES.map((n, i) => (
                  <div key={i} className="flex gap-3">
                    <span className="text-bark/40 text-xs shrink-0 w-14">{n.date}</span>
                    <p className="text-bark/80 text-sm leading-relaxed">{n.note}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-sand pt-4">
                <p className="text-xs text-bark/40 font-bold mb-2">ADD NOTE</p>
                <textarea
                  className="w-full border border-sand rounded-xl p-3 text-sm text-bark resize-none focus:outline-none focus:border-forest"
                  rows={3}
                  placeholder="Add a clinical note or treatment adjustment..."
                  value={noteInput}
                  onChange={e => setNoteInput(e.target.value)}
                />
                <div className="flex gap-2 mt-2">
                  <button className="bg-forest text-parchment px-4 py-2 rounded-lg text-sm font-semibold hover:bg-forest-light transition-colors">
                    Save Note
                  </button>
                  <button className="bg-terracotta/10 text-terracotta px-4 py-2 rounded-lg text-sm font-semibold hover:bg-terracotta/20 transition-colors">
                    Notify Caregiver
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Clinical AI ── */}
        {tab === 'ai' && (
          <div className="animate-fadeUp max-w-2xl">
            <ClinicalAssistant onJumpTo={setTab} />
          </div>
        )}

        {/* ── Regional ── */}
        {tab === 'regional' && (
          <div className="animate-fadeUp space-y-5">
            <div className="bg-forest/5 border border-forest/20 rounded-2xl p-4">
              <p className="font-bold text-forest text-sm mb-1">🗺️ NER Regional Dashboard</p>
              <p className="text-bark/60 text-sm">Aggregate health data across 7 Northeast Indian states. Identify regional dementia patterns and nutritional gaps.</p>
            </div>
            <div className="space-y-3">
              {REGIONAL_DATA.map(s => (
                <div key={s.state} className="bg-white rounded-2xl border border-sand p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <span className="font-bold text-bark">{s.state}</span>
                      <span className="text-bark/40 text-sm ml-2">({s.patients} patients)</span>
                    </div>
                    <StageChip stage={s.commonStage} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-bark/40 text-xs block mb-1">Avg Engagement</span>
                      <ScoreBar score={s.avgEngagement} color="bg-forest" />
                    </div>
                    <div>
                      <span className="text-bark/40 text-xs block mb-1">Common Deficiencies</span>
                      <div className="flex gap-1 flex-wrap">
                        {s.commonDeficiency.split(', ').map(d => (
                          <span key={d} className="bg-amber/15 text-bark/70 text-xs px-2 py-0.5 rounded-full">{d}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-amber/10 border border-amber/30 rounded-2xl p-4">
              <p className="font-bold text-bark text-sm mb-2">📊 Regional Insight</p>
              <p className="text-bark/70 text-sm leading-relaxed">
                Vitamin B12 deficiency is prevalent across all NER states, likely due to dietary patterns with limited animal protein and reliance on fermented vegetables. Consider regional supplementation guidance for all patients on Donepezil, as B12 deficiency can accelerate cognitive decline.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

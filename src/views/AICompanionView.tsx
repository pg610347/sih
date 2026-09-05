import { useState, useRef, useEffect } from 'react'
import { getGeminiResponse, buildSystemPrompt, type GeminiMessage } from '@/gemini'

// ─── Types ────────────────────────────────────────────────────────────────────

type Gender = 'female' | 'male' | 'neutral'
type VoiceState = 'idle' | 'listening' | 'thinking' | 'speaking'
type NavigateTarget = 'diary' | 'music' | 'reminiscence' | 'pairs' | 'sort' | 'pattern' | 'sequence' | 'orientation' | 'home'

interface Message {
  id: number
  role: 'user' | 'ai'
  text: string
  chips?: string[]
  navigating?: string
  inputMode?: 'voice' | 'text'
}

interface Props {
  onBack: () => void
  onNavigate: (screen: NavigateTarget) => void
}

// ─── Companion personas ───────────────────────────────────────────────────────

const PERSONAS: Record<Gender, { emoji: string; name: string; intro: string; ring: string }> = {
  female:  { emoji: '👩', name: 'Devi',   ring: 'ring-rose/40',    intro: "Namaste! 🌸 I am Devi, your companion. I am here to listen and help. What would you like to do today?" },
  male:    { emoji: '👨', name: 'Arjun',  ring: 'ring-forest/40',  intro: "Namaste! 🌿 I am Arjun. I am always here for you. How can I help you today?" },
  neutral: { emoji: '🧑', name: 'Saathi', ring: 'ring-amber/40',   intro: "Hello! 🌾 I am Saathi, your companion. I am here whenever you need me. What would you like to do?" },
}

// ─── Fallback responses (used when Gemini API is unavailable) ──────────────

const FALLBACK_RESPONSES = [
  { text: "I am here with you ❤️ Whatever is on your mind, you can share it with me.", chips: ["Play a game 🎮", "Listen to music 🎵", "Open my diary 📔"] },
  { text: "That is lovely to hear. Would you like to do something together? 🌸", chips: ["Play a game 🎮", "Look at old things 🖼️", "Listen to music 🎵"] },
  { text: "Thank you for sharing that with me ❤️ Shall we do something enjoyable?", chips: ["Open my diary 📔", "Play a game 🎮", "Relax with music 🎵"] },
]

// ─── Text-to-speech ───────────────────────────────────────────────────────────

function speak(text: string, speed: number, onEnd?: () => void) {
  if (!('speechSynthesis' in window)) { onEnd?.(); return }
  window.speechSynthesis.cancel()
  const clean = text.replace(/[\u{1F300}-\u{1FFFF}]/gu, '').replace(/[❤️🌸🌿🌾🎶🎵🏡💊🎮📔🖼️🃏🧺📋🌤️🎉💬]/g, '').trim()
  const utt = new SpeechSynthesisUtterance(clean)
  utt.rate = speed; utt.pitch = 1.05; utt.volume = 1
  if (onEnd) utt.onend = onEnd
  window.speechSynthesis.speak(utt)
}

// ─── Companion avatar ─────────────────────────────────────────────────────────

function CompanionAvatar({ persona, voiceState }: { persona: Gender; voiceState: VoiceState }) {
  const p = PERSONAS[persona]
  return (
    <div className="relative flex items-center justify-center w-28 h-28 mx-auto">
      {voiceState === 'listening' && (
        <>
          <div className={`absolute inset-0 rounded-full border-4 border-rose/50 ripple-ring`} />
          <div className={`absolute inset-0 rounded-full border-4 border-rose/30 ripple-ring-2`} />
          <div className={`absolute inset-0 rounded-full border-4 border-rose/20 ripple-ring-3`} />
        </>
      )}
      <div className={`w-24 h-24 rounded-full flex items-center justify-center text-6xl bg-white border-4 ${p.ring} ring-4 shadow-lg z-10`}>
        {p.emoji}
      </div>
      {voiceState === 'speaking' && (
        <div className="absolute -bottom-2 flex gap-1 items-end z-20">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="speak-bar w-1.5 bg-forest rounded-full"
              style={{ height: '20px', animationDelay: `${i * 0.1}s`, animationDuration: `${0.4 + i * 0.05}s` }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Voice state label ────────────────────────────────────────────────────────

function VoiceLabel({ state, name }: { state: VoiceState; name: string }) {
  if (state === 'idle')      return <p className="text-bark/40 text-xl text-center">{name} is here for you ❤️</p>
  if (state === 'listening') return <p className="text-rose text-xl font-bold text-center animate-pulse">Listening...</p>
  if (state === 'thinking')  return (
    <div className="flex items-center gap-2 justify-center">
      {[0,1,2].map(i => <div key={i} className="think-dot w-3 h-3 rounded-full bg-bark/40" style={{ animationDelay: `${i * 0.2}s` }} />)}
    </div>
  )
  if (state === 'speaking')  return <p className="text-forest text-xl font-bold text-center">{name} is speaking...</p>
  return null
}

// ─── Settings panel ───────────────────────────────────────────────────────────

function SettingsPanel({ persona, setPersona, speed, setSpeed, onClose }: {
  persona: Gender; setPersona: (g: Gender) => void
  speed: number; setSpeed: (s: number) => void
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 bg-bark/40 z-50 flex items-end" onClick={onClose}>
      <div className="bg-white rounded-t-3xl w-full p-7 pb-10 max-h-[70vh] overflow-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <p className="font-serif text-bark text-2xl font-bold">Companion Settings</p>
          <button onClick={onClose} className="text-3xl text-bark/40 hover:text-bark">×</button>
        </div>

        <p className="text-bark/50 text-lg font-bold uppercase tracking-wide mb-3">Choose your companion</p>
        <div className="grid grid-cols-3 gap-3 mb-7">
          {(Object.keys(PERSONAS) as Gender[]).map(g => (
            <button key={g} onClick={() => setPersona(g)}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${persona === g ? 'bg-amber/20 border-amber' : 'bg-white border-sand'}`}
            >
              <span className="text-4xl">{PERSONAS[g].emoji}</span>
              <span className="font-bold text-bark text-base">{PERSONAS[g].name}</span>
            </button>
          ))}
        </div>

        <p className="text-bark/50 text-lg font-bold uppercase tracking-wide mb-3">Voice speed</p>
        <div className="grid grid-cols-3 gap-3">
          {[{ label: 'Slow', val: 0.7 }, { label: 'Normal', val: 0.9 }, { label: 'Fast', val: 1.1 }].map(s => (
            <button key={s.label} onClick={() => setSpeed(s.val)}
              className={`py-4 rounded-2xl border-2 font-bold text-lg transition-all ${Math.abs(speed - s.val) < 0.15 ? 'bg-forest text-parchment border-forest' : 'bg-white border-sand text-bark'}`}
            >{s.label}</button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Quick action chips ───────────────────────────────────────────────────────

const DEFAULT_CHIPS = [
  "Play a game 🎮",
  "Open my diary 📔",
  "Listen to music 🎵",
  "Look at old things 🖼️",
  "What day is it? 🌍",
  "I am feeling sad",
]

// ─── Main component ───────────────────────────────────────────────────────────

export default function AICompanionView({ onBack, onNavigate }: Props) {
  const [persona, setPersona] = useState<Gender>('female')
  const [speed, setSpeed] = useState(0.9)
  const [voiceState, setVoiceState] = useState<VoiceState>('idle')
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const [useVoice, setUseVoice] = useState(false)
  const [introduced, setIntroduced] = useState(false)
  const msgEndRef = useRef<HTMLDivElement>(null)
  const srRef = useRef<any>(null)
  const msgId = useRef(0)
  const [geminiHistory, setGeminiHistory] = useState<GeminiMessage[]>([])

  const p = PERSONAS[persona]

  const addMessage = (msg: Omit<Message, 'id'>) => {
    msgId.current += 1
    setMessages(prev => [...prev, { ...msg, id: msgId.current }])
  }

  useEffect(() => { msgEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  // Introduce the companion on first load
  useEffect(() => {
    if (introduced) return
    setIntroduced(true)
    const timer = setTimeout(() => {
      addMessage({ role: 'ai', text: p.intro, chips: DEFAULT_CHIPS })
      setGeminiHistory([{ role: 'model', parts: [{ text: JSON.stringify({ text: p.intro, chips: DEFAULT_CHIPS }) }] }])
      setVoiceState('speaking')
      speak(p.intro, speed, () => setVoiceState('idle'))
    }, 500)
    return () => clearTimeout(timer)
  }, []) // eslint-disable-line

  const sendMessage = async (text: string, mode: 'voice' | 'text' = 'text') => {
    if (!text.trim()) return
    const trimmed = text.trim()
    addMessage({ role: 'user', text: trimmed, inputMode: mode })
    setInput('')
    setVoiceState('thinking')

    const speakIfVoice = (t: string, onEnd?: () => void) => {
      if (mode === 'voice') {
        setVoiceState('speaking')
        speak(t, speed, () => { setVoiceState('idle'); onEnd?.() })
      } else {
        setVoiceState('idle')
        onEnd?.()
      }
    }

    try {
      const systemPrompt = buildSystemPrompt(p.name)
      const res = await getGeminiResponse(trimmed, geminiHistory, systemPrompt)

      // Update Gemini conversation history
      setGeminiHistory(prev => [
        ...prev,
        { role: 'user' as const, parts: [{ text: trimmed }] },
        { role: 'model' as const, parts: [{ text: JSON.stringify(res) }] },
      ])

      if (res.navigate && res.navigate !== 'home') {
        addMessage({ role: 'ai', text: res.text, navigating: res.navigate })
        speakIfVoice(res.text, () => setTimeout(() => onNavigate(res.navigate as NavigateTarget), 800))
        if (mode !== 'voice') setTimeout(() => onNavigate(res.navigate as NavigateTarget), 1200)
      } else if (res.navigate === 'home') {
        addMessage({ role: 'ai', text: res.text })
        speakIfVoice(res.text, () => setTimeout(onBack, 800))
        if (mode !== 'voice') setTimeout(onBack, 1200)
      } else {
        addMessage({ role: 'ai', text: res.text, chips: res.chips })
        speakIfVoice(res.text)
      }
    } catch (error: any) {
      console.error('Gemini API error:', error)
      const fallback = FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)]
      addMessage({ role: 'ai', text: fallback.text, chips: fallback.chips })
      speakIfVoice(fallback.text)
    }
  }

  const startListening = () => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) {
      // Simulate listening for demo
      setVoiceState('listening')
      setTimeout(() => { setVoiceState('idle') }, 2000)
      return
    }
    srRef.current = new SR()
    srRef.current.lang = 'en-IN'
    srRef.current.onresult = (e: any) => {
      const text = e.results[0][0].transcript
      setVoiceState('idle')
      sendMessage(text, 'voice')
    }
    srRef.current.onerror = () => setVoiceState('idle')
    srRef.current.onend = () => { if (voiceState === 'listening') setVoiceState('idle') }
    srRef.current.start()
    setVoiceState('listening')
  }

  const stopListening = () => {
    srRef.current?.stop()
    setVoiceState('idle')
  }

  return (
    <div className="min-h-screen flex flex-col bg-parchment">
      {/* Header */}
      <div className="flex items-center gap-4 px-5 py-4 bg-white border-b border-sand sticky top-0 z-10">
        <button onClick={onBack} className="w-12 h-12 flex items-center justify-center rounded-full bg-sand text-bark text-2xl shrink-0 active:scale-95 transition-transform">←</button>
        <div className="flex-1 text-center">
          <p className="font-serif text-bark text-xl font-bold">{p.name}</p>
          <p className="text-bark/40 text-base">Your companion</p>
        </div>
        <button onClick={() => setShowSettings(true)} className="w-12 h-12 flex items-center justify-center rounded-full bg-sand text-bark text-2xl shrink-0 active:scale-95 transition-transform">⚙️</button>
      </div>

      {/* Voice/text toggle + avatar section */}
      <div className="bg-white border-b border-sand px-5 pt-5 pb-4">
        <div className="flex justify-center gap-3 mb-5">
          <button onClick={() => setUseVoice(false)}
            className={`px-5 py-2.5 rounded-full font-bold text-base transition-all ${!useVoice ? 'bg-forest text-parchment' : 'bg-sand text-bark/60'}`}
          >⌨️ Type</button>
          <button onClick={() => setUseVoice(true)}
            className={`px-5 py-2.5 rounded-full font-bold text-base transition-all ${useVoice ? 'bg-rose text-white' : 'bg-sand text-bark/60'}`}
          >🎤 Voice</button>
        </div>

        <CompanionAvatar persona={persona} voiceState={voiceState} />
        <div className="mt-3 mb-2"><VoiceLabel state={voiceState} name={p.name} /></div>

        {useVoice && (
          <div className="flex justify-center mt-3">
            <button
              onPointerDown={startListening}
              onPointerUp={stopListening}
              disabled={voiceState === 'thinking' || voiceState === 'speaking'}
              className={`w-24 h-24 rounded-full flex items-center justify-center text-5xl shadow-xl transition-all active:scale-95 ${
                voiceState === 'listening' ? 'bg-rose animate-record text-white' :
                voiceState === 'thinking' || voiceState === 'speaking' ? 'bg-sand text-bark/30' :
                'bg-rose/15 text-rose hover:bg-rose/25'
              }`}
            >🎤</button>
          </div>
        )}
        {useVoice && voiceState === 'idle' && (
          <p className="text-center text-bark/40 text-lg mt-2">Hold to speak</p>
        )}
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-auto px-5 py-5 space-y-4">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeUp`}>
            <div className={`max-w-[85%] ${msg.role === 'ai' ? 'space-y-3' : ''}`}>
              {msg.role === 'ai' && (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-white border-2 border-sand flex items-center justify-center text-2xl shrink-0 shadow-sm">{p.emoji}</div>
                  <div className="bg-white rounded-3xl rounded-tl-lg px-5 py-4 border border-sand shadow-sm">
                    <p className="text-bark text-2xl leading-relaxed">{msg.text}</p>
                    {msg.navigating && (
                      <p className="text-forest text-lg font-semibold mt-2">Opening {msg.navigating}... 🌿</p>
                    )}
                  </div>
                </div>
              )}
              {msg.role === 'user' && (
                <div className="bg-forest text-parchment rounded-3xl rounded-tr-lg px-5 py-4">
                  <p className="text-2xl leading-relaxed">{msg.text}</p>
                </div>
              )}
              {msg.chips && msg.role === 'ai' && (
                <div className="ml-13 flex flex-wrap gap-2 pl-13" style={{ paddingLeft: '52px' }}>
                  {msg.chips.map(chip => (
                    <button key={chip} onClick={() => sendMessage(chip)}
                      className="bg-amber/20 border border-amber/50 text-bark text-lg font-semibold px-4 py-2 rounded-full hover:bg-amber/30 active:scale-95 transition-all"
                    >{chip}</button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {voiceState === 'thinking' && (
          <div className="flex justify-start animate-fadeUp">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white border-2 border-sand flex items-center justify-center text-2xl shadow-sm">{p.emoji}</div>
              <div className="bg-white rounded-3xl px-5 py-4 border border-sand shadow-sm flex gap-2 items-center">
                {[0,1,2].map(i => <div key={i} className="think-dot w-3 h-3 rounded-full bg-bark/30" style={{ animationDelay: `${i * 0.2}s` }} />)}
              </div>
            </div>
          </div>
        )}
        <div ref={msgEndRef} />
      </div>

      {/* Default chips if no messages shown */}
      {messages.length <= 1 && (
        <div className="px-5 pb-3">
          <p className="text-bark/40 text-lg mb-2 font-semibold">Quick actions:</p>
          <div className="flex flex-wrap gap-2">
            {DEFAULT_CHIPS.map(chip => (
              <button key={chip} onClick={() => sendMessage(chip)}
                className="bg-white border-2 border-sand text-bark text-lg font-semibold px-4 py-2.5 rounded-full hover:border-amber active:scale-95 transition-all"
              >{chip}</button>
            ))}
          </div>
        </div>
      )}

      {/* Text input */}
      {!useVoice && (
        <div className="border-t border-sand bg-white px-4 py-3 flex gap-3">
          <input
            className="flex-1 bg-sand rounded-2xl px-5 py-4 text-bark text-2xl placeholder-bark/30 focus:outline-none focus:ring-2 focus:ring-amber/50"
            placeholder="Type something..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
            disabled={voiceState === 'thinking' || voiceState === 'speaking'}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || voiceState === 'thinking'}
            className="w-16 h-16 rounded-2xl bg-forest text-parchment text-2xl flex items-center justify-center shrink-0 disabled:opacity-30 active:scale-95 transition-all"
          >→</button>
        </div>
      )}

      {showSettings && (
        <SettingsPanel persona={persona} setPersona={setPersona} speed={speed} setSpeed={setSpeed} onClose={() => setShowSettings(false)} />
      )}
    </div>
  )
}

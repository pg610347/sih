// ─── Backend Gemini API Client ───────────────────────────────────────────────
// In adherence to security best practices, the Google Gemini API key is stored
// strictly on the server (environment variables) and NEVER exposed to client browsers.
const BACKEND_ENDPOINT = '/api/gemini'

// Optional custom key override if a doctor/admin enters their own personal key in settings
export function getGeminiApiKey(): string {
  try {
    const fromStorage = localStorage.getItem('smaran_gemini_api_key') || localStorage.getItem('gemini_api_key')
    if (fromStorage && fromStorage.trim()) return fromStorage.trim()
  } catch {}
  return ''
}

export function hasGeminiApiKey(): boolean {
  // Always true: Backend securely manages the Gemini API key
  return true
}

export function saveGeminiApiKey(key: string): void {
  try {
    localStorage.setItem('smaran_gemini_api_key', key.trim())
  } catch {}
}

export function clearGeminiApiKey(): void {
  try {
    localStorage.removeItem('smaran_gemini_api_key')
    localStorage.removeItem('gemini_api_key')
  } catch {}
}

// ─── Quick backend connectivity check ────────────────────────────────────────

export async function testGeminiApiKey(_key?: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch(BACKEND_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userMessage: 'ping' }),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      return { ok: false, error: err.error || `HTTP ${res.status}` }
    }
    return { ok: true }
  } catch (e: any) {
    return { ok: false, error: e.message || 'Network error connecting to backend Gemini endpoint' }
  }
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface GeminiMessage {
  role: 'user' | 'model'
  parts: { text: string }[]
}

export interface AIResponse {
  text: string
  navigate?: string
  chips?: string[]
}

// ─── System prompt builder ────────────────────────────────────────────────────

export function buildSystemPrompt(companionName: string, userName?: string): string {
  const userContext = userName ? ` The person you are speaking with is named ${userName}. Address them warmly by their name (${userName}) naturally in conversation.` : ''
  return `You are ${companionName}, a warm, patient, and empathetic AI companion on Smaran (स्मरण), an assistive platform for elderly people, especially those experiencing dementia or memory challenges.${userContext} You speak simply, kindly, and with great warmth — like a caring family member.

Your personality:
- Gentle, patient, and never rushing the user
- Simple language with short, clear sentences
- Genuine care and emotional warmth in every response
- Use 1-2 emojis per message to be friendly
- Understand Indian cultural context — greetings like Namaste, Pranam (प्रणाम), regional festivals (Bihu, Chhath Puja, Shigmo, Ganesh Chaturthi, Puja), food, and traditions from Assam, Meghalaya, Manipur, Nagaland, Bihar/UP (Bhojpuri), Goa/Maharashtra (Konkani), and other regions

You can help the user navigate to activities. ONLY include "navigate" when the user clearly wants to go to that specific activity:
- "diary" — to record thoughts, memories, or stories
- "music" — to listen to regional music and songs from home
- "reminiscence" — to look at familiar old household items and recall memories
- "pairs" — to play Memory Pairs (card matching game)
- "sort" — to play the sorting/categorization game (kitchen vs field items)
- "pattern" — to play the pattern recognition game
- "sequence" — to play the sequence ordering game (put steps in order)
- "orientation" — to check today's date, day, time, and season
- "home" — to go back to the main menu

RESPONSE FORMAT — You MUST respond ONLY with valid JSON:
{"text": "your friendly response here", "navigate": "target_name_if_needed", "chips": ["suggestion 1", "suggestion 2", "suggestion 3"]}

Rules:
1. "text" is required — your warm, conversational response (1-3 short sentences)
2. "navigate" is optional — only include when the user wants to go somewhere
3. "chips" — include 2-4 short quick-reply suggestions when NOT navigating; omit when navigating
4. Never mention JSON, APIs, programming, or that you are a program
5. If the user is sad, lonely, or confused — be extra gentle, reassuring, and comforting
6. Respond in the same language the user speaks (including Bhojpuri, Konkani, Hindi, Assamese, Bengali, Manipuri, Khasi, or English)`
}

// ─── API call ─────────────────────────────────────────────────────────────────

const VALID_TARGETS = new Set([
  'diary', 'music', 'reminiscence', 'pairs',
  'sort', 'pattern', 'sequence', 'orientation', 'home',
])

export async function getGeminiResponse(
  userMessage: string,
  history: GeminiMessage[],
  systemPrompt: string,
): Promise<AIResponse> {
  const res = await fetch(BACKEND_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userMessage,
      history,
      systemPrompt,
    }),
  })

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}))
    throw new Error(errorData.error || errorData.details || `Backend API error (${res.status})`)
  }

  const data = await res.json()
  let text = data.text || ''
  let navigate = data.navigate && VALID_TARGETS.has(data.navigate) ? data.navigate : undefined
  let chips = Array.isArray(data.chips)
    ? data.chips.map((c: any) => (typeof c === 'string' ? c : c?.title || c?.text || String(c))).filter(Boolean)
    : undefined

  // If text looks like JSON, attempt parsing
  if (typeof text === 'string' && (text.startsWith('{') || text.includes('"text"'))) {
    try {
      const parsed = JSON.parse(text)
      if (parsed.text) text = parsed.text
      if (parsed.navigate && VALID_TARGETS.has(parsed.navigate)) navigate = parsed.navigate
      if (Array.isArray(parsed.chips)) chips = parsed.chips
    } catch {
      const textMatch = text.match(/"text"\s*:\s*"((?:[^"\\]|\\.)*)/)
      if (textMatch) {
        text = textMatch[1].replace(/\\"/g, '"').replace(/\\n/g, ' ')
      }
    }
  }

  return {
    text: text || 'I am here with you ❤️',
    navigate,
    chips,
  }
}

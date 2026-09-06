// Resolve API key from localStorage (in-app configuration) or Vite env variables
export function getGeminiApiKey(): string {
  try {
    const fromStorage = localStorage.getItem('smaran_gemini_api_key') || localStorage.getItem('gemini_api_key')
    if (fromStorage && fromStorage.trim()) return fromStorage.trim()
  } catch {}
  return (
    import.meta.env.GEMINI_API_KEY ||
    import.meta.env.VITE_GEMINI_API_KEY ||
    ""
  ).trim()
}

export function hasGeminiApiKey(): boolean {
  return !!getGeminiApiKey()
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

// Tested active models in Google Gemini API
const CANDIDATE_MODELS = [
  "gemini-3.6-flash",
  "gemini-3.8-flash",
  "gemini-3.7-flash",
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-1.5-flash",
]

// ─── Quick key verification ───────────────────────────────────────────────────

export async function testGeminiApiKey(key: string): Promise<{ ok: boolean; error?: string }> {
  if (!key || !key.trim()) return { ok: false, error: "API key cannot be blank." }
  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key.trim()}`)
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      return { ok: false, error: err.error?.message || `HTTP ${res.status}: Invalid key` }
    }
    return { ok: true }
  } catch (e: any) {
    return { ok: false, error: e.message || "Network error connecting to Gemini API" }
  }
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface GeminiMessage {
  role: "user" | "model"
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
  "diary", "music", "reminiscence", "pairs",
  "sort", "pattern", "sequence", "orientation", "home",
])

export async function getGeminiResponse(
  userMessage: string,
  history: GeminiMessage[],
  systemPrompt: string,
): Promise<AIResponse> {
  const apiKey = getGeminiApiKey()
  if (!apiKey) {
    throw new Error("Gemini API key is missing. Please add GEMINI_API_KEY to your .env file, or tap 'Connect API Key' in the companion settings.")
  }

  const contents: GeminiMessage[] = [
    ...history,
    { role: "user", parts: [{ text: userMessage }] },
  ]

  let lastError: Error | null = null

  // Try candidate models in order if one experiences 503 high demand or temporary errors
  for (const model of CANDIDATE_MODELS) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents,
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.8,
            maxOutputTokens: 1024,
          },
        }),
      })

      if (!res.ok) {
        const errorText = await res.text().catch(() => "Unknown error")
        lastError = new Error(`Gemini (${model}) ${res.status}: ${errorText}`)
        // If high demand (503) or rate limit (429), immediately try next model
        if (res.status === 503 || res.status === 429 || res.status === 404) {
          console.warn(`Model ${model} returned ${res.status}, trying fallback model...`)
          continue
        }
        throw lastError
      }

      const data = await res.json()
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text

      if (!rawText) {
        continue
      }

      let parsed: any
      try {
        parsed = JSON.parse(rawText)
      } catch {
        const textMatch = rawText.match(/"text"\s*:\s*"((?:[^"\\]|\\.)*)/)
        const extracted = textMatch ? textMatch[1].replace(/\\"/g, '"').replace(/\\n/g, ' ') : rawText.replace(/[{}"\[\]]/g, '').trim()
        return {
          text: extracted || "I am here with you ❤️",
          chips: ["Play a game 🎮", "Listen to music 🎵", "Open my diary 📔"],
        }
      }

      const chips = Array.isArray(parsed.chips)
        ? parsed.chips.map((c: any) => (typeof c === 'string' ? c : c?.title || c?.text || String(c))).filter(Boolean)
        : undefined

      return {
        text: parsed.text || "I am here with you ❤️",
        navigate: parsed.navigate && VALID_TARGETS.has(parsed.navigate) ? parsed.navigate : undefined,
        chips,
      }
    } catch (err: any) {
      lastError = err
      console.warn(`Attempt with ${model} failed:`, err.message)
    }
  }

  throw lastError || new Error("All Gemini models were unavailable. Please try again.")
}

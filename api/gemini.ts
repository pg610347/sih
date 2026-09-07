import type { VercelRequest, VercelResponse } from '@vercel/node'

// Candidate models in preference order
const CANDIDATE_MODELS = [
  'gemini-3.6-flash',
  'gemini-3.7-flash',
  'gemini-3.8-flash',
  'gemini-3.5-flash',
]

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' })
  }

  const { userMessage, history = [], systemPrompt } = req.body || {}

  if (!userMessage || typeof userMessage !== 'string') {
    return res.status(400).json({ error: 'userMessage is required.' })
  }

  // Purely private: Read strictly from server environment variables (never committed to repository)
  const apiKey = (process.env.GEMINI_API_KEY || '').trim()

  if (!apiKey) {
    return res.status(500).json({
      error: 'GEMINI_API_KEY is not configured in server environment variables. Please set GEMINI_API_KEY in your Vercel Project Settings.',
    })
  }

  const contents = [
    ...history,
    { role: 'user', parts: [{ text: userMessage }] },
  ]

  let lastError = 'Unknown error'

  for (const model of CANDIDATE_MODELS) {
    const url = "https://generativelanguage.googleapis.com/v1beta/models/" + model + ":generateContent?key=" + apiKey
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: systemPrompt ? { parts: [{ text: systemPrompt }] } : undefined,
          contents,
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.8,
            maxOutputTokens: 1024,
          },
        }),
      })

      if (response.ok) {
        const data: any = await response.json()
        const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || ''

        let parsed: any = null
        try {
          parsed = JSON.parse(rawText)
        } catch {
          // Fallback if response was plain text
          parsed = { text: rawText.replace(/^[\{\[].*[\}\]]$/s, '').trim() || rawText }
        }

        return res.status(200).json({
          success: true,
          text: parsed.text || rawText,
          navigate: parsed.navigate || undefined,
          chips: Array.isArray(parsed.chips) ? parsed.chips : undefined,
        })
      } else {
        const errText = await response.text().catch(() => '')
        lastError = model + " failed with status " + response.status + ": " + errText.slice(0, 100)
        // Try next candidate model
        continue
      }
    } catch (err: any) {
      lastError = err.message || 'Network error calling Gemini'
    }
  }

  return res.status(502).json({
    error: 'Failed to obtain response from Gemini models',
    details: lastError,
  })
}

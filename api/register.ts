import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getDb, isDbConfigured } from './db.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' })
  }

  const { name, userId, password, role, language = 'english', region = 'Assam', age } = req.body || {}

  if (!name || !userId || !password || !role) {
    return res.status(400).json({ error: 'Name, User ID, password, and role are required.' })
  }

  const cleanUserId = String(userId).trim()
  const cleanName = String(name).trim()

  const forwarded = req.headers['x-forwarded-for']
  const ip = typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : req.socket.remoteAddress || 'unknown'
  const userAgent = (req.headers['user-agent'] as string) || 'unknown'

  if (isDbConfigured()) {
    const sql = getDb()
    if (!sql) {
      return res.status(500).json({ error: 'Failed to connect to database' })
    }

    try {
      // Ensure tables and columns exist
      await sql`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          user_id VARCHAR(50) UNIQUE NOT NULL,
          name VARCHAR(100) NOT NULL,
          role VARCHAR(50) NOT NULL,
          password VARCHAR(100) NOT NULL,
          language VARCHAR(50) DEFAULT 'english',
          region VARCHAR(100) DEFAULT 'Assam',
          age INT,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS language VARCHAR(50) DEFAULT 'english';`
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS region VARCHAR(100) DEFAULT 'Assam';`
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS age INT;`

      await sql`
        CREATE TABLE IF NOT EXISTS login_logs (
          id SERIAL PRIMARY KEY,
          user_id VARCHAR(50) NOT NULL,
          name VARCHAR(100),
          role VARCHAR(50) NOT NULL,
          status VARCHAR(20) NOT NULL,
          ip_address VARCHAR(100),
          user_agent TEXT,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `

      // Check if user_id already exists
      const existing = await sql`
        SELECT user_id FROM users WHERE LOWER(user_id) = LOWER(${cleanUserId}) LIMIT 1;
      `
      if (existing.length > 0) {
        return res.status(409).json({
          error: `User ID '${cleanUserId}' is already taken. Please choose a different ID.`,
        })
      }

      // Insert new user
      const ageNum = age ? parseInt(String(age), 10) : null
      await sql`
        INSERT INTO users (user_id, name, role, password, language, region, age)
        VALUES (${cleanUserId}, ${cleanName}, ${role}, ${password}, ${language}, ${region}, ${ageNum});
      `

      // Record successful registration in login_logs
      await sql`
        INSERT INTO login_logs (user_id, name, role, status, ip_address, user_agent)
        VALUES (${cleanUserId}, ${cleanName}, ${role}, 'SUCCESS', ${ip}, ${userAgent});
      `

      return res.status(201).json({
        success: true,
        user: {
          userId: cleanUserId,
          name: cleanName,
          role,
          language,
          region,
        },
        message: 'Account created and saved in PostgreSQL successfully.',
      })
    } catch (error: any) {
      console.error('Registration database error:', error)
      return res.status(500).json({
        error: 'Failed to create account in database',
        details: error.message,
      })
    }
  }

  // Fallback mode if Postgres is not configured yet (local development)
  return res.status(201).json({
    success: true,
    user: {
      userId: cleanUserId,
      name: cleanName,
      role,
      language,
      region,
    },
    warning: 'Account created locally (PostgreSQL not connected). Connect Postgres in Vercel Storage to persist permanently.',
  })
}

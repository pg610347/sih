import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getDb, isDbConfigured } from './db.js'

const DEMO_FALLBACK: Record<string, { password: string; name: string; role: string }> = {
  P001: { password: 'care123', name: 'Priya', role: 'patient' },
  C001: { password: 'care123', name: 'Anjali', role: 'caregiver' },
  D001: { password: 'care123', name: 'Dr. Sharma', role: 'doctor' },
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only accept POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' })
  }

  const { userId, password, role } = req.body || {}

  if (!userId || !password) {
    return res.status(400).json({ error: 'User ID and password are required.' })
  }

  // Extract client IP and user agent for auditing
  const forwarded = req.headers['x-forwarded-for']
  const ip = typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : req.socket.remoteAddress || 'unknown'
  const userAgent = (req.headers['user-agent'] as string) || 'unknown'

  // If Postgres is configured, use it
  if (isDbConfigured()) {
    const sql = getDb()
    if (!sql) {
      return res.status(500).json({ error: 'Failed to connect to database' })
    }

    try {
      // Ensure tables exist before querying
      await sql`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          user_id VARCHAR(50) UNIQUE NOT NULL,
          name VARCHAR(100) NOT NULL,
          role VARCHAR(50) NOT NULL,
          password VARCHAR(100) NOT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
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

      // Check if user exists in database
      const users = await sql`
        SELECT user_id, name, role, password
        FROM users
        WHERE user_id = ${userId}
        LIMIT 1;
      `

      let user = users[0]

      // If database is empty or user is one of demo users but not yet seeded, auto-seed
      if (!user && DEMO_FALLBACK[userId]) {
        const demo = DEMO_FALLBACK[userId]
        await sql`
          INSERT INTO users (user_id, name, role, password)
          VALUES (${userId}, ${demo.name}, ${demo.role}, ${demo.password})
          ON CONFLICT (user_id) DO NOTHING;
        `
        user = { user_id: userId, name: demo.name, role: demo.role, password: demo.password }
      }

      // Check credentials
      const isValid = user && user.password === password

      // Record to login_logs in Postgres
      await sql`
        INSERT INTO login_logs (user_id, name, role, status, ip_address, user_agent)
        VALUES (
          ${userId},
          ${user ? user.name : null},
          ${role || (user ? user.role : 'unknown')},
          ${isValid ? 'SUCCESS' : 'FAILED'},
          ${ip},
          ${userAgent}
        );
      `

      if (!isValid) {
        return res.status(401).json({
          success: false,
          error: 'Invalid User ID or password.',
        })
      }

      return res.status(200).json({
        success: true,
        name: user.name,
        role: user.role,
        message: 'Login successful and recorded in PostgreSQL.',
      })
    } catch (error: any) {
      console.error('Postgres login error:', error)
      return res.status(500).json({
        error: 'Database query failed',
        details: error.message,
      })
    }
  }

  // Fallback mode if Postgres is not yet connected
  const demoUser = DEMO_FALLBACK[userId]
  if (demoUser && demoUser.password === password) {
    return res.status(200).json({
      success: true,
      name: demoUser.name,
      role: demoUser.role,
      warning: 'PostgreSQL database not yet configured. Please connect Postgres in Vercel Storage.',
    })
  }

  return res.status(401).json({
    success: false,
    error: 'Invalid User ID or password.',
  })
}

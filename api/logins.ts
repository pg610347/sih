import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getDb, isDbConfigured } from './db.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed. Use GET.' })
  }

  if (!isDbConfigured()) {
    return res.status(200).json({
      configured: false,
      message: 'Postgres not yet connected. Add POSTGRES_URL to your Vercel Environment Variables.',
      logs: [],
    })
  }

  const sql = getDb()
  if (!sql) {
    return res.status(500).json({ error: 'Database connection failed' })
  }

  try {
    // Fetch last 100 login records
    const logs = await sql`
      SELECT 
        id,
        user_id,
        name,
        role,
        status,
        ip_address,
        user_agent,
        created_at
      FROM login_logs
      ORDER BY created_at DESC
      LIMIT 100;
    `

    // Fetch summary stats
    const stats = await sql`
      SELECT 
        COUNT(*) as total_attempts,
        COUNT(CASE WHEN status = 'SUCCESS' THEN 1 END) as successful_logins,
        COUNT(CASE WHEN status = 'FAILED' THEN 1 END) as failed_logins,
        COUNT(DISTINCT user_id) as unique_users
      FROM login_logs;
    `

    return res.status(200).json({
      configured: true,
      stats: stats[0] || {},
      logs,
    })
  } catch (error: any) {
    console.error('Error fetching login logs:', error)
    return res.status(500).json({
      error: 'Failed to retrieve login logs',
      details: error.message,
    })
  }
}

import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getDb, isDbConfigured } from './db.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!isDbConfigured()) {
    return res.status(500).json({
      error: 'Database not configured. Please set POSTGRES_URL or DATABASE_URL in Vercel environment variables.',
    })
  }

  const sql = getDb()
  if (!sql) {
    return res.status(500).json({ error: 'Failed to initialize database connection.' })
  }

  try {
    // 1. Create users table
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

    // 2. Create login_logs table
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

    // 3. Seed default users if not already present
    await sql`
      INSERT INTO users (user_id, name, role, password)
      VALUES 
        ('P001', 'Priya', 'patient', 'care123'),
        ('C001', 'Anjali', 'caregiver', 'care123'),
        ('D001', 'Dr. Sharma', 'doctor', 'care123')
      ON CONFLICT (user_id) DO NOTHING;
    `

    return res.status(200).json({
      success: true,
      message: 'Database initialized successfully. Tables `users` and `login_logs` ready.',
    })
  } catch (error: any) {
    console.error('Database initialization error:', error)
    return res.status(500).json({
      error: 'Failed to initialize database',
      details: error.message,
    })
  }
}

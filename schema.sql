-- ============================================================
-- NerCare PostgreSQL Schema for Login & User Tracking on Vercel
-- ============================================================

-- 1. Users Table
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

-- Ensure columns exist if table was created previously
ALTER TABLE users ADD COLUMN IF NOT EXISTS language VARCHAR(50) DEFAULT 'english';
ALTER TABLE users ADD COLUMN IF NOT EXISTS region VARCHAR(100) DEFAULT 'Assam';
ALTER TABLE users ADD COLUMN IF NOT EXISTS age INT;

-- 2. Login Logs Table
CREATE TABLE IF NOT EXISTS login_logs (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL,
  name VARCHAR(100),
  role VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL, -- 'SUCCESS' or 'FAILED'
  ip_address VARCHAR(100),
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Default Demo Users Seed
INSERT INTO users (user_id, name, role, password, language, region)
VALUES 
  ('P001', 'Priya', 'patient', 'care123', 'assamese', 'Assam'),
  ('C001', 'Anjali', 'caregiver', 'care123', 'english', 'Assam'),
  ('D001', 'Dr. Sharma', 'doctor', 'care123', 'english', 'Assam')
ON CONFLICT (user_id) DO NOTHING;

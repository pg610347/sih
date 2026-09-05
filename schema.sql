-- ============================================================
-- NerCare PostgreSQL Schema for Login Tracking on Vercel
-- ============================================================

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  role VARCHAR(50) NOT NULL,
  password VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

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
INSERT INTO users (user_id, name, role, password)
VALUES 
  ('P001', 'Priya', 'patient', 'care123'),
  ('C001', 'Anjali', 'caregiver', 'care123'),
  ('D001', 'Dr. Sharma', 'doctor', 'care123')
ON CONFLICT (user_id) DO NOTHING;

-- 4. Helpful Query to Inspect Who Logged In
-- SELECT user_id, name, role, status, ip_address, created_at 
-- FROM login_logs 
-- ORDER BY created_at DESC;

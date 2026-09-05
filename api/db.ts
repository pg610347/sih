import { neon } from '@neondatabase/serverless'

const connectionString =
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  ''

export function getDb() {
  if (!connectionString) {
    return null
  }
  return neon(connectionString)
}

export function isDbConfigured(): boolean {
  return Boolean(connectionString)
}

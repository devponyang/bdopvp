import { Pool } from 'pg'
// A Pool is lazy: no connection is made until a query is requested.
export const db = new Pool({
  connectionString: process.env.DATABASE_URL || undefined,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 5, idleTimeoutMillis: 10000, connectionTimeoutMillis: 3000,
  statement_timeout: 5000, query_timeout: 6000,
})
db.on('error', error => console.error('Database pool error:', error.name))

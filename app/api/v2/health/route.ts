import { NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
export function GET() {
  // Liveness only. Never probe the database on a public health endpoint.
  return NextResponse.json(
    { status: 'ok', mode: process.env.DB_ENABLED === 'true' ? 'database-enabled' : 'offline' },
    { headers: { 'Cache-Control': 'no-store' } },
  )
}

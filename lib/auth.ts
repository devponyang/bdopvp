import { NextRequest } from 'next/server'

export function verifyAdminAuth(request: NextRequest): boolean {
  const cookie = request.cookies.get('isAdmin')
  return cookie?.value === 'true'
}

export function requireAdminAuth(request: NextRequest): Response | null {
  if (!verifyAdminAuth(request)) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }), 
      { 
        status: 401, 
        headers: { 'Content-Type': 'application/json' } 
      }
    )
  }
  return null
}


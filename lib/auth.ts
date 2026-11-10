import { NextRequest } from 'next/server'
import { SESSION_COOKIE, verifySession } from '@/lib/portal/session'
export function verifyAdminAuth(request:NextRequest):boolean{return verifySession(request.cookies.get(SESSION_COOKIE)?.value)}
export function requireAdminAuth(request:NextRequest):Response|null{return verifyAdminAuth(request)?null:Response.json({error:'Unauthorized'},{status:401})}

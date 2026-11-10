import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { SESSION_COOKIE, verifySession } from '@/lib/portal/session'
import { readPortal } from '@/lib/portal/data'
import AdminEditor from './AdminEditor'
export default async function AdminPage() {
  if (!verifySession((await cookies()).get(SESSION_COOKIE)?.value)) redirect('/admin/login')
  return <AdminEditor initial={await readPortal()} />
}

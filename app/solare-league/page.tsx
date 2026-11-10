import RankingBoard from '@/components/portal/RankingBoard'
import { getPortal } from '@/lib/portal/data'
export const dynamic = 'force-dynamic'
export const metadata = { title: '솔라레의 창' }
export default async function Page(){ return <RankingBoard state={await getPortal()} mode="solare"/> }

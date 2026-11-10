import WarBoard from '@/components/portal/WarBoard'
import { getPortal } from '@/lib/portal/data'
export const metadata={title:'거점 · 점령전'}
export const dynamic='force-dynamic'
export default async function Page(){return <WarBoard state={await getPortal()} history={true}/>}

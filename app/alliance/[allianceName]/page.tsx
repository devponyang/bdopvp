import {decodeRouteSegment} from '@/lib/portal/text'
import Profile from '@/components/portal/Profile'
export const dynamic='force-dynamic'
export default async function Page({params}:{params:Promise<{allianceName:string}>}){return <Profile name={decodeRouteSegment((await params).allianceName)} kind="연맹"/>}

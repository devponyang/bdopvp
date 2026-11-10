import {decodeRouteSegment} from '@/lib/portal/text'
import Profile from '@/components/portal/Profile'
export const dynamic='force-dynamic'
export default async function Page({params}:{params:Promise<{name:string}>}){return <Profile name={decodeRouteSegment((await params).name)} kind="모험가"/>}

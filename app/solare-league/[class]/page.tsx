import {decodeRouteSegment} from '@/lib/portal/text'
import RankingBoard from '@/components/portal/RankingBoard'
import { getPortal } from '@/lib/portal/data'
import classList from '@/lib/constants/class-list'
import { notFound } from 'next/navigation'
export const dynamic = 'force-dynamic'
export default async function Page({params}:{params:Promise<{class:string}>}){const name=decodeRouteSegment((await params).class);if(!classList.includes(name))notFound();return <RankingBoard state={await getPortal()} mode="solare" initialClass={name}/>}

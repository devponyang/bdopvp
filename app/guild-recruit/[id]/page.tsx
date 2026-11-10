import {decodeRouteSegment} from '@/lib/portal/text'
import { getPortal } from '@/lib/portal/data'
import { notFound } from 'next/navigation'
import { PageHeading, DataNotice, EmptyState } from '@/components/portal/UI'
export const dynamic='force-dynamic'
export default async function Page({params}:{params:Promise<{id:string}>}){const {id}=await params;const state=await getPortal();const post=state.data.recruits.find(p=>p.id===decodeRouteSegment(id));if(!post){if(state.status==='live')notFound();return <><PageHeading label="GUILD RECRUITMENT" title="모집글 확인" description="이전 모집글은 데이터 유실로 확인할 수 없습니다."/><DataNotice state={state}/><EmptyState/></>}return <><PageHeading label={post.name} title={post.title} description="길드 모집"/><article className="panel prose-panel">{post.tags.map(t=><span className="tag" key={t}>{t}</span>)}<p className="whitespace-pre-wrap">{post.description}</p><a className="button" href={post.contact} target="_blank" rel="noreferrer">가입 문의 ↗</a></article></>}

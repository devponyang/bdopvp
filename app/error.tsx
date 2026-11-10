'use client'
import Link from 'next/link'
export default function ErrorPage({reset}:{error:Error;reset:()=>void}){return <div className="empty-state"><span className="eyebrow">잠시 연결이 끊겼어요</span><h1 className="text-2xl font-bold my-4">페이지를 불러오지 못했습니다</h1><p>잠시 후 다시 시도해 주세요.</p><button className="button section-gap" onClick={reset}>다시 시도</button><Link href="/">대시보드로 이동</Link></div>}

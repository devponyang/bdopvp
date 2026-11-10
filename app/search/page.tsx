import SearchPage from '@/components/portal/SearchPage'
export const dynamic='force-dynamic'
export const metadata={title:'통합 검색'}
export default async function Page({searchParams}:{searchParams:Promise<{q?:string|string[]}>}){const {q}=await searchParams;return <SearchPage query={(Array.isArray(q)?q[0]:q)||''}/>}

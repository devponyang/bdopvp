// ✅ 경로: app/page.tsx

import MainBanner from '@/components/home/MainBanner'
import UpdateCard from '@/components/home/UpdateCard'
import CouponCard from '@/components/home/CouponCard'
import PvPScheduleCard from '@/components/home/PvPScheduleCard'
import NodeWarScheduleCard from '@/components/home/NodeWarScheduleCard'
import GuildLeagueTop10Server from '@/components/home/GuildLeagueTop10Server'
import SolareTop10 from '@/components/home/SolareTop10'
import ChzzkCard from '@/components/home/ChzzkCard'
import SidebarBanner from '@/components/banners/SidebarBanner'
import CardBanner from '@/components/banners/CardBanner'
import HomeWithNotice from './components/HomeWithNotice'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const revalidate = 60 // 1분 캐시

// 서버에서 데이터 미리 가져오기
async function getInitialData() {
  try {
    // 병렬로 데이터 가져오기
    const [updatesData, couponsData] = await Promise.all([
      db.query(`
        SELECT title, link, date
        FROM updates
        ORDER BY date DESC
        LIMIT 5
      `),
      db.query(`
        SELECT 
          code,
          title,
          description,
          start_date,
          end_date,
          created_at,
          CASE 
            WHEN end_date < CURRENT_DATE THEN 'expired'
            ELSE 'active'
          END as status
        FROM coupons
        ORDER BY 
          CASE 
            WHEN end_date < CURRENT_DATE THEN 1
            ELSE 0
          END,
          created_at DESC
      `)
    ])

    return {
      updates: updatesData.rows,
      coupons: couponsData.rows
    }
  } catch (error) {
    console.error('초기 데이터 로딩 실패:', error)
    return {
      updates: [],
      coupons: []
    }
  }
}

export default async function Home() {
  const initialData = await getInitialData()
  return (
    <HomeWithNotice>
      <main className="bg-zinc-900 text-white">
        {/* 메인 배너 */}
        <div className="pt-4 sm:pt-6 md:pt-10">
          <div className="max-w-full md:max-w-[1490px] mx-auto px-2 sm:px-4 md:px-5">
            <MainBanner />
          </div>
        </div>

        {/* 기존 컨텐츠 */}
        <div className="pb-6 md:pb-10">
          <div className="max-w-full md:max-w-[1490px] mx-auto px-3 sm:px-4 md:px-5 grid gap-3 sm:gap-4 md:gap-5
                        grid-cols-1
                        lg:grid-cols-[300px_1fr_440px]">
            
            {/* 모바일/태블릿: 좌측 사이드바 */}
            <aside className="space-y-3 sm:space-y-4 md:space-y-6 lg:col-span-1 order-1 lg:order-1">
              {/* 디스코드 배너 */}
              <a href="https://discord.com/invite/mD37c4GEby" target="_blank" rel="noopener noreferrer" className="block bg-gradient-to-br from-zinc-900/80 to-slate-900/80 backdrop-blur-sm text-white font-bold text-base sm:text-lg md:text-xl rounded-2xl border border-white/10 shadow-xl py-2 sm:py-3 md:py-4 px-2 text-center hover:bg-white/5 transition-all">
                💬 포냥이 디스코드
              </a>
              
              {/* 사이드바 광고 배너 */}
              <SidebarBanner position="home" />
              
              <UpdateCard data={initialData.updates} />
              
              {/* 카드형 광고 배너 */}
              <CardBanner position="home" />
              
              <CouponCard data={initialData.coupons} />
              {/* 치지직 스트리머 카드 */}
              <div className="hidden md:block">
                <ChzzkCard />
              </div>
            </aside>

            {/* 중앙: 거점전 + PvP */}
            <section className="space-y-3 sm:space-y-4 md:space-y-6 lg:col-span-1 flex flex-col items-center order-2 lg:order-2">
              <div className="w-full max-w-full sm:max-w-[710px] mx-auto">
                <NodeWarScheduleCard />
              </div>
              <div className="w-full max-w-full sm:max-w-[710px] mx-auto">
                <PvPScheduleCard />
              </div>
            </section>

            {/* 우측: 길드 리그 / 솔라레 */}
            <aside className="space-y-3 sm:space-y-4 md:space-y-6 lg:col-span-1 order-3 lg:order-3">
              <GuildLeagueTop10Server />
              
              {/* 우측 사이드바 광고 배너 */}
              <SidebarBanner position="home-right" />
              
              <SolareTop10 />
              
              {/* 우측 카드형 광고 배너 */}
              <CardBanner position="home-right" />
            </aside>
          </div>

        </div>
      </main>
    </HomeWithNotice>
  )
}

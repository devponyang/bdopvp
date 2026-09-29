import MainBanner from '@/components/home/MainBanner';
import UpdateCard from '@/components/home/UpdateCard';
import CouponCard from '@/components/home/CouponCard';
import PvPScheduleCard from '@/components/home/PvPScheduleCard';
import NodeWarScheduleCard from '@/components/home/NodeWarScheduleCard';
import GuildLeagueTop10Server from '@/components/home/GuildLeagueTop10Server';
import SolareTop10 from '@/components/home/SolareTop10';
import PonyangNotice from '@/components/home/PonyangNotice';
import ChzzkCard from '@/components/home/ChzzkCard';
import SidebarBanner from '@/components/banners/SidebarBanner';
import CardBanner from '@/components/banners/CardBanner';
import HomeWithNotice from './components/HomeWithNotice';
import { getHomeInitialData } from '@/lib/queries/home';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const initialData = await getHomeInitialData();

  return (
    <HomeWithNotice>
      <div className="bg-[oklch(0.08_0.01_270)] text-white">
        <div className="pt-2 sm:pt-4 md:pt-8">
          <div className="max-w-full md:max-w-[1490px] mx-auto px-2 sm:px-4 md:px-5">
            <MainBanner />
          </div>
        </div>

        <div className="pb-6 md:pb-10">
          <div
            className="max-w-full md:max-w-[1490px] mx-auto px-3 sm:px-4 md:px-5 grid gap-3 sm:gap-4 md:gap-5
                       grid-cols-1
                       lg:grid-cols-[300px_1fr_440px]"
            style={{ maxWidth: 'min(1490px, 100vw - 2rem)' }}
          >
            <aside className="space-y-3 sm:space-y-4 md:space-y-6 lg:col-span-1 order-1 lg:order-1">
              <a
                href="https://discord.com/invite/mD37c4GEby"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-zinc-900/60 text-white font-bold text-base sm:text-lg md:text-xl rounded-2xl border border-[oklch(0.85_0.18_200/0.35)] shadow-[0_0_20px_oklch(0.85_0.18_200/0.1)] py-2 sm:py-3 md:py-4 px-2 text-center hover:border-[oklch(0.85_0.18_200/0.65)] hover:shadow-[0_0_30px_oklch(0.85_0.18_200/0.25)] transition-all duration-200"
              >
                💬 포냥이 디스코드
              </a>
              <SidebarBanner position="home" />
              <UpdateCard data={initialData.updates} />
              <CardBanner position="home" />
              <PonyangNotice notices={initialData.notices} />
              <CouponCard data={initialData.coupons} />
              <ChzzkCard />
            </aside>

            <section className="space-y-3 sm:space-y-4 md:space-y-6 lg:col-span-1 flex flex-col items-center order-2 lg:order-2">
              <div className="w-full max-w-full sm:max-w-[710px] mx-auto">
                <NodeWarScheduleCard />
              </div>
              <div className="w-full max-w-full sm:max-w-[710px] mx-auto">
                <PvPScheduleCard />
              </div>
            </section>

            <aside className="space-y-3 sm:space-y-4 md:space-y-6 lg:col-span-1 order-3 lg:order-3">
              <GuildLeagueTop10Server />
              <SidebarBanner position="home-right" />
              <SolareTop10 />
              <CardBanner position="home-right" />
            </aside>
          </div>
        </div>
      </div>
    </HomeWithNotice>
  );
}

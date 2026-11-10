import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Search,
  Shield,
  Swords,
  Trophy,
  Users,
} from 'lucide-react'
import { getPortal } from '@/lib/portal/data'
import { guides } from '@/lib/portal/guides'
import GuideCard from './GuideCard'
import { DataNotice, SectionHeading } from './UI'

export default async function Home() {
  const state = await getPortal()
  const ranked = [...state.data.solare].sort((a, b) => b.score - a.score).slice(0, 5)
  const wars = [...state.data.wars].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3)
  return (
    <>
      <section className="hero" aria-labelledby="home-title">
        <div className="hero-content">
          <span className="eyebrow">BLACK DESERT / PVP HUB</span>
          <h1 id="home-title">
            전적부터 공략까지,
            <br />
            검은사막 PvP의 모든 것<span>포냥이와 함께.</span>
          </h1>
          <p>
            모험가의 기록, 클래스의 노하우.
            <br className="mobile-break" /> 전장에 필요한 정보를 한곳에서.
          </p>
          <form action="/search" className="hero-search" role="search" aria-label="통합 검색">
            <Search size={22} aria-hidden="true" />
            <input
              name="q"
              aria-label="길드, 모험가, 클래스 검색"
              placeholder="가문명, 길드명 또는 클래스"
              required
              maxLength={100}
            />
            <button type="submit" aria-label="검색">
              <ArrowRight size={22} />
            </button>
          </form>
          <div className="search-suggestions">
            <span>클래스 바로 찾기</span>
            {['매구', '우사', '워리어'].map((q) => (
              <Link key={q} href={`/search?q=${encodeURIComponent(q)}`}>
                {q} <ArrowUpRight size={12} />
              </Link>
            ))}
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <Image
            src="/ponyang/war-bg.png"
            alt=""
            fill
            sizes="(max-width: 760px) 100vw, 45vw"
            priority
          />
          <span className="art-cross">+</span>
          <div className="art-caption">
            <span>ARENA · GUILD · WAR</span>
            <strong>
              PLAY YOUR
              <br />
              NEXT CHAPTER.
            </strong>
            <span>검은사막, 함께 만드는 전장의 기록</span>
          </div>
        </div>
      </section>
      <div className="quick-grid">
        {[
          {
            href: '/solare-league',
            title: '솔라레 랭킹',
            sub: '모험가 순위와 클래스',
            icon: Swords,
          },
          { href: '/guild-league', title: '길드 리그', sub: '길드별 경쟁 기록', icon: Shield },
          { href: '/war-records', title: '거점 · 점령전', sub: '전장의 승리와 기록', icon: Trophy },
          {
            href: '/guild-recruit',
            title: '함께할 길드 찾기',
            sub: '나와 맞는 동료 찾기',
            icon: Users,
          },
        ].map(({ href, title, sub, icon: Icon }, i) => (
          <Link className="quick-card" key={href} href={href}>
            <span className="quick-number">0{i + 1}</span>
            <Icon size={23} strokeWidth={1.6} />
            <div>
              <strong>{title}</strong>
              <small>{sub}</small>
            </div>
            <ArrowUpRight size={17} />
          </Link>
        ))}
      </div>
      <DataNotice state={state} />
      <div className="home-content-grid">
        <section className="class-feature">
          <SectionHeading title="클래스 공략" label="CLASS PLAYBOOK" href="/tip-board" />
          <p className="section-description">
            내 클래스의 다음 한 수. 스킬부터 콤보까지 살펴보세요.
          </p>
          <div className="guide-grid compact">
            {['16', '19', '21', '14'].map((id) => (
              <GuideCard key={id} guide={guides.find((g) => g.id === id)!} />
            ))}
          </div>
          <div className="archive-caption">
            <BookOpen size={15} />
            <span>보관된 공략 {guides.length}개 · 현재 패치와 다를 수 있습니다.</span>
            <Link href="/tip-board">
              전체 클래스 <ArrowRight size={14} />
            </Link>
          </div>
        </section>
        <aside className="community-feature" aria-label="커뮤니티">
          <span className="eyebrow">BETTER TOGETHER</span>
          <h2>
            혼자보다,
            <br />
            함께할 때 더 강하게.
          </h2>
          <p>
            길드를 찾고, 대회를 확인하고,
            <br />
            전장 밖의 이야기도 나눠보세요.
          </p>
          <Link href="/guild-recruit">
            길드 모집 <ArrowUpRight size={17} />
          </Link>
          <Link href="/Tournament">
            대회 일정 <ArrowUpRight size={17} />
          </Link>
          <a href="https://discord.gg/mD37c4GEby" target="_blank" rel="noreferrer">
            디스코드 커뮤니티 <ArrowUpRight size={17} />
          </a>
        </aside>
      </div>
      <div className="home-columns section-gap">
        <section>
          <SectionHeading title="솔라레 리더보드" label="LEADERBOARD" href="/solare-league" />
          <div className="panel">
            {ranked.length ? (
              <div className="table-scroll">
                <table className="data-table">
                  <caption className="sr-only">솔라레 상위 5명</caption>
                  <thead>
                    <tr>
                      <th scope="col">순위</th>
                      <th scope="col">모험가</th>
                      <th scope="col">클래스</th>
                      <th scope="col">점수</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ranked.map((entry, i) => (
                      <tr key={entry.name}>
                        <td className="rank">{String(i + 1).padStart(2, '0')}</td>
                        <td>
                          <Link href={`/family/${encodeURIComponent(entry.name)}`}>
                            {entry.name}
                          </Link>
                        </td>
                        <td>{entry.class}</td>
                        <td className="score">{entry.score.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="record-placeholder">
                <Swords size={28} />
                <div>
                  <h3>랭킹 기록을 준비하고 있습니다</h3>
                  <p>데이터 재구축 후 실제 순위가 표시됩니다.</p>
                </div>
                <Link href="/solare-league" aria-label="솔라레 랭킹 보기">
                  <ArrowRight size={20} />
                </Link>
              </div>
            )}
          </div>
        </section>
        <section>
          <SectionHeading title="최근 전투" label="BATTLE LOG" href="/war-records" />
          <div className="panel">
            {wars.length ? (
              wars.map((war) => (
                <Link className="notice-row" key={war.id} href="/war-records/history">
                  <span className="tag">{war.type}</span>
                  <h3>
                    {war.region} · {war.winner}
                  </h3>
                  <time>{war.date}</time>
                </Link>
              ))
            ) : (
              <div className="record-placeholder">
                <Shield size={28} />
                <div>
                  <h3>전투 기록 재구축 중</h3>
                  <p>확인된 전투부터 순차적으로 제공됩니다.</p>
                </div>
                <Link href="/war-records" aria-label="전투 기록 보기">
                  <ArrowRight size={20} />
                </Link>
              </div>
            )}
          </div>
        </section>
      </div>
      {state.data.notices.length > 0 && (
        <section className="section-gap">
          <SectionHeading title="커뮤니티 소식" />
          <div className="panel">
            {state.data.notices.map((n) => (
              <article className="notice-row" key={n.id}>
                <time>{n.date}</time>
                <h3>{n.title}</h3>
                <p>{n.content}</p>
              </article>
            ))}
          </div>
        </section>
      )}
    </>
  )
}

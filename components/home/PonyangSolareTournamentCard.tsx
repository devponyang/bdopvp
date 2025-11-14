import Link from "next/link"

const infoItems = [
  {
    label: "대회 일정",
    value: "2025년 12월 20일",
    icon: "📅",
    accent: "from-blue-500/20 to-blue-500/0 border-blue-400/40"
  },
  {
    label: "참가 조건",
    value: "3인 1팀 · 32팀 (점수 컷 적용)",
    icon: "👥",
    accent: "from-purple-500/20 to-purple-500/0 border-purple-400/40"
  },
  {
    label: "신청 기간",
    value: "11월 26일(수요일) ~ 12월 14일(일요일)",
    icon: "📝",
    accent: "from-rose-500/20 to-rose-500/0 border-rose-400/40"
  }
]

export default function PonyangSolareTournamentCard() {
  return (
    <div className="relative w-full max-w-[400px] overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-900/90 via-slate-900/85 to-zinc-950/90 shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
      <div className="absolute inset-0 opacity-[0.12] mix-blend-screen bg-[radial-gradient(circle_at_top,_#60a5fa55,_transparent_55%),radial-gradient(circle_at_bottom,_#a855f755,_transparent_55%)]" />
      <div className="relative p-5 sm:p-6 space-y-5">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-sky-200">
          <span className="text-lg">🏆</span>
          솔라레 최강을 가리는 커뮤니티 친선 대회
        </div>

        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold text-white">
             Solare Tournament 2025
          </h2>
          <p className="text-xs text-gray-400 leading-relaxed">
            BDOPVP-포냥이가 주최하는 2025 솔라레 토너먼트!
          </p>
          <p className="text-xs text-gray-400 leading-relaxed">
            최고의 랭커들과 실력파 모험가들이 한 자리에 모입니다.
          </p>
        </div>

        <div className="space-y-2">
          {infoItems.map((item) => (
            <div
              key={item.label}
              className={`flex items-center gap-3 rounded-2xl border bg-gradient-to-r ${item.accent} px-3 py-2.5`}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black/40 text-lg">
                {item.icon}
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                  {item.label}
                </span>
                <span className="text-sm font-semibold text-gray-200">{item.value}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-2">
          <Link
            href="/solare-tournament"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-400/40 bg-blue-500/10 px-4 py-2.5 text-xs font-semibold text-blue-200 transition-all hover:-translate-y-0.5 hover:bg-blue-500/20 hover:shadow-lg hover:shadow-blue-500/20"
          >
            대회 세부 정보 보기 →
          </Link>
          <Link
            href="/solare-tournament/apply"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-purple-400/40 bg-purple-500/10 px-4 py-2.5 text-xs font-semibold text-purple-200 transition-all hover:-translate-y-0.5 hover:bg-purple-500/20 hover:shadow-lg hover:shadow-purple-500/20"
          >
            BDOPVP-포냥이 홈페이지에서 신청 →
          </Link>
        </div>
      </div>
    </div>
  )
}


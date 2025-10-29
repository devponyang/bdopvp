import { Metadata } from 'next'
import MasterClassGrid from '@/components/master-class/ClassGrid'

export const metadata: Metadata = {
  title: '2025 마스터 클래스 - 검은사막 클래스 최강자 대회',
  description: '검은사막 각 클래스의 최강자를 가리는 명예로운 PvP 대회, 2025 마스터 클래스 정보를 확인하세요.',
  keywords: ['마스터 클래스', '검은사막', 'PvP', '토너먼트', '클래스 최강자', '대회'],
}

export default function MasterClassPage() {
  return (
    <div className="p-3 md:p-6 max-w-full md:max-w-[1490px] mx-auto mt-6">
      {/* 메인 헤더 */}
      <div className="relative overflow-hidden rounded-3xl shadow-2xl border border-white/10 mb-8">
        {/* 배경 이미지 */}
        <div 
          className="absolute inset-0 bg-no-repeat opacity-50"
          style={{
            backgroundImage: "url('/ponyang/masterclass.gif')",
            backgroundSize: "100% auto",
            backgroundPosition: "center 48%"
          }}
        ></div>
        
        {/* 콘텐츠 */}
        <div className="relative p-3 md:p-8">
          {/* 데스크톱 레이아웃 */}
          <div className="hidden md:flex items-center gap-6">
            {/* 왼쪽: 아이콘과 제목 */}
            <div className="flex items-center gap-4">
              {/* 아이콘 */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/30 to-orange-400/30 rounded-xl blur-sm"></div>
                <div className="relative w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg p-2">
                  <img 
                    src="/ponyang/masterclass.png" 
                    alt="마스터클래스 아이콘" 
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              
              {/* 제목 블록 */}
              <div className="px-4 py-3">
                <h1 className="text-4xl font-bold text-white">
                  2025 마스터 클래스
                </h1>
                <div className="text-lg text-white font-medium">
                  클래스 최강자 대회
                </div>
              </div>
            </div>
          </div>

          {/* 모바일 레이아웃 */}
          <div className="md:hidden">
            {/* 제목 */}
            <div className="flex flex-col items-center text-center">
              <div>
                <h1 className="text-xl font-bold text-white">
                  2025 마스터 클래스
                </h1>
                <div className="text-xs text-white font-medium">
                  클래스 최강자 대회
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 메인 소개 */}
      <div className="bg-gradient-to-br from-slate-800/60 to-indigo-900/60 backdrop-blur-sm rounded-2xl shadow-xl border border-white/10 p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="text-2xl">🏆</span>
            대회 소개
          </h2>
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded-xl p-4 border border-yellow-500/30">
              <p className="text-yellow-200 font-semibold text-center mb-2">검은사막 각 클래스의 최강자를 뽑는 명예로운 PvP 대회</p>
            </div>

            <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg p-6 border border-blue-500/30">
              <h3 className="text-xl font-semibold mb-4 text-blue-300">
                📋 대회 개요
              </h3>
              <p className="text-gray-300 leading-relaxed">
                이번에 진행될 2025 마스터 클래스는 검은사막의 각 클래스 최강자 1인을 가리는 1:1 토너먼트 대회 입니다.
                실력에서도 장비에서도 최고인 분들을 대상으로 준비된 만큼 공방합 기준 상위 5% 의 
                모험가분들께만 대회 신청 자격이 제공되는 점 안내 해드립니다.
              </p>
            </div>

            <div className="bg-gradient-to-r from-red-900/30 to-orange-900/30 rounded-lg p-6 border border-red-500/30">
              <h3 className="text-xl font-semibold mb-4 text-red-300">
                ⚔️ 참가 자격 요건
              </h3>
              <div className="space-y-4">
                <p className="text-gray-300">
                  아래 자격을 모두 충족한 후, 신청을 마쳐야 정상적으로 참가가 인정됩니다.
                </p>
                
                <div className="space-y-4">
                  <div className="bg-red-800/50 rounded-lg p-4 border border-red-600/50">
                    <h4 className="font-semibold text-red-200 mb-2">① 공격력 + 방어력 합계</h4>
                    <p className="text-gray-300 text-sm">
                      2025년 10월 15일(수) 정기점검 시작 전 가문 내 캐릭터의 '장비 능력치 공격력과 방어력의 합계가 810 이상'인 경우에만 참가 자격이 주어집니다. 
                      단, 검은사당 토벌로 적용되는 '아침의 축복' 수치는 포함되지 않습니다.
                    </p>
                  </div>
                  
                  <div className="bg-blue-800/50 rounded-lg p-4 border border-blue-600/50">
                    <h4 className="font-semibold text-blue-200 mb-2">② 만 19세 이상, 본인 명의 계정</h4>
                    <p className="text-gray-300 text-sm">
                      2025 마스터 클래스 전체 일정이 진행되는 도중 주최 측으로부터 본인 확인을 위해 신분증 또는 여권 등의 사진이나 실물의 확인을 요청할 수 있으며 
                      참가자는 이에 불응할 경우 참가 자격 박탈 판정이 내려질 수 있습니다.
                    </p>
                  </div>
                  
                  <div className="bg-green-800/50 rounded-lg p-4 border border-green-600/50">
                    <h4 className="font-semibold text-green-200 mb-2">③ 운영정책 준수</h4>
                    <p className="text-gray-300 text-sm">
                      최근 6개월 이내에 운영정책을 위반하여 게임 접속이 제한된 이력을 보유한 계정은 대회 참가 신청이 제한됩니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-900/30 to-teal-900/30 rounded-lg p-6 border border-green-500/30">
              <h3 className="text-xl font-semibold mb-4 text-green-300">
                🎯 대회 특징
              </h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">•</span>
                  <span>각 클래스별 최강자 1인 선발</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">•</span>
                  <span>1:1 토너먼트 방식</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">•</span>
                  <span>실력과 장비 모두를 고려한 선발</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-1">•</span>
                  <span>명예로운 PvP 대회</span>
                </li>
              </ul>
            </div>

            <div className="text-center bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-lg p-6 border border-purple-500/30">
              <h3 className="text-xl font-semibold mb-4 text-purple-300">
                💪 참가자 모집
              </h3>
              <p className="text-gray-300 leading-relaxed">
                2025 마스터 클래스에 관심을 가져주시는 모든 모험가님과 
                직접 참가하여 명예를 거머쥘 선수 모험가님들께서 
                이번 대회를 즐기실 수 있도록 열심히 준비하겠습니다.
              </p>
            </div>
          </div>
      </div>

      {/* 대회 일정 */}
      <div className="bg-gradient-to-br from-slate-800/60 to-indigo-900/60 backdrop-blur-sm rounded-2xl shadow-xl border border-white/10 p-6 mb-6">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <span className="text-2xl">📅</span>
          신청 및 대회 일정
        </h2>
            <div className="space-y-3 text-gray-300">
              <div className="flex justify-between">
                <span>참가 신청:</span>
                <span className="text-white">2025.10.01(수) ~ 10.15(수)</span>
              </div>
              <div className="flex justify-between">
                <span>클래스별 현황 공개:</span>
                <span className="text-white">2025.10.10(금)</span>
              </div>
              <div className="flex justify-between">
                <span>본선 대진표 공개:</span>
                <span className="text-white">2025.10.22(수)</span>
              </div>
              <div className="flex justify-between">
                <span>본선 ~ 준결승전:</span>
                <span className="text-white">2025.11.01(토) ~ 11.09(일)</span>
              </div>
              <div className="flex justify-between">
                <span>결승 대진표 공개:</span>
                <span className="text-white">2025.11.10(월)</span>
              </div>
              <div className="flex justify-between">
                <span>결승전 (라이브 생중계):</span>
                <span className="text-white">2025.11.22(토) ~ 11.23(일)</span>
              </div>
            </div>
      </div>

      {/* 상세 일정 안내 */}
      <div className="bg-gradient-to-br from-slate-800/60 to-indigo-900/60 backdrop-blur-sm rounded-2xl shadow-xl border border-white/10 p-6 mb-6">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <span className="text-2xl">📋</span>
          상세 일정 안내
        </h2>
            <div className="space-y-4">
              <div className="bg-purple-800/30 rounded-lg p-4 border border-purple-600/30">
                <h4 className="font-semibold text-purple-200 mb-2">본선 ~ 준결승전 그룹별 일정</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div className="text-center">
                    <div className="font-semibold text-white">A 그룹</div>
                    <div className="text-gray-300">2025.11.01(토)</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-white">B 그룹</div>
                    <div className="text-gray-300">2025.11.02(일)</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-white">C 그룹</div>
                    <div className="text-gray-300">2025.11.08(토)</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-white">D 그룹</div>
                    <div className="text-gray-300">2025.11.09(일)</div>
                  </div>
                </div>
              </div>
              <div className="bg-red-800/30 rounded-lg p-4 border border-red-600/30">
                <h4 className="font-semibold text-red-200 mb-2">결승전 (라이브 생중계)</h4>
                <div className="text-center">
                  <div className="text-lg font-semibold text-white">2025년 11월 22일(토) ~ 11월 23일(일)</div>
                  <div className="text-sm text-gray-300 mt-1">실시간 생중계로 진행됩니다</div>
                </div>
              </div>
            </div>
      </div>

      {/* 대회 보상 */}
      <div className="bg-gradient-to-br from-slate-800/60 to-indigo-900/60 backdrop-blur-sm rounded-2xl shadow-xl border border-white/10 p-6 mb-6">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <span className="text-2xl">💎</span>
          대회 보상
        </h2>
            <div className="space-y-4">
              <p className="text-gray-300 text-sm">
                검은사막 각 클래스의 최고를 뽑는 명예로운 대회에 참가하여 승리를 쟁취한 모험가님들께는 아래 보상이 지급됩니다.
              </p>
              
              <div className="space-y-4">
                {/* 1위 보상 */}
                <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded-lg p-4 border border-yellow-500/30">
                  <h4 className="font-semibold text-yellow-200 mb-3 text-center">👑 클래스 별 최강자 1위</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-400">💎</span>
                        <span className="text-white">20,000 펄</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-400">💎</span>
                        <span className="text-white">크론석 50,000개</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-400">🏆</span>
                        <span className="text-white">특별한 우승자 전용 칭호</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-400">🦅</span>
                        <span className="text-white">그리폰 탑승물 1년 이용권</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-400">🏠</span>
                        <span className="text-white">[주거지 가구] 마스터 클래스 1위 트로피</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-400">💍</span>
                        <span className="text-white">승리의 다이아몬드 반지</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-400">⚔️</span>
                        <span className="text-white">명예로운 아르샤 각성 무기(영구)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2위 보상 */}
                <div className="bg-gradient-to-r from-gray-800/30 to-slate-800/30 rounded-lg p-4 border border-gray-500/30">
                  <h4 className="font-semibold text-gray-200 mb-3 text-center">🥈 클래스 별 2위</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">💎</span>
                        <span className="text-white">10,000 펄</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">💎</span>
                        <span className="text-white">크론석 50,000개</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">🏠</span>
                        <span className="text-white">[주거지 가구] 마스터 클래스 2위 트로피</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">⚔️</span>
                        <span className="text-white">명예로운 아르샤 각성 무기(180일)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4강 ~ 32강 진출 보상 */}
                <div className="bg-gradient-to-r from-blue-800/30 to-indigo-800/30 rounded-lg p-4 border border-blue-500/30">
                  <h4 className="font-semibold text-blue-200 mb-3 text-center">🏅 4강 ~ 32강 진출 시</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div className="text-center">
                      <div className="font-semibold text-blue-200">4강 진출</div>
                      <div className="text-white">크론석 50,000개</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-blue-200">8강 진출</div>
                      <div className="text-white">크론석 40,000개</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-blue-200">16강 진출</div>
                      <div className="text-white">크론석 30,000개</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-blue-200">32강 진출</div>
                      <div className="text-white">크론석 20,000개</div>
                    </div>
                  </div>
                </div>

                {/* 참가자 전원 보상 */}
                <div className="bg-gradient-to-r from-green-800/30 to-emerald-800/30 rounded-lg p-4 border border-green-500/30">
                  <h4 className="font-semibold text-green-200 mb-3 text-center">🎖️ 대회 참가자 전원</h4>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="text-white font-semibold">2025 MASTER CLASS 칭호</span>
                    </div>
                    <p className="text-gray-300 text-xs">참가해주신 모든 모험가님께</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-600/30">
                <h4 className="font-semibold text-blue-200 mb-2">📋 보상 상세 정보</h4>
                <div className="space-y-2 text-gray-300 text-sm">
                  <p>• <span className="font-semibold text-blue-200">그리폰:</span> 유효기간 1년이 설정되어있는 탑승물</p>
                  <p>• <span className="font-semibold text-blue-200">마스터 클래스 트로피:</span> 주거지에 배치 후 상호작용하면 가구 버프 효과 적용</p>
                  <div className="bg-blue-800/30 rounded-lg p-3 mt-2">
                    <p className="text-blue-200 font-semibold text-xs">트로피 버프 효과:</p>
                    <p className="text-xs">모든 공격력 +15, 최대 생명력 +100, 지속 시간 2시간, 최대 내구도 30</p>
                  </div>
                  <p>• <span className="font-semibold text-blue-200">승리의 다이아몬드 반지:</span> 명예로운 승리를 기념하는 반지</p>
                </div>
              </div>
              
              <div className="bg-red-900/30 rounded-lg p-4 border border-red-600/30">
                <h4 className="font-semibold text-red-200 mb-2">⚠️ 보상 지급 안내</h4>
                <div className="space-y-2 text-gray-300 text-sm">
                  <p>• <span className="font-semibold text-red-200">보상 지급 기준:</span> 최종 순위에 따라 가문당 1회에 한하여 지급되며, 누적 지급되지 않습니다</p>
                  <p>• <span className="font-semibold text-red-200">참가자 보상:</span> 대진표에 안내된 경기에 모두 참여하여 대회를 끝마친 모험가님들께 지급됩니다</p>
                </div>
              </div>
            </div>
      </div>

      {/* 참가 신청 방법 */}
      <div className="bg-gradient-to-br from-slate-800/60 to-indigo-900/60 backdrop-blur-sm rounded-2xl shadow-xl border border-white/10 p-6 mb-6">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <span className="text-2xl">📝</span>
          참가 신청 방법
        </h2>
        <p className="text-gray-300 mb-6 text-center">
          참가 자격을 모두 충족했다면, 아래 신청 방법을 확인해 주세요.
        </p>
          
          <div className="space-y-6">
            {/* 1단계 */}
            <div className="bg-emerald-800/30 rounded-lg p-5 border border-emerald-600/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  1
                </div>
                <h4 className="text-lg font-semibold text-emerald-200">
                  대회에 참가할 클래스의 '체험 캐릭터'로 신청
                </h4>
              </div>
              <div className="space-y-3 text-gray-300 text-sm">
                <div className="bg-emerald-900/50 rounded-lg p-3">
                  <p><span className="font-semibold text-emerald-200">대회 신청 방법:</span> 게임 내 메뉴(ESC) → 전쟁 → 아르샤의 창 대회 신청</p>
                  <p><span className="font-semibold text-emerald-200">대회 신청 기간:</span> 2025년 10월 1일(수) 정기점검 후 ~ 2025년 10월 15일(수) 정기점검 전</p>
                </div>
                <div className="bg-yellow-900/30 rounded-lg p-3 border border-yellow-600/30">
                  <p className="text-yellow-200 font-semibold">⚠️ 중요 안내</p>
                  <ul className="mt-2 space-y-1 text-xs">
                    <li>• 반드시 대회에 참가할 체험 캐릭터로 신청해 주셔야 합니다. (필수)</li>
                    <li>• 참가 자격이 충족되지 않을 경우, 신청이 불가합니다.</li>
                    <li>• 체험 캐릭터 여부와 공격력과 방어력 합계를 확인해 주세요.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 2단계 */}
            <div className="bg-orange-800/30 rounded-lg p-5 border border-orange-600/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  2
                </div>
                <h4 className="text-lg font-semibold text-orange-200">
                  신청서 아이템 구매
                </h4>
              </div>
              <div className="space-y-3 text-gray-300 text-sm">
                <div className="bg-orange-900/50 rounded-lg p-3">
                  <p><span className="font-semibold text-orange-200">위치:</span> 자유 결투장 1 서버 &lt;2025 마스터클래스&gt; 헨로 NPC</p>
                  <p><span className="font-semibold text-orange-200">자유 결투장 입장:</span> 게임 내 메뉴(ESC) → 자유 결투장 1 서버</p>
                  <p><span className="font-semibold text-orange-200">구매 가능 기간:</span> 2025년 10월 1일(수) 정기점검 후 ~ 2025년 10월 15일(수) 정기점검 전</p>
                </div>
                <div className="bg-green-900/30 rounded-lg p-3 border border-green-600/30">
                  <p className="text-green-200 font-semibold">💰 구매 정보</p>
                  <ul className="mt-2 space-y-1 text-xs">
                    <li>• '2025 마스터 클래스 참가 신청서' 아이템은 100억 은화에 구매</li>
                    <li>• 신청서 아이템은 모든 대회 종료 전까지 가문 내 캐릭터에 소지 (필수)</li>
                    <li>• 모든 대회 종료 후 신청서 아이템 회수</li>
                    <li>• 경기를 모두 진행한 모험가님들에 한하여 구매 은화 환급 (편지로 지급)</li>
                    <li>• 경기를 참여하지 않은 경우, 환급되지 않음</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 3단계 */}
            <div className="bg-green-800/30 rounded-lg p-5 border border-green-600/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  3
                </div>
                <h4 className="text-lg font-semibold text-green-200">
                  ③ 본인 확인 서류 제출
                </h4>
              </div>
              <div className="space-y-3 text-gray-300 text-sm">
                <div className="bg-green-900/50 rounded-lg p-3">
                  <p><span className="font-semibold text-green-200">제출 서류:</span> 본인 계정임을 입증할 수 있는 '신분증'</p>
                  <p><span className="font-semibold text-green-200">필수 정보:</span> 이름, 생년월일만 제출</p>
                </div>
              </div>
            </div>
          </div>
      </div>

      {/* 대회 진행 방식 */}
      <div className="bg-gradient-to-br from-slate-800/60 to-indigo-900/60 backdrop-blur-sm rounded-2xl shadow-xl border border-white/10 p-6 mb-6">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <span className="text-2xl">⚔️</span>
          대회 진행 방식
        </h2>
          <div className="space-y-4">
            <p className="text-gray-300 text-sm">
              2025 마스터 클래스는 본 공지사항 및 대회 규약에 따라 진행됩니다.
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-purple-800/30 rounded-lg p-4 border border-purple-600/30">
                <h4 className="font-semibold text-purple-200 mb-2">경기 형태</h4>
                <p className="text-gray-300 text-sm">아르샤의 창 / 동일 장비, 동일 클래스 1:1 토너먼트</p>
              </div>
              
              <div className="bg-purple-800/30 rounded-lg p-4 border border-purple-600/30">
                <h4 className="font-semibold text-purple-200 mb-2">경기 시간</h4>
                <p className="text-gray-300 text-sm">라운드 당 최대 3분</p>
              </div>
            </div>
            
            <div className="bg-purple-800/30 rounded-lg p-4 border border-purple-600/30">
              <h4 className="font-semibold text-purple-200 mb-3">진행 방식</h4>
              <div className="space-y-2 text-gray-300 text-sm">
                <p>① 경기 시작 전, 신청한 '체험 캐릭터'로 접속하여 [GM]의 안내에 따라 대기</p>
                <p>② 경기 시작 시간이 도래하면, 아르샤의 창 경기 초대를 수락</p>
                <p>③ 양팀의 출전 선수가 경기장으로 입장하면 준비 상태 확인 후 경기 시작</p>
              </div>
            </div>
            
            <div className="bg-purple-800/30 rounded-lg p-4 border border-purple-600/30">
              <h4 className="font-semibold text-purple-200 mb-3">승리 조건</h4>
              <div className="grid md:grid-cols-2 gap-3 text-gray-300 text-sm">
                <div>
                  <span className="font-semibold text-purple-200">본선 ~ 준결승:</span> 3판 2선승
                </div>
                <div>
                  <span className="font-semibold text-purple-200">결승:</span> 5판 3선승
                </div>
              </div>
            </div>
            
            <div className="bg-red-800/30 rounded-lg p-4 border border-red-600/30">
              <h4 className="font-semibold text-red-200 mb-3">▲ 장막 시스템</h4>
              <div className="space-y-2 text-gray-300 text-sm">
                <p>• 장막은 경기 시작 후 10초 경과 시 생성됩니다</p>
                <p>• 생성된 장막은 경기 시작 후 1분, 2분 경과 시 범위가 축소됩니다</p>
                <p>• 장막 범위에 들어갈 경우, 1초당 생명력 500이 감소합니다</p>
              </div>
            </div>
          </div>
      </div>

      {/* 대회 규약 및 준수사항 */}
      <div className="bg-gradient-to-br from-slate-800/60 to-indigo-900/60 backdrop-blur-sm rounded-2xl shadow-xl border border-white/10 p-6 mb-6">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <span className="text-2xl">⚠️</span>
          대회 규약 및 준수사항
        </h2>
          <div className="space-y-4">
            <div className="bg-red-800/30 rounded-lg p-4 border border-red-600/30">
              <p className="text-red-200 font-semibold mb-3">⚠️ 아래에 해당하는 경우, 참가 자격 박탈 및 운영정책에 따라 조치될 수 있습니다.</p>
              <p className="text-gray-300 text-sm mb-4">대회 참가 전, 반드시 아래 항목을 숙지해 주시기를 바랍니다.</p>
            </div>
            
            <div className="space-y-3">
              <div className="bg-red-900/20 rounded-lg p-3 border border-red-700/30">
                <ul className="space-y-2 text-gray-300 text-sm">
                  <li>• <a href="https://s1.pearlcdn.com/KR/Upload/QnaAttach/20251001012848672JQSU8R478P91U8MP.pdf" target="_blank" rel="noopener noreferrer" className="text-red-300 hover:text-red-200 underline">[2025 마스터 클래스 대회 규약]</a>을 위반한 경우</li>
                  <li>• 경기 참가 시점에 미접속 및 경기 시작 이후 경기장 이탈, 접속을 종료한 경우</li>
                  <li>• 신청한 가문명, 캐릭터명이 운영정책에 위반되는 경우</li>
                  <li>• 고의적으로 상대방의 경기를 방해한다고 판단되는 경우</li>
                  <li>• 원활한 경기 진행을 위한 안내에 따르지 않는 경우</li>
                  <li>• 타인이 본인을 대신하여 경기에 참여한 사실이 확인될 경우</li>
                  <li>• 다른 모험가님을 도발하거나 모욕하는 행위가 확인될 경우</li>
                  <li>• 고의적으로 무승부를 유도하거나 경기에 적극적으로 참여하지 않는다고 판단되는 경우</li>
                  <li>• [검은사막 운영정책]에 위반된 행위를 하거나, 신청한 가문이 제재된 경우</li>
                  <li>• [검은사막 이벤트 규약]에 의거하여 비정상적인 방법으로 경기에 참여한 경우</li>
                  <li>• 안내된 경기 진행 방식 이외의 부적절한 방법으로 경기에 참여하는 경우</li>
                </ul>
              </div>
              
              <div className="bg-orange-800/30 rounded-lg p-4 border border-orange-600/30">
                <p className="text-orange-200 font-semibold text-sm">
                  심판은 선수가 부적절한 방법으로 경기를 진행하는지 판단하며, 판단 결과에 따라 실격 처리될 수 있습니다.
                </p>
              </div>
            </div>
          </div>
      </div>

      {/* 클래스 선택 그리드 */}
      <div className="bg-gradient-to-br from-slate-800/60 to-indigo-900/60 backdrop-blur-sm rounded-2xl shadow-xl border border-white/10 p-6 mb-6">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <span className="text-3xl">⚔️</span>
          클래스별 대진표
        </h2>
        <p className="text-gray-300 mb-6 text-center">
          각 클래스를 선택하여 대진표를 확인하세요
        </p>
        
        <MasterClassGrid />
      </div>

      {/* 하단 안내 */}
      <div className="text-center mt-8">
        <div className="inline-block bg-white/5 px-6 py-4 rounded-lg border border-white/10">
          <p className="text-sm text-gray-300 mb-2">
            더 자세한 정보는 <a href="https://www.kr.playblackdesert.com/ko-KR/News/Detail?groupContentNo=14606&countryType=ko-KR" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">공식 공지사항</a>을 확인해주세요.
          </p>
          <p className="text-xs text-gray-400">
            * 이 페이지는 팬사이트에서 제공하는 정보입니다.
          </p>
        </div>
      </div>
    </div>
  )
}

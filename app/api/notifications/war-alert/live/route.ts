import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// 최신 알림 데이터를 저장하는 전역 캐시
declare global {
  var latestNotification: any
}

// 전역 캐시 초기화
if (!global.latestNotification) {
  global.latestNotification = null
}

// 전쟁 상태 타입 정의
type WarStatus = 'PREPARING' | 'ONGOING' | 'IDLE'

// 시간대별 전쟁 상태 확인 (테스트용 - 시간 제한 없음)
const getWarStatus = (): WarStatus => {
  const now = new Date()
  const kstTime = new Date(now.getTime() + (9 * 60 * 60 * 1000))
  const hour = kstTime.getUTCHours()
  const minute = kstTime.getUTCMinutes()
  
  // 거점 대기: 20:45-20:59
  if (hour === 20 && minute >= 45) return 'PREPARING'
  
  // 거점 시작: 21:00-22:00
  if (hour === 21) return 'ONGOING'
  if (hour === 22 && minute === 0) return 'ONGOING'
  
  // 그 외: 대기
  return 'IDLE'
}

// 진행중인 연맹 조회
const getOngoingAlliances = async () => {
  
  try {
    const client = await db.connect()
    // 한국시간 기준으로 오늘 날짜 계산
    const kstToday = new Date(new Date().getTime() + (9 * 60 * 60 * 1000))
    const today = kstToday.toISOString().split('T')[0]
    
    // 오늘 21시 이후의 전쟁 기록 중 '진행중' 상태인 것들만 조회
    const ongoingResult = await client.query(`
      SELECT wr.region, a.name as alliance_name, wr.occupied_area
      FROM war_records wr
      JOIN alliances a ON wr.alliance_id = a.id
      WHERE wr.war_date >= $1
      AND wr.war_date >= $2
      AND wr.result = '진행중'
      ORDER BY wr.region, wr.war_date DESC
    `, [today, `${today}T21:00:00.000Z`])
    
    // 오늘 21시 이후의 모든 거점전 기록이 있는 지역 조회 (진행중이든 종료든)
    const allRegionsResult = await client.query(`
      SELECT DISTINCT wr.region
      FROM war_records wr
      WHERE wr.war_date >= $1
      AND wr.war_date >= $2
      AND wr.war_type = '거점전'
      ORDER BY wr.region
    `, [today, `${today}T21:00:00.000Z`])
    
    client.release()
    
    // 진행중인 연맹을 지역별로 그룹화
    const ongoingGrouped = ongoingResult.rows.reduce((acc: any, row: any) => {
      if (!acc[row.region]) {
        acc[row.region] = []
      }
      acc[row.region].push(row)
      return acc
    }, {})
    
    // 모든 거점전 지역에 대해 상태 확인 (진행중이든 종료든)
    const regionStatus: Record<string, { ongoing: any[], hasOngoing: boolean }> = {}
    allRegionsResult.rows.forEach((row: any) => {
      const region = row.region
      regionStatus[region] = {
        ongoing: ongoingGrouped[region] || [],
        hasOngoing: !!(ongoingGrouped[region] && ongoingGrouped[region].length > 0)
      }
    })
    
    return regionStatus
  } catch (error) {
    return {}
  }
}

// 점령 성공 알림 HTML 생성 함수
const generateConquestNotificationHTML = (notificationData: any) => {
  const { alliance_name, region, fort_stage, occupied_area } = notificationData
  
  // 성채단계에 "단계" 추가
  const stageWithLevel = typeof fort_stage === 'string' && fort_stage.includes('단계') 
    ? fort_stage 
    : `${fort_stage}단계`
    
  // 연맹 이름 길이에 따른 폰트 크기 조정
  const allianceLength = alliance_name.length
  let fontSize = 20 // 기본 크기
  if (allianceLength <= 3) {
    fontSize = 24 // 짧은 연맹명은 크게
  } else if (allianceLength <= 6) {
    fontSize = 22 // 중간 길이
  } else if (allianceLength >= 10) {
    fontSize = 18 // 긴 연맹명은 작게
  }
  
  // 지역별 이미지 매핑
  const regionImageMap: Record<string, string> = {
    '칼페온': '/war-records/calfeon.png',
    '카마실비아': '/war-records/kamasylvia.png',
    '메디아': '/war-records/media.png',
    '발렌시아': '/war-records/balencia.png',
    '발레노스': '/war-records/balenos.png',
    '세렌디아': '/war-records/Serendia.png',
  }
  
  const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Malgun Gothic', '맑은 고딕', 'Apple SD Gothic Neo', sans-serif;
            background: transparent;
            color: white;
            height: 100vh;
            display: flex;
            align-items: center;
        }
        .notification {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 20px;
            width: 100%;
            padding: 30px;
            height: 100%;
            animation: conquestSlideIn 1s ease-out;
            background: transparent;
        }
        .header {
            display: flex;
            align-items: center;
            gap: 15px;
            font-size: 28px;
            font-weight: bold;
            text-shadow: 3px 3px 6px rgba(0,0,0,0.8);
        }
        .region-icon {
            width: 50px;
            height: 50px;
            object-fit: contain;
            filter: drop-shadow(3px 3px 6px rgba(0,0,0,0.8));
            flex-shrink: 0;
            animation: iconPulse 1.5s infinite;
        }
        .conquest-text {
            text-align: center;
            font-size: ${fontSize}px;
            font-weight: bold;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
            line-height: 1.4;
            animation: textGlow 2s infinite alternate;
        }
        .alliance-name {
            color: #60a5fa;
            font-size: ${fontSize + 4}px;
            animation: highlight 1s ease-in-out;
        }
        .region-name {
            color: #fbbf24;
        }
        .stage-name {
            color: #f472b6;
        }
        .occupied-area {
            color: #f59e0b;
        }
        .victory-icon {
            font-size: 40px;
            animation: bounce 1s infinite;
        }
        @keyframes conquestSlideIn {
            from { transform: translateY(-100%) scale(0.8); opacity: 0; }
            to { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes conquestGlow {
            from { box-shadow: 0 0 30px rgba(59, 130, 246, 0.8); }
            to { box-shadow: 0 0 50px rgba(59, 130, 246, 1); }
        }
        @keyframes iconPulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }
        @keyframes textGlow {
            from { text-shadow: 2px 2px 4px rgba(0,0,0,0.8); }
            to { text-shadow: 2px 2px 8px rgba(59, 130, 246, 0.6); }
        }
        @keyframes highlight {
            0% { background-color: transparent; }
            50% { background-color: rgba(96, 165, 250, 0.3); }
            100% { background-color: transparent; }
        }
        @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }
    </style>
</head>
<body>
    <div class="notification">
        <div class="header">
        <img src="${regionImageMap[region] || '/war-records/calfeon.png'}" alt="${region}" class="region-icon">
            <span class="region-name">${region} 거점전</span>
        </div>
        <div class="conquest-text">
            <div class="victory-icon">🏆</div>
            <div><span class="alliance-name">${alliance_name}</span> 연맹이</div>
            <div><span class="stage-name">${stageWithLevel}</span> <span class="occupied-area">${occupied_area || ''}</span>를</div>
            <div>점령하였습니다!</div>
        </div>
    </div>
    <script>
        // 점령 성공 알림음 재생 (성공음)
        function playConquestSound() {
            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                
                // 성공음 (두두두-두!)
                const notes = [659.25, 659.25, 659.25, 880]; // E5, E5, E5, A5
                const durations = [0.15, 0.15, 0.15, 0.4];
                const noteGap = 0.05;
                
                let currentTime = audioContext.currentTime;
                
                notes.forEach((frequency, index) => {
                    const oscillator = audioContext.createOscillator();
                    const gainNode = audioContext.createGain();
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(audioContext.destination);
                    
                    oscillator.frequency.setValueAtTime(frequency, currentTime);
                    oscillator.type = 'sine';
                    
                    gainNode.gain.setValueAtTime(0, currentTime);
                    gainNode.gain.linearRampToValueAtTime(0.12, currentTime + 0.05);
                    gainNode.gain.linearRampToValueAtTime(0, currentTime + durations[index]);
                    
                    oscillator.start(currentTime);
                    oscillator.stop(currentTime + durations[index]);
                    
                    currentTime += durations[index] + noteGap;
                });
                
            } catch (error) {
            }
        }
        
        // 페이지 로드 시 즉시 소리 재생
        playConquestSound();
        
        // 화면 깜빡임 효과
        setTimeout(() => {
            document.body.style.animation = 'conquestGlow 0.3s ease-in-out 3';
        }, 1000);
        
        // 10초 후 페이드 아웃 애니메이션으로 사라짐
        setTimeout(() => {
            document.body.style.opacity = '0';
            document.body.style.transition = 'opacity 0.5s ease-out';
            
            // 페이드 아웃 완료 후 투명 화면으로 변경
            setTimeout(() => {
                document.body.innerHTML = '<div style="width: 100%; height: 100%; background: transparent;"></div>';
                
                // 알림이 사라진 후 서버에서 캐시 초기화 요청
                fetch('/api/notifications/war-alert/clear', { method: 'POST' }).catch(() => {});
                
                // 3초 후 진행중인 연맹 표시로 돌아가기
                setTimeout(() => {
                    location.reload();
                }, 3000);
            }, 500);
        }, 10000);
    </script>
</body>
</html>`
  
  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { alliance_name, region, occupied_area, fort_stage, war_type, war_date, tier } = body

    const notification = {
      alliance_name,
      region,
      occupied_area,
      fort_stage,
      war_type,
      war_date,
      tier,
      timestamp: Date.now()
    }

    // 전역 캐시에 직접 업데이트
    global.latestNotification = notification
    

    return NextResponse.json({
      success: true,
      message: '알림이 업데이트되었습니다.',
      warTime: true
    })
  } catch (error) {
    return NextResponse.json(
      { error: '알림 업데이트에 실패했습니다.' },
      { status: 500 }
    )
  }
}

// OBS 브라우저 소스용 고정 URL - 실시간 업데이트
export async function GET() {
  try {
    const warStatus = getWarStatus()
    
    // IDLE 상태에서는 아예 차단 (서버 부하 방지)
    if (warStatus === 'IDLE') {
      return new Response('', { status: 200 }) // 빈 응답
    }
    
    // 최신 알림 데이터가 있으면 즉시 표시 (점령 성공 알림) - 지역 로테이션보다 우선
    if (global.latestNotification) {
      return generateConquestNotificationHTML(global.latestNotification)
    }
    
    // 진행 예정 상태 (20:45-21:00)
    if (warStatus === 'PREPARING') {
      return new Response(`
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Malgun Gothic', '맑은 고딕', 'Apple SD Gothic Neo', sans-serif;
            background: transparent;
            color: white;
            height: 100vh;
            display: flex;
            align-items: center;
        }
        .notification {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 12px;
            width: 100%;
            padding: 20px;
            height: 100%;
            animation: slideIn 0.8s ease-out;
            background: transparent;
        }
        .header {
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 24px;
            font-weight: bold;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
            flex-wrap: nowrap;
        }
        .region-icon {
            width: 40px;
            height: 40px;
            object-fit: contain;
            filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.8));
            flex-shrink: 0;
        }
        .region-name {
            color: #fbbf24;
            font-size: 28px;
            white-space: nowrap;
        }
        .status-text {
            color: #60a5fa;
            font-size: 20px;
            text-align: center;
            animation: pulse 2s infinite;
        }
        @keyframes slideIn {
            from { transform: translateY(-100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
        }
    </style>
</head>
<body>
    <div class="notification">
        <div class="header">
        <img src="/guild-icons/1758172577365_ponyang-9.png" alt="BDOPVP" class="region-icon">
            <span class="region-name">BDOPVP</span>
        </div>
        <div class="status-text">포냥이 거점전 알림</div>
    </div>
    <script>
        // 30초마다 새로고침
        setTimeout(() => {
            location.reload();
        }, 30000);
    </script>
</body>
</html>`, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
        },
      })
    }
    
    // 진행중 상태 (21:00-22:00) - 지역별 진행중 연맹 표시
    if (warStatus === 'ONGOING') {
      // 성공 알림이 있으면 지역 로테이션 무시하고 즉시 표시 (이미 위에서 처리됨)
      // 여기서는 성공 알림이 없을 때만 지역 로테이션 처리
      
      const regionStatus = await getOngoingAlliances()
      const regions = Object.keys(regionStatus)
      
      if (regions.length === 0) {
        // 아무 지역도 없으면 아무것도 표시하지 않음
        return new Response('', { status: 200 })
      }
      
      // 지역별 상태 표시 (30초마다 로테이션)
      const currentTime = Math.floor(Date.now() / 30000) // 30초 단위
      const regionIndex = currentTime % regions.length
      const currentRegion = regions[regionIndex]
      const currentRegionStatus = regionStatus[currentRegion]
      
      // 지역별 이미지 매핑
      const regionImageMap: Record<string, string> = {
        '칼페온': '/war-records/calfeon.png',
        '카마실비아': '/war-records/kamasylvia.png',
        '메디아': '/war-records/media.png',
        '발렌시아': '/war-records/balencia.png',
        '발레노스': '/war-records/balenos.png',
        '세렌디아': '/war-records/Serendia.png',
      }
      
      // 해당 지역에 진행중인 연맹이 있는지 확인
      if (currentRegionStatus.hasOngoing) {
        // 진행중인 연맹이 있으면 개수 표시
        const allianceCount = currentRegionStatus.ongoing.length
        const alliances = currentRegionStatus.ongoing
        
        // 모든 연맹 표시 (제한 없음)
        const displayAlliances = alliances
      
      return new Response(`
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Malgun Gothic', '맑은 고딕', 'Apple SD Gothic Neo', sans-serif;
            background: transparent;
            color: white;
            height: 100vh;
            display: flex;
            align-items: center;
        }
        .notification {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 15px;
            width: 100%;
            padding: 20px;
            height: 100%;
            animation: slideIn 0.8s ease-out;
            background: transparent;
        }
        .header {
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 24px;
            font-weight: bold;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
            flex-wrap: nowrap;
        }
        .region-icon {
            width: 40px;
            height: 40px;
            object-fit: contain;
            filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.8));
            flex-shrink: 0;
        }
        .region-name {
            color: #fbbf24;
            font-size: 28px;
            white-space: nowrap;
        }
        .alliances-list {
            display: flex;
            flex-direction: column;
            gap: 8px;
            width: 100%;
            max-width: 400px;
        }
        .alliance-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            width: 100%;
            max-width: 500px;
        }
        .alliance-row.single {
            grid-template-columns: 1fr;
            justify-items: center;
        }
        .alliance-row.single .alliance-item {
            font-size: 18px;
            padding: 8px 14px;
            min-height: 38px;
            justify-content: center;
        }
        .alliance-row.single .alliance-color {
            width: 12px;
            height: 12px;
        }
        .alliance-item {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            gap: 6px;
            padding: 6px 10px;
            background: rgba(0, 0, 0, 0.6);
            border-radius: 6px;
            border: 1px solid rgba(59, 130, 246, 0.5);
            font-size: 14px;
            font-weight: 600;
            animation: fadeInUp 0.6s ease-out;
            min-height: 32px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .alliance-item.conquered {
            background: rgba(34, 197, 94, 0.3);
            border: 1px solid rgba(34, 197, 94, 0.7);
            animation: conquestGlow 2s infinite alternate;
        }
        .conquest-icon {
            font-size: 14px;
            margin-left: 4px;
        }
        .alliance-color {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            flex-shrink: 0;
        }
        .alliance-name {
            color: #60a5fa;
        }
        .conquest-icon {
            font-size: 12px;
            margin-left: 2px;
        }
        .remaining-count {
            color: #94a3b8;
            font-size: 12px;
            text-align: center;
            margin-top: 5px;
        }
        .total-count {
            color: #fbbf24;
            font-size: 16px;
            font-weight: bold;
            text-align: center;
        }
        @keyframes slideIn {
            from { transform: translateY(-100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeInUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        @keyframes conquestGlow {
            from { box-shadow: 0 0 5px rgba(34, 197, 94, 0.5); }
            to { box-shadow: 0 0 15px rgba(34, 197, 94, 0.8); }
        }
    </style>
</head>
<body>
    <div class="notification">
        <div class="header">
            <img src="${regionImageMap[currentRegion] || '/war-records/balenos.png'}" alt="${currentRegion}" class="region-icon">
            <span class="region-name">${currentRegion} 거점전</span>
        </div>
        <div class="alliances-list">
            ${(() => {
              // 5개 이하는 1개씩, 6개 이상은 2개씩
              const itemsPerRow = displayAlliances.length <= 5 ? 1 : 2
              const rows = []
              
              for (let i = 0; i < displayAlliances.length; i += itemsPerRow) {
                const row = displayAlliances.slice(i, i + itemsPerRow)
                const isSingleRow = row.length === 1
                rows.push({
                  alliances: row,
                  className: isSingleRow ? 'single' : 'double'
                })
              }
              
              return rows.map((row, rowIndex) => `
                <div class="alliance-row ${row.className}">
                  ${row.alliances.map((alliance, index) => {
                    const globalIndex = rowIndex * itemsPerRow + index
                    const isConquered = alliance.occupied_area && alliance.occupied_area.trim() !== ''
                    return `
                      <div class="alliance-item ${isConquered ? 'conquered' : ''}" style="animation-delay: ${globalIndex * 0.1}s">
                          <div class="alliance-color" style="background-color: ${['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'][globalIndex] || '#6b7280'}"></div>
                          <span class="alliance-name">${alliance.alliance_name}</span>
                          ${isConquered ? '<span class="conquest-icon">🏆</span>' : ''}
                      </div>
                    `
                  }).join('')}
                </div>
              `).join('')
            })()}
        </div>
        <div class="total-count">총 ${allianceCount}개 연맹 참여</div>
    </div>
    <script>
        // 30초마다 새로고침 (지역 로테이션)
        setTimeout(() => {
            location.reload();
        }, 30000);
    </script>
</body>
</html>`, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
        },
      })
      } else {
        // 진행중인 연맹이 없으면 거점전 종료 표시 - 점령 결과도 함께 표시
        try {
          const client = await db.connect()
          // 한국시간 기준으로 오늘 날짜 계산
          const kstToday = new Date(new Date().getTime() + (9 * 60 * 60 * 1000))
          const today = kstToday.toISOString().split('T')[0]
          
          
          
          // 오늘 해당 지역의 점령 성공 기록 조회 (거점전만)
          const conquestResult = await client.query(`
            SELECT 
              COALESCE(a.name, '[해체된 연맹]') AS alliance_name,
              wr.fort_stage, 
              wr.occupied_area,
              wr.result
            FROM war_records wr
            LEFT JOIN alliances a ON wr.alliance_id = a.id
            WHERE wr.region = $1
            AND wr.war_date >= $2
            AND wr.war_type = '거점전'
            AND (wr.result = '승리' OR wr.result = '성공' OR wr.result = '점령' OR wr.result = '점령성공')
            ORDER BY wr.war_date DESC
            LIMIT 5
          `, [currentRegion, today])
          
          client.release()
          
          const conquests = conquestResult.rows
          
          // 참여 연맹이 없고 점령 결과도 없으면 아무것도 표시하지 않음
          if (conquests.length === 0) {
            return new Response('', { status: 200 })
          }
          
          return new Response(`
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Malgun Gothic', '맑은 고딕', 'Apple SD Gothic Neo', sans-serif;
            background: transparent;
            color: white;
            height: 100vh;
            display: flex;
            align-items: center;
        }
        .notification {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 15px;
            width: 100%;
            padding: 20px;
            height: 100%;
            animation: slideIn 0.8s ease-out;
            background: transparent;
        }
        .header {
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 24px;
            font-weight: bold;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
            flex-wrap: nowrap;
        }
        .region-icon {
            width: 40px;
            height: 40px;
            object-fit: contain;
            filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.8));
            flex-shrink: 0;
        }
        .region-name {
            color: #fbbf24;
            font-size: 22px;
            white-space: nowrap;
        }
        .status-text {
            color: #60a5fa;
            font-size: 16px;
            text-align: center;
            animation: pulse 2s infinite;
        }
        .conquests-list {
            display: flex;
            flex-direction: column;
            gap: 6px;
            width: 100%;
            max-width: 350px;
        }
        .conquest-item {
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 8px 12px;
            background: rgba(34, 197, 94, 0.2);
            border-radius: 6px;
            border: 1px solid rgba(34, 197, 94, 0.5);
            font-size: 16px;
            font-weight: 600;
            animation: fadeInUp 0.6s ease-out;
        }
        .conquest-icon {
            font-size: 14px;
        }
        .alliance-name {
            color: #60a5fa;
        }
        .stage-name {
            color: #f472b6;
        }
        .occupied-area {
            color: #f59e0b;
        }
        @keyframes slideIn {
            from { transform: translateY(-100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
        }
        @keyframes fadeInUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
    </style>
</head>
<body>
    <div class="notification">
        <div class="header">
        <img src="${regionImageMap[currentRegion] || '/war-records/balenos.png'}" alt="${currentRegion}" class="region-icon">
            <span class="region-name">${currentRegion} 거점전</span>
        </div>
        <div class="status-text" style="color: #ff6b6b; text-shadow: 2px 2px 4px rgba(0,0,0,0.8); font-weight: bold;">종료</div>
        ${conquests.length > 0 ? `
        <div class="conquests-list">
            ${conquests.map((conquest, index) => {
              const stageWithLevel = typeof conquest.fort_stage === 'string' && conquest.fort_stage.includes('단계') 
                ? conquest.fort_stage 
                : `${conquest.fort_stage}단계`
              return `
                <div class="conquest-item" style="animation-delay: ${index * 0.1}s">
                    <span class="conquest-icon">🏆</span>
                    <span class="alliance-name">${conquest.alliance_name}</span>
                    <span class="stage-name">${stageWithLevel}</span>
                    ${conquest.occupied_area ? `<span class="occupied-area">${conquest.occupied_area}</span>` : ''}
                </div>
              `
            }).join('')}
        </div>
        ` : ''}
    </div>
    <script>
        // 10초마다 새로고침 (로테이션)
        setTimeout(() => {
            location.reload();
        }, 10000);
    </script>
</body>
</html>`, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
        },
      })
        } catch (error) {
          // 에러 발생 시 기본 종료 화면 표시
        return new Response(`
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: 'Malgun Gothic', '맑은 고딕', 'Apple SD Gothic Neo', sans-serif;
            background: transparent;
            color: white;
            height: 100vh;
            display: flex;
            align-items: center;
        }
        .notification {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 12px;
            width: 100%;
            padding: 20px;
            height: 100%;
            animation: slideIn 0.8s ease-out;
            background: transparent;
        }
        .header {
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 24px;
            font-weight: bold;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
            flex-wrap: nowrap;
        }
        .region-icon {
            width: 40px;
            height: 40px;
            object-fit: contain;
            filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.8));
            flex-shrink: 0;
        }
        .region-name {
            color: #fbbf24;
            font-size: 28px;
            white-space: nowrap;
        }
        .status-text {
            color: #60a5fa;
            font-size: 20px;
            text-align: center;
            animation: pulse 2s infinite;
        }
        @keyframes slideIn {
            from { transform: translateY(-100%); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
        }
    </style>
</head>
<body>
    <div class="notification">
        <div class="header">
        <img src="${regionImageMap[currentRegion] || '/war-records/balenos.png'}" alt="${currentRegion}" class="region-icon">
            <span class="region-name">${currentRegion} 거점전</span>
        </div>
        <div class="status-text">종료</div>
    </div>
    <script>
        // 10초마다 새로고침 (로테이션)
        setTimeout(() => {
            location.reload();
        }, 10000);
    </script>
</body>
</html>`, {
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
          },
        })
        }
      }
    }

    // 기본적으로 아무것도 표시하지 않음
    return new Response('', { status: 200 }) // 빈 응답
  } catch (error) {
    return new Response('요청 처리에 실패했습니다.', { status: 500 })
  }
}
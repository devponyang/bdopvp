import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

// 솔라레 플레이어 목록 조회 (전체 + 클래스별)
export async function GET() {
  const client = await db.connect()
  try {
    // 현재 활성 시즌의 모든 플레이어 조회
    const result = await client.query(`
      SELECT DISTINCT 
        sol.name,
        sol.class,
        sol.score
      FROM (
        -- 전체 리그에서 플레이어 조회
        SELECT DISTINCT name, '전체' as class, score
        FROM solare_overall_league
        
        UNION
        
        -- 클래스별 리그에서 플레이어 조회  
        SELECT DISTINCT name, class, score
        FROM solare_class_league
      ) sol
      ORDER BY sol.score DESC, sol.name ASC
    `)

    // 플레이어명별로 그룹핑하여 클래스 정보 정리
    const playersMap = new Map()
    
    result.rows.forEach(row => {
      const playerName = row.name
      // 빈 이름 필터링
      if (!playerName || !playerName.trim()) return
      
      if (!playersMap.has(playerName)) {
        playersMap.set(playerName, {
          name: playerName,
          classes: [],
          maxScore: 0
        })
      }
      
      const player = playersMap.get(playerName)
      if (row.class !== '전체' && row.class && row.class.trim()) {
        // 중복 클래스 방지
        if (!player.classes.includes(row.class)) {
          player.classes.push(row.class)
        }
      }
      player.maxScore = Math.max(player.maxScore, row.score || 0)
    })

    // 배열로 변환하고 점수순 정렬
    const players = Array.from(playersMap.values())
      .sort((a, b) => b.maxScore - a.maxScore)

    return NextResponse.json(players)
  } catch (err) {
    console.error('솔라레 플레이어 목록 조회 오류:', err)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  } finally {
    client.release()
  }
}

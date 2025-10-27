import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const className = searchParams.get('class')
    
    if (!className) {
      return NextResponse.json({ error: '클래스명이 필요합니다.' }, { status: 400 })
    }

    // 해당 클래스의 데이터만 가져오기 (클래스별 랭킹 테이블에서)
    const classData = await db.query(`
      SELECT 
        name,
        subclass,
        class,
        wins,
        draws,
        losses,
        score
      FROM solare_class_league 
      WHERE class = $1
      ORDER BY score DESC, wins DESC, draws DESC
    `, [className])

    if (classData.rows.length === 0) {
      return NextResponse.json({
        classStats: {
          totalPlayers: 0,
          avgScore: 0,
          avgWinRate: 0,
          subclassDistribution: []
        },
        tierDistribution: [],
        classDistribution: []
      })
    }

    const players = classData.rows
    const totalPlayers = players.length
    
    // 평균 점수 계산
    const totalScore = players.reduce((sum, player) => sum + player.score, 0)
    const avgScore = Math.round(totalScore / totalPlayers)
    
    // 평균 승률 계산 (각 플레이어의 개별 승률을 평균)
    const playersWithGames = players.filter(player => player.wins + player.draws + player.losses > 0)
    const avgWinRate = playersWithGames.length > 0 
      ? Math.round(playersWithGames.reduce((sum, player) => {
          const totalGames = player.wins + player.draws + player.losses
          const winRate = (player.wins / totalGames) * 100
          return sum + winRate
        }, 0) / playersWithGames.length)
      : 0
    
    // 전승/각성 분포 계산
    const subclassDistribution = players.reduce((acc: any[], player) => {
      const existing = acc.find(item => item.subclass === player.subclass)
      if (existing) {
        existing.count++
      } else {
        acc.push({
          subclass: player.subclass,
          count: 1,
          percentage: 0
        })
      }
      return acc
    }, [])
    
    // 백분율 계산
    subclassDistribution.forEach(item => {
      item.percentage = Math.round((item.count / totalPlayers) * 100)
    })
    
    // 개수 기준으로 내림차순 정렬 (가장 많은 것이 첫 번째)
    subclassDistribution.sort((a, b) => b.count - a.count)
    
    // 티어별 분포 계산 (전체 통계와 동일한 기준 사용)
    const tierDistribution = players.reduce((acc: any[], player) => {
      let tier = '언랭크'
      if (player.score >= 2401) tier = '솔라레'
      else if (player.score >= 2101) tier = '영광의 창'
      else if (player.score >= 1801) tier = '여명의 창'
      else if (player.score >= 1501) tier = '불꽃의 창'
      else if (player.score >= 1201) tier = '노을의 창'
      else if (player.score >= 801) tier = '숙련된 병사'
      else if (player.score >= 401) tier = '견습 병사'
      
      const existing = acc.find(item => item.tier === tier)
      if (existing) {
        existing.count++
      } else {
        acc.push({
          tier,
          count: 1,
          percentage: 0
        })
      }
      return acc
    }, [])
    
    // 티어별 백분율 계산
    tierDistribution.forEach(item => {
      item.percentage = Math.round((item.count / totalPlayers) * 100)
    })
    
    // 개수 기준으로 내림차순 정렬 (가장 많은 것이 첫 번째)
    tierDistribution.sort((a, b) => b.count - a.count)

    return NextResponse.json({
      classStats: {
        totalPlayers,
        avgScore,
        avgWinRate,
        subclassDistribution
      },
      tierDistribution,
      classDistribution: [{
        class: className,
        count: totalPlayers,
        percentage: 100
      }]
    })

  } catch (error) {
    console.error('클래스별 통계 조회 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

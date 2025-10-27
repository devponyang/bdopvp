import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  const client = await db.connect()
  try {
    // 클래스별 분포 통계
    const classDistribution = await client.query(`
      SELECT 
        class,
        COUNT(*) as count,
        ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER()::numeric, 1) as percentage
      FROM solare_overall_league 
      GROUP BY class 
      ORDER BY count DESC
    `)

    // 전승/각성별 분포 통계
    const subclassDistribution = await client.query(`
      SELECT 
        COALESCE(subclass, '일반') as subclass,
        COUNT(*) as count,
        ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER()::numeric, 1) as percentage
      FROM solare_overall_league 
      GROUP BY subclass 
      ORDER BY count DESC
    `)

    // 티어별 분포 통계
    const tierDistribution = await client.query(`
      WITH tier_data AS (
        SELECT 
          CASE 
            WHEN score >= 2401 THEN '솔라레'
            WHEN score >= 2101 THEN '영광의 창'
            WHEN score >= 1801 THEN '여명의 창'
            WHEN score >= 1501 THEN '불꽃의 창'
            WHEN score >= 1201 THEN '노을의 창'
            WHEN score >= 801 THEN '숙련된 병사'
            WHEN score >= 401 THEN '견습 병사'
            ELSE '언랭크'
          END as tier
        FROM solare_overall_league
      ),
      tier_counts AS (
        SELECT 
          tier,
          COUNT(*) as count
        FROM tier_data
        GROUP BY tier
      )
      SELECT 
        tier,
        count,
        ROUND(count * 100.0 / SUM(count) OVER()::numeric, 1) as percentage
      FROM tier_counts
      ORDER BY count DESC
    `)

    // 승률별 분포 통계
    const winRateDistribution = await client.query(`
      WITH winrate_data AS (
        SELECT 
          CASE 
            WHEN ROUND((wins::float / (wins + draws + losses)) * 100) >= 80 THEN '80% 이상'
            WHEN ROUND((wins::float / (wins + draws + losses)) * 100) >= 70 THEN '70-79%'
            WHEN ROUND((wins::float / (wins + draws + losses)) * 100) >= 60 THEN '60-69%'
            WHEN ROUND((wins::float / (wins + draws + losses)) * 100) >= 50 THEN '50-59%'
            ELSE '50% 미만'
          END as win_rate_range
        FROM solare_overall_league 
        WHERE wins + draws + losses > 0
      ),
      winrate_counts AS (
        SELECT 
          win_rate_range,
          COUNT(*) as count
        FROM winrate_data
        GROUP BY win_rate_range
      )
      SELECT 
        win_rate_range,
        count,
        ROUND(count * 100.0 / SUM(count) OVER()::numeric, 1) as percentage
      FROM winrate_counts
      ORDER BY 
        CASE win_rate_range
          WHEN '80% 이상' THEN 1
          WHEN '70-79%' THEN 2
          WHEN '60-69%' THEN 3
          WHEN '50-59%' THEN 4
          WHEN '50% 미만' THEN 5
        END
    `)

    // 클래스별 평균 점수
    const classAverageScore = await client.query(`
      SELECT 
        class,
        ROUND(AVG(score)::numeric, 1) as avg_score,
        ROUND(AVG((wins::float / (wins + draws + losses)) * 100)::numeric, 1) as avg_win_rate
      FROM solare_overall_league 
      WHERE wins + draws + losses > 0
      GROUP BY class 
      ORDER BY avg_score DESC
    `)

    // 전체 통계 요약
    const totalStats = await client.query(`
      SELECT 
        COUNT(*) as total_players,
        ROUND(AVG(score)::numeric, 1) as avg_score,
        ROUND(AVG((wins::float / (wins + draws + losses)) * 100)::numeric, 1) as avg_win_rate,
        MAX(score) as max_score,
        MIN(score) as min_score
      FROM solare_overall_league 
      WHERE wins + draws + losses > 0
    `)

    // 클래스별 전승/각성 분포 통계
    const classSubclassDistribution = await client.query(`
      SELECT 
        class,
        COALESCE(subclass, '일반') as subclass,
        COUNT(*) as count,
        ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(PARTITION BY class)::numeric, 1) as percentage
      FROM solare_overall_league 
      GROUP BY class, subclass 
      ORDER BY class, count DESC
    `)

    return NextResponse.json({
      classDistribution: classDistribution.rows,
      subclassDistribution: subclassDistribution.rows,
      classSubclassDistribution: classSubclassDistribution.rows,
      tierDistribution: tierDistribution.rows,
      winRateDistribution: winRateDistribution.rows,
      classAverageScore: classAverageScore.rows,
      totalStats: totalStats.rows[0]
    })
  } catch (err) {
    console.error('[solare-league statistics GET]', err)
    return new NextResponse('서버 오류', { status: 500 })
  } finally {
    client.release()
  }
}

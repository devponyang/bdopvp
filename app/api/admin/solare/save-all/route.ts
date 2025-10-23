import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

interface Entry {
  name: string
  subclass: string
  class: string
  wins: number
  draws: number
  losses: number
  score: number
}

export async function POST(req: NextRequest) {
  const { overall, classData, date }: { overall: Entry[]; classData: Record<string, Entry[]>; date?: string } =
    await req.json()

  const targetDate = date || new Date().toISOString().split('T')[0]
  const client = await db.connect()

  try {
    await client.query('BEGIN')
    
    // 해당 날짜의 기존 데이터 삭제
    await client.query('DELETE FROM solare_overall_league_history WHERE snapshot_date = $1', [targetDate])
    await client.query('DELETE FROM solare_class_league_history WHERE snapshot_date = $1', [targetDate])

    // 전체 랭킹 히스토리 저장 (중복 제거)
    const uniqueOverall = new Map()
    overall.forEach(entry => {
      const key = `${entry.name}-${entry.class}`
      if (!uniqueOverall.has(key) || uniqueOverall.get(key).score < entry.score) {
        uniqueOverall.set(key, entry)
      }
    })
    
    const sortedOverall = Array.from(uniqueOverall.values()).sort((a, b) => b.score - a.score)
    
    for (let i = 0; i < sortedOverall.length; i++) {
      const entry = sortedOverall[i]
      await client.query(
        `
        INSERT INTO solare_overall_league_history (snapshot_date, name, class, classtype, wins, draws, lose, score, class_rank)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `,
        [targetDate, entry.name, entry.class, entry.subclass, entry.wins, entry.draws, entry.losses, entry.score, i + 1]
      )
    }

    // 클래스별 랭킹 히스토리 저장 (중복 제거)
    const uniqueClassData: Record<string, Entry[]> = {}
    for (const [className, entries] of Object.entries(classData)) {
      const uniqueEntries = new Map()
      entries.forEach(entry => {
        const key = `${entry.name}-${entry.class}`
        if (!uniqueEntries.has(key) || uniqueEntries.get(key).score < entry.score) {
          uniqueEntries.set(key, entry)
        }
      })
      uniqueClassData[className] = Array.from(uniqueEntries.values()).sort((a, b) => b.score - a.score)
    }
    
    for (const [, entries] of Object.entries(uniqueClassData)) {
      for (let i = 0; i < entries.length; i++) {
        const entry = entries[i]
        await client.query(
          `
          INSERT INTO solare_class_league_history (snapshot_date, name, class, classtype, wins, draws, lose, score, class_rank)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `,
          [targetDate, entry.name, entry.class, entry.subclass, entry.wins, entry.draws, entry.losses, entry.score, i + 1]
        )
      }
    }

    // 오늘 날짜인 경우에만 현재 테이블도 업데이트
    const today = new Date().toISOString().split('T')[0]
    if (targetDate === today) {
      await client.query('DELETE FROM solare_overall_league')
      await client.query('DELETE FROM solare_class_league')

      // 전체 랭킹 현재 테이블 업데이트 (중복 제거된 데이터 사용)
      for (let i = 0; i < sortedOverall.length; i++) {
        const entry = sortedOverall[i]
        await client.query(
          `
          INSERT INTO solare_overall_league (name, subclass, class, wins, draws, losses, score)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
        `,
          [entry.name, entry.subclass, entry.class, entry.wins, entry.draws, entry.losses, entry.score]
        )
      }

      // 클래스별 랭킹 현재 테이블 업데이트 (중복 제거된 데이터 사용)
      for (const [, entries] of Object.entries(uniqueClassData)) {
        for (let i = 0; i < entries.length; i++) {
          const entry = entries[i]
          await client.query(
            `
            INSERT INTO solare_class_league (name, subclass, class, wins, draws, losses, score)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
          `,
            [entry.name, entry.subclass, entry.class, entry.wins, entry.draws, entry.losses, entry.score]
          )
        }
      }
    }

    await client.query('COMMIT')
    return NextResponse.json({ success: true })
  } catch (err) {
    await client.query('ROLLBACK')
    console.error('❌ save-all error:', err)
    return new NextResponse('Internal Server Error', { status: 500 })
  } finally {
    client.release()
  }
}

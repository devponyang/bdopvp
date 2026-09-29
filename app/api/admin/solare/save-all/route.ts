import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { fetchGuildNames } from '@/lib/utils/guild-lookup'

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

  const allNames = [
    ...overall.map(e => e.name),
    ...Object.values(classData).flat().map(e => e.name),
  ]
  const uniqueNames = [...new Set(allNames)]
  const guildMap = await fetchGuildNames(uniqueNames)

  const client = await db.connect()

  try {
    await client.query('BEGIN')

    // 클래스별 랭킹 중복 제거 후 정렬
    const uniqueClassData: Record<string, Entry[]> = {}
    for (const [className, entries] of Object.entries(classData)) {
      const map = new Map<string, Entry>()
      entries.forEach(entry => {
        const key = `${entry.name}-${entry.class}`
        if (!map.has(key) || map.get(key)!.score < entry.score) map.set(key, entry)
      })
      uniqueClassData[className] = Array.from(map.values()).sort((a, b) => b.score - a.score)
    }

    const hasClass = Object.keys(uniqueClassData).length > 0

    if (hasClass) {
      // 저장하는 클래스만 교체 (다른 클래스 데이터 유지)
      const classNames = Object.keys(uniqueClassData)
      await client.query(
        'DELETE FROM solare_class_league WHERE class = ANY($1)',
        [classNames]
      )
      await client.query(
        'DELETE FROM solare_class_league_history WHERE snapshot_date = $1 AND class = ANY($2)',
        [targetDate, classNames]
      )

      for (const [, entries] of Object.entries(uniqueClassData)) {
        for (let i = 0; i < entries.length; i++) {
          const e = entries[i]
          await client.query(
            `INSERT INTO solare_class_league (name, subclass, class, wins, draws, losses, score, guild_name)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [e.name, e.subclass, e.class, e.wins, e.draws, e.losses, e.score, guildMap[e.name] ?? null]
          )
          await client.query(
            `INSERT INTO solare_class_league_history
              (snapshot_date, name, class, classtype, wins, draws, lose, score, class_rank, guild_name)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
            [targetDate, e.name, e.class, e.subclass, e.wins, e.draws, e.losses, e.score, i + 1, guildMap[e.name] ?? null]
          )
        }
      }

      // overall을 class_league 전체로 재조립 (점수 순)
      await client.query('DELETE FROM solare_overall_league')
      await client.query(`
        INSERT INTO solare_overall_league (name, subclass, class, wins, draws, losses, score, guild_name)
        SELECT name, subclass, class, wins, draws, losses, score, guild_name
        FROM solare_class_league
        ORDER BY score DESC
      `)

      // overall 히스토리도 class_league_history 기준으로 재조립
      await client.query(
        'DELETE FROM solare_overall_league_history WHERE snapshot_date = $1',
        [targetDate]
      )
      await client.query(`
        INSERT INTO solare_overall_league_history
          (snapshot_date, name, class, classtype, wins, draws, lose, score, class_rank, guild_name)
        SELECT $1, name, class, classtype, wins, draws, lose, score,
          ROW_NUMBER() OVER (ORDER BY score DESC),
          guild_name
        FROM solare_class_league_history
        WHERE snapshot_date = $1
        ORDER BY score DESC
      `, [targetDate])

    } else {
      // overall 탭에서 직접 저장한 경우
      const uniqueOverall = new Map<string, Entry>()
      overall.forEach(entry => {
        const key = `${entry.name}-${entry.class}`
        if (!uniqueOverall.has(key) || uniqueOverall.get(key)!.score < entry.score) {
          uniqueOverall.set(key, entry)
        }
      })
      const sortedOverall = Array.from(uniqueOverall.values()).sort((a, b) => b.score - a.score)

      if (sortedOverall.length > 0) {
        await client.query('DELETE FROM solare_overall_league_history WHERE snapshot_date = $1', [targetDate])
        for (let i = 0; i < sortedOverall.length; i++) {
          const e = sortedOverall[i]
          await client.query(
            `INSERT INTO solare_overall_league_history
              (snapshot_date, name, class, classtype, wins, draws, lose, score, class_rank, guild_name)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
            [targetDate, e.name, e.class, e.subclass, e.wins, e.draws, e.losses, e.score, i + 1, guildMap[e.name] ?? null]
          )
        }
        await client.query('DELETE FROM solare_overall_league')
        for (let i = 0; i < sortedOverall.length; i++) {
          const e = sortedOverall[i]
          await client.query(
            `INSERT INTO solare_overall_league (name, subclass, class, wins, draws, losses, score, guild_name)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [e.name, e.subclass, e.class, e.wins, e.draws, e.losses, e.score, guildMap[e.name] ?? null]
          )
        }
      }
    }

    await client.query('COMMIT')
    return NextResponse.json({ success: true })
  } catch (err) {
    await client.query('ROLLBACK')
    console.error('❌ save-all error:', err)
    return new NextResponse(err instanceof Error ? err.message : 'Internal Server Error', { status: 500 })
  } finally {
    client.release()
  }
}

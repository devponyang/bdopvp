import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminAuth } from '@/lib/auth'

export async function GET() {
  const client = await db.connect()
  try {
    const result = await client.query(`
      SELECT 
        p.*,
        t.tournament_name
      FROM master_class_participants p
      LEFT JOIN master_class_tournaments t ON p.tournament_id = t.id
      ORDER BY p.registration_date DESC
    `)
    
    return NextResponse.json(result.rows)
  } catch (err) {
    console.error('마스터 클래스 참가자 목록 조회 오류:', err)
    return new NextResponse('Internal Server Error', { status: 500 })
  } finally {
    client.release()
  }
}

export async function POST(req: NextRequest) {
  if (!verifyAdminAuth(req)) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const { 
    tournamentId,
    playerName, 
    className, 
    subclass, 
    gearScore, 
    attackPower, 
    defensePower 
  } = await req.json()
  
  const totalApDp = attackPower + defensePower
  // 자격 요건을 무시하고 항상 자격 있음으로 설정 (관리자가 직접 추가한 경우)
  const isQualified = true
  
  const client = await db.connect()

  try {
    const result = await client.query(`
      INSERT INTO master_class_participants (
        tournament_id, player_name, class_name, subclass, gear_score,
        attack_power, defense_power, total_ap_dp, is_qualified
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `, [
      tournamentId, playerName, className, subclass, gearScore,
      attackPower, defensePower, totalApDp, isQualified
    ])
    
    return NextResponse.json(result.rows[0])
  } catch (err) {
    console.error('마스터 클래스 참가자 등록 오류:', err)
    return new NextResponse('Internal Server Error', { status: 500 })
  } finally {
    client.release()
  }
}

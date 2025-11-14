'use server'

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const { teamName, editPassword } = (await req.json()) as {
      teamName?: string
      editPassword?: string
    }

    if (!teamName || !editPassword) {
      return NextResponse.json({ error: '팀명과 비밀번호를 입력해주세요.' }, { status: 400 })
    }

    const result = await db.query(
      `
        SELECT
          id,
          team_name,
          leader_family_name,
          leader_discord,
          team_members,
          notes
        FROM solare_tournament_applications
        WHERE team_name = $1 AND edit_password = $2
        LIMIT 1
      `,
      [teamName.trim(), editPassword.trim()]
    )

    if (result.rowCount === 0) {
      return NextResponse.json({ error: '신청서를 찾을 수 없습니다.' }, { status: 404 })
    }

    const app = result.rows[0]

    return NextResponse.json({
      id: app.id,
      teamName: app.team_name,
      leaderFamilyName: app.leader_family_name,
      leaderDiscord: app.leader_discord,
      notes: app.notes,
      members: Array.isArray(app.team_members)
        ? app.team_members
        : JSON.parse(app.team_members as unknown as string)
    })
  } catch (error) {
    console.error('solare application lookup error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}



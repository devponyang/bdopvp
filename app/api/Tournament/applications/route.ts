'use server'

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { requireAdminAuth } from '@/lib/auth'

interface MemberPayload {
  familyName: string
  className: string
  score?: number
}

interface ApplicationPayload {
  teamName: string
  leaderFamilyName: string
  leaderDiscord: string
  editPassword?: string
  members: MemberPayload[]
  substitute?: MemberPayload | null
  notes?: string
  agreeRules?: boolean
}

function sanitizeMember(member: MemberPayload, index: number): MemberPayload {
  const familyName = member.familyName?.trim()
  const className = member.className?.trim()

  if (!familyName || !className) {
    throw new Error(`팀원 ${index + 1} 정보를 모두 입력해주세요.`)
  }

  const score =
    typeof member.score === 'number' && !Number.isNaN(member.score)
      ? member.score
      : undefined

  return {
    familyName,
    className,
    score
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ApplicationPayload

    const teamName = body.teamName?.trim()
    const leaderFamilyName = body.leaderFamilyName?.trim()
    const leaderDiscord = body.leaderDiscord?.trim()
    const editPassword = body.editPassword?.trim() || ""
    const notes = body.notes?.trim() || null
    const agreeRules = Boolean(body.agreeRules)

    if (!teamName) {
      return NextResponse.json({ error: '팀명을 입력해주세요.' }, { status: 400 })
    }
    if (teamName.length > 6) {
      return NextResponse.json({ error: '팀명은 최대 6글자까지 입력 가능합니다.' }, { status: 400 })
    }
    if (!leaderFamilyName) {
      return NextResponse.json({ error: '대표자 가문명을 입력해주세요.' }, { status: 400 })
    }
    if (!leaderDiscord) {
      return NextResponse.json({ error: '대표자의 디스코드 ID를 입력해주세요.' }, { status: 400 })
    }
    if (!Array.isArray(body.members) || body.members.length !== 3) {
      return NextResponse.json({ error: '팀원 3명의 정보를 입력해주세요.' }, { status: 400 })
    }
    if (!editPassword) {
      return NextResponse.json({ error: '수정용 비밀번호를 입력해주세요.' }, { status: 400 })
    }
    if (!agreeRules) {
      return NextResponse.json({ error: '대회 규정 동의가 필요합니다.' }, { status: 400 })
    }

    const members = body.members.map(sanitizeMember)
    const substitute = body.substitute
      ? sanitizeMember(body.substitute, 3)
      : null

    const insertQuery = `
      INSERT INTO solare_tournament_applications (
        team_name,
        leader_family_name,
        leader_character_name,
        leader_discord,
        team_members,
        substitute_member,
        notes,
        agree_rules,
        edit_password
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id
    `

    const result = await db.query(insertQuery, [
      teamName,
      leaderFamilyName,
      leaderFamilyName,
      leaderDiscord,
      JSON.stringify(members),
      substitute ? JSON.stringify(substitute) : null,
      notes,
      agreeRules,
      editPassword
    ])

    return NextResponse.json(
      { success: true, id: result.rows[0].id },
      { status: 201 }
    )
  } catch (error) {
    console.error('solare application POST error:', error)
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const authError = requireAdminAuth(req)
  if (authError) return authError

  try {
    const result = await db.query(`
      SELECT
        id,
        team_name,
        leader_family_name,
        leader_character_name,
        leader_discord,
        team_members,
        substitute_member,
        notes,
        agree_rules,
        status,
        edit_password,
        created_at
      FROM solare_tournament_applications
      ORDER BY created_at DESC
    `)

    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('solare application GET error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}


'use server'

import { NextRequest, NextResponse } from 'next/server'
import { requireAdminAuth } from '@/lib/auth'
import { db } from '@/lib/db'

interface MemberPayload {
  familyName: string
  className: string
  score?: number
}

interface UpdatePayload {
  status?: string
  teamName?: string
  leaderFamilyName?: string
  leaderDiscord?: string
  members?: MemberPayload[]
  notes?: string | null
  editPassword?: string
}

function parseId(raw: string): number | null {
  const id = Number(raw)
  return Number.isFinite(id) && id > 0 ? id : null
}

const ALLOWED_STATUSES = new Set(['pending', 'approved', 'rejected', 'waitlist'])

function sanitizeMember(member: MemberPayload, index: number): MemberPayload {
  const familyName = member.familyName?.trim()
  const className = member.className?.trim()
  const score =
    typeof member.score === 'number' && !Number.isNaN(member.score)
      ? member.score
      : undefined

  if (!familyName || !className) {
    throw new Error(`팀원 ${index + 1} 정보를 모두 입력해주세요.`)
  }

  return { familyName, className, score }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = requireAdminAuth(req)
  if (authError) return authError

  const { id: rawId } = await params
  const id = parseId(rawId)
  if (!id) {
    return NextResponse.json({ error: '잘못된 ID 입니다.' }, { status: 400 })
  }

  try {
    const body = (await req.json()) as UpdatePayload

    const updates: string[] = []
    const values: unknown[] = []

    if (body.status !== undefined) {
      if (typeof body.status !== 'string' || !ALLOWED_STATUSES.has(body.status)) {
        return NextResponse.json({ error: '허용되지 않은 상태 값입니다.' }, { status: 400 })
      }
      updates.push(`status = $${updates.length + 1}`)
      values.push(body.status)
    }

    if (body.teamName !== undefined) {
      const teamName = body.teamName.trim()
      if (!teamName) {
        return NextResponse.json({ error: '팀명을 입력해주세요.' }, { status: 400 })
      }
      if (teamName.length > 6) {
        return NextResponse.json({ error: '팀명은 최대 6글자까지 입력 가능합니다.' }, { status: 400 })
      }
      updates.push(`team_name = $${updates.length + 1}`)
      values.push(teamName)
    }

    if (body.leaderFamilyName !== undefined) {
      const name = body.leaderFamilyName.trim()
      if (!name) {
        return NextResponse.json({ error: '대표자 가문명을 입력해주세요.' }, { status: 400 })
      }
      updates.push(`leader_family_name = $${updates.length + 1}`)
      updates.push(`leader_character_name = $${updates.length + 1}`)
      values.push(name)
    }

    if (body.leaderDiscord !== undefined) {
      const discord = body.leaderDiscord.trim()
      if (!discord) {
        return NextResponse.json({ error: '대표자 디스코드 ID를 입력해주세요.' }, { status: 400 })
      }
      updates.push(`leader_discord = $${updates.length + 1}`)
      values.push(discord)
    }

    if (body.members !== undefined) {
      if (!Array.isArray(body.members) || body.members.length !== 3) {
        return NextResponse.json({ error: '팀원 3명의 정보를 입력해주세요.' }, { status: 400 })
      }
      const members = body.members.map(sanitizeMember)
      updates.push(`team_members = $${updates.length + 1}`)
      values.push(JSON.stringify(members))
    }

    if (body.notes !== undefined) {
      const notes = body.notes ? body.notes.trim() : null
      updates.push(`notes = $${updates.length + 1}`)
      values.push(notes)
    }

    if (body.editPassword !== undefined) {
      const editPassword = body.editPassword.trim()
      updates.push(`edit_password = $${updates.length + 1}`)
      values.push(editPassword)
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: '변경할 항목이 없습니다.' }, { status: 400 })
    }

    values.push(id)

    const result = await db.query(
      `
        UPDATE solare_tournament_applications
        SET ${updates.join(', ')}
        WHERE id = $${values.length}
        RETURNING
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
      `,
      values
    )

    if (result.rowCount === 0) {
      return NextResponse.json({ error: '신청서를 찾을 수 없습니다.' }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('solare application PATCH error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = requireAdminAuth(req)
  if (authError) return authError

  const { id: rawId } = await params
  const id = parseId(rawId)
  if (!id) {
    return NextResponse.json({ error: '잘못된 ID 입니다.' }, { status: 400 })
  }

  try {
    const result = await db.query(
      `DELETE FROM solare_tournament_applications WHERE id = $1`,
      [id]
    )

    if (result.rowCount === 0) {
      return NextResponse.json({ error: '이미 삭제되었거나 존재하지 않습니다.' }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('solare application DELETE error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}


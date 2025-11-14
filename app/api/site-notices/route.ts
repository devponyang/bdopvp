'use server'

import { NextRequest, NextResponse } from 'next/server'
import { requireAdminAuth, verifyAdminAuth } from '@/lib/auth'
import {
  createSiteNotice,
  getSiteNotices
} from '@/lib/queries/site-notices'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const limitParam = req.nextUrl.searchParams.get('limit')
    const includeAll = req.nextUrl.searchParams.get('includeAll') === 'true'
    let limit = 5

    if (limitParam) {
      const parsed = Number(limitParam)
      if (!Number.isNaN(parsed) && parsed > 0) {
        limit = Math.min(parsed, 20)
      }
    }

    let notices

    if (includeAll && verifyAdminAuth(req)) {
      const { rows } = await db.query(
        `
          SELECT id, title, content, is_published, created_at, updated_at
          FROM site_notices
          ORDER BY created_at DESC
          LIMIT $1
        `,
        [limit]
      )
      notices = rows
    } else {
      notices = await getSiteNotices(limit)
    }

    return NextResponse.json(notices)
  } catch (error) {
    console.error('site-notices GET 실패:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const authError = requireAdminAuth(req)
  if (authError) return authError

  try {
    const { title, content, isPublished = true } = await req.json()

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json({ error: '제목을 입력해주세요.' }, { status: 400 })
    }

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json({ error: '내용을 입력해주세요.' }, { status: 400 })
    }

    const notice = await createSiteNotice({
      title: title.trim(),
      content: content.trim(),
      isPublished: Boolean(isPublished)
    })

    return NextResponse.json(notice, { status: 201 })
  } catch (error) {
    console.error('site-notices POST 실패:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}


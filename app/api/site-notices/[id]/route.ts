'use server'

import { NextRequest, NextResponse } from 'next/server'
import { requireAdminAuth } from '@/lib/auth'
import {
  deleteSiteNotice,
  getSiteNoticeById,
  updateSiteNotice
} from '@/lib/queries/site-notices'

function parseId(rawId: string): number | null {
  const id = Number(rawId)
  if (Number.isNaN(id) || id <= 0) return null
  return id
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: rawId } = await params
  const id = parseId(rawId)
  if (!id) {
    return NextResponse.json({ error: '잘못된 ID 입니다.' }, { status: 400 })
  }

  try {
    const notice = await getSiteNoticeById(id)
    if (!notice) {
      return NextResponse.json({ error: '공지사항을 찾을 수 없습니다.' }, { status: 404 })
    }
    return NextResponse.json(notice)
  } catch (error) {
    console.error('site-notices/:id GET 실패:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
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
    const { title, content, isPublished } = await req.json()

    const updated = await updateSiteNotice(id, {
      title: typeof title === 'string' ? title.trim() : undefined,
      content: typeof content === 'string' ? content.trim() : undefined,
      isPublished: typeof isPublished === 'boolean' ? isPublished : undefined
    })

    if (!updated) {
      return NextResponse.json({ error: '공지사항을 찾을 수 없습니다.' }, { status: 404 })
    }

    return NextResponse.json(updated)
  } catch (error) {
    console.error('site-notices/:id PATCH 실패:', error)
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
    const existing = await getSiteNoticeById(id)
    if (!existing) {
      return NextResponse.json({ error: '이미 삭제되었거나 존재하지 않습니다.' }, { status: 404 })
    }

    await deleteSiteNotice(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('site-notices/:id DELETE 실패:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}


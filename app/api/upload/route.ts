import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { requireAdminAuth } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    // 관리자 인증 확인
    const authError = requireAdminAuth(req)
    if (authError) return authError

    const data = await req.formData()
    const file: File | null = data.get('file') as unknown as File

    if (!file) {
      return NextResponse.json({ error: '파일이 선택되지 않았습니다' }, { status: 400 })
    }

    // 파일 타입 검증
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: '이미지 파일만 업로드 가능합니다' }, { status: 400 })
    }

    // 파일 크기 검증 (5MB 제한)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: '파일 크기는 5MB를 초과할 수 없습니다' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // 파일명 생성 (타임스탬프 + 원본명)
    const timestamp = Date.now()
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_') // 특수문자 제거
    const filename = `${timestamp}_${originalName}`

    // guild-icons 디렉토리 사용 (이미 존재하고 정상 작동)
    const guildIconsDir = join(process.cwd(), 'public', 'guild-icons')
    
    // 파일 저장
    const path = join(guildIconsDir, filename)
    await writeFile(path, buffer)

    // 업로드된 파일 URL 반환
    const fileUrl = `/guild-icons/${filename}`

    return NextResponse.json({ 
      success: true, 
      url: fileUrl,
      filename: filename,
      size: file.size,
      type: file.type
    })

  } catch (error) {
    console.error('File upload error:', error)
    return NextResponse.json(
      { error: '파일 업로드 중 오류가 발생했습니다' },
      { status: 500 }
    )
  }
}
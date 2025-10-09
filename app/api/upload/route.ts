import { NextRequest, NextResponse } from 'next/server'
import { writeFile, access } from 'fs/promises'
import { join } from 'path'
import { requireAdminAuth } from '@/lib/auth'

// App Router에서 body parser 크기 제한 설정
export const runtime = 'nodejs'
export const maxDuration = 30

export async function POST(req: NextRequest) {
  try {
    // 관리자 인증 확인
    const authError = requireAdminAuth(req)
    if (authError) return authError

    // Content-Type 확인
    const contentType = req.headers.get('content-type')
    if (!contentType || !contentType.includes('multipart/form-data')) {
      return NextResponse.json({ error: '잘못된 요청 형식입니다' }, { status: 400 })
    }

    // Content-Length 확인 (30MB 제한)
    const contentLength = req.headers.get('content-length')
    if (contentLength && parseInt(contentLength) > 30 * 1024 * 1024) {
      return NextResponse.json({ error: '파일 크기가 너무 큽니다 (30MB 제한)' }, { status: 413 })
    }

    // formData 파싱 (에러 핸들링 추가)
    let data: FormData
    try {
      data = await req.formData()
    } catch (error: any) {
      console.error('❌ formData 파싱 실패:', error)
      // Next.js의 body size 제한 초과 에러 감지
      if (error.message?.includes('body') || error.message?.includes('size') || error.message?.includes('limit')) {
        return NextResponse.json({ 
          error: '파일 크기가 너무 큽니다. Next.js body size 제한을 초과했습니다.' 
        }, { status: 413 })
      }
      return NextResponse.json({ 
        error: '파일 데이터를 읽는 중 오류가 발생했습니다.' 
      }, { status: 400 })
    }
    const file: File | null = data.get('file') as unknown as File
    const folderType: string | null = data.get('folderType') as string || 'guild-icons'

    if (!file) {
      return NextResponse.json({ error: '파일이 선택되지 않았습니다' }, { status: 400 })
    }

    // 폴더 타입 검증
    const allowedFolders = ['guild-icons', 'solare-images', 'banner-images', 'guild-promotion-images', 'tip-images', 'alliance-icons']
    if (!allowedFolders.includes(folderType)) {
      return NextResponse.json({ error: '유효하지 않은 폴더 타입입니다' }, { status: 400 })
    }

    // 파일 타입 검증 (이미지 및 비디오 파일 허용)
    const allowedTypes = ['image/', 'video/']
    if (!allowedTypes.some(type => file.type.startsWith(type))) {
      return NextResponse.json({ error: '이미지 또는 비디오 파일만 업로드 가능합니다' }, { status: 400 })
    }

    // 파일 크기 검증 (30MB 제한)
    const maxSize = 30 * 1024 * 1024 // 30MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: '파일 크기는 30MB를 초과할 수 없습니다' }, { status: 400 })
    }

    // 스트리밍 방식으로 파일 읽기 (대용량 파일 처리)
    let buffer: Buffer
    try {
      const bytes = await file.arrayBuffer()
      buffer = Buffer.from(bytes)
    } catch (error) {
      console.error('파일 읽기 오류:', error)
      return NextResponse.json({ error: '파일을 읽는 중 오류가 발생했습니다' }, { status: 500 })
    }

    // 파일명 생성 (타임스탬프 + 원본명)
    const timestamp = Date.now()
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_') // 특수문자 제거
    const filename = `${timestamp}_${originalName}`

    // 폴더 타입에 따른 디렉토리 선택
    const targetDir = join(process.cwd(), 'public', folderType)
    
    // 파일 저장
    const path = join(targetDir, filename)
    await writeFile(path, buffer)

    // 파일이 제대로 저장되었는지 확인
    try {
      await access(path)
    } catch (error) {
      console.error('파일 저장 확인 실패:', error)
      return NextResponse.json({ error: '파일 저장에 실패했습니다' }, { status: 500 })
    }

    // 업로드된 파일 URL 반환 (새로운 이미지 서빙 API 사용)
    const fileUrl = `/api/images/${folderType}/${filename}`

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
import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

// 길드 모집 전용 이미지 업로드 (인증 불필요)
export const runtime = 'nodejs'
export const maxDuration = 30

export async function POST(req: NextRequest) {
  try {
    // Content-Type 확인
    const contentType = req.headers.get('content-type')
    if (!contentType || !contentType.includes('multipart/form-data')) {
      return NextResponse.json({ error: '잘못된 요청 형식입니다' }, { status: 400 })
    }

    // Content-Length 확인 (15MB 제한)
    const contentLength = req.headers.get('content-length')
    if (contentLength && parseInt(contentLength) > 15 * 1024 * 1024) {
      return NextResponse.json({ error: '파일 크기가 너무 큽니다 (15MB 제한)' }, { status: 413 })
    }

    // formData 파싱
    let data: FormData
    try {
      data = await req.formData()
    } catch (error: any) {
      console.error('❌ formData 파싱 실패:', error)
      if (error.message?.includes('body') || error.message?.includes('size') || error.message?.includes('limit')) {
        return NextResponse.json({ 
          error: '파일 크기가 너무 큽니다. 15MB 이하의 파일을 업로드해주세요.' 
        }, { status: 413 })
      }
      return NextResponse.json({ 
        error: '파일 데이터를 읽는 중 오류가 발생했습니다.' 
      }, { status: 400 })
    }

    const file: File | null = data.get('file') as unknown as File

    if (!file) {
      return NextResponse.json({ error: '파일이 선택되지 않았습니다' }, { status: 400 })
    }

    // 파일 타입 검증 (이미지만 허용 - gif, jpg, png)
    const allowedTypes = ['image/gif', 'image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: 'GIF, JPG, PNG, WebP 파일만 업로드 가능합니다' 
      }, { status: 400 })
    }

    // 파일 크기 검증 (15MB 제한)
    const maxSize = 15 * 1024 * 1024 // 15MB
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: '파일 크기는 15MB를 초과할 수 없습니다' 
      }, { status: 400 })
    }

    // 파일 읽기
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

    // guild-promotion-images 디렉토리에 저장
    const targetDir = join(process.cwd(), 'public', 'guild-promotion-images')
    
    // 디렉토리가 없으면 생성
    if (!existsSync(targetDir)) {
      await mkdir(targetDir, { recursive: true })
    }

    // 파일 저장
    const path = join(targetDir, filename)
    await writeFile(path, buffer)

    // 업로드된 파일 URL 반환
    const fileUrl = `/api/images/guild-promotion-images/${filename}`

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


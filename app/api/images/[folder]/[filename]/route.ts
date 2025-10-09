import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ folder: string; filename: string }> }
) {
  try {
    const { folder, filename } = await params
    
    // 허용된 폴더만 접근 가능
    const allowedFolders = ['guild-icons', 'solare-images', 'banner-images', 'guild-promotion-images', 'tip-images', 'alliance-icons']
    if (!allowedFolders.includes(folder)) {
      return new NextResponse('Folder not allowed', { status: 403 })
    }
    
    // 파일 경로 생성
    const filePath = join(process.cwd(), 'public', folder, filename)
    
    // 파일 존재 확인
    if (!existsSync(filePath)) {
      return new NextResponse('File not found', { status: 404 })
    }
    
    // 파일 읽기
    const fileBuffer = await readFile(filePath)
    
    // Content-Type 설정
    const ext = filename.split('.').pop()?.toLowerCase()
    let contentType = 'application/octet-stream'
    
    switch (ext) {
      case 'png':
        contentType = 'image/png'
        break
      case 'jpg':
      case 'jpeg':
        contentType = 'image/jpeg'
        break
      case 'gif':
        contentType = 'image/gif'
        break
      case 'webp':
        contentType = 'image/webp'
        break
      case 'mp4':
        contentType = 'video/mp4'
        break
      case 'webm':
        contentType = 'video/webm'
        break
      case 'ogg':
        contentType = 'video/ogg'
        break
      case 'mov':
        contentType = 'video/quicktime'
        break
      case 'avi':
        contentType = 'video/x-msvideo'
        break
    }
    
    // 응답 헤더 설정
    const headers = new Headers()
    headers.set('Content-Type', contentType)
    headers.set('Cache-Control', 'public, max-age=31536000, immutable')
    
    return new NextResponse(fileBuffer, {
      headers,
    })
    
  } catch (error) {
    console.error('Image serving error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

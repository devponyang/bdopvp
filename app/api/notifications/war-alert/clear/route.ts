import { NextResponse } from 'next/server'

// 캐시 초기화를 위한 전역 변수 (live/route.ts와 공유)
declare global {
  var latestNotification: any
}

export async function POST() {
  try {
    // 캐시 초기화
    global.latestNotification = null

    return NextResponse.json({
      success: true,
      message: '캐시가 초기화되었습니다.'
    })
  } catch (error) {
    console.error('캐시 초기화 오류:', error)
    return NextResponse.json(
      { error: '캐시 초기화에 실패했습니다.' },
      { status: 500 }
    )
  }
}

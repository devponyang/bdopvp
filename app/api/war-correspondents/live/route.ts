import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export const revalidate = 300 // 5분 캐시

export async function GET() {
  const client = await db.connect()
  try {
    // 활성 종군기자 목록 조회
    const correspondentsResult = await client.query(`
      SELECT * FROM war_correspondents 
      WHERE is_active = TRUE 
      ORDER BY created_at ASC
    `)

    const correspondents = correspondentsResult.rows
    
    if (correspondents.length === 0) {
      return NextResponse.json([])
    }

    // 메인페이지 치지직 API에서 현재 라이브 스트리머 목록 가져오기
    let liveStreamers = []
    try {
      const chzzkRes = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/chzzk`, {
        next: { revalidate: 300 }
      })
      if (chzzkRes.ok) {
        liveStreamers = await chzzkRes.json()
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.log('치지직 API 호출 실패, 오프라인 상태로 표시')
      }
    }

    // 종군기자와 라이브 스트리머 매칭
    const formattedCorrespondents = correspondents.map(correspondent => {
      // 종군기자가 현재 라이브 중인지 확인
      const isLive = liveStreamers.some((streamer: any) => 
        streamer.nickname === correspondent.streamer_name || 
        streamer.url === correspondent.chzzk_channel_url
      )

      return {
        id: correspondent.id,
        streamer_name: correspondent.streamer_name,
        description: correspondent.description,
        profile_image_url: correspondent.profile_image_url,
        url: correspondent.chzzk_channel_url,
        isLive: isLive,
        viewerCount: 0
      }
    })

    // 라이브 중인 종군기자를 상단에 표시
    const sortedCorrespondents = formattedCorrespondents.sort((a, b) => {
      if (a.isLive && !b.isLive) return -1
      if (!a.isLive && b.isLive) return 1
      return 0
    })

    return NextResponse.json(sortedCorrespondents)
  } catch (error) {
    console.error('종군기자 정보 조회 오류:', error)
    return NextResponse.json(
      { error: '종군기자 정보를 불러올 수 없습니다.' },
      { status: 500 }
    )
  } finally {
    client.release()
  }
}

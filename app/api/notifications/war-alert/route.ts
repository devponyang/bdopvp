import { NextRequest, NextResponse } from 'next/server'
import { chzzkNotifier } from '@/lib/notifications/chzzk-notifier'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { alliance_name, region, occupied_area, fort_stage, war_type, war_date, tier } = body

    // 필수 필드 검증
    if (!alliance_name || !region || !fort_stage) {
      return NextResponse.json(
        { error: '필수 필드가 누락되었습니다.' },
        { status: 400 }
      )
    }

    const notification = {
      alliance_name,
      region,
      occupied_area: occupied_area || '',
      fort_stage,
      war_type: war_type || '거점전',
      war_date: war_date || new Date().toISOString(),
      tier: tier || '무제한'
    }

    // 알림 전송
    const results = await chzzkNotifier.sendNotification(notification)

    return NextResponse.json({
      success: true,
      message: '알림이 전송되었습니다.',
      results
    })
  } catch (error) {
    console.error('전쟁 알림 API 오류:', error)
    return NextResponse.json(
      { error: '알림 전송에 실패했습니다.' },
      { status: 500 }
    )
  }
}

// OBS 브라우저 소스용 HTML 반환
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const alliance_name = searchParams.get('alliance_name')
    const region = searchParams.get('region')
    const fort_stage = searchParams.get('fort_stage')
    const occupied_area = searchParams.get('occupied_area')
    const war_type = searchParams.get('war_type')
    const tier = searchParams.get('tier')

    if (!alliance_name || !region || !fort_stage) {
      return new Response('필수 파라미터가 누락되었습니다.', { status: 400 })
    }

    const notification = {
      alliance_name,
      region,
      occupied_area: occupied_area || '',
      fort_stage,
      war_type: war_type || '거점전',
      war_date: new Date().toISOString(),
      tier: tier || '무제한'
    }

    const html = chzzkNotifier.generateOBSNotification(notification)
    
    return new Response(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    })
  } catch (error) {
    console.error('OBS 알림 HTML 생성 오류:', error)
    return new Response('알림 생성에 실패했습니다.', { status: 500 })
  }
}


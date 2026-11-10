import { NextResponse } from 'next/server'
export function retiredApi() {
  return NextResponse.json(
    { error: '이전 API는 서비스 재구축으로 종료되었습니다.', code: 'LEGACY_API_RETIRED' },
    { status: 410, headers: { 'Cache-Control': 'no-store' } },
  )
}

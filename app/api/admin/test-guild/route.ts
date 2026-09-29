import { NextResponse } from 'next/server'

export async function GET() {
  const res = await fetch('https://www.korbdo.co.kr/api/a/batch', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ names: ['ㅁㅇㅁㅇ'] }),
  })

  const data = await res.json()
  return NextResponse.json(data)
}

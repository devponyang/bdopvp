import { NextRequest, NextResponse } from 'next/server'
import { VertexAI } from '@google-cloud/vertexai'

export const maxDuration = 60

// Vertex AI 초기화 (내 로컬 컴퓨터의 ADC 자격 증명을 자동으로 감지하여 작동함!)
const vertexAI = new VertexAI({
  project: process.env.GCP_PROJECT_ID || 'project-164b52f0-be13-4d4e-b9b',
  location: process.env.GCP_LOCATION || 'us-central1'
})

const VALID_CLASSES = [
  '워리어', '하사신', '세이지', '레인저', '가디언', '스칼라', '드라카니아',
  '소서러', '노바', '커세어', '란', '자이언트', '매구', '금수랑', '샤이',
  '격투가', '무사', '매화', '미스틱', '발키리', '쿠노이치', '닌자', '다크나이트',
  '위자드', '아처', '우사', '위치', '도사', '데드아이', '오공',
].join(', ')

const OVERALL_PROMPT = `이것은 검은사막 온라인 솔라레의 창 랭킹 스크린샷입니다.
화면에 보이는 모든 플레이어 행을 빠짐없이 추출해주세요.

반드시 아래 JSON 배열 형식으로만 응답하세요. 마크다운이나 다른 텍스트 없이 JSON만:
[{"name":"가문명","class":"클래스명","subclass":"전승 또는 각성 또는 빈문자열","wins":숫자,"draws":숫자,"losses":숫자,"score":숫자}]

규칙:
- class는 반드시 다음 중 하나: ${VALID_CLASSES}
- subclass는 "전승", "각성", "" 셋 중 하나
- wins, draws, losses, score는 모두 정수
- 순위는 제외, 행 순서대로 배열`

const CLASS_PROMPT = (className: string) =>
  `이것은 검은사막 온라인 솔라레의 창 ${className} 클래스 랭킹 스크린샷입니다.
화면에 보이는 모든 플레이어 행을 빠짐없이 추출해주세요.

반드시 아래 JSON 배열 형식으로만 응답하세요. 마크다운이나 다른 텍스트 없이 JSON만:
[{"name":"가문명","subclass":"전승 또는 각성 또는 빈문자열","wins":숫자,"draws":숫자,"losses":숫자,"score":숫자}]

규칙:
- subclass는 "전승", "각성", "" 셋 중 하나
- wins, draws, losses, score는 모두 정수
- 순위는 제외, 행 순서대로 배열`

export async function POST(req: NextRequest) {
  try {
    const projectId = process.env.GCP_PROJECT_ID
    if (!projectId) {
      return NextResponse.json(
        { error: 'GCP_PROJECT_ID 환경변수가 설정되지 않았습니다.' },
        { status: 500 }
      )
    }

    const formData = await req.formData()
    const file = formData.get('image') as File | null
    const type = (formData.get('type') as string) || 'overall'
    const className = formData.get('class') as string | null

    if (!file) {
      return NextResponse.json({ error: '이미지가 없습니다.' }, { status: 400 })
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: '지원하지 않는 이미지 형식입니다. PNG, JPG, WebP를 사용해주세요.' },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const base64 = Buffer.from(bytes).toString('base64')

    const prompt = type === 'class' && className ? CLASS_PROMPT(className) : OVERALL_PROMPT

    // Vertex AI 모델 객체 생성
    const generativeModel = vertexAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
    })

    // API 요청 바디 구성 (inlineData 양식 적용)
    const vertexAIRequest = {
      contents: [{
        role: 'user',
        parts: [
          { inlineData: { mimeType: file.type, data: base64 } },
          { text: prompt },
        ]
      }],
      generationConfig: { maxOutputTokens: 8192, temperature: 0 },
    }

    // Vertex AI API를 통한 이미지 분석 호출
    const vertexRes = await generativeModel.generateContent(vertexAIRequest)
    
    const raw = vertexRes.response.candidates?.[0]?.content?.parts?.[0]?.text ?? ''

    const jsonMatch = raw.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      return NextResponse.json(
        { error: 'JSON 추출 실패 — Gemini 응답이 예상 형식과 다릅니다.', raw },
        { status: 422 }
      )
    }

    let entries: any[]
    try {
      entries = JSON.parse(jsonMatch[0])
    } catch {
      return NextResponse.json({ error: 'JSON 파싱 실패', raw }, { status: 422 })
    }

    // Inject class name for class-type OCR
    if (type === 'class' && className) {
      entries.forEach((e: any) => { e.class = className })
    }

    // Sanitize
    entries = entries
      .map((e: any) => ({
        name: String(e.name || ''),
        class: String(e.class || ''),
        subclass: String(e.subclass || ''),
        wins: parseInt(e.wins) || 0,
        draws: parseInt(e.draws) || 0,
        losses: parseInt(e.losses) || 0,
        score: parseInt(e.score) || 0,
      }))
      .filter(e => e.name && e.score > 0)

    return NextResponse.json({ success: true, entries, count: entries.length })
  } catch (err) {
    console.error('Vertex AI OCR error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : '처리 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
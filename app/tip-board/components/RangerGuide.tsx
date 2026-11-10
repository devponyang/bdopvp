import Link from 'next/link'
import GuideArticle from '@/components/portal/guide/GuideArticle'
import { rangerSections, rangerHeadings } from '@/lib/portal/guide-content/ranger'

const combo = [
  ['단명', 'W(Q)좌클', '1cc · 넉다운'],
  ['우직', 'E 좌클', ''],
  ['캔슬길여바', '좌클유지중 SHIFT', '2cc · 넉다운'],
  ['선회', 'SHIFT 누르자마자 우클릭 추가', ''],
  ['숨찢', 'S먼저!누르고 E 빠르게 따닥+좌클', ''],
  ['초바모', 'SPACE', ''],
  ['옭아', 'F', ''],
  ['숨찢질풍', 'SHIFT+X', '1차라밤'],
]

export default function RangerGuide() {
  return (
    <GuideArticle
      title="전승 레인저"
      cover={{
        src: '/tip-images/홍줭.png',
        alt: '홍줭님이 제공한 전승 레인저 스크린샷',
        caption: '홍줭님 제공 · 원본 비율로 표시됩니다. 클릭하면 확대할 수 있습니다.',
      }}
      author={
        <>
          <span className="author-avatar">홍</span>
          <span>
            <strong>홍줭</strong>
            <Link href="/guild/아지다하카">아지다하카 길드 · 원문 작성 당시</Link>
          </span>
        </>
      }
      sections={rangerSections}
      headings={rangerHeadings}
    >
      <section className="reader-brief" aria-labelledby="brief-title">
        <span className="eyebrow">QUICK START</span>
        <h2 id="brief-title">먼저 기억할 세 가지</h2>
        <p className="brief-note">작성자의 원문을 바탕으로 정리한 읽기 안내입니다.</p>
        <div className="brief-grid">
          <a href="#strengths">
            <span>01 / 포지셔닝</span>
            <strong>거리와 지형을 활용하기</strong>
            <p>원거리 딜링의 장점을 살리고, 무리한 딜각은 피하세요.</p>
          </a>
          <a href="#survival-section">
            <span>02 / 생존</span>
            <strong>미니맵과 주변 상황 확인</strong>
            <p>주력 딜링기 사용 전, 상대의 진입과 내 생존 경로를 살피세요.</p>
          </a>
          <a href="#combos">
            <span>03 / 스킬 연계</span>
            <strong>준비된 스킬을 연결하기</strong>
            <p>고정 콤보만 반복하기보다 남아 있는 재사용 대기시간을 확인하세요.</p>
          </a>
        </div>
      </section>
      <section className="combo-reference" aria-labelledby="combo-reference-title">
        <div className="section-heading">
          <h2 id="combo-reference-title">주 사용 풀콤보</h2>
          <a href="#combos">설명까지 읽기 ↗</a>
        </div>
        <p>원문의 스킬 순서와 커맨드를 함께 볼 수 있도록 나눴습니다.</p>
        <ol>
          {combo.map(([name, keys, note], i) => (
            <li key={name}>
              <span className="combo-order">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <strong>{name}</strong>
                {note && <small>{note}</small>}
                <kbd>{keys}</kbd>
              </div>
            </li>
          ))}
        </ol>
        <p className="combo-caution">
          단명·우직·초바모 등의 재사용 대기시간에 따라 연계가 달라집니다. 원문의 선행 스킬 설명과
          함께 확인하세요.
        </p>
      </section>
    </GuideArticle>
  )
}

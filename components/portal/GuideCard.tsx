import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, PenLine, Trophy, BookOpen } from 'lucide-react'
import { guides } from '@/lib/portal/guides'
import { guideAuthors } from '@/lib/portal/guide-authors'

export default function GuideCard({ guide }: { guide: (typeof guides)[number] }) {
  const author = guideAuthors[guide.id]
  const Achievement = /랭킹|우승/.test(author.bio) ? Trophy : BookOpen
  return (
    <Link href={`/tip-board/${guide.id}`} className="guide-card">
      <div className="guide-card-art">
        <Image
          src={`/class-bg/${guide.name}.png`}
          alt=""
          fill
          sizes="(max-width: 760px) 50vw, 25vw"
        />
        <span className="guide-card-kind">
          {guide.title.includes('전승')
            ? '전승'
            : guide.title.includes('각성')
              ? '각성'
              : '클래스 공략'}
        </span>
      </div>
      <div className="guide-card-content">
        <div className="guide-card-title">
          <h3>{guide.title}</h3>
          <ArrowUpRight size={17} />
        </div>
        <div className="guide-card-author">
          <span className="guide-author-icon">
            <PenLine size={17} />
          </span>
          <div>
            <span className="guide-author-affiliation">{author.affiliation}</span>
            <p>
              <strong>{author.name}</strong> <span>{author.pending ? '작성 예정' : '작성'}</span>
            </p>
          </div>
        </div>
        <div className="guide-author-bio">
          <Achievement size={14} />
          <span>{author.bio}</span>
        </div>
        <p className="guide-card-footnote">
          {author.pending ? '본문 준비 중 · ' : ''}작성 당시 소개 기준
        </p>
      </div>
    </Link>
  )
}

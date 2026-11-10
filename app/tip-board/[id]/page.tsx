import { notFound } from 'next/navigation'
import { guides } from '@/lib/portal/guides'
import { guideAuthors } from '@/lib/portal/guide-authors'
import type { ComponentType } from 'react'
import type { Metadata } from 'next'

export const dynamicParams = false
export function generateStaticParams() {
  return guides.map(({ id }) => ({ id }))
}

const loaders: Record<string, () => Promise<{ default: ComponentType }>> = {
  '12': () => import('../components/MaeguGuide'),
  '13': () => import('../components/WitchGuide'),
  '14': () => import('../components/DarkKnightGuide'),
  '15': () => import('../components/RangerGuide'),
  '16': () => import('../components/DeadEyeGuide'),
  '17': () => import('../components/GiantGuide'),
  '18': () => import('../components/WarriorGuide'),
  '19': () => import('../components/MaeguSuccessionGuide'),
  '20': () => import('../components/AwakenedWizardGuide'),
  '21': () => import('../components/NovaSuccessionGuide'),
  '22': () => import('../components/ScholarGuide'),
  '24': () => import('../components/UsaSuccessionGuide'),
  '31': () => import('../components/AwakenedDracaniaGuide'),
  '32': () => import('../components/SorcererSuccessionGuide'),
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const guide = guides.find((g) => g.id === id)
  if (!guide) notFound()
  const author = guideAuthors[id]
  const description = `${author.name}님이 작성한 ${guide.title} PvP 공략. 스킬, 콤보와 운영법을 목차로 찾아보세요. 원문 보관본으로 현재 패치와 다를 수 있습니다.`
  return {
    title: guide.title,
    description,
    authors: [{ name: author.name }],
    alternates: { canonical: `/tip-board/${id}` },
    openGraph: {
      title: `${guide.title} · ${author.name} | 포냥이`,
      description,
      url: `/tip-board/${id}`,
      type: 'article',
      authors: [author.name],
      images: ['/ponyang/war-bg.png'],
    },
  }
}
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const loader = loaders[id]
  if (!loader || !guides.some((guide) => guide.id === id)) notFound()
  const { default: Guide } = await loader()
  return <Guide />
}

import { z } from 'zod'

const text = z.string().trim().min(1).max(200)
const count = z.number().int().nonnegative()
export const rankingSchema = z.object({
  name: text,
  class: z.string().max(40).default(''),
  guild: z.string().max(100).default(''),
  specialization: z.string().max(40).default(''),
  score: count,
  wins: count,
  losses: count,
  draws: count.default(0),
})
export const portalSchema = z
  .object({
    season: text,
    solare: z.array(rankingSchema).max(5000),
    league: z.array(rankingSchema).max(5000),
    wars: z
      .array(
        z.object({
          id: text,
          date: z.iso.date(),
          region: text,
          tier: text,
          winner: text,
          type: z.enum(['거점전', '점령전']),
        }),
      )
      .max(5000),
    recruits: z
      .array(
        z.object({
          id: text,
          name: text,
          title: text,
          description: z.string().max(10000),
          tags: z.array(text).max(10),
          contact: z.url().refine((v) => v.startsWith('https://'), 'HTTPS 주소를 입력하세요'),
        }),
      )
      .max(500),
    tournaments: z
      .array(
        z.object({
          id: text,
          title: text,
          date: z.iso.date(),
          description: z.string().max(10000),
          status: z.enum(['예정', '진행 중', '종료']),
        }),
      )
      .max(100),
    notices: z
      .array(
        z.object({ id: text, title: text, content: z.string().max(10000), date: z.iso.date() }),
      )
      .max(100),
  })
  .superRefine((data, ctx) => {
    for (const key of ['wars', 'recruits', 'tournaments', 'notices'] as const) {
      const ids = data[key].map((item) => item.id)
      if (new Set(ids).size !== ids.length)
        ctx.addIssue({ code: 'custom', path: [key], message: 'ID는 중복될 수 없습니다.' })
    }
    for (const key of ['solare', 'league'] as const) {
      const names = data[key].map((item) => item.name)
      if (new Set(names).size !== names.length)
        ctx.addIssue({ code: 'custom', path: [key], message: '이름은 중복될 수 없습니다.' })
    }
  })
export type PortalData = z.infer<typeof portalSchema>
export type Ranking = z.infer<typeof rankingSchema>
export type PortalState = {
  status: 'offline' | 'empty' | 'live' | 'error'
  updatedAt: string | null
  revision: string | null
  data: PortalData
}
export const emptyPortal: PortalData = {
  season: '시즌 준비 중',
  solare: [],
  league: [],
  wars: [],
  recruits: [],
  tournaments: [],
  notices: [],
}

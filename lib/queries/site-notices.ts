import { db } from "@/lib/db"

export interface SiteNotice {
  id: number
  title: string
  content: string
  is_published: boolean
  created_at: string
  updated_at: string
}

export async function getSiteNotices(limit = 5): Promise<SiteNotice[]> {
  const { rows } = await db.query<SiteNotice>(
    `
      SELECT id, title, content, is_published, created_at, updated_at
      FROM site_notices
      WHERE is_published = TRUE
      ORDER BY created_at DESC
      LIMIT $1
    `,
    [limit]
  )
  return rows
}

export async function getSiteNoticeById(id: number): Promise<SiteNotice | null> {
  const { rows } = await db.query<SiteNotice>(
    `
      SELECT id, title, content, is_published, created_at, updated_at
      FROM site_notices
      WHERE id = $1
      LIMIT 1
    `,
    [id]
  )
  return rows[0] ?? null
}

export async function createSiteNotice({
  title,
  content,
  isPublished = true
}: {
  title: string
  content: string
  isPublished?: boolean
}): Promise<SiteNotice> {
  const { rows } = await db.query<SiteNotice>(
    `
      INSERT INTO site_notices (title, content, is_published)
      VALUES ($1, $2, $3)
      RETURNING id, title, content, is_published, created_at, updated_at
    `,
    [title, content, isPublished]
  )
  return rows[0]
}

export async function updateSiteNotice(
  id: number,
  {
    title,
    content,
    isPublished
  }: {
    title?: string
    content?: string
    isPublished?: boolean
  }
): Promise<SiteNotice | null> {
  const fields: string[] = []
  const values: unknown[] = []

  if (title !== undefined) {
    fields.push(`title = $${fields.length + 1}`)
    values.push(title)
  }
  if (content !== undefined) {
    fields.push(`content = $${fields.length + 1}`)
    values.push(content)
  }
  if (isPublished !== undefined) {
    fields.push(`is_published = $${fields.length + 1}`)
    values.push(isPublished)
  }

  if (fields.length === 0) {
    return getSiteNoticeById(id)
  }

  values.push(id)

  const { rows } = await db.query<SiteNotice>(
    `
      UPDATE site_notices
      SET ${fields.join(", ")}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${fields.length + 1}
      RETURNING id, title, content, is_published, created_at, updated_at
    `,
    values
  )
  return rows[0] ?? null
}

export async function deleteSiteNotice(id: number): Promise<void> {
  await db.query(`DELETE FROM site_notices WHERE id = $1`, [id])
}













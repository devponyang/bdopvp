import { guideAuthors } from './guide-authors'
import { guides } from './guides'

// Use the same Korean normalization and multi-word matching in both search views.
export function matchesGuide(guide: (typeof guides)[number], query: string) {
  const author = guideAuthors[guide.id]
  const normalize = (value: string) => value.normalize('NFC').toLocaleLowerCase()
  const terms = normalize(query).trim().split(/\s+/).filter(Boolean)
  const text = normalize(`${guide.title} ${author.name} ${author.affiliation}`)
  return terms.every((term) => text.includes(term))
}

const KORBDO_BATCH_URL = 'https://www.korbdo.co.kr/api/a/batch'
const CHUNK_SIZE = 50

export async function fetchGuildNames(names: string[]): Promise<Record<string, string | null>> {
  if (names.length === 0) return {}

  const map: Record<string, string | null> = {}

  for (let i = 0; i < names.length; i += CHUNK_SIZE) {
    const chunk = names.slice(i, i + CHUNK_SIZE)
    try {
      const res = await fetch(KORBDO_BATCH_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ names: chunk }),
        signal: AbortSignal.timeout(10000),
      })

      if (!res.ok) {
        console.warn(`[guild-lookup] chunk ${i}~${i + chunk.length} 실패: HTTP ${res.status}`)
        continue
      }

      const data = await res.json()

      if (Array.isArray(data.results)) {
        for (const r of data.results) {
          map[r.name] = r.guild ?? r.guildName ?? r.guild_name ?? null
        }
      } else {
        console.warn('[guild-lookup] 예상치 못한 응답 구조:', JSON.stringify(data).slice(0, 200))
      }
    } catch (err) {
      console.warn(`[guild-lookup] chunk ${i}~${i + chunk.length} 오류:`, err)
    }
  }

  return map
}

export async function readLimitedJson(request: Request, limit: number): Promise<unknown> {
  if (Number(request.headers.get('content-length')) > limit) throw new Error('BODY_TOO_LARGE')
  const reader = request.body?.getReader()
  if (!reader) throw new Error('EMPTY_BODY')
  const decoder = new TextDecoder()
  let text = '',
    size = 0
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      size += value.byteLength
      if (size > limit) {
        await reader.cancel()
        throw new Error('BODY_TOO_LARGE')
      }
      text += decoder.decode(value, { stream: true })
    }
    return JSON.parse(text + decoder.decode())
  } finally {
    reader.releaseLock()
  }
}

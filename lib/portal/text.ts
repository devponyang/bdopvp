/** Route adapters may supply encoded segments. Invalid literal % stays readable. */
export function decodeRouteSegment(value: string): string {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

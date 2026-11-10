// Compare just the white emblem silhouette, preserving its aspect ratio.
const side = 32
const tile = new OffscreenCanvas(side, side)
const tileContext = tile.getContext('2d', { willReadFrequently: true })

function shape(image, template) {
  const { width, height, data } = image
  const mask = new ImageData(width, height)
  let left = width,
    top = height,
    right = -1,
    bottom = -1,
    count = 0
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4
      const ink = template ? data[i + 3] > 125 : Math.min(data[i], data[i + 1], data[i + 2]) > 150
      if (!ink) continue
      mask.data[i + 3] = 255
      left = Math.min(left, x)
      right = Math.max(right, x)
      top = Math.min(top, y)
      bottom = Math.max(bottom, y)
      count++
    }
  if (
    count < 12 ||
    (!template && (top === 0 || left === 0 || right === width - 1 || bottom === height - 1))
  )
    return null
  const source = new OffscreenCanvas(width, height)
  source.getContext('2d').putImageData(mask, 0, 0)
  const w = right - left + 1,
    h = bottom - top + 1,
    factor = (side - 2) / Math.max(w, h)
  tileContext.clearRect(0, 0, side, side)
  tileContext.drawImage(
    source,
    left,
    top,
    w,
    h,
    (side - w * factor) / 2,
    (side - h * factor) / 2,
    w * factor,
    h * factor,
  )
  const alpha = tileContext.getImageData(0, 0, side, side).data
  // Small emblems lose fine strokes when the game scales its UI. Compare
  // coverage over a three-pixel neighborhood instead of individual edge pixels.
  return Uint8Array.from({ length: side * side }, (_, i) => {
    const x = i % side,
      y = Math.floor(i / side)
    let coverage = 0
    for (let dy = -1; dy <= 1; dy++)
      for (let dx = -1; dx <= 1; dx++) {
        if (x + dx < 0 || x + dx >= side || y + dy < 0 || y + dy >= side) continue
        coverage +=
          alpha[4 * ((y + dy) * side + x + dx) + 3] * (dx === 0 ? 2 : 1) * (dy === 0 ? 2 : 1)
      }
    return Math.round(coverage / 16)
  })
}

export async function loadClassIcons(catalog) {
  return Promise.all(
    Object.entries(catalog).map(async ([name, file]) => {
      const res = await fetch('/class-icons/' + encodeURIComponent(file) + '.png')
      if (!res.ok) throw Error('클래스 문양을 불러올 수 없습니다.')
      const bitmap = await createImageBitmap(await res.blob())
      const canvas = new OffscreenCanvas(bitmap.width, bitmap.height)
      const ctx = canvas.getContext('2d')
      ctx.drawImage(bitmap, 0, 0)
      bitmap.close()
      return { name, mask: shape(ctx.getImageData(0, 0, canvas.width, canvas.height), true) }
    }),
  )
}

export function identifyIcon(context, width, height, y, templates) {
  const left = Math.round(width * 0.222),
    right = Math.round(width * 0.261)
  const half = Math.round((25 * width) / 1500),
    top = Math.max(0, y - half)
  const mask = shape(
    context.getImageData(left, top, right - left, Math.min(height, y + half + 1) - top),
    false,
  )
  if (!mask) return { className: '', iconKey: '' }
  let best = 0,
    second = 0,
    name = ''
  for (const template of templates) {
    if (!template.mask) continue
    let overlap = 0,
      total = 0
    for (let i = 0; i < mask.length; i++) {
      const a = mask[i],
        b = template.mask[i]
      overlap += Math.min(a, b)
      total += Math.max(a, b)
    }
    const score = overlap / total
    if (score > best) {
      second = best
      best = score
      name = template.name
    } else second = Math.max(second, score)
  }
  // Only exactly identical normalized silhouettes share a manual correction.
  const iconKey = btoa(String.fromCharCode(...mask))
  return { className: best >= 0.6 && best - second >= 0.1 ? name : '', iconKey }
}

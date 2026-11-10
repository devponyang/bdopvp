// Runs inside the administrator's browser. Only the selected ranking rectangle reaches this worker.
import * as ort from './runtime/ort.wasm.min.mjs'
import { identifyIcon, loadClassIcons } from './class-icons.js'

ort.env.wasm.numThreads = 1
ort.env.wasm.wasmPaths = new URL('./runtime/', self.location.href).href
let model
let alphabet
let classIcons
const canvas = new OffscreenCanvas(1, 1)
const ctx = canvas.getContext('2d', { willReadFrequently: true })
const resized = new OffscreenCanvas(1, 48)
const resizer = resized.getContext('2d', { willReadFrequently: true })

async function initialize() {
  if (model) return
  const response = await fetch(new URL('./characters.json', self.location.href))
  if (!response.ok) throw Error('한글 문자표를 불러올 수 없습니다.')
  alphabet = await response.json()
  model = await ort.InferenceSession.create(new URL('./korean-v5.onnx', self.location.href).href, {
    executionProviders: ['wasm'],
  })
}

// Find line centers using the gold score column, independent of scroll position.
function scoreLines(pixels, width, height) {
  const start = Math.floor(width * 0.876),
    end = Math.ceil(width * 0.945)
  const lines = []
  let first = -1,
    last = -1
  for (let y = 0; y <= height + 2; y++) {
    let count = 0
    if (y < height)
      for (let x = start; x < end; x++) {
        const i = (y * width + x) * 4
        if (
          pixels[i] > 190 &&
          pixels[i + 1] > 110 &&
          pixels[i + 2] < 140 &&
          pixels[i] - pixels[i + 2] > 110
        )
          count++
      }
    if (count >= Math.max(2, Math.round(width / 700))) {
      if (first < 0) first = y
      last = y
    } else if (first >= 0 && y - last > 2) {
      if (last - first >= width * 0.004)
        lines.push({ y: Math.round((first + last) / 2), size: last - first + 1 })
      first = -1
    }
  }
  return lines
}

async function readCell(left, right, center, half, inverted, trim = true) {
  const x = Math.round(left * canvas.width),
    w = Math.round(right * canvas.width) - x
  const top = Math.max(0, Math.round(center - half)),
    h = Math.min(canvas.height - top, Math.round(half * 2 + 1))
  if (w <= 0 || h <= 0) return { text: '', confidence: 0 }
  let x0 = 0,
    y0 = 0,
    x1 = w - 1,
    y1 = h - 1
  if (trim) {
    const data = ctx.getImageData(x, top, w, h).data
    x0 = w
    y0 = h
    x1 = -1
    y1 = -1
    for (let yy = 0; yy < h; yy++)
      for (let xx = 0; xx < w; xx++) {
        const i = (yy * w + xx) * 4
        if (data[i] > 173 && data[i + 1] > 149) {
          x0 = Math.min(x0, xx)
          x1 = Math.max(x1, xx)
          y0 = Math.min(y0, yy)
          y1 = Math.max(y1, yy)
        }
      }
    if (x1 < 0) return { text: '', confidence: 0 }
    x0 -= 3
    x1 += 3
    y0 -= 3
    y1 += 3
  }
  const sw = x1 - x0 + 1,
    sh = y1 - y0 + 1,
    width = Math.max(1, Math.round((48 * sw) / sh)),
    stride = Math.max(320, width)
  resized.width = width
  resizer.drawImage(canvas, x + x0, top + y0, sw, sh, 0, 0, width, 48)
  const raw = resizer.getImageData(0, 0, width, 48).data
  const input = new Float32Array(3 * 48 * stride)
  for (let y = 0; y < 48; y++)
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4,
        pos = y * stride + x
      const gray = 255 - (raw[i] * 0.299 + raw[i + 1] * 0.587 + raw[i + 2] * 0.114)
      for (let c = 0; c < 3; c++)
        input[c * 48 * stride + pos] = (inverted ? gray : raw[i + 2 - c]) / 127.5 - 1
    }
  const tensor = new ort.Tensor('float32', input, [1, 3, 48, stride])
  const outputs = await model.run({ [model.inputNames[0]]: tensor })
  const out = outputs[model.outputNames[0]],
    [_, steps, k] = out.dims
  let previous = -1,
    text = '',
    conf = 0,
    n = 0
  for (let t = 0; t < steps; t++) {
    const offset = t * k
    let best = 0
    for (let j = 1; j < k; j++) if (out.data[offset + j] > out.data[offset + best]) best = j
    if (best && best !== previous) {
      text += alphabet[best]
      conf += out.data[offset + best]
      n++
    }
    previous = best
  }
  tensor.dispose()
  for (const value of Object.values(outputs)) value.dispose()
  return { text: text.normalize('NFC').trim(), confidence: n ? conf / n : 0 }
}

// The colored badge immediately before the family name identifies specialization.
function readSpecialization(pixels, width, height, center) {
  const scale = width / 1500
  const half = Math.round(15 * scale)
  let blue = 0,
    red = 0
  for (let y = Math.max(0, center - half); y <= Math.min(height - 1, center + half); y++) {
    for (let x = Math.round(width * 0.287); x < Math.round(width * 0.31); x++) {
      const i = (y * width + x) * 4
      const r = pixels[i],
        g = pixels[i + 1],
        b = pixels[i + 2]
      if (b > 145 && b - r > 50 && b - g > 18 && g > r) blue++
      if (r > 135 && r - g > 50 && Math.abs(g - b) < 24) red++
    }
  }
  const minimum = Math.max(10, 50 * scale * scale)
  if (blue >= minimum && blue > 4 * red) return '전승'
  if (red >= minimum && red > 4 * blue) return '각성'
  return ''
}

async function scan(bitmap) {
  canvas.width = bitmap.width
  canvas.height = bitmap.height
  ctx.drawImage(bitmap, 0, 0)
  bitmap.close()
  const w = canvas.width,
    h = canvas.height,
    scale = w / 1500
  const pixels = ctx.getImageData(0, 0, w, h).data
  const lines = scoreLines(pixels, w, h)
  const rows = []
  for (const { y, size } of lines) {
    const big = size > 23 * scale
    const clipped = y < (big ? 30 : 13) * scale || y + (big ? 30 : 13) * scale >= h
    const cells = [
      [0.312, 0.5, y - (big ? 12 * scale : 0), big ? 17 : 12],
      [0.536, 0.596, y, big ? 17 : 12],
      [0.6, 0.713, y, big ? 17 : 12],
      [0.865, 0.944, y, big ? 22 : 12],
    ]
    const passes = []
    for (const inverted of [false, true]) {
      const pass = []
      for (const [left, right, cy, half] of cells)
        pass.push(await readCell(left, right, cy, half * scale, inverted))
      passes.push(pass)
    }
    const [name, rate, record, score] = passes[0].map((cell, i) =>
      i ? cell.text.replaceAll(' ', '') : cell.text,
    )
    const same = passes[0].every((cell, i) => cell.text === passes[1][i].text)
    const confidence = Math.min(...passes.flat().map((c) => c.confidence))
    const nums = record.match(/^(\d+)\/(\d+)\/(\d+)$/)
    const values = nums ? nums.slice(1).map(Number) : []
    const total = values.reduce((a, b) => a + b, 0)
    const valid = Boolean(
      name &&
      /^\d+$/.test(score) &&
      nums &&
      /^\d+\.\d{2}%$/.test(rate) &&
      Math.abs((100 * values[0]) / total - parseFloat(rate)) < 0.011,
    )
    const rankRead = big ? '' : (await readCell(0.103, 0.143, y, 13 * scale, false)).text
    const rankMatch = rankRead.match(/^(\d{1,3})\s*(?:th|st|nd|rd)?$/i)
    const halfHeight = Math.ceil((big ? 53 : 24) * scale)
    const top = Math.max(0, y - halfHeight),
      bottom = Math.min(h, y + halfHeight)
    const crop = new OffscreenCanvas(w, bottom - top)
    crop.getContext('2d').drawImage(canvas, 0, top, w, bottom - top, 0, 0, w, bottom - top)
    const specialization = readSpecialization(pixels, w, h, y)
    let identified
    if (big) {
      const readLabel = async (inverted) => {
        const result = await readCell(0.312, 0.5, y + 19 * scale, 14 * scale, inverted)
        const label = result.text.replace(/\s/g, '').replace(/^\[(?:전승|각성)\]/, '')
        return result.confidence >= 0.9 && classIcons.some((icon) => icon.name === label)
          ? label
          : ''
      }
      const label = await readLabel(false)
      identified = {
        className: label && label === (await readLabel(true)) ? label : '',
        iconKey: '',
      }
    } else identified = identifyIcon(ctx, w, h, y, classIcons)
    rows.push({
      ...identified,
      rank: rankMatch ? Number(rankMatch[1]) : null,
      big,
      name,
      rate,
      record,
      score,
      specialization,
      clean: !clipped && same && confidence >= 0.95 && valid && !!specialization,
      proof: await crop.convertToBlob({ type: 'image/webp', quality: 0.92 }),
    })
  }
  // The three enlarged podium cards are displayed together at the start of the table.
  if (
    rows.length >= 3 &&
    rows.slice(0, 3).every((r) => r.big) &&
    rows.slice(3).every((r) => !r.big)
  ) {
    rows.slice(0, 3).forEach((r, i) => {
      r.rank = i + 1
    })
  }
  return rows
}
self.onmessage = async ({ data }) => {
  try {
    await initialize()
    classIcons ??= await loadClassIcons(data.catalog)
    self.postMessage({ rows: await scan(data.bitmap) })
  } catch (e) {
    self.postMessage({ error: e.message || '순위표 인식에 실패했습니다.' })
  }
}

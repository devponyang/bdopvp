import { copyFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

const target = 'public/solare-ocr/runtime'
mkdirSync(target, { recursive: true })
for (const file of [
  'ort.wasm.min.mjs',
  'ort-wasm-simd-threaded.mjs',
  'ort-wasm-simd-threaded.wasm',
]) {
  copyFileSync(join('node_modules/onnxruntime-web/dist', file), join(target, file))
}

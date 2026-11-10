const fs = require('fs'),
  ts = require('typescript'),
  crypto = require('crypto'),
  assert = require('node:assert/strict')
for (const m of require('../lib/portal/guide-content/migration-manifest.json')) {
  const source = fs.readFileSync(`lib/portal/guide-content/guide-${m.id}.tsx`, 'utf8')
  const ast = ts.createSourceFile('g.tsx', source, 99, true, 4)
  const objs = []
  function walk(n) {
    if (ts.isObjectLiteralExpression(n)) objs.push(n)
    ts.forEachChild(n, walk)
  }
  walk(ast)
  for (const section of m.sections) {
    const obj = objs.find((n) =>
      n.properties.some((p) => p.name?.getText(ast) === 'id' && p.initializer?.text === section.id),
    )
    const content = obj.properties.find((p) => p.name?.getText(ast) === 'content')
    const texts = []
    function tx(n) {
      if (ts.isJsxText(n) && n.text.trim()) texts.push(n.text.replace(/\s+/g, ' ').trim())
      ts.forEachChild(n, tx)
    }
    tx(content.initializer)
    assert.equal(
      crypto.createHash('sha256').update(JSON.stringify(texts)).digest('hex'),
      section.textHash,
      `${m.id}/${section.id}`,
    )
  }
  for (const media of m.media)
    assert(source.includes(media) || source.includes(encodeURI(media)), media)
}
console.log('All original section text and media preserved after formatting')

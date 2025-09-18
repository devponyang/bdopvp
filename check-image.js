const fs = require('fs')
const path = require('path')

const uploadsDir = path.join(process.cwd(), 'public', 'uploads')

console.log('=== 업로드된 이미지 파일 확인 ===')

try {
  const files = fs.readdirSync(uploadsDir)
  
  files.forEach(file => {
    const filePath = path.join(uploadsDir, file)
    const stats = fs.statSync(filePath)
    
    console.log(`파일: ${file}`)
    console.log(`  - 크기: ${stats.size} bytes`)
    console.log(`  - 수정일: ${stats.mtime}`)
    
    // 파일 헤더 확인 (PNG 파일인지)
    const buffer = fs.readFileSync(filePath, { start: 0, end: 8 })
    const header = buffer.toString('hex')
    console.log(`  - 헤더: ${header}`)
    
    if (header.startsWith('89504e47')) {
      console.log(`  - ✅ PNG 파일입니다`)
    } else {
      console.log(`  - ❌ PNG 파일이 아닙니다`)
    }
    
    console.log('')
  })
  
} catch (error) {
  console.error('오류:', error)
}

"use client"
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import RichTextEditor from '@/components/RichTextEditor'
import { TIP_CATEGORIES, CLASS_GUIDE_CLASSES, CLASS_EMOJIS, getCategoryFromTags, getClassFromTags, type TipCategory, type ClassGuideClass } from '@/lib/constants/tip-categories'

interface TipPost {
  id: number
  title: string
  content: string
  author?: string
  source?: string
  is_notice?: boolean
  tags?: string[]
  image_urls?: string[]
}

interface UploadedImage {
  id: string
  url: string
  name: string
}

export default function AdminTipEditPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [post, setPost] = useState<TipPost | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [author, setAuthor] = useState('')
  const [source, setSource] = useState('')
  const [isNotice, setIsNotice] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<TipCategory>(TIP_CATEGORIES.GENERAL)
  const [selectedClass, setSelectedClass] = useState<ClassGuideClass | 'all'>('all')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!document.cookie.includes('isAdmin=true')) {
      router.replace('/admin/login')
    }
  }, [router])

  // 기존 글 데이터 불러오기
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { id } = await params
        const res = await fetch(`/api/tip-board/${id}`)
        if (!res.ok) throw new Error('글을 불러올 수 없습니다')
        
        const postData = await res.json()
        setPost(postData)
        setTitle(postData.title)
        setContent(postData.content)
        setAuthor(postData.author || '')
        setSource(postData.source || '')
        setIsNotice(postData.is_notice || false)
        
        // 카테고리 정보 설정
        const category = getCategoryFromTags(postData.tags || [])
        const classFromTags = getClassFromTags(postData.tags || [])
        setSelectedCategory(category)
        setSelectedClass(classFromTags || 'all')
        
        // 기존 이미지들을 uploadedImages에 추가
        if (postData.image_urls && postData.image_urls.length > 0) {
          const existingImages = postData.image_urls.map((url: string, index: number) => ({
            id: `existing_${index}`,
            url,
            name: `기존 이미지 ${index + 1}`
          }))
          setUploadedImages(existingImages)
        }
      } catch (err: any) {
        setError(err.message || '오류 발생')
      }
    }
    
    fetchPost()
  }, [params])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const { id } = await params
      // 태그 생성
      const tags: string[] = [selectedCategory]
      if (selectedCategory === TIP_CATEGORIES.CLASS_GUIDE && selectedClass !== 'all') {
        tags.push(selectedClass as string)
      }

      const res = await fetch(`/api/tip-board/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          is_notice: isNotice,
          author,
          source,
          tags,
        })
      })
      
      if (!res.ok) throw new Error('수정 실패')
      router.push('/admin/tip-board')
    } catch (err: any) {
      setError(err.message || '오류 발생')
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    
    // 최대 20개 이미지 제한
    const maxImages = 20
    if (uploadedImages.length + files.length > maxImages) {
      alert(`최대 ${maxImages}개의 이미지만 업로드할 수 있습니다. (현재: ${uploadedImages.length}개, 선택: ${files.length}개)`)
      return
    }
    
    // 파일 크기 사전 검증 (30MB 제한)
    const maxFileSize = 30 * 1024 * 1024 // 30MB
    const oversizedFiles = Array.from(files).filter(file => file.size > maxFileSize)
    if (oversizedFiles.length > 0) {
      const fileInfo = oversizedFiles.map(f => `${f.name} (${(f.size / 1024 / 1024).toFixed(2)}MB)`).join(', ')
      alert(`다음 파일들의 크기가 너무 큽니다 (30MB 제한):\n${fileInfo}`)
      return
    }
    
    setUploading(true)
    
    try {
      console.log(`${files.length}개 이미지 업로드 시작...`)
      
      const uploadPromises = Array.from(files).map(async (file, index) => {
        console.log(`업로드 중: ${file.name} (${index + 1}/${files.length})`)
        
        const formData = new FormData()
        formData.append('file', file)
        formData.append('folderType', 'tip-images')
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })
        
        if (res.ok) {
          const { url } = await res.json()
          return {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            url,
            name: file.name
          }
        } else {
          const errorData = await res.json().catch(() => ({}))
          const errorMessage = errorData.error || `HTTP ${res.status} 오류`
          throw new Error(`${file.name} 업로드 실패: ${errorMessage}`)
        }
      })
      
      const uploadedFiles = await Promise.all(uploadPromises)
      setUploadedImages(prev => {
        const newImages = [...prev, ...uploadedFiles]
        console.log(`업로드 완료! 총 ${newImages.length}개 이미지`)
        return newImages
      })
      
      // 파일 입력 초기화
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      
      alert(`${uploadedFiles.length}개 이미지가 성공적으로 업로드되었습니다!`)
      
    } catch (err: any) {
      console.error('업로드 오류:', err)
      alert(err.message || '이미지 업로드 실패')
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (id: string) => {
    setUploadedImages(prev => prev.filter(img => img.id !== id))
  }

  const insertImageToContent = (imageUrl: string) => {
    // 비디오 파일인지 확인
    const isVideo = /\.(mp4|webm|ogg|mov|avi)$/i.test(imageUrl)
    
    if (isVideo) {
      // 비디오 파일인 경우 insertVideoToEditor 함수 호출
      if ((window as any).insertVideoToEditor) {
        (window as any).insertVideoToEditor(imageUrl)
      } else {
        // RichTextEditor가 아직 로드되지 않은 경우, 직접 content에 추가
        setContent(prev => prev + `\n<video controls autoplay loop muted style="max-width: 100%; height: auto; display: block; margin: 10px auto; border-radius: 8px; max-height: 400px; border: 1px solid #374151; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); background-color: #1f2937;"><source src="${imageUrl}">브라우저가 비디오 재생을 지원하지 않습니다.</video>`)
      }
    } else {
      // 이미지 파일인 경우 insertImageToEditor 함수 호출
      if ((window as any).insertImageToEditor) {
        (window as any).insertImageToEditor(imageUrl)
      } else {
        // RichTextEditor가 아직 로드되지 않은 경우, 직접 content에 추가
        setContent(prev => prev + `\n<img src="${imageUrl}" alt="업로드 이미지" style="max-width: 100%; height: auto; display: block; margin: 10px auto; border-radius: 8px; max-height: 400px; border: 1px solid #374151; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); background-color: #1f2937;" />`)
      }
    }
  }

  const insertAllImages = () => {
    // RichTextEditor의 insertImage/insertVideo 함수를 사용하여 모든 미디어 삽입
    uploadedImages.forEach((img, index) => {
      setTimeout(() => {
        insertImageToContent(img.url)
      }, index * 100) // 각 미디어 사이에 100ms 지연
    })
  }

  if (!post) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-gray-400">글을 불러오는 중...</div>
      </div>
    )
  }

  return (
    <div className="max-w-full md:max-w-[1490px] mx-auto p-3 md:p-6">
      {/* 헤더 섹션 */}
      <div className="relative overflow-hidden mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 via-red-500/20 to-pink-500/20 rounded-3xl blur-sm"></div>
        <div className="relative bg-gradient-to-r from-slate-800/80 to-red-900/80 backdrop-blur-sm p-6 md:p-8 rounded-3xl shadow-2xl border border-white/10">
          <div className="flex flex-col space-y-4">
            <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent">
              ✏️ 팁 게시글 수정
            </h1>
            <p className="text-gray-300 text-sm md:text-base">
              팁 내용을 수정해주세요.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <button 
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-800/50 hover:bg-zinc-700/50 text-blue-400 hover:text-blue-300 rounded-lg transition-all duration-200 border border-zinc-700"
        >
          ← 뒤로가기
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 기본 정보 섹션 */}
        <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-xl p-6 border border-blue-400/30 shadow-lg">
          <h3 className="text-lg font-semibold text-blue-300 mb-4 flex items-center gap-2">
            📋 기본 정보
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 font-semibold text-white">제목</label>
              <input 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                className="w-full p-3 rounded-lg bg-zinc-800/50 border border-zinc-600 text-white focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all" 
                required 
              />
            </div>
            <div>
              <label className="block mb-2 font-semibold text-white">작성자</label>
              <input 
                value={author} 
                onChange={e => setAuthor(e.target.value)} 
                className="w-full p-3 rounded-lg bg-zinc-800/50 border border-zinc-600 text-white focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all" 
                required 
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block mb-2 font-semibold text-white">출처 (선택사항)</label>
            <input 
              value={source} 
              onChange={e => setSource(e.target.value)} 
              placeholder="예: 게임 공식 사이트, 커뮤니티, 유튜브 등"
              className="w-full p-3 rounded-lg bg-zinc-800/50 border border-zinc-600 text-white focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all" 
            />
            <div className="text-xs text-gray-400 mt-2">
              정보의 출처나 참고 자료가 있다면 입력해주세요.
            </div>
          </div>
        </div>
        
        {/* 카테고리 선택 */}
        <div>
          <label className="block mb-1 font-semibold">카테고리</label>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {Object.values(TIP_CATEGORIES).map(category => (
              <button
                key={category}
                type="button"
                onClick={() => {
                  setSelectedCategory(category)
                  if (category !== TIP_CATEGORIES.CLASS_GUIDE) {
                    setSelectedClass('all')
                  }
                }}
                className={`p-3 rounded-lg border text-sm font-medium transition ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-zinc-800 text-gray-300 border-zinc-700 hover:bg-zinc-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          
          {/* 클래스 가이드 서브카테고리 */}
          {selectedCategory === TIP_CATEGORIES.CLASS_GUIDE && (
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-300">클래스 선택</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value as ClassGuideClass | 'all')}
                className="w-full p-2 rounded bg-zinc-800 border border-zinc-700 text-white"
              >
                <option value="all">전체 클래스</option>
                {CLASS_GUIDE_CLASSES.map(cls => (
                  <option key={cls} value={cls}>
                    {CLASS_EMOJIS[cls]} {cls}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        {/* 내용 입력 섹션 */}
        <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-sm rounded-xl p-6 border border-orange-400/30 shadow-lg">
          <h3 className="text-lg font-semibold text-orange-300 mb-4 flex items-center gap-2">
            ✍️ 내용 수정
          </h3>
          <RichTextEditor
            value={content}
            onChange={(value) => setContent(value)}
            placeholder="팁 내용을 자세히 적어주세요..."
          />
          <div className="mt-4 text-xs text-gray-400 space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-blue-400">💡</span>
              <span><strong>서식:</strong> 툴바 버튼을 사용하거나 Ctrl+B(굵게), Ctrl+I(기울임), Ctrl+U(밑줄) 단축키 사용</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-purple-400">🎨</span>
              <span><strong>스타일:</strong> 텍스트 색상, 배경색, 폰트 크기, 정렬 등을 자유롭게 설정</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-400">📷</span>
              <span><strong>이미지:</strong> 툴바의 '📷 이미지' 버튼 클릭 또는 <strong>Ctrl+V로 복사한 이미지 붙여넣기</strong></span>
            </div>
          </div>
        </div>
        {/* 이미지 관리 섹션 */}
        <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-xl p-6 border border-purple-400/30 shadow-lg">
          <h3 className="text-lg font-semibold text-purple-300 mb-4 flex items-center gap-2">
            📷 이미지 관리
          </h3>
          <div className="mb-4">
            <label className="block mb-2 font-semibold text-white">
              새 이미지 추가
              <span className="text-sm text-gray-400 ml-2">
                (최대 20개, 현재 {uploadedImages.length}개)
              </span>
            </label>
            <input 
              type="file" 
              accept="image/*" 
              multiple
              ref={fileInputRef} 
              onChange={handleImageUpload} 
              className="block w-full text-sm text-gray-400 file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-purple-600 file:to-pink-600 file:text-white hover:file:from-purple-500 hover:file:to-pink-500 file:transition-all file:duration-200 file:shadow-lg hover:file:shadow-xl" 
            />
            <div className="text-xs text-gray-400 mt-2">
              {uploading ? '⏳ 업로드 중...' : '새 이미지를 추가하거나 기존 이미지를 관리할 수 있습니다.'}
            </div>
          </div>
          
          {/* 업로드된 이미지 미리보기 */}
          {uploadedImages.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-md font-semibold text-white">이미지 목록 ({uploadedImages.length}개)</span>
                <button
                  type="button"
                  onClick={insertAllImages}
                  className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 text-sm"
                >
                  📎 모든 이미지 삽입
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {uploadedImages.map((img) => (
                  <div key={img.id} className="relative border border-zinc-600 rounded p-2">
                    <div className="aspect-square relative mb-2 bg-zinc-900 rounded overflow-hidden">
                      {/* 비디오 파일인지 확인 */}
                      {img.url.match(/\.(mp4|webm|ogg|mov|avi)$/i) ? (
                        <video 
                          src={img.url}
                          className="w-full h-full object-cover"
                          muted
                          loop
                          autoPlay
                          playsInline
                        />
                      ) : (
                        <img
                          src={img.url}
                          alt={img.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      )}
                    </div>
                    <div className="text-xs text-gray-400 truncate mb-2">{img.name}</div>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => insertImageToContent(img.url)}
                        className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 flex-1"
                      >
                        삽입
                      </button>
                      <button
                        type="button"
                        onClick={() => removeImage(img.id)}
                        className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        {/* 제출 버튼 */}
        <div className="bg-gradient-to-r from-indigo-500/20 to-blue-500/20 backdrop-blur-sm rounded-xl p-6 border border-indigo-400/30 shadow-lg">
          {error && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-500/30 rounded-lg text-red-300 text-sm">
              ❌ {error}
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {loading ? '⏳ 수정 중...' : '💾 수정 완료'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-8 py-3 bg-gradient-to-r from-zinc-700 to-zinc-800 hover:from-zinc-600 hover:to-zinc-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2"
            >
              ❌ 취소
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}



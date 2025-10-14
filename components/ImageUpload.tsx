'use client'

import { useState, useRef } from 'react'

interface ImageUploadProps {
  onImageInsert?: (imageUrl: string) => void
  className?: string
}

export default function ImageUpload({ onImageInsert, className = '' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // 파일 크기 사전 검증 (15MB 제한 - 길드 모집 이미지)
    const maxFileSize = 15 * 1024 * 1024 // 15MB
    if (file.size > maxFileSize) {
      setError(`파일 크기가 너무 큽니다 (15MB 제한). 현재 파일 크기: ${(file.size / 1024 / 1024).toFixed(2)}MB`)
      return
    }

    setUploading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', file)

      // 길드 모집 전용 업로드 API 사용 (인증 불필요)
      const response = await fetch('/api/guild-recruit/upload', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (response.ok) {
        console.log('이미지 업로드 성공:', result.url)
        
        if (onImageInsert) {
          onImageInsert(result.url)
        } else if ((window as any).insertImageToEditor) {
          // 리치 텍스트 에디터에 이미지 삽입
          console.log('리치 에디터에 이미지 삽입 시도')
          try {
            (window as any).insertImageToEditor(result.url)
            console.log('이미지 삽입 완료')
          } catch (error) {
            console.error('이미지 삽입 실패:', error)
            setError('이미지 삽입에 실패했습니다.')
          }
        } else {
          console.error('이미지 삽입 함수를 찾을 수 없습니다.')
          setError('에디터가 준비되지 않았습니다.')
        }
        
        // 파일 입력 초기화
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      } else {
        const errorMessage = result.error || `HTTP ${response.status} 오류`
        setError(`업로드 실패: ${errorMessage}`)
      }
    } catch (error: any) {
      console.error('업로드 오류:', error)
      setError(`네트워크 오류가 발생했습니다: ${error.message || '알 수 없는 오류'}`)
    } finally {
      setUploading(false)
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={className}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
        className="hidden"
      />
      
      <button
        type="button"
        onClick={handleButtonClick}
        disabled={uploading}
        className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {uploading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>업로드 중...</span>
          </>
        ) : (
          <>
            <span>📷</span>
            <span>이미지 추가</span>
          </>
        )}
      </button>

      {error && (
        <div className="mt-2 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="mt-1 text-xs text-gray-500">
        JPG, PNG, GIF, WebP 파일만 지원 (최대 15MB)
      </div>
    </div>
  )
}

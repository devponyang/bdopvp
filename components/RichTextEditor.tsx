'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import { isValidYouTubeUrl, convertToEmbedUrl } from '@/lib/utils/youtube'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export default function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = "내용을 입력하세요...",
  className = "" 
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  // 초기값 설정
  useEffect(() => {
    if (editorRef.current && !isInitialized) {
      editorRef.current.innerHTML = value || ''
      setIsInitialized(true)
    }
  }, [value, isInitialized])

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML
      onChange(html)
    }
  }, [onChange])

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
    handleInput()
  }

  const setTextColor = (color: string) => {
    execCommand('foreColor', color)
  }

  const setBackgroundColor = (color: string) => {
    execCommand('backColor', color)
  }

  const setFontFamily = (fontFamily: string) => {
    execCommand('fontName', fontFamily)
  }

  const insertVideo = useCallback((videoUrl: string): void => {
    if (!editorRef.current) return

    try {
      // 에디터에 포커스
      editorRef.current.focus()
      
      const selection = window.getSelection()
      let range: Range
      
      if (selection && selection.rangeCount > 0) {
        range = selection.getRangeAt(0)
        
        // 에디터 내부에서만 삽입되도록 확인
        if (!editorRef.current.contains(range.commonAncestorContainer) && 
            range.commonAncestorContainer !== editorRef.current) {
          // 에디터 외부에 커서가 있으면 에디터 끝으로 이동
          range = document.createRange()
          range.selectNodeContents(editorRef.current)
          range.collapse(false)
        }
      } else {
        // 선택 영역이 없으면 에디터 끝에 추가
        range = document.createRange()
        range.selectNodeContents(editorRef.current)
        range.collapse(false)
      }
      
      const video = document.createElement('video')
      video.src = videoUrl
      video.controls = true
      video.autoplay = true
      video.loop = true
      video.muted = true
      video.style.maxWidth = '100%'
      video.style.height = 'auto'
      video.style.display = 'block'
      video.style.margin = '10px auto'
      video.style.borderRadius = '8px'
      video.style.maxHeight = '400px'
      video.style.border = '1px solid #374151'
      video.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      video.style.backgroundColor = '#1f2937'
      
      // 비디오 앞뒤로 줄바꿈 추가
      const br1 = document.createElement('br')
      const br2 = document.createElement('br')
      
      range.deleteContents()
      range.insertNode(br1)
      range.insertNode(video)
      range.insertNode(br2)
      
      // 커서를 비디오 뒤로 이동
      range.setStartAfter(br2)
      range.collapse(true)
      
      if (selection) {
        selection.removeAllRanges()
        selection.addRange(range)
      }
      
      handleInput()
      
      console.log('비디오가 에디터에 삽입되었습니다:', videoUrl)
    } catch (error) {
      console.error('비디오 삽입 오류:', error)
      alert('비디오 삽입 중 오류가 발생했습니다.')
    }
  }, [handleInput])


  // 외부에서 이미지 삽입 요청이 있을 때
  useEffect(() => {
    // 이미지 삽입 함수를 전역으로 노출
    (window as any).insertImageToEditor = (imageUrl: string) => {
      if (!editorRef.current) return

      try {
        // 에디터에 포커스
        editorRef.current.focus()
        
        const selection = window.getSelection()
        let range: Range
        
        if (selection && selection.rangeCount > 0) {
          range = selection.getRangeAt(0)
          
          // 에디터 내부에서만 삽입되도록 확인
          if (!editorRef.current.contains(range.commonAncestorContainer) && 
              range.commonAncestorContainer !== editorRef.current) {
            // 에디터 외부에 커서가 있으면 에디터 끝으로 이동
            range = document.createRange()
            range.selectNodeContents(editorRef.current)
            range.collapse(false)
          }
        } else {
          // 선택 영역이 없으면 에디터 끝에 추가
          range = document.createRange()
          range.selectNodeContents(editorRef.current)
          range.collapse(false)
        }
        
        const img = document.createElement('img')
        img.src = imageUrl
        img.alt = '업로드 이미지'
        img.style.maxWidth = '100%'
        img.style.height = 'auto'
        img.style.display = 'block'
        img.style.margin = '10px auto'
        img.style.borderRadius = '8px'
        img.style.maxHeight = '400px'
        img.style.border = '1px solid #374151'
        img.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        img.style.backgroundColor = '#1f2937'
        
        // 이미지 앞뒤로 줄바꿈 추가
        const br1 = document.createElement('br')
        const br2 = document.createElement('br')
        
        range.deleteContents()
        range.insertNode(br1)
        range.insertNode(img)
        range.insertNode(br2)
        
        // 커서를 이미지 뒤로 이동
        range.setStartAfter(br2)
        range.collapse(true)
        
        if (selection) {
          selection.removeAllRanges()
          selection.addRange(range)
        }
        
        handleInput()
        
        console.log('이미지가 에디터에 삽입되었습니다:', imageUrl)
      } catch (error) {
        console.error('이미지 삽입 오류:', error)
        alert('이미지 삽입 중 오류가 발생했습니다.')
      }
    }

    // 유튜브 삽입 함수를 전역으로 노출
    (window as any).insertYouTubeToEditor = (url: string) => {
      if (!isValidYouTubeUrl(url)) {
        alert('유효하지 않은 유튜브 URL입니다.')
        return
      }

      const embedUrl = convertToEmbedUrl(url)
      if (!embedUrl) {
        alert('유튜브 URL을 임베드 URL로 변환할 수 없습니다.')
        return
      }
      
      // enablejsapi=1과 origin 파라미터 추가 (유튜브 광고 표시를 위해)
      const finalEmbedUrl = `${embedUrl}${embedUrl.includes('?') ? '&' : '?'}enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}`

      try {
        const selection = window.getSelection()
        if (!selection || !editorRef.current) return

        const range = selection.getRangeAt(0)
        
        // 유튜브 임베드 HTML 생성 (유튜브 정책 준수)
        const youtubeHtml = `
          <div class="youtube-embed-container" style="margin: 20px 0; text-align: center;">
            <iframe 
              src="${finalEmbedUrl}" 
              title="유튜브 동영상" 
              width="100%" 
              height="315" 
              style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.3);" 
              frameborder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen" 
              allowfullscreen
              loading="lazy">
            </iframe>
            <div style="margin-top: 8px;">
              <a href="${url}" target="_blank" rel="noopener noreferrer" style="color: #3b82f6; text-decoration: underline; font-size: 14px;">
                🔗 유튜브에서 원본 보기
              </a>
            </div>
          </div>
        `
        
        // 임시 div 생성하여 HTML 파싱
        const tempDiv = document.createElement('div')
        tempDiv.innerHTML = youtubeHtml
        const youtubeElement = tempDiv.firstElementChild
        
        if (!youtubeElement) return
        
        // 에디터에 삽입
        range.deleteContents()
        range.insertNode(youtubeElement)
        
        // 커서를 유튜브 임베드 뒤로 이동
        range.setStartAfter(youtubeElement)
        range.collapse(true)
        
        if (selection) {
          selection.removeAllRanges()
          selection.addRange(range)
        }
        
        handleInput()
        
        console.log('유튜브 동영상이 에디터에 삽입되었습니다:', url)
      } catch (error) {
        console.error('유튜브 삽입 오류:', error)
        alert('유튜브 동영상 삽입 중 오류가 발생했습니다.')
      }
    }
    
    // 비디오 삽입 함수도 전역으로 노출
    (window as any).insertVideoToEditor = (videoUrl: string) => {
      insertVideo(videoUrl)
    }
    
    // 컴포넌트 언마운트 시 정리
    return () => {
      delete (window as any).insertImageToEditor
      delete (window as any).insertYouTubeToEditor
      delete (window as any).insertVideoToEditor
    }
  }, [handleInput, insertVideo])

  const compressImage = (file: File, maxWidth: number = 1920, quality: number = 0.8): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      
      img.onload = () => {
        // 이미지 크기 계산
        let { width, height } = img
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }
        
        canvas.width = width
        canvas.height = height
        
        // 이미지 그리기
        ctx?.drawImage(img, 0, 0, width, height)
        
        // 압축된 이미지를 Blob으로 변환
        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now()
            })
            resolve(compressedFile)
          } else {
            resolve(file) // 압축 실패 시 원본 파일 반환
          }
        }, 'image/jpeg', quality)
      }
      
      img.src = URL.createObjectURL(file)
    })
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 파일 크기 미리 확인 (5MB)
    const maxSize = 5 * 1024 * 1024
    let fileToUpload = file
    
    // 5MB 이상이면 압축 시도
    if (file.size > maxSize) {
      try {
        fileToUpload = await compressImage(file, 1920, 0.7)
        console.log(`이미지 압축: ${file.size} → ${fileToUpload.size} bytes`)
      } catch (error) {
        console.error('이미지 압축 실패:', error)
        alert('파일 크기가 너무 큽니다. 5MB 이하의 파일을 선택해주세요.')
        return
      }
    }

    try {
      const formData = new FormData()
      formData.append('file', fileToUpload)
      formData.append('folderType', 'tip-images')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (response.ok) {
        (window as any).insertImageToEditor(result.url)
      } else {
        alert(result.error || '이미지 업로드에 실패했습니다.')
      }
    } catch (error) {
      alert('네트워크 오류가 발생했습니다.')
    }

    // 파일 입력 초기화
    e.target.value = ''
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Ctrl+B for bold, Ctrl+I for italic, etc.
    if (e.ctrlKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault()
          execCommand('bold')
          break
        case 'i':
          e.preventDefault()
          execCommand('italic')
          break
        case 'u':
          e.preventDefault()
          execCommand('underline')
          break
      }
    }
  }

  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items
    if (!items) return

    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      
      // 일반 텍스트인 경우 - 텍스트 방향 강제 설정
      if (item.type === 'text/plain') {
        const textData = await new Promise<string>((resolve) => {
          item.getAsString((data) => resolve(data))
        })
        
        // 텍스트 방향을 LTR로 설정하여 삽입
        const selection = window.getSelection()
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0)
          range.deleteContents()
          
          // 텍스트 노드 생성 시 방향 속성 추가 (배경색 제거)
          const textNode = document.createTextNode(textData)
          const span = document.createElement('span')
          span.setAttribute('dir', 'ltr')
          span.setAttribute('style', 'direction: ltr !important; text-align: left !important; background: transparent !important; background-color: transparent !important; color: inherit !important;')
          span.appendChild(textNode)
          
          range.insertNode(span)
          range.collapse(false)
          selection.removeAllRanges()
          selection.addRange(range)
          
          handleInput()
          return // 텍스트 처리 완료 후 종료
        }
      }
      
      // 이미지 또는 비디오 파일인 경우
      if (item.type.indexOf('image') !== -1 || item.type.indexOf('video') !== -1) {
        e.preventDefault()
        
        const file = item.getAsFile()
        if (!file) continue

        // 파일 크기 미리 확인 (30MB)
        const maxSize = 30 * 1024 * 1024
        let fileToUpload = file
        
        // 이미지인 경우에만 압축 시도 (5MB 이상일 때)
        if (item.type.indexOf('image') !== -1 && file.size > 5 * 1024 * 1024) {
          try {
            fileToUpload = await compressImage(file, 1920, 0.7)
            console.log(`붙여넣은 이미지 압축: ${file.size} → ${fileToUpload.size} bytes`)
          } catch (error) {
            console.error('이미지 압축 실패:', error)
            alert('붙여넣은 이미지가 너무 큽니다. 5MB 이하의 이미지를 붙여넣어주세요.')
            continue
          }
        }

        // 비디오 파일 크기 확인
        if (item.type.indexOf('video') !== -1 && file.size > maxSize) {
          alert('비디오 파일이 너무 큽니다. 30MB 이하의 비디오를 붙여넣어주세요.')
          continue
        }

        try {
          // 파일을 서버에 업로드
          const formData = new FormData()
          formData.append('file', fileToUpload)
          formData.append('folderType', 'tip-images')

          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          })

          const result = await response.json()

          if (response.ok) {
            // 업로드된 파일을 에디터에 삽입
            if (item.type.indexOf('video') !== -1) {
              // 비디오 파일인 경우 비디오 태그로 삽입
              insertVideo(result.url)
            } else {
              // 이미지 파일인 경우 이미지 태그로 삽입
              (window as any).insertImageToEditor(result.url)
            }
          } else {
            alert(result.error || '파일 업로드에 실패했습니다.')
          }
        } catch (error) {
          console.error('파일 업로드 오류:', error)
          alert('파일 업로드 중 오류가 발생했습니다.')
        }
      } else if (item.type === 'text/html') {
        // HTML 텍스트인 경우 - 스타일 제거
        e.preventDefault()
        
        const htmlData = await new Promise<string>((resolve) => {
          item.getAsString((data) => resolve(data))
        })
        
        // 임시 div 생성하여 HTML 파싱
        const tempDiv = document.createElement('div')
        tempDiv.innerHTML = htmlData
        
        // 모든 스타일 속성 제거 및 텍스트 방향 강제 설정
        const removeStyles = (element: Element) => {
          element.removeAttribute('style')
          element.removeAttribute('class')
          element.removeAttribute('bgcolor')
          element.removeAttribute('background')
          element.removeAttribute('dir')
          element.removeAttribute('direction')
          element.removeAttribute('color')
          element.removeAttribute('font')
          element.removeAttribute('face')
          element.removeAttribute('size')
          
          // 텍스트 방향을 LTR로 강제 설정
          if (element.tagName.toLowerCase() === 'div' || 
              element.tagName.toLowerCase() === 'p' || 
              element.tagName.toLowerCase() === 'span') {
            element.setAttribute('dir', 'ltr')
            element.setAttribute('style', 'direction: ltr !important; text-align: left !important; background: transparent !important; background-color: transparent !important; color: inherit !important;')
          }
          
          // 자식 요소들도 처리
          Array.from(element.children).forEach(child => {
            removeStyles(child)
          })
        }
        
        removeStyles(tempDiv)
        
        // 텍스트만 추출하거나 깨끗한 HTML로 변환
        const cleanContent = tempDiv.innerHTML
        
        // 선택 영역에 삽입
        const selection = window.getSelection()
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0)
          range.deleteContents()
          
          const tempDiv2 = document.createElement('div')
          tempDiv2.innerHTML = cleanContent
          
          // 텍스트 노드들만 추출하여 삽입 (스타일 없는 순수 텍스트)
          const textNodes: Node[] = []
          const extractTextNodes = (node: Node) => {
            if (node.nodeType === Node.TEXT_NODE) {
              textNodes.push(node)
            } else if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element
              if (element.tagName.toLowerCase() === 'br') {
                textNodes.push(document.createElement('br'))
              } else {
                Array.from(node.childNodes).forEach(child => extractTextNodes(child))
              }
            }
          }
          
          Array.from(tempDiv2.childNodes).forEach(child => extractTextNodes(child))
          
          // 텍스트 노드들을 삽입 (LTR 방향으로, 배경색 제거)
          textNodes.forEach(node => {
            const clonedNode = node.cloneNode(true)
            if (clonedNode.nodeType === Node.ELEMENT_NODE) {
              const element = clonedNode as Element
              element.setAttribute('dir', 'ltr')
              element.setAttribute('style', 'direction: ltr !important; text-align: left !important; background: transparent !important; background-color: transparent !important; color: inherit !important;')
            }
            range.insertNode(clonedNode)
          })
          
          range.collapse(false)
          selection.removeAllRanges()
          selection.addRange(range)
        }
        
        handleInput()
      }
    }
  }

  return (
    <div className={`border border-slate-600 rounded-lg overflow-hidden bg-slate-700 ${className}`}>
      {/* 툴바 */}
      <div className="flex items-center gap-1 p-2 bg-slate-800 border-b border-slate-600 flex-wrap text-xs">
        {/* 텍스트 서식 */}
        <div className="flex items-center gap-1 border-r border-slate-600 pr-2 mr-2">
          <button
            type="button"
            onClick={() => execCommand('bold')}
            className="px-2 py-1 text-sm bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors"
            title="굵게 (Ctrl+B)"
          >
            <strong>B</strong>
          </button>
          <button
            type="button"
            onClick={() => execCommand('italic')}
            className="px-2 py-1 text-sm bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors italic"
            title="기울임 (Ctrl+I)"
          >
            I
          </button>
          <button
            type="button"
            onClick={() => execCommand('underline')}
            className="px-2 py-1 text-sm bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors underline"
            title="밑줄 (Ctrl+U)"
          >
            U
          </button>
        </div>

        {/* 정렬 */}
        <div className="flex items-center gap-1 border-r border-slate-600 pr-2 mr-2">
          <button
            type="button"
            onClick={() => execCommand('justifyLeft')}
            className="px-2 py-1 text-sm bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors"
            title="왼쪽 정렬"
          >
            ⬅️
          </button>
          <button
            type="button"
            onClick={() => execCommand('justifyCenter')}
            className="px-2 py-1 text-sm bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors"
            title="가운데 정렬"
          >
            ↔️
          </button>
          <button
            type="button"
            onClick={() => execCommand('justifyRight')}
            className="px-2 py-1 text-sm bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors"
            title="오른쪽 정렬"
          >
            ➡️
          </button>
        </div>

        {/* 목록 */}
        <div className="flex items-center gap-1 border-r border-slate-600 pr-2 mr-2">
          <button
            type="button"
            onClick={() => execCommand('insertUnorderedList')}
            className="px-2 py-1 text-sm bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors"
            title="불릿 목록"
          >
            • 목록
          </button>
          <button
            type="button"
            onClick={() => execCommand('insertOrderedList')}
            className="px-2 py-1 text-sm bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors"
            title="번호 목록"
          >
            1. 목록
          </button>
        </div>

        {/* 폰트 크기 */}
        <div className="flex items-center gap-1 border-r border-slate-600 pr-2 mr-2">
          <select
            onChange={(e) => execCommand('fontSize', e.target.value)}
            className="px-2 py-1 text-sm bg-slate-700 text-white rounded border border-slate-600"
            defaultValue="3"
          >
            <option value="1">매우 작게</option>
            <option value="2">작게</option>
            <option value="3">보통</option>
            <option value="4">크게</option>
            <option value="5">매우 크게</option>
            <option value="6">거대하게</option>
          </select>
        </div>

        {/* 폰트 패밀리 */}
        <div className="flex items-center gap-1 border-r border-slate-600 pr-2 mr-2">
          <select
            onChange={(e) => setFontFamily(e.target.value)}
            className="px-2 py-1 text-sm bg-slate-700 text-white rounded border border-slate-600"
            defaultValue="Arial"
          >
            <option value="Arial">Arial</option>
            <option value="Helvetica">Helvetica</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Georgia">Georgia</option>
            <option value="Verdana">Verdana</option>
            <option value="Courier New">Courier New</option>
            <option value="맑은 고딕">맑은 고딕</option>
            <option value="나눔고딕">나눔고딕</option>
            <option value="굴림">굴림</option>
            <option value="돋움">돋움</option>
          </select>
        </div>

        {/* 텍스트 색상 */}
        <div className="flex items-center gap-1 border-r border-slate-600 pr-2 mr-2">
          <input
            type="color"
            onChange={(e) => setTextColor(e.target.value)}
            className="w-6 h-5 bg-slate-700 border border-slate-600 rounded cursor-pointer"
            title="텍스트 색상"
            defaultValue="#ffffff"
          />
        </div>

        {/* 배경 색상 */}
        <div className="flex items-center gap-1 border-r border-slate-600 pr-2 mr-2">
          <input
            type="color"
            onChange={(e) => setBackgroundColor(e.target.value)}
            className="w-6 h-5 bg-slate-700 border border-slate-600 rounded cursor-pointer"
            title="배경 색상"
            defaultValue="#000000"
          />
        </div>

        {/* 이미지 업로드 */}
        <div className="flex items-center gap-1 border-r border-slate-600 pr-2 mr-2">
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            title="자동 압축되어 업로드됩니다"
            onChange={handleImageUpload}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="px-2 py-1 text-sm bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors cursor-pointer"
            title="이미지 파일 업로드"
          >
            📷 이미지
          </label>
        </div>

        {/* 유튜브 삽입 */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => {
              const url = prompt('유튜브 URL을 입력하세요:')
              if (url) {
                (window as any).insertYouTubeToEditor(url)
              }
            }}
            className="px-2 py-1 text-sm bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors"
            title="유튜브 동영상 삽입"
          >
            🎬 유튜브
          </button>
          <span className="text-xs text-gray-400">또는 Ctrl+V로 붙여넣기</span>
        </div>
      </div>

      {/* 에디터 */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        className="min-h-[200px] p-4 text-white focus:outline-none"
        style={{ 
          minHeight: '200px',
          lineHeight: '1.6',
          direction: 'ltr',
          textAlign: 'left'
        }}
        data-placeholder={placeholder}
        suppressContentEditableWarning={true}
        dir="ltr"
      />

      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #64748b;
          font-style: italic;
        }
        [contenteditable] img {
          max-width: 100%;
          height: auto;
          display: block;
          margin: 10px auto;
          border-radius: 8px;
          max-height: 400px;
          border: 1px solid #374151;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          background-color: #1f2937;
        }
        [contenteditable] p {
          margin: 0 0 10px 0;
        }
        [contenteditable] ul, [contenteditable] ol {
          margin: 10px 0;
          padding-left: 20px;
        }
        [contenteditable] font[color] {
          color: inherit !important;
        }
        [contenteditable] span[style*="color"] {
          color: inherit !important;
        }
        [contenteditable] * {
          font-family: inherit !important;
        }
        /* 텍스트 정렬 스타일 */
        [contenteditable] div[style*="text-align: left"] {
          text-align: left !important;
        }
        [contenteditable] div[style*="text-align: center"] {
          text-align: center !important;
        }
        [contenteditable] div[style*="text-align: right"] {
          text-align: right !important;
        }
        [contenteditable] div[style*="text-align: justify"] {
          text-align: justify !important;
        }
        /* 복사된 내용의 배경색 및 스타일 제거, 텍스트 방향 강제 설정 */
        [contenteditable] * {
          background-color: transparent !important;
          background: transparent !important;
          background-image: none !important;
          color: inherit !important;
          direction: ltr !important;
          text-align: left !important;
        }
        [contenteditable] div {
          direction: ltr !important;
          text-align: left !important;
          background: transparent !important;
          background-color: transparent !important;
        }
        [contenteditable] p {
          direction: ltr !important;
          text-align: left !important;
          background: transparent !important;
          background-color: transparent !important;
        }
        [contenteditable] span {
          direction: ltr !important;
          text-align: left !important;
          background: transparent !important;
          background-color: transparent !important;
        }
        [contenteditable] font {
          background: transparent !important;
          background-color: transparent !important;
        }
        [contenteditable] mark {
          background: transparent !important;
          background-color: transparent !important;
        }
        [contenteditable] font[color] {
          color: inherit !important;
        }
        [contenteditable] span[style*="background"] {
          background: transparent !important;
          background-color: transparent !important;
          background-image: none !important;
        }
        [contenteditable] div[style*="background"] {
          background: transparent !important;
          background-color: transparent !important;
          background-image: none !important;
        }
        [contenteditable] p[style*="background"] {
          background: transparent !important;
          background-color: transparent !important;
          background-image: none !important;
        }
        [contenteditable] table {
          background-color: transparent !important;
          background: transparent !important;
        }
        [contenteditable] td {
          background-color: transparent !important;
          background: transparent !important;
        }
        [contenteditable] th {
          background-color: transparent !important;
          background: transparent !important;
        }
        /* 모든 인라인 스타일의 배경색 제거 */
        [contenteditable] *[style] {
          background-color: transparent !important;
          background: transparent !important;
          background-image: none !important;
        }
      `}</style>
    </div>
  )
}

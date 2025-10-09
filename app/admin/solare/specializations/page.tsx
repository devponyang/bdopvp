'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import Link from 'next/link'

// 솔라레와 동일한 클래스 순서 (워리어부터 시작)
const CLASSES = [
  '워리어', '하사신', '세이지', '레인저', '가디언', '스칼라', '드라카니아',
  '소서러', '노바', '커세어', '란', '자이언트', '매구', '금수랑', '샤이',
  '격투가', '무사', '매화', '미스틱', '발키리', '쿠노이치', '닌자', '다크나이트',
  '위자드', '아처', '우사', '위치', '도사', '데드아이'
]

interface Specialization {
  id: number
  player_name: string
  class: string
  specialization_image_url?: string
  description?: string
  updated_at: string
}

interface SolarePlayer {
  name: string
  classes: string[]
  maxScore: number
}

export default function SolareSpecializationsPage() {
  const [specializations, setSpecializations] = useState<Specialization[]>([])
  const [solarePlayers, setSolarePlayers] = useState<SolarePlayer[]>([])
  const [selectedPlayer, setSelectedPlayer] = useState('')
  const [selectedClass, setSelectedClass] = useState('')
  const [description, setDescription] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [playerSearch, setPlayerSearch] = useState('')
  const [playersWithSpecialization, setPlayersWithSpecialization] = useState<Set<string>>(new Set())

  // 특화 정보 목록 불러오기
  const fetchSpecializations = async () => {
    try {
      const res = await fetch('/api/admin/solare/specializations')
      const data = await res.json()
      setSpecializations(data)
      
      // 특화 정보가 있는 플레이어들을 Set으로 저장
      const playersWithSpec = new Set<string>()
      data.forEach((spec: Specialization) => {
        playersWithSpec.add(`${spec.player_name}-${spec.class}`)
      })
      setPlayersWithSpecialization(playersWithSpec)
    } catch (error) {
      console.error('특화 정보 불러오기 실패:', error)
    }
  }

  // 솔라레 플레이어 목록 불러오기
  const fetchSolarePlayers = async () => {
    try {
      const res = await fetch('/api/admin/solare/players')
      const data = await res.json()
      setSolarePlayers(data)
    } catch (error) {
      console.error('솔라레 플레이어 목록 불러오기 실패:', error)
    }
  }

  useEffect(() => {
    fetchSpecializations()
    fetchSolarePlayers()
  }, [])

  // 클립보드에서 이미지 붙여넣기
  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items
    if (!items) return

    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile()
        if (file) {
          setImageFile(file)
          const reader = new FileReader()
          reader.onload = (e) => {
            setImagePreview(e.target?.result as string)
          }
          reader.readAsDataURL(file)
        }
        break
      }
    }
  }

  // 파일 선택
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // 특화 정보 저장
  const handleSave = async () => {
    if (!selectedPlayer || !selectedClass) {
      alert('플레이어명과 클래스를 선택해주세요.')
      return
    }

    setLoading(true)
    try {
      let imageUrl = null

      // 이미지가 있으면 업로드
      if (imageFile) {
        const formData = new FormData()
        formData.append('file', imageFile)
        formData.append('folderType', 'solare-images')

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json()
          imageUrl = uploadData.url
        } else {
          throw new Error('이미지 업로드 실패')
        }
      }

      // 특화 정보 저장
      const res = await fetch('/api/admin/solare/specializations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          playerName: selectedPlayer,
          className: selectedClass,
          specializationImageUrl: imageUrl,
          description: description || null,
        }),
      })

      if (res.ok) {
        alert('특화 정보가 저장되었습니다!')
        setSelectedPlayer('')
        // setSelectedClass('') // 클래스 선택 유지
        setDescription('')
        setImageFile(null)
        setImagePreview(null)
        setPlayerSearch('') // 검색창도 초기화
        fetchSpecializations()
      } else {
        throw new Error('저장 실패')
      }
    } catch (error) {
      console.error('저장 오류:', error)
      alert('저장 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold">솔라레 특화 관리</h1>

      {/* 특화 정보 입력 폼 */}
      <div className="bg-zinc-800 rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-semibold">특화 정보 추가/수정</h2>
        
        {/* 플레이어 선택 테이블 */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              플레이어 선택 (테이블에서 클릭하여 선택)
            </label>
            <Input
              placeholder="플레이어 이름 검색..."
              value={playerSearch}
              onChange={(e) => setPlayerSearch(e.target.value)}
              className="mb-3"
            />
          </div>

          {/* 선택된 플레이어 정보 표시 */}
          {selectedPlayer && (
            <div className="bg-blue-900/30 border border-blue-600 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-blue-300">선택된 플레이어: </span>
                  <span className="text-white">{selectedPlayer}</span>
                  {(() => {
                    const playerData = solarePlayers.find(p => p.name === selectedPlayer)
                    return playerData ? (
                      <span className="text-gray-300 ml-2">(점수: {playerData.maxScore})</span>
                    ) : null
                  })()}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedPlayer('')
                      // 클래스는 유지
                    }}
                    className="text-gray-400 hover:text-white"
                  >
                    ✕ 플레이어 해제
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedPlayer('')
                      setSelectedClass('')
                    }}
                    className="text-red-400 hover:text-red-300"
                  >
                    ✕ 전체 초기화
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* 플레이어 테이블 */}
          <div className="bg-zinc-900 rounded-lg border border-gray-600 max-h-80 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-zinc-800 border-b border-gray-600">
                <tr>
                  <th className="px-3 py-2 text-left font-medium">순위</th>
                  <th className="px-3 py-2 text-left font-medium">플레이어명</th>
                  <th className="px-3 py-2 text-left font-medium">점수</th>
                  <th className="px-3 py-2 text-left font-medium">
                    {selectedClass ? `${selectedClass} 클래스` : '참여 클래스'}
                  </th>
                </tr>
              </thead>
              <tbody>
                {solarePlayers
                  .filter(player => {
                    // 이름 검색 필터
                    if (!player.name || !player.name.trim()) return false
                    if (!player.name.toLowerCase().includes(playerSearch.toLowerCase())) return false
                    
                    // 클래스 필터 (클래스가 선택된 경우)
                    if (selectedClass && selectedClass.trim()) {
                      return player.classes.includes(selectedClass)
                    }
                    
                    return true
                  })
                  .slice(0, 100) // 최대 100개 표시
                  .map((player, index) => (
                    <tr
                      key={player.name}
                      className={`border-b border-gray-700 hover:bg-zinc-800 cursor-pointer transition-colors ${
                        selectedPlayer === player.name ? 'bg-blue-900/50 border-blue-600' : ''
                      }`}
                      onClick={() => {
                        setSelectedPlayer(player.name)
                        // 클래스가 이미 선택되어 있으면 유지
                      }}
                    >
                      <td className="px-3 py-2 text-gray-400">{index + 1}</td>
                      <td className="px-3 py-2 font-medium text-white">
                        <div className="flex items-center gap-2">
                          <span>{player.name}</span>
                          {/* 특화 정보가 있는 클래스 표시 */}
                          {selectedClass && playersWithSpecialization.has(`${player.name}-${selectedClass}`) && (
                            <span className="text-green-400 text-xs">🎯</span>
                          )}
                          {!selectedClass && player.classes.some(cls => playersWithSpecialization.has(`${player.name}-${cls}`)) && (
                            <span className="text-green-400 text-xs">🎯</span>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-2 text-yellow-400 font-semibold">{player.maxScore}</td>
                      <td className="px-3 py-2 text-gray-300 text-xs">
                        {selectedClass ? 
                          (player.classes.includes(selectedClass) ? selectedClass : '-') :
                          (player.classes.length > 0 ? player.classes.join(', ') : '전체만')
                        }
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            {solarePlayers.filter(player => 
              player.name && 
              player.name.trim() && 
              player.name.toLowerCase().includes(playerSearch.toLowerCase())
            ).length === 0 && (
              <div className="text-center py-8 text-gray-500">
                검색 결과가 없습니다
              </div>
            )}
          </div>

          {/* 클래스 선택 및 저장 버튼 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium">클래스</label>
                {selectedClass && (
                  <Link 
                    href={`/solare-league/${encodeURIComponent(selectedClass)}`}
                    target="_blank"
                    className="text-xs text-blue-400 hover:text-blue-300 underline"
                  >
                    {selectedClass} 랭킹 보기 →
                  </Link>
                )}
              </div>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="클래스 선택" />
                </SelectTrigger>
                <SelectContent>
                  {(() => {
                    const selectedPlayerData = solarePlayers.find(p => p.name === selectedPlayer)
                    if (selectedPlayer && selectedPlayerData && selectedPlayerData.classes.length > 0) {
                      return selectedPlayerData.classes
                        .filter(className => className && className.trim())
                        .map(className => (
                          <SelectItem key={className} value={className}>
                            {className}
                          </SelectItem>
                        ))
                    } else {
                      return CLASSES.filter(c => c && c.trim()).map(className => (
                        <SelectItem key={className} value={className}>
                          {className}
                        </SelectItem>
                      ))
                    }
                  })()}
                </SelectContent>
              </Select>
            </div>
            
            {/* 저장 버튼 */}
            <div>
              <Button 
                onClick={handleSave} 
                disabled={loading || !selectedPlayer || !selectedClass} 
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600"
              >
                {loading ? '저장 중...' : '💾 특화 정보 저장'}
              </Button>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">설명 (선택사항)</label>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="특화에 대한 설명"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            특화 스크린샷 (Win+Shift+S로 캡처 후 Ctrl+V로 붙여넣기 가능)
          </label>
          <div
            className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center"
            onPaste={handlePaste}
            tabIndex={0}
          >
            {imagePreview ? (
              <div className="space-y-2">
                <img
                  src={imagePreview}
                  alt="미리보기"
                  className="max-w-full max-h-64 mx-auto rounded"
                />
                <Button
                  variant="outline"
                  onClick={() => {
                    setImageFile(null)
                    setImagePreview(null)
                  }}
                >
                  이미지 제거
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <p>여기를 클릭하거나 이미지를 붙여넣으세요</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="imageUpload"
                />
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('imageUpload')?.click()}
                >
                  파일 선택
                </Button>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* 특화 정보 통계 */}
      <div className="bg-zinc-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">특화 정보 현황</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-zinc-700 rounded-lg p-3">
            <div className="text-2xl font-bold text-green-400">{specializations.length}</div>
            <div className="text-sm text-gray-400">총 등록된 특화</div>
          </div>
          <div className="bg-zinc-700 rounded-lg p-3">
            <div className="text-2xl font-bold text-blue-400">
              {new Set(specializations.map(s => s.player_name)).size}
            </div>
            <div className="text-sm text-gray-400">특화 등록 플레이어</div>
          </div>
          <div className="bg-zinc-700 rounded-lg p-3">
            <div className="text-2xl font-bold text-yellow-400">
              {new Set(specializations.map(s => s.class)).size}
            </div>
            <div className="text-sm text-gray-400">특화 등록 클래스</div>
          </div>
          <div className="bg-zinc-700 rounded-lg p-3">
            <div className="text-xs text-gray-400 flex items-center justify-center">
              <span className="text-green-400 mr-1">🎯</span>
              특화 있음
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

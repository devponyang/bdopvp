'use client'

import SolareAdminForm from '@/components/admin/SolareAdminForm'
import classList from '@/lib/constants/class-list'
import { useEffect, useState } from 'react'
import { Card } from '@/components/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'

export interface Entry {
  name: string
  subclass: string
  class: string
  wins: number
  draws: number
  losses: number
  score: number
}

interface Season {
  id: number
  season_name: string
  season_number: number
  start_date: string
  end_date?: string
  is_active: boolean
  description?: string
  created_at: string
}

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

const CLASSES = [
  '워리어', '하사신', '세이지', '레인저', '가디언', '스칼라', '드라카니아',
  '소서러', '노바', '커세어', '란', '자이언트', '매구', '금수랑', '샤이',
  '격투가', '무사', '매화', '미스틱', '발키리', '쿠노이치', '닌자', '다크나이트',
  '위자드', '아처', '우사', '위치', '도사', '데드아이'
]

export default function SolareAdminPage() {
  const [activeTab, setActiveTab] = useState<'data' | 'seasons' | 'specializations'>('data')
  
  // 데이터 관리 탭
  const [selectedClass, setSelectedClass] = useState('전체')
  const [overall, setOverall] = useState<Entry[]>([])
  const [classData, setClassData] = useState<Record<string, Entry[]>>({})

  // 시즌 관리 탭
  const [seasons, setSeasons] = useState<Season[]>([])
  const [seasonsLoading, setSeasonsLoading] = useState(false)
  const [showNewSeasonForm, setShowNewSeasonForm] = useState(false)
  const [newSeason, setNewSeason] = useState({
    seasonName: '',
    seasonNumber: 1,
    startDate: new Date().toISOString().split('T')[0],
    description: ''
  })

  // 특화 관리 탭
  const [specializations, setSpecializations] = useState<Specialization[]>([])
  const [solarePlayers, setSolarePlayers] = useState<SolarePlayer[]>([])
  const [specializationPlayerName, setSpecializationPlayerName] = useState('')
  const [specializationClassName, setSpecializationClassName] = useState('')
  const [specializationDescription, setSpecializationDescription] = useState('')
  const [specializationImageFile, setSpecializationImageFile] = useState<File | null>(null)
  const [specializationImagePreview, setSpecializationImagePreview] = useState<string | null>(null)
  const [specializationLoading, setSpecializationLoading] = useState(false)
  const [playerSearch, setPlayerSearch] = useState('')
  const [playersWithSpecialization, setPlayersWithSpecialization] = useState<Set<string>>(new Set())
  const [activeSeasonId, setActiveSeasonId] = useState<number | null>(null)
  const [selectedSeasonId, setSelectedSeasonId] = useState<number | null>(null)
  const [solareSeasons, setSolareSeasons] = useState<any[]>([])

  // 데이터 로드
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/admin/solare/load')
      const data = await res.json()
      setOverall(data.overall)
      setClassData(data.classData)
    }
    fetchData()
    
    // 특화 관리 탭일 때만 특화 관련 데이터 로드
    if (activeTab === 'specializations') {
      loadSpecializationData()
    }
  }, [activeTab])

  useEffect(() => {
    if (activeTab === 'seasons') {
      loadSeasons()
    } else if (activeTab === 'specializations') {
      fetchSpecializations()
      fetchSolarePlayers()
    }
  }, [activeTab])

  // 시즌 관리 함수들
  const loadSeasons = async () => {
    setSeasonsLoading(true)
    try {
      const response = await fetch('/api/admin/solare/seasons')
      const data = await response.json()
      setSeasons(data)
    } catch (error) {
      console.error('시즌 목록 로딩 오류:', error)
    } finally {
      setSeasonsLoading(false)
    }
  }

  const createNewSeason = async () => {
    try {
      const response = await fetch('/api/admin/solare/seasons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSeason)
      })
      
      if (response.ok) {
        alert('새 솔라레 시즌이 생성되었습니다!')
        setShowNewSeasonForm(false)
        setNewSeason({
          seasonName: '',
          seasonNumber: 1,
          startDate: new Date().toISOString().split('T')[0],
          description: ''
        })
        loadSeasons()
      } else {
        alert('솔라레 시즌 생성에 실패했습니다.')
      }
    } catch (error) {
      console.error('솔라레 시즌 생성 오류:', error)
      alert('솔라레 시즌 생성 중 오류가 발생했습니다.')
    }
  }

  const archiveSeason = async (seasonId: number) => {
    if (!confirm('현재 솔라레 시즌을 종료하고 데이터를 보관하시겠습니까?')) return
    
    try {
      const response = await fetch('/api/admin/solare/archive-season', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          seasonId, 
          endDate: new Date().toISOString().split('T')[0] 
        })
      })
      
      if (response.ok) {
        alert('솔라레 시즌이 성공적으로 보관되었습니다!')
        loadSeasons()
      } else {
        alert('솔라레 시즌 보관에 실패했습니다.')
      }
    } catch (error) {
      console.error('솔라레 시즌 보관 오류:', error)
      alert('솔라레 시즌 보관 중 오류가 발생했습니다.')
    }
  }

  // 특화 관리 함수들
  const fetchSpecializations = async (currentPlayers?: SolarePlayer[], seasonId?: number | null) => {
    try {
      // seasonId가 있으면 해당 시즌의 특화 정보만 조회
      const url = seasonId 
        ? `/api/admin/solare/specializations?seasonId=${seasonId}`
        : '/api/admin/solare/specializations'
      
      const res = await fetch(url)
      const data = await res.json()
      
      // 파라미터로 받은 플레이어 목록 사용, 없으면 state 사용
      const playersToUse = currentPlayers || solarePlayers
      
      // 현재 시즌의 플레이어만 특화 정보에 포함
      const activeSeasonPlayers = new Set(playersToUse.map(p => p.name))
      const filteredSpecializations = data.filter((spec: Specialization) => 
        activeSeasonPlayers.has(spec.player_name)
      )
      
      setSpecializations(filteredSpecializations)
      
      // 특화 정보가 있는 플레이어들을 Set으로 저장
      const playersWithSpec = new Set<string>()
      filteredSpecializations.forEach((spec: Specialization) => {
        playersWithSpec.add(`${spec.player_name}-${spec.class}`)
      })
      setPlayersWithSpecialization(playersWithSpec)
    } catch (error) {
      console.error('특화 정보 로딩 오류:', error)
    }
  }

  // 시즌 목록 가져오기
  const fetchSolareSeasons = async () => {
    try {
      const res = await fetch('/api/admin/solare/seasons')
      const seasonsData = await res.json()
      setSolareSeasons(seasonsData)
      
      const activeSeason = seasonsData.find((season: any) => season.is_active)
      setActiveSeasonId(activeSeason ? activeSeason.id : null)
      
      // 기본적으로 활성 시즌 선택, 없으면 가장 최근 시즌 선택
      if (activeSeason) {
        setSelectedSeasonId(activeSeason.id)
        return activeSeason.id
      } else if (seasonsData.length > 0) {
        const latestSeason = seasonsData.sort((a: any, b: any) => b.season_number - a.season_number)[0]
        setSelectedSeasonId(latestSeason.id)
        return latestSeason.id
      }
      
      return null
    } catch (error) {
      console.error('시즌 로딩 오류:', error)
      return null
    }
  }

  // 특화 관련 데이터 순차 로드
  const loadSpecializationData = async () => {
    try {
      // 1. 시즌 목록 가져오기
      const seasonId = await fetchSolareSeasons()
      
      // 2. 플레이어 목록 가져오기 (반환된 seasonId 사용)
      const players = await fetchSolarePlayers(seasonId)
      
      // 3. 특화 정보 가져오기 (방금 로드한 플레이어 목록과 seasonId 전달)
      await fetchSpecializations(players, seasonId)
    } catch (error) {
      console.error('특화 데이터 로딩 오류:', error)
    }
  }

  // 시즌 변경 핸들러
  const handleSeasonChange = async (seasonId: number | null) => {
    setSelectedSeasonId(seasonId)
    const players = await fetchSolarePlayers(seasonId)
    await fetchSpecializations(players, seasonId)
  }

  const fetchSolarePlayers = async (seasonId?: number | null) => {
    try {
      // 활성 시즌이 있으면 해당 시즌 데이터, 없으면 기본 데이터 사용
      const url = seasonId 
        ? `/api/admin/solare/season-data?seasonId=${seasonId}`
        : '/api/solare-league/overall'
      
      const res = await fetch(url)
      const result = await res.json()
      const playersMap = new Map<string, SolarePlayer>()
      
      // seasonId가 있는 경우: { season, overall, classData } 형식
      // seasonId가 없는 경우: { data: [...], lastUpdated: ... } 형식
      let allEntries: any[] = []
      
      if (seasonId) {
        // season-data API는 overall과 classData를 모두 포함
        const overallData = Array.isArray(result.overall) ? result.overall : []
        const classData = result.classData || {}
        
        // overall 데이터와 클래스 데이터를 모두 합침
        allEntries = [...overallData]
        
        // 클래스별 데이터도 추가 (중복 제거)
        Object.values(classData).forEach((classEntries: any) => {
          if (Array.isArray(classEntries)) {
            classEntries.forEach((entry: any) => {
              // 이미 있는 플레이어-클래스 조합인지 확인
              const exists = allEntries.some(e => e.name === entry.name && e.class === entry.class)
              if (!exists) {
                allEntries.push(entry)
              }
            })
          }
        })
      } else {
        // overall API는 { data: [...] } 형식
        allEntries = Array.isArray(result.data) ? result.data : []
      }
      
      // 플레이어별로 그룹화
      allEntries.forEach((entry: any) => {
        if (!entry.name) return
        
        if (!playersMap.has(entry.name)) {
          playersMap.set(entry.name, {
            name: entry.name,
            classes: [],
            maxScore: entry.score
          })
        }
        const player = playersMap.get(entry.name)!
        
        // 클래스 중복 체크
        if (entry.class && !player.classes.includes(entry.class)) {
          player.classes.push(entry.class)
        }
        player.maxScore = Math.max(player.maxScore, entry.score)
      })
      
      const sortedPlayers = Array.from(playersMap.values()).sort((a, b) => b.maxScore - a.maxScore)
      setSolarePlayers(sortedPlayers)
      
      // 플레이어 목록 반환 (특화 정보 갱신에 사용)
      return sortedPlayers
    } catch (error) {
      console.error('솔라레 플레이어 로딩 오류:', error)
      setSolarePlayers([])
      return []
    }
  }

  // 특화 관리 관련 함수들
  const handleSpecializationImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSpecializationImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setSpecializationImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // 클립보드에서 이미지 붙여넣기
  const handleSpecializationPaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items
    if (!items) return

    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile()
        if (file) {
          setSpecializationImageFile(file)
          const reader = new FileReader()
          reader.onloadend = () => {
            setSpecializationImagePreview(reader.result as string)
          }
          reader.readAsDataURL(file)
        }
        break
      }
    }
  }

  // 특화 정보 저장
  const handleSpecializationSave = async () => {
    if (!specializationPlayerName || !specializationClassName) {
      alert('플레이어명과 클래스를 선택해주세요.')
      return
    }

    setSpecializationLoading(true)
    try {
      let imageUrl = null
      
      // 이미지가 있으면 업로드
      if (specializationImageFile) {
        const formData = new FormData()
        formData.append('file', specializationImageFile)
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

      // 특화 정보 저장 (현재 선택된 시즌 ID 포함)
      const res = await fetch('/api/admin/solare/specializations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          playerName: specializationPlayerName,
          className: specializationClassName,
          specializationImageUrl: imageUrl,
          description: specializationDescription || null,
          seasonId: selectedSeasonId,
        }),
      })

      if (res.ok) {
        alert('특화 정보가 저장되었습니다!')
        setSpecializationPlayerName('')
        setSpecializationDescription('')
        setSpecializationImageFile(null)
        setSpecializationImagePreview(null)
        setPlayerSearch('')
        // 현재 시즌의 특화 정보 다시 로드
        fetchSpecializations(solarePlayers, selectedSeasonId)
      } else {
        throw new Error('저장 실패')
      }
    } catch (error) {
      console.error('저장 오류:', error)
      alert('저장 중 오류가 발생했습니다.')
    } finally {
      setSpecializationLoading(false)
    }
  }

  const filteredPlayers = solarePlayers.filter(p => 
    !playerSearch || p.name.toLowerCase().includes(playerSearch.toLowerCase())
  )

  return (
    <div className="space-y-8">
      {/* 헤더 */}
      <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-2xl">⚡</span>
          </div>
          <h1 className="text-3xl font-bold text-white">솔라레의 창 관리</h1>
        </div>
      </div>

      {/* 탭 메뉴 */}
      <div className="flex space-x-2 bg-slate-700/40 p-1.5 rounded-xl border border-white/10">
        <button
          onClick={() => setActiveTab('data')}
          className={`flex-1 px-6 py-3 text-sm font-bold rounded-lg transition-all ${
            activeTab === 'data'
              ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-500/30'
              : 'text-gray-300 hover:text-white hover:bg-white/5'
          }`}
        >
          📊 데이터 관리
        </button>
        <button
          onClick={() => setActiveTab('seasons')}
          className={`flex-1 px-6 py-3 text-sm font-bold rounded-lg transition-all ${
            activeTab === 'seasons'
              ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-500/30'
              : 'text-gray-300 hover:text-white hover:bg-white/5'
          }`}
        >
          📅 시즌 관리
        </button>
        <button
          onClick={() => setActiveTab('specializations')}
          className={`flex-1 px-6 py-3 text-sm font-bold rounded-lg transition-all ${
            activeTab === 'specializations'
              ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-500/30'
              : 'text-gray-300 hover:text-white hover:bg-white/5'
          }`}
        >
          ⚔️ 특화 관리
        </button>
      </div>

      {/* 데이터 관리 탭 */}
      {activeTab === 'data' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-xl">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedClass('전체')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedClass === '전체' 
                    ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg' 
                    : 'bg-slate-700/50 text-gray-300 hover:bg-slate-600/50'
                }`}
              >
                전체
              </button>
              {classList.map(cls => (
                <button
                  key={cls}
                  onClick={() => setSelectedClass(cls)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedClass === cls 
                      ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg' 
                      : 'bg-slate-700/50 text-gray-300 hover:bg-slate-600/50'
                  }`}
                >
                  {cls}
                </button>
              ))}
            </div>
          </div>

          <SolareAdminForm
            selectedClass={selectedClass}
            overall={overall}
            classData={classData}
            setOverall={setOverall}
            setClassData={setClassData}
          />
        </div>
      )}

      {/* 시즌 관리 탭 */}
      {activeTab === 'seasons' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-xl">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">시즌 관리</h2>
              <Button 
                onClick={() => setShowNewSeasonForm(true)}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg"
              >
                새 시즌 생성
              </Button>
            </div>
          </div>

          {showNewSeasonForm && (
            <Card className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-white/10 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">새 솔라레 시즌 생성</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">시즌 이름</label>
                  <Input
                    value={newSeason.seasonName}
                    onChange={(e) => setNewSeason({...newSeason, seasonName: e.target.value})}
                    placeholder="예: 솔라레 시즌 2"
                    className="bg-slate-700/50 text-white border-white/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">시즌 번호</label>
                  <Input
                    type="number"
                    value={newSeason.seasonNumber}
                    onChange={(e) => setNewSeason({...newSeason, seasonNumber: parseInt(e.target.value)})}
                    className="bg-slate-700/50 text-white border-white/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">시작일</label>
                  <Input
                    type="date"
                    value={newSeason.startDate}
                    onChange={(e) => setNewSeason({...newSeason, startDate: e.target.value})}
                    className="bg-slate-700/50 text-white border-white/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">설명</label>
                  <Input
                    value={newSeason.description}
                    onChange={(e) => setNewSeason({...newSeason, description: e.target.value})}
                    placeholder="시즌에 대한 설명 (선택사항)"
                    className="bg-slate-700/50 text-white border-white/20"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={createNewSeason} className="bg-gradient-to-r from-green-600 to-green-700">
                    생성
                  </Button>
                  <Button 
                    onClick={() => setShowNewSeasonForm(false)}
                    className="bg-gradient-to-r from-gray-600 to-gray-700"
                  >
                    취소
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {seasonsLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3 text-gray-400">
                <div className="w-6 h-6 border-3 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-lg">시즌 목록 불러오는 중...</span>
              </div>
            </div>
          ) : (
            <div className="grid gap-4">
              {seasons.map((season) => (
                <Card key={season.id} className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-white/10 p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold text-white">
                        {season.season_name}
                        {season.is_active && (
                          <span className="ml-2 px-2 py-1 text-xs bg-gradient-to-r from-green-600 to-green-700 text-white rounded shadow-lg">
                            활성
                          </span>
                        )}
                      </h3>
                      <p className="text-gray-400 mt-1">
                        시즌 #{season.season_number} • {season.start_date} ~ {season.end_date || '진행중'}
                      </p>
                      {season.description && (
                        <p className="text-gray-300 mt-2">{season.description}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {season.is_active && (
                        <Button
                          onClick={() => archiveSeason(season.id)}
                          className="bg-gradient-to-r from-orange-600 to-orange-700"
                        >
                          시즌 종료
                        </Button>
                      )}
                      <Button
                        onClick={() => window.open(`/admin/solare/seasons/${season.id}`, '_blank')}
                        className="bg-gradient-to-r from-blue-600 to-blue-700"
                      >
                        데이터 보기
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 특화 관리 탭 */}
      {activeTab === 'specializations' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl">⚔️</span>
                </div>
                <h2 className="text-3xl font-bold text-white">솔라레 특화 관리</h2>
              </div>
              <div className="flex items-center gap-4">
                {activeSeasonId && selectedSeasonId === activeSeasonId && (
                  <div className="bg-gradient-to-r from-purple-600/20 to-purple-700/20 border border-purple-500/30 rounded-lg px-4 py-2">
                    <span className="text-purple-300 text-sm font-medium">
                      🎯 현재 활성 시즌
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <label className="text-gray-300 text-sm font-medium">시즌 선택:</label>
                  <Select value={selectedSeasonId?.toString() || ''} onValueChange={(value) => handleSeasonChange(value ? parseInt(value) : null)}>
                    <SelectTrigger className="w-48 bg-slate-700/50 border-slate-600 text-white">
                      <SelectValue placeholder="시즌을 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {solareSeasons.map((season) => (
                        <SelectItem key={season.id} value={season.id.toString()}>
                          <div className="flex items-center gap-2">
                            <span>{season.season_name}</span>
                            {season.is_active && <span className="text-green-400">●</span>}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* 특화 정보 입력 폼 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">특화 정보 추가/수정</h3>
              
              {/* 플레이어 선택 테이블 */}
            <div className="space-y-4">
              <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    플레이어 선택 (테이블에서 클릭하여 선택)
                  </label>
                <Input
                    placeholder="플레이어 이름 검색..."
                  value={playerSearch}
                  onChange={(e) => setPlayerSearch(e.target.value)}
                    className="bg-slate-700/50 border-slate-600 text-white placeholder-gray-400 focus:border-purple-500 mb-3"
                />
              </div>

                {/* 선택된 플레이어 정보 표시 */}
                {specializationPlayerName && (
                  <div className="bg-blue-900/30 border border-blue-600 rounded-lg p-3">
                    <div className="flex items-center justify-between">
              <div>
                        <span className="font-semibold text-blue-300">선택된 플레이어: </span>
                        <span className="text-white">{specializationPlayerName}</span>
                        {(() => {
                          const playerData = solarePlayers.find(p => p.name === specializationPlayerName)
                          return playerData ? (
                            <span className="text-gray-300 ml-2">(점수: {playerData.maxScore})</span>
                          ) : null
                        })()}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSpecializationPlayerName('')}
                          className="text-gray-400 hover:text-white"
                        >
                          ✕ 플레이어 해제
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSpecializationPlayerName('')
                            setSpecializationClassName('')
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
                <div className="bg-slate-800/50 rounded-lg border border-white/10 max-h-80 overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-slate-700/50 border-b border-white/10">
                      <tr>
                        <th className="px-3 py-2 text-left font-medium text-gray-300">순위</th>
                        <th className="px-3 py-2 text-left font-medium text-gray-300">플레이어명</th>
                        <th className="px-3 py-2 text-left font-medium text-gray-300">점수</th>
                        <th className="px-3 py-2 text-left font-medium text-gray-300">
                          {specializationClassName ? `${specializationClassName} 클래스` : '참여 클래스'}
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
                          if (specializationClassName && specializationClassName.trim()) {
                            return player.classes.includes(specializationClassName)
                          }
                          
                          return true
                        })
                        .slice(0, 100) // 최대 100개 표시
                        .map((player, index) => (
                          <tr
                            key={player.name}
                            className={`border-b border-white/10 hover:bg-slate-700/30 cursor-pointer transition-colors ${
                              specializationPlayerName === player.name ? 'bg-blue-900/50 border-blue-600' : ''
                            }`}
                            onClick={() => setSpecializationPlayerName(player.name)}
                          >
                            <td className="px-3 py-2 text-gray-400">{index + 1}</td>
                            <td className="px-3 py-2 font-medium text-white">
                              <div className="flex items-center gap-2">
                                <span>{player.name}</span>
                                {/* 특화 정보가 있는 클래스 표시 */}
                                {specializationClassName && playersWithSpecialization.has(`${player.name}-${specializationClassName}`) && (
                                  <span className="text-green-400 text-xs">🎯</span>
                                )}
                                {!specializationClassName && player.classes.some(cls => playersWithSpecialization.has(`${player.name}-${cls}`)) && (
                                  <span className="text-green-400 text-xs">🎯</span>
                                )}
                              </div>
                            </td>
                            <td className="px-3 py-2 text-yellow-400 font-semibold">{player.maxScore}</td>
                            <td className="px-3 py-2 text-gray-300 text-xs">
                              {specializationClassName ? 
                                (player.classes.includes(specializationClassName) ? specializationClassName : '-') :
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
                      <label className="block text-sm font-medium text-gray-300">클래스</label>
                      {specializationClassName && (
                        <a 
                          href={`/solare-league/${encodeURIComponent(specializationClassName)}`}
                          target="_blank"
                          className="text-xs text-blue-400 hover:text-blue-300 underline"
                        >
                          {specializationClassName} 랭킹 보기 →
                        </a>
                      )}
                    </div>
                    <Select value={specializationClassName} onValueChange={setSpecializationClassName}>
                      <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                        <SelectValue placeholder="클래스 선택" />
                  </SelectTrigger>
                  <SelectContent>
                        {(() => {
                          const selectedPlayerData = solarePlayers.find(p => p.name === specializationPlayerName)
                          if (specializationPlayerName && selectedPlayerData && selectedPlayerData.classes.length > 0) {
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
                      onClick={handleSpecializationSave}
                      disabled={specializationLoading || !specializationPlayerName || !specializationClassName} 
                      className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold disabled:opacity-50"
                    >
                      {specializationLoading ? '저장 중...' : '💾 특화 정보 저장'}
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">설명 (선택사항)</label>
                <Input
                  value={specializationDescription}
                  onChange={(e) => setSpecializationDescription(e.target.value)}
                  placeholder="특화에 대한 설명"
                  className="bg-slate-700/50 border-slate-600 text-white placeholder-gray-400 focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  특화 스크린샷 (Win+Shift+S로 캡처 후 Ctrl+V로 붙여넣기 가능)
                </label>
                <div
                  className="border-2 border-dashed border-slate-600 rounded-lg p-4 text-center"
                  onPaste={handleSpecializationPaste}
                  tabIndex={0}
                >
                  {specializationImagePreview ? (
                    <div className="space-y-2">
                      <img
                        src={specializationImagePreview}
                        alt="미리보기"
                        className="max-w-full max-h-64 mx-auto rounded"
                      />
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSpecializationImageFile(null)
                          setSpecializationImagePreview(null)
                        }}
                        className="bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600"
                      >
                        이미지 제거
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-gray-400">여기를 클릭하거나 이미지를 붙여넣으세요</p>
                <input
                  type="file"
                  accept="image/*"
                        onChange={handleSpecializationImageChange}
                        className="hidden"
                        id="specializationImageUpload"
                      />
                      <Button
                        variant="outline"
                        onClick={() => document.getElementById('specializationImageUpload')?.click()}
                        className="bg-slate-700/50 border-slate-600 text-white hover:bg-slate-600"
                      >
                        파일 선택
                      </Button>
                    </div>
                )}
              </div>
            </div>
          </div>

            {/* 특화 정보 통계 */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-white mb-4">
                특화 정보 현황 {selectedSeasonId && (
                  <span className="text-purple-400 text-sm font-normal">
                    - {solareSeasons.find(s => s.id === selectedSeasonId)?.season_name}
                  </span>
                )}
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-green-400">{specializations.length}</div>
                  <div className="text-sm text-gray-400">총 등록된 특화</div>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-blue-400">
                    {new Set(specializations.map(s => s.player_name)).size}
                  </div>
                  <div className="text-sm text-gray-400">특화 등록 플레이어</div>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-yellow-400">
                    {new Set(specializations.map(s => s.class)).size}
                  </div>
                  <div className="text-sm text-gray-400">특화 등록 클래스</div>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-3">
                  <div className="text-xs text-gray-400 flex items-center justify-center">
                    <span className="text-green-400 mr-1">🎯</span>
                    특화 있음
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


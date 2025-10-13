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
  const [selectedPlayer, setSelectedPlayer] = useState('')
  const [selectedSpecClass, setSelectedSpecClass] = useState('')
  const [description, setDescription] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [playerSearch, setPlayerSearch] = useState('')
  const [playersWithSpecialization, setPlayersWithSpecialization] = useState<Set<string>>(new Set())

  // 데이터 로드
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/admin/solare/load')
      const data = await res.json()
      setOverall(data.overall)
      setClassData(data.classData)
    }
    fetchData()
  }, [])

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
  const fetchSpecializations = async () => {
    try {
      const res = await fetch('/api/admin/solare/specializations')
      const data = await res.json()
      setSpecializations(data)
      
      const playerSet = new Set<string>(data.map((s: Specialization) => s.player_name))
      setPlayersWithSpecialization(playerSet)
    } catch (error) {
      console.error('특화 정보 로딩 오류:', error)
    }
  }

  const fetchSolarePlayers = async () => {
    try {
      const res = await fetch('/api/solare-league/overall')
      const data = await res.json()
      const playersMap = new Map<string, SolarePlayer>()
      
      data.forEach((entry: any) => {
        if (!playersMap.has(entry.name)) {
          playersMap.set(entry.name, {
            name: entry.name,
            classes: [],
            maxScore: entry.score
          })
        }
        const player = playersMap.get(entry.name)!
        player.classes.push(entry.class)
        player.maxScore = Math.max(player.maxScore, entry.score)
      })
      
      const sortedPlayers = Array.from(playersMap.values()).sort((a, b) => b.maxScore - a.maxScore)
      setSolarePlayers(sortedPlayers)
    } catch (error) {
      console.error('솔라레 플레이어 로딩 오류:', error)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmitSpecialization = async () => {
    if (!selectedPlayer || !selectedSpecClass) {
      alert('플레이어와 클래스를 선택해주세요.')
      return
    }

    setLoading(true)
    try {
      let imageUrl = ''
      
      if (imageFile) {
        const formData = new FormData()
        formData.append('file', imageFile)
        const uploadRes = await fetch('/api/upload/image', {
          method: 'POST',
          body: formData
        })
        const uploadData = await uploadRes.json()
        imageUrl = uploadData.url
      }

      const response = await fetch('/api/admin/solare/specializations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerName: selectedPlayer,
          class: selectedSpecClass,
          specializationImageUrl: imageUrl,
          description
        })
      })

      if (response.ok) {
        alert('특화 정보가 등록되었습니다!')
        setSelectedPlayer('')
        setSelectedSpecClass('')
        setDescription('')
        setImageFile(null)
        setImagePreview(null)
        fetchSpecializations()
        fetchSolarePlayers()
      } else {
        alert('특화 정보 등록에 실패했습니다.')
      }
    } catch (error) {
      console.error('특화 정보 등록 오류:', error)
      alert('특화 정보 등록 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteSpecialization = async (id: number) => {
    if (!confirm('정말 이 특화 정보를 삭제하시겠습니까?')) return

    try {
      const response = await fetch(`/api/admin/solare/specializations`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })

      if (response.ok) {
        alert('특화 정보가 삭제되었습니다.')
        fetchSpecializations()
        fetchSolarePlayers()
      } else {
        alert('특화 정보 삭제에 실패했습니다.')
      }
    } catch (error) {
      console.error('특화 정보 삭제 오류:', error)
      alert('특화 정보 삭제 중 오류가 발생했습니다.')
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
          <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-6">특화 정보 등록</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">플레이어 검색</label>
                <Input
                  value={playerSearch}
                  onChange={(e) => setPlayerSearch(e.target.value)}
                  placeholder="플레이어 이름으로 검색..."
                  className="bg-slate-700/50 text-white border-white/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">플레이어 선택</label>
                <Select value={selectedPlayer} onValueChange={setSelectedPlayer}>
                  <SelectTrigger className="bg-slate-700/50 text-white border-white/20">
                    <SelectValue placeholder="플레이어를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredPlayers.map((player) => (
                      <SelectItem key={player.name} value={player.name}>
                        {player.name} {playersWithSpecialization.has(player.name) && '✓'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">클래스 선택</label>
                <Select value={selectedSpecClass} onValueChange={setSelectedSpecClass}>
                  <SelectTrigger className="bg-slate-700/50 text-white border-white/20">
                    <SelectValue placeholder="클래스를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    {CLASSES.map((cls) => (
                      <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">설명</label>
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="특화에 대한 설명 (선택사항)"
                  className="bg-slate-700/50 text-white border-white/20"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">이미지 업로드</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                />
                {imagePreview && (
                  <img src={imagePreview} alt="미리보기" className="mt-4 max-w-xs rounded-lg border border-white/20" />
                )}
              </div>

              <Button
                onClick={handleSubmitSpecialization}
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-lg"
              >
                {loading ? '등록 중...' : '특화 정보 등록'}
              </Button>
            </div>
          </div>

          {/* 등록된 특화 목록 */}
          <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-6">등록된 특화 정보</h2>
            
            <div className="grid gap-4">
              {specializations.map((spec) => (
                <Card key={spec.id} className="bg-gradient-to-br from-slate-700/60 to-slate-800/60 border border-white/10 p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                      {spec.specialization_image_url && (
                        <img
                          src={spec.specialization_image_url}
                          alt={`${spec.player_name} 특화`}
                          className="w-24 h-24 rounded-lg object-cover border border-white/20"
                        />
                      )}
                      <div>
                        <h3 className="text-xl font-semibold text-white">{spec.player_name}</h3>
                        <p className="text-purple-400 font-medium">{spec.class}</p>
                        {spec.description && (
                          <p className="text-gray-300 mt-2">{spec.description}</p>
                        )}
                        <p className="text-gray-500 text-sm mt-2">
                          수정일: {new Date(spec.updated_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleDeleteSpecialization(spec.id)}
                      className="bg-gradient-to-r from-red-600 to-red-700"
                    >
                      삭제
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


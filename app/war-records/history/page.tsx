'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover'

const NODE_REGION_GROUPS = [
  { label: '발레노스/세렌디아', regions: ['발레노스', '세렌디아'] },
  { label: '칼페온/카마실비아', regions: ['칼페온', '카마실비아'] },
  { label: '메디아/발렌시아', regions: ['메디아', '발렌시아'] },
]
const SIEGE_REGIONS = ['칼페온', '발렌시아', '메디아']
const WAR_TYPES = ['거점전', '점령전']

// 지역별 마크 이미지 매핑
const REGION_IMAGES = {
  '발레노스': '/war-records/balenos.png',
  '세렌디아': '/war-records/Serendia.png',
  '칼페온': '/war-records/calfeon.png',
  '카마실비아': '/war-records/kamasylvia.png',
  '메디아': '/war-records/media.png',
  '발렌시아': '/war-records/balencia.png',
} as const

// 지역 그룹별 대표 마크 (첫 번째 지역의 마크 사용)
const REGION_GROUP_IMAGES = {
  '발레노스/세렌디아': '/war-records/balenos.png',
  '칼페온/카마실비아': '/war-records/calfeon.png',
  '메디아/발렌시아': '/war-records/media.png',
} as const

interface WarRecord {
  id: number
  war_type: string
  war_date: string
  alliance_name: string
  occupied_area: string
  result: string
  fort_stage: number | null
  region: string
}

// 전투 기록 기본 날짜 계산 함수 (KST 기준)
function getDefaultWarDate(): Date {
  const now = new Date()
  const dayOfWeek = now.getDay() // 0=일요일, 6=토요일
  const hour = now.getHours()
  const minute = now.getMinutes()
  
  // 토요일이면 전날 날짜 사용 (점령전만 있음)
  if (dayOfWeek === 6) {
    const prevDay = new Date(now)
    prevDay.setDate(prevDay.getDate() - 1)
    return prevDay
  }

  // 평일 20시 45분 이전이면 전날 날짜 사용
  if (hour < 20 || (hour === 20 && minute < 45)) {
    const prevDay = new Date(now)
    prevDay.setDate(prevDay.getDate() - 1)
    return prevDay
  }
  
  // 20시 45분 ~ 22시는 현재 날짜 (진행중)
  // 22시 이후도 현재 날짜 (완료)
  return now
}

// 점령전용 날짜 계산 함수 (가장 최근 토요일)
function getLatestSiegeDate(): Date {
  const now = new Date()
  const dayOfWeek = now.getDay() // 0=일요일, 6=토요일
  
  // 오늘이 토요일이면 오늘 날짜 반환
  if (dayOfWeek === 6) {
    return now
  }
  
  // 그렇지 않으면 가장 최근 토요일 계산
  const daysToSubtract = dayOfWeek === 0 ? 1 : dayOfWeek + 1 // 일요일이면 1일, 월요일이면 8일, ..., 금요일이면 6일
  const latestSaturday = new Date(now)
  latestSaturday.setDate(now.getDate() - daysToSubtract)
  
  return latestSaturday
}

// 거점전 진행중 여부 확인 함수
function isWarOngoing(): boolean {
  const now = new Date()
  const dayOfWeek = now.getDay() // 0=일요일, 6=토요일
  const hour = now.getHours()
  const minute = now.getMinutes()
  
  // 토요일은 점령전만 있으므로 거점전 진행중 아님
  if (dayOfWeek === 6) return false
  
  // 평일 20시 45분 ~ 22시는 거점전 진행중
  if (hour === 20 && minute >= 45) return true
  if (hour === 21) return true
  if (hour === 22 && minute === 0) return true
  
  return false
}

// 연맹마크 가져오기 함수
async function fetchAllianceMarks(): Promise<Record<string, string>> {
  try {
    const res = await fetch('/api/admin/alliance-marks')
    if (!res.ok) {
      throw new Error('Failed to fetch alliance marks')
    }
    const marks = await res.json()
    return marks.reduce((acc: Record<string, string>, mark: any) => {
      acc[mark.alliance_name] = mark.mark_url
      return acc
    }, {})
  } catch (error) {
    console.error('Error fetching alliance marks:', error)
    return {}
  }
}

export default function WarHistoryPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(getDefaultWarDate())
  const [selectedWarType, setSelectedWarType] = useState('거점전')
  const [selectedRegion, setSelectedRegion] = useState('발레노스/세렌디아')
  const [records, setRecords] = useState<WarRecord[]>([])

  // 연맹마크 데이터 가져오기
  const { data: allianceMarks = {} } = useQuery({
    queryKey: ['alliance-marks'],
    queryFn: fetchAllianceMarks,
    staleTime: 10 * 60 * 1000, // 10분
    gcTime: 30 * 60 * 1000, // 30분
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
  })

  useEffect(() => {
    if (!selectedDate) return

    // 미래 날짜는 데이터를 로드하지 않음 (KST 기준)
    const now = new Date()
    const kstToday = now.toISOString().split('T')[0]
    const selectedDateStr = selectedDate.toISOString().split('T')[0]
    
    if (selectedDateStr > kstToday) {
      setRecords([])
      return
    }

    const regionParam = selectedWarType === '점령전'
      ? selectedRegion
      : NODE_REGION_GROUPS.find(g => g.label === selectedRegion)?.regions.join(',') || selectedRegion

    const query = new URLSearchParams({
      date: format(selectedDate, 'yyyy-MM-dd'),
      region: regionParam,
      war_type: selectedWarType,
    })

    const fetchRecords = async () => {
      try {
        // 거점전 진행중이고 오늘 날짜인 경우 admin에서 설정한 연맹 데이터를 가져옴
        const isOngoing = isWarOngoing() && selectedWarType === '거점전' && selectedDateStr === kstToday

        if (isOngoing) {
          // admin/war-records에서 오늘 날짜의 연맹 데이터 가져오기
          const adminQuery = new URLSearchParams({
            date: format(selectedDate, 'yyyy-MM-dd'),
            region: regionParam,
            war_type: selectedWarType,
          })
          
          const adminRes = await fetch(`/api/admin/war-records/load?${adminQuery}`)
          if (adminRes.ok) {
            const adminData = await adminRes.json()
            if (Array.isArray(adminData) && adminData.length > 0) {
              // admin에서 설정한 연맹들을 그대로 표시 (admin에서 "진행중" 선택 가능)
              const ongoingRecords = adminData
                .filter(record => record.alliance_name && record.alliance_name.trim())
                .map((record, index) => ({
                  id: index + 1000, // 임시 ID
                  war_type: selectedWarType,
                  war_date: selectedDateStr,
                  alliance_name: record.alliance_name,
                  occupied_area: record.occupied_area || '',
                  result: record.result || '진행중',
                  fort_stage: record.fort_stage || null,
                  region: record.region || regionParam.split(',')[0]
                }))
              
              setRecords(ongoingRecords)
              return
            }
          }
        }
        
        // 일반적인 경우: 완료된 전투 기록 가져오기
        const apiUrl = `/api/war-records/history?${query}`
        
        const res = await fetch(apiUrl)
        
        if (!res.ok) {
          throw new Error(`API 요청 실패: ${res.status} ${res.statusText}`)
        }
        
        const json = await res.json()
        
        setRecords(Array.isArray(json) ? json : [])
      } catch (error) {
        console.error('API 호출 에러:', error)
        setRecords([])
        // 사용자에게 에러 알림 (선택사항)
        // alert('전투 기록을 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
      }
    }

    fetchRecords()
  }, [selectedDate, selectedRegion, selectedWarType])

  const renderRegionButtons = () => {
    if (selectedWarType === '점령전') {
      return SIEGE_REGIONS.map(region => (
        <Button
          key={region}
          variant="outline"
          className={`text-white border-white hover:bg-white/10 px-1.5 md:px-4 py-1 md:py-2 text-xs md:text-sm whitespace-nowrap flex items-center gap-1 md:gap-2 ${
            region === selectedRegion ? 'bg-primary text-white' : 'bg-transparent'
          }`}
          onClick={() => setSelectedRegion(region)}
        >
          <img 
            src={REGION_IMAGES[region as keyof typeof REGION_IMAGES]} 
            alt={`${region} 마크`}
            className="w-4 h-4 md:w-5 md:h-5 object-contain"
          />
          <span>{region}</span>
        </Button>
      ))
    }
    return NODE_REGION_GROUPS.map(group => (
      <Button
        key={group.label}
        variant="outline"
        className={`text-white border-white hover:bg-white/10 px-1.5 md:px-4 py-1 md:py-2 text-xs md:text-sm whitespace-nowrap flex items-center gap-1 md:gap-2 ${
          group.label === selectedRegion ? 'bg-primary text-white' : 'bg-transparent'
        }`}
        onClick={() => setSelectedRegion(group.label)}
      >
        <img 
          src={REGION_GROUP_IMAGES[group.label as keyof typeof REGION_GROUP_IMAGES]} 
          alt={`${group.label} 마크`}
          className="w-4 h-4 md:w-5 md:h-5 object-contain"
        />
        <span>{group.label}</span>
      </Button>
    ))
  }

  const groupedRecords = selectedWarType === '거점전'
    ? NODE_REGION_GROUPS.find(g => g.label === selectedRegion)?.regions.reduce((acc, region) => {
        const regionRecords = Array.isArray(records) ? records.filter(r => r.region === region) : []
        // 데이터가 있는 지역만 포함
        if (regionRecords.length > 0) {
          acc[region] = regionRecords
        }
        return acc
      }, {} as Record<string, WarRecord[]>) ?? {}
    : (records.length > 0 ? { [selectedRegion]: records } : {})

  // 새로운 로직: 실제 데이터가 있으면 항상 표시
  const now = new Date()
  const kstToday = now.toISOString().split('T')[0]
  const selectedDateStr = selectedDate ? selectedDate.toISOString().split('T')[0] : ''
  
  const isFutureDate = selectedDateStr > kstToday;
  
  // 실제 데이터가 있으면 항상 표시, 미래 날짜만 숨김
  const isHideTable = isFutureDate;

  return (
    <div className="p-3 md:p-6 max-w-full md:max-w-screen-xl mx-auto">
      {/* 개선된 헤더 섹션 */}
      <div className="mb-8">
        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl border border-slate-600/30 p-6 shadow-xl">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-2xl">📜</span>
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">전투 기록</h1>
                  <p className="text-gray-400 text-sm">과거 전투 결과 및 점령 기록</p>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                {/* 전투 타입 선택과 날짜 선택을 같은 줄에 배치 */}
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                  {/* 전투 타입 선택 */}
                  <div className="flex gap-2">
                    {WAR_TYPES.map(type => (
                      <Button
                        key={type}
                        variant="outline"
                        className={`text-white border-2 font-bold px-3 md:px-4 py-2 md:py-2.5 rounded-xl transition-all duration-200 text-sm md:text-base shadow-lg ${
                          type === selectedWarType 
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-500' 
                            : 'bg-gradient-to-r from-slate-700/80 to-slate-800/80 backdrop-blur-sm border-blue-400 hover:from-slate-600/80 hover:to-slate-700/80 hover:text-blue-300'
                        }`}
                        onClick={() => {
                          setSelectedWarType(type)
                          
                          // 전투 타입에 따라 날짜와 지역 자동 변경
                          if (type === '점령전') {
                            setSelectedDate(getLatestSiegeDate())
                            setSelectedRegion('칼페온')
                          } else if (type === '거점전') {
                            setSelectedDate(getDefaultWarDate())
                            setSelectedRegion('발레노스/세렌디아')
                          }
                        }}
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-lg">{type === '거점전' ? '⚔️' : '🏰'}</span>
                          {type}
                        </span>
                      </Button>
                    ))}
                  </div>
                  
                  {/* 날짜 선택 */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="text-white border-blue-400 border-2 bg-gradient-to-r from-slate-700/80 to-slate-800/80 backdrop-blur-sm hover:from-slate-600/80 hover:to-slate-700/80 hover:text-blue-300 px-3 md:px-4 py-2 md:py-2.5 rounded-xl font-bold transition-all duration-200 text-sm md:text-base shadow-lg">
                        <span className="flex items-center gap-2">
                          <span className="text-lg">📅</span>
                          {selectedDate ? format(selectedDate, 'MM-dd') : '날짜'}
                        </span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(d) => d && setSelectedDate(d)}
                        locale={ko}
                        initialFocus
                        disabled={(date) => {
                          // 미래 날짜는 항상 비활성화
                          const today = new Date()
                          today.setHours(0, 0, 0, 0)
                          if (date > today) return true
                          
                          // 전투 타입별 요일 제한
                          if (selectedWarType === '점령전') {
                            return date.getDay() !== 6
                          } else if (selectedWarType === '거점전') {
                            return date.getDay() === 6
                          }
                          
                          return false
                        }}
                        modifiers={{
                          ...(selectedWarType === '거점전' && {
                            nodeWar: (date) => [1, 2, 3, 4, 5, 0].includes(date.getDay())
                          }),
                          ...(selectedWarType === '점령전' && {
                            siegeWar: (date) => date.getDay() === 6
                          })
                        }}
                        modifiersClassNames={{
                          nodeWar: 'bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold border-2 border-blue-300',
                          siegeWar: 'bg-purple-100 hover:bg-purple-200 text-purple-800 font-semibold border-2 border-purple-300'
                        }}
                        classNames={{
                          day: 'aria-selected:opacity-100 w-8 h-8 flex items-center justify-center',
                          day_selected: 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
                          day_disabled: 'text-gray-400 opacity-50 border-none',
                          cell: 'w-8 h-8 flex items-center justify-center',
                          row: 'flex w-full mt-2 justify-between'
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                {/* 설명 텍스트 */}
                <div className="text-white text-sm text-right">
                  버튼 및 날짜를 클릭해서 변경할 수 있습니다
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* 개선된 지역 선택 섹션 */}
      <div className="mb-8">
        <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm rounded-2xl border border-slate-600/30 p-6 shadow-xl">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
                <span className="text-white text-lg">🗺️</span>
              </div>
              <h2 className="text-xl font-bold text-white">지역 선택</h2>
            </div>
            
            <div className="flex gap-2 md:gap-3 flex-wrap">
              {renderRegionButtons()}
            </div>
          </div>
        </div>
      </div>
      {isHideTable ? (
        selectedWarType === '거점전' ? (
          <div className="flex flex-col items-center justify-center my-12">
            <div className="text-center">
              <div className="text-2xl font-extrabold text-white mb-2 drop-shadow">거점전 진행 예정입니다!</div>
              <div className="text-lg font-medium text-gray-300">거점전은 <span className='font-bold text-blue-400'>21시 ~ 22시</span>에 진행됩니다.</div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center my-12">
            <div className="text-2xl font-extrabold text-white text-center drop-shadow">
              점령전 진행 예정입니다!
            </div>
          </div>
        )
      ) : Object.keys(groupedRecords).length === 0 ? (
        selectedWarType === '거점전' ? (
          <div className="flex flex-col items-center justify-center my-12">
            <div className="text-center">
              <div className="text-2xl font-extrabold text-white mb-2 drop-shadow">해당 날짜에 전투 기록이 없습니다</div>
              <div className="text-lg font-medium text-gray-300">선택한 지역에서 {selectedWarType}이 진행되지 않았습니다.</div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center my-12">
            <div className="text-2xl font-extrabold text-white text-center drop-shadow">
              해당 날짜에 {selectedWarType} 기록이 없습니다
            </div>
          </div>
        )
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedRecords).map(([regionLabel, regionRecords]) => {
            const sortedRecords = [...regionRecords].sort((a, b) => {
              // 1순위: 진행중이 먼저
              if (a.result === '진행중' && b.result !== '진행중') return -1
              if (a.result !== '진행중' && b.result === '진행중') return 1
              
              // 2순위: 점령성공이 먼저 (진행중이 아닌 경우)
              if (a.result === '점령성공' && b.result !== '점령성공') return -1
              if (a.result !== '점령성공' && b.result === '점령성공') return 1
              
              // 3순위: 성채단계 높은순 (5->4->3)
              const aStage = a.fort_stage || 0
              const bStage = b.fort_stage || 0
              if (aStage !== bStage) return bStage - aStage
              
              // 4순위: 연맹명 알파벳순
              return a.alliance_name.localeCompare(b.alliance_name)
            })

            return (
              <section key={regionLabel} className="mb-8">
                {/* 개선된 섹션 헤더 */}
                <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm rounded-2xl border border-slate-600/30 p-6 shadow-xl mb-4">
                  <div className="flex items-center gap-4">
                    {REGION_IMAGES[regionLabel as keyof typeof REGION_IMAGES] && (
                      <div className="w-16 h-16 flex items-center justify-center">
                        <img 
                          src={REGION_IMAGES[regionLabel as keyof typeof REGION_IMAGES]} 
                          alt={`${regionLabel} 마크`}
                          className="w-12 h-12 object-contain"
                        />
                      </div>
                    )}
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-1">
                        {format(selectedDate || new Date(), 'yyyy년 MM월 dd일', { locale: ko })} {regionLabel} {selectedWarType}
                      </h3>
                      <p className="text-gray-400 text-sm">전투 결과 및 점령 기록</p>
                    </div>
                  </div>
                </div>
                
                {/* 개선된 테이블 컨테이너 */}
                <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm rounded-2xl border border-slate-600/30 p-6 shadow-xl">
                  {/* 데스크톱 테이블 */}
                  <div className="hidden md:block">
                    <table className="w-full text-sm table-fixed">
                      <colgroup>
                        <col style={{ width: '28%' }} />
                        <col style={{ width: '28%' }} />
                        <col style={{ width: '22%' }} />
                        <col style={{ width: '22%' }} />
                      </colgroup>
                      <thead>
                        <tr className="border-b border-gray-300 dark:border-slate-700">
                          <th className="px-4 py-3 text-lg font-extrabold dark:text-white text-center">연맹</th>
                          <th className="px-4 py-3 text-lg font-extrabold dark:text-white text-center">지역</th>
                          <th className="px-4 py-3 text-lg font-extrabold dark:text-white text-center">성채단계</th>
                          <th className="px-4 py-3 text-lg font-extrabold dark:text-white text-center">결과</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedRecords.map((rec) => (
                          <tr key={rec.id} className="border-t border-gray-200 dark:border-slate-700/50">
                            <td className="px-4 py-3 dark:text-white font-semibold whitespace-nowrap text-base text-center">
                              <Link 
                                href={`/alliance/${encodeURIComponent(rec.alliance_name)}`}
                                className="hover:text-blue-400 transition-colors duration-200 flex items-center justify-center gap-2"
                              >
                                {allianceMarks[rec.alliance_name] && (
                                  <Image
                                    src={allianceMarks[rec.alliance_name]}
                                    alt={`${rec.alliance_name} 마크`}
                                    width={20}
                                    height={20}
                                    className="w-5 h-5 rounded-full object-cover"
                                  />
                                )}
                                {rec.alliance_name}
                              </Link>
                            </td>
                            <td className="px-4 py-3 dark:text-white text-base whitespace-nowrap font-semibold text-center">
                              <div className="flex items-center justify-center gap-2">
                                {(() => {
                                  // occupied_area가 비어있으면 마크 표시 안함
                                  if (!rec.occupied_area || rec.occupied_area.trim() === '') {
                                    return null
                                  }
                                  const regionName = Object.keys(REGION_IMAGES).find(region => 
                                    rec.occupied_area?.includes(region) || rec.region?.includes(region)
                                  )
                                  return regionName ? (
                                    <img 
                                      src={REGION_IMAGES[regionName as keyof typeof REGION_IMAGES]} 
                                      alt={`${regionName} 마크`}
                                      className="w-4 h-4 object-contain"
                                    />
                                  ) : null
                                })()}
                                <span>{rec.occupied_area}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-center text-blue-600 dark:text-orange-300 text-base font-semibold">{rec.fort_stage ?? '-'}</td>
                            <td className={`px-4 py-3 text-center text-base font-bold ${
                              rec.result === '점령성공' ? 'text-green-600 dark:text-emerald-300' : 
                              rec.result === '진행중' ? 'text-yellow-600 dark:text-yellow-300 animate-pulse' : 
                              'text-red-600 dark:text-red-400'
                            }`}>{rec.result}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* 모바일 카드 레이아웃 */}
                  <div className="md:hidden space-y-2">
                    {sortedRecords.map((rec) => (
                      <div
                        key={rec.id}
                        className="bg-gray-100 dark:!bg-gradient-to-br dark:from-slate-800/50 dark:to-slate-700/50 border border-gray-300 dark:border-slate-600 rounded-lg p-3 dark:shadow-lg war-record-mobile-card"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-semibold text-black dark:text-white text-base truncate max-w-[200px]">
                            <Link 
                              href={`/alliance/${encodeURIComponent(rec.alliance_name)}`}
                              className="hover:text-blue-400 transition-colors duration-200 flex items-center gap-2"
                            >
                              {allianceMarks[rec.alliance_name] && (
                                <Image
                                  src={allianceMarks[rec.alliance_name]}
                                  alt={`${rec.alliance_name} 마크`}
                                  width={20}
                                  height={20}
                                  className="w-5 h-5 rounded-full object-cover flex-shrink-0"
                                />
                              )}
                              <span className="truncate">{rec.alliance_name}</span>
                            </Link>
                          </div>
                          <div className={`px-2 py-0.5 rounded text-xs font-bold ${
                            rec.result === '점령성공' 
                              ? 'bg-emerald-500/20 text-green-600 dark:text-emerald-300 dark:border dark:border-emerald-600/30' 
                              : rec.result === '진행중'
                              ? 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-300 dark:border dark:border-yellow-600/30 animate-pulse'
                              : 'bg-red-500/20 text-red-600 dark:text-red-400 dark:border dark:border-red-600/30'
                          }`}>
                            {rec.result}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div>
                            <div className="text-gray-500 dark:text-gray-400 text-xs">지역</div>
                            <div className="font-semibold text-black dark:text-white text-sm flex items-center gap-1">
                              {(() => {
                                // occupied_area가 비어있으면 마크 표시 안함
                                if (!rec.occupied_area || rec.occupied_area.trim() === '') {
                                  return null
                                }
                                const regionName = Object.keys(REGION_IMAGES).find(region => 
                                  rec.occupied_area?.includes(region) || rec.region?.includes(region)
                                )
                                return regionName ? (
                                  <img 
                                    src={REGION_IMAGES[regionName as keyof typeof REGION_IMAGES]} 
                                    alt={`${regionName} 마크`}
                                    className="w-3 h-3 object-contain"
                                  />
                                ) : null
                              })()}
                              <span>{rec.occupied_area}</span>
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-500 dark:text-gray-400 text-xs">성채단계</div>
                            <div className="font-semibold text-blue-600 dark:text-yellow-300 text-sm">{rec.fort_stage ?? '-'}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )
          })}
        </div>
      )}
    </div>
  )
}

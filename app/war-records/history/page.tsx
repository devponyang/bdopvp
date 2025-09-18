'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
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
  // 시스템이 이미 KST라면 변환 불필요
  const dayOfWeek = now.getDay() // 0=일요일, 6=토요일
  const hour = now.getHours()
  
  // 토요일이거나 평일 22시 이전이면 전날 날짜 사용
  if (dayOfWeek === 6 || hour < 22) {
    const prevDay = new Date(now)
    prevDay.setDate(prevDay.getDate() - 1)
    return prevDay
  }
  
  return now
}


export default function WarHistoryPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(getDefaultWarDate())
  const [selectedWarType, setSelectedWarType] = useState('거점전')
  const [selectedRegion, setSelectedRegion] = useState('발레노스/세렌디아')
  const [records, setRecords] = useState<WarRecord[]>([])

  useEffect(() => {
    if (!selectedDate) return

    // 미래 날짜는 데이터를 로드하지 않음 (KST 기준)
    const now = new Date()
    const kstToday = now.toISOString().split('T')[0]
    const selectedDateStr = selectedDate.toISOString().split('T')[0]
    
    console.log('날짜 비교 디버그:', {
      현재시간: now.toString(),
      오늘날짜: kstToday,
      선택날짜: selectedDateStr,
      미래여부: selectedDateStr > kstToday
    })
    
    if (selectedDateStr > kstToday) {
      console.log('미래 날짜로 판단하여 데이터 로드 중단')
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
        const apiUrl = `/api/war-records/history?${query}`
        console.log('API 요청 URL:', apiUrl)
        
        const res = await fetch(apiUrl)
        console.log('API 응답 상태:', res.status, res.statusText)
        
        if (!res.ok) {
          throw new Error(`API 요청 실패: ${res.status} ${res.statusText}`)
        }
        
        const json = await res.json()
        console.log('API 응답 데이터:', json, '타입:', typeof json, '배열여부:', Array.isArray(json))
        
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
          className={`text-white border-white hover:bg-white/10 px-1.5 md:px-4 py-1 md:py-2 text-xs md:text-sm whitespace-nowrap ${
            region === selectedRegion ? 'bg-primary text-white' : 'bg-transparent'
          }`}
          onClick={() => setSelectedRegion(region)}
        >
          {region}
        </Button>
      ))
    }
    return NODE_REGION_GROUPS.map(group => (
      <Button
        key={group.label}
        variant="outline"
        className={`text-white border-white hover:bg-white/10 px-1.5 md:px-4 py-1 md:py-2 text-xs md:text-sm whitespace-nowrap ${
          group.label === selectedRegion ? 'bg-primary text-white' : 'bg-transparent'
        }`}
        onClick={() => setSelectedRegion(group.label)}
      >
        {group.label}
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
  
  const hasActualData = records.length > 0;
  const isFutureDate = selectedDateStr > kstToday;
  
  // 디버깅 로그
  console.log('Debug - hasActualData:', hasActualData, 'records.length:', records.length)
  console.log('Debug - isFutureDate:', isFutureDate, 'selectedDateStr:', selectedDateStr, 'kstToday:', kstToday)
  
  // 실제 데이터가 있으면 항상 표시, 미래 날짜만 숨김
  const isHideTable = isFutureDate;

  return (
    <div className="p-2 md:p-6 max-w-full md:max-w-screen-xl mx-auto mt-2 md:mt-4">
      <div className="bg-gradient-to-r from-slate-800/50 to-blue-900/50 p-3 md:p-6 rounded-2xl shadow-lg mb-3 md:mb-4">
        <div className="flex flex-col w-full md:flex-row md:items-start md:justify-between">
          <div className="flex-1">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-3 md:mb-4 text-left">
              <span>📜</span>
              <span className="ml-2">전투 기록</span>
            </h2>
          </div>
          <div className="flex flex-row md:flex-row gap-1.5 md:gap-2 md:mt-0 md:ml-4 md:items-start items-center w-full md:w-auto mt-2">
            {WAR_TYPES.map(type => (
              <Button
                key={type}
                variant="outline"
                className={`text-white border-blue-400 hover:bg-blue-400/10 hover:text-blue-300 border-2 font-bold px-2 md:px-3 py-1.5 md:py-2 rounded-lg transition-all duration-150 text-xs md:text-sm ${
                  type === selectedWarType ? 'bg-blue-400 text-black' : 'bg-transparent'
                }`}
                onClick={() => setSelectedWarType(type)}
              >
                {type}
              </Button>
            ))}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="text-white border-blue-400 border-2 bg-transparent hover:bg-blue-400/10 hover:text-blue-300 px-2 md:px-3 py-1.5 md:py-2 rounded-lg font-bold transition-all duration-150 text-xs md:text-sm">
                  {selectedDate ? format(selectedDate, 'MM-dd') : '날짜'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(d) => d && setSelectedDate(d)}
                  locale={ko}
                  initialFocus
                  disabled={
                    selectedWarType === '점령전'
                      ? (date) => date.getDay() !== 6
                      : selectedWarType === '거점전'
                      ? (date) => date.getDay() === 6
                      : undefined
                  }
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
      <div className="flex gap-1 md:gap-2 mb-6 md:mb-8 flex-wrap">
        {renderRegionButtons()}
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
              // 1순위: 점령성공이 먼저
              if (a.result === '점령성공' && b.result !== '점령성공') return -1
              if (a.result !== '점령성공' && b.result === '점령성공') return 1
              
              // 2순위: 성채단계 높은순 (5->4->3)
              const aStage = a.fort_stage || 0
              const bStage = b.fort_stage || 0
              if (aStage !== bStage) return bStage - aStage
              
              // 3순위: 연맹명 알파벳순
              return a.alliance_name.localeCompare(b.alliance_name)
            })

            return (
              <section key={regionLabel} className="transform transition-all hover:scale-[1.01]">
                <h3 className="text-base md:text-3xl font-bold mb-3 md:mb-4 text-white flex items-center gap-2">
                  <span>🗓️</span>
                  <span className="whitespace-nowrap">{format(selectedDate || new Date(), 'yyyy년 MM월 dd일', { locale: ko })} {regionLabel} {selectedWarType}</span>
                </h3>
                <div className="bg-white dark:bg-gradient-to-br dark:from-slate-900/90 dark:to-slate-800/90 rounded-2xl p-3 md:p-6 shadow-xl backdrop-blur-sm">
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
                            <td className="px-4 py-3 dark:text-white font-semibold whitespace-nowrap text-base text-center">{rec.alliance_name}</td>
                            <td className="px-4 py-3 dark:text-white text-base whitespace-nowrap font-semibold text-center">{rec.occupied_area}</td>
                            <td className="px-4 py-3 text-center text-blue-600 dark:text-orange-300 text-base font-semibold">{rec.fort_stage ?? '-'}</td>
                            <td className={`px-4 py-3 text-center text-base font-bold ${rec.result === '점령성공' ? 'text-green-600 dark:text-emerald-300' : 'text-red-600 dark:text-red-400'}`}>{rec.result}</td>
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
                            {rec.alliance_name}
                          </div>
                          <div className={`px-2 py-0.5 rounded text-xs font-bold ${
                            rec.result === '점령성공' 
                              ? 'bg-emerald-500/20 text-green-600 dark:text-emerald-300 dark:border dark:border-emerald-600/30' 
                              : 'bg-red-500/20 text-red-600 dark:text-red-400 dark:border dark:border-red-600/30'
                          }`}>
                            {rec.result}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div>
                            <div className="text-gray-500 dark:text-gray-400 text-xs">지역</div>
                            <div className="font-semibold text-black dark:text-white text-sm">{rec.occupied_area}</div>
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

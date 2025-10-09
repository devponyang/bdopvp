'use client'

import { useState } from 'react'

export default function NotificationTestPage() {
  const [formData, setFormData] = useState({
    alliance_name: '',
    region: '칼페온',
    occupied_area: '',
    fort_stage: '1단계',
    war_type: '거점전',
    tier: '무제한'
  })

  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  const regions = ['칼페온', '메디아', '발렌시아', '발레노스', '세렌디아', '카마실비아']
  const stages = ['1단계', '2단계', '3단계', '4단계', '5단계']
  const tiers = ['무제한', '2단', '1단']
  const warTypes = ['거점전', '성전', '노드전']

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setResult(null)

    try {
      // 실시간 알림 업데이트
      const liveResponse = await fetch('/api/notifications/war-alert/live', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await liveResponse.json()
      if (liveResponse.ok && data.success) {
        setResult(`✅ 실시간 알림 업데이트 성공! OBS에서 확인하세요.`)
      } else if (liveResponse.ok && !data.success) {
        setResult(`⏰ ${data.message}`)
      } else {
        setResult(`❌ 실시간 알림 업데이트 실패: ${data.error}`)
      }
    } catch (error) {
      setResult(`❌ 네트워크 오류: ${error instanceof Error ? error.message : '알 수 없는 오류'}`)
    } finally {
      setIsLoading(false)
    }
  }

  const generateOBSURL = () => {
    return `http://bdopvp.com/api/notifications/war-alert/live`
  }

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">전쟁 알림 테스트</h1>
        
        <div className="bg-slate-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">알림 테스트</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                연맹명 *
              </label>
              <input
                type="text"
                value={formData.alliance_name}
                onChange={(e) => setFormData(prev => ({ ...prev, alliance_name: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-700 text-white rounded-md border border-slate-600 focus:border-blue-500 focus:outline-none"
                placeholder="연맹명을 입력하세요"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  지역 *
                </label>
                <select
                  value={formData.region}
                  onChange={(e) => setFormData(prev => ({ ...prev, region: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-700 text-white rounded-md border border-slate-600 focus:border-blue-500 focus:outline-none"
                >
                  {regions.map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  단계 *
                </label>
                <select
                  value={formData.fort_stage}
                  onChange={(e) => setFormData(prev => ({ ...prev, fort_stage: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-700 text-white rounded-md border border-slate-600 focus:border-blue-500 focus:outline-none"
                >
                  {stages.map(stage => (
                    <option key={stage} value={stage}>{stage}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                점령 지역
              </label>
              <input
                type="text"
                value={formData.occupied_area}
                onChange={(e) => setFormData(prev => ({ ...prev, occupied_area: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-700 text-white rounded-md border border-slate-600 focus:border-blue-500 focus:outline-none"
                placeholder="점령한 지역을 입력하세요"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  전쟁 유형
                </label>
                <select
                  value={formData.war_type}
                  onChange={(e) => setFormData(prev => ({ ...prev, war_type: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-700 text-white rounded-md border border-slate-600 focus:border-blue-500 focus:outline-none"
                >
                  {warTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  티어
                </label>
                <select
                  value={formData.tier}
                  onChange={(e) => setFormData(prev => ({ ...prev, tier: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-700 text-white rounded-md border border-slate-600 focus:border-blue-500 focus:outline-none"
                >
                  {tiers.map(tier => (
                    <option key={tier} value={tier}>{tier}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !formData.alliance_name}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-bold py-2 px-4 rounded-md transition-colors"
            >
              {isLoading ? '전송 중...' : '알림 전송 테스트'}
            </button>
          </form>

          {result && (
            <div className={`mt-4 p-3 rounded-md ${
              result.includes('성공') ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'
            }`}>
              {result}
            </div>
          )}
        </div>

        <div className="bg-slate-800 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">OBS 브라우저 소스 URL</h2>
          <p className="text-gray-300 mb-4">
            OBS Studio에서 브라우저 소스를 추가하고 아래 고정 URL을 사용하세요:
          </p>
          <div className="bg-slate-700 p-3 rounded-md">
            <code className="text-green-400 break-all">
              {generateOBSURL()}
            </code>
          </div>
          <p className="text-sm text-gray-400 mt-2">
            * 브라우저 소스 크기는 600x100으로 설정하세요<br/>
            * 이 URL은 고정되어 있으며, 테스트할 때마다 자동으로 업데이트됩니다<br/>
            * 테스트용으로 시간 제한이 해제되어 있습니다
          </p>
        </div>
      </div>
    </div>
  )
}

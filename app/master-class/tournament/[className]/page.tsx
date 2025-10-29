import { Metadata } from 'next'
import BracketClient from '@/components/master-class/BracketClient'
import { MASTER_CLASS_CLASSES, getClassIcon, getClassBg } from '@/lib/constants/master-class'

interface PageProps {
  params: Promise<{
    className: string
  }>
}

export async function generateStaticParams() {
  return MASTER_CLASS_CLASSES.map((className) => ({
    className: className
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { className } = await params
  return {
    title: `2025 마스터 클래스 ${className} 대진표`,
    description: `검은사막 ${className} 클래스 최강자 대진표 - 2025 마스터 클래스`,
    keywords: ['마스터 클래스', className, '검은사막', 'PvP', '토너먼트'],
  }
}

export default async function MasterClassBracketPage({ params }: PageProps) {
  const { className: encodedClassName } = await params
  const className = decodeURIComponent(encodedClassName)
  const iconName = getClassIcon(className)
  const bgImage = getClassBg(className)
  
  return (
    <div className="p-3 md:p-6 max-w-full md:max-w-[1490px] mx-auto mt-6">
      {/* 헤더 */}
      <div className="relative overflow-hidden rounded-3xl shadow-2xl border border-white/10 mb-8">
        {/* 배경 이미지 */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage: `url('${bgImage}')`,
          }}
        ></div>
        
        {/* 어두운 오버레이 */}
        <div className="absolute inset-0 bg-black/50"></div>
        
        {/* 콘텐츠 */}
        <div className="relative p-3 md:p-8">
          {/* 클래스 아이콘과 제목 */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6">
            {/* 아이콘 */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/30 to-orange-400/30 rounded-xl blur-sm"></div>
              <div className="relative w-20 h-20 md:w-32 md:h-32 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg p-2">
                <img 
                  src={iconName}
                  alt={`${className} 아이콘`}
                  className="w-full h-full object-contain brightness-0 invert"
                />
              </div>
            </div>
            
            {/* 제목 */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center gap-3 mb-2 justify-center md:justify-start">
                <img 
                  src="/icons/masterclass-icon.png" 
                  alt="마스터클래스" 
                  className="w-8 h-8 object-contain"
                />
                <h1 className="text-2xl md:text-4xl font-bold text-white">
                  2025 마스터 클래스
                </h1>
              </div>
              <div className="text-xl md:text-3xl font-bold text-orange-300">
                {className} 클래스 대진표
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 뒤로가기 버튼 */}
      <div className="mb-4">
        <a
          href="/master-class"
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/60 hover:bg-slate-800/80 rounded-lg border border-white/10 text-white transition-colors"
        >
          ← 클래스 선택으로 돌아가기
        </a>
      </div>

      {/* 대진표 */}
      <BracketClient className={className} />
    </div>
  )
}


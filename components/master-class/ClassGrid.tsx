'use client'

import { MASTER_CLASS_CLASSES, getClassIcon, getClassBg } from '@/lib/constants/master-class'

export default function MasterClassGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {MASTER_CLASS_CLASSES.map((className) => {
        const iconPath = getClassIcon(className)
        const bgPath = getClassBg(className)
        
        return (
          <a
            key={className}
            href={`/master-class/tournament/${encodeURIComponent(className)}`}
            className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-white/10 p-4 hover:border-orange-500/50 hover:shadow-lg hover:shadow-orange-500/20 transition-all duration-300"
          >
            {/* 배경 이미지 */}
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-20 group-hover:opacity-30 transition-opacity"
              style={{
                backgroundImage: `url('${bgPath}')`,
              }}
            ></div>
            
            {/* 어두운 오버레이 */}
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors"></div>
            
            {/* 콘텐츠 */}
            <div className="relative flex flex-col items-center gap-2 text-center">
              <img
                src={iconPath}
                alt={className}
                className="w-12 h-12 md:w-16 md:h-16 object-contain brightness-0 invert group-hover:scale-110 transition-transform"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
              <span className="text-white font-semibold text-sm md:text-base group-hover:text-orange-300 transition-colors">
                {className}
              </span>
            </div>
          </a>
        )
      })}
    </div>
  )
}


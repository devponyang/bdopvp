import Link from 'next/link'
import Image from 'next/image'
export default function NotFound(){return <div className="empty-state"><Image src="/ponyang/ponyang-1.png" width={100} height={100} alt="포냥이"/><span className="eyebrow">404 / LOST IN THE BATTLEFIELD</span><h1 className="text-2xl font-bold my-4">길을 잃으셨나요?</h1><p>페이지가 없거나 더 이상 제공되지 않습니다.</p><Link href="/" className="button section-gap">대시보드로 돌아가기</Link></div>}

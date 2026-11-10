import {PageHeading,EmptyState} from '@/components/portal/UI'
export default function Page(){return <><PageHeading label="TOURNAMENT" title="대회 참가 안내" description="대회별 공식 참가 안내를 확인해 주세요."/><div className="panel"><EmptyState title="현재 온라인 참가 접수는 운영하지 않습니다" description="대회가 열리면 대회 페이지에서 접수 방법을 안내합니다."/></div></>}

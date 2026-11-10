import {PageHeading} from '@/components/portal/UI'
export const metadata={title:'문의와 제보'}
export default function Page(){return <><PageHeading label="CONTACT PONYANG" title="문의와 제보" description="더 나은 전장을 함께 만들어 주세요."/><article className="panel prose-panel"><h2>운영자에게 연락하기</h2><p>서비스 오류, 공략 수정, 길드 모집 등록, 광고·후원 문의는 포냥이 디스코드로 접수합니다.</p><a className="button" href="https://discord.gg/mD37c4GEby" target="_blank" rel="noreferrer">디스코드로 이동 ↗</a><h2>오류 제보에 필요한 내용</h2><ul><li>문제가 발생한 페이지 주소</li><li>사용한 기기와 브라우저</li><li>문제를 재현하는 방법과 화면 설명</li></ul><p>비밀번호나 비공개 계정 정보는 보내지 마세요.</p></article></>}

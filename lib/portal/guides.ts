import { guideAuthors } from './guide-authors'

const catalog = [
  { id: '12', name: '매구', title: '각성 매구', component: 'MaeguGuide' },
  { id: '13', name: '위치', title: '각성 위치', component: 'WitchGuide' },
  { id: '14', name: '다크나이트', title: '전승 다크나이트', component: 'DarkKnightGuide' },
  { id: '15', name: '레인저', title: '전승 레인저', component: 'RangerGuide' },
  { id: '16', name: '데드아이', title: '데드아이', component: 'DeadEyeGuide' },
  { id: '17', name: '자이언트', title: '전승 자이언트', component: 'GiantGuide' },
  { id: '18', name: '무사', title: '전승 무사', component: 'WarriorGuide' },
  { id: '19', name: '매구', title: '전승 매구', component: 'MaeguSuccessionGuide' },
  { id: '20', name: '위자드', title: '각성 위자드', component: 'AwakenedWizardGuide' },
  { id: '21', name: '노바', title: '전승 노바', component: 'NovaSuccessionGuide' },
  { id: '22', name: '스칼라', title: '스칼라', component: 'ScholarGuide' },
  { id: '23', name: '란', title: '전승 란', component: 'RanSuccessionGuide' },
  { id: '24', name: '우사', title: '전승 우사', component: 'UsaSuccessionGuide' },
  { id: '25', name: '쿠노이치', title: '전승 쿠노이치', component: 'KunoichiSuccessionGuide' },
  { id: '26', name: '아처', title: '아처', component: 'ArcherGuide' },
  { id: '27', name: '샤이', title: '샤이', component: 'ShaiGuide' },
  { id: '28', name: '발키리', title: '각성 발키리', component: 'AwakenedValkyrieGuide' },
  { id: '29', name: '커세어', title: '각성 커세어', component: 'AwakenedCorsairGuide' },
  { id: '30', name: '하사신', title: '전승 하사신', component: 'HasasinSuccessionGuide' },
  { id: '31', name: '드라카니아', title: '각성 드라카니아', component: 'AwakenedDracaniaGuide' },
  { id: '32', name: '소서러', title: '전승 소서러', component: 'SorcererSuccessionGuide' },
] as const

// Shared by home, library, search, sitemap and the detail route.
export const guides = catalog.filter((guide) => !guideAuthors[guide.id].pending)

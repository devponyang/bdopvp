export type BracketCompetitorType = 'player' | 'winner'

export interface BracketCompetitor {
  type: BracketCompetitorType
  name: string
  referenceMatchId?: string
}

export interface BracketMatch {
  id: string
  label: string
  competitors: [BracketCompetitor, BracketCompetitor]
}

export interface BracketStage {
  id: string
  label: string
  matches: BracketMatch[]
}

export type MasterClassBracketMap = Record<string, BracketStage[]>

export const MASTER_CLASS_BRACKETS: MasterClassBracketMap = {
  란: [
    {
      id: 'round1',
      label: 'Round 1',
      matches: [
        {
          id: 'round1-1',
          label: 'Round1-1',
          competitors: [
            { type: 'player', name: '달야탐주' },
            { type: 'player', name: '쿠로' }
          ]
        },
        {
          id: 'round1-2',
          label: 'Round1-2',
          competitors: [
            { type: 'player', name: '꾸도' },
            { type: 'player', name: 'BLADE' }
          ]
        },
        {
          id: 'round1-3',
          label: 'Round1-3',
          competitors: [
            { type: 'player', name: '리에또' },
            { type: 'player', name: '가엔' }
          ]
        },
        {
          id: 'round1-4',
          label: 'Round1-4',
          competitors: [
            { type: 'player', name: '리애도' },
            { type: 'player', name: '침묵' }
          ]
        },
        {
          id: 'round1-5',
          label: 'Round1-5',
          competitors: [
            { type: 'player', name: '로꼬' },
            { type: 'player', name: '렐링' }
          ]
        },
        {
          id: 'round1-6',
          label: 'Round1-6',
          competitors: [
            { type: 'player', name: '감공' },
            { type: 'player', name: 'IYEONYU' }
          ]
        },
        {
          id: 'round1-7',
          label: 'Round1-7',
          competitors: [
            { type: 'player', name: '레이어디드' },
            { type: 'player', name: '블랙브라민' }
          ]
        },
        {
          id: 'round1-8',
          label: 'Round1-8',
          competitors: [
            { type: 'player', name: '뀨미호' },
            { type: 'player', name: '망주' }
          ]
        }
      ]
    },
    {
      id: 'round2',
      label: 'Round 2',
      matches: [
        {
          id: 'round2-1',
          label: 'Round2-1',
          competitors: [
            { type: 'winner', name: '1-1 승자', referenceMatchId: 'round1-1' },
            { type: 'player', name: '버그이터' }
          ]
        },
        {
          id: 'round2-2',
          label: 'Round2-2',
          competitors: [
            { type: 'winner', name: '1-2 승자', referenceMatchId: 'round1-2' },
            { type: 'player', name: '두살' }
          ]
        },
        {
          id: 'round2-3',
          label: 'Round2-3',
          competitors: [
            { type: 'winner', name: '1-3 승자', referenceMatchId: 'round1-3' },
            { type: 'player', name: '웅좌' }
          ]
        },
        {
          id: 'round2-4',
          label: 'Round2-4',
          competitors: [
            { type: 'winner', name: '1-4 승자', referenceMatchId: 'round1-4' },
            { type: 'player', name: 'Baek' }
          ]
        },
        {
          id: 'round2-5',
          label: 'Round2-5',
          competitors: [
            { type: 'winner', name: '1-5 승자', referenceMatchId: 'round1-5' },
            { type: 'player', name: '러브하우스' }
          ]
        },
        {
          id: 'round2-6',
          label: 'Round2-6',
          competitors: [
            { type: 'winner', name: '1-6 승자', referenceMatchId: 'round1-6' },
            { type: 'player', name: '끄오오오' }
          ]
        },
        {
          id: 'round2-7',
          label: 'Round2-7',
          competitors: [
            { type: 'winner', name: '1-7 승자', referenceMatchId: 'round1-7' },
            { type: 'player', name: '오로로' }
          ]
        },
        {
          id: 'round2-8',
          label: 'Round2-8',
          competitors: [
            { type: 'winner', name: '1-8 승자', referenceMatchId: 'round1-8' },
            { type: 'player', name: '딩스' }
          ]
        }
      ]
    },
    {
      id: 'round3',
      label: 'Round 3',
      matches: [
        {
          id: 'round3-1',
          label: 'Round3-1',
          competitors: [
            { type: 'winner', name: '2-1 승자', referenceMatchId: 'round2-1' },
            { type: 'winner', name: '2-2 승자', referenceMatchId: 'round2-2' }
          ]
        },
        {
          id: 'round3-2',
          label: 'Round3-2',
          competitors: [
            { type: 'winner', name: '2-3 승자', referenceMatchId: 'round2-3' },
            { type: 'winner', name: '2-4 승자', referenceMatchId: 'round2-4' }
          ]
        },
        {
          id: 'round3-3',
          label: 'Round3-3',
          competitors: [
            { type: 'winner', name: '2-5 승자', referenceMatchId: 'round2-5' },
            { type: 'winner', name: '2-6 승자', referenceMatchId: 'round2-6' }
          ]
        },
        {
          id: 'round3-4',
          label: 'Round3-4',
          competitors: [
            { type: 'winner', name: '2-7 승자', referenceMatchId: 'round2-7' },
            { type: 'winner', name: '2-8 승자', referenceMatchId: 'round2-8' }
          ]
        }
      ]
    },
    {
      id: 'semifinal',
      label: 'Semifinal',
      matches: [
        {
          id: 'semifinal-1',
          label: 'Semifinal 1',
          competitors: [
            { type: 'winner', name: '3-1 승자', referenceMatchId: 'round3-1' },
            { type: 'winner', name: '3-2 승자', referenceMatchId: 'round3-2' }
          ]
        },
        {
          id: 'semifinal-2',
          label: 'Semifinal 2',
          competitors: [
            { type: 'winner', name: '3-3 승자', referenceMatchId: 'round3-3' },
            { type: 'winner', name: '3-4 승자', referenceMatchId: 'round3-4' }
          ]
        }
      ]
    },
    {
      id: 'final',
      label: 'Final',
      matches: [
        {
          id: 'final-1',
          label: 'Final',
          competitors: [
            { type: 'winner', name: 'Semifinal 1 승자', referenceMatchId: 'semifinal-1' },
            { type: 'winner', name: 'Semifinal 2 승자', referenceMatchId: 'semifinal-2' }
          ]
        }
      ]
    }
  ]
}



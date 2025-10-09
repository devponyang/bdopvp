// 치지직 알림 시스템
export interface WarNotification {
  alliance_name: string
  region: string
  occupied_area: string
  fort_stage: string
  war_type: string
  war_date: string
  tier: string
}

export interface ChzzkNotifierConfig {
  webhookUrl?: string
  obsWebSocketUrl?: string
  discordWebhookUrl?: string
}

export class ChzzkNotifier {
  private config: ChzzkNotifierConfig

  constructor(config: ChzzkNotifierConfig) {
    this.config = config
  }

  // 전쟁 기록 업데이트 알림 생성
  generateWarNotification(notification: WarNotification): string {
    const { alliance_name, region, fort_stage } = notification
    
    // 지역명 매핑
    const regionMap: Record<string, string> = {
      '칼페온': '칼페온',
      '메디아': '메디아', 
      '발렌시아': '발렌시아',
      '발레노스': '발레노스',
      '세렌디아': '세렌디아',
      '카마실비아': '카마실비아'
    }

    // 단계명 매핑
    const stageMap: Record<string, string> = {
      '1단계': '1단계',
      '2단계': '2단계', 
      '3단계': '3단계',
      '4단계': '4단계',
      '5단계': '5단계'
    }

    const regionName = regionMap[region] || region
    const stageName = stageMap[fort_stage] || fort_stage

    return `${regionName} - ${alliance_name} 연맹이 ${stageName}을 점령하였습니다.`
  }

  // OBS 브라우저 소스용 HTML 생성
  generateOBSNotification(notification: WarNotification): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body {
            margin: 0;
            padding: 20px;
            font-family: 'Noto Sans KR', sans-serif;
            background: linear-gradient(135deg, #1e293b, #0f172a);
            color: white;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
        }
        .notification {
            text-align: center;
            font-size: 24px;
            font-weight: bold;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
            animation: slideIn 0.5s ease-out, fadeOut 0.5s ease-in 4.5s forwards;
        }
        @keyframes slideIn {
            from { transform: translateX(-100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        .alliance-name {
            color: #60a5fa;
        }
        .region-name {
            color: #fbbf24;
        }
        .stage-name {
            color: #f472b6;
        }
    </style>
</head>
<body>
    <div class="notification">
        <span class="region-name">${notification.region}</span>에서 
        <span class="alliance-name">${notification.alliance_name}</span> 연맹이 
        <span class="stage-name">${notification.fort_stage}</span>을 점령하였습니다!
    </div>
    <script>
        // 5초 후 자동으로 사라짐
        setTimeout(() => {
            document.body.style.display = 'none';
        }, 5000);
    </script>
</body>
</html>`
  }

  // Discord 웹훅으로 알림 전송
  async sendDiscordNotification(notification: WarNotification): Promise<boolean> {
    if (!this.config.discordWebhookUrl) return false

    try {
      const message = this.generateWarNotification(notification)
      
      const response = await fetch(this.config.discordWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: message,
          embeds: [{
            title: '🏰 전쟁 기록 업데이트',
            description: message,
            color: 0x3b82f6,
            fields: [
              { name: '지역', value: notification.region, inline: true },
              { name: '연맹', value: notification.alliance_name, inline: true },
              { name: '단계', value: notification.fort_stage, inline: true },
              { name: '전쟁 유형', value: notification.war_type, inline: true },
              { name: '점령 지역', value: notification.occupied_area, inline: true },
              { name: '티어', value: notification.tier, inline: true }
            ],
            timestamp: new Date().toISOString(),
            footer: {
              text: 'BDO Ponyang - 전쟁 기록 시스템'
            }
          }]
        })
      })

      return response.ok
    } catch (error) {
      console.error('Discord 알림 전송 실패:', error)
      return false
    }
  }

  // OBS 웹소켓으로 알림 전송 (OBS Studio 28+)
  async sendOBSNotification(notification: WarNotification): Promise<boolean> {
    if (!this.config.obsWebSocketUrl) return false

    try {
      // OBS 웹소켓을 통한 브라우저 소스 업데이트
      // 실제 구현은 OBS 웹소켓 API 문서 참조 필요
      console.log('OBS 알림 전송:', this.generateWarNotification(notification))
      return true
    } catch (error) {
      console.error('OBS 알림 전송 실패:', error)
      return false
    }
  }

  // 모든 알림 채널로 전송
  async sendNotification(notification: WarNotification): Promise<{
    discord: boolean
    obs: boolean
  }> {
    const [discord, obs] = await Promise.all([
      this.sendDiscordNotification(notification),
      this.sendOBSNotification(notification)
    ])

    return { discord, obs }
  }
}

// 싱글톤 인스턴스
export const chzzkNotifier = new ChzzkNotifier({
  discordWebhookUrl: process.env.DISCORD_WEBHOOK_URL,
  obsWebSocketUrl: process.env.OBS_WEBSOCKET_URL
})

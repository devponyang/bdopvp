import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const DATA_PATH = path.join(process.cwd(), 'traffic.json')

type TrafficData = {
  today: Record<string, number>
  week: Record<string, number>
  month: Record<string, number>
  total: number
}

function getToday() {
  const d = new Date()
  return d.toISOString().slice(0, 10)
}
function getWeek() {
  const d = new Date()
  const first = d.getDate() - d.getDay()
  const weekStart = new Date(d.setDate(first))
  return weekStart.toISOString().slice(0, 10)
}
function getMonth() {
  const d = new Date()
  return d.toISOString().slice(0, 7)
}

export async function GET(_req: NextRequest) {
  let data: TrafficData = { today: {}, week: {}, month: {}, total: 0 }
  if (fs.existsSync(DATA_PATH)) {
    data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'))
  }
  const today = getToday()
  const week = getWeek()
  const month = getMonth()
  return NextResponse.json({
    today: data.today[today] || 0,
    week: data.week[week] || 0,
    month: data.month[month] || 0,
    total: data.total || 0,
  })
}

export async function POST(_req: NextRequest) {
  let data: TrafficData = { today: {}, week: {}, month: {}, total: 0 }
  if (fs.existsSync(DATA_PATH)) {
    data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'))
  }
  const today = getToday()
  const week = getWeek()
  const month = getMonth()
  data.today[today] = (data.today[today] || 0) + 1
  data.week[week] = (data.week[week] || 0) + 1
  data.month[month] = (data.month[month] || 0) + 1
  data.total = (data.total || 0) + 1
  fs.writeFileSync(DATA_PATH, JSON.stringify(data))
  return NextResponse.json({ success: true })
} 
import { useState, useCallback } from 'react'

const STORAGE_KEY = 'nercare_streak_v1'

interface StreakData {
  streak: number
  best: number
  lastDate: string
  lastActivity: string
  weekDates: string[]
  monthDates: string[]
  shownMilestones: number[]
}

const EMPTY: StreakData = {
  streak: 0,
  best: 0,
  lastDate: '',
  lastActivity: '',
  weekDates: [],
  monthDates: [],
  shownMilestones: [],
}

export const MILESTONES = [
  { days: 3,  emoji: '🌱', label: "You're building a lovely routine!" },
  { days: 7,  emoji: '🌿', label: 'One week of memory moments!' },
  { days: 14, emoji: '🌳', label: 'Wonderful consistency!' },
  { days: 30, emoji: '🌸', label: 'A month of memory moments!' },
  { days: 60, emoji: '⭐', label: 'What a wonderful journey!' },
]

export type Milestone = typeof MILESTONES[0]

export function getStreakEmoji(streak: number): string {
  if (streak >= 60) return '⭐'
  if (streak >= 30) return '🌸'
  if (streak >= 14) return '🌳'
  if (streak >= 7)  return '🌿'
  if (streak >= 3)  return '🌱'
  return '🔥'
}

function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

function yesterdayISO() {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().slice(0, 10)
}

function loadData(): StreakData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY
  } catch {
    return EMPTY
  }
}

function saveData(data: StreakData) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)) } catch {}
}

export function getWeekDotDates(): { iso: string; day: string; isToday: boolean }[] {
  const today = new Date()
  const todayStr = today.toISOString().slice(0, 10)
  const dow = today.getDay()
  const monday = new Date(today)
  monday.setDate(today.getDate() - ((dow + 6) % 7))
  return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    const iso = d.toISOString().slice(0, 10)
    return { iso, day, isToday: iso === todayStr }
  })
}

export function useStreak() {
  const [data, setData] = useState<StreakData>(loadData)
  const [milestone, setMilestone] = useState<Milestone | null>(null)

  const today = todayISO()
  const doneToday = data.lastDate === today
  const isReturning = !!data.lastDate && !doneToday && data.lastDate !== yesterdayISO()
  const weekDotDates = getWeekDotDates()
  const monthCount = data.monthDates.filter(d => d.startsWith(today.slice(0, 7))).length

  const recordActivity = useCallback((activityName: string) => {
    const todayStr = todayISO()
    setData(prev => {
      if (prev.lastDate === todayStr) return prev

      const yest = yesterdayISO()
      const newStreak = prev.lastDate === yest ? prev.streak + 1 : 1
      const newBest = Math.max(prev.best, newStreak)
      const newMilestone = MILESTONES.find(m => m.days === newStreak && !prev.shownMilestones.includes(m.days)) ?? null

      const monthPrefix = todayStr.slice(0, 7)
      const next: StreakData = {
        streak: newStreak,
        best: newBest,
        lastDate: todayStr,
        lastActivity: activityName,
        weekDates: [...new Set([...prev.weekDates, todayStr])],
        monthDates: [...new Set([...prev.monthDates.filter(d => d.startsWith(monthPrefix)), todayStr])],
        shownMilestones: newMilestone ? [...prev.shownMilestones, newMilestone.days] : prev.shownMilestones,
      }

      saveData(next)
      if (newMilestone) setTimeout(() => setMilestone(newMilestone), 2200)
      return next
    })
  }, [])

  return {
    streak: data.streak,
    best: data.best,
    doneToday,
    isReturning,
    weekDotDates,
    weekDates: data.weekDates,
    monthCount,
    lastActivity: data.lastActivity,
    milestone,
    clearMilestone: () => setMilestone(null),
    recordActivity,
  }
}

export function readStreakForDisplay() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const d: StreakData = { ...EMPTY, ...JSON.parse(raw) }
    const today = todayISO()
    return {
      streak: d.streak,
      best: d.best,
      doneToday: d.lastDate === today,
      lastActivity: d.lastActivity,
      monthCount: d.monthDates.filter(x => x.startsWith(today.slice(0, 7))).length,
    }
  } catch { return null }
}

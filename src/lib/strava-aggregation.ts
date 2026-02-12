"use client"

import type { StravaActivity } from "./strava-client"
import { metersToMiles, speedToPace, fetchStravaActivities } from "./strava-client"
import { getWeekStart } from "./client-data"

export interface StravaWeeklySummary {
  weekStart: string // ISO date
  totalMiles: number
  totalRuns: number
  avgPace: string // "8:45"
  longestRun: number
  activities: StravaActivity[]
}

/**
 * Fetch Strava data for a client and aggregate by week
 */
export async function fetchClientStravaData(
  clientEmail: string,
  weeksBack: number = 4
): Promise<StravaWeeklySummary[]> {
  try {
    const daysBack = weeksBack * 7
    const activities = await fetchStravaActivities(clientEmail, daysBack)

    // Filter for running activities only
    const runs = activities.filter(a => a.type === "Run")

    // Group by week
    const weekMap = new Map<string, StravaActivity[]>()

    runs.forEach(activity => {
      const activityDate = new Date(activity.start_date)
      const weekStart = getWeekStart(activityDate)
      const weekKey = weekStart.toISOString().split("T")[0]

      if (!weekMap.has(weekKey)) {
        weekMap.set(weekKey, [])
      }
      weekMap.get(weekKey)!.push(activity)
    })

    // Build weekly summaries
    const summaries: StravaWeeklySummary[] = []

    // Generate weeks going back from today
    const today = new Date()
    for (let i = 1; i <= weeksBack; i++) {
      const weekDate = new Date(today)
      weekDate.setDate(weekDate.getDate() - (i * 7))
      const weekStart = getWeekStart(weekDate)
      const weekKey = weekStart.toISOString().split("T")[0]

      const weekActivities = weekMap.get(weekKey) || []

      const totalMiles = weekActivities.reduce((sum, a) => sum + metersToMiles(a.distance), 0)
      const totalMovingTime = weekActivities.reduce((sum, a) => sum + a.moving_time, 0)
      const avgSpeed = totalMovingTime > 0 ? weekActivities.reduce((sum, a) => sum + a.average_speed, 0) / weekActivities.length : 0
      const longestRun = weekActivities.length > 0 ? Math.max(...weekActivities.map(a => metersToMiles(a.distance))) : 0

      summaries.push({
        weekStart: weekKey,
        totalMiles: Math.round(totalMiles * 10) / 10,
        totalRuns: weekActivities.length,
        avgPace: speedToPace(avgSpeed),
        longestRun: Math.round(longestRun * 10) / 10,
        activities: weekActivities,
      })
    }

    return summaries.reverse() // Oldest to newest
  } catch (error) {
    console.error("Error fetching Strava data:", error)
    // Return empty summaries if Strava fetch fails
    return []
  }
}

/**
 * Match planned schedule to actual Strava activities
 */
export function matchScheduleToStrava(
  schedule: Record<string, any>,
  stravaActivities: StravaActivity[]
): {
  completed: number
  total: number
  completionRate: number
  variance: { planned: number; actual: number; day: string }[]
} {
  const variance: { planned: number; actual: number; day: string }[] = []
  let completed = 0
  let total = 0

  // Create map of activities by date
  const activityMap = new Map<string, StravaActivity[]>()
  stravaActivities.forEach(activity => {
    const date = activity.start_date.split("T")[0]
    if (!activityMap.has(date)) {
      activityMap.set(date, [])
    }
    activityMap.get(date)!.push(activity)
  })

  // Compare each scheduled day
  Object.keys(schedule).forEach(dateKey => {
    const workout = schedule[dateKey]
    if (!workout || !workout.distance) return

    const plannedMiles = parseFloat(workout.distance) || 0
    if (plannedMiles === 0) return // Skip rest days

    total++

    const dayActivities = activityMap.get(dateKey) || []
    const actualMiles = dayActivities.reduce((sum, a) => sum + metersToMiles(a.distance), 0)

    variance.push({
      day: dateKey,
      planned: Math.round(plannedMiles * 10) / 10,
      actual: Math.round(actualMiles * 10) / 10,
    })

    // Consider completed if within 80-120% of planned distance
    if (actualMiles >= plannedMiles * 0.8 && actualMiles <= plannedMiles * 1.2) {
      completed++
    }
  })

  return {
    completed,
    total,
    completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    variance,
  }
}

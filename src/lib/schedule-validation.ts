"use client"

import type { Workout, TrainingWeek } from "./client-data"

export interface ValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
}

/**
 * Validate a generated schedule for completeness and safety
 */
export function validateGeneratedSchedule(schedule: any): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  // Check that schedule is an object
  if (typeof schedule !== "object" || schedule === null) {
    errors.push("Schedule must be an object")
    return { valid: false, errors, warnings }
  }

  // Required days
  const requiredDays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]

  for (const day of requiredDays) {
    if (!schedule[day]) {
      errors.push(`Missing ${day} in schedule`)
      continue
    }

    const workout = schedule[day]

    // Check workout structure
    if (typeof workout !== "object") {
      errors.push(`${day} workout must be an object`)
      continue
    }

    // Validate distance
    if (workout.distance === undefined || workout.distance === null) {
      errors.push(`${day} missing distance field`)
    } else {
      const distance = parseFloat(workout.distance)
      if (isNaN(distance)) {
        errors.push(`${day} has invalid distance: ${workout.distance}`)
      } else if (distance < 0) {
        errors.push(`${day} has negative distance: ${distance}`)
      } else if (distance > 30) {
        warnings.push(`${day} has unusually high distance: ${distance} miles`)
      }
    }

    // Validate pace (optional but should be string)
    if (workout.pace !== undefined && typeof workout.pace !== "string") {
      warnings.push(`${day} pace should be a string`)
    }

    // Validate notes (optional but should be string)
    if (workout.notes !== undefined && typeof workout.notes !== "string") {
      warnings.push(`${day} notes should be a string`)
    }
  }

  // Calculate weekly mileage
  const weeklyMileage = requiredDays.reduce((total, day) => {
    if (schedule[day] && schedule[day].distance) {
      const distance = parseFloat(schedule[day].distance)
      if (!isNaN(distance)) {
        return total + distance
      }
    }
    return total
  }, 0)

  // Check for reasonable weekly volume
  if (weeklyMileage > 100) {
    warnings.push(`Weekly mileage is very high: ${weeklyMileage} miles`)
  }

  // Check for at least one rest day
  const restDays = requiredDays.filter(day => {
    if (schedule[day] && schedule[day].distance) {
      const distance = parseFloat(schedule[day].distance)
      return distance === 0 || isNaN(distance)
    }
    return true
  })

  if (restDays.length === 0) {
    warnings.push("No rest days scheduled - consider adding at least one")
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  }
}

/**
 * Sanitize and normalize a workout object
 */
export function sanitizeWorkout(workout: Partial<Workout>): Workout {
  return {
    distance: workout.distance?.toString() || "0",
    pace: workout.pace?.toString() || "",
    notes: workout.notes?.toString() || "",
  }
}

/**
 * Calculate training load for a weekly schedule
 * Simple metric: total mileage + bonus for hard workouts
 */
export function calculateWeeklyLoad(schedule: Record<string, Workout>): number {
  let load = 0

  Object.values(schedule).forEach(workout => {
    if (!workout) return

    const distance = parseFloat(workout.distance) || 0
    load += distance

    // Add extra load for intensity (detected by keywords in notes)
    const notes = workout.notes.toLowerCase()
    if (notes.includes("tempo") || notes.includes("threshold")) {
      load += distance * 0.3 // 30% extra load for tempo
    } else if (notes.includes("interval") || notes.includes("speed") || notes.includes("5k pace")) {
      load += distance * 0.5 // 50% extra load for intervals
    } else if (notes.includes("long run")) {
      load += distance * 0.2 // 20% extra load for long runs
    }
  })

  return Math.round(load * 10) / 10
}

/**
 * Detect potential overtraining by comparing to recent history
 */
export function detectOvertraining(
  schedule: Record<string, Workout>,
  history: TrainingWeek[]
): {
  overtraining: boolean
  reason?: string
  recommendation?: string
} {
  if (history.length === 0) {
    return { overtraining: false }
  }

  const newLoad = calculateWeeklyLoad(schedule)

  // Calculate average load from history
  const avgHistoricalLoad = history.reduce((sum, week) => {
    return sum + calculateWeeklyLoad(week.schedule)
  }, 0) / history.length

  // Calculate max load from history
  const maxHistoricalLoad = Math.max(...history.map(week => calculateWeeklyLoad(week.schedule)))

  // Check for excessive jump (>10% increase)
  const increasePercent = ((newLoad - avgHistoricalLoad) / avgHistoricalLoad) * 100

  if (increasePercent > 15) {
    return {
      overtraining: true,
      reason: `Weekly load increased by ${increasePercent.toFixed(1)}% (should be max 10%)`,
      recommendation: `Reduce to ${(avgHistoricalLoad * 1.1).toFixed(1)} total load`,
    }
  }

  // Check for consecutive high-load weeks
  if (history.length >= 3) {
    const recentHighLoadWeeks = history.slice(0, 3).filter(week => {
      const load = calculateWeeklyLoad(week.schedule)
      return load > avgHistoricalLoad * 0.9 // Within 90% of average is "high"
    })

    if (recentHighLoadWeeks.length >= 2 && newLoad > avgHistoricalLoad * 0.9) {
      return {
        overtraining: true,
        reason: "Three consecutive high-load weeks detected",
        recommendation: "Consider a recovery week with reduced volume",
      }
    }
  }

  return { overtraining: false }
}

/**
 * Check if schedule follows basic training principles
 */
export function checkTrainingPrinciples(schedule: Record<string, Workout>): {
  passed: boolean
  violations: string[]
} {
  const violations: string[] = []

  const days = Object.keys(schedule).sort()
  let consecutiveHardDays = 0
  let hardDayCount = 0

  days.forEach((day, index) => {
    const workout = schedule[day]
    if (!workout) return

    const distance = parseFloat(workout.distance) || 0
    const notes = workout.notes.toLowerCase()

    // Check if it's a hard day
    const isHard =
      notes.includes("tempo") ||
      notes.includes("threshold") ||
      notes.includes("interval") ||
      notes.includes("speed") ||
      notes.includes("long run") ||
      distance > 12

    if (isHard) {
      hardDayCount++
      consecutiveHardDays++

      if (consecutiveHardDays > 2) {
        violations.push("More than 2 consecutive hard days detected")
      }
    } else {
      consecutiveHardDays = 0
    }
  })

  // Check 80/20 rule (hard days should be ~20% of total = max 2 hard days per week)
  if (hardDayCount > 3) {
    violations.push(`Too many hard days (${hardDayCount}) - violates 80/20 rule`)
  }

  return {
    passed: violations.length === 0,
    violations,
  }
}

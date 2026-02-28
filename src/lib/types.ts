// Shared type definitions — no "use client" or "use server" directive
// so these can be imported from both server and client modules

export interface Client {
  email: string
  name: string
  password: string
  stravaConnected?: boolean
  stravaAthleteId?: string
}

export interface RaceGoal {
  id: string
  date: string // ISO date
  type: string // "5K", "10K", "Half Marathon", "Marathon"
  targetTime?: string
  priority: "A" | "B" | "C" // A = primary, B = secondary, C = training
  notes?: string
}

export interface InjuryRecord {
  id: string
  date: string
  description: string
  status: "active" | "recovering" | "healed"
  affectedAreas: string[]
  notes?: string
}

export interface WeeklyCheckIn {
  weekStart: string // ISO date
  bodyFeeling: 1 | 2 | 3 | 4 | 5 // 1 = terrible, 5 = excellent
  sleepQuality: 1 | 2 | 3 | 4 | 5
  stressLevel: 1 | 2 | 3 | 4 | 5
  notes: string
  createdAt: string
}

export interface TrainingWeek {
  weekStart: string
  schedule: Record<string, Workout>
  totalMiles: number
  workoutCount: number
}

export interface Workout {
  distance: string
  pace: string
  notes: string
}

export interface CoachNote {
  title: string
  content: string
  date: string
}

export interface Update {
  title: string
  content: string
  date: string
}

"use client"

// Client data management utilities
// Compatible with localStorage-based system (same as client dashboard)

export type {
  Client,
  RaceGoal,
  InjuryRecord,
  WeeklyCheckIn,
  TrainingWeek,
  Workout,
  CoachNote,
  Update,
} from "./types"

// Client Management
export function getAllClients(): Record<string, Client> {
  if (typeof window === "undefined") return {}
  
  const clients = localStorage.getItem("clientCredentials")
  if (!clients) return {}
  
  try {
    return JSON.parse(clients)
  } catch {
    return {}
  }
}

export function saveClient(client: Client) {
  if (typeof window === "undefined") return
  
  const clients = getAllClients()
  clients[client.email.toLowerCase()] = {
    email: client.email.toLowerCase(),
    name: client.name,
    password: client.password,
  }
  localStorage.setItem("clientCredentials", JSON.stringify(clients))
}

export function deleteClient(email: string) {
  if (typeof window === "undefined") return
  
  const clients = getAllClients()
  delete clients[email.toLowerCase()]
  localStorage.setItem("clientCredentials", JSON.stringify(clients))
  
  // Delete all client data
  const prefix = `client_${email.toLowerCase()}_`
  const keysToRemove: string[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.startsWith(prefix)) {
      keysToRemove.push(key)
    }
  }
  keysToRemove.forEach((key) => localStorage.removeItem(key))
}

// Schedule Management
export function getClientSchedule(clientEmail: string, weekStart: Date): Record<string, Workout> {
  if (typeof window === "undefined") return {}
  
  const key = `client_${clientEmail.toLowerCase()}_schedule_${formatDateKey(weekStart)}`
  const schedule = localStorage.getItem(key)
  if (!schedule) return {}
  
  try {
    return JSON.parse(schedule)
  } catch {
    return {}
  }
}

export function saveClientSchedule(
  clientEmail: string,
  weekStart: Date,
  schedule: Record<string, Workout>
) {
  if (typeof window === "undefined") return
  
  const key = `client_${clientEmail.toLowerCase()}_schedule_${formatDateKey(weekStart)}`
  localStorage.setItem(key, JSON.stringify(schedule))
}

// Notes Management
export function getClientNotes(clientEmail: string): CoachNote[] {
  if (typeof window === "undefined") return []
  
  const key = `client_${clientEmail.toLowerCase()}_notes`
  const notes = localStorage.getItem(key)
  if (!notes) return []
  
  try {
    return JSON.parse(notes)
  } catch {
    return []
  }
}

export function addClientNote(clientEmail: string, note: CoachNote) {
  if (typeof window === "undefined") return
  
  const notes = getClientNotes(clientEmail)
  notes.unshift(note) // Add to beginning
  const key = `client_${clientEmail.toLowerCase()}_notes`
  localStorage.setItem(key, JSON.stringify(notes))
}

export function deleteClientNote(clientEmail: string, noteIndex: number) {
  if (typeof window === "undefined") return
  
  const notes = getClientNotes(clientEmail)
  notes.splice(noteIndex, 1)
  const key = `client_${clientEmail.toLowerCase()}_notes`
  localStorage.setItem(key, JSON.stringify(notes))
}

// Updates Management
export function getClientUpdates(clientEmail: string): Update[] {
  if (typeof window === "undefined") return []
  
  const key = `client_${clientEmail.toLowerCase()}_updates`
  const updates = localStorage.getItem(key)
  if (!updates) return []
  
  try {
    return JSON.parse(updates)
  } catch {
    return []
  }
}

export function addClientUpdate(clientEmail: string, update: Update) {
  if (typeof window === "undefined") return
  
  const updates = getClientUpdates(clientEmail)
  updates.unshift(update) // Add to beginning
  const key = `client_${clientEmail.toLowerCase()}_updates`
  localStorage.setItem(key, JSON.stringify(updates))
}

export function deleteClientUpdate(clientEmail: string, updateIndex: number) {
  if (typeof window === "undefined") return
  
  const updates = getClientUpdates(clientEmail)
  updates.splice(updateIndex, 1)
  const key = `client_${clientEmail.toLowerCase()}_updates`
  localStorage.setItem(key, JSON.stringify(updates))
}

// Helper Functions
function formatDateKey(date: Date): string {
  return date.toISOString().split("T")[0]
}

export function getWeekStart(date: Date = new Date()): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1) // Monday
  return new Date(d.setDate(diff))
}

export function getWeekDays(weekStart: Date): Date[] {
  const days: Date[] = []
  for (let i = 0; i < 7; i++) {
    const day = new Date(weekStart)
    day.setDate(weekStart.getDate() + i)
    days.push(day)
  }
  return days
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

// Client Profile Management
export function getClientProfile(email: string): Client | null {
  if (typeof window === "undefined") return null

  const clients = getAllClients()
  return clients[email.toLowerCase()] || null
}

export function updateClientProfile(email: string, updates: Partial<Client>): void {
  if (typeof window === "undefined") return

  const clients = getAllClients()
  const client = clients[email.toLowerCase()]
  if (!client) return

  clients[email.toLowerCase()] = { ...client, ...updates }
  localStorage.setItem("clientCredentials", JSON.stringify(clients))
}

// Race Goal Management
export function getClientRaceGoals(email: string): RaceGoal[] {
  if (typeof window === "undefined") return []

  const key = `client_${email.toLowerCase()}_race_goals`
  const goals = localStorage.getItem(key)
  if (!goals) return []

  try {
    return JSON.parse(goals)
  } catch {
    return []
  }
}

export function addClientRaceGoal(email: string, goal: RaceGoal): void {
  if (typeof window === "undefined") return

  const goals = getClientRaceGoals(email)
  goals.push(goal)
  const key = `client_${email.toLowerCase()}_race_goals`
  localStorage.setItem(key, JSON.stringify(goals))
}

export function updateClientRaceGoal(email: string, goalId: string, updates: Partial<RaceGoal>): void {
  if (typeof window === "undefined") return

  const goals = getClientRaceGoals(email)
  const index = goals.findIndex(g => g.id === goalId)
  if (index === -1) return

  goals[index] = { ...goals[index], ...updates }
  const key = `client_${email.toLowerCase()}_race_goals`
  localStorage.setItem(key, JSON.stringify(goals))
}

export function deleteClientRaceGoal(email: string, goalId: string): void {
  if (typeof window === "undefined") return

  const goals = getClientRaceGoals(email)
  const filtered = goals.filter(g => g.id !== goalId)
  const key = `client_${email.toLowerCase()}_race_goals`
  localStorage.setItem(key, JSON.stringify(filtered))
}

// Injury Management
export function getClientInjuries(email: string): InjuryRecord[] {
  if (typeof window === "undefined") return []

  const key = `client_${email.toLowerCase()}_injuries`
  const injuries = localStorage.getItem(key)
  if (!injuries) return []

  try {
    return JSON.parse(injuries)
  } catch {
    return []
  }
}

export function addClientInjury(email: string, injury: InjuryRecord): void {
  if (typeof window === "undefined") return

  const injuries = getClientInjuries(email)
  injuries.unshift(injury)
  const key = `client_${email.toLowerCase()}_injuries`
  localStorage.setItem(key, JSON.stringify(injuries))
}

export function updateClientInjury(email: string, injuryId: string, updates: Partial<InjuryRecord>): void {
  if (typeof window === "undefined") return

  const injuries = getClientInjuries(email)
  const index = injuries.findIndex(i => i.id === injuryId)
  if (index === -1) return

  injuries[index] = { ...injuries[index], ...updates }
  const key = `client_${email.toLowerCase()}_injuries`
  localStorage.setItem(key, JSON.stringify(injuries))
}

export function deleteClientInjury(email: string, injuryId: string): void {
  if (typeof window === "undefined") return

  const injuries = getClientInjuries(email)
  const filtered = injuries.filter(i => i.id !== injuryId)
  const key = `client_${email.toLowerCase()}_injuries`
  localStorage.setItem(key, JSON.stringify(filtered))
}

// Weekly Check-In Management
export function getClientCheckIns(email: string): WeeklyCheckIn[] {
  if (typeof window === "undefined") return []

  const key = `client_${email.toLowerCase()}_checkins`
  const checkIns = localStorage.getItem(key)
  if (!checkIns) return []

  try {
    return JSON.parse(checkIns)
  } catch {
    return []
  }
}

export function addClientCheckIn(email: string, checkIn: WeeklyCheckIn): void {
  if (typeof window === "undefined") return

  const checkIns = getClientCheckIns(email)
  checkIns.unshift(checkIn)
  const key = `client_${email.toLowerCase()}_checkins`
  localStorage.setItem(key, JSON.stringify(checkIns))
}

export function getLatestCheckIn(email: string): WeeklyCheckIn | null {
  const checkIns = getClientCheckIns(email)
  return checkIns.length > 0 ? checkIns[0] : null
}

// Training History
export function getTrainingHistory(email: string, weekCount: number = 8): TrainingWeek[] {
  if (typeof window === "undefined") return []

  const history: TrainingWeek[] = []
  const today = new Date()

  for (let i = 1; i <= weekCount; i++) {
    const weekDate = new Date(today)
    weekDate.setDate(weekDate.getDate() - (i * 7))
    const weekStart = getWeekStart(weekDate)

    const schedule = getClientSchedule(email, weekStart)
    const totalMiles = calculateTotalMileage(schedule)
    const workoutCount = Object.keys(schedule).filter(key => {
      const workout = schedule[key]
      return workout && parseFloat(workout.distance) > 0
    }).length

    history.push({
      weekStart: formatDateKey(weekStart),
      schedule,
      totalMiles,
      workoutCount,
    })
  }

  return history
}

export function calculateTotalMileage(schedule: Record<string, Workout>): number {
  let total = 0
  Object.values(schedule).forEach(workout => {
    if (workout && workout.distance) {
      const miles = parseFloat(workout.distance)
      if (!isNaN(miles)) {
        total += miles
      }
    }
  })
  return Math.round(total * 10) / 10 // Round to 1 decimal
}

export function getNextRace(email: string): RaceGoal | null {
  const goals = getClientRaceGoals(email)
  if (goals.length === 0) return null

  const today = new Date()
  const upcomingRaces = goals
    .filter(goal => new Date(goal.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return upcomingRaces.length > 0 ? upcomingRaces[0] : null
}

export function getActiveInjuries(email: string): InjuryRecord[] {
  const injuries = getClientInjuries(email)
  return injuries.filter(i => i.status === "active" || i.status === "recovering")
}



"use client"

// Client data management utilities
// Compatible with localStorage-based system (same as client dashboard)

export interface Client {
  email: string
  name: string
  password: string
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


"use client"

// Coach authentication utilities

const COACH_PASSWORD_KEY = "coachPassword"
export const DEFAULT_COACH_PASSWORD = "coach2024" // CHANGE THIS!

export function checkCoachAuth(): boolean {
  if (typeof window === "undefined") return false
  
  const storedPassword = localStorage.getItem(COACH_PASSWORD_KEY)
  return storedPassword === DEFAULT_COACH_PASSWORD
}

export function setCoachPassword(password: string) {
  if (typeof window === "undefined") return
  localStorage.setItem(COACH_PASSWORD_KEY, password)
}

export function clearCoachAuth() {
  if (typeof window === "undefined") return
  localStorage.removeItem(COACH_PASSWORD_KEY)
}

export function isCoachAuthenticated(): boolean {
  return checkCoachAuth()
}


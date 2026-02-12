"use client"

// Strava integration utilities for Coach dashboard
// Allows coach to connect client Strava accounts

const STRAVA_CLIENT_ID = "191041"

// Get redirect URI - must match exactly what's configured in Strava app settings
function getRedirectUri(): string {
  if (typeof window === "undefined") return ""

  const origin = window.location.origin
  const redirectUri = `${origin}/api/strava/callback`

  console.log("Strava redirect URI:", redirectUri)
  return redirectUri
}

export interface StravaToken {
  access_token: string
  refresh_token: string
  expires_at: number
  athlete: {
    id: number
    username?: string
    firstname?: string
    lastname?: string
  }
}

export interface StravaActivity {
  id: number
  name: string
  distance: number // meters
  moving_time: number // seconds
  elapsed_time: number
  type: string // "Run", "Ride", etc.
  start_date: string
  average_speed: number
  max_speed: number
  average_heartrate?: number
  max_heartrate?: number
  total_elevation_gain: number
}

// Coach-specific: Store token keyed by client email
export function getStravaToken(clientEmail: string): StravaToken | null {
  if (typeof window === "undefined") return null

  const key = `coach_strava_${clientEmail.toLowerCase()}`
  const tokenData = localStorage.getItem(key)
  if (!tokenData) return null

  try {
    const token = JSON.parse(tokenData)
    // Check if token is expired
    if (token.expires_at && token.expires_at * 1000 < Date.now()) {
      console.log("Strava token expired for", clientEmail)
      return null
    }
    return token
  } catch (error) {
    console.error("Error parsing Strava token:", error)
    return null
  }
}

export function setStravaToken(clientEmail: string, token: StravaToken) {
  if (typeof window === "undefined") return

  const key = `coach_strava_${clientEmail.toLowerCase()}`
  localStorage.setItem(key, JSON.stringify(token))
  console.log("Strava token stored for", clientEmail)
}

export function clearStravaToken(clientEmail: string) {
  if (typeof window === "undefined") return

  const key = `coach_strava_${clientEmail.toLowerCase()}`
  localStorage.removeItem(key)
}

export function isStravaConnected(clientEmail: string): boolean {
  return getStravaToken(clientEmail) !== null
}

export function getStravaAuthUrl(clientEmail: string): string {
  const scope = "read,activity:read_all"
  const redirectUri = getRedirectUri()

  if (!redirectUri) {
    throw new Error("Cannot determine redirect URI. Please ensure you're accessing the app from a browser.")
  }

  const encodedRedirectUri = encodeURIComponent(redirectUri)

  // Store client email in state parameter to associate token after OAuth
  const state = encodeURIComponent(JSON.stringify({ clientEmail }))

  const authUrl = `https://www.strava.com/oauth/authorize?client_id=${STRAVA_CLIENT_ID}&redirect_uri=${encodedRedirectUri}&response_type=code&scope=${scope}&state=${state}&approval_prompt=force`

  return authUrl
}

export async function exchangeCodeForToken(code: string, clientEmail: string): Promise<StravaToken> {
  try {
    const response = await fetch(`/api/strava/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code, clientEmail }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Unknown error" }))
      console.error("Token exchange error:", error)
      throw new Error(error.error || error.message || `Failed to exchange token: ${response.status}`)
    }

    const data = await response.json()

    if (!data.access_token || !data.refresh_token) {
      throw new Error("Invalid token response from Strava")
    }

    const token: StravaToken = {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_at: data.expires_at || Date.now() / 1000 + 21600,
      athlete: data.athlete || {},
    }

    // Store token
    setStravaToken(clientEmail, token)

    return token
  } catch (error) {
    console.error("Error exchanging code for token:", error)
    throw error
  }
}

export async function refreshStravaToken(clientEmail: string, refreshToken: string): Promise<StravaToken> {
  const response = await fetch("/api/strava/refresh", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh_token: refreshToken }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to refresh token")
  }

  const data = await response.json()
  const token: StravaToken = {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: Date.now() / 1000 + data.expires_in,
    athlete: {} as any,
  }

  setStravaToken(clientEmail, token)
  return token
}

export async function fetchStravaActivities(
  clientEmail: string,
  daysBack: number = 28
): Promise<StravaActivity[]> {
  const token = getStravaToken(clientEmail)
  if (!token) {
    throw new Error("No Strava token found for client")
  }

  const after = Math.floor(Date.now() / 1000) - (daysBack * 24 * 60 * 60)

  const response = await fetch(`/api/strava/activities?access_token=${token.access_token}&after=${after}`)

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to fetch activities")
  }

  const data = await response.json()
  return data.activities || []
}

// Convert meters to miles
export function metersToMiles(meters: number): number {
  return meters * 0.000621371
}

// Convert meters/second to min/mile pace
export function speedToPace(metersPerSecond: number): string {
  if (metersPerSecond === 0) return "0:00"

  const milesPerHour = metersPerSecond * 2.23694
  const minutesPerMile = 60 / milesPerHour
  const minutes = Math.floor(minutesPerMile)
  const seconds = Math.round((minutesPerMile - minutes) * 60)

  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

import { NextRequest, NextResponse } from 'next/server'

const STRAVA_CLIENT_ID = process.env.STRAVA_CLIENT_ID || '191041'
const STRAVA_CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET || '687d19ec3c8800010c1e31a6b44c7df13b64d2d7'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code, clientEmail } = body

    if (!code) {
      return NextResponse.json(
        { error: 'Authorization code required' },
        { status: 400 }
      )
    }

    if (!clientEmail) {
      return NextResponse.json(
        { error: 'Client email required' },
        { status: 400 }
      )
    }

    // Validate environment variables
    if (!STRAVA_CLIENT_ID || !STRAVA_CLIENT_SECRET) {
      console.error('Missing Strava environment variables')
      return NextResponse.json(
        {
          error: 'Server configuration error',
          message: 'Strava credentials not configured'
        },
        { status: 500 }
      )
    }

    // Exchange code for token
    const response = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: STRAVA_CLIENT_ID,
        client_secret: STRAVA_CLIENT_SECRET,
        code: code,
        grant_type: 'authorization_code',
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Strava token exchange failed:', data)
      return NextResponse.json(
        {
          error: data.message || 'Failed to exchange token',
          details: data.errors,
        },
        { status: response.status || 400 }
      )
    }

    // Validate response
    if (!data.access_token || !data.refresh_token) {
      console.error('Invalid token response from Strava:', data)
      return NextResponse.json(
        { error: 'Invalid response from Strava' },
        { status: 500 }
      )
    }

    console.log(`[Strava] Successfully connected account for client: ${clientEmail}`)

    // Return token data to frontend
    return NextResponse.json({
      access_token: data.access_token,
      expires_in: data.expires_in,
      expires_at: Math.floor(Date.now() / 1000) + data.expires_in,
      refresh_token: data.refresh_token,
      athlete: data.athlete,
    })
  } catch (error) {
    console.error('Token exchange error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'An unexpected error occurred'
      },
      { status: 500 }
    )
  }
}

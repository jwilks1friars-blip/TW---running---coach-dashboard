import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const accessToken = searchParams.get('access_token')
  const after = searchParams.get('after') // Unix timestamp - activities after this time
  const perPage = searchParams.get('per_page') || '200' // Higher limit for coach dashboard

  if (!accessToken) {
    return NextResponse.json(
      { error: 'Access token required' },
      { status: 400 }
    )
  }

  try {
    // Build URL with optional after parameter
    let url = `https://www.strava.com/api/v3/athlete/activities?per_page=${perPage}`
    if (after) {
      url += `&after=${after}`
    }

    // Fetch activities from Strava API
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        {
          error: errorData.message || 'Failed to fetch activities',
          details: errorData.errors,
        },
        { status: response.status }
      )
    }

    const activities = await response.json()

    // Return full activities data (not pre-processed like client dashboard)
    // This allows coach dashboard to do its own processing/aggregation
    const runs = activities.filter((activity: any) =>
      activity.sport_type === 'Run' || activity.type === 'Run'
    )

    return NextResponse.json({ activities: runs })
  } catch (error) {
    console.error('Activities fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

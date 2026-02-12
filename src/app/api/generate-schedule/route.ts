import { NextRequest, NextResponse } from "next/server"
import { generateWeeklySchedule, type ScheduleGenerationInput } from "@/lib/claude-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      clientName,
      clientEmail,
      weekStart,
      trainingHistory,
      stravaData,
      raceGoal,
      injuries,
      latestCheckIn,
      coachNotes,
    } = body

    // Validate required fields
    if (!clientEmail || !weekStart) {
      return NextResponse.json(
        { error: "Missing required fields: clientEmail and weekStart are required" },
        { status: 400 }
      )
    }

    // Build input for Claude
    const input: ScheduleGenerationInput = {
      clientName: clientName || clientEmail,
      clientEmail,
      currentWeekStart: weekStart,
      trainingHistory: trainingHistory || [],
      stravaData,
      raceGoal,
      injuries: injuries || [],
      latestCheckIn,
      coachNotes: coachNotes || "",
    }

    console.log("[API] Generating schedule for:", clientEmail, "week:", weekStart)

    // Call Claude API
    const schedule = await generateWeeklySchedule(input)

    return NextResponse.json({
      success: true,
      schedule,
    })
  } catch (error) {
    console.error("[API] Schedule generation error:", error)

    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"

    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate schedule",
        details: errorMessage,
      },
      { status: 500 }
    )
  }
}

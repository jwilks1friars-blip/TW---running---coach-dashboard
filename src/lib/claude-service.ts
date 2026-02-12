"use client"

import Anthropic from "@anthropic-ai/sdk"
import type { RaceGoal, InjuryRecord, WeeklyCheckIn, TrainingWeek, Workout } from "./client-data"

// Initialize Anthropic client (will be used server-side)
function getAnthropicClient() {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not set in environment variables")
  }
  return new Anthropic({ apiKey })
}

export interface ScheduleGenerationInput {
  clientName: string
  clientEmail: string
  currentWeekStart: string

  // Training history
  trainingHistory: TrainingWeek[]

  // Strava data (optional)
  stravaData?: {
    last4Weeks: any[]
    completionRates: number[]
  }

  // Context
  raceGoal?: RaceGoal
  injuries: InjuryRecord[]
  latestCheckIn?: WeeklyCheckIn

  // Coach notes
  coachNotes: string
}

export interface GeneratedSchedule {
  monday: Workout
  tuesday: Workout
  wednesday: Workout
  thursday: Workout
  friday: Workout
  saturday: Workout
  sunday: Workout
  reasoning: string
  weeklyMileage: number
  focusAreas: string[]
}

const SYSTEM_PROMPT = `You are an expert running coach with deep knowledge of:
- Progressive overload and periodization
- Injury prevention and recovery protocols
- Race-specific training plans (5K, 10K, Half Marathon, Marathon)
- Individual athlete variability and adaptation
- Training stress management

Your role is to generate a weekly training schedule based on comprehensive athlete data.

TRAINING PRINCIPLES:
1. 80/20 Rule: 80% of training should be easy, 20% hard
2. Hard days hard, easy days easy - polarize intensity
3. Include at least one rest day per week (two for beginners or high-stress athletes)
4. Long run should be 20-30% of weekly mileage
5. Avoid consecutive hard days - space workouts with recovery
6. Build mileage by maximum 10% per week to prevent injury
7. Consider fatigue, injuries, life stress, and sleep quality
8. Taper appropriately 2-3 weeks before races (reduce volume, maintain intensity)
9. Active recovery is better than complete rest for most athletes
10. Variety prevents burnout - mix distances, paces, and terrains

INJURY MANAGEMENT:
- Active injuries: Reduce intensity/volume significantly, focus on non-impact cross-training
- Recovering injuries: Gradual return, avoid aggravating movements
- Pain > 3/10: Rest day or cross-training only

RACE PREPARATION:
- Marathon (4+ weeks out): Build aerobic base, long runs, some tempo
- Marathon (2-3 weeks out): Taper 70-80% volume, maintain race-pace workouts
- Marathon (1 week out): Minimal volume, short race-pace efforts
- Half Marathon: Similar pattern but shorter taper (10-14 days)
- 5K/10K: More intensity work, shorter taper (5-7 days)

OUTPUT FORMAT (strict JSON - respond ONLY with valid JSON, no markdown):
{
  "monday": { "distance": "5", "pace": "9:00", "notes": "Easy recovery run" },
  "tuesday": { "distance": "6", "pace": "8:15", "notes": "Tempo: 2mi easy, 3mi @ threshold (7:30), 1mi cooldown" },
  "wednesday": { "distance": "0", "pace": "", "notes": "Rest day - recovery and adaptation" },
  "thursday": { "distance": "5", "pace": "8:45", "notes": "Easy run with strides" },
  "friday": { "distance": "4", "pace": "9:00", "notes": "Easy recovery" },
  "saturday": { "distance": "10", "pace": "9:15", "notes": "Long run - aerobic base building" },
  "sunday": { "distance": "3", "pace": "9:30", "notes": "Easy recovery or optional rest" },
  "reasoning": "Building aerobic base with one quality tempo session. Total mileage 33 miles represents 10% increase from last week. Long run is 30% of weekly volume. Two hard sessions (tempo + long run) properly spaced with recovery days.",
  "weeklyMileage": 33,
  "focusAreas": ["Aerobic base development", "Threshold pace work", "Progressive overload"]
}`

function formatTrainingHistory(history: TrainingWeek[]): string {
  if (history.length === 0) return "No training history available"

  return history
    .map((week, index) => {
      const weeksAgo = index + 1
      return `Week ${weeksAgo} ago (${week.weekStart}): ${week.totalMiles} miles, ${week.workoutCount} workouts`
    })
    .join("\n")
}

function formatInjuries(injuries: InjuryRecord[]): string {
  if (injuries.length === 0) return "No active injuries"

  return injuries
    .map(injury => `- ${injury.description} (${injury.status}) - Areas: ${injury.affectedAreas.join(", ")}`)
    .join("\n")
}

function formatRaceGoal(goal?: RaceGoal): string {
  if (!goal) return "No current race goal"

  const raceDate = new Date(goal.date)
  const today = new Date()
  const daysUntilRace = Math.ceil((raceDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  return `${goal.type} on ${goal.date} (${daysUntilRace} days away)
Target Time: ${goal.targetTime || "Not specified"}
Priority: ${goal.priority}-race (${goal.priority === "A" ? "Primary goal" : goal.priority === "B" ? "Secondary" : "Training race"})
${goal.notes ? `Notes: ${goal.notes}` : ""}`
}

function buildUserPrompt(input: ScheduleGenerationInput): string {
  const avgMileage = input.trainingHistory.length > 0
    ? (input.trainingHistory.reduce((sum, w) => sum + w.totalMiles, 0) / input.trainingHistory.length).toFixed(1)
    : "N/A"

  return `ATHLETE PROFILE:
Name: ${input.clientName}
Email: ${input.clientEmail}

RACE GOAL:
${formatRaceGoal(input.raceGoal)}

RECENT TRAINING HISTORY (last ${input.trainingHistory.length} weeks):
${formatTrainingHistory(input.trainingHistory)}
Average weekly mileage: ${avgMileage} miles

CURRENT STATUS (this week):
Body Feeling: ${input.latestCheckIn?.bodyFeeling || "N/A"}/5 ${input.latestCheckIn?.bodyFeeling ? `(${input.latestCheckIn.bodyFeeling <= 2 ? "Low energy" : input.latestCheckIn.bodyFeeling >= 4 ? "Feeling good" : "Moderate"})` : ""}
Sleep Quality: ${input.latestCheckIn?.sleepQuality || "N/A"}/5 ${input.latestCheckIn?.sleepQuality ? `(${input.latestCheckIn.sleepQuality <= 2 ? "Poor sleep" : input.latestCheckIn.sleepQuality >= 4 ? "Good sleep" : "Average"})` : ""}
Stress Level: ${input.latestCheckIn?.stressLevel || "N/A"}/5 ${input.latestCheckIn?.stressLevel ? `(${input.latestCheckIn.stressLevel <= 2 ? "Low stress" : input.latestCheckIn.stressLevel >= 4 ? "High stress" : "Moderate stress"})` : ""}
${input.latestCheckIn?.notes ? `Additional notes: ${input.latestCheckIn.notes}` : ""}

INJURIES & HEALTH:
${formatInjuries(input.injuries)}

COACH NOTES:
${input.coachNotes || "No additional notes"}

---

Generate a training schedule for the week starting ${input.currentWeekStart}.

IMPORTANT CONSIDERATIONS:
- Respect the athlete's current fitness level and recent training load
- Account for any injuries or low body feeling scores
- Consider sleep quality and stress when planning intensity
- Progress mileage gradually (max 10% increase)
- If a race is within 2-3 weeks, begin tapering
- Balance hard training with adequate recovery

Respond with ONLY valid JSON matching the format specified in the system prompt. Do not include markdown formatting or code blocks.`
}

function parseScheduleResponse(content: string): GeneratedSchedule {
  // Remove markdown code blocks if present
  let cleaned = content.trim()
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/```json?\n?/g, "").replace(/```\n?$/g, "")
  }

  try {
    const parsed = JSON.parse(cleaned)

    // Validate required fields
    const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
    for (const day of days) {
      if (!parsed[day]) {
        throw new Error(`Missing ${day} in schedule`)
      }
      // Ensure each day has the required Workout fields
      parsed[day] = {
        distance: parsed[day].distance || "0",
        pace: parsed[day].pace || "",
        notes: parsed[day].notes || "",
      }
    }

    return {
      monday: parsed.monday,
      tuesday: parsed.tuesday,
      wednesday: parsed.wednesday,
      thursday: parsed.thursday,
      friday: parsed.friday,
      saturday: parsed.saturday,
      sunday: parsed.sunday,
      reasoning: parsed.reasoning || "No reasoning provided",
      weeklyMileage: parsed.weeklyMileage || 0,
      focusAreas: parsed.focusAreas || [],
    }
  } catch (error) {
    console.error("Failed to parse Claude response:", error)
    console.error("Raw content:", content)
    throw new Error(`Invalid schedule format from AI: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

export async function generateWeeklySchedule(input: ScheduleGenerationInput): Promise<GeneratedSchedule> {
  const anthropic = getAnthropicClient()

  try {
    console.log("[AI] Starting schedule generation for:", input.clientEmail)

    const startTime = Date.now()
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-5-20250929",
      max_tokens: 2000,
      temperature: 1,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: buildUserPrompt(input),
        },
      ],
    })

    const latency = Date.now() - startTime
    console.log("[AI] Claude API latency:", latency, "ms")
    console.log("[AI] Token usage:", response.usage)

    // Extract text content from response
    const content = response.content[0]
    if (content.type !== "text") {
      throw new Error("Unexpected response type from Claude")
    }

    const schedule = parseScheduleResponse(content.text)
    console.log("[AI] Schedule generated successfully")

    return schedule
  } catch (error) {
    console.error("[AI] Schedule generation error:", error)
    throw error
  }
}

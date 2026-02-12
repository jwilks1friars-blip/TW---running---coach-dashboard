"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2, Sparkles, AlertCircle } from "lucide-react"
import {
  getTrainingHistory,
  getClientProfile,
  getClientCheckIns,
  getActiveInjuries,
  getNextRace,
  addClientCheckIn,
  type Workout,
  type WeeklyCheckIn
} from "@/lib/client-data"

interface AIScheduleModalProps {
  clientEmail: string
  clientName: string
  weekStart: Date
  isOpen: boolean
  onClose: () => void
  onScheduleGenerated: (schedule: Record<string, Workout>) => void
}

export function AIScheduleModal({
  clientEmail,
  clientName,
  weekStart,
  isOpen,
  onClose,
  onScheduleGenerated,
}: AIScheduleModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Check-in form state
  const [bodyFeeling, setBodyFeeling] = useState<number>(3)
  const [sleepQuality, setSleepQuality] = useState<number>(3)
  const [stressLevel, setStressLevel] = useState<number>(3)
  const [checkInNotes, setCheckInNotes] = useState("")
  const [coachNotes, setCoachNotes] = useState("")

  const handleGenerate = async () => {
    setLoading(true)
    setError(null)

    try {
      // Save check-in data
      const checkIn: WeeklyCheckIn = {
        weekStart: weekStart.toISOString().split("T")[0],
        bodyFeeling: bodyFeeling as 1 | 2 | 3 | 4 | 5,
        sleepQuality: sleepQuality as 1 | 2 | 3 | 4 | 5,
        stressLevel: stressLevel as 1 | 2 | 3 | 4 | 5,
        notes: checkInNotes,
        createdAt: new Date().toISOString(),
      }
      addClientCheckIn(clientEmail, checkIn)

      // Gather all data for schedule generation
      const trainingHistory = getTrainingHistory(clientEmail, 4)
      const profile = getClientProfile(clientEmail)
      const raceGoal = getNextRace(clientEmail)
      const injuries = getActiveInjuries(clientEmail)

      console.log("[Modal] Calling API to generate schedule...")

      // Call API
      const response = await fetch("/api/generate-schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientName,
          clientEmail,
          weekStart: weekStart.toISOString().split("T")[0],
          trainingHistory,
          raceGoal,
          injuries,
          latestCheckIn: checkIn,
          coachNotes,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.details || data.error || "Failed to generate schedule")
      }

      console.log("[Modal] Schedule generated successfully")

      // Convert AI response to schedule format
      const schedule: Record<string, Workout> = {
        Monday: data.schedule.monday,
        Tuesday: data.schedule.tuesday,
        Wednesday: data.schedule.wednesday,
        Thursday: data.schedule.thursday,
        Friday: data.schedule.friday,
        Saturday: data.schedule.saturday,
        Sunday: data.schedule.sunday,
      }

      // Pass schedule to parent and close modal
      onScheduleGenerated(schedule)
      onClose()

      // Reset form
      setBodyFeeling(3)
      setSleepQuality(3)
      setStressLevel(3)
      setCheckInNotes("")
      setCoachNotes("")
    } catch (err) {
      console.error("[Modal] Error generating schedule:", err)
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-500" />
            Generate AI Schedule for {clientName}
          </DialogTitle>
          <DialogDescription>
            Provide weekly check-in data and coaching notes to generate a personalized training schedule
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Body Feeling */}
          <div className="space-y-2">
            <Label htmlFor="bodyFeeling">
              How is the athlete feeling? ({bodyFeeling}/5)
            </Label>
            <Input
              id="bodyFeeling"
              type="range"
              min="1"
              max="5"
              value={bodyFeeling}
              onChange={(e) => setBodyFeeling(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground px-1">
              <span>Terrible</span>
              <span>Poor</span>
              <span>Average</span>
              <span>Good</span>
              <span>Excellent</span>
            </div>
          </div>

          {/* Sleep Quality */}
          <div className="space-y-2">
            <Label htmlFor="sleepQuality">
              Sleep Quality ({sleepQuality}/5)
            </Label>
            <Input
              id="sleepQuality"
              type="range"
              min="1"
              max="5"
              value={sleepQuality}
              onChange={(e) => setSleepQuality(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground px-1">
              <span>Very Poor</span>
              <span>Poor</span>
              <span>Average</span>
              <span>Good</span>
              <span>Excellent</span>
            </div>
          </div>

          {/* Stress Level */}
          <div className="space-y-2">
            <Label htmlFor="stressLevel">
              Stress Level ({stressLevel}/5)
            </Label>
            <Input
              id="stressLevel"
              type="range"
              min="1"
              max="5"
              value={stressLevel}
              onChange={(e) => setStressLevel(Number(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground px-1">
              <span>Very Low</span>
              <span>Low</span>
              <span>Moderate</span>
              <span>High</span>
              <span>Very High</span>
            </div>
          </div>

          {/* Check-in Notes */}
          <div className="space-y-2">
            <Label htmlFor="checkInNotes">
              Athlete Notes (optional)
            </Label>
            <Textarea
              id="checkInNotes"
              placeholder="Any additional context from the athlete? (e.g., 'feeling tired from work stress', 'slight knee discomfort')"
              value={checkInNotes}
              onChange={(e) => setCheckInNotes(e.target.value)}
              rows={2}
            />
          </div>

          {/* Coach Notes */}
          <div className="space-y-2">
            <Label htmlFor="coachNotes">
              Coach Notes
            </Label>
            <Textarea
              id="coachNotes"
              placeholder="Add specific guidance for the AI (e.g., 'focus on tempo work this week', 'coming off illness - keep it light', 'race in 2 weeks - begin taper')"
              value={coachNotes}
              onChange={(e) => setCoachNotes(e.target.value)}
              rows={3}
            />
          </div>

          {/* Error Display */}
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800">Error generating schedule</p>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="rounded-lg border bg-blue-50 p-4 text-sm text-blue-800">
            <p className="font-medium mb-1">What happens next:</p>
            <ul className="list-disc list-inside space-y-1 text-blue-700">
              <li>AI analyzes last 4 weeks of training history</li>
              <li>Considers race goals, injuries, and current status</li>
              <li>Generates a personalized 7-day schedule</li>
              <li>You can review and edit before saving</li>
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleGenerate} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Schedule
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

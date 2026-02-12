"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { CoachSidebar } from "@/components/coach-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar, ChevronLeft, ChevronRight, Save, Copy, Trash2, User, Zap, CheckCircle, Clock, Activity, Sparkles } from "lucide-react"
import { isCoachAuthenticated } from "@/lib/auth"
import {
  getAllClients,
  getClientSchedule,
  saveClientSchedule,
  getWeekStart,
  getWeekDays,
  formatDate,
  type Workout,
} from "@/lib/client-data"
import { AIScheduleModal } from "@/components/ai-schedule-modal"

const workoutTemplates = [
  { name: "Easy Run", distance: "4", pace: "9:00", notes: "Easy conversational pace" },
  { name: "Tempo Run", distance: "6", pace: "7:30", notes: "Comfortably hard pace" },
  { name: "Long Run", distance: "10", pace: "9:30", notes: "Build endurance" },
  { name: "Intervals", distance: "5", pace: "7:00", notes: "5x800m @ 5k pace with 400m recovery" },
  { name: "Recovery", distance: "3", pace: "10:00", notes: "Very easy recovery run" },
  { name: "Rest Day", distance: "0", pace: "", notes: "Rest and recover" },
]

export default function SchedulesPage() {
  const router = useRouter()
  const [clients, setClients] = useState<Record<string, any>>({})
  const [selectedClient, setSelectedClient] = useState("")
  const [currentWeek, setCurrentWeek] = useState(getWeekStart())
  const [schedule, setSchedule] = useState<Record<string, Workout>>({})
  const [showTemplates, setShowTemplates] = useState(false)
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [showAIModal, setShowAIModal] = useState(false)
  const [aiGeneratedSchedule, setAIGeneratedSchedule] = useState<Record<string, Workout> | null>(null)

  useEffect(() => {
    if (!isCoachAuthenticated()) {
      router.push("/login")
      return
    }
    loadClients()
  }, [router])

  useEffect(() => {
    if (selectedClient) {
      loadSchedule()
    }
  }, [selectedClient, currentWeek])

  const loadClients = () => {
    const allClients = getAllClients()
    setClients(allClients)
  }

  const loadSchedule = () => {
    if (!selectedClient) return
    const weekSchedule = getClientSchedule(selectedClient, currentWeek)
    setSchedule(weekSchedule)
    setHasUnsavedChanges(false)
  }

  const handleWeekChange = (direction: "prev" | "next") => {
    if (hasUnsavedChanges) {
      if (!confirm("You have unsaved changes. Continue anyway?")) {
        return
      }
    }
    const newWeek = new Date(currentWeek)
    newWeek.setDate(newWeek.getDate() + (direction === "next" ? 7 : -7))
    setCurrentWeek(newWeek)
  }

  const handleWorkoutChange = (dateKey: string, field: keyof Workout, value: string) => {
    setSchedule({
      ...schedule,
      [dateKey]: {
        ...schedule[dateKey],
        [field]: value,
      },
    })
    setHasUnsavedChanges(true)
  }

  const handleSave = () => {
    if (!selectedClient) {
      alert("Please select a client first")
      return
    }

    saveClientSchedule(selectedClient, currentWeek, schedule)
    setHasUnsavedChanges(false)
    setAIGeneratedSchedule(null)
  }

  const handleAIScheduleGenerated = (generatedSchedule: Record<string, Workout>) => {
    // Convert day names to date keys for the current week
    const weekDays = getWeekDays(currentWeek)
    const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

    const newSchedule: Record<string, Workout> = {}

    weekDays.forEach((day, index) => {
      const dateKey = day.toISOString().split("T")[0]
      const dayName = dayNames[index]
      if (generatedSchedule[dayName]) {
        newSchedule[dateKey] = generatedSchedule[dayName]
      }
    })

    setSchedule(newSchedule)
    setAIGeneratedSchedule(newSchedule)
    setHasUnsavedChanges(true)
  }

  const copyPreviousWeek = () => {
    if (!selectedClient) return
    const prevWeek = new Date(currentWeek)
    prevWeek.setDate(prevWeek.getDate() - 7)
    const prevSchedule = getClientSchedule(selectedClient, prevWeek)

    if (Object.keys(prevSchedule).length === 0) {
      alert("No schedule found for previous week")
      return
    }

    const weekDays = getWeekDays(currentWeek)
    const newSchedule: Record<string, Workout> = {}

    weekDays.forEach((day, index) => {
      const dateKey = day.toISOString().split("T")[0]
      const prevDay = new Date(prevWeek)
      prevDay.setDate(prevWeek.getDate() + index)
      const prevDateKey = prevDay.toISOString().split("T")[0]

      if (prevSchedule[prevDateKey]) {
        newSchedule[dateKey] = { ...prevSchedule[prevDateKey] }
      }
    })

    setSchedule(newSchedule)
    setHasUnsavedChanges(true)
  }

  const clearWeek = () => {
    if (!confirm("Clear all workouts for this week?")) return
    setSchedule({})
    setHasUnsavedChanges(true)
  }

  const applyTemplate = (template: typeof workoutTemplates[0]) => {
    if (!selectedDay) return
    handleWorkoutChange(selectedDay, "distance", template.distance)
    handleWorkoutChange(selectedDay, "pace", template.pace)
    handleWorkoutChange(selectedDay, "notes", template.notes)
    setShowTemplates(false)
    setSelectedDay(null)
  }

  const getTotalMileage = () => {
    return Object.values(schedule).reduce((total, workout) => {
      const distance = parseFloat(workout.distance) || 0
      return total + distance
    }, 0).toFixed(1)
  }

  const weekDays = getWeekDays(currentWeek)
  const weekStartFormatted = formatDate(currentWeek)
  const weekEnd = new Date(currentWeek)
  weekEnd.setDate(currentWeek.getDate() + 6)
  const weekEndFormatted = formatDate(weekEnd)

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-background via-background to-muted/20">
        <CoachSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 sticky top-0 z-10">
            <SidebarTrigger className="-ml-1" />
            <div className="flex-1">
              <h1 className="text-lg font-semibold">Edit Schedules</h1>
              <p className="text-xs text-muted-foreground">
                {selectedClient ? `Editing: ${clients[selectedClient]?.name || selectedClient}` : 'Select a client to begin'}
              </p>
            </div>
            {hasUnsavedChanges && (
              <span className="text-xs text-orange-500 flex items-center gap-1 px-3 py-1 rounded-full bg-orange-500/10">
                <Activity className="h-3 w-3" />
                Unsaved changes
              </span>
            )}
          </header>

          <div className="flex flex-1 flex-col gap-4 p-4 md:p-6 lg:p-8">
            {/* Client Selection */}
            <Card className="border-2 hover:border-primary/30 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Select Client
                </CardTitle>
                <CardDescription>Choose an athlete to edit their training schedule</CardDescription>
              </CardHeader>
              <CardContent>
                <select
                  value={selectedClient}
                  onChange={(e) => setSelectedClient(e.target.value)}
                  className="w-full p-3 border-2 rounded-lg text-base bg-background hover:border-primary/50 transition-colors focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value="">Select a client...</option>
                  {Object.values(clients).map((client: any) => (
                    <option key={client.email} value={client.email}>
                      {client.name} ({client.email})
                    </option>
                  ))}
                </select>
              </CardContent>
            </Card>

            {selectedClient && (
              <>
                {/* Week Stats & Actions */}
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Activity className="h-4 w-4 text-blue-500" />
                        Total Mileage
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{getTotalMileage()}</div>
                      <p className="text-xs text-muted-foreground">miles this week</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Clock className="h-4 w-4 text-green-500" />
                        Week Period
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm font-semibold">{weekStartFormatted}</div>
                      <p className="text-xs text-muted-foreground">to {weekEndFormatted}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="flex gap-2">
                      <Button variant="default" size="sm" onClick={() => setShowAIModal(true)} className="gap-1 flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                        <Sparkles className="h-3 w-3" />
                        AI Generate
                      </Button>
                      <Button variant="outline" size="sm" onClick={copyPreviousWeek} className="gap-1 flex-1">
                        <Copy className="h-3 w-3" />
                        Copy Prev
                      </Button>
                      <Button variant="outline" size="sm" onClick={clearWeek} className="gap-1 flex-1">
                        <Trash2 className="h-3 w-3" />
                        Clear
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* AI Generated Schedule Banner */}
                {aiGeneratedSchedule && (
                  <Card className="border-2 border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="rounded-full bg-blue-500 p-2">
                            <Sparkles className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-blue-900 dark:text-blue-100">AI-Generated Schedule Loaded</p>
                            <p className="text-sm text-blue-700 dark:text-blue-300">Review and edit the workouts below, then save when ready</p>
                          </div>
                        </div>
                        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                          <Save className="h-4 w-4 mr-2" />
                          Save Schedule
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Week Navigation */}
                <Card>
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-primary" />
                          Training Schedule
                        </CardTitle>
                        <CardDescription>
                          Plan workouts for the week
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleWeekChange("prev")}
                        >
                          <ChevronLeft className="h-4 w-4 mr-1" />
                          Previous
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleWeekChange("next")}
                        >
                          Next
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                        <Button onClick={handleSave} className="gap-2" disabled={!hasUnsavedChanges}>
                          {hasUnsavedChanges ? (
                            <>
                              <Save className="h-4 w-4" />
                              Save Changes
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4" />
                              Saved
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3">
                      {weekDays.map((day) => {
                        const dateKey = day.toISOString().split("T")[0]
                        const workout = schedule[dateKey] || {
                          distance: "",
                          pace: "",
                          notes: "",
                        }
                        const dayName = day.toLocaleDateString("en-US", {
                          weekday: "short",
                        })
                        const isToday = day.toDateString() === new Date().toDateString()
                        const hasWorkout = workout.distance || workout.pace || workout.notes

                        return (
                          <div
                            key={dateKey}
                            className={`group border-2 rounded-lg p-4 space-y-3 transition-all hover:border-primary/50 hover:shadow-md ${
                              isToday ? 'border-primary/50 bg-primary/5' : ''
                            } ${hasWorkout ? 'bg-green-500/5 border-green-500/30' : ''}`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-bold text-base flex items-center gap-2">
                                  {dayName}
                                  {isToday && <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-primary text-primary-foreground">Today</span>}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {formatDate(day)}
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedDay(dateKey)
                                  setShowTemplates(true)
                                }}
                                className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                                title="Use template"
                              >
                                <Zap className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="space-y-2">
                              <div>
                                <label className="text-xs font-medium text-muted-foreground">
                                  Distance (mi)
                                </label>
                                <Input
                                  type="text"
                                  placeholder="0"
                                  value={workout.distance}
                                  onChange={(e) =>
                                    handleWorkoutChange(
                                      dateKey,
                                      "distance",
                                      e.target.value
                                    )
                                  }
                                  className="h-9 text-sm font-semibold"
                                />
                              </div>
                              <div>
                                <label className="text-xs font-medium text-muted-foreground">
                                  Pace (min/mi)
                                </label>
                                <Input
                                  type="text"
                                  placeholder="0:00"
                                  value={workout.pace}
                                  onChange={(e) =>
                                    handleWorkoutChange(
                                      dateKey,
                                      "pace",
                                      e.target.value
                                    )
                                  }
                                  className="h-9 text-sm font-semibold"
                                />
                              </div>
                              <div>
                                <label className="text-xs font-medium text-muted-foreground">Notes</label>
                                <Input
                                  type="text"
                                  placeholder="Workout details..."
                                  value={workout.notes}
                                  onChange={(e) =>
                                    handleWorkoutChange(
                                      dateKey,
                                      "notes",
                                      e.target.value
                                    )
                                  }
                                  className="h-9 text-sm"
                                />
                              </div>
                            </div>
                            {hasWorkout && (
                              <div className="pt-2 border-t">
                                <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                                  <CheckCircle className="h-3 w-3" />
                                  Workout planned
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Workout Templates Modal */}
                {showTemplates && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <Card className="max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center gap-2">
                            <Zap className="h-5 w-5 text-primary" />
                            Workout Templates
                          </CardTitle>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setShowTemplates(false)
                              setSelectedDay(null)
                            }}
                          >
                            Close
                          </Button>
                        </div>
                        <CardDescription>
                          Choose a template to quickly fill in the workout
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="grid gap-3">
                        {workoutTemplates.map((template, index) => (
                          <button
                            key={index}
                            onClick={() => applyTemplate(template)}
                            className="text-left p-4 border-2 rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-all group"
                          >
                            <div className="font-semibold text-base mb-1 group-hover:text-primary transition-colors">
                              {template.name}
                            </div>
                            <div className="text-sm text-muted-foreground space-y-1">
                              <div>Distance: <span className="font-medium">{template.distance} miles</span> • Pace: <span className="font-medium">{template.pace || 'N/A'}</span></div>
                              <div className="text-xs italic">{template.notes}</div>
                            </div>
                          </button>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                )}
              </>
            )}
          </div>
        </SidebarInset>
      </div>

      {/* AI Schedule Modal */}
      {selectedClient && (
        <AIScheduleModal
          clientEmail={selectedClient}
          clientName={clients[selectedClient]?.name || selectedClient}
          weekStart={currentWeek}
          isOpen={showAIModal}
          onClose={() => setShowAIModal(false)}
          onScheduleGenerated={handleAIScheduleGenerated}
        />
      )}
    </SidebarProvider>
  )
}



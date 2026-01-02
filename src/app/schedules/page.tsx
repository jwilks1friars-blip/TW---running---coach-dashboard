"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { CoachSidebar } from "@/components/coach-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar, ChevronLeft, ChevronRight, Save } from "lucide-react"
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

export default function SchedulesPage() {
  const router = useRouter()
  const [clients, setClients] = useState<Record<string, any>>({})
  const [selectedClient, setSelectedClient] = useState("")
  const [currentWeek, setCurrentWeek] = useState(getWeekStart())
  const [schedule, setSchedule] = useState<Record<string, Workout>>({})

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
  }

  const handleWeekChange = (direction: "prev" | "next") => {
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
  }

  const handleSave = () => {
    if (!selectedClient) {
      alert("Please select a client first")
      return
    }

    saveClientSchedule(selectedClient, currentWeek, schedule)
    alert("Schedule saved successfully!")
  }

  const weekDays = getWeekDays(currentWeek)
  const weekStartFormatted = formatDate(currentWeek)
  const weekEnd = new Date(currentWeek)
  weekEnd.setDate(currentWeek.getDate() + 6)
  const weekEndFormatted = formatDate(weekEnd)

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <CoachSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex-1">
              <h1 className="text-lg font-semibold">Edit Schedules</h1>
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
            {/* Client Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Select Client</CardTitle>
                <CardDescription>Choose a client to edit their schedule</CardDescription>
              </CardHeader>
              <CardContent>
                <select
                  value={selectedClient}
                  onChange={(e) => setSelectedClient(e.target.value)}
                  className="w-full p-2 border rounded-md"
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
                {/* Week Navigation */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Training Schedule</CardTitle>
                        <CardDescription>
                          Week of {weekStartFormatted} - {weekEndFormatted}
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
                        <Button onClick={handleSave}>
                          <Save className="h-4 w-4 mr-2" />
                          Save Schedule
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
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

                        return (
                          <div
                            key={dateKey}
                            className="border rounded-lg p-4 space-y-3"
                          >
                            <div className="font-semibold text-sm">
                              {dayName}
                            </div>
                            <div className="text-xs text-muted-foreground mb-3">
                              {formatDate(day)}
                            </div>
                            <div className="space-y-2">
                              <div>
                                <label className="text-xs font-medium">
                                  Distance (miles)
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
                                  className="h-8 text-sm"
                                />
                              </div>
                              <div>
                                <label className="text-xs font-medium">
                                  Pace (min/mile)
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
                                  className="h-8 text-sm"
                                />
                              </div>
                              <div>
                                <label className="text-xs font-medium">Notes</label>
                                <Input
                                  type="text"
                                  placeholder="Workout notes"
                                  value={workout.notes}
                                  onChange={(e) =>
                                    handleWorkoutChange(
                                      dateKey,
                                      "notes",
                                      e.target.value
                                    )
                                  }
                                  className="h-8 text-sm"
                                />
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}


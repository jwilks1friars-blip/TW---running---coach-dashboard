"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { CoachSidebar } from "@/components/coach-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Calendar, FileText, Bell, ArrowUpRight, Clock, Activity, Target } from "lucide-react"
import { isCoachAuthenticated } from "@/lib/auth"
import { getAllClients, getClientNotes, getClientUpdates, getClientSchedule, getWeekStart } from "@/lib/client-data"

export default function CoachDashboardPage() {
  const router = useRouter()
  const [stats, setStats] = useState({
    totalClients: 0,
    totalSchedules: 0,
    totalNotes: 0,
    totalUpdates: 0,
    activeThisWeek: 0,
  })
  const [recentActivity, setRecentActivity] = useState<Array<{type: string, client: string, time: string, description: string}>>([])

  useEffect(() => {
    if (!isCoachAuthenticated()) {
      router.push("/login")
    } else {
      calculateStats()
      loadRecentActivity()
    }
  }, [router])

  const calculateStats = () => {
    const clients = getAllClients()
    const clientEmails = Object.keys(clients)
    const clientCount = clientEmails.length

    let totalNotes = 0
    let totalUpdates = 0
    let activeSchedules = 0

    const weekStart = getWeekStart(new Date())

    clientEmails.forEach(email => {
      const notes = getClientNotes(email)
      const updates = getClientUpdates(email)
      const schedule = getClientSchedule(email, weekStart)

      totalNotes += notes.length
      totalUpdates += updates.length

      if (schedule && Object.values(schedule).some(day => day.distance || day.pace || day.notes)) {
        activeSchedules++
      }
    })

    setStats({
      totalClients: clientCount,
      totalSchedules: activeSchedules,
      totalNotes,
      totalUpdates,
      activeThisWeek: activeSchedules,
    })
  }

  const loadRecentActivity = () => {
    const clients = getAllClients()
    const clientEmails = Object.keys(clients)
    const activities: Array<{type: string, client: string, time: string, description: string}> = []

    clientEmails.forEach(email => {
      const notes = getClientNotes(email)
      const updates = getClientUpdates(email)

      notes.slice(0, 2).forEach(note => {
        activities.push({
          type: 'note',
          client: clients[email].name || email,
          time: note.date,
          description: note.title
        })
      })

      updates.slice(0, 2).forEach(update => {
        activities.push({
          type: 'update',
          client: clients[email].name || email,
          time: update.date,
          description: update.title
        })
      })
    })

    // Sort by date and take the 5 most recent
    activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    setRecentActivity(activities.slice(0, 5))
  }

  const getTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (seconds < 60) return 'Just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
    return date.toLocaleDateString()
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-background via-background to-muted/20">
        <CoachSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 sticky top-0 z-10">
            <SidebarTrigger className="-ml-1" />
            <div className="flex-1">
              <h1 className="text-lg font-semibold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                Coach Dashboard
              </h1>
              <p className="text-xs text-muted-foreground">Welcome back! Here's your overview</p>
            </div>
          </header>

          <div className="flex flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8">
            {/* Stats Grid with enhanced visuals */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="overflow-hidden border-2 hover:border-primary/50 transition-all hover:shadow-lg group">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
                  <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Users className="h-5 w-5 text-blue-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.totalClients}</div>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <Activity className="h-3 w-3" />
                    Active athletes
                  </p>
                </CardContent>
              </Card>

              <Card className="overflow-hidden border-2 hover:border-primary/50 transition-all hover:shadow-lg group">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Schedules</CardTitle>
                  <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Calendar className="h-5 w-5 text-green-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.totalSchedules}</div>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    This week
                  </p>
                </CardContent>
              </Card>

              <Card className="overflow-hidden border-2 hover:border-primary/50 transition-all hover:shadow-lg group">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Notes</CardTitle>
                  <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FileText className="h-5 w-5 text-purple-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.totalNotes}</div>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <Target className="h-3 w-3" />
                    Coaching notes
                  </p>
                </CardContent>
              </Card>

              <Card className="overflow-hidden border-2 hover:border-primary/50 transition-all hover:shadow-lg group">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Updates Posted</CardTitle>
                  <div className="h-10 w-10 rounded-full bg-orange-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Bell className="h-5 w-5 text-orange-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.totalUpdates}</div>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <ArrowUpRight className="h-3 w-3" />
                    Announcements
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions & Recent Activity */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription>Jump to common tasks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href="/clients">
                    <Button variant="outline" className="w-full justify-start" size="sm">
                      <Users className="mr-2 h-4 w-4" />
                      Add New Client
                    </Button>
                  </Link>
                  <Link href="/schedules">
                    <Button variant="outline" className="w-full justify-start" size="sm">
                      <Calendar className="mr-2 h-4 w-4" />
                      Edit Schedules
                    </Button>
                  </Link>
                  <Link href="/updates">
                    <Button variant="outline" className="w-full justify-start" size="sm">
                      <Bell className="mr-2 h-4 w-4" />
                      Post Update
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="lg:col-span-2 hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>Latest actions and updates</CardDescription>
                </CardHeader>
                <CardContent>
                  {recentActivity.length === 0 ? (
                    <div className="text-center py-8">
                      <Activity className="h-12 w-12 text-muted-foreground/30 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No recent activity</p>
                      <p className="text-xs text-muted-foreground">Start by adding clients or creating schedules</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            activity.type === 'note' ? 'bg-purple-500/10' : 'bg-orange-500/10'
                          }`}>
                            {activity.type === 'note' ? (
                              <FileText className="h-4 w-4 text-purple-500" />
                            ) : (
                              <Bell className="h-4 w-4 text-orange-500" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{activity.description}</p>
                            <p className="text-xs text-muted-foreground">
                              {activity.client} • {getTimeAgo(activity.time)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}



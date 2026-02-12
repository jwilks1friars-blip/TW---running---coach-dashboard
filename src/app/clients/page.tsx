"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { CoachSidebar } from "@/components/coach-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Users, Plus, Trash2, Edit, Search, Filter, Mail, User, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react"
import { isCoachAuthenticated } from "@/lib/auth"
import {
  getAllClients,
  saveClient,
  deleteClient,
  type Client,
  getClientSchedule,
  getClientNotes,
  getWeekStart,
} from "@/lib/client-data"

type ClientWithStats = Client & {
  hasSchedule: boolean
  noteCount: number
}

export default function ClientsPage() {
  const router = useRouter()
  const [clients, setClients] = useState<Record<string, ClientWithStats>>({})
  const [filteredClients, setFilteredClients] = useState<Record<string, ClientWithStats>>({})
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<'name' | 'email' | 'notes'>('name')
  const [filterBy, setFilterBy] = useState<'all' | 'scheduled' | 'unscheduled'>('all')
  const [showAddForm, setShowAddForm] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [newClient, setNewClient] = useState({
    email: "",
    name: "",
    password: "",
  })
  const [editingClient, setEditingClient] = useState<string | null>(null)
  const [editData, setEditData] = useState({
    name: "",
    password: "",
  })

  useEffect(() => {
    if (!isCoachAuthenticated()) {
      router.push("/login")
      return
    }
    loadClients()
  }, [router])

  useEffect(() => {
    filterAndSortClients()
  }, [clients, searchTerm, sortBy, filterBy])

  const loadClients = () => {
    const allClients = getAllClients()
    const weekStart = getWeekStart(new Date())

    const clientsWithStats: Record<string, ClientWithStats> = {}

    Object.keys(allClients).forEach(email => {
      const schedule = getClientSchedule(email, weekStart)
      const notes = getClientNotes(email)
      const hasSchedule = schedule && Object.values(schedule).some(day => day.distance || day.pace || day.notes)

      clientsWithStats[email] = {
        ...allClients[email],
        hasSchedule: !!hasSchedule,
        noteCount: notes.length,
      }
    })

    setClients(clientsWithStats)
  }

  const filterAndSortClients = () => {
    let filtered = { ...clients }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = Object.fromEntries(
        Object.entries(filtered).filter(([_, client]) =>
          client.name.toLowerCase().includes(term) ||
          client.email.toLowerCase().includes(term)
        )
      )
    }

    // Apply schedule filter
    if (filterBy === 'scheduled') {
      filtered = Object.fromEntries(
        Object.entries(filtered).filter(([_, client]) => client.hasSchedule)
      )
    } else if (filterBy === 'unscheduled') {
      filtered = Object.fromEntries(
        Object.entries(filtered).filter(([_, client]) => !client.hasSchedule)
      )
    }

    // Apply sorting
    const sortedEntries = Object.entries(filtered).sort(([_, a], [__, b]) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'email') return a.email.localeCompare(b.email)
      if (sortBy === 'notes') return b.noteCount - a.noteCount
      return 0
    })

    setFilteredClients(Object.fromEntries(sortedEntries))
  }

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newClient.email || !newClient.name || !newClient.password) {
      alert("Please fill in all fields")
      return
    }

    saveClient({
      email: newClient.email,
      name: newClient.name,
      password: newClient.password,
    })

    setNewClient({ email: "", name: "", password: "" })
    setShowAddForm(false)
    setShowPassword(false)
    loadClients()
  }

  const handleUpdateClient = (email: string) => {
    if (!editData.name) {
      alert("Name cannot be empty")
      return
    }

    const existingClient = clients[email]
    saveClient({
      email,
      name: editData.name,
      password: editData.password || existingClient.password,
    })

    setEditingClient(null)
    setEditData({ name: "", password: "" })
    loadClients()
  }

  const handleDeleteClient = (email: string, name: string) => {
    if (
      !confirm(
        `Are you sure you want to delete ${name}?\n\nThis will remove:\n- Client account\n- All schedules\n- All notes\n- All updates\n\nThis action cannot be undone!`
      )
    ) {
      return
    }

    deleteClient(email)
    loadClients()
  }

  const startEditing = (client: ClientWithStats) => {
    setEditingClient(client.email)
    setEditData({
      name: client.name,
      password: "",
    })
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-background via-background to-muted/20">
        <CoachSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 sticky top-0 z-10">
            <SidebarTrigger className="-ml-1" />
            <div className="flex-1">
              <h1 className="text-lg font-semibold">Manage Clients</h1>
              <p className="text-xs text-muted-foreground">
                {Object.keys(filteredClients).length} of {Object.keys(clients).length} clients
              </p>
            </div>
            <Button onClick={() => setShowAddForm(!showAddForm)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Client
            </Button>
          </header>

          <div className="flex flex-1 flex-col gap-4 p-4 md:p-6 lg:p-8">
            {/* Add Client Form */}
            {showAddForm && (
              <Card className="border-2 border-primary/20 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Add New Client
                  </CardTitle>
                  <CardDescription>
                    Create a new client account with credentials
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddClient} className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          Email Address
                        </label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="client@example.com"
                          value={newClient.email}
                          onChange={(e) =>
                            setNewClient({ ...newClient, email: e.target.value })
                          }
                          className="transition-all focus:ring-2 focus:ring-primary/20"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          Client Name
                        </label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="John Doe"
                          value={newClient.name}
                          onChange={(e) =>
                            setNewClient({ ...newClient, name: e.target.value })
                          }
                          className="transition-all focus:ring-2 focus:ring-primary/20"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="password" className="text-sm font-medium">
                        Password
                      </label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Set a secure password"
                          value={newClient.password}
                          onChange={(e) =>
                            setNewClient({
                              ...newClient,
                              password: e.target.value,
                            })
                          }
                          className="pr-10 transition-all focus:ring-2 focus:ring-primary/20"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button type="submit" className="gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Add Client
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowAddForm(false)
                          setNewClient({ email: "", name: "", password: "" })
                          setShowPassword(false)
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Search and Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="px-3 py-2 border rounded-md text-sm bg-background"
                    >
                      <option value="name">Sort by Name</option>
                      <option value="email">Sort by Email</option>
                      <option value="notes">Sort by Notes</option>
                    </select>
                    <select
                      value={filterBy}
                      onChange={(e) => setFilterBy(e.target.value as any)}
                      className="px-3 py-2 border rounded-md text-sm bg-background"
                    >
                      <option value="all">All Clients</option>
                      <option value="scheduled">Has Schedule</option>
                      <option value="unscheduled">No Schedule</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Clients Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  All Clients
                </CardTitle>
                <CardDescription>
                  Manage your client roster and credentials
                </CardDescription>
              </CardHeader>
              <CardContent>
                {Object.keys(filteredClients).length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground mb-2">
                      {Object.keys(clients).length === 0
                        ? "No clients yet. Add your first client above."
                        : "No clients match your search criteria."}
                    </p>
                    {searchTerm && (
                      <Button variant="outline" size="sm" onClick={() => setSearchTerm("")}>
                        Clear Search
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {Object.values(filteredClients).map((client) => (
                      <div
                        key={client.email}
                        className="group flex items-center justify-between p-4 border-2 rounded-lg hover:border-primary/30 hover:shadow-md transition-all"
                      >
                        {editingClient === client.email ? (
                          // Edit Mode
                          <div className="flex-1 flex flex-col md:flex-row gap-4">
                            <div className="flex-1 space-y-2">
                              <Input
                                value={editData.name}
                                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                placeholder="Name"
                                className="font-semibold"
                              />
                              <div className="text-sm text-muted-foreground flex items-center gap-2">
                                <Mail className="h-3 w-3" />
                                {client.email}
                              </div>
                            </div>
                            <div className="flex-1">
                              <Input
                                type="password"
                                value={editData.password}
                                onChange={(e) => setEditData({ ...editData, password: e.target.value })}
                                placeholder="New password (leave blank to keep current)"
                              />
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => handleUpdateClient(client.email)}
                                className="gap-2"
                              >
                                <CheckCircle className="h-4 w-4" />
                                Save
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setEditingClient(null)
                                  setEditData({ name: "", password: "" })
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          // View Mode
                          <>
                            <div className="flex-1">
                              <div className="font-semibold text-lg flex items-center gap-2">
                                {client.name}
                                {client.hasSchedule && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-600 dark:text-green-400">
                                    <CheckCircle className="h-3 w-3" />
                                    Scheduled
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-muted-foreground flex items-center gap-3 mt-1">
                                <span className="flex items-center gap-1">
                                  <Mail className="h-3 w-3" />
                                  {client.email}
                                </span>
                                {client.noteCount > 0 && (
                                  <span className="flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" />
                                    {client.noteCount} note{client.noteCount !== 1 ? 's' : ''}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => startEditing(client)}
                                className="gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Edit className="h-4 w-4" />
                                Edit
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteClient(client.email, client.name)}
                                className="gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}



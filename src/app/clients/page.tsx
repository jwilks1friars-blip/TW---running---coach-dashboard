"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { CoachSidebar } from "@/components/coach-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Users, Plus, Trash2, Edit } from "lucide-react"
import { isCoachAuthenticated } from "@/lib/auth"
import {
  getAllClients,
  saveClient,
  deleteClient,
  type Client,
} from "@/lib/client-data"

export default function ClientsPage() {
  const router = useRouter()
  const [clients, setClients] = useState<Record<string, Client>>({})
  const [showAddForm, setShowAddForm] = useState(false)
  const [newClient, setNewClient] = useState({
    email: "",
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

  const loadClients = () => {
    const allClients = getAllClients()
    setClients(allClients)
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
    loadClients()
    alert("Client added successfully!")
  }

  const handleDeleteClient = (email: string) => {
    if (
      !confirm(
        `Are you sure you want to delete ${email}?\n\nThis will remove:\n- Client account\n- All schedules\n- All notes\n- All updates\n\nThis action cannot be undone!`
      )
    ) {
      return
    }

    deleteClient(email)
    loadClients()
    alert("Client deleted successfully!")
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <CoachSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex-1">
              <h1 className="text-lg font-semibold">Manage Clients</h1>
            </div>
            <Button onClick={() => setShowAddForm(!showAddForm)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Client
            </Button>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
            {/* Add Client Form */}
            {showAddForm && (
              <Card>
                <CardHeader>
                  <CardTitle>Add New Client</CardTitle>
                  <CardDescription>
                    Create a new client account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddClient} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
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
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">
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
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="password" className="text-sm font-medium">
                        Password
                      </label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Set a password"
                        value={newClient.password}
                        onChange={(e) =>
                          setNewClient({
                            ...newClient,
                            password: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit">Add Client</Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowAddForm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Clients List */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>All Clients</CardTitle>
                    <CardDescription>
                      {Object.keys(clients).length} client(s) total
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {Object.keys(clients).length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      No clients yet. Add your first client above.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {Object.values(clients).map((client) => (
                      <div
                        key={client.email}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="font-semibold">{client.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {client.email}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              // Navigate to client details or edit
                              alert("Edit functionality coming soon!")
                            }}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteClient(client.email)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        </div>
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


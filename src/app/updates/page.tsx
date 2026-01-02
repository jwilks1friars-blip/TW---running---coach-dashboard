"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { CoachSidebar } from "@/components/coach-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bell, Plus, Trash2 } from "lucide-react"
import { isCoachAuthenticated } from "@/lib/auth"
import {
  getAllClients,
  getClientUpdates,
  addClientUpdate,
  deleteClientUpdate,
  type Update,
} from "@/lib/client-data"

export default function UpdatesPage() {
  const router = useRouter()
  const [clients, setClients] = useState<Record<string, any>>({})
  const [selectedClient, setSelectedClient] = useState("")
  const [updates, setUpdates] = useState<Update[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [newUpdate, setNewUpdate] = useState({ title: "", content: "" })

  useEffect(() => {
    if (!isCoachAuthenticated()) {
      router.push("/login")
      return
    }
    loadClients()
  }, [router])

  useEffect(() => {
    if (selectedClient) {
      loadUpdates()
    }
  }, [selectedClient])

  const loadClients = () => {
    const allClients = getAllClients()
    setClients(allClients)
  }

  const loadUpdates = () => {
    if (!selectedClient) return
    const clientUpdates = getClientUpdates(selectedClient)
    setUpdates(clientUpdates)
  }

  const handleAddUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedClient) {
      alert("Please select a client first")
      return
    }

    if (!newUpdate.title || !newUpdate.content) {
      alert("Please fill in both title and content")
      return
    }

    addClientUpdate(selectedClient, {
      ...newUpdate,
      date: new Date().toISOString(),
    })

    setNewUpdate({ title: "", content: "" })
    setShowAddForm(false)
    loadUpdates()
    alert("Update posted successfully!")
  }

  const handleDeleteUpdate = (index: number) => {
    if (!confirm("Are you sure you want to delete this update?")) return

    if (!selectedClient) return
    deleteClientUpdate(selectedClient, index)
    loadUpdates()
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <CoachSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex-1">
              <h1 className="text-lg font-semibold">Post Updates</h1>
            </div>
            {selectedClient && (
              <Button onClick={() => setShowAddForm(!showAddForm)}>
                <Plus className="h-4 w-4 mr-2" />
                Post Update
              </Button>
            )}
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
            {/* Client Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Select Client</CardTitle>
                <CardDescription>Choose a client to post updates for</CardDescription>
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
                {/* Add Update Form */}
                {showAddForm && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Post New Update</CardTitle>
                      <CardDescription>
                        Post an update for {clients[selectedClient]?.name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleAddUpdate} className="space-y-4">
                        <div className="space-y-2">
                          <label htmlFor="title" className="text-sm font-medium">
                            Update Title
                          </label>
                          <Input
                            id="title"
                            type="text"
                            placeholder="Update title"
                            value={newUpdate.title}
                            onChange={(e) =>
                              setNewUpdate({ ...newUpdate, title: e.target.value })
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="content" className="text-sm font-medium">
                            Update Content
                          </label>
                          <textarea
                            id="content"
                            placeholder="Write your update here..."
                            value={newUpdate.content}
                            onChange={(e) =>
                              setNewUpdate({
                                ...newUpdate,
                                content: e.target.value,
                              })
                            }
                            required
                            className="w-full min-h-[120px] p-2 border rounded-md"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button type="submit">Post Update</Button>
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

                {/* Updates List */}
                <Card>
                  <CardHeader>
                    <CardTitle>Updates for {clients[selectedClient]?.name}</CardTitle>
                    <CardDescription>
                      {updates.length} update(s) total
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {updates.length === 0 ? (
                      <div className="text-center py-8">
                        <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          No updates yet. Post your first update above.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {updates.map((update, index) => (
                          <div
                            key={index}
                            className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <h3 className="font-semibold text-lg mb-1">
                                  {update.title}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(update.date).toLocaleDateString()}
                                </p>
                              </div>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteUpdate(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <p className="text-sm whitespace-pre-wrap">
                              {update.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
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


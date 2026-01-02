"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { CoachSidebar } from "@/components/coach-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FileText, Plus, Trash2 } from "lucide-react"
import { isCoachAuthenticated } from "@/lib/auth"
import {
  getAllClients,
  getClientNotes,
  addClientNote,
  deleteClientNote,
  type CoachNote,
} from "@/lib/client-data"

export default function NotesPage() {
  const router = useRouter()
  const [clients, setClients] = useState<Record<string, any>>({})
  const [selectedClient, setSelectedClient] = useState("")
  const [notes, setNotes] = useState<CoachNote[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [newNote, setNewNote] = useState({ title: "", content: "" })

  useEffect(() => {
    if (!isCoachAuthenticated()) {
      router.push("/login")
      return
    }
    loadClients()
  }, [router])

  useEffect(() => {
    if (selectedClient) {
      loadNotes()
    }
  }, [selectedClient])

  const loadClients = () => {
    const allClients = getAllClients()
    setClients(allClients)
  }

  const loadNotes = () => {
    if (!selectedClient) return
    const clientNotes = getClientNotes(selectedClient)
    setNotes(clientNotes)
  }

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedClient) {
      alert("Please select a client first")
      return
    }

    if (!newNote.title || !newNote.content) {
      alert("Please fill in both title and content")
      return
    }

    addClientNote(selectedClient, {
      ...newNote,
      date: new Date().toISOString(),
    })

    setNewNote({ title: "", content: "" })
    setShowAddForm(false)
    loadNotes()
    alert("Note added successfully!")
  }

  const handleDeleteNote = (index: number) => {
    if (!confirm("Are you sure you want to delete this note?")) return

    if (!selectedClient) return
    deleteClientNote(selectedClient, index)
    loadNotes()
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <CoachSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex-1">
              <h1 className="text-lg font-semibold">Coach Notes</h1>
            </div>
            {selectedClient && (
              <Button onClick={() => setShowAddForm(!showAddForm)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Note
              </Button>
            )}
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
            {/* Client Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Select Client</CardTitle>
                <CardDescription>Choose a client to view or add notes</CardDescription>
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
                {/* Add Note Form */}
                {showAddForm && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Add New Note</CardTitle>
                      <CardDescription>
                        Add a note for {clients[selectedClient]?.name}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleAddNote} className="space-y-4">
                        <div className="space-y-2">
                          <label htmlFor="title" className="text-sm font-medium">
                            Note Title
                          </label>
                          <Input
                            id="title"
                            type="text"
                            placeholder="Note title"
                            value={newNote.title}
                            onChange={(e) =>
                              setNewNote({ ...newNote, title: e.target.value })
                            }
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="content" className="text-sm font-medium">
                            Note Content
                          </label>
                          <textarea
                            id="content"
                            placeholder="Write your note here..."
                            value={newNote.content}
                            onChange={(e) =>
                              setNewNote({ ...newNote, content: e.target.value })
                            }
                            required
                            className="w-full min-h-[120px] p-2 border rounded-md"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button type="submit">Add Note</Button>
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

                {/* Notes List */}
                <Card>
                  <CardHeader>
                    <CardTitle>Notes for {clients[selectedClient]?.name}</CardTitle>
                    <CardDescription>
                      {notes.length} note(s) total
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {notes.length === 0 ? (
                      <div className="text-center py-8">
                        <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          No notes yet. Add your first note above.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {notes.map((note, index) => (
                          <div
                            key={index}
                            className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <h3 className="font-semibold text-lg mb-1">
                                  {note.title}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {new Date(note.date).toLocaleDateString()}
                                </p>
                              </div>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteNote(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <p className="text-sm whitespace-pre-wrap">
                              {note.content}
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


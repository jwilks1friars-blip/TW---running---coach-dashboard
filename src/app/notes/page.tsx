"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { CoachSidebar } from "@/components/coach-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FileText, Plus, Trash2, User, Calendar, Search, Filter } from "lucide-react"
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
  const [filteredNotes, setFilteredNotes] = useState<CoachNote[]>([])
  const [searchTerm, setSearchTerm] = useState("")
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

  useEffect(() => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      setFilteredNotes(
        notes.filter(
          (note) =>
            note.title.toLowerCase().includes(term) ||
            note.content.toLowerCase().includes(term)
        )
      )
    } else {
      setFilteredNotes(notes)
    }
  }, [searchTerm, notes])

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
  }

  const handleDeleteNote = (index: number) => {
    if (!confirm("Are you sure you want to delete this note?")) return

    if (!selectedClient) return
    deleteClientNote(selectedClient, index)
    loadNotes()
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
              <h1 className="text-lg font-semibold">Coach Notes</h1>
              <p className="text-xs text-muted-foreground">
                {selectedClient ? `${filteredNotes.length} of ${notes.length} notes` : 'Select a client to view notes'}
              </p>
            </div>
            {selectedClient && (
              <Button onClick={() => setShowAddForm(!showAddForm)} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Note
              </Button>
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
                <CardDescription>Choose an athlete to view or add notes</CardDescription>
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
                {/* Add Note Form */}
                {showAddForm && (
                  <Card className="border-2 border-primary/20 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        Add New Note
                      </CardTitle>
                      <CardDescription>
                        Create a coaching note for {clients[selectedClient]?.name}
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
                            placeholder="e.g., Progress Update, Race Plan, etc."
                            value={newNote.title}
                            onChange={(e) =>
                              setNewNote({ ...newNote, title: e.target.value })
                            }
                            className="transition-all focus:ring-2 focus:ring-primary/20"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="content" className="text-sm font-medium">
                            Note Content
                          </label>
                          <textarea
                            id="content"
                            placeholder="Write your detailed coaching note here..."
                            value={newNote.content}
                            onChange={(e) =>
                              setNewNote({ ...newNote, content: e.target.value })
                            }
                            required
                            className="w-full min-h-[150px] p-3 border-2 rounded-lg transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary resize-y"
                          />
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button type="submit" className="gap-2">
                            <FileText className="h-4 w-4" />
                            Save Note
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setShowAddForm(false)
                              setNewNote({ title: "", content: "" })
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                )}

                {/* Search */}
                {notes.length > 0 && (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search notes by title or content..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Notes List */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      Notes for {clients[selectedClient]?.name}
                    </CardTitle>
                    <CardDescription>
                      {filteredNotes.length} note(s) {searchTerm && `matching "${searchTerm}"`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {filteredNotes.length === 0 ? (
                      <div className="text-center py-12">
                        <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                        <p className="text-sm text-muted-foreground mb-2">
                          {notes.length === 0
                            ? "No notes yet. Add your first coaching note above."
                            : "No notes match your search criteria."}
                        </p>
                        {searchTerm && (
                          <Button variant="outline" size="sm" onClick={() => setSearchTerm("")}>
                            Clear Search
                          </Button>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {filteredNotes.map((note, index) => (
                          <div
                            key={index}
                            className="group border-2 rounded-lg p-5 hover:border-primary/30 hover:shadow-md transition-all"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h3 className="font-bold text-lg mb-2">
                                  {note.title}
                                </h3>
                                <p className="text-sm text-muted-foreground flex items-center gap-2">
                                  <Calendar className="h-3 w-3" />
                                  {new Date(note.date).toLocaleDateString('en-US', {
                                    weekday: 'short',
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                  })}
                                  <span className="text-xs">• {getTimeAgo(note.date)}</span>
                                </p>
                              </div>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteNote(notes.indexOf(note))}
                                className="gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete
                              </Button>
                            </div>
                            <div className="pl-4 border-l-4 border-primary/20">
                              <p className="text-sm whitespace-pre-wrap leading-relaxed">
                                {note.content}
                              </p>
                            </div>
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

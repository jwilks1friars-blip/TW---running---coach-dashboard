"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { CoachSidebar } from "@/components/coach-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { isCoachAuthenticated } from "@/lib/auth"
import {
  Users, Clock, CheckCircle, PhoneCall, XCircle,
  ChevronDown, ChevronUp, Mail, Phone, Activity,
  Target, Calendar, Loader2
} from "lucide-react"

const CLIENT_PORTAL_URL = process.env.NEXT_PUBLIC_CLIENT_PORTAL_URL ||
  'https://tw-client-dashbaord-jwilks1friars-6300s-projects.vercel.app'
const API_KEY = process.env.NEXT_PUBLIC_INQUIRIES_API_KEY || 'tw-inquiries-secret-key'

type Status = 'new' | 'contacted' | 'onboarded' | 'declined'

interface Signup {
  id: string
  createdAt: string
  status: Status
  name: string
  email: string
  phone: string
  experienceLevel: string
  programInterest: string
  weeklyMileage: string
  goals: string
  availability: string
  coachNotes: string
}

const STATUS_CONFIG: Record<Status, { label: string; color: string; bgColor: string; icon: React.ReactNode }> = {
  new:       { label: 'New',       color: 'text-blue-400',   bgColor: 'bg-blue-500/15 border-blue-500/30',   icon: <Clock className="h-3 w-3" /> },
  contacted: { label: 'Contacted', color: 'text-yellow-400', bgColor: 'bg-yellow-500/15 border-yellow-500/30', icon: <PhoneCall className="h-3 w-3" /> },
  onboarded: { label: 'Onboarded', color: 'text-green-400',  bgColor: 'bg-green-500/15 border-green-500/30',  icon: <CheckCircle className="h-3 w-3" /> },
  declined:  { label: 'Declined',  color: 'text-red-400',    bgColor: 'bg-red-500/15 border-red-500/30',     icon: <XCircle className="h-3 w-3" /> },
}

function StatusBadge({ status }: { status: Status }) {
  const cfg = STATUS_CONFIG[status]
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium ${cfg.bgColor} ${cfg.color}`}>
      {cfg.icon}{cfg.label}
    </span>
  )
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })
}

function InquiryCard({ signup, onUpdate }: { signup: Signup; onUpdate: (id: string, updates: Partial<Signup>) => Promise<void> }) {
  const [expanded, setExpanded] = useState(false)
  const [notes, setNotes] = useState(signup.coachNotes)
  const [savingNotes, setSavingNotes] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)

  const handleStatusChange = async (status: Status) => {
    setUpdatingStatus(true)
    await onUpdate(signup.id, { status })
    setUpdatingStatus(false)
  }

  const handleSaveNotes = async () => {
    setSavingNotes(true)
    await onUpdate(signup.id, { coachNotes: notes })
    setSavingNotes(false)
  }

  return (
    <Card className={`transition-all ${expanded ? 'ring-1 ring-primary/30' : ''}`}>
      <div className="p-4 cursor-pointer flex items-start justify-between gap-4" onClick={() => setExpanded(v => !v)}>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold">{signup.name}</span>
            <StatusBadge status={signup.status} />
          </div>
          <div className="flex items-center gap-3 mt-1 flex-wrap">
            <span className="text-sm text-muted-foreground flex items-center gap-1"><Mail className="h-3 w-3" />{signup.email}</span>
            {signup.phone && <span className="text-sm text-muted-foreground flex items-center gap-1"><Phone className="h-3 w-3" />{signup.phone}</span>}
          </div>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">{signup.programInterest}</span>
            <span className="text-xs text-muted-foreground">{formatDate(signup.createdAt)}</span>
          </div>
        </div>
        <div className="shrink-0 text-muted-foreground">
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </div>
      </div>

      {expanded && (
        <div className="border-t px-4 pb-4 pt-4 space-y-4">
          <div className="grid sm:grid-cols-3 gap-3">
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-0.5 flex items-center gap-1"><Activity className="h-3 w-3" />Experience</p>
              <p className="text-sm font-medium">{signup.experienceLevel || '—'}</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-0.5 flex items-center gap-1"><Target className="h-3 w-3" />Weekly Mileage</p>
              <p className="text-sm font-medium">{signup.weeklyMileage || '—'}</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-0.5 flex items-center gap-1"><Calendar className="h-3 w-3" />Submitted</p>
              <p className="text-sm font-medium">{formatDate(signup.createdAt)}</p>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Goals</p>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{signup.goals}</p>
          </div>

          {signup.availability && (
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Availability</p>
              <p className="text-sm">{signup.availability}</p>
            </div>
          )}

          <div className="space-y-2">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Coach Notes</p>
            <textarea
              rows={3}
              placeholder="Add private notes about this inquiry..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
            {notes !== signup.coachNotes && (
              <Button size="sm" variant="outline" onClick={handleSaveNotes} disabled={savingNotes}>
                {savingNotes ? <><Loader2 className="h-3 w-3 mr-1 animate-spin" />Saving...</> : 'Save Notes'}
              </Button>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Update Status</p>
            <div className="flex flex-wrap gap-2">
              {(['new', 'contacted', 'onboarded', 'declined'] as Status[]).map(s => (
                <Button
                  key={s}
                  size="sm"
                  variant={signup.status === s ? 'default' : 'outline'}
                  disabled={updatingStatus || signup.status === s}
                  onClick={() => handleStatusChange(s)}
                >
                  {STATUS_CONFIG[s].label}
                </Button>
              ))}
            </div>
          </div>

          <a href={`mailto:${signup.email}?subject=Re: Running Program Inquiry - ${signup.programInterest}`}
            className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
            <Mail className="h-3.5 w-3.5" />Email {signup.name.split(' ')[0]}
          </a>
        </div>
      )}
    </Card>
  )
}

export default function InquiriesPage() {
  const router = useRouter()
  const [signups, setSignups] = useState<Signup[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState<Status | 'all'>('all')

  const fetchSignups = useCallback(async () => {
    try {
      const res = await fetch(`${CLIENT_PORTAL_URL}/api/inquiries`, {
        headers: { 'x-api-key': API_KEY },
      })
      if (!res.ok) throw new Error('Failed to fetch')
      setSignups(await res.json())
    } catch {
      setError('Could not load inquiries. Check that NEXT_PUBLIC_CLIENT_PORTAL_URL and NEXT_PUBLIC_INQUIRIES_API_KEY are set correctly.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!isCoachAuthenticated()) { router.push('/login'); return }
    fetchSignups()
  }, [router, fetchSignups])

  const handleUpdate = async (id: string, updates: Partial<Signup>) => {
    const res = await fetch(`${CLIENT_PORTAL_URL}/api/inquiries`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY },
      body: JSON.stringify({ id, ...updates }),
    })
    if (res.ok) {
      const updated = await res.json()
      setSignups(prev => prev.map(s => s.id === id ? updated : s))
    }
  }

  const counts = {
    all: signups.length,
    new: signups.filter(s => s.status === 'new').length,
    contacted: signups.filter(s => s.status === 'contacted').length,
    onboarded: signups.filter(s => s.status === 'onboarded').length,
    declined: signups.filter(s => s.status === 'declined').length,
  }

  const filtered = filter === 'all' ? signups : signups.filter(s => s.status === filter)

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <CoachSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex-1">
              <h1 className="text-lg font-semibold">Inquiries</h1>
            </div>
            <Button variant="outline" size="sm" onClick={fetchSignups}>Refresh</Button>
          </header>

          <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Card><CardContent className="p-4">
                <div className="flex items-center gap-2 mb-1"><Users className="h-4 w-4 text-muted-foreground" /><span className="text-xs text-muted-foreground">Total</span></div>
                <p className="text-2xl font-bold">{counts.all}</p>
              </CardContent></Card>
              <Card className="border-blue-500/20 bg-blue-500/5"><CardContent className="p-4">
                <div className="flex items-center gap-2 mb-1"><Clock className="h-4 w-4 text-blue-400" /><span className="text-xs text-blue-400">New</span></div>
                <p className="text-2xl font-bold">{counts.new}</p>
              </CardContent></Card>
              <Card className="border-green-500/20 bg-green-500/5"><CardContent className="p-4">
                <div className="flex items-center gap-2 mb-1"><CheckCircle className="h-4 w-4 text-green-400" /><span className="text-xs text-green-400">Onboarded</span></div>
                <p className="text-2xl font-bold">{counts.onboarded}</p>
              </CardContent></Card>
              <Card className="border-yellow-500/20 bg-yellow-500/5"><CardContent className="p-4">
                <div className="flex items-center gap-2 mb-1"><PhoneCall className="h-4 w-4 text-yellow-400" /><span className="text-xs text-yellow-400">Contacted</span></div>
                <p className="text-2xl font-bold">{counts.contacted}</p>
              </CardContent></Card>
            </div>

            {/* Filter + List */}
            <Card>
              <CardHeader className="pb-2 pt-4 px-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <CardTitle className="text-base">All Inquiries</CardTitle>
                  <div className="flex gap-1 flex-wrap">
                    {(['all', 'new', 'contacted', 'onboarded', 'declined'] as const).map(s => (
                      <button key={s} onClick={() => setFilter(s)}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${filter === s ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}>
                        {s.charAt(0).toUpperCase() + s.slice(1)} ({s === 'all' ? counts.all : counts[s as Status]})
                      </button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="px-4 pb-4 space-y-3">
                {loading ? (
                  <div className="flex items-center justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
                ) : error ? (
                  <div className="py-8 text-center text-sm text-destructive">{error}</div>
                ) : filtered.length === 0 ? (
                  <div className="text-center py-16 space-y-2">
                    <Users className="h-8 w-8 text-muted-foreground/30 mx-auto" />
                    <p className="text-muted-foreground text-sm">{filter === 'all' ? 'No inquiries yet.' : `No ${filter} inquiries.`}</p>
                  </div>
                ) : (
                  filtered.map(signup => <InquiryCard key={signup.id} signup={signup} onUpdate={handleUpdate} />)
                )}
              </CardContent>
            </Card>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

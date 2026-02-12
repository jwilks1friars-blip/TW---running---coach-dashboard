"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { CoachSidebar } from "@/components/coach-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Settings } from "lucide-react"
import { isCoachAuthenticated } from "@/lib/auth"

export default function SettingsPage() {
  const router = useRouter()

  useEffect(() => {
    if (!isCoachAuthenticated()) {
      router.push("/login")
    }
  }, [router])

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <CoachSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex-1">
              <h1 className="text-lg font-semibold">Settings</h1>
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your coach account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Name
                  </label>
                  <Input
                    id="name"
                    type="text"
                    defaultValue="Tyler Wilks"
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue="coach@tylerwilksrunning.com"
                    disabled
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">
                    Coach Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Change password"
                    disabled
                  />
                  <p className="text-xs text-muted-foreground">
                    To change password, edit the DEFAULT_COACH_PASSWORD in src/lib/auth.ts
                  </p>
                </div>
                <Button disabled>Save Changes</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
                <CardDescription>Manage client data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  All data is stored in browser localStorage. This means data is
                  stored locally on your device.
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" disabled>
                    Export Data
                  </Button>
                  <Button variant="outline" disabled>
                    Import Data
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Export/Import features coming soon!
                </p>
              </CardContent>
            </Card>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}



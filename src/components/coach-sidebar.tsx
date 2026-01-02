"use client"

import { useRouter } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  Bell,
  Settings,
  LogOut,
} from "lucide-react"
import { clearCoachAuth } from "@/lib/auth"

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    url: "/",
  },
  {
    title: "Clients",
    icon: Users,
    url: "/clients",
  },
  {
    title: "Schedules",
    icon: Calendar,
    url: "/schedules",
  },
  {
    title: "Notes",
    icon: FileText,
    url: "/notes",
  },
  {
    title: "Updates",
    icon: Bell,
    url: "/updates",
  },
  {
    title: "Settings",
    icon: Settings,
    url: "/settings",
  },
]

export function CoachSidebar() {
  const router = useRouter()

  const handleLogout = () => {
    clearCoachAuth()
    router.push("/login")
  }

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-border">
        <div className="flex items-center gap-2 px-2 py-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="text-sm font-bold">TW</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Tyler Wilks</span>
            <span className="text-xs text-muted-foreground">Coach</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-border p-4">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}


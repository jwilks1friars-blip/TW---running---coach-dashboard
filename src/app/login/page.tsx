"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, Eye, EyeOff, Activity, Users, Calendar } from "lucide-react"
import { checkCoachAuth, setCoachPassword, isCoachAuthenticated, DEFAULT_COACH_PASSWORD } from "@/lib/auth"

export default function CoachLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isCoachAuthenticated()) {
      router.push("/")
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Simulate a brief loading state for better UX
    await new Promise(resolve => setTimeout(resolve, 500))

    const correctPassword = DEFAULT_COACH_PASSWORD

    if (password === correctPassword) {
      setCoachPassword(password)
      router.push("/")
    } else {
      setError("Incorrect password. Please try again.")
      setLoading(false)
      setPassword("")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-900 to-black">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>

        {/* Floating elements */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 w-full max-w-md p-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 backdrop-blur-sm border-2 border-primary/50 mb-4">
            <Activity className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Coach Portal</h1>
          <p className="text-gray-300">Manage your athletes and training programs</p>
        </div>

        <Card className="border-2 border-white/10 backdrop-blur-xl bg-white/10 shadow-2xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-white">Welcome Back</CardTitle>
            <CardDescription className="text-gray-300">
              Sign in to access your admin dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-4 bg-red-500/20 border-2 border-red-500/50 rounded-lg backdrop-blur-sm">
                <p className="text-red-200 text-sm font-medium text-center">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-white flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    disabled={loading}
                    className="pr-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-primary focus:ring-primary/50 backdrop-blur-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 text-base font-semibold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/50"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Signing in...
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4 mr-2" />
                    Sign In
                  </>
                )}
              </Button>
            </form>

            {/* Features showcase */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-xs text-gray-400 mb-3 text-center">What you can do:</p>
              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col items-center gap-2 p-3 rounded-lg bg-white/5 backdrop-blur-sm">
                  <Users className="h-5 w-5 text-blue-400" />
                  <span className="text-xs text-gray-300">Manage Clients</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-3 rounded-lg bg-white/5 backdrop-blur-sm">
                  <Calendar className="h-5 w-5 text-green-400" />
                  <span className="text-xs text-gray-300">Plan Schedules</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-3 rounded-lg bg-white/5 backdrop-blur-sm">
                  <Activity className="h-5 w-5 text-purple-400" />
                  <span className="text-xs text-gray-300">Track Progress</span>
                </div>
              </div>
            </div>

            <p className="mt-4 text-center text-xs text-gray-400">
              Change password in: <code className="text-gray-300 bg-white/10 px-2 py-0.5 rounded">src/lib/auth.ts</code>
            </p>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-gray-400 mt-6">
          Secure coach authentication • Admin access only
        </p>
      </div>
    </div>
  )
}

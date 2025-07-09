"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/hooks/use-auth"
import StagiaireDashboard from "./stagiaire/page"
import EnseignantDashboard from "./enseignant/page"

export default function DashboardRedirect() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      if (user.role === "stagiaire") {
        router.replace("/dashboard/stagiaire")
      } else if (user.role === "enseignant") {
        router.replace("/dashboard/enseignant")
      }
    }
  }, [user, loading, router])

  if (loading || !user) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
      </div>
    )
  }

  // This part will be briefly visible during redirection, or you can return a specific component
  if (user?.role === "stagiaire") return <StagiaireDashboard />
  if (user?.role === "enseignant") return <EnseignantDashboard />

  return null // Or a fallback UI
}

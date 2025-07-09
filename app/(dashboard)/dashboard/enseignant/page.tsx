"use client"

import { useAuth } from "@/lib/hooks/use-auth"
import StatsCard from "@/components/dashboard/stats-card"
import { BookCheck, FolderKanban, Users, ClipboardList } from "lucide-react"
import ProjectSupervision from "@/components/enseignant/project-supervision"
import QuizCreator from "@/components/enseignant/quiz-creator"

export default function EnseignantDashboard() {
  const { user } = useAuth()

  if (!user) return null

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Tableau de bord Enseignant</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Projets Supervisés" value="0" icon={FolderKanban} description="0 nouveaux projets" />
        <StatsCard title="Stagiaires Actifs" value="0" icon={Users} description="0% d'activité" />
        <StatsCard title="Quiz Créés" value="0" icon={BookCheck} description="0 cette semaine" />
        <StatsCard title="Évaluations" value="0" icon={ClipboardList} description="0 en attente" />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <ProjectSupervision />
        <QuizCreator />
      </div>
    </div>
  )
}

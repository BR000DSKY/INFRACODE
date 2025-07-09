"use client"

import { useAuth } from "@/lib/hooks/use-auth"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Award, BarChart, BookOpen, FolderKanban, MessageSquare, Users, Sparkles, TrendingUp } from "lucide-react"
import StatsCard from "@/components/dashboard/stats-card"
import ProjectList from "@/components/stagiaire/project-list" // Will be a compact version
import TaskManager from "@/components/stagiaire/task-manager" // Will be a compact version
import AnalyticsChart from "@/components/dashboard/analytics-chart"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function StagiaireDashboard() {
  const { user } = useAuth()

  if (!user) return null

  const userProjects = 0 // Placeholder
  const completedTasks = 0 // Placeholder

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      className="space-y-8"
    >
      <motion.div variants={cardVariants}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              Bienvenue, <span className="text-primary">{user.username}</span>!
            </h1>
            <p className="text-muted-foreground text-lg">Prêt à innover aujourd'hui ?</p>
          </div>
          <Link href="/dashboard/projects/create">
            <Button
              size="lg"
              className="group bg-gradient-to-r from-primary to-orange-600 hover:from-primary/90 hover:to-orange-600/90 text-white"
            >
              <Sparkles className="mr-2 h-5 w-5 transition-transform group-hover:scale-125" />
              Nouveau Projet
            </Button>
          </Link>
        </div>
      </motion.div>

      <motion.div variants={cardVariants} className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Mes Projets"
          value={userProjects}
          icon={FolderKanban}
          description="Continuez votre excellent travail !"
          color="text-blue-500"
        />
        <StatsCard
          title="Points d'Honneur"
          value={user.points || 0}
          icon={Award}
          description="+0 cette semaine"
          color="text-yellow-500"
        />
        <StatsCard
          title="Tâches Complétées"
          value={completedTasks}
          icon={BarChart}
          description="0% de progression"
          color="text-green-500"
        />
        <StatsCard
          title="Badges Obtenus"
          value={user.badges?.length || 0}
          icon={BookOpen}
          description="Collectionnez-les tous !"
          color="text-purple-500"
        />
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-3">
        <motion.div variants={cardVariants} className="lg:col-span-2">
          <Card className="shadow-xl hover:shadow-2xl transition-shadow duration-300 border-border/30">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <TrendingUp className="mr-2 h-6 w-6 text-primary" />
                Progression des Projets
              </CardTitle>
              <CardDescription>Visualisez l'avancement de vos tâches et projets.</CardDescription>
            </CardHeader>
            <CardContent>
              <AnalyticsChart />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={cardVariants}>
          <Card className="shadow-xl hover:shadow-2xl transition-shadow duration-300 border-border/30 h-full">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center">
                <MessageSquare className="mr-2 h-6 w-6 text-primary" />
                Activité Récente
              </CardTitle>
              <CardDescription>Dernières notifications et messages.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Placeholder for notifications/activity feed */}
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  <Users className="h-5 w-5 mr-3 text-muted-foreground" />
                  <p className="text-sm">Nouveau commentaire sur "Projet Alpha".</p>
                </div>
              ))}
              <Link href="/notifications">
                <Button variant="outline" className="w-full mt-4">
                  Voir toutes les notifications
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <motion.div variants={cardVariants}>
          {/* Compact Project List - Link to full page */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-border/30">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl">Aperçu Projets</CardTitle>
                <CardDescription>Vos 3 projets les plus récents.</CardDescription>
              </div>
              <Link href="/dashboard/projects">
                <Button variant="outline" size="sm">
                  Voir Tout
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <ProjectList compact={true} />
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={cardVariants}>
          {/* Compact Task Manager - Link to full page */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-border/30">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl">Aperçu Tâches</CardTitle>
                <CardDescription>Vos tâches urgentes.</CardDescription>
              </div>
              <Link href="/tasks">
                <Button variant="outline" size="sm">
                  Voir Tout
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <TaskManager compact={true} />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}

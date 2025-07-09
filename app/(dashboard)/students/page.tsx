"use client"
import { motion } from "framer-motion"
import Link from "next/link" // Keep for project links

import { Users2, Search, Award, Briefcase, Star, TrendingUp } from "lucide-react" // Removed Eye icon as button is removed
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useLocalStorage } from "@/lib/hooks/use-local-storage"
import type { User, Project, Quiz, QuizAttempt } from "@/types"
import { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button" // Button is no longer used in CardFooter here
import { initialUsers, initialProjects, initialQuizzes, initialQuizAttempts } from "@/lib/data"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: "easeOut" },
  }),
}

export default function StudentsTrackingPage() {
  const [allUsers, setAllUsers] = useLocalStorage<User[]>("users", [])
  const [allProjects, setAllProjects] = useLocalStorage<Project[]>("projects", [])
  const [allQuizzes, setAllQuizzes] = useLocalStorage<Quiz[]>("quizzes", [])
  const [allQuizAttempts, setAllQuizAttempts] = useLocalStorage<QuizAttempt[]>("quizAttempts", [])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const usersExist = localStorage.getItem("users")
    const projectsExist = localStorage.getItem("projects")
    const quizzesExist = localStorage.getItem("quizzes")
    const quizAttemptsExist = localStorage.getItem("quizAttempts")

    if (usersExist === null || JSON.parse(usersExist).length === 0) {
      setAllUsers(initialUsers)
    }
    if (projectsExist === null || JSON.parse(projectsExist).length === 0) {
      setAllProjects(initialProjects)
    }
    if (quizzesExist === null || JSON.parse(quizzesExist).length === 0) {
      setAllQuizzes(initialQuizzes)
    }
    if (quizAttemptsExist === null || JSON.parse(quizAttemptsExist).length === 0) {
      setAllQuizAttempts(initialQuizAttempts)
    }
  }, [setAllUsers, setAllProjects, setAllQuizzes, setAllQuizAttempts])

  const stagiaires = allUsers.filter(
    (user) =>
      user.role === "stagiaire" &&
      (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.username && user.username.toLowerCase().includes(searchTerm.toLowerCase()))),
  )

  const getStagiaireDetails = (stagiaireId: string) => {
    const projects = allProjects.filter((p) => p.ownerId === stagiaireId)
    const latestProject = projects.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]

    const attempts = allQuizAttempts.filter((qa) => qa.userId === stagiaireId)
    let averageScore = 0
    if (attempts.length > 0) {
      const totalScore = attempts.reduce((sum, attempt) => sum + (attempt.score / attempt.totalQuestions) * 100, 0)
      averageScore = Math.round(totalScore / attempts.length)
    }

    return {
      projectCount: projects.length,
      latestProject,
      quizAttemptCount: attempts.length,
      averageQuizScore: averageScore,
    }
  }

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="space-y-8 p-4 md:p-8"
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight flex items-center">
            <Users2 className="mr-3 h-8 w-8 md:h-10 md:w-10 text-primary" />
            Suivi des Stagiaires
          </h1>
          <p className="text-muted-foreground">Aperçu détaillé de la progression de vos étudiants.</p>
        </motion.div>

        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="relative"
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Rechercher un stagiaire par nom ou nom d'utilisateur..."
            className="pl-10 bg-card border-border/50 focus:border-primary shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </motion.div>

        {stagiaires.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {stagiaires.map((stagiaire, i) => {
              const details = getStagiaireDetails(stagiaire.id)
              return (
                <motion.div key={stagiaire.id} custom={i} variants={cardVariants} initial="hidden" animate="visible">
                  <Card className="h-full flex flex-col group hover-lift border-border/30 shadow-md hover:shadow-primary/30 transition-shadow duration-300 overflow-hidden">
                    <CardHeader className="flex flex-row items-start gap-4 pb-3 bg-card p-4">
                      <Avatar className="h-16 w-16 border-2 border-primary/40 shrink-0">
                        <AvatarImage
                          src={
                            stagiaire.logo || // Use the logo from data if available
                            `/placeholder.svg?width=80&height=80&query=professional+avatar+${encodeURIComponent(stagiaire.name)}`
                          }
                          alt={stagiaire.name}
                        />
                        <AvatarFallback className="text-xl">
                          {stagiaire.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-grow">
                        <CardTitle className="text-xl group-hover:text-primary transition-colors">
                          {stagiaire.name}
                        </CardTitle>
                        <CardDescription>
                          @{stagiaire.username || stagiaire.id} - Filière {stagiaire.filiereId}
                        </CardDescription>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {stagiaire.badges?.slice(0, 3).map((badge) => (
                            <Tooltip key={badge}>
                              <TooltipTrigger asChild>
                                <Badge
                                  variant="secondary"
                                  className="text-xs px-2 py-0.5 bg-primary/10 text-primary border-primary/30 cursor-default"
                                >
                                  <Star className="h-3 w-3 mr-1" />
                                  {badge}
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{badge}</p>
                              </TooltipContent>
                            </Tooltip>
                          ))}
                          {stagiaire.badges && stagiaire.badges.length > 3 && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Badge variant="outline" className="text-xs px-2 py-0.5 cursor-default">
                                  +{stagiaire.badges.length - 3} autres
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{stagiaire.badges.slice(3).join(", ")}</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-4 p-4">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground flex items-center">
                            <Award className="h-4 w-4 mr-1.5 text-primary/80" />
                            Points d'Honneur:
                          </span>
                          <span className="font-semibold text-lg text-primary">{stagiaire.points || 0}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-muted-foreground flex items-center">
                          <Briefcase className="h-4 w-4 mr-1.5 text-primary/80" /> Activité Projets
                        </h4>
                        <div className="flex items-center justify-between text-xs">
                          <span>Total Projets:</span>
                          <span className="font-semibold">{details.projectCount}</span>
                        </div>
                        {details.latestProject && (
                          <div className="p-2 border border-border/30 rounded-md bg-background/50 space-y-1">
                            <p className="text-xs text-muted-foreground">Dernier Projet:</p>
                            <Link
                              href={`/projects/${details.latestProject.id}`}
                              className="text-sm font-semibold text-primary hover:underline truncate block"
                              title={details.latestProject.title}
                            >
                              {details.latestProject.title}
                            </Link>
                            <p className="text-xs text-muted-foreground">
                              Créé le: {new Date(details.latestProject.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                        {!details.latestProject && details.projectCount === 0 && (
                          <p className="text-xs text-muted-foreground text-center py-2">Aucun projet publié.</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-muted-foreground flex items-center">
                          <TrendingUp className="h-4 w-4 mr-1.5 text-primary/80" /> Performance Quiz
                        </h4>
                        <div className="flex items-center justify-between text-xs">
                          <span>Quiz Tentés:</span>
                          <span className="font-semibold">{details.quizAttemptCount}</span>
                        </div>
                        {details.quizAttemptCount > 0 && (
                          <>
                            <div className="flex items-center justify-between text-xs">
                              <span>Score Moyen:</span>
                              <span className="font-semibold">{details.averageQuizScore}%</span>
                            </div>
                            <Progress value={details.averageQuizScore} className="h-2" />
                          </>
                        )}
                        {details.quizAttemptCount === 0 && (
                          <p className="text-xs text-muted-foreground text-center py-2">Aucun quiz tenté.</p>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="p-2 border-t border-border/30 min-h-[2rem]">
                      {/* Footer can be used for other actions in the future or removed */}
                    </CardFooter>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16 border-2 border-dashed border-border/50 rounded-lg bg-card"
          >
            <Search className="mx-auto h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-xl font-semibold">Aucun stagiaire trouvé</h3>
            <p className="text-muted-foreground">
              Vérifiez votre recherche ou attendez que des stagiaires s'inscrivent. Les données initiales devraient se
              charger automatiquement.
            </p>
          </motion.div>
        )}
      </motion.div>
    </TooltipProvider>
  )
}

"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
import { BarChart, Users, CheckCircle, Percent, Clock, HelpCircle, Search, Download } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { Quiz, QuizAttempt } from "@/types" // Assuming QuizAttempt type exists
import { ResponsiveContainer, BarChart as RechartsBarChart, XAxis, YAxis, Tooltip, Legend, Bar } from "recharts"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

// Mock data - replace with actual data fetching
const mockQuizAttempts: QuizAttempt[] = [
  {
    id: "attempt1",
    quizId: "quiz1_intro_js",
    studentId: "studentA",
    studentName: "Alice Wonderland",
    score: 80,
    totalQuestions: 10,
    correctAnswers: 8,
    incorrectAnswers: 2,
    completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    timeTaken: 1200,
  }, // 20 minutes
  {
    id: "attempt2",
    quizId: "quiz1_intro_js",
    studentId: "studentB",
    studentName: "Bob The Builder",
    score: 60,
    totalQuestions: 10,
    correctAnswers: 6,
    incorrectAnswers: 4,
    completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    timeTaken: 1500,
  }, // 25 minutes
  {
    id: "attempt3",
    quizId: "quiz2_advanced_react",
    studentId: "studentA",
    studentName: "Alice Wonderland",
    score: 95,
    totalQuestions: 20,
    correctAnswers: 19,
    incorrectAnswers: 1,
    completedAt: new Date().toISOString(),
    timeTaken: 2400,
  }, // 40 minutes
  {
    id: "attempt4",
    quizId: "quiz1_intro_js",
    studentId: "studentC",
    studentName: "Charlie Brown",
    score: 70,
    totalQuestions: 10,
    correctAnswers: 7,
    incorrectAnswers: 3,
    completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    timeTaken: 900,
  }, // 15 minutes
]

export default function QuizResultsPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [allAttempts, setAllAttempts] = useState<QuizAttempt[]>([])
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    const storedQuizzes: Quiz[] = JSON.parse(localStorage.getItem("quizzes") || "[]")
    setQuizzes(storedQuizzes.filter((q) => q.published)) // Only show results for published quizzes

    // For demo, using mock attempts. In real app, fetch attempts from backend.
    // Filter attempts based on available quizzes
    const availableQuizIds = storedQuizzes.map((q) => q.id)
    const relevantAttempts = mockQuizAttempts.filter((attempt) => availableQuizIds.includes(attempt.quizId))
    setAllAttempts(relevantAttempts)

    if (storedQuizzes.length > 0 && storedQuizzes.filter((q) => q.published).length > 0) {
      setSelectedQuizId(storedQuizzes.filter((q) => q.published)[0].id)
    }
    setIsLoading(false)
  }, [])

  const selectedQuizAttempts = useMemo(() => {
    if (!selectedQuizId) return []
    return allAttempts
      .filter((attempt) => attempt.quizId === selectedQuizId)
      .filter((attempt) => attempt.studentName.toLowerCase().includes(searchTerm.toLowerCase()))
  }, [selectedQuizId, allAttempts, searchTerm])

  const selectedQuiz = quizzes.find((q) => q.id === selectedQuizId)

  const overallStats = useMemo(() => {
    if (allAttempts.length === 0) return { totalAttempts: 0, avgScore: 0, avgCompletionRate: 0, uniqueParticipants: 0 }
    const totalScore = allAttempts.reduce((sum, attempt) => sum + attempt.score, 0)
    const uniqueParticipants = new Set(allAttempts.map((a) => a.studentId)).size
    return {
      totalAttempts: allAttempts.length,
      avgScore: Number.parseFloat((totalScore / allAttempts.length).toFixed(1)) || 0,
      avgCompletionRate:
        Number.parseFloat(
          (
            allAttempts.reduce((sum, attempt) => sum + (attempt.correctAnswers / attempt.totalQuestions) * 100, 0) /
            allAttempts.length
          ).toFixed(1),
        ) || 0,
      uniqueParticipants,
    }
  }, [allAttempts])

  const quizSpecificStats = useMemo(() => {
    if (selectedQuizAttempts.length === 0 || !selectedQuiz) return { avgScore: 0, completionRate: 0, avgTime: "N/A" }
    const totalScore = selectedQuizAttempts.reduce((sum, attempt) => sum + attempt.score, 0)
    const totalCorrect = selectedQuizAttempts.reduce((sum, attempt) => sum + attempt.correctAnswers, 0)
    const totalPossible = selectedQuizAttempts.reduce((sum, attempt) => sum + attempt.totalQuestions, 0)
    const totalTime = selectedQuizAttempts.reduce((sum, attempt) => sum + attempt.timeTaken, 0)
    const avgTimeSeconds = totalTime / selectedQuizAttempts.length
    const minutes = Math.floor(avgTimeSeconds / 60)
    const seconds = Math.floor(avgTimeSeconds % 60)

    return {
      avgScore: Number.parseFloat((totalScore / selectedQuizAttempts.length).toFixed(1)) || 0,
      completionRate: Number.parseFloat(((totalCorrect / totalPossible) * 100).toFixed(1)) || 0,
      avgTime: `${minutes}m ${seconds}s`,
    }
  }, [selectedQuizAttempts, selectedQuiz])

  const scoreDistribution = useMemo(() => {
    if (selectedQuizAttempts.length === 0) return []
    const distribution = [
      { range: "0-20%", count: 0 },
      { range: "21-40%", count: 0 },
      { range: "41-60%", count: 0 },
      { range: "61-80%", count: 0 },
      { range: "81-100%", count: 0 },
    ]
    selectedQuizAttempts.forEach((attempt) => {
      if (attempt.score <= 20) distribution[0].count++
      else if (attempt.score <= 40) distribution[1].count++
      else if (attempt.score <= 60) distribution[2].count++
      else if (attempt.score <= 80) distribution[3].count++
      else distribution[4].count++
    })
    return distribution
  }, [selectedQuizAttempts])

  if (isLoading) {
    return <div className="container mx-auto py-8 px-4 md:px-6 text-center">Chargement des résultats...</div>
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Résultats des Quiz</CardTitle>
          <CardDescription>Analysez les performances des étudiants sur les quiz publiés.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={BarChart} title="Tentatives Totales" value={overallStats.totalAttempts.toString()} />
          <StatCard icon={Users} title="Participants Uniques" value={overallStats.uniqueParticipants.toString()} />
          <StatCard icon={Percent} title="Score Moyen (Tous Quiz)" value={`${overallStats.avgScore}%`} />
          <StatCard icon={CheckCircle} title="Taux Réussite Moyen" value={`${overallStats.avgCompletionRate}%`} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle className="text-2xl font-semibold">Résultats par Quiz</CardTitle>
              <CardDescription>Sélectionnez un quiz pour voir les détails des performances.</CardDescription>
            </div>
            {quizzes.filter((q) => q.published).length > 0 ? (
              <Select value={selectedQuizId || ""} onValueChange={setSelectedQuizId}>
                <SelectTrigger className="w-full md:w-[300px] text-base py-3">
                  <SelectValue placeholder="Sélectionner un quiz" />
                </SelectTrigger>
                <SelectContent>
                  {quizzes
                    .filter((q) => q.published)
                    .map((quiz) => (
                      <SelectItem key={quiz.id} value={quiz.id} className="text-base">
                        {quiz.title}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            ) : (
              <p className="text-muted-foreground">Aucun quiz publié pour afficher les résultats.</p>
            )}
          </div>
        </CardHeader>
        {selectedQuizId && selectedQuiz ? (
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <StatCard icon={Percent} title="Score Moyen (Quiz)" value={`${quizSpecificStats.avgScore}%`} />
              <StatCard
                icon={CheckCircle}
                title="Taux Réussite (Quiz)"
                value={`${quizSpecificStats.completionRate}%`}
              />
              <StatCard icon={Clock} title="Temps Moyen" value={quizSpecificStats.avgTime} />
            </div>

            {selectedQuizAttempts.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-3">Distribution des Scores</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsBarChart data={scoreDistribution}>
                    <XAxis dataKey="range" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="var(--chart-primary)" name="Nombre d'étudiants" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            )}

            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Rechercher un étudiant..."
                  className="w-full md:w-1/2 lg:w-1/3 pl-10 text-base py-3"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {selectedQuizAttempts.length === 0 ? (
              <div className="text-center py-10">
                <HelpCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-xl text-muted-foreground">
                  Aucune tentative pour ce quiz ou correspondant à votre recherche.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-lg">Étudiant</TableHead>
                      <TableHead className="text-lg">Score</TableHead>
                      <TableHead className="text-lg">Bonnes Réponses</TableHead>
                      <TableHead className="text-lg">Mauvaises Réponses</TableHead>
                      <TableHead className="text-lg">Date</TableHead>
                      <TableHead className="text-lg">Temps Pris</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedQuizAttempts.map((attempt) => (
                      <TableRow key={attempt.id}>
                        <TableCell className="font-medium text-base py-3">{attempt.studentName}</TableCell>
                        <TableCell className="text-base py-3">{attempt.score}%</TableCell>
                        <TableCell className="text-green-600 text-base py-3">{attempt.correctAnswers}</TableCell>
                        <TableCell className="text-red-600 text-base py-3">{attempt.incorrectAnswers}</TableCell>
                        <TableCell className="text-base py-3">
                          {format(new Date(attempt.completedAt), "dd MMM yyyy, HH:mm", { locale: fr })}
                        </TableCell>
                        <TableCell className="text-base py-3">
                          {Math.floor(attempt.timeTaken / 60)}m {attempt.timeTaken % 60}s
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            <div className="mt-6 flex justify-end">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" /> Exporter les Résultats (CSV)
              </Button>
            </div>
          </CardContent>
        ) : (
          !isLoading &&
          quizzes.filter((q) => q.published).length > 0 && (
            <CardContent className="text-center py-10">
              <HelpCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-xl text-muted-foreground">
                Veuillez sélectionner un quiz pour afficher les résultats.
              </p>
            </CardContent>
          )
        )}
      </Card>
    </div>
  )
}

interface StatCardProps {
  icon: React.ElementType
  title: string
  value: string
  description?: string
}

function StatCard({ icon: Icon, title, value, description }: StatCardProps) {
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </CardContent>
    </Card>
  )
}

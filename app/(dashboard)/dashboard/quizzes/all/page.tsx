"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Eye,
  Edit3,
  Trash2,
  BarChart2,
  PlusCircle,
  Search,
  AlertTriangle,
  CheckCircle,
  ToggleLeft,
  ToggleRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import type { Quiz } from "@/types"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

export default function AllQuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    setIsLoading(true)
    // Simulate fetching quizzes
    const storedQuizzes: Quiz[] = JSON.parse(localStorage.getItem("quizzes") || "[]")
    setQuizzes(storedQuizzes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
    setIsLoading(false)
  }, [])

  const handleDeleteQuiz = (quizId: string) => {
    const updatedQuizzes = quizzes.filter((q) => q.id !== quizId)
    setQuizzes(updatedQuizzes)
    localStorage.setItem("quizzes", JSON.stringify(updatedQuizzes))
    toast({
      title: "Quiz supprimé",
      description: "Le quiz a été supprimé avec succès.",
      variant: "success",
      icon: <CheckCircle className="h-5 w-5" />,
    })
  }

  const togglePublishStatus = (quizId: string) => {
    const updatedQuizzes = quizzes.map((quiz) =>
      quiz.id === quizId ? { ...quiz, published: !quiz.published, updatedAt: new Date().toISOString() } : quiz,
    )
    setQuizzes(updatedQuizzes)
    localStorage.setItem("quizzes", JSON.stringify(updatedQuizzes))
    const quiz = updatedQuizzes.find((q) => q.id === quizId)
    toast({
      title: `Quiz ${quiz?.published ? "publié" : "dépublié"}`,
      description: `Le statut du quiz "${quiz?.title}" a été mis à jour.`,
      variant: "success",
      icon: <CheckCircle className="h-5 w-5" />,
    })
  }

  const filteredQuizzes = quizzes.filter(
    (quiz) =>
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (isLoading) {
    return <div className="container mx-auto py-8 px-4 md:px-6 text-center">Chargement des quiz...</div>
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <Card>
        <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <CardTitle className="text-3xl font-bold">Tous les Quiz</CardTitle>
            <CardDescription>Gérez tous les quiz que vous avez créés.</CardDescription>
          </div>
          <Link href="/dashboard/quizzes/create">
            <Button size="lg" className="text-base">
              <PlusCircle className="h-5 w-5 mr-2" /> Créer un Nouveau Quiz
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher un quiz par titre ou description..."
                className="w-full pl-10 text-base py-3"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {filteredQuizzes.length === 0 ? (
            <div className="text-center py-10">
              <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-xl text-muted-foreground">Aucun quiz trouvé.</p>
              <p className="text-muted-foreground">
                Commencez par{" "}
                <Link href="/dashboard/quizzes/create" className="text-primary hover:underline">
                  créer un nouveau quiz
                </Link>
                .
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[30%] text-lg">Titre</TableHead>
                    <TableHead className="text-lg">Statut</TableHead>
                    <TableHead className="text-lg">Questions</TableHead>
                    <TableHead className="text-lg">Créé le</TableHead>
                    <TableHead className="text-lg text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredQuizzes.map((quiz) => (
                    <TableRow key={quiz.id}>
                      <TableCell className="font-medium text-base py-3">{quiz.title}</TableCell>
                      <TableCell className="py-3">
                        <Badge variant={quiz.published ? "success" : "secondary"} className="text-sm">
                          {quiz.published ? "Publié" : "Brouillon"}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-3 text-base">{quiz.questions.length}</TableCell>
                      <TableCell className="py-3 text-base">
                        {format(new Date(quiz.createdAt), "dd MMM yyyy", { locale: fr })}
                      </TableCell>
                      <TableCell className="text-center py-3">
                        <div className="flex justify-center items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => togglePublishStatus(quiz.id)}
                            title={quiz.published ? "Dépublier" : "Publier"}
                          >
                            {quiz.published ? (
                              <ToggleRight className="h-5 w-5 text-green-500" />
                            ) : (
                              <ToggleLeft className="h-5 w-5 text-gray-500" />
                            )}
                          </Button>
                          <Link href={`/dashboard/quizzes/${quiz.id}/edit`}>
                            <Button variant="ghost" size="icon" title="Modifier">
                              <Edit3 className="h-5 w-5 text-blue-500" />
                            </Button>
                          </Link>
                          <Link href={`/dashboard/quizzes/${quiz.id}/results`}>
                            <Button variant="ghost" size="icon" title="Voir les Résultats">
                              <BarChart2 className="h-5 w-5 text-purple-500" />
                            </Button>
                          </Link>
                          <Link href={`/quizzes/${quiz.id}`} target="_blank">
                            <Button variant="ghost" size="icon" title="Prévisualiser (Stagiaire)">
                              <Eye className="h-5 w-5 text-gray-500" />
                            </Button>
                          </Link>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" title="Supprimer">
                                <Trash2 className="h-5 w-5 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer ce quiz ?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Cette action est irréversible. Le quiz "{quiz.title}" et toutes ses données associées
                                  seront définitivement supprimés.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteQuiz(quiz.id)}
                                  className="bg-destructive hover:bg-destructive/90"
                                >
                                  Supprimer
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        {filteredQuizzes.length > 0 && (
          <CardFooter className="text-sm text-muted-foreground">Affichage de {filteredQuizzes.length} quiz.</CardFooter>
        )}
      </Card>
    </div>
  )
}
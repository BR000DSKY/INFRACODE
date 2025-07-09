"use client"

import { useState, useEffect, type FormEvent } from "react"
import { useParams, useRouter } from "next/navigation"
import { PlusCircle, Trash2, Save, AlertTriangle, CheckCircle, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import type { Quiz, Question, QuestionType } from "@/types"
import Link from "next/link"

export default function EditQuizPage() {
  const router = useRouter()
  const params = useParams()
  const quizId = params.id as string

  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [timeLimit, setTimeLimit] = useState(30)
  const [difficulty, setDifficulty] = useState<"Facile" | "Moyen" | "Difficile">("Moyen")
  const [questions, setQuestions] = useState<Question[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    if (quizId) {
      setIsFetching(true)
      const storedQuizzes: Quiz[] = JSON.parse(localStorage.getItem("quizzes") || "[]")
      const currentQuiz = storedQuizzes.find((q) => q.id === quizId)
      if (currentQuiz) {
        setQuiz(currentQuiz)
        setTitle(currentQuiz.title)
        setDescription(currentQuiz.description)
        setTimeLimit(currentQuiz.timeLimit)
        setDifficulty(currentQuiz.difficulty)
        setQuestions(currentQuiz.questions)
      } else {
        toast({
          title: "Quiz non trouvé",
          description: "Impossible de charger les détails du quiz.",
          variant: "destructive",
        })
        router.push("/dashboard/quizzes/all") // Redirect if quiz not found
      }
      setIsFetching(false)
    }
  }, [quizId, router, toast])

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: crypto.randomUUID(),
        text: "",
        type: "QCM",
        options: [{ id: crypto.randomUUID(), text: "", isCorrect: false }],
        correctAnswer: "",
      },
    ])
  }

  const handleRemoveQuestion = (questionId: string) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((q) => q.id !== questionId))
    } else {
      toast({
        title: "Action impossible",
        description: "Un quiz doit contenir au moins une question.",
        variant: "destructive",
        icon: <AlertTriangle className="h-5 w-5" />,
      })
    }
  }

  const handleQuestionChange = (questionId: string, field: keyof Question, value: any) => {
    setQuestions(questions.map((q) => (q.id === questionId ? { ...q, [field]: value } : q)))
  }

  const handleOptionChange = (questionId: string, optionId: string, field: "text" | "isCorrect", value: any) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options?.map((opt) =>
                opt.id === optionId
                  ? { ...opt, [field]: value }
                  : q.type === "QCM" && field === "isCorrect" && value === true // For QCM, ensure only one correct option
                    ? { ...opt, isCorrect: false }
                    : opt,
              ),
            }
          : q,
      ),
    )
  }

  const handleAddOption = (questionId: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: [...(q.options || []), { id: crypto.randomUUID(), text: "", isCorrect: false }],
            }
          : q,
      ),
    )
  }

  const handleRemoveOption = (questionId: string, optionId: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options?.filter((opt) => opt.id !== optionId),
            }
          : q,
      ),
    )
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (!title.trim() || !description.trim() || questions.some((q) => !q.text.trim())) {
      toast({
        title: "Champs requis manquants",
        description: "Veuillez remplir le titre, la description et le texte de toutes les questions.",
        variant: "destructive",
        icon: <AlertTriangle className="h-5 w-5" />,
      })
      setIsLoading(false)
      return
    }

    const updatedQuiz: Quiz = {
      ...quiz!,
      id: quizId,
      title,
      description,
      questions,
      timeLimit,
      difficulty,
      updatedAt: new Date().toISOString(),
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const existingQuizzes: Quiz[] = JSON.parse(localStorage.getItem("quizzes") || "[]")
    const updatedQuizzes = existingQuizzes.map((q) => (q.id === quizId ? updatedQuiz : q))
    localStorage.setItem("quizzes", JSON.stringify(updatedQuizzes))

    toast({
      title: "Quiz modifié avec succès!",
      description: `Le quiz "${title}" a été mis à jour.`,
      variant: "success",
      icon: <CheckCircle className="h-5 w-5" />,
    })
    setIsLoading(false)
    router.push("/dashboard/quizzes/all")
  }

  if (isFetching) {
    return <div className="container mx-auto py-8 px-4 md:px-6 text-center">Chargement du quiz...</div>
  }

  if (!quiz) {
    return (
      <div className="container mx-auto py-8 px-4 md:px-6 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-destructive mb-4" />
        <p className="text-xl text-destructive">Quiz non trouvé.</p>
        <p className="text-muted-foreground">Le quiz que vous essayez de modifier n'existe pas ou a été supprimé.</p>
        <Button asChild className="mt-6">
          <Link href="/dashboard/quizzes/all">
            <ArrowLeft className="h-4 w-4 mr-2" /> Retour à la liste des quiz
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-3xl font-bold">Modifier le Quiz</CardTitle>
              <CardDescription>Mettez à jour les détails du quiz "{quiz.title}".</CardDescription>
            </div>
            <Button variant="outline" asChild>
              <Link href="/dashboard/quizzes/all">
                <ArrowLeft className="h-4 w-4 mr-2" /> Annuler
              </Link>
            </Button>
          </div>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="quiz-title" className="text-lg font-semibold">
                Titre du Quiz
              </Label>
              <Input
                id="quiz-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quiz-description" className="text-lg font-semibold">
                Description
              </Label>
              <Textarea
                id="quiz-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="text-base min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="quiz-time-limit" className="text-lg font-semibold">
                  Temps Limite (minutes)
                </Label>
                <Input
                  id="quiz-time-limit"
                  type="number"
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(Number.parseInt(e.target.value))}
                  min="5"
                  className="text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quiz-difficulty" className="text-lg font-semibold">
                  Difficulté
                </Label>
                <Select
                  value={difficulty}
                  onValueChange={(value: "Facile" | "Moyen" | "Difficile") => setDifficulty(value)}
                >
                  <SelectTrigger id="quiz-difficulty" className="text-base">
                    <SelectValue placeholder="Sélectionner la difficulté" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Facile">Facile</SelectItem>
                    <SelectItem value="Moyen">Moyen</SelectItem>
                    <SelectItem value="Difficile">Difficile</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <h3 className="text-2xl font-semibold border-t pt-6 mt-6">Questions</h3>
            {questions.map((question, qIndex) => (
              <Card key={question.id} className="p-4 space-y-4 bg-secondary/30">
                <div className="flex justify-between items-center">
                  <Label htmlFor={`question-text-${qIndex}`} className="text-xl font-semibold">
                    Question {qIndex + 1}
                  </Label>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveQuestion(question.id)}
                    disabled={questions.length <= 1}
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Supprimer
                  </Button>
                </div>
                <Textarea
                  id={`question-text-${qIndex}`}
                  placeholder="Texte de la question"
                  value={question.text}
                  onChange={(e) => handleQuestionChange(question.id, "text", e.target.value)}
                  required
                  className="text-base min-h-[80px]"
                />
                <div className="space-y-2">
                  <Label htmlFor={`question-type-${qIndex}`} className="text-lg font-semibold">
                    Type de Question
                  </Label>
                  <Select
                    value={question.type}
                    onValueChange={(value: QuestionType) => {
                      const newOptions =
                        value === "QCM" || value === "QRM"
                          ? [{ id: crypto.randomUUID(), text: "", isCorrect: false }]
                          : []
                      handleQuestionChange(question.id, "type", value)
                      handleQuestionChange(question.id, "options", newOptions)
                      handleQuestionChange(question.id, "correctAnswer", "")
                    }}
                  >
                    <SelectTrigger id={`question-type-${qIndex}`} className="text-base">
                      <SelectValue placeholder="Sélectionner le type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="QCM">Choix Multiple (QCM)</SelectItem>
                      <SelectItem value="QRM">Réponses Multiples (QRM)</SelectItem>
                      <SelectItem value="Vrai/Faux">Vrai/Faux</SelectItem>
                      <SelectItem value="Texte">Réponse Courte (Texte)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {question.type === "QCM" && question.options && (
                  <div className="space-y-3 pl-4 border-l-2 border-primary">
                    <Label className="text-lg font-semibold">Options (QCM)</Label>
                    {question.options.map((option, oIndex) => (
                      <div key={option.id} className="flex items-center gap-2">
                        <Input
                          placeholder={`Option ${oIndex + 1}`}
                          value={option.text}
                          onChange={(e) => handleOptionChange(question.id, option.id, "text", e.target.value)}
                          className="flex-grow text-base"
                          required
                        />
                        <input
                          type="radio"
                          name={`correct-option-${question.id}`}
                          checked={option.isCorrect}
                          onChange={(e) => handleOptionChange(question.id, option.id, "isCorrect", e.target.checked)}
                          className="form-radio h-5 w-5 text-primary focus:ring-primary border-gray-300"
                        />
                        <Label className="text-sm">Correct</Label>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveOption(question.id, option.id)}
                          disabled={question.options!.length <= 1}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={() => handleAddOption(question.id)}>
                      <PlusCircle className="h-4 w-4 mr-1" /> Ajouter Option
                    </Button>
                  </div>
                )}

                {question.type === "QRM" && question.options && (
                  <div className="space-y-3 pl-4 border-l-2 border-primary">
                    <Label className="text-lg font-semibold">Options (QRM)</Label>
                    {question.options.map((option, oIndex) => (
                      <div key={option.id} className="flex items-center gap-2">
                        <Input
                          placeholder={`Option ${oIndex + 1}`}
                          value={option.text}
                          onChange={(e) => handleOptionChange(question.id, option.id, "text", e.target.value)}
                          className="flex-grow text-base"
                          required
                        />
                        <input
                          type="checkbox"
                          checked={option.isCorrect}
                          onChange={(e) => handleOptionChange(question.id, option.id, "isCorrect", e.target.checked)}
                          className="form-checkbox h-5 w-5 text-primary focus:ring-primary border-gray-300 rounded"
                        />
                        <Label className="text-sm">Correct</Label>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveOption(question.id, option.id)}
                          disabled={question.options!.length <= 1}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={() => handleAddOption(question.id)}>
                      <PlusCircle className="h-4 w-4 mr-1" /> Ajouter Option
                    </Button>
                  </div>
                )}

                {question.type === "Vrai/Faux" && (
                  <div className="space-y-2 pl-4 border-l-2 border-primary">
                    <Label className="text-lg font-semibold">Réponse Correcte (Vrai/Faux)</Label>
                    <Select
                      value={question.correctAnswer}
                      onValueChange={(value) => handleQuestionChange(question.id, "correctAnswer", value)}
                    >
                      <SelectTrigger className="text-base">
                        <SelectValue placeholder="Sélectionner la réponse" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Vrai">Vrai</SelectItem>
                        <SelectItem value="Faux">Faux</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {question.type === "Texte" && (
                  <div className="space-y-2 pl-4 border-l-2 border-primary">
                    <Label htmlFor={`correct-answer-text-${qIndex}`} className="text-lg font-semibold">
                      Réponse Correcte (Texte)
                    </Label>
                    <Input
                      id={`correct-answer-text-${qIndex}`}
                      placeholder="Entrer la réponse exacte attendue"
                      value={question.correctAnswer}
                      onChange={(e) => handleQuestionChange(question.id, "correctAnswer", e.target.value)}
                      className="text-base"
                      required
                    />
                  </div>
                )}
              </Card>
            ))}
            <Button type="button" variant="outline" onClick={handleAddQuestion} className="w-full text-lg py-3">
              <PlusCircle className="h-5 w-5 mr-2" /> Ajouter une Question
            </Button>
          </CardContent>
          <CardFooter className="border-t pt-6">
            <Button type="submit" size="lg" className="w-full text-lg py-3" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Save className="h-5 w-5 mr-2 animate-spin" /> Enregistrement des modifications...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5 mr-2" /> Enregistrer les Modifications
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
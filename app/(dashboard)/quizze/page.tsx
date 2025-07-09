"use client"
import { motion } from "framer-motion"
import { FileText, PlusCircle, Edit, Trash2, CheckSquare, ListOrdered, Type } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { toast } from "sonner"

// Simplified Quiz types for this example
interface QuizQuestion {
  id: string
  text: string
  type: "qcm" | "text" | "truefalse"
  options?: string[]
  correctAnswer?: string | string[]
}
interface Quiz {
  id: string
  title: string
  description: string
  questions: QuizQuestion[]
}

const cardVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
}

export default function QuizzesPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [currentQuiz, setCurrentQuiz] = useState<Partial<Quiz>>({ title: "", description: "", questions: [] })
  const [currentQuestion, setCurrentQuestion] = useState<Partial<QuizQuestion>>({
    text: "",
    type: "qcm",
    options: ["", "", "", ""],
    correctAnswer: "",
  })

  const handleAddQuestion = () => {
    if (!currentQuestion.text || !currentQuestion.type) {
      toast.error("Texte et type de question requis.")
      return
    }
    setCurrentQuiz((prev) => ({
      ...prev,
      questions: [...(prev.questions || []), { ...currentQuestion, id: `q-${Date.now()}` } as QuizQuestion],
    }))
    setCurrentQuestion({ text: "", type: "qcm", options: ["", "", "", ""], correctAnswer: "" }) // Reset
  }

  const handleSaveQuiz = () => {
    if (!currentQuiz.title || !currentQuiz.questions || currentQuiz.questions.length === 0) {
      toast.error("Titre et au moins une question requis.")
      return
    }
    const newQuiz = { ...currentQuiz, id: `quiz-${Date.now()}` } as Quiz
    setQuizzes((prev) => [...prev, newQuiz])
    toast.success("Quiz créé avec succès !")
    setIsCreateModalOpen(false)
    setCurrentQuiz({ title: "", description: "", questions: [] })
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-8">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-4xl font-bold tracking-tight flex items-center">
            <FileText className="mr-3 h-10 w-10 text-primary" />
            Gestion des Quiz
          </h1>
          <p className="text-muted-foreground">Créez, modifiez et assignez des évaluations.</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button
              size="lg"
              className="group bg-gradient-to-r from-primary to-orange-600 hover:from-primary/90 hover:to-orange-600/90 text-white shadow-lg"
            >
              <PlusCircle className="mr-2 h-5 w-5 transition-transform group-hover:rotate-90" />
              Nouveau Quiz
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px] bg-card border-border/50 max-h-[90vh] flex flex-col">
            <DialogHeader>
              <DialogTitle className="text-2xl">Créer un Nouveau Quiz</DialogTitle>
              <DialogDescription>Définissez les détails et ajoutez des questions à votre quiz.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 flex-grow overflow-y-auto custom-scrollbar pr-2">
              <div className="space-y-2">
                <Label htmlFor="quiz-title">Titre du Quiz</Label>
                <Input
                  id="quiz-title"
                  value={currentQuiz.title}
                  onChange={(e) => setCurrentQuiz((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Ex: Fondamentaux de JavaScript"
                  className="bg-background focus:border-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quiz-description">Description</Label>
                <Textarea
                  id="quiz-description"
                  value={currentQuiz.description}
                  onChange={(e) => setCurrentQuiz((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Brève description du contenu du quiz"
                  className="bg-background focus:border-primary"
                />
              </div>

              <Card className="mt-4 bg-secondary/50 border-border/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Ajouter une Question</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="q-text">Texte de la question</Label>
                    <Input
                      id="q-text"
                      value={currentQuestion.text}
                      onChange={(e) => setCurrentQuestion((prev) => ({ ...prev, text: e.target.value }))}
                      className="bg-background focus:border-primary"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="q-type">Type de question</Label>
                    <Select
                      value={currentQuestion.type}
                      onValueChange={(val: "qcm" | "text" | "truefalse") =>
                        setCurrentQuestion((prev) => ({
                          ...prev,
                          type: val,
                          options: val === "qcm" ? ["", "", "", ""] : undefined,
                          correctAnswer: "",
                        }))
                      }
                    >
                      <SelectTrigger className="bg-background focus:border-primary">
                        <SelectValue placeholder="Choisir type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="qcm">
                          <ListOrdered className="inline h-4 w-4 mr-2" />
                          Choix Multiple (QCM)
                        </SelectItem>
                        <SelectItem value="text">
                          <Type className="inline h-4 w-4 mr-2" />
                          Réponse Courte
                        </SelectItem>
                        <SelectItem value="truefalse">
                          <CheckSquare className="inline h-4 w-4 mr-2" />
                          Vrai/Faux
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {currentQuestion.type === "qcm" && (
                    <div className="space-y-2 pl-2 border-l-2 border-primary/50">
                      <Label>Options (Cochez la bonne réponse)</Label>
                      {currentQuestion.options?.map((opt, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <Input
                            value={opt}
                            onChange={(e) =>
                              setCurrentQuestion((prev) => ({
                                ...prev,
                                options: prev.options?.map((o, i) => (i === idx ? e.target.value : o)),
                              }))
                            }
                            placeholder={`Option ${idx + 1}`}
                            className="bg-background focus:border-primary"
                          />
                          <input
                            type="radio"
                            name="correctAnswerQCM"
                            value={opt}
                            checked={currentQuestion.correctAnswer === opt}
                            onChange={(e) => setCurrentQuestion((prev) => ({ ...prev, correctAnswer: e.target.value }))}
                            className="form-radio h-4 w-4 text-primary focus:ring-primary"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  {currentQuestion.type === "truefalse" && (
                    <div className="space-y-1 pl-2 border-l-2 border-primary/50">
                      <Label>Bonne réponse</Label>
                      <Select
                        value={currentQuestion.correctAnswer as string}
                        onValueChange={(val) => setCurrentQuestion((prev) => ({ ...prev, correctAnswer: val }))}
                      >
                        <SelectTrigger className="bg-background focus:border-primary">
                          <SelectValue placeholder="Choisir" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Vrai</SelectItem>
                          <SelectItem value="false">Faux</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  {currentQuestion.type === "text" && (
                    <div className="space-y-1 pl-2 border-l-2 border-primary/50">
                      <Label>Réponse attendue (Optionnel)</Label>
                      <Input
                        value={currentQuestion.correctAnswer as string}
                        onChange={(e) => setCurrentQuestion((prev) => ({ ...prev, correctAnswer: e.target.value }))}
                        placeholder="Réponse exacte ou mots-clés"
                        className="bg-background focus:border-primary"
                      />
                    </div>
                  )}
                  <Button variant="outline" size="sm" onClick={handleAddQuestion} className="w-full mt-2">
                    Ajouter cette question au quiz
                  </Button>
                </CardContent>
              </Card>

              {currentQuiz.questions && currentQuiz.questions.length > 0 && (
                <div className="mt-4 space-y-2">
                  <h4 className="font-semibold">Questions du Quiz ({currentQuiz.questions.length})</h4>
                  {currentQuiz.questions.map((q, idx) => (
                    <div key={q.id} className="text-sm p-2 bg-secondary rounded text-muted-foreground">
                      {idx + 1}. {q.text.substring(0, 50)}
                      {q.text.length > 50 ? "..." : ""} ({q.type})
                    </div>
                  ))}
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleSaveQuiz} className="bg-primary hover:bg-primary/90">
                Enregistrer le Quiz
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((quiz, i) => (
          <motion.div key={quiz.id} custom={i} variants={cardVariants} initial="hidden" animate="visible">
            <Card className="h-full flex flex-col group hover-lift border-border/30">
              <CardHeader>
                <CardTitle className="text-lg group-hover:text-primary transition-colors">{quiz.title}</CardTitle>
                <CardDescription className="line-clamp-2">{quiz.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground">{quiz.questions.length} question(s)</p>
              </CardContent>
              <CardFooter className="gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="h-3.5 w-3.5 mr-1.5" />
                  Modifier
                </Button>
                <Button variant="destructive" size="sm" className="flex-1">
                  <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                  Supprimer
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
      {quizzes.length === 0 && (
        <p className="text-center py-10 text-muted-foreground">Aucun quiz créé pour le moment.</p>
      )}
    </motion.div>
  )
}

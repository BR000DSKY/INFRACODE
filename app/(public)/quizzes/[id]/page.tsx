"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useLocalStorage } from "@/lib/hooks/use-local-storage"
import { useAuth } from "@/lib/hooks/use-auth"
import type { Quiz, QuizQuestion, User, Notification } from "@/types"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { motion } from "framer-motion"
import { ArrowLeft, Clock, CheckCircle, XCircle, Trophy, AlertCircle } from "lucide-react"
import Link from "next/link"
import Header from "@/components/home/header"
import Footer from "@/components/home/footer"

export default function QuizPage() {
  const params = useParams()
  const router = useRouter()
  const { user, updateUser } = useAuth()
  const [quizzes] = useLocalStorage<Quiz[]>("quizzes", [])
  const [notifications, setNotifications] = useLocalStorage<Notification[]>("notifications", [])
  
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
  const [selectedOption, setSelectedOption] = useState<string>("")
  const [textAnswer, setTextAnswer] = useState("")
  const [quizStarted, setQuizStarted] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [score, setScore] = useState({ correct: 0, total: 0, percentage: 0 })
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  // Find the quiz
  useEffect(() => {
    if (params.id && quizzes.length > 0) {
      const foundQuiz = quizzes.find(q => q.id === params.id)
      if (foundQuiz) {
        setQuiz(foundQuiz)
        if (foundQuiz.timeLimit) {
          setTimeLeft(foundQuiz.timeLimit * 60) // Convert minutes to seconds
        }
      } else {
        toast.error("Quiz introuvable")
        router.push("/quizzes")
      }
      setLoading(false)
    }
  }, [params.id, quizzes, router])

  // Timer countdown
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (quizStarted && timeLeft !== null && timeLeft > 0 && !quizCompleted) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev !== null && prev <= 1) {
            clearInterval(timer)
            handleQuizCompletion()
            return 0
          }
          return prev !== null ? prev - 1 : null
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [quizStarted, timeLeft, quizCompleted])

  const formatTime = (seconds: number | null) => {
    if (seconds === null) return "--:--"
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const startQuiz = () => {
    setQuizStarted(true)
    setCurrentQuestionIndex(0)
    setAnswers({})
  }

  const handleOptionChange = (value: string) => {
    setSelectedOption(value)
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextAnswer(e.target.value)
  }

  const handleNextQuestion = () => {
    if (!quiz) return

    const currentQuestion = quiz.questions[currentQuestionIndex]
    
    // Save the answer
    if (currentQuestion.type === "text") {
      setAnswers(prev => ({ ...prev, [currentQuestion.id]: textAnswer }))
      setTextAnswer("")
    } else {
      setAnswers(prev => ({ ...prev, [currentQuestion.id]: selectedOption }))
      setSelectedOption("")
    }
    
    // Move to next question or complete quiz
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    } else {
      handleQuizCompletion()
    }
  }

  const handleQuizCompletion = () => {
    if (!quiz) return
    
    // Calculate score
    let correctAnswers = 0
    
    quiz.questions.forEach(question => {
      const userAnswer = answers[question.id] || ""
      const correctAnswer = question.correctAnswer
      
      if (Array.isArray(correctAnswer)) {
        // For multiple correct answers (not implemented in this version)
        if (Array.isArray(userAnswer) && 
            correctAnswer.length === userAnswer.length && 
            correctAnswer.every(a => userAnswer.includes(a))) {
          correctAnswers++
        }
      } else {
        // For single answer questions
        if (typeof userAnswer === 'string' && 
            userAnswer.toLowerCase() === correctAnswer?.toString().toLowerCase()) {
          correctAnswers++
        }
      }
    })
    
    const percentage = Math.round((correctAnswers / quiz.questions.length) * 100)
    setScore({
      correct: correctAnswers,
      total: quiz.questions.length,
      percentage
    })
    
    // Award points if user is logged in
    if (user) {
      const pointsAwarded = Math.round(percentage / 10) * 5 // 5 points per 10% score
      
      // Update user points
      const updatedUser: User = {
        ...user,
        points: (user.points || 0) + pointsAwarded
      }
      
      // Add badge if score is high and user doesn't have it
      if (percentage >= 80 && !user.badges?.includes("Quiz Master")) {
        updatedUser.badges = [...(user.badges || []), "Quiz Master"]
      }
      
      updateUser(updatedUser)
      
      // Create notification
      const newNotification: Notification = {
        id: `notif-${Date.now()}`,
        userId: user.id,
        type: "quiz_completed",
        message: `Vous avez terminé le quiz "${quiz.title}" avec un score de ${percentage}% et gagné ${pointsAwarded} points!`,
        isRead: false,
        createdAt: new Date().toISOString()
      }
      
      setNotifications([...notifications, newNotification])
      
      toast.success(`Quiz terminé! Vous avez gagné ${pointsAwarded} points!`)
    }
    
    setQuizCompleted(true)
  }

  const getCurrentQuestion = (): QuizQuestion | null => {
    if (!quiz) return null
    return quiz.questions[currentQuestionIndex]
  }

  const question = getCurrentQuestion()

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 w-64 bg-muted rounded mb-4"></div>
            <div className="h-4 w-48 bg-muted rounded"></div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Quiz introuvable</h2>
            <p className="text-muted-foreground mb-6">Le quiz que vous recherchez n'existe pas ou a été supprimé.</p>
            <Link href="/quizzes">
              <Button>Retour aux Quiz</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-grow py-8 md:py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            {!quizStarted ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="shadow-lg border-border/40">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start mb-2">
                      <Link href="/quizzes">
                        <Button variant="ghost" size="sm" className="group -ml-2">
                          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                          Retour
                        </Button>
                      </Link>
                      <Badge variant="outline">{quiz.category || "Général"}</Badge>
                    </div>
                    <CardTitle className="text-2xl md:text-3xl">{quiz.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">{quiz.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 py-2">
                      <div className="flex items-center">
                        <Badge variant={quiz.difficulty === "Difficile" ? "destructive" : quiz.difficulty === "Moyen" ? "warning" : "success"} className="mr-2">
                          {quiz.difficulty || "Moyen"}
                        </Badge>
                        <span className="text-sm text-muted-foreground">Difficulté</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {quiz.timeLimit ? `${quiz.timeLimit} minutes` : "Pas de limite de temps"}
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-secondary/50 rounded-lg p-4 mt-4">
                      <h3 className="font-medium mb-2 flex items-center">
                        <Trophy className="h-5 w-5 mr-2 text-primary" />
                        Informations
                      </h3>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Ce quiz contient {quiz.questions.length} questions</li>
                        <li>• Répondez correctement pour gagner des points</li>
                        <li>• Vous pouvez obtenir un badge en réussissant avec un score élevé</li>
                        {quiz.timeLimit && <li>• Vous avez {quiz.timeLimit} minutes pour terminer</li>}
                      </ul>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      onClick={startQuiz} 
                      className="w-full button-glow"
                    >
                      Commencer le Quiz
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ) : quizCompleted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="shadow-lg border-border/40">
                  <CardHeader className="text-center pb-3">
                    <CardTitle className="text-2xl md:text-3xl">Quiz Terminé!</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex flex-col items-center">
                      {score.percentage >= 70 ? (
                        <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                      ) : score.percentage >= 40 ? (
                        <AlertCircle className="h-16 w-16 text-yellow-500 mb-4" />
                      ) : (
                        <XCircle className="h-16 w-16 text-red-500 mb-4" />
                      )}
                      
                      <h3 className="text-xl font-bold mb-1">
                        Votre score: {score.percentage}%
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        {score.correct} réponses correctes sur {score.total} questions
                      </p>
                      
                      <div className="w-full max-w-md mb-6">
                        <Progress 
                          value={score.percentage} 
                          className={`h-3 ${
                            score.percentage >= 70 ? "bg-green-200" : 
                            score.percentage >= 40 ? "bg-yellow-200" : 
                            "bg-red-200"
                          }`}
                        />
                      </div>
                      
                      {user && (
                        <div className="bg-secondary/50 rounded-lg p-4 w-full text-center mb-4">
                          <h4 className="font-medium mb-2 flex items-center justify-center">
                            <Trophy className="h-5 w-5 mr-2 text-primary" />
                            Récompense
                          </h4>
                          <p className="text-sm">
                            Vous avez gagné <span className="font-bold text-primary">{Math.round(score.percentage / 10) * 5} points</span> pour votre classement!
                          </p>
                          {score.percentage >= 80 && !user.badges?.includes("Quiz Master") && (
                            <div className="mt-2 text-sm">
                              <span className="inline-block bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs font-medium">
                                Badge Quiz Master débloqué!
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col sm:flex-row gap-3">
                    <Button 
                      variant="outline" 
                      className="w-full sm:w-1/2"
                      onClick={() => router.push("/quizzes")}
                    >
                      Retour aux Quiz
                    </Button>
                    {user && (
                      <Button 
                        className="w-full sm:w-1/2 button-glow"
                        onClick={() => router.push("/leaderboard")}
                      >
                        Voir le Classement
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key={currentQuestionIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="shadow-lg border-border/40">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center mb-2">
                      <div className="text-sm font-medium">
                        Question {currentQuestionIndex + 1} / {quiz.questions.length}
                      </div>
                      {timeLeft !== null && (
                        <div className={`flex items-center ${timeLeft < 60 ? "text-red-500" : "text-muted-foreground"}`}>
                          <Clock className="h-4 w-4 mr-1" />
                          <span className="text-sm font-mono">{formatTime(timeLeft)}</span>
                        </div>
                      )}
                    </div>
                    <Progress value={(currentQuestionIndex / quiz.questions.length) * 100} className="h-2 mb-4" />
                    <CardTitle className="text-xl">{question?.text}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {question?.type === "qcm" && (
                      <RadioGroup value={selectedOption} onValueChange={handleOptionChange} className="space-y-3">
                        {question.options?.map((option, i) => (
                          <div key={i} className="flex items-center space-x-2">
                            <RadioGroupItem value={option} id={`option-${i}`} />
                            <Label htmlFor={`option-${i}`} className="flex-grow p-3 rounded-md hover:bg-secondary/50 cursor-pointer">
                              {option}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    )}
                    
                    {question?.type === "truefalse" && (
                      <RadioGroup value={selectedOption} onValueChange={handleOptionChange} className="space-y-3">
                        {question.options?.map((option, i) => (
                          <div key={i} className="flex items-center space-x-2">
                            <RadioGroupItem value={option} id={`option-${i}`} />
                            <Label htmlFor={`option-${i}`} className="flex-grow p-3 rounded-md hover:bg-secondary/50 cursor-pointer">
                              {option}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    )}
                    
                    {question?.type === "text" && (
                      <div className="space-y-2">
                        <Label htmlFor="text-answer">Votre réponse:</Label>
                        <Input
                          id="text-answer"
                          value={textAnswer}
                          onChange={handleTextChange}
                          placeholder="Saisissez votre réponse..."
                          className="input-enhanced"
                        />
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => {
                        if (currentQuestionIndex > 0) {
                          setCurrentQuestionIndex(prev => prev - 1)
                        }
                      }}
                      disabled={currentQuestionIndex === 0}
                    >
                      Précédent
                    </Button>
                    <Button
                      onClick={handleNextQuestion}
                      disabled={(question?.type !== "text" && !selectedOption) || (question?.type === "text" && !textAnswer)}
                      className="button-glow"
                    >
                      {currentQuestionIndex < quiz.questions.length - 1 ? "Suivant" : "Terminer"}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
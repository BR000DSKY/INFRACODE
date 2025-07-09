"use client"
import { useLocalStorage } from "@/lib/hooks/use-local-storage"
import type { Quiz, User } from "@/types"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"
import { FileText, ArrowLeft, PlayCircle, ListOrdered, Clock } from "lucide-react"
import Header from "@/components/home/header"
import Footer from "@/components/home/footer"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { initialQuizzes } from "@/lib/data"
import { useEffect } from "react"

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: "easeOut" },
  }),
}

export default function PublicQuizzesPage() {
  const [quizzes, setQuizzes] = useLocalStorage<Quiz[]>("quizzes", [])
  const [users] = useLocalStorage<User[]>("users", [])

  // Initialize quizzes if empty
  useEffect(() => {
    if (quizzes.length === 0) {
      setQuizzes(initialQuizzes)
    }
  }, [quizzes, setQuizzes])

  const getTeacher = (teacherId: string) => {
    return users.find((u) => u.id === teacherId && u.role === "enseignant") || { username: "Enseignant", logo: "" }
  }

  const getBadgeVariant = (difficulty?: string) => {
    switch (difficulty) {
      case "Difficile":
        return "destructive"
      case "Moyen":
        return "warning"
      case "Facile":
        return "success"
      default:
        return "outline"
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-grow">
        <section className="py-12 md:py-16 bg-gradient-to-br from-primary/5 via-background to-orange-600/5 relative">
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-10 md:mb-12"
            >
              <Link href="/" className="inline-block mb-4">
                <Button variant="ghost" className="group text-sm">
                  <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  Retour à l'accueil
                </Button>
              </Link>
              <h1 className="text-4xl lg:text-5xl font-extrabold mb-3 gradient-text">Espace Quiz</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Testez vos connaissances et gagnez des points ! Découvrez les quiz publiés par nos enseignants.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4 md:px-6">
            {quizzes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {quizzes.map((quiz, i) => {
                  const teacher = getTeacher(quiz.teacherId || "unknown")
                  return (
                    <motion.div key={quiz.id} custom={i} variants={cardVariants} initial="hidden" animate="visible">
                      <Card className="overflow-hidden h-full flex flex-col group transition-all duration-300 hover:shadow-xl hover:border-primary/50 card-hover">
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start mb-1">
                            <Badge variant="outline" className="text-xs">
                              {quiz.category || "Général"}
                            </Badge>
                            <Badge variant={getBadgeVariant(quiz.difficulty)} className="text-xs">
                              {quiz.difficulty || "Moyen"}
                            </Badge>
                          </div>
                          <CardTitle className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                            {quiz.title}
                          </CardTitle>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1">
                            <Avatar className="h-5 w-5">
                              <AvatarImage src={teacher.logo || "/placeholder.svg"} />
                              <AvatarFallback>{teacher.username.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <span>Par {teacher.username}</span>
                          </div>
                        </CardHeader>
                        <CardContent className="flex-grow pt-0 pb-3">
                          <p className="text-sm text-muted-foreground line-clamp-3 mb-2">{quiz.description}</p>
                          <div className="flex items-center text-xs text-muted-foreground gap-3">
                            <span className="flex items-center gap-1">
                              <ListOrdered className="h-3.5 w-3.5" />
                              {quiz.questions.length} Questions
                            </span>
                            {quiz.timeLimit && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-3.5 w-3.5" />
                                {quiz.timeLimit} min
                              </span>
                            )}
                          </div>
                        </CardContent>
                        <CardFooter className="p-4 border-t">
                          <Link href={`/quizzes/${quiz.id}`} className="w-full">
                            <Button className="w-full group bg-primary hover:bg-primary/90 text-primary-foreground button-glow">
                              Commencer le Quiz
                              <PlayCircle className="ml-2 h-4 w-4 transition-transform group-hover:scale-110" />
                            </Button>
                          </Link>
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
                className="text-center py-12 md:py-16"
              >
                <FileText className="mx-auto h-16 w-16 text-muted-foreground/40 mb-4" />
                <h3 className="text-xl font-semibold text-muted-foreground">Aucun quiz disponible pour le moment.</h3>
                <p className="text-muted-foreground/80">Revenez bientôt pour tester vos connaissances !</p>
              </motion.div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

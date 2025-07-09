"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useLocalStorage } from "@/lib/hooks/use-local-storage"
import type { Project, User } from "@/types"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Calendar, Eye, Heart } from "lucide-react"
import Header from "@/components/home/header"
import Footer from "@/components/home/footer"

export default function RecentProjectsPage() {
  const [projects] = useLocalStorage<Project[]>("projects", [])
  const [users] = useLocalStorage<User[]>("users", [])

  const getCreator = (ownerId: string) => {
    return users.find((user) => user.id === ownerId)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-orange-600/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/projects-bg.png')] bg-cover bg-center opacity-5" />
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <Link href="/">
              <Button variant="ghost" className="mb-6 group">
                <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Retour à l'accueil
              </Button>
            </Link>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">
              Projets Récents
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Découvrez les dernières créations de nos étudiants talentueux
            </p>
          </motion.div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => {
              const creator = getCreator(project.ownerId)
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden transition-all hover:scale-105 hover:shadow-xl duration-300 h-full flex flex-col group">
                    <div className="relative">
                      <Image
                        src={project.banner || "/placeholder.svg?width=400&height=225&query=project"}
                        alt={project.title}
                        width={400}
                        height={225}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                      <Badge className="absolute top-4 right-4 bg-primary/90">{project.category}</Badge>
                      <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white text-sm">
                        <Eye className="h-4 w-4" />
                        <span>{Math.floor(Math.random() * 100) + 10}</span>
                        <Heart className="h-4 w-4 ml-2" />
                        <span>{Math.floor(Math.random() * 20) + 1}</span>
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle className="group-hover:text-primary transition-colors">{project.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-muted-foreground line-clamp-3 mb-4">{project.description}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(project.createdAt).toLocaleDateString("fr-FR")}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="flex items-center justify-between">
                      {creator && (
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={creator.logo || "/placeholder.svg"} />
                            <AvatarFallback>{creator.username.charAt(0).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">{creator.username}</span>
                        </div>
                      )}
                      <Link href="/login">
                        <Button size="sm" variant="outline">
                          Voir Plus
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                </motion.div>
              )
            })}
          </div>

          {projects.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
              <h3 className="text-2xl font-semibold mb-4">Aucun projet pour le moment</h3>
              <p className="text-muted-foreground mb-8">Soyez le premier à publier un projet sur notre plateforme !</p>
              <Link href="/sign-up">
                <Button>Créer un Compte</Button>
              </Link>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}

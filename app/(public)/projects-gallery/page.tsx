"use client"

import { useState } from "react"
import { useLocalStorage } from "@/lib/hooks/use-local-storage"
import type { Project, User } from "@/types"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Search, SlidersHorizontal, Eye, Heart, Calendar, ArrowLeft } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/home/header"
import Footer from "@/components/home/footer"

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.4,
      ease: "easeOut",
    },
  }),
}

export default function PublicProjectsGalleryPage() {
  const [projects] = useLocalStorage<Project[]>("projects", [])
  const [users] = useLocalStorage<User[]>("users", []) // Assuming users are available for creator info
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [sortBy, setSortBy] = useState("createdAt_desc")

  const getCreator = (ownerId: string) => {
    return users.find((user) => user.id === ownerId) || { username: "Inconnu", logo: "", name: "Utilisateur Inconnu" }
  }

  // Define the titles of projects to exclude
  const excludedTitles = ["qsdqsd", "Smart Campus IoT System", "Cloud Infrastructure Automation", "Cybersecurity Threat Detection"]

  const filteredAndSortedProjects = projects
    .filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = categoryFilter === "all" || project.category === categoryFilter
      // Exclude projects with titles in excludedTitles
      const isNotExcluded = !excludedTitles.includes(project.title)
      return matchesSearch && matchesCategory && isNotExcluded
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "title_asc":
          return a.title.localeCompare(b.title)
        case "title_desc":
          return b.title.localeCompare(a.title)
        case "createdAt_asc":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case "views_desc":
          return (b.views || 0) - (a.views || 0)
        case "likes_desc":
          return (b.likes || 0) - (a.likes || 0)
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime() // createdAt_desc
      }
    })

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
              <h1 className="text-4xl lg:text-5xl font-extrabold mb-3 bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
                Touts Projets
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Explorez la créativité et l'innovation de nos étudiants du Pôle Digital.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-8 md:py-12">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex flex-col md:flex-row gap-3 md:gap-4 p-3 md:p-4 mb-8 md:mb-10 bg-card border rounded-lg shadow-sm sticky top-16 z-30"
            >
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par titre, description..."
                  className="pl-9 bg-background focus:border-primary text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-[200px] bg-background focus:border-primary text-sm">
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  <SelectItem value="Développement Digital">Développement Digital</SelectItem>
                  <SelectItem value="Infrastructure Digitale">Infrastructure Digitale</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-[180px] bg-background focus:border-primary text-sm">
                  <SlidersHorizontal className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                  <SelectValue placeholder="Trier par" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt_desc">Plus Récents</SelectItem>
                  <SelectItem value="createdAt_asc">Plus Anciens</SelectItem>
                  <SelectItem value="title_asc">Titre (A-Z)</SelectItem>
                  <SelectItem value="title_desc">Titre (Z-A)</SelectItem>
                  <SelectItem value="views_desc">Plus Vus</SelectItem>
                  <SelectItem value="likes_desc">Plus Aimés</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>

            {filteredAndSortedProjects.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
                {filteredAndSortedProjects.map((project, i) => {
                  const creator = getCreator(project.ownerId)
                  return (
                    <motion.div key={project.id} custom={i} variants={cardVariants} initial="hidden" animate="visible">
                      <Card className="overflow-hidden h-full flex flex-col group transition-all duration-300 hover:shadow-xl hover:border-primary/50 hover-lift">
                        <Link href={`/projects/${project.id}`} className="block">
                          <div className="relative">
                            <Image
                              src={
                                project.banner ||
                                `/placeholder.svg?width=400&height=225&query=${encodeURIComponent(project.title)}`
                              }
                              alt={project.title}
                              width={400}
                              height={225}
                              className="w-full h-44 object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                            <Badge
                              variant="secondary"
                              className="absolute top-2.5 right-2.5 bg-card/80 backdrop-blur-sm text-xs shadow"
                            >
                              {project.category}
                            </Badge>
                            <div className="absolute bottom-2.5 left-2.5 flex items-center gap-2.5 text-white text-xs">
                              <span className="flex items-center gap-1 backdrop-blur-sm bg-black/30 px-1.5 py-0.5 rounded">
                                <Eye className="h-3 w-3" /> {project.views || 0}
                              </span>
                              <span className="flex items-center gap-1 backdrop-blur-sm bg-black/30 px-1.5 py-0.5 rounded">
                                <Heart className="h-3 w-3" /> {project.likes || 0}
                              </span>
                            </div>
                          </div>
                        </Link>
                        <CardHeader className="p-4 pb-2">
                          <Link href={`/projects/${project.id}`} className="block">
                            <CardTitle className="text-md font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                              {project.title}
                            </CardTitle>
                          </Link>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1">
                            <Avatar className="h-5 w-5">
                              <AvatarImage src={creator.logo || "/placeholder.svg"} />
                              <AvatarFallback>{creator.username.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <span>Par {creator.username}</span>
                          </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-1 flex-grow">
                          <p className="text-xs text-muted-foreground line-clamp-2">{project.description}</p>
                        </CardContent>
                        <CardFooter className="p-4 pt-2 border-t">
                          <div className="flex justify-between items-center w-full">
                            <div className="text-xs text-muted-foreground flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {new Date(project.createdAt).toLocaleDateString("fr-FR", {
                                day: "2-digit",
                                month: "short",
                              })}
                            </div>
                            <Link href={`/projects/${project.id}`}>
                              <Button
                                size="xs"
                                variant="ghost"
                                className="text-primary hover:bg-primary/10 h-7 px-2 text-xs"
                              >
                                Voir Détails
                              </Button>
                            </Link>
                          </div>
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
                <Search className="mx-auto h-16 w-16 text-muted-foreground/40 mb-4" />
                <h3 className="text-xl font-semibold text-muted-foreground">
                  Aucun projet ne correspond à votre recherche.
                </h3>
                <p className="text-muted-foreground/80">
                  Essayez d'autres mots-clés ou explorez toutes les catégories.
                </p>
              </motion.div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
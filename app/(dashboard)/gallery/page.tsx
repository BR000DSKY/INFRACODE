"use client"

import { useState } from "react"
import { useAuth } from "@/lib/hooks/use-auth"
import type { User } from "@/types"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Search, SlidersHorizontal, Eye, Heart, Calendar } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

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

export default function GalleryPage() {
  const { projects: allProjects, user: currentUser } = useAuth() // Assuming users are also available or fetched
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [sortBy, setSortBy] = useState("createdAt_desc")

  // In a real app, you'd fetch users or have them in context
  const mockUsers: User[] = [
    {
      id: "user-1",
      username: "alice_dev",
      logo: "https://i.pravatar.cc/150?u=alice",
      name: "Alice",
      email: "",
      filiereId: "101",
      role: "stagiaire",
      points: 0,
      badges: [],
    },
    // Add more mock users if needed for creators
  ]

  const getCreator = (ownerId: string) => mockUsers.find((u) => u.id === ownerId) || { username: "Inconnu", logo: "" }

  const filteredAndSortedProjects = allProjects
    .filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = categoryFilter === "all" || project.category === categoryFilter
      return matchesSearch && matchesCategory
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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-8">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold tracking-tight">Galerie des Projets</h1>
        <p className="text-muted-foreground">Explorez les innovations de notre communauté.</p>
      </motion.div>

      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex flex-col md:flex-row gap-4 p-4 bg-card border rounded-lg shadow-sm sticky top-16 md:top-0 z-40"
      >
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Rechercher par titre, description..."
            className="pl-10 bg-background focus:border-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full md:w-[200px] bg-background focus:border-primary">
            <SelectValue placeholder="Catégorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les catégories</SelectItem>
            <SelectItem value="Développement Digital">Développement Digital</SelectItem>
            <SelectItem value="Infrastructure Digitale">Infrastructure Digitale</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full md:w-[180px] bg-background focus:border-primary">
            <SlidersHorizontal className="h-4 w-4 mr-2 text-muted-foreground" />
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
          {filteredAndSortedProjects.map((project, i) => {
            const creator = getCreator(project.ownerId)
            return (
              <motion.div key={project.id} custom={i} variants={cardVariants} initial="hidden" animate="visible">
                <Card className="overflow-hidden h-full flex flex-col group transition-all duration-300 hover:shadow-2xl hover:border-primary/50 hover-lift">
                  <div className="relative">
                    <Image
                      src={
                        project.banner ||
                        `/placeholder.svg?width=400&height=225&query=${encodeURIComponent(project.title)}`
                      }
                      alt={project.title}
                      width={400}
                      height={225}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                    <Badge variant="secondary" className="absolute top-3 right-3 bg-card/80 backdrop-blur-sm text-xs">
                      {project.category}
                    </Badge>
                    <div className="absolute bottom-3 left-3 flex items-center gap-3 text-white text-xs">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3.5 w-3.5" /> {project.views || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="h-3.5 w-3.5" /> {project.likes || 0}
                      </span>
                    </div>
                  </div>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg line-clamp-1 group-hover:text-primary transition-colors">
                      {project.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={creator.logo || "/placeholder.svg"} />
                        <AvatarFallback>{creator.username.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span>Par {creator.username}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow pb-4">
                    <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                  </CardContent>
                  <CardFooter className="pt-0 border-t mt-auto">
                    <div className="flex justify-between items-center w-full">
                      <div className="text-xs text-muted-foreground flex items-center">
                        <Calendar className="h-3.5 w-3.5 mr-1.5" />
                        {new Date(project.createdAt).toLocaleDateString("fr-FR")}
                      </div>
                      <Link href={`/projects/${project.id}`}>
                        {" "}
                        {/* Assuming project detail page */}
                        <Button size="sm" variant="ghost" className="text-primary hover:bg-primary/10">
                          Voir Plus
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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
          <Search className="mx-auto h-16 w-16 text-muted-foreground/50 mb-4" />
          <h3 className="text-xl font-semibold">Aucun projet trouvé</h3>
          <p className="text-muted-foreground">Essayez d'ajuster vos filtres ou votre recherche.</p>
        </motion.div>
      )}
    </motion.div>
  )
}

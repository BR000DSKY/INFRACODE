"use client"

import { useAuth } from "@/lib/hooks/use-auth"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Eye, Calendar, Users, FolderKanban } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { motion, useAnimation } from "framer-motion"
import { useState, useEffect } from "react"

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
}

export default function StudentProjectsPage() {
  const { user, projects, setProjects } = useAuth()
  const [showConfirm, setShowConfirm] = useState(false)
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)

  if (!user) return null

  const userProjects = projects.filter((p) => p.ownerId === user.id || p.collaborators.includes(user.id))

  const handleDelete = (projectId: string) => {
    setProjects((prevProjects) => prevProjects.filter((p) => p.id !== projectId))
    setShowConfirm(false)
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      className="space-y-8"
    >
      <motion.div variants={cardVariants}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Mes Projets</h1>
            <p className="text-muted-foreground text-lg">Gérez et partagez vos innovations</p>
          </div>
          <Link href="/dashboard/projects/create">
            <Button
              size="lg"
              className="group bg-gradient-to-r from-primary to-orange-600 hover:from-primary/90 hover:to-orange-600/90 text-white"
            >
              <PlusCircle className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
              Nouveau Projet
            </Button>
          </Link>
        </div>
      </motion.div>

      {userProjects.length === 0 ? (
        <motion.div variants={cardVariants} className="text-center py-16">
          <FolderKanban className="mx-auto h-24 w-24 text-muted-foreground mb-6" />
          <h2 className="text-2xl font-semibold mb-2">Aucun projet pour le moment</h2>
          <p className="text-muted-foreground mb-6">Créez votre premier projet et partagez votre innovation !</p>
          <Link href="/dashboard/projects/create">
            <Button size="lg" className="bg-gradient-to-r from-primary to-orange-600 text-white">
              <PlusCircle className="mr-2 h-5 w-5" />
              Créer mon premier projet
            </Button>
          </Link>
        </motion.div>
      ) : (
        <motion.div
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {userProjects.map((project) => (
            <motion.div key={project.id} variants={itemVariants}>
              <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group border-border/30">
                <div className="relative">
                  <Image
                    src={project.banner || "/placeholder.svg?width=400&height=200&query=project"}
                    alt={project.title}
                    width={400}
                    height={200}
                    className="w-full h-48 object-cover transition-transform group-hover:scale-105 duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent group-hover:from-black/70 transition-all" />
                  <Badge variant="secondary" className="absolute top-3 left-3 bg-card/80 backdrop-blur-sm">
                    {project.category}
                  </Badge>
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-white font-semibold text-lg mb-1 line-clamp-1">{project.title}</h3>
                  </div>
                </div>

                <CardContent className="p-6">
                  <p className="text-muted-foreground text-sm line-clamp-2 mb-4">{project.description}</p>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(project.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {project.collaborators.length}
                    </div>
                  </div>

                  <div className="flex gap-2 mb-4">
                    {project.files.length > 0 && (
                      <Badge variant="outline" className="text-xs">
                        {project.files.length} fichier{project.files.length > 1 ? "s" : ""}
                      </Badge>
                    )}
                    {project.videos.length > 0 && (
                      <Badge variant="outline" className="text-xs">
                        {project.videos.length} vidéo{project.videos.length > 1 ? "s" : ""}
                      </Badge>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/projects/${project.id}`}>
                      <Button className="w-full group">
                        Voir le Projet
                        <Eye className="ml-2 h-4 w-4 transition-transform group-hover:scale-110" />
                      </Button>
                    </Link>
                    <Button
                      variant="destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProjectId(project.id);
                        setShowConfirm(true);
                      }}
                    >
                      Supprimer
                    </Button>
                    {showConfirm && selectedProjectId === project.id && (
                      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-card p-6 rounded-lg shadow-lg text-center">
                          <p className="mb-4">Are you sure you want to delete this project?</p>
                          <div className="flex gap-4 justify-center">
                            <Button
                              variant="default"
                              className="bg-orange-600 text-white hover:bg-orange-700"
                              onClick={() => {
                                if (selectedProjectId) {
                                  handleDelete(selectedProjectId);
                                }
                                setShowConfirm(false);
                                setSelectedProjectId(null);
                              }}
                            >
                              OK
                            </Button>
                            <Button
                              variant="secondary"
                              className="bg-gray-600 text-white hover:bg-gray-700"
                              onClick={() => {
                                setShowConfirm(false);
                                setSelectedProjectId(null);
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  )
}
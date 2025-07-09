"use client"

import { Card, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/hooks/use-auth" // Changed from useLocalStorage
import { PlusCircle, Eye } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { FolderKanban } from "lucide-react" // Added import for FolderKanban

interface ProjectListProps {
  compact?: boolean
}

export default function ProjectList({ compact = false }: ProjectListProps) {
  const { projects, user } = useAuth() // Use projects from AuthContext
  const userProjects = projects.filter((p) => p.ownerId === user?.id || p.collaborators.includes(user?.id || ""))

  const displayProjects = compact ? userProjects.slice(0, 3) : userProjects

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  }

  if (!user) return null

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      className="space-y-6"
    >
      {displayProjects.map((project) => (
        <motion.div key={project.id} variants={itemVariants}>
          <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
            <div className="flex flex-col sm:flex-row">
              <div className="sm:w-1/3 relative">
                <Image
                  src={project.banner || "/placeholder.svg?width=300&height=200&query=project+abstract"}
                  alt={project.title}
                  width={300}
                  height={200}
                  className="w-full h-48 sm:h-full object-cover transition-transform group-hover:scale-105 duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent group-hover:from-black/70 transition-all" />
                <Badge variant="secondary" className="absolute top-2 left-2 bg-card/80 backdrop-blur-sm">
                  {project.category}
                </Badge>
              </div>
              <div className="sm:w-2/3 p-6 flex flex-col justify-between">
                <div>
                  <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">
                    {project.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2 text-muted-foreground mb-3">
                    {project.description}
                  </CardDescription>
                  <div className="w-full h-2 bg-secondary rounded-full mb-3">
                    <div className="h-2 bg-primary rounded-full" style={{ width: `${Math.random() * 80 + 20}%` }}></div>{" "}
                    {/* Placeholder progress */}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Créé le: {new Date(project.createdAt).toLocaleDateString()}
                  </div>
                </div>
                {!compact && (
                  <div className="mt-4 flex justify-end">
                    <Link href={`/projects/${project.id}`}>
                      <Button variant="outline" size="sm" className="group">
                        <Eye className="mr-2 h-4 w-4 transition-transform group-hover:rotate-12" />
                        Voir Détails
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
      {displayProjects.length === 0 && !compact && (
        <motion.div variants={itemVariants} className="text-center py-8">
          <FolderKanban className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Vous n'avez aucun projet pour le moment.</p>
          <Link href="/projects/create" className="mt-4 inline-block">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Créer votre premier projet
            </Button>
          </Link>
        </motion.div>
      )}
    </motion.div>
  )
}

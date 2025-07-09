"use client"

import { useParams, useRouter } from "next/navigation"
import { useLocalStorage } from "@/lib/hooks/use-local-storage"
import type { Project, User, FileInfo } from "@/types"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  ArrowLeft,
  Download,
  Eye,
  Heart,
  CalendarDays,
  Paperclip,
  Video,
  Users,
  StarIcon,
  FileText,
  ImageIcon,
  Play,
} from "lucide-react"
import Header from "@/components/home/header"
import Footer from "@/components/home/footer"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { useState, useEffect } from "react" // Added useEffect
import { useAuth } from "@/lib/hooks/use-auth"
import { initialProjects, initialUsers } from "@/lib/data" // For fallback

export default function ProjectDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string

  const [projects, setProjects] = useLocalStorage<Project[]>("projects", initialProjects)
  const [users] = useLocalStorage<User[]>("users", initialUsers)
  const { user: currentUser, addNotification } = useAuth()

  const [commentText, setCommentText] = useState("")
  const [ratingValue, setRatingValue] = useState(0)
  const [selectedVideo, setSelectedVideo] = useState<FileInfo | null>(null)

  const project = projects.find((p) => p.id === projectId)
  const creator = project ? users.find((u) => u.id === project.ownerId) : null

  // Recalculate averageRating when project or its ratings change
  const averageRating =
    project && project.ratings.length > 0
      ? project.ratings.reduce((acc, r) => acc + r.value, 0) / project.ratings.length
      : 0

  useEffect(() => {
    if (project && currentUser) {
      const userRating = project.ratings.find((r) => r.userId === currentUser.id)
      if (userRating) {
        setRatingValue(userRating.value)
      } else {
        setRatingValue(0) // Reset if user hasn't rated this project
      }
    } else {
      setRatingValue(0) // Reset if no project or no current user
    }
  }, [project, currentUser])

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("video/")) return <Video className="h-5 w-5 text-blue-500" />
    if (fileType.startsWith("image/")) return <ImageIcon className="h-5 w-5 text-green-500" />
    if (fileType.includes("pdf")) return <FileText className="h-5 w-5 text-red-500" />
    return <Paperclip className="h-5 w-5 text-gray-500" />
  }

  const handleFileDownload = (file: FileInfo) => {
    // For placeholder URLs, we can't actually download.
    // In a real app, file.url would be a direct link to the asset.
    if (file.url === "#" || file.url.startsWith("/placeholder.svg")) {
      toast.info(`Le téléchargement de "${file.name}" est simulé pour cet exemple.`)
      return
    }
    const link = document.createElement("a")
    link.href = file.url
    link.download = file.name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success(`Téléchargement de ${file.name} démarré.`)
  }

  const handleAddComment = () => {
    if (!currentUser) {
      toast.error("Vous devez être connecté pour commenter.")
      return
    }
    if (!commentText.trim()) {
      toast.error("Le commentaire ne peut pas être vide.")
      return
    }
    if (project) {
      const newComment = {
        id: `comment-${Date.now()}`,
        userId: currentUser.id,
        text: commentText,
        createdAt: new Date().toISOString(),
      }
      const updatedProjects = projects.map((p) =>
        p.id === projectId ? { ...p, comments: [...(p.comments || []), newComment] } : p,
      )
      setProjects(updatedProjects)
      setCommentText("")
      toast.success("Commentaire ajouté !")
      if (project.ownerId !== currentUser.id) {
        addNotification({
          userId: project.ownerId,
          type: "new_comment",
          message: `${currentUser.username} a commenté votre projet "${project.title}".`,
          link: `/projects/${project.id}`,
        })
      }
    }
  }

  const handleRating = (rate: number) => {
    if (!currentUser) {
      toast.error("Vous devez être connecté pour noter.")
      return
    }
    if (project) {
      const existingRatingIndex = project.ratings.findIndex((r) => r.userId === currentUser.id)
      let updatedRatings
      if (existingRatingIndex > -1) {
        updatedRatings = project.ratings.map((r, index) =>
          index === existingRatingIndex ? { ...r, value: rate as 1 | 2 | 3 | 4 | 5 } : r,
        )
      } else {
        updatedRatings = [...project.ratings, { userId: currentUser.id, value: rate as 1 | 2 | 3 | 4 | 5 }]
      }
      const updatedProjects = projects.map((p) => (p.id === projectId ? { ...p, ratings: updatedRatings } : p))
      setProjects(updatedProjects)
      // setRatingValue(rate); // This will be handled by useEffect
      toast.success(`Vous avez noté ce projet ${rate}/5 !`)
      if (project.ownerId !== currentUser.id) {
        addNotification({
          userId: project.ownerId,
          type: "project_rated",
          message: `${currentUser.username} a noté votre projet "${project.title}" ${rate}/5.`,
          link: `/projects/${project.id}`,
        })
      }
    }
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Projet non trouvé</h1>
            <Button onClick={() => router.back()}>Retour</Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const projectBannerSrc =
    project.banner || `/placeholder.svg?width=800&height=450&query=${encodeURIComponent(project.title || "projet")}`

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-grow py-8 md:py-12">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Button variant="ghost" onClick={() => router.back()} className="mb-6 group">
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Retour à la galerie
            </Button>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8 md:gap-12">
            {/* Main Content */}
            <motion.div
              className="lg:col-span-2 space-y-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="overflow-hidden shadow-xl border-border/30">
                <div className="relative">
                  <Image
                    src={projectBannerSrc || "/placeholder.svg"}
                    alt={project.title}
                    width={800}
                    height={450}
                    className="w-full h-auto md:h-[450px] object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 text-white">
                    <Badge variant="secondary" className="mb-2 bg-card/80 backdrop-blur-sm text-sm shadow">
                      {project.category}
                    </Badge>
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight shadow-text">{project.title}</h1>
                  </div>
                </div>
                <CardContent className="p-6 space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-2 text-primary">Description du Projet</h2>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{project.description}</p>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold mb-2 text-primary">Objectifs</h2>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{project.goals}</p>
                  </div>
                </CardContent>
              </Card>

              {project.videos && project.videos.length > 0 && (
                <Card className="shadow-lg border-border/30">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center">
                      <Video className="h-5 w-5 mr-2 text-primary" />
                      Vidéos du Projet ({project.videos.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedVideo ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold">{selectedVideo.name}</h3>
                          <Button variant="outline" size="sm" onClick={() => setSelectedVideo(null)}>
                            Voir toutes les vidéos
                          </Button>
                        </div>
                        <video
                          controls
                          src={
                            selectedVideo.url === "#" || selectedVideo.url.startsWith("/placeholder.svg")
                              ? "/placeholder.svg?width=640&height=360&query=video+player+placeholder"
                              : selectedVideo.url
                          }
                          className="w-full rounded-lg aspect-video bg-black"
                          title={selectedVideo.name}
                          poster={
                            selectedVideo.url === "#" || selectedVideo.url.startsWith("/placeholder.svg")
                              ? "/placeholder.svg?width=640&height=360"
                              : undefined
                          }
                        >
                          Votre navigateur ne supporte pas la lecture vidéo.
                        </video>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {project.videos.map((video) => (
                          <div
                            key={video.id}
                            className="relative bg-secondary/50 rounded-lg p-3 hover:bg-secondary/70 transition-colors cursor-pointer group"
                            onClick={() => setSelectedVideo(video)}
                          >
                            <div className="aspect-video bg-black rounded flex items-center justify-center mb-2 relative overflow-hidden">
                              <Image
                                src={
                                  video.url === "#" || video.url.startsWith("/placeholder.svg")
                                    ? `/placeholder.svg?width=300&height=160&query=video+thumbnail+${encodeURIComponent(video.name)}`
                                    : video.url
                                }
                                alt={`Thumbnail for ${video.name}`}
                                layout="fill"
                                objectFit="cover"
                                className="opacity-70 group-hover:opacity-100 transition-opacity"
                              />
                              <Play className="h-12 w-12 text-white/70 group-hover:text-white transition-colors absolute z-10" />
                            </div>
                            <p className="text-sm font-medium truncate" title={video.name}>
                              {video.name}
                            </p>
                            <p className="text-xs text-muted-foreground">{(video.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {project.files && project.files.length > 0 && (
                <Card className="shadow-lg border-border/30">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center">
                      <Paperclip className="h-5 w-5 mr-2 text-primary" />
                      Fichiers du Projet ({project.files.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3">
                      {project.files.map((file) => (
                        <div
                          key={file.id}
                          className="flex items-center justify-between p-3 bg-secondary/50 rounded-md hover:bg-secondary/80 transition-colors border border-border/30"
                        >
                          <div className="flex items-center gap-3 overflow-hidden flex-1">
                            {getFileIcon(file.type)}
                            <div className="flex-1 min-w-0">
                              <span className="text-sm font-medium truncate block" title={file.name}>
                                {file.name}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {(file.size / 1024 / 1024).toFixed(2)} MB •{" "}
                                {new Date(file.uploadedAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <Button size="sm" variant="outline" onClick={() => handleFileDownload(file)}>
                            <Download className="h-4 w-4 mr-1.5" />
                            Télécharger
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card className="shadow-lg border-border/30">
                <CardHeader>
                  <CardTitle className="text-xl">Commentaires et Évaluation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-md font-semibold mb-2">Évaluez ce projet :</h3>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Button
                          key={star}
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRating(star)}
                          className={`hover:scale-125 transition-transform ${(ratingValue || 0) >= star ? "text-yellow-500" : "text-muted-foreground"}`}
                        >
                          <StarIcon
                            className={`h-6 w-6 ${(ratingValue || 0) >= star ? "fill-yellow-500" : "fill-transparent"}`}
                          />
                        </Button>
                      ))}
                      <span className="ml-2 text-sm text-muted-foreground">
                        ({averageRating.toFixed(1)}/5 par {project.ratings.length} utilisateur(s))
                      </span>
                    </div>
                  </div>

                  {currentUser && (
                    <div className="space-y-2">
                      <Label htmlFor="comment">Laissez un commentaire :</Label>
                      <Textarea
                        id="comment"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Votre avis compte..."
                        rows={3}
                        className="bg-background focus:border-primary"
                      />
                      <Button onClick={handleAddComment} className="mt-2">
                        Publier
                      </Button>
                    </div>
                  )}

                  <div className="space-y-4">
                    <h3 className="text-md font-semibold">Commentaires ({project.comments?.length || 0}) :</h3>
                    {project.comments && project.comments.length > 0 ? (
                      project.comments
                        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                        .map((comment) => {
                          const commenter = users.find((u) => u.id === comment.userId)
                          return (
                            <div key={comment.id} className="p-3 bg-secondary/50 rounded-md">
                              <div className="flex items-center gap-2 mb-1">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage
                                    src={
                                      commenter?.logo ||
                                      `/placeholder.svg?width=24&height=24&query=avatar+${commenter?.username || "user"}`
                                    }
                                  />
                                  <AvatarFallback>{commenter?.username?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                                </Avatar>
                                <span className="font-semibold text-sm">
                                  {commenter?.username || "Utilisateur Anonyme"}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(comment.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{comment.text}</p>
                            </div>
                          )
                        })
                    ) : (
                      <p className="text-sm text-muted-foreground">Soyez le premier à commenter !</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Sidebar Info */}
            <motion.div
              className="lg:col-span-1 space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="shadow-lg border-border/30">
                <CardHeader>
                  <CardTitle className="text-lg">Informations Clés</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex items-center">
                    <CalendarDays className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-muted-foreground">
                      Créé le: {new Date(project.createdAt).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-muted-foreground">Vues: {project.views || 0}</span>
                  </div>
                  <div className="flex items-center">
                    <Heart className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-muted-foreground">Likes: {project.likes || 0}</span>
                  </div>
                  <div className="flex items-center">
                    <Paperclip className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-muted-foreground">Fichiers: {project.files?.length || 0}</span>
                  </div>
                  <div className="flex items-center">
                    <Video className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-muted-foreground">Vidéos: {project.videos?.length || 0}</span>
                  </div>
                </CardContent>
              </Card>

              {creator && (
                <Card className="shadow-lg border-border/30">
                  <CardHeader>
                    <CardTitle className="text-lg">Créateur du Projet</CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={creator.logo || `/placeholder.svg?width=48&height=48&query=avatar+${creator.username}`}
                      />
                      <AvatarFallback>{creator.username?.charAt(0).toUpperCase() || "?"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{creator.name}</p>
                      <p className="text-sm text-muted-foreground">@{creator.username}</p>
                      <p className="text-xs text-muted-foreground">
                        Filière: {creator.filiereId === "DEV" ? "Développement" : "Infrastructure Digitale"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {project.collaborators &&
                project.collaborators.length > 1 && ( // Only show if more than owner
                  <Card className="shadow-lg border-border/30">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center">
                        <Users className="h-5 w-5 mr-2 text-primary" />
                        Collaborateurs
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {project.collaborators
                        .filter((cId) => cId !== project.ownerId)
                        .map((collabId) => {
                          const collaborator = users.find((u) => u.id === collabId)
                          if (!collaborator) return null
                          return (
                            <div key={collabId} className="flex items-center gap-2 text-sm">
                              <Avatar className="h-6 w-6">
                                <AvatarImage
                                  src={
                                    collaborator.logo ||
                                    `/placeholder.svg?width=24&height=24&query=avatar+${collaborator.username}`
                                  }
                                />
                                <AvatarFallback>{collaborator.username?.charAt(0).toUpperCase() || "C"}</AvatarFallback>
                              </Avatar>
                              <span>{collaborator.username}</span>
                            </div>
                          )
                        })}
                    </CardContent>
                  </Card>
                )}
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/hooks/use-auth"
import type { Project, FileInfo } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { ArrowLeft, UploadCloud, Paperclip, Trash2, Sparkles, Video, FileText, ImageIcon } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import Image from "next/image"

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB
const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/gif",
  "application/zip",
  "video/mp4",
  "video/webm",
  "video/avi",
  "video/mov",
  "text/plain",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]

export default function CreateProjectPage() {
  const { user, projects, setProjects, updateUser } = useAuth()
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [goals, setGoals] = useState("")
  const [category, setCategory] = useState<"Développement Digital" | "Infrastructure Digitale">("Développement Digital")
  const [uploadedFiles, setUploadedFiles] = useState<FileInfo[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bannerFile, setBannerFile] = useState<File | null>(null)
  const [bannerPreview, setBannerPreview] = useState<string>("")

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("video/")) return <Video className="h-5 w-5 text-blue-500" />
    if (fileType.startsWith("image/")) return <ImageIcon className="h-5 w-5 text-green-500" />
    if (fileType.includes("pdf")) return <FileText className="h-5 w-5 text-red-500" />
    return <Paperclip className="h-5 w-5 text-gray-500" />
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files)
      const newFileInfos: FileInfo[] = []

      files.forEach((file) => {
        if (file.size > MAX_FILE_SIZE) {
          toast.error(`Le fichier ${file.name} est trop volumineux (max 50MB).`)
          return
        }
        if (!ALLOWED_FILE_TYPES.includes(file.type)) {
          toast.error(`Type de fichier non autorisé pour ${file.name}.`)
          return
        }
        const fileInfo: FileInfo = {
          id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`,
          name: file.name,
          type: file.type,
          size: file.size,
          url: URL.createObjectURL(file),
          uploadedAt: new Date().toISOString(),
        }
        newFileInfos.push(fileInfo)
      })
      setUploadedFiles((prev) => [...prev, ...newFileInfos])
      toast.success(`${newFileInfos.length} fichier(s) ajouté(s) avec succès !`)
    }
  }

  const handleBannerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0]
      if (file.size > 10 * 1024 * 1024) {
        toast.error("La bannière ne peut pas dépasser 10MB.")
        return
      }
      if (!file.type.startsWith("image/")) {
        toast.error("La bannière doit être une image.")
        return
      }
      setBannerFile(file)
      const previewUrl = URL.createObjectURL(file)
      setBannerPreview(previewUrl)
      toast.success("Bannière ajoutée avec succès !")
    }
  }

  const removeFile = (fileId: string) => {
    const fileToRemove = uploadedFiles.find((f) => f.id === fileId)
    if (fileToRemove) URL.revokeObjectURL(fileToRemove.url)
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId))
    toast.success("Fichier supprimé.")
  }

  const removeBanner = () => {
    if (bannerPreview) URL.revokeObjectURL(bannerPreview)
    setBannerFile(null)
    setBannerPreview("")
    toast.success("Bannière supprimée.")
  }

  const handleSubmit = () => {
    if (!user) {
      toast.error("Vous devez être connecté pour créer un projet.")
      return
    }
    if (!title || !description || !goals || !category) {
      toast.error("Veuillez remplir tous les champs obligatoires.")
      return
    }

    setIsSubmitting(true)

    const projectBannerUrl = bannerPreview || `/placeholder.svg?width=800&height=450&query=${encodeURIComponent(title)}`

    const newProject: Project = {
      id: `project-${Date.now()}`,
      title,
      description,
      goals,
      banner: projectBannerUrl,
      ownerId: user.id,
      category,
      createdAt: new Date().toISOString(),
      files: uploadedFiles.filter((f) => !f.type.startsWith("video/")),
      videos: uploadedFiles.filter((f) => f.type.startsWith("video/")),
      collaborators: [user.id],
      comments: [],
      ratings: [],
      views: 0,
      likes: 0,
    }

    setProjects([...projects, newProject])

    // Award points
    const pointsAwarded = 100
    const updatedUser = { ...user, points: (user.points || 0) + pointsAwarded }
    if (!user.badges?.includes("Premier Projet") && updatedUser.points >= 100) {
      updatedUser.badges = [...(user.badges || []), "Premier Projet"]
    }
    updateUser(updatedUser)

    toast.success(`Projet "${title}" créé avec succès ! +${pointsAwarded} points !`)
    setIsSubmitting(false)
    router.push("/dashboard/projects")
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      className="max-w-4xl mx-auto space-y-8 pb-12"
    >
      <motion.div variants={cardVariants}>
        <Link href="/dashboard/projects">
          <Button variant="ghost" className="mb-4 group">
            <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Retour à Mes Projets
          </Button>
        </Link>
        <h1 className="text-4xl font-bold tracking-tight flex items-center">
          <Sparkles className="mr-3 h-8 w-8 text-primary animate-pulse" />
          Créer un Nouveau Projet
        </h1>
        <p className="text-muted-foreground mt-1">Partagez votre innovation avec la communauté.</p>
      </motion.div>

      <motion.div variants={cardVariants}>
        <Card className="shadow-xl border-border/30">
          <CardHeader>
            <CardTitle className="text-2xl">Informations du Projet</CardTitle>
            <CardDescription>Décrivez votre projet en détail.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Titre du Projet *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Plateforme E-commerce Intelligente"
                className="bg-background border-border/50 focus:border-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Décrivez votre projet, ses fonctionnalités principales..."
                rows={4}
                className="bg-background border-border/50 focus:border-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="goals">Objectifs *</Label>
              <Textarea
                id="goals"
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
                placeholder="Quels sont les objectifs principaux de ce projet ?"
                rows={3}
                className="bg-background border-border/50 focus:border-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Catégorie *</Label>
              <Select
                value={category}
                onValueChange={(value: "Développement Digital" | "Infrastructure Digitale") => setCategory(value)}
              >
                <SelectTrigger className="bg-background border-border/50 focus:border-primary">
                  <SelectValue placeholder="Sélectionnez une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Développement Digital">Développement Digital</SelectItem>
                  <SelectItem value="Infrastructure Digitale">Infrastructure Digitale</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={cardVariants}>
        <Card className="shadow-xl border-border/30">
          <CardHeader>
            <CardTitle className="text-2xl">Bannière du Projet</CardTitle>
            <CardDescription>Ajoutez une image de couverture pour votre projet (optionnel).</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {!bannerPreview ? (
                <Label
                  htmlFor="banner-upload"
                  className="block w-full p-6 border-2 border-dashed border-border/50 rounded-lg text-center cursor-pointer hover:border-primary transition-colors bg-background hover:bg-secondary/30"
                >
                  <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                  <span className="font-semibold text-primary">Cliquez pour choisir une bannière</span>
                  <p className="text-xs text-muted-foreground mt-1">PNG, JPG, GIF (Max 10MB)</p>
                </Label>
              ) : (
                <div className="relative">
                  <Image
                    src={bannerPreview || "/placeholder.svg"}
                    alt="Aperçu bannière"
                    width={800}
                    height={400}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <Button variant="destructive" size="sm" onClick={removeBanner} className="absolute top-2 right-2">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <Input id="banner-upload" type="file" accept="image/*" onChange={handleBannerChange} className="hidden" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={cardVariants}>
        <Card className="shadow-xl border-border/30">
          <CardHeader>
            <CardTitle className="text-2xl">Fichiers et Vidéos du Projet</CardTitle>
            <CardDescription>Ajoutez des documents, images, ou vidéos (max 50MB par fichier).</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Label
                htmlFor="file-upload"
                className="block w-full p-6 border-2 border-dashed border-border/50 rounded-lg text-center cursor-pointer hover:border-primary transition-colors bg-background hover:bg-secondary/30"
              >
                <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                <span className="font-semibold text-primary">Cliquez pour choisir des fichiers</span> ou glissez-déposez
                <p className="text-xs text-muted-foreground mt-1">
                  PDF, Images, Vidéos, Documents, ZIP (Max 50MB par fichier)
                </p>
              </Label>
              <Input
                id="file-upload"
                type="file"
                multiple
                accept=".pdf,.png,.jpg,.jpeg,.gif,.zip,.mp4,.webm,.avi,.mov,.txt,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
              />

              {uploadedFiles.length > 0 && (
                <div className="space-y-3 pt-4">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Fichiers téléversés ({uploadedFiles.length}) :
                  </h3>
                  <div className="grid gap-3">
                    {uploadedFiles.map((file) => (
                      <motion.div
                        key={file.id}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        layout
                        className="flex items-center justify-between p-3 bg-secondary/50 rounded-md border border-border/30 hover:bg-secondary/70 transition-colors"
                      >
                        <div className="flex items-center gap-3 overflow-hidden flex-1">
                          {getFileIcon(file.type)}
                          <div className="flex-1 min-w-0">
                            <span className="text-sm font-medium truncate block" title={file.name}>
                              {file.name}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {file.type.startsWith("video/") ? "Vidéo" : "Fichier"} •{" "}
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFile(file.id)}
                          className="h-8 w-8 hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={cardVariants} className="flex justify-end pt-4">
        <Button
          size="lg"
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-gradient-to-r from-primary to-orange-600 hover:from-primary/90 hover:to-orange-600/90 text-white shadow-lg hover:shadow-primary/50 transition-all"
        >
          {isSubmitting ? "Création en cours..." : "Créer le Projet"}
        </Button>
      </motion.div>
    </motion.div>
  )
}

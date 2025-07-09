"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useAuth } from "@/lib/hooks/use-auth"
import type { User } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/theme-toggle"
import { toast } from "sonner"
import { motion } from "framer-motion"
import { UserCog, Shield, BellRing, Palette, Save, UploadCloud } from "lucide-react"

const sectionVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
}

export default function SettingsPage() {
  const { user, updateUser, logout } = useAuth()
  const [name, setName] = useState(user?.name || "")
  const [username, setUsername] = useState(user?.username || "")
  const [logoUrl, setLogoUrl] = useState(user?.logo || "")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [profilePicFile, setProfilePicFile] = useState<File | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleProfileUpdate = () => {
    if (!user) return
    let newLogoUrl = logoUrl
    if (profilePicFile) {
      newLogoUrl = URL.createObjectURL(profilePicFile)
      toast.info("L'avatar sera mis à jour localement (simulation d'upload).")
    }
    const updatedUserData: User = { ...user, name, username, logo: newLogoUrl }
    updateUser(updatedUserData)
    setLogoUrl(newLogoUrl)
    toast.success("Profil mis à jour avec succès !")
  }

  const handlePasswordChange = () => {
    if (!newPassword || newPassword !== confirmPassword) {
      toast.error("Les nouveaux mots de passe ne correspondent pas ou sont vides.")
      return
    }
    toast.success("Mot de passe changé avec succès ! (Simulation)")
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.size > 2 * 1024 * 1024) {
        // 2MB limit
        toast.error("La taille du fichier ne doit pas dépasser 2MB.")
        setProfilePicFile(null)
        setFileName(null)
        if (fileInputRef.current) {
          fileInputRef.current.value = "" // Reset file input
        }
        return
      }
      setProfilePicFile(file)
      setLogoUrl(URL.createObjectURL(file))
      setFileName(file.name)
    } else {
      setProfilePicFile(null)
      setFileName(null)
    }
  }

  if (!user) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-10 p-4 md:p-8"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight flex items-center">
          <UserCog className="mr-3 h-8 w-8 md:h-10 md:w-10 text-primary" />
          Paramètres du Compte
        </h1>
        <p className="text-muted-foreground">Gérez vos informations personnelles et préférences.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="lg:col-span-2 space-y-8">
          <Card className="shadow-lg border-border/30 hover-lift">
            <CardHeader>
              <CardTitle className="text-xl">Informations du Profil</CardTitle>
              <CardDescription>Mettez à jour votre nom, nom d'utilisateur et avatar.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <Avatar className="h-24 w-24 sm:h-20 sm:w-20 border-2 border-primary/50">
                  <AvatarImage
                    src={logoUrl || user.logo || `https://avatar.vercel.sh/${user.username}.png?size=100`}
                    alt={user.username}
                  />
                  <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="space-y-3 flex-grow w-full">
                  <Label htmlFor="profilePicUploadButton" className="text-sm font-medium">
                    Changer l'avatar
                  </Label>
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full sm:w-auto group border-dashed border-primary/50 hover:border-primary hover:bg-primary/5 text-primary"
                    >
                      <UploadCloud className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                      Choisir un fichier
                    </Button>
                    <Input
                      id="profilePicUpload"
                      type="file"
                      accept="image/png, image/jpeg, image/gif"
                      onChange={handleFileChange}
                      ref={fileInputRef}
                      className="hidden" // Hide the actual input
                    />
                    {fileName && (
                      <span
                        className="text-sm text-muted-foreground truncate max-w-[150px] sm:max-w-xs"
                        title={fileName}
                      >
                        {fileName}
                      </span>
                    )}
                    {!fileName && <span className="text-sm text-muted-foreground">Aucun fichier choisi</span>}
                  </div>
                  <p className="text-xs text-muted-foreground">Max 2MB. PNG, JPG, GIF.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom complet</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-background focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Nom d'utilisateur</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-background focus:border-primary"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email (Non modifiable)</Label>
                <Input id="email" value={user.email} disabled className="bg-muted/50 cursor-not-allowed" />
              </div>
              <Button onClick={handleProfileUpdate} className="w-full md:w-auto group">
                <Save className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                Enregistrer les modifications
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-border/30 hover-lift">
            <CardHeader>
              <CardTitle className="text-xl">Changer le mot de passe</CardTitle>
              <CardDescription>Mettez à jour votre mot de passe pour plus de sécurité.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="bg-background focus:border-primary"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="bg-background focus:border-primary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-background focus:border-primary"
                  />
                </div>
              </div>
              <Button onClick={handlePasswordChange} variant="outline" className="w-full md:w-auto group">
                <Shield className="mr-2 h-4 w-4 transition-colors group-hover:text-primary" />
                Changer le mot de passe
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1 }}
          className="space-y-8"
        >
          <Card className="shadow-lg border-border/30 hover-lift">
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <Palette className="mr-2 h-5 w-5 text-primary" />
                Thème
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Changer l'apparence du site.</p>
              <ThemeToggle />
            </CardContent>
          </Card>
          <Card className="shadow-lg border-border/30 hover-lift">
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <BellRing className="mr-2 h-5 w-5 text-primary" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Gérer vos préférences de notification (Fonctionnalité à venir).
              </p>
              <Button variant="secondary" className="w-full mt-4" disabled>
                Configurer
              </Button>
            </CardContent>
          </Card>
          <Button variant="destructive" className="w-full group" onClick={logout}>
            Déconnexion
          </Button>
        </motion.div>
      </div>
    </motion.div>
  )
}

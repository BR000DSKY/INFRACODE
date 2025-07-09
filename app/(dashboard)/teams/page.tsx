"use client"

import { useState } from "react"
import { useAuth } from "@/lib/hooks/use-auth"
import type { Team, User } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { PlusCircle, Users, Edit3 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"
import { useLocalStorage } from "@/lib/hooks/use-local-storage" // For teams data
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { X } from "lucide-react"

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: "easeOut" },
  }),
}

export default function TeamsPage() {
  const { user } = useAuth()
  const [teams, setTeams] = useLocalStorage<Team[]>("teams", []) // Store teams in local storage
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [newTeamName, setNewTeamName] = useState("")
  const [newTeamDescription, setNewTeamDescription] = useState("")
  // In a real app, users would be fetched or available in context
  const mockAllUsers: User[] = [
    {
      id: "user-1",
      username: "alice_dev",
      name: "Alice",
      email: "",
      filiereId: "101",
      role: "stagiaire",
      points: 0,
      badges: [],
    },
    {
      id: "user-dev2",
      username: "charlie_code",
      name: "Charlie",
      email: "",
      filiereId: "101",
      role: "stagiaire",
      points: 0,
      badges: [],
    },
    {
      id: "user-id1",
      username: "david_infra",
      name: "David",
      email: "",
      filiereId: "102",
      role: "stagiaire",
      points: 0,
      badges: [],
    },
  ]
  const [invitedMembers, setInvitedMembers] = useState<string[]>([]) // Store usernames

  const userTeams = teams.filter((team) => team.ownerId === user?.id || team.members.includes(user?.id || ""))

  const handleCreateTeam = () => {
    if (!user) {
      toast.error("Vous devez être connecté.")
      return
    }
    if (!newTeamName.trim()) {
      toast.error("Le nom de l'équipe est requis.")
      return
    }
    const newTeam: Team = {
      id: `team-${Date.now()}`,
      name: newTeamName,
      description: newTeamDescription,
      ownerId: user.id,
      members: [
        user.id,
        ...invitedMembers
          .map((username) => mockAllUsers.find((u) => u.username === username)?.id || "")
          .filter((id) => id),
      ], // Add owner and invited members
      projectIds: [],
    }
    setTeams((prev) => [...prev, newTeam])
    toast.success(`Équipe "${newTeamName}" créée !`)
    setNewTeamName("")
    setNewTeamDescription("")
    setInvitedMembers([])
    setIsCreateModalOpen(false)
  }

  const handleInviteMember = (username: string) => {
    if (!invitedMembers.includes(username) && username !== user?.username) {
      setInvitedMembers((prev) => [...prev, username])
    }
  }
  const handleRemoveInvitedMember = (username: string) => {
    setInvitedMembers((prev) => prev.filter((u) => u !== username))
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-8">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="flex flex-col md:flex-row justify-between items-center gap-4"
      >
        <div>
          <h1 className="text-4xl font-bold tracking-tight flex items-center">
            <Users className="mr-3 h-10 w-10 text-primary" />
            Mes Équipes
          </h1>
          <p className="text-muted-foreground">Collaborez et gérez vos projets en équipe.</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button
              size="lg"
              className="group bg-gradient-to-r from-primary to-orange-600 hover:from-primary/90 hover:to-orange-600/90 text-white shadow-lg hover:shadow-primary/50 transition-all"
            >
              <PlusCircle className="mr-2 h-5 w-5 transition-transform group-hover:rotate-90" />
              Créer une Équipe
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px] bg-card border-border/50">
            <DialogHeader>
              <DialogTitle className="text-2xl">Nouvelle Équipe</DialogTitle>
              <DialogDescription>Configurez les détails de votre nouvelle équipe.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="team-name">Nom de l'équipe</Label>
                <Input
                  id="team-name"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  placeholder="Ex: Les Innovateurs"
                  className="bg-background focus:border-primary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="team-description">Description (Optionnel)</Label>
                <Textarea
                  id="team-description"
                  value={newTeamDescription}
                  onChange={(e) => setNewTeamDescription(e.target.value)}
                  placeholder="Objectifs et focus de l'équipe..."
                  className="bg-background focus:border-primary"
                />
              </div>
              <div className="space-y-2">
                <Label>Inviter des membres</Label>
                {/* Basic member invite by username - needs more robust search/select in real app */}
                <div className="flex gap-2">
                  <Select onValueChange={(value) => handleInviteMember(value)}>
                    <SelectTrigger className="bg-background focus:border-primary">
                      <SelectValue placeholder="Rechercher un utilisateur..." />
                    </SelectTrigger>
                    <SelectContent>
                      {mockAllUsers
                        .filter((u) => u.id !== user?.id && !invitedMembers.includes(u.username))
                        .map((u) => (
                          <SelectItem key={u.id} value={u.username}>
                            {u.username} ({u.name})
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                {invitedMembers.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {invitedMembers.map((username) => (
                      <div
                        key={username}
                        className="flex items-center justify-between text-sm p-1.5 bg-secondary rounded"
                      >
                        <span>{username}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleRemoveInvitedMember(username)}
                        >
                          <X className="h-3 w-3 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleCreateTeam} className="bg-primary hover:bg-primary/90">
                Créer l'Équipe
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>

      {userTeams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {userTeams.map((team, i) => (
              <motion.div
                key={team.id}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <Card className="h-full flex flex-col group hover-lift border-border/30">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">{team.name}</CardTitle>
                      <Button variant="ghost" size="icon" className="h-8 w-8 opacity-50 group-hover:opacity-100">
                        <Edit3 className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardDescription className="line-clamp-2">
                      {team.description || "Aucune description."}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow space-y-3">
                    <div>
                      <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1.5">
                        Membres ({team.members.length})
                      </h4>
                      <div className="flex -space-x-2 overflow-hidden">
                        {team.members.slice(0, 5).map((memberId) => {
                          const memberUser = mockAllUsers.find((u) => u.id === memberId) || { username: "?", logo: "" }
                          return (
                            <Avatar
                              key={memberId}
                              className="h-7 w-7 border-2 border-card group-hover:border-primary/30 transition-colors"
                            >
                              <AvatarImage src={memberUser.logo || "/placeholder.svg"} />
                              <AvatarFallback>{memberUser.username.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                          )
                        })}
                        {team.members.length > 5 && (
                          <Avatar className="h-7 w-7 border-2 border-card group-hover:border-primary/30 transition-colors">
                            <AvatarFallback>+{team.members.length - 5}</AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-1.5">
                        Projets ({team.projectIds?.length || 0})
                      </h4>
                      {/* Placeholder for project links */}
                      {team.projectIds?.length ? (
                        <p className="text-sm text-muted-foreground">Voir les projets</p>
                      ) : (
                        <p className="text-sm text-muted-foreground">Aucun projet associé.</p>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full">
                      Gérer l'Équipe
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16 border-2 border-dashed border-border/50 rounded-lg bg-card"
        >
          <Users className="mx-auto h-16 w-16 text-muted-foreground/50 mb-4" />
          <h3 className="text-xl font-semibold">Aucune équipe pour le moment</h3>
          <p className="text-muted-foreground">Créez une équipe pour commencer à collaborer sur des projets.</p>
        </motion.div>
      )}
    </motion.div>
  )
}

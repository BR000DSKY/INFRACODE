"use client" // This was already present, just confirming

import { useLocalStorage } from "@/lib/hooks/use-local-storage"
import type { User } from "@/types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trophy, Award, Star, TrendingUp, ShieldCheck } from "lucide-react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: "easeOut" },
  }),
}

export default function LeaderboardPage() {
  const [users] = useLocalStorage<User[]>("users", [])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterFiliere, setFilterFiliere] = useState("all")

  const sortedUsers = [...users]
    .filter((user) => user.role === "stagiaire")
    .filter((user) => {
      const matchesSearch =
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesFiliere = filterFiliere === "all" || user.filiereId === filterFiliere
      return matchesSearch && matchesFiliere
    })
    .sort((a, b) => (b.points || 0) - (a.points || 0))

  const getRankColor = (rank: number) => {
    if (rank === 0) return "border-yellow-400 bg-yellow-500/10 text-yellow-500"
    if (rank === 1) return "border-gray-400 bg-gray-500/10 text-gray-400"
    if (rank === 2) return "border-orange-400 bg-orange-500/10 text-orange-400"
    return "border-border bg-secondary/50"
  }
  const getRankIcon = (rank: number) => {
    if (rank === 0) return <Trophy className="h-5 w-5 text-yellow-500 fill-yellow-500" />
    if (rank === 1) return <Award className="h-5 w-5 text-gray-400 fill-gray-400" />
    if (rank === 2) return <Star className="h-5 w-5 text-orange-400 fill-orange-400" />
    return <ShieldCheck className="h-5 w-5 text-muted-foreground" />
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-8">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold tracking-tight flex items-center">
          <Trophy className="mr-3 h-10 w-10 text-primary animate-pulse" />
          Classement des Stagiaires
        </h1>
        <p className="text-muted-foreground">Découvrez les étudiants les plus actifs et performants.</p>
      </motion.div>

      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex flex-col md:flex-row gap-4 p-4 bg-card border rounded-lg shadow-sm sticky top-[60px] z-30"
      >
        <Input
          placeholder="Rechercher un stagiaire..."
          className="flex-grow bg-background focus:border-primary"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select value={filterFiliere} onValueChange={setFilterFiliere}>
          <SelectTrigger className="w-full md:w-[200px] bg-background focus:border-primary">
            <SelectValue placeholder="Filtrer par filière" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les filières</SelectItem>
            <SelectItem value="101">DEV (101)</SelectItem>
            <SelectItem value="102">ID (102)</SelectItem>
            <SelectItem value="103">Autres (103)</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.5 }}>
        {sortedUsers.length > 0 ? (
          <div className="space-y-3">
            {sortedUsers.map((stagiaire, index) => (
              <motion.div
                key={stagiaire.id}
                custom={index}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className={`flex items-center justify-between p-3 md:p-4 rounded-lg border-2 transition-all duration-300 hover:shadow-xl hover:scale-[1.01] ${getRankColor(
                  index,
                )}`}
              >
                <div className="flex items-center gap-3 md:gap-4">
                  <div
                    className={`font-bold text-lg w-10 h-10 flex items-center justify-center rounded-full border-2 ${getRankColor(index)}`}
                  >
                    {getRankIcon(index)}
                  </div>
                  <Avatar className="h-12 w-12 md:h-14 md:w-14 border-2 border-primary/30">
                    <AvatarImage src={stagiaire.logo || `https://avatar.vercel.sh/${stagiaire.username}.png`} />
                    <AvatarFallback className="text-xl">{stagiaire.username.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-md md:text-lg group-hover:text-primary transition-colors">
                      {stagiaire.name}
                    </p>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      @{stagiaire.username} - Filière {stagiaire.filiereId}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg md:text-xl text-primary flex items-center">
                    <Star className="h-5 w-5 md:h-6 md:w-6 mr-1.5 text-yellow-500 fill-yellow-500" />
                    {stagiaire.points || 0}
                    <span className="text-sm ml-1">pts</span>
                  </div>
                  {stagiaire.badges && stagiaire.badges.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1 justify-end">
                      {stagiaire.badges.slice(0, 2).map((badge) => (
                        <Badge
                          key={badge}
                          variant="secondary"
                          className="text-xs px-1.5 py-0.5 bg-opacity-50 backdrop-blur-sm"
                        >
                          <Award className="h-3 w-3 mr-1" />
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-card rounded-lg shadow-sm border">
            <TrendingUp className="mx-auto h-20 w-20 text-muted-foreground/30 mb-4" />
            <h3 className="text-xl font-semibold text-muted-foreground">
              Aucun stagiaire ne correspond à vos critères.
            </h3>
            <p className="text-muted-foreground/80">
              Le classement est peut-être vide ou votre recherche est trop spécifique.
            </p>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

"use client"
import { Button } from "@/components/ui/button"
import ProjectList from "@/components/stagiaire/project-list"
import { PlusCircle, LayoutGrid, List } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ProjectsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid") // Or load from localStorage
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")

  // Add filtering logic to ProjectList or pass filters as props

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-8">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="flex flex-col md:flex-row justify-between items-center gap-4"
      >
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Mes Projets</h1>
          <p className="text-muted-foreground">Gérez, suivez et créez vos projets innovants.</p>
        </div>
        <Link href="/projects/create">
          <Button
            size="lg"
            className="group bg-gradient-to-r from-primary to-orange-600 hover:from-primary/90 hover:to-orange-600/90 text-white shadow-lg hover:shadow-primary/50 transition-all"
          >
            <PlusCircle className="mr-2 h-5 w-5 transition-transform group-hover:rotate-90" />
            Nouveau Projet
          </Button>
        </Link>
      </motion.div>

      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex flex-col md:flex-row gap-4 p-4 bg-card border border-border/30 rounded-lg shadow-sm"
      >
        <Input
          placeholder="Rechercher un projet..."
          className="flex-grow bg-background border-border/50 focus:border-primary"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-full md:w-[200px] bg-background border-border/50 focus:border-primary">
            <SelectValue placeholder="Catégorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les catégories</SelectItem>
            <SelectItem value="Développement Digital">Infrastructure Digitale</SelectItem>
            <SelectItem value="Infrastructure Digitale">Développement Digital</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex gap-2">
          <Button
            variant={viewMode === "grid" ? "secondary" : "outline"}
            size="icon"
            onClick={() => setViewMode("grid")}
          >
            <LayoutGrid className="h-5 w-5" />
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "outline"}
            size="icon"
            onClick={() => setViewMode("list")}
          >
            <List className="h-5 w-5" />
          </Button>
        </div>
      </motion.div>

      {/* ProjectList component will need to be adapted to handle viewMode and filters */}
      <ProjectList viewMode={viewMode} searchTerm={searchTerm} filterCategory={filterCategory} />
    </motion.div>
  )
}

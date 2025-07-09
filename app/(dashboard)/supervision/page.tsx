"use client"
import { motion } from "framer-motion"
import { Eye, Filter, Search } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/hooks/use-auth"
import Link from "next/link"

export default function SupervisionPage() {
  const { projects } = useAuth() // All projects

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-8">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold tracking-tight flex items-center">
          <Eye className="mr-3 h-10 w-10 text-primary" />
          Supervision des Projets
        </h1>
        <p className="text-muted-foreground">Suivez et évaluez les projets de tous les stagiaires.</p>
      </motion.div>

      <Card className="shadow-lg border-border/30">
        <CardHeader>
          <CardTitle>Liste des Projets</CardTitle>
          <div className="flex gap-2 mt-2">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher projet ou stagiaire..."
                className="pl-9 bg-background focus:border-primary"
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filtrer
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre du Projet</TableHead>
                <TableHead>Stagiaire</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.slice(0, 5).map(
                (
                  project, // Display first 5 for brevity
                ) => (
                  <TableRow key={project.id} className="hover:bg-secondary/50 transition-colors">
                    <TableCell className="font-medium">{project.title}</TableCell>
                    <TableCell>{project.ownerId}</TableCell> {/* Replace with actual username later */}
                    <TableCell>
                      <Badge variant="outline">{project.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={Math.random() > 0.5 ? "default" : "secondary"}
                        className={
                          Math.random() > 0.5
                            ? "bg-green-500/20 text-green-700 dark:bg-green-500/10 dark:text-green-400 border-green-500/30"
                            : ""
                        }
                      >
                        {Math.random() > 0.5 ? "Approuvé" : "En attente"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Link href={`/projects/${project.id}`}>
                        {" "}
                        {/* Link to project detail for evaluation */}
                        <Button variant="ghost" size="sm">
                          Évaluer
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ),
              )}
            </TableBody>
          </Table>
          {projects.length === 0 && (
            <p className="text-center py-4 text-muted-foreground">Aucun projet à superviser pour le moment.</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

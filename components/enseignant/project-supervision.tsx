import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useLocalStorage } from "@/lib/hooks/use-local-storage"
import type { Project } from "@/types"

export default function ProjectSupervision() {
  const [projects] = useLocalStorage<Project[]>("projects", [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Supervision des Projets</CardTitle>
        <CardDescription>Vue d'ensemble de tous les projets des stagiaires.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Projet</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Statut</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-medium">{project.title}</TableCell>
                <TableCell>{project.category}</TableCell>
                <TableCell>
                  <Badge variant="outline">En cours</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

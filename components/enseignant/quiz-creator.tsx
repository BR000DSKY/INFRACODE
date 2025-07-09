import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PlusCircle } from "lucide-react"

export default function QuizCreator() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Créateur de Quiz</CardTitle>
        <CardDescription>Créez et assignez des quiz à vos stagiaires.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="quiz-title">Titre du Quiz</Label>
          <Input id="quiz-title" placeholder="Ex: Bases de React" />
        </div>
        <div>
          <Label>Questions</Label>
          <div className="p-4 border rounded-lg bg-secondary space-y-2">
            <Input placeholder="Question 1..." />
            <Input placeholder="Réponse correcte" />
          </div>
        </div>
        <Button variant="outline" size="sm">
          <PlusCircle className="h-4 w-4 mr-2" />
          Ajouter une question
        </Button>
        <Button className="w-full">Créer et assigner le Quiz</Button>
      </CardContent>
    </Card>
  )
}

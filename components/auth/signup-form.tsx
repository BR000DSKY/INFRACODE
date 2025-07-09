"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import Link from "next/link"
import { CodeXml } from "lucide-react"

export default function SignUpForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    username: "",
    logo: "",
    filiereId: "DEV",
    role: "stagiaire",
  })
  const { signup } = useAuth()
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSelectChange = (id: string) => (value: string) => {
    setFormData({ ...formData, [id]: value })
  }

  const handleSignUp = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.username) {
      toast.error("Veuillez remplir tous les champs obligatoires.")
      return
    }
    const newUser = signup(formData)
    if (newUser) {
      toast.success("Compte créé avec succès ! Vous pouvez maintenant vous connecter.")
      router.push("/login")
    } else {
      toast.error("Cet email ou nom d'utilisateur est déjà pris.")
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CodeXml className="mx-auto h-10 w-10 text-primary mb-4" />
        <CardTitle className="text-2xl">Créer un compte</CardTitle>
        <CardDescription>Rejoignez la communauté du Pôle Digital</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nom complet</Label>
          <Input id="name" value={formData.name} onChange={handleChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="username">Nom d'utilisateur</Label>
          <Input id="username" value={formData.username} onChange={handleChange} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={formData.email} onChange={handleChange} />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="password">Mot de passe</Label>
          <Input id="password" type="password" value={formData.password} onChange={handleChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="filiereId">Filière</Label>
          <Select value={formData.filiereId} onValueChange={handleSelectChange("filiereId")}>
            <SelectTrigger>
              <SelectValue placeholder="Choisir une filière" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DEV">Développement</SelectItem>
              <SelectItem value="ID">Infrastructure Digitale</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="role">Rôle</Label>
          <Select value={formData.role} onValueChange={handleSelectChange("role")}>
            <SelectTrigger>
              <SelectValue placeholder="Rôle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="stagiaire">Stagiaire</SelectItem>
              <SelectItem value="enseignant">Enseignant</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="logo">URL du logo (Optionnel)</Label>
          <Input id="logo" placeholder="https://example.com/logo.png" value={formData.logo} onChange={handleChange} />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button className="w-full" onClick={handleSignUp}>
          S'inscrire
        </Button>
        <p className="text-sm text-muted-foreground">
          Déjà un compte ?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Connectez-vous
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}

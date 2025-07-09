"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { toast } from "sonner"
import Link from "next/link"
import { CodeXml } from "lucide-react"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { login } = useAuth()
  const router = useRouter()

  const handleLogin = () => {
    const user = login(email, password)
    if (user) {
      toast.success(`Bienvenue, ${user.username}!`)
      router.push("/dashboard")
    } else {
      toast.error("Email ou mot de passe incorrect.")
    }
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <CodeXml className="mx-auto h-10 w-10 text-primary mb-4" />
        <CardTitle className="text-2xl">Connexion</CardTitle>
        <CardDescription>Accédez à votre tableau de bord</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Mot de passe</Label>
          <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button className="w-full" onClick={handleLogin}>
          Se connecter
        </Button>
        <p className="text-sm text-muted-foreground">
          Pas de compte ?{" "}
          <Link href="/sign-up" className="text-primary hover:underline">
            Inscrivez-vous
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}

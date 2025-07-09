"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useLocalStorage } from "@/lib/hooks/use-local-storage"
import { toast } from "sonner"

interface ContactSubmission {
  name: string
  email: string
  message: string
  submittedAt: string
}

export default function ContactForm() {
  const [submissions, setSubmissions] = useLocalStorage<ContactSubmission[]>("contactSubmissions", [])
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")

  const handleSubmit = () => {
    if (!name || !email || !message) {
      toast.error("Veuillez remplir tous les champs.")
      return
    }
    const newSubmission = {
      name,
      email,
      message,
      submittedAt: new Date().toISOString(),
    }
    setSubmissions([...submissions, newSubmission])
    toast.success("Message envoyé avec succès !")
    setName("")
    setEmail("")
    setMessage("")
  }

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
      <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
        <Card className="max-w-lg mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Contactez-nous</CardTitle>
            <CardDescription>Une question ou une proposition ? N'hésitez pas.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input placeholder="Nom" value={name} onChange={(e) => setName(e.target.value)} />
              <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <Textarea placeholder="Votre message" value={message} onChange={(e) => setMessage(e.target.value)} />
              <Button onClick={handleSubmit} className="w-full">
                Envoyer le message
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

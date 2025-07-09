"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLocalStorage } from "@/lib/hooks/use-local-storage"
import { toast } from "sonner"
import { ArrowLeft, Mail, Phone, MapPin, Send } from "lucide-react"
import Link from "next/link"
import Header from "@/components/home/header"
import Footer from "@/components/home/footer"

interface ContactSubmission {
  name: string
  email: string
  message: string
  submittedAt: string
}

export default function ContactPage() {
  const [submissions, setSubmissions] = useLocalStorage<ContactSubmission[]>("contactSubmissions", [])
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Veuillez remplir tous les champs.")
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newSubmission: ContactSubmission = {
      ...formData,
      submittedAt: new Date().toISOString(),
    }

    setSubmissions([...submissions, newSubmission])
    toast.success("Message envoyé avec succès !")

    setFormData({ name: "", email: "", message: "" })
    setIsSubmitting(false)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-orange-600/10 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <Link href="/">
              <Button variant="ghost" className="mb-6 group">
                <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Retour à l'accueil
              </Button>
            </Link>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">
              Contactez-nous
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Une question, une suggestion ou envie de nous rejoindre ? N'hésitez pas à nous contacter
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <Card className="h-fit">
                <CardHeader>
                  <CardTitle className="text-2xl">Envoyez-nous un message</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Nom complet
                    </label>
                    <Input id="name" placeholder="Votre nom" value={formData.name} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="votre@email.com"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium">
                      Message
                    </label>
                    <Textarea
                      id="message"
                      placeholder="Votre message..."
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                    />
                  </div>
                  <Button onClick={handleSubmit} className="w-full group" disabled={isSubmitting}>
                    {isSubmitting ? (
                      "Envoi en cours..."
                    ) : (
                      <>
                        Envoyer le message
                        <Send className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-2xl font-bold mb-6">Informations de contact</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <p className="text-muted-foreground">test2001@gmail.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Téléphone</h3>
                      <p className="text-muted-foreground">+212 6 84 25 85 01</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Adresse</h3>
                      <p className="text-muted-foreground">
                        CMC TANGER
                        <br />
                        Pôle Digital
                        <br />
                        Tanger, Maroc
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Card className="bg-gradient-to-br from-primary/5 to-orange-600/5 border-primary/20">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-3">Horaires d'ouverture</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Lundi - Vendredi</span>
                      <span>8h30 - 18h30</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Samedi</span>
                      <span>8h30 - 18h30</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Dimanche</span>
                      <span>Fermé</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

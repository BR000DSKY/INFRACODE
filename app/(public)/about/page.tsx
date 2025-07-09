"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Target, Users, Lightbulb, Award, Code, Network } from "lucide-react"
import Link from "next/link"
import Header from "@/components/home/header"
import Footer from "@/components/home/footer"

const values = [
  {
    icon: Target,
    title: "Innovation",
    description: "Nous encourageons la créativité et l'innovation dans chaque projet.",
  },
  {
    icon: Users,
    title: "Collaboration",
    description: "Nous croyons en la force du travail d'équipe et du partage de connaissances.",
  },
  {
    icon: Lightbulb,
    title: "Excellence",
    description: "Nous visons l'excellence dans tout ce que nous entreprenons.",
  },
  {
    icon: Award,
    title: "Reconnaissance",
    description: "Nous valorisons et récompensons les efforts et les réussites.",
  },
]

const specializations = [
  {
    icon: Code,
    title: "Développement Digital",
    description:
      "Maîtrisez les technologies web, mobile et les frameworks modernes. Créez des applications innovantes qui répondent aux besoins du marché.",
    skills: ["React/Next.js", "Node.js", "Mobile Development", "UI/UX Design"],
  },
  {
    icon: Network,
    title: "Infrastructure Digitale",
    description:
      "Apprenez à concevoir et gérer des infrastructures robustes. Devenez expert en cloud computing et cybersécurité.",
    skills: ["Cloud Computing", "DevOps", "Cybersécurité", "Réseaux"],
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-orange-600/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/about-bg.png')] bg-cover bg-center opacity-5" />
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
              À Propos du Pôle Digital
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Découvrez notre mission, nos valeurs et notre vision pour l'avenir du digital
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-6">Notre Mission</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Le Pôle Digital de la CMC TANGER est un écosystème vibrant dédié à l'excellence dans les domaines de
              l'Infrastructure Digitale et du Développement Digital. Nous formons la prochaine génération de leaders
              technologiques en offrant une plateforme où les étudiants peuvent publier leurs projets, collaborer et
              apprendre les uns des autres.
            </p>
          </motion.div>

          {/* Values */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="text-center h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <value.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Specializations */}
      <section className="py-16 bg-secondary/50">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Nos Spécialisations</h2>
            <p className="text-xl text-muted-foreground">Deux pôles d'excellence pour répondre aux défis du digital</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {specializations.map((spec, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-xl transition-shadow">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-primary to-orange-600 rounded-lg flex items-center justify-center mr-4">
                        <spec.icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold">{spec.title}</h3>
                    </div>
                    <p className="text-muted-foreground mb-6 leading-relaxed">{spec.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {spec.skills.map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold mb-4">Prêt à Nous Rejoindre ?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Faites partie de notre communauté et commencez à publier vos projets dès aujourd'hui
            </p>
            <Link href="/sign-up">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-orange-600 hover:from-primary/90 hover:to-orange-600/90"
              >
                Rejoignez-nous
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

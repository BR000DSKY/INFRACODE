"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, Share2, Trophy, Users, Code, Lightbulb } from "lucide-react"
import Link from "next/link"

const features = [
  {
    icon: Upload,
    title: "Publiez vos Projets",
    description: "Partagez vos créations avec la communauté et obtenez des retours constructifs.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Share2,
    title: "Collaborez en Équipe",
    description: "Travaillez ensemble sur des projets innovants et développez vos compétences.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Trophy,
    title: "Système de Points",
    description: "Gagnez des points et des badges en publiant et en collaborant sur des projets.",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: Users,
    title: "Communauté Active",
    description: "Rejoignez une communauté dynamique d'étudiants passionnés par le digital.",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Code,
    title: "Développement Digital",
    description: "Spécialisez-vous dans le développement web, mobile et les nouvelles technologies.",
    color: "from-indigo-500 to-blue-500",
  },
  {
    icon: Lightbulb,
    title: "Infrastructure Digitale",
    description: "Maîtrisez les infrastructures cloud, réseaux et systèmes d'information.",
    color: "from-yellow-500 to-orange-500",
  },
]

export default function FeaturesSection() {
  return (
    <section className="py-20 bg-secondary/50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=60 height=60 viewBox=0 0 60 60 xmlns=http://www.w3.org/2000/svg%3E%3Cg fill=none fillRule=evenodd%3E%3Cg fill=%23000 fillOpacity=0.1%3E%3Ccircle cx=7 cy=7 r=1/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] bg-repeat" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">
            Pourquoi Choisir Notre Plateforme ?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Une plateforme complète pour les étudiants du digital qui veulent partager leurs projets et collaborer
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <Card className="h-full bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 group">
                <CardContent className="p-6">
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} p-3 mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Link href="/sign-up">
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-orange-600 hover:from-primary/90 hover:to-orange-600/90 transition-all duration-300 transform hover:scale-105"
            >
              Rejoignez-nous Maintenant
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"

export default function CTASection() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-orange-600/20" />
      <div className="absolute inset-0 bg-[url('/projects-bg.png')] bg-cover bg-center opacity-10" />

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="mb-6"
          >
            <Sparkles className="h-16 w-16 text-primary mx-auto" />
          </motion.div>

          <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">
            Prêt à Publier Votre Premier Projet ?
          </h2>

          <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
            Rejoignez notre communauté d'étudiants innovants et partagez vos créations avec le monde. Votre prochain
            projet pourrait inspirer des milliers d'autres étudiants !
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link href="/sign-up">
              <Button
                size="lg"
                className="group bg-gradient-to-r from-primary to-orange-600 hover:from-primary/90 hover:to-orange-600/90 transition-all duration-300 transform hover:scale-105"
              >
                Créer Mon Compte
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline" className="group">
                En Savoir Plus
                <Sparkles className="ml-2 h-4 w-4 transition-transform group-hover:rotate-12" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

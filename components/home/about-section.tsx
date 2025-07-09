"use client"

import { motion } from "framer-motion"
import { Users, Code, Network } from "lucide-react"
import CountUp from "react-countup"

const stats = [
  { icon: Users, value: 50, label: "Stagiaires Actifs" },
  { icon: Code, value: 100, label: "Projets Lancés" },
  { icon: Network, value: 2, label: "Pôles d'Excellence" },
]

export default function AboutSection() {
  return (
    <section className="py-12 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">À Propos du Pôle Digital</h2>
            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
              Le Pôle Digital de la CMC TANGER est un écosystème vibrant dédié à l'excellence dans les domaines de
              l'Infrastructure Digitale et du Développement Digital. Nous formons la prochaine génération de leaders
              technologiques.
            </p>
            <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
              Notre mission est de fournir un environnement d'apprentissage pratique où la créativité et l'innovation
              sont encouragées pour résoudre les défis du monde réel.
            </p>
          </div>
          <div className="flex flex-col items-start space-y-4">
            <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-3">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="text-center p-4 rounded-lg bg-secondary"
                >
                  <stat.icon className="mx-auto h-12 w-12 text-primary" />
                  <div className="text-4xl font-bold mt-2">
                    <CountUp end={stat.value} duration={2.5} enableScrollSpy />+
                  </div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

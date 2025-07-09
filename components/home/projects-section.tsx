"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, Heart, Download, Calendar, User } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

const featuredProjects = [
  {
    id: "proj-ahmed-1", // Matched with lib/data.ts
    title: "E-Commerce Platform",
    description: "Une plateforme e-commerce moderne avec React et Node.js",
    author: "TEST5",
    category: "Web Development",
    image: "/projet1.png?width=400&height=250",
    views: 1250,
    likes: 89,
    downloads: 45,
    date: "2024-01-15",
    tags: ["React", "Node.js", "MongoDB"],
  },
  {
    id: "proj-fatima-1", // Matched with lib/data.ts
    title: "AAA Framework: Authentication, Authorization, and Accounting",
    description: "Application mobile de banking avec Flutter",
    author: "TEST6",
    category: "Mobile Development",
    image: "/projet2.png?width=400&height=250",
    views: 980,
    likes: 67,
    downloads: 32,
    date: "2024-01-10",
    tags: ["Flutter", "Dart", "Firebase"],
  },
  {
    id: "proj-youssef-1", // Matched with lib/data.ts
    title: "AI Chatbot",
    description: "Chatbot intelligent utilisant l'IA et le NLP",
    author: "TEST7",
    category: "Artificial Intelligence",
    image: "/projet3.png?width=400&height=250",
    views: 1500,
    likes: 120,
    downloads: 78,
    date: "2024-01-08",
    tags: ["Python", "TensorFlow", "NLP"],
  },
]

export default function ProjectsSection() {
  return (
    <section className="py-20 bg-secondary/20">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Projets <span className="gradient-text">Récents</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Découvrez les dernières créations de nos étudiants talentueux
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 card-hover">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={project.image || "/placeholder.svg"} // Use the updated image path
                    alt={project.title}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                      {project.category}
                    </Badge>
                  </div>
                </div>

                <CardHeader>
                  <CardTitle className="group-hover:text-primary transition-colors">{project.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{project.description}</CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="flex items-center gap-2 mb-4">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{project.author}</span>
                    <Calendar className="h-4 w-4 text-muted-foreground ml-auto" />
                    <span className="text-sm text-muted-foreground">
                      {new Date(project.date).toLocaleDateString("fr-FR")}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        <span>{project.views}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        <span>{project.likes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Download className="h-4 w-4" />
                        <span>{project.downloads}</span>
                      </div>
                    </div>
                  </div>

                  <Link href={`/projects/${project.id}`}>
                    <Button className="w-full group button-glow">
                      Voir le Projet
                      <Eye className="ml-2 h-4 w-4 transition-transform group-hover:scale-110" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Link href="/projects-gallery">
            <Button size="lg" variant="outline" className="hover-lift">
              Voir Tous les Projets
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

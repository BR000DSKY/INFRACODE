"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Award, Star } from "lucide-react"
import { motion } from "framer-motion"

const topStudents = [
  // Assuming these IDs match users in lib/data.ts for consistency
  {
    id: "user-5", // Hamza Zekhnini
    name: "TOP 1",
    filiere: "ID",
    points: 3000,
    rank: 1,
    avatar: "/pic1.jpg?width=80&height=80",
    projects: 18,
    badges: ["Top Contributor", "Innovation Award"],
  },
  {
    id: "user-6", // Hamza El Jonayd
    name: "TOP 2",
    filiere: "ID", // Should be DEV based on lib/data.ts, or update lib/data.ts
    points: 2380,
    rank: 2,
    avatar: "/pic2.jpg?width=80&height=80",
    projects: 10,
    badges: ["Design Expert", "Team Player"],
  },
  {
    id: "user-7", // Reda Esahtari
    name: "TOP 3",
    filiere: "DEV",
    points: 2290,
    rank: 3,
    avatar: "/pic1.jpg?width=80&height=80",
    projects: 9,
    badges: ["Code Master", "Problem Solver"],
  },
]

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Trophy className="h-8 w-8 text-yellow-500" />
    case 2:
      return <Medal className="h-8 w-8 text-gray-400" />
    case 3:
      return <Award className="h-8 w-8 text-amber-600" />
    default:
      return <Star className="h-8 w-8 text-primary" />
  }
}

const getPodiumHeight = (rank: number) => {
  switch (rank) {
    case 1:
      return "h-32"
    case 2:
      return "h-24"
    case 3:
      return "h-20"
    default:
      return "h-16"
  }
}

export default function TopStudentsSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text">Leaderboard</span> des Étudiants
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Découvrez les étudiants les plus performants de notre communauté
          </p>
        </motion.div>

        <div className="flex items-end justify-center gap-4 mb-12 max-w-4xl mx-auto">
          {topStudents.map((student, index) => (
            <motion.div
              key={student.id}
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: Math.abs(student.rank - 2) * 0.1 + 0.1 }} // Stagger based on rank
              viewport={{ once: true }}
            >
              <Card
                className={`mb-4 hover:shadow-xl transition-all duration-300 card-hover ${student.rank === 1 ? "border-yellow-400" : student.rank === 2 ? "border-gray-300" : "border-amber-500"}`}
              >
                <CardContent className="p-6 text-center">
                  <div className="relative mb-4">
                    <img
                      src={student.avatar || "/placeholder.svg"}
                      alt={student.name}
                      className={`rounded-full mx-auto border-4 ${student.rank === 1 ? "w-20 h-20 border-yellow-400" : "w-16 h-16 border-gray-300"}`}
                    />
                    <div className="absolute -top-2 -right-2">{getRankIcon(student.rank)}</div>
                  </div>
                  <h3 className={`font-bold mb-1 ${student.rank === 1 ? "text-xl" : "text-lg"}`}>{student.name}</h3>
                  <Badge variant="outline" className="mb-2">
                    {student.filiere}
                  </Badge>
                  <div className={`font-bold text-primary mb-2 ${student.rank === 1 ? "text-3xl" : "text-2xl"}`}>
                    {student.points.toLocaleString()} pts
                  </div>
                  <div className="text-sm text-muted-foreground mb-3">{student.projects} projets</div>
                  <div className="flex flex-wrap gap-1 justify-center">
                    {student.badges.map((badge) => (
                      <Badge key={badge} variant="secondary" className="text-xs">
                        {badge}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <div
                className={`w-24 bg-gradient-to-t ${student.rank === 1 ? "from-yellow-400 to-yellow-500" : student.rank === 2 ? "from-gray-300 to-gray-400" : "from-amber-500 to-amber-600"} ${getPodiumHeight(student.rank)} rounded-t-lg flex items-center justify-center`}
              >
                <span className="text-white font-bold text-xl">{student.rank}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <p className="text-muted-foreground mb-4">
            Gagnez des points en complétant des projets, en participant aux quiz et en contribuant à la communauté
          </p>
        </motion.div>
      </div>
    </section>
  )
}

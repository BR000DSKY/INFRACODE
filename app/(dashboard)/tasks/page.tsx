"use client"

import TaskManager from "@/components/stagiaire/task-manager"
import { motion } from "framer-motion"
import { ListChecks, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"

export default function TasksPage() {
  const [filterStatus, setFilterStatus] = useState<"all" | "completed" | "pending">("all")
  // Add more filters like project, due date range etc.

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-8">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="flex flex-col md:flex-row justify-between items-center gap-4"
      >
        <div>
          <h1 className="text-4xl font-bold tracking-tight flex items-center">
            <ListChecks className="mr-3 h-10 w-10 text-primary" />
            Mes Tâches
          </h1>
          <p className="text-muted-foreground">Organisez votre travail et suivez vos progrès.</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="group">
              <Filter className="mr-2 h-4 w-4 transition-transform group-hover:rotate-12" />
              Filtrer les tâches
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Statut</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem checked={filterStatus === "all"} onCheckedChange={() => setFilterStatus("all")}>
              Toutes
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filterStatus === "pending"}
              onCheckedChange={() => setFilterStatus("pending")}
            >
              En cours
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filterStatus === "completed"}
              onCheckedChange={() => setFilterStatus("completed")}
            >
              Complétées
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </motion.div>

      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="bg-card p-4 sm:p-6 rounded-lg shadow-lg border border-border/30"
      >
        {/* Pass filterStatus to TaskManager if it supports it, or filter tasks here */}
        <TaskManager compact={false} filterStatus={filterStatus} />
      </motion.div>
    </motion.div>
  )
}

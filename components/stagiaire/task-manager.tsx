"use client"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { PlusCircle, Trash2, CalendarDays } from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/lib/hooks/use-auth" // Changed from useLocalStorage
import type { Task } from "@/types"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"

interface TaskManagerProps {
  compact?: boolean
  projectId?: string // To filter tasks by project if needed
}

export default function TaskManager({ compact = false, projectId }: TaskManagerProps) {
  const { tasks, setTasks, user } = useAuth() // Use tasks from AuthContext
  const [newTaskName, setNewTaskName] = useState("")

  const userTasks = tasks.filter((task) => {
    // Basic filter: show tasks assigned to user or unassigned if no projectId
    // More complex logic might be needed for team tasks etc.
    const projectMatch = projectId ? task.projectId === projectId : true
    return projectMatch // && (task.assignee === user?.id || !task.assignee);
  })

  const displayTasks = compact ? userTasks.slice(0, 3) : userTasks

  const addTask = () => {
    if (newTaskName.trim() === "" || !user) return
    const task: Task = {
      id: `task-${Date.now()}`,
      name: newTaskName,
      completed: false,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Default due date: 1 week from now
      assignee: user.id, // Assign to current user by default
      projectId: projectId,
    }
    setTasks((prevTasks) => [...prevTasks, task])
    setNewTaskName("")
  }

  const toggleTask = (id: string) => {
    setTasks((prevTasks) => prevTasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  const deleteTask = (id: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id))
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.05 } } }}>
      {!compact && (
        <div className="flex gap-2 mb-6">
          <Input
            placeholder="Ajouter une nouvelle tâche..."
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
            className="bg-card border-border/50 focus:border-primary"
          />
          <Button onClick={addTask} size="icon" className="bg-primary hover:bg-primary/90">
            <PlusCircle className="h-5 w-5" />
          </Button>
        </div>
      )}
      <div className={`space-y-3 ${compact ? "max-h-60" : "max-h-96"} overflow-y-auto pr-2 custom-scrollbar`}>
        {displayTasks.map((task) => (
          <motion.div
            key={task.id}
            variants={itemVariants}
            layout
            className="flex items-center gap-3 p-3 rounded-lg bg-card hover:bg-secondary border border-border/30 transition-colors group"
          >
            <Checkbox
              id={`task-${task.id}`}
              checked={task.completed}
              onCheckedChange={() => toggleTask(task.id)}
              className="border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
            />
            <label
              htmlFor={`task-${task.id}`}
              className={`flex-grow text-sm font-medium cursor-pointer ${
                task.completed ? "line-through text-muted-foreground" : "text-foreground"
              }`}
            >
              {task.name}
            </label>
            <div className="flex items-center gap-2 ml-auto">
              <Badge
                variant={task.completed ? "secondary" : "outline"}
                className="text-xs hidden sm:inline-flex items-center"
              >
                <CalendarDays className="h-3 w-3 mr-1" />
                {new Date(task.dueDate).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })}
              </Badge>
              {!compact && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteTask(task.id)}
                  className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
      {displayTasks.length === 0 && (
        <motion.p variants={itemVariants} className="text-center text-muted-foreground py-4">
          {compact ? "Aucune tâche urgente." : "Aucune tâche pour le moment. Ajoutez-en une !"}
        </motion.p>
      )}
    </motion.div>
  )
}

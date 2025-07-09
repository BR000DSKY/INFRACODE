"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useLocalStorage } from "./use-local-storage"
import type { User, SignUpData, Project, Task, Notification } from "@/types"
import { initialUsers, initialProjects, initialTasks } from "@/lib/data"

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => User | null
  logout: () => void
  signup: (data: SignUpData) => User | null
  updateUser: (updatedUser: User) => void
  projects: Project[]
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>
  deleteProject: (projectId: string) => void
  tasks: Task[]
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>
  notifications: Notification[]
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>
  addNotification: (notification: Omit<Notification, "id" | "createdAt" | "isRead">) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useLocalStorage<User[]>("users", [])
  const [projectsData, setProjectsData] = useLocalStorage<Project[]>("projects", [])
  const [tasksData, setTasksData] = useLocalStorage<Task[]>("tasks", [])
  const [notificationsData, setNotificationsData] = useLocalStorage<Notification[]>("notifications", [])
  const [currentUser, setCurrentUser] = useLocalStorage<User | null>("currentUser", null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (users.length === 0) {
      setUsers(initialUsers)
    }
    if (projectsData.length === 0) {
      setProjectsData(initialProjects)
    }
    if (tasksData.length === 0) {
      setTasksData(initialTasks)
    }
    setLoading(false)
  }, [])

  const login = (email: string, password: string): User | null => {
    const foundUser = users.find((u) => u.email === email && u.password === password)
    if (foundUser) {
      setCurrentUser(foundUser)
      return foundUser
    }
    return null
  }

  const logout = () => {
    setCurrentUser(null)
  }

  const signup = (data: SignUpData): User | null => {
    const userExists = users.some((u) => u.email === data.email || u.username === data.username)
    if (userExists) {
      return null
    }
    const newUser: User = {
      id: `user-${Date.now()}`,
      ...data,
      points: 0,
      badges: [],
    }
    setUsers([...users, newUser])
    return newUser
  }

  const updateUser = (updatedUser: User) => {
    setUsers(users.map((u) => (u.id === updatedUser.id ? updatedUser : u)))
    if (currentUser?.id === updatedUser.id) {
      setCurrentUser(updatedUser)
    }
  }

  const deleteProject = (projectId: string) => {
    setProjectsData((prevProjects) => prevProjects.filter((p) => p.id !== projectId))
  }

  const addNotification = (notificationData: Omit<Notification, "id" | "createdAt" | "isRead">) => {
    const newNotification: Notification = {
      ...notificationData,
      id: `notif-${Date.now()}`,
      createdAt: new Date().toISOString(),
      isRead: false,
    }
    setNotificationsData((prev) => [newNotification, ...prev])
  }

  const value = {
    user: currentUser,
    loading,
    login,
    logout,
    signup,
    updateUser,
    projects: projectsData,
    setProjects: setProjectsData,
    deleteProject,
    tasks: tasksData,
    setTasks: setTasksData,
    notifications: notificationsData,
    setNotifications: setNotificationsData,
    addNotification,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
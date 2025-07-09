"use client"

import { useAuth } from "@/lib/hooks/use-auth"
import type { Notification } from "@/types"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BellRing, CheckCheck, Trash2, Star, Users } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { cn } from "@/lib/utils"

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.05, duration: 0.4, ease: "easeOut" },
  }),
}

export default function NotificationsPage() {
  const { notifications, setNotifications, user } = useAuth()

  const userNotifications = notifications.filter((n) => n.userId === user?.id)

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => (n.userId === user?.id ? { ...n, isRead: true } : n)))
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const deleteAllNotifications = () => {
    setNotifications((prev) => prev.filter((n) => n.userId !== user?.id))
  }

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "new_comment":
        return <BellRing className="h-5 w-5 text-blue-500" />
      case "project_rated":
        return <Star className="h-5 w-5 text-yellow-500" />
      case "join_request":
        return <Users className="h-5 w-5 text-green-500" />
      // Add more cases as needed
      default:
        return <BellRing className="h-5 w-5 text-primary" />
    }
  }

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
            <BellRing className="mr-3 h-10 w-10 text-primary animate-swing" />
            Notifications
          </h1>
          <p className="text-muted-foreground">Restez informé des dernières activités.</p>
        </div>
        {userNotifications.length > 0 && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={markAllAsRead} className="group">
              <CheckCheck className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
              Tout marquer comme lu
            </Button>
            <Button variant="destructive" onClick={deleteAllNotifications} className="group">
              <Trash2 className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
              Tout supprimer
            </Button>
          </div>
        )}
      </motion.div>

      <Card className="shadow-xl border-border/30">
        <CardHeader>
          <CardTitle>Vos Notifications Récentes</CardTitle>
          <CardDescription>
            {userNotifications.length > 0
              ? `Vous avez ${userNotifications.filter((n) => !n.isRead).length} notification(s) non lue(s).`
              : "Aucune nouvelle notification."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {userNotifications.length > 0 ? (
            <ul className="space-y-3 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
              {userNotifications.map((notif, index) => (
                <motion.li
                  key={notif.id}
                  custom={index}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  className={cn(
                    "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-lg border transition-all duration-300 hover:shadow-md",
                    notif.isRead ? "bg-card border-border/30 opacity-70" : "bg-primary/5 border-primary/20",
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">{getNotificationIcon(notif.type)}</div>
                    <div>
                      <p className={`font-medium ${!notif.isRead ? "text-foreground" : "text-muted-foreground"}`}>
                        {notif.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(notif.createdAt).toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" })}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2 sm:mt-0 self-end sm:self-center">
                    {notif.link && (
                      <Link href={notif.link}>
                        <Button size="sm" variant="ghost" className="text-primary hover:bg-primary/10">
                          Voir
                        </Button>
                      </Link>
                    )}
                    {!notif.isRead && (
                      <Button size="sm" variant="outline" onClick={() => markAsRead(notif.id)}>
                        Marquer comme lu
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteNotification(notif.id)}
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-12">
              <BellRing className="mx-auto h-20 w-20 text-muted-foreground/30 mb-4" />
              <p className="text-xl font-semibold text-muted-foreground">Tout est calme ici.</p>
              <p className="text-muted-foreground/80">Vous n'avez aucune notification pour le moment.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Helper for animation
declare module "framer-motion" {
  export interface AnimatePresenceProps {
    mode?: "sync" | "popLayout" | "wait"
  }
}

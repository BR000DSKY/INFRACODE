"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Bell,
  Home,
  Package,
  Users,
  LineChart,
  Settings,
  CodeXml,
  BookCheck,
  Trophy,
  type LucideIcon,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/hooks/use-auth"
import { cn } from "@/lib/utils"

interface NavItem {
  href: string
  icon: LucideIcon
  label: string
  badge?: number
  subItems?: { href: string; label: string }[]
}

export default function Sidebar() {
  const pathname = usePathname()
  const { user } = useAuth()

  const stagiaireNav = [
    { href: "/dashboard", icon: Home, label: "Dashboard" },
    { href: "/dashboard/projects", icon: Package, label: "Mes Projets", },
    { href: "/leaderboard", icon: Trophy, label: "Leaderboard" },
    { href: "/tasks", icon: LineChart, label: "Mes Tâches" },
    { href: "/teams", icon: Users, label: "Mes Équipes" },
    { href: "/settings", icon: Settings, label: "Paramètres" },
    { href: "/notifications", icon: Bell, label: "Notifications", badge: 0 },
  ]

  const enseignantNav = [
    { href: "/dashboard", icon: Home, label: "Dashboard" },
    { href: "/supervision", icon: Package, label: "Supervision Projets" },
    { href: "/leaderboard", icon: Trophy, label: "Leaderboard" },
    {
      href: "/dashboard/quizzes/all",
      icon: BookCheck,
      label: "Gestion Quiz",
      subItems: [
        { href: "/dashboard/quizzes/create", label: "Créer Quiz" },
        { href: "/dashboard/quizzes/all", label: "Tous les Quiz" },
        { href: "/dashboard/quizzes/results", label: "Résultats" },
      ],
    },
    { href: "/students", icon: Users, label: "Suivi Stagiaires" },
    { href: "/settings", icon: Settings, label: "Paramètres" },
    { href: "/notifications", icon: Bell, label: "Notifications", badge: 0 },
  ]

  const navItems = user?.role === "stagiaire" ? stagiaireNav : enseignantNav

  return (
    <div className="hidden border-r bg-card md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <CodeXml className="h-6 w-6 text-primary" />
            <span className="">InfraCode</span>
          </Link>
          <button className="ml-auto h-8 w-8 rounded-full border flex items-center justify-center lg:hidden">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Toggle notifications</span>
          </button>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {navItems.map((item) => (
              <div key={item.label} className="mb-1">
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-secondary",
                    pathname === item.href && "bg-secondary text-primary",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                  {item.badge !== undefined && (
                    <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                      {item.badge}
                    </Badge>
                  )}
                </Link>

                {item.subItems && item.subItems.length > 0 && (
                  <div className="ml-6 mt-1 space-y-1">
                    {item.subItems.map((subItem) => (
                      <Link
                        key={subItem.label}
                        href={subItem.href}
                        className={cn(
                          "flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-all hover:text-primary hover:bg-secondary",
                          pathname === subItem.href && "bg-secondary text-primary",
                        )}
                      >
                        <span className="h-1 w-1 rounded-full bg-current"></span>
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>
    </div>
  )
}
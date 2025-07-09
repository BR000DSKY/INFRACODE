"use client"
import { Menu, Search, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/lib/hooks/use-auth"
import { ThemeToggle } from "../theme-toggle"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function DashboardHeader() {
  const { user, logout, notifications } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const handleDashboardRedirect = () => {
    router.push("/dashboard/stagiaire")
  }

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          {/* Mobile Sidebar content can be duplicated here or passed as props */}
        </SheetContent>
      </Sheet>
      <div className="w-full flex-1">
        <form>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher des projets..."
              className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
            />
          </div>
        </form>
      </div>
      <Link href="/notifications" className="relative mr-2">
        <Button variant="ghost" size="icon" className="rounded-full group">
          <Bell className="h-5 w-5 transition-transform group-hover:animate-shake" />
          {user && notifications.filter((n) => n.userId === user.id && !n.isRead).length > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs animate-pulse"
            >
              {notifications.filter((n) => n.userId === user.id && !n.isRead).length}
            </Badge>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </Link>
      <ThemeToggle />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">
            <Avatar>
              <AvatarImage src={user?.logo || "/placeholder.svg"} alt={user?.username} />
              <AvatarFallback>{user?.username?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <Button variant="ghost" onClick={handleDashboardRedirect} className="w-full text-left">
              Mon Compte
            </Button>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/settings" className="flex items-center w-full">
              <span>Paramètres</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/contact" className="flex items-center w-full">
              <span>Support</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>Déconnexion</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
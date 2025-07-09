"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Menu, X } from "lucide-react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

const navItems = [
  { href: "/", label: "Accueil" },
  { href: "/projects-gallery", label: "Projects" },
  { href: "/about", label: "À Propos" },
  { href: "/contact", label: "Contact" },
  { href: "/quizzes", label: "Quizzes" },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen)

  const menuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.07 } },
    exit: { opacity: 0, y: -20, transition: { staggerChildren: 0.05, staggerDirection: -1 } },
  }
  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60 transition-default">
      <div className="container flex h-16 max-w-screen-2xl items-center px-4 md:px-6">
        <Link href="/" className="flex items-center space-x-2 group shrink-0">
          <div className="relative h-8 w-8 overflow-hidden">
            <svg viewBox="0 0 36 36" className="h-full w-full">
              <path
                fill="currentColor"
                className="text-primary"
                d="M18 0C8.059 0 0 8.059 0 18s8.059 18 18 18 18-8.059 18-18S27.941 0 18 0zm0 2c8.837 0 16 7.163 16 16s-7.163 16-16 16S2 26.837 2 18 9.163 2 18 2z"
              />
              <path
                fill="currentColor"
                className="text-primary"
                d="M18 6c-6.617 0-12 5.383-12 12s5.383 12 12 12 12-5.383 12-12S24.617 6 18 6zm0 2c5.514 0 10 4.486 10 10s-4.486 10-10 10S8 23.514 8 18s4.486-10 10-10z"
              />
              <path
                fill="currentColor"
                className="text-primary"
                d="M18 12c-3.308 0-6 2.692-6 6s2.692 6 6 6 6-2.692 6-6-2.692-6-6-6zm0 2c2.206 0 4 1.794 4 4s-1.794 4-4 4-4-1.794-4-4 1.794-4 4-4z"
              />
              <path fill="currentColor" className="text-primary" d="M18 16a2 2 0 100 4 2 2 0 000-4z" />
              <path fill="currentColor" className="text-foreground" d="M28 10l-4 2v4l4 2 4-2v-4z" />
            </svg>
          </div>
          <span className="font-bold text-lg sm:inline-block group-hover:text-primary transition-colors">
            InfraCode <span className="text-primary">CMC</span>
          </span>
        </Link>

        {/* Desktop Navigation - Centered */}
        <nav className="hidden md:flex flex-1 items-center justify-center space-x-6 lg:space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors relative group"
            >
              {item.label}
              <motion.span
                className="absolute bottom-[-2px] left-0 w-0 h-0.5 bg-primary"
                initial={{ width: 0 }}
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.3 }}
              />
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center space-x-3 shrink-0 ml-auto">
          <Link href="/login">
            <Button className="transition-default hover-lift focus-ring button-glow">Connexion</Button>
          </Link>
          <ThemeToggle />
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden ml-auto">
          <Button variant="ghost" size="icon" onClick={toggleMobileMenu} aria-label="Toggle menu">
            <AnimatePresence mode="wait">
              {mobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                >
                  <X className="h-6 w-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="open"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                >
                  <Menu className="h-6 w-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="md:hidden absolute top-16 left-0 w-full bg-background/95 backdrop-blur-md shadow-xl border-t border-border/60"
          >
            <motion.nav
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex flex-col items-center space-y-5 p-6"
            >
              {navItems.map((item) => (
                <motion.div variants={itemVariants} key={item.label}>
                  <Link
                    href={item.href}
                    className="text-lg font-medium hover:text-primary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div variants={itemVariants} className="w-full pt-2">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="w-full">
                  <Button className="w-full transition-default hover-lift focus-ring button-glow">Connexion</Button>
                </Link>
              </motion.div>
              <motion.div variants={itemVariants}>
                <ThemeToggle />
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

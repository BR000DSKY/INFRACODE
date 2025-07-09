import { CodeXml, Github, Twitter, Linkedin } from "lucide-react"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-background border-t py-6">
      <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center space-x-2">
          <CodeXml className="h-6 w-6 text-primary" />
          <span className="font-bold">InfraCode</span>
        </div>
        <p className="text-sm text-muted-foreground mt-4 md:mt-0">© 2025 InfraCode. Tous droits réservés.</p>
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
            <Twitter className="h-5 w-5" />
          </Link>
          <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
            <Github className="h-5 w-5" />
          </Link>
          <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
            <Linkedin className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </footer>
  )
}

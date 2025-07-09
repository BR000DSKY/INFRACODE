import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  description?: string
  color?: string
}

export default function StatsCard({ title, value, icon: Icon, description, color }: StatsCardProps) {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-border/30">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={cn("h-5 w-5 text-muted-foreground", color)} />
      </CardHeader>
      <CardContent>
        <div className={cn("text-3xl font-bold", color)}>{value}</div>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </CardContent>
    </Card>
  )
}

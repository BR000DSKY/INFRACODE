"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"

const data = [
  { name: "Projet A", tasks: 12, completed: 8 },
  { name: "Projet B", tasks: 8, completed: 8 },
  { name: "Projet C", tasks: 15, completed: 5 },
  { name: "Projet D", tasks: 5, completed: 2 },
]

export default function AnalyticsChart() {
  return (
    <div className="h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip
            cursor={{ fill: "hsl(var(--secondary))" }}
            contentStyle={{
              backgroundColor: "hsl(var(--background))",
              borderColor: "hsl(var(--border))",
            }}
          />
          <Legend />
          <Bar dataKey="tasks" name="Tâches totales" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} />
          <Bar dataKey="completed" name="Tâches complétées" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

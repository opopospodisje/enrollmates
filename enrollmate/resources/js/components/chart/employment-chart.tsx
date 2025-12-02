import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

type AlumniStats = {
  stats: string
  total: number
}

type AlumniChartProps = {
  alumniStats: AlumniStats[]
}

export function AlumniEmploymentKPI({ alumniStats }: AlumniChartProps) {
  const total = alumniStats.reduce((sum, s) => sum + s.total, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alumni Employment Overview</CardTitle>
        <p className="text-sm text-muted-foreground">
          Total Alumni: <span className="font-semibold">{total}</span>
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {alumniStats.map(({ stats, total: count }) => {
          const percentage = total > 0 ? Math.round((count / total) * 100) : 0
          return (
            <div key={stats} className="space-y-1">
              <div className="flex justify-between text-sm font-medium">
                <span className="capitalize">{stats}</span>
                <span>{percentage}%</span>
              </div>
              <Progress value={percentage} className="h-2" />
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

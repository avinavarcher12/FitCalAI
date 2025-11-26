import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Flame, TrendingUp } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: typeof Activity;
  trend?: string;
}

function StatCard({ title, value, subtitle, icon: Icon, trend }: StatCardProps) {
  return (
    <Card className="hover-elevate">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="w-5 h-5 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-medium" data-testid={`stat-${title.toLowerCase().replace(/\s+/g, '-')}`}>
          {value}
        </div>
        <div className="flex items-center gap-1 mt-1">
          {trend && (
            <TrendingUp className="w-3 h-3 text-chart-1" />
          )}
          <p className="text-xs text-muted-foreground">
            {subtitle}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardStats() {
  //todo: remove mock functionality
  const stats = [
    {
      title: "BMI Status",
      value: "22.4",
      subtitle: "Normal range",
      icon: Activity,
      trend: "stable"
    },
    {
      title: "Weekly Calories",
      value: "12,450",
      subtitle: "Avg 1,779/day",
      icon: Flame,
      trend: "up"
    },
    {
      title: "Workouts",
      value: "5/7",
      subtitle: "This week",
      icon: Activity,
      trend: "up"
    }
  ];

  return (
    <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}

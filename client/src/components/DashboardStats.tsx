import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Flame, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardData {
  bmi: { value: number; category: string } | null;
  weeklyCalories: number;
  avgDailyCalories: number;
  workoutsThisWeek: number;
}

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: typeof Activity;
  trend?: boolean;
  isLoading?: boolean;
}

function StatCard({ title, value, subtitle, icon: Icon, trend, isLoading }: StatCardProps) {
  if (isLoading) {
    return (
      <Card className="hover-elevate">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-5 w-5 rounded" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-16 mb-2" />
          <Skeleton className="h-3 w-20" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover-elevate">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
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
  const { data, isLoading } = useQuery<DashboardData>({
    queryKey: ["/api/stats/dashboard"],
    refetchInterval: 30000
  });

  const stats = [
    {
      title: "BMI Status",
      value: data?.bmi?.value?.toString() || "—",
      subtitle: data?.bmi?.category || "Not calculated yet",
      icon: Activity,
      trend: !!data?.bmi
    },
    {
      title: "Weekly Calories",
      value: data?.weeklyCalories?.toLocaleString() || "0",
      subtitle: `Avg ${data?.avgDailyCalories || 0}/day`,
      icon: Flame,
      trend: (data?.weeklyCalories || 0) > 0
    },
    {
      title: "Workouts",
      value: `${data?.workoutsThisWeek || 0}/7`,
      subtitle: "This week",
      icon: Activity,
      trend: (data?.workoutsThisWeek || 0) > 0
    }
  ];

  return (
    <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} isLoading={isLoading} />
      ))}
    </div>
  );
}

"use client";

import { TrendingDownIcon, TrendingUpIcon, Heart, Activity, Footprints, Clock } from "lucide-react"
import { useDashboardStats } from "@/hooks/use-sensor-data"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function SectionCards() {
  const { stats, loading, error } = useDashboardStats();

  if (error) {
    return (
      <div className="px-4 lg:px-6">
        <div className="text-red-500 text-sm">Error loading data: {error}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 px-4 lg:px-6">
      {/* Heart Rate Card - Full Width */}
      <Card className="@container/card shadow-xs bg-gradient-to-t from-primary/5 to-card dark:bg-card">
        <CardHeader className="relative">
          <CardDescription className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-red-600" />
            Average Heart Rate
          </CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {loading ? "..." : `${stats?.avgHeartRate || 0} BPM`}
          </CardTitle>
          <div className="absolute right-4 top-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              {(stats?.heartRateTrend || 0) >= 0 ? (
                <TrendingUpIcon className="size-3" />
              ) : (
                <TrendingDownIcon className="size-3" />
              )}
              {Math.abs(stats?.heartRateTrend || 0).toFixed(1)}%
            </Badge>
          </div>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {(stats?.heartRateTrend || 0) >= 0 ? "Trending up" : "Trending down"} in recent readings
            {(stats?.heartRateTrend || 0) >= 0 ? <TrendingUpIcon className="size-4" /> : <TrendingDownIcon className="size-4" />}
          </div>
          <div className="text-muted-foreground">
            Based on last 100 readings
          </div>
        </CardFooter>
      </Card>

      {/* Other KPIs in one line */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* SpO2 Card */}
        <Card className="@container/card shadow-xs bg-gradient-to-t from-primary/5 to-card dark:bg-card">
          <CardHeader className="relative">
            <CardDescription className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-600" />
              Blood Oxygen Level
            </CardDescription>
            <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
              {loading ? "..." : `${stats?.avgSpo2 || 0}%`}
            </CardTitle>
            <div className="absolute right-4 top-4">
              <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
                {(stats?.spo2Trend || 0) >= 0 ? (
                  <TrendingUpIcon className="size-3" />
                ) : (
                  <TrendingDownIcon className="size-3" />
                )}
                {Math.abs(stats?.spo2Trend || 0).toFixed(1)}%
              </Badge>
            </div>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              {(stats?.spo2Trend || 0) >= 0 ? "Improving" : "Decrease"}
              {(stats?.spo2Trend || 0) >= 0 ? <TrendingUpIcon className="size-4" /> : <TrendingDownIcon className="size-4" />}
            </div>
            <div className="text-muted-foreground">
              SpO2 monitoring
            </div>
          </CardFooter>
        </Card>

        {/* Steps Card */}
        <Card className="@container/card shadow-xs bg-gradient-to-t from-primary/5 to-card dark:bg-card">
          <CardHeader className="relative">
            <CardDescription className="flex items-center gap-2">
              <Footprints className="h-4 w-4 text-green-600" />
              Total Steps
            </CardDescription>
            <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
              {loading ? "..." : (stats?.totalSteps || 0).toLocaleString()}
            </CardTitle>
            <div className="absolute right-4 top-4">
              <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
                {(stats?.stepsTrend || 0) >= 0 ? (
                  <TrendingUpIcon className="size-3" />
                ) : (
                  <TrendingDownIcon className="size-3" />
                )}
                {Math.abs(stats?.stepsTrend || 0).toFixed(1)}%
              </Badge>
            </div>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              {(stats?.stepsTrend || 0) >= 0 ? "More active" : "Less active"}
              {(stats?.stepsTrend || 0) >= 0 ? <TrendingUpIcon className="size-4" /> : <TrendingDownIcon className="size-4" />}
            </div>
            <div className="text-muted-foreground">
              Gait tracking
            </div>
          </CardFooter>
        </Card>

        {/* Active Duration Card */}
        <Card className="@container/card shadow-xs bg-gradient-to-t from-primary/5 to-card dark:bg-card">
          <CardHeader className="relative">
            <CardDescription className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-purple-600" />
              Active Duration
            </CardDescription>
            <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
              {loading ? "..." : `${stats?.activeDuration || 0} min`}
            </CardTitle>
            <div className="absolute right-4 top-4">
              <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
                <Activity className="size-3" />
                Live
              </Badge>
            </div>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              Real-time monitoring
            </div>
            <div className="text-muted-foreground">
              Session tracking
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

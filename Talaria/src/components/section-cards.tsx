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
    <div className="px-4 lg:px-6">
      {/* All KPIs in one line */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Heart Rate Card */}
        <Card className="@container/card shadow-xs bg-gradient-to-t from-primary/5 to-card dark:bg-card">
          <CardHeader className="relative pb-2">
            <CardDescription className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-red-600" />
              Avg Heart Rate
            </CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums">
              {loading ? "..." : `${stats?.avgHeartRate || 0}`}
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
          <CardFooter className="flex-col items-start gap-1 text-sm pt-0">
            <div className="text-muted-foreground text-xs">
              BPM
            </div>
          </CardFooter>
        </Card>

        {/* SpO2 Card */}
        <Card className="@container/card shadow-xs bg-gradient-to-t from-primary/5 to-card dark:bg-card">
          <CardHeader className="relative pb-2">
            <CardDescription className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-600" />
              Blood Oxygen
            </CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums">
              {loading ? "..." : `${stats?.avgSpo2 || 0}`}
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
          <CardFooter className="flex-col items-start gap-1 text-sm pt-0">
            <div className="text-muted-foreground text-xs">
              SpO2 %
            </div>
          </CardFooter>
        </Card>

        {/* Steps Card */}
        <Card className="@container/card shadow-xs bg-gradient-to-t from-primary/5 to-card dark:bg-card">
          <CardHeader className="relative pb-2">
            <CardDescription className="flex items-center gap-2">
              <Footprints className="h-4 w-4 text-green-600" />
              Total Steps
            </CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums">
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
          <CardFooter className="flex-col items-start gap-1 text-sm pt-0">
            <div className="text-muted-foreground text-xs">
              Gait tracking
            </div>
          </CardFooter>
        </Card>

        {/* Active Duration Card */}
        <Card className="@container/card shadow-xs bg-gradient-to-t from-primary/5 to-card dark:bg-card">
          <CardHeader className="relative pb-2">
            <CardDescription className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-purple-600" />
              Active Duration
            </CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums">
              {loading ? "..." : `${stats?.activeDuration || 0}`}
            </CardTitle>
            <div className="absolute right-4 top-4">
              <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
                <Activity className="size-3" />
                Live
              </Badge>
            </div>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-sm pt-0">
            <div className="text-muted-foreground text-xs">
              Minutes
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

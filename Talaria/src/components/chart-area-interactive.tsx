"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { useIsMobile } from "@/hooks/use-mobile"
import { useChartDataWithTimeFilter } from "@/hooks/use-sensor-data"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

const chartConfig = {
  heartRate: {
    label: "Heart Rate",
    color: "hsl(var(--chart-1))",
  },
  spo2: {
    label: "SpO2",
    color: "hsl(var(--chart-2))",
  },
  steps: {
    label: "Steps",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("7h")
  const [metricType, setMetricType] = React.useState<"heartRate" | "spo2" | "steps">("heartRate")
  
  const { chartData, loading, error } = useChartDataWithTimeFilter(timeRange)

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("1h")
    }
  }, [isMobile])

  if (error) {
    return (
      <Card className="@container/card">
        <CardHeader>
          <CardTitle>Sensor Data</CardTitle>
          <CardDescription className="text-red-500">
            Error loading chart data: {error}
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const getChartTitle = () => {
    switch (metricType) {
      case "heartRate":
        return "Heart Rate Over Time"
      case "spo2":
        return "Blood Oxygen Level (SpO2)"
      case "steps":
        return "Steps Per Reading"
      default:
        return "Sensor Data"
    }
  }

  const getYAxisDomain = (): [number | string, number | string] => {
    switch (metricType) {
      case "heartRate":
        return [40, 200]
      case "spo2":
        return [85, 100]
      case "steps":
        return [0, 'auto']
      default:
        return ['auto', 'auto']
    }
  }

  const getChartColor = () => {
    switch (metricType) {
      case "heartRate":
        return "var(--color-heartRate)"
      case "spo2":
        return "var(--color-spo2)"
      case "steps":
        return "var(--color-steps)"
      default:
        return "var(--color-heartRate)"
    }
  }

  return (
    <Card className="@container/card">
      <CardHeader className="relative">
        <CardTitle>{getChartTitle()}</CardTitle>
        <CardDescription>
          <span className="@[540px]/card:block hidden">
            Real-time sensor data from Firebase
          </span>
          <span className="@[540px]/card:hidden">Real-time data</span>
        </CardDescription>
        <div className="absolute right-4 top-4 flex gap-2">
          <Select value={metricType} onValueChange={(value) => setMetricType(value as "heartRate" | "spo2" | "steps")}>
            <SelectTrigger className="w-32" aria-label="Select metric">
              <SelectValue placeholder="Metric" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="heartRate" className="rounded-lg">Heart Rate</SelectItem>
              <SelectItem value="spo2" className="rounded-lg">SpO2</SelectItem>
              <SelectItem value="steps" className="rounded-lg">Steps</SelectItem>
            </SelectContent>
          </Select>
          <ToggleGroup type="single" value={timeRange} onValueChange={setTimeRange} variant="outline" className="@[767px]/card:flex hidden">
            <ToggleGroupItem value="1h" className="h-8 px-2.5">Last Hour</ToggleGroupItem>
            <ToggleGroupItem value="7h" className="h-8 px-2.5">Last 7 Hours</ToggleGroupItem>
            <ToggleGroupItem value="7d" className="h-8 px-2.5">Last 7 Days</ToggleGroupItem>
            <ToggleGroupItem value="30d" className="h-8 px-2.5">Last 30 Days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="@[767px]/card:hidden flex w-32" aria-label="Select a value">
              <SelectValue placeholder="Last 7 Hours" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="1h" className="rounded-lg">Last Hour</SelectItem>
              <SelectItem value="7h" className="rounded-lg">Last 7 Hours</SelectItem>
              <SelectItem value="7d" className="rounded-lg">Last 7 Days</SelectItem>
              <SelectItem value="30d" className="rounded-lg">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {loading ? (
          <div className="flex h-[250px] items-center justify-center text-muted-foreground">Loading chart data...</div>
        ) : chartData.length === 0 ? (
          <div className="flex h-[250px] items-center justify-center text-muted-foreground">No sensor data available. Check Firebase connection.</div>
        ) : (
          <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="fillMetric" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={getChartColor()} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={getChartColor()} stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis 
                dataKey="timestamp" 
                tickLine={false} 
                axisLine={false} 
                tickMargin={8} 
                minTickGap={32} 
                tickFormatter={(value) => {
                  const date = new Date(parseInt(value));
                  return date.toLocaleTimeString("en-US", { 
                    hour: "2-digit", 
                    minute: "2-digit" 
                  });
                }} 
              />
              <YAxis domain={getYAxisDomain()} tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltip 
                cursor={false} 
                content={
                  <ChartTooltipContent 
                    labelFormatter={(value) => {
                      return new Date(parseInt(value)).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      });
                    }} 
                    indicator="dot" 
                  />
                } 
              />
              <Area dataKey={metricType} type="natural" fill="url(#fillMetric)" stroke={getChartColor()} strokeWidth={2} />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}

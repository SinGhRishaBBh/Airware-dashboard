"use client"

import { BarChart3, HelpCircle, TrendingUp } from "lucide-react"

import { getAdjustedMetrics } from "@/lib/ml-models"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Button } from "@/components/ui/button"

interface ModelMetricsCardProps {
  modelId: string
  dataPoints: number
}

export default function ModelMetricsCard({ modelId, dataPoints }: ModelMetricsCardProps) {
  const metrics = getAdjustedMetrics(modelId, dataPoints)

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Model Performance</CardTitle>
        <CardDescription>Key metrics for the selected prediction model</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Confidence Level</span>
              <MetricInfoCard
                title="Confidence Level"
                description="Indicates how confident the model is in its predictions. Higher values mean more reliable forecasts."
              />
            </div>
            <span className="text-sm font-medium">{metrics.confidence}%</span>
          </div>
          <Progress value={metrics.confidence} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium">RMSE</span>
              <MetricInfoCard
                title="Root Mean Square Error"
                description="Measures the average magnitude of prediction errors. Lower values indicate better accuracy."
              />
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
              <span className="text-xl font-bold">{metrics.rmse}</span>
            </div>
            <p className="text-xs text-muted-foreground">Average prediction error</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium">R² Score</span>
              <MetricInfoCard
                title="R² Score"
                description="Coefficient of determination that represents how well the model explains the variance in the data. Values closer to 1 are better."
              />
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-xl font-bold">{metrics.r2}</span>
            </div>
            <p className="text-xs text-muted-foreground">Goodness of fit</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium">MAE</span>
              <MetricInfoCard
                title="Mean Absolute Error"
                description="Average absolute difference between predicted and actual values. Lower values indicate better accuracy."
              />
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
              <span className="text-xl font-bold">{metrics.mae}</span>
            </div>
            <p className="text-xs text-muted-foreground">Average absolute error</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium">Data Points</span>
              <MetricInfoCard
                title="Data Points"
                description="Number of data points used for training and validation. More data generally leads to better model performance."
              />
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
              <span className="text-xl font-bold">{dataPoints}</span>
            </div>
            <p className="text-xs text-muted-foreground">Training samples</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function MetricInfoCard({ title, description }: { title: string; description: string }) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="ghost" size="icon" className="h-5 w-5">
          <HelpCircle className="h-3.5 w-3.5" />
          <span className="sr-only">{title} Info</span>
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="space-y-2">
          <h4 className="font-medium">{title}</h4>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

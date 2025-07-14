"use client"
import { Info } from "lucide-react"

import { availableModels, type ModelInfo } from "@/lib/ml-models"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

interface ModelSelectionProps {
  selectedModel: string
  onModelChange: (modelId: string) => void
  dataPoints: number
}

export default function ModelSelection({ selectedModel, onModelChange, dataPoints }: ModelSelectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Prediction Model</CardTitle>
        <CardDescription>Select the machine learning model for AQI predictions</CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedModel} onValueChange={onModelChange} className="space-y-4">
          {availableModels.map((model) => (
            <div key={model.id} className="flex items-start space-x-2">
              <RadioGroupItem value={model.id} id={model.id} className="mt-1" />
              <div className="grid gap-1.5 leading-none">
                <div className="flex items-center gap-2">
                  <Label htmlFor={model.id} className="font-medium">
                    {model.name}
                  </Label>
                  <ModelInfoHoverCard model={model} dataPoints={dataPoints} />
                </div>
                <p className="text-sm text-muted-foreground">{model.description}</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    Confidence: {getConfidence(model.id, dataPoints)}%
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    RMSE: {getAdjustedRMSE(model.id, dataPoints)}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    R²: {getAdjustedR2(model.id, dataPoints)}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  )
}

function ModelInfoHoverCard({ model, dataPoints }: { model: ModelInfo; dataPoints: number }) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="ghost" size="icon" className="h-5 w-5">
          <Info className="h-3.5 w-3.5" />
          <span className="sr-only">Model Info</span>
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="space-y-3">
          <h4 className="font-medium">{model.name}</h4>
          <p className="text-sm text-muted-foreground">{model.description}</p>

          <div className="space-y-1.5">
            <h5 className="text-sm font-medium">Strengths</h5>
            <ul className="text-xs text-muted-foreground space-y-1">
              {model.strengths.map((strength, i) => (
                <li key={i}>• {strength}</li>
              ))}
            </ul>
          </div>

          <div className="space-y-1.5">
            <h5 className="text-sm font-medium">Limitations</h5>
            <ul className="text-xs text-muted-foreground space-y-1">
              {model.limitations.map((limitation, i) => (
                <li key={i}>• {limitation}</li>
              ))}
            </ul>
          </div>

          <div className="space-y-1.5">
            <h5 className="text-sm font-medium">Performance Metrics</h5>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <p className="text-muted-foreground">MAE:</p>
                <p className="font-medium">{getAdjustedMAE(model.id, dataPoints)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">RMSE:</p>
                <p className="font-medium">{getAdjustedRMSE(model.id, dataPoints)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">R²:</p>
                <p className="font-medium">{getAdjustedR2(model.id, dataPoints)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Confidence:</p>
                <p className="font-medium">{getConfidence(model.id, dataPoints)}%</p>
              </div>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

// Helper functions to get adjusted metrics based on data points
function getConfidence(modelId: string, dataPoints: number): number {
  const baseConfidence = availableModels.find((m) => m.id === modelId)?.metrics.confidence || 80

  // Adjust confidence based on data quantity
  let confidenceAdjustment = 0
  if (dataPoints < 10) {
    confidenceAdjustment = -15
  } else if (dataPoints < 30) {
    confidenceAdjustment = -10
  } else if (dataPoints < 100) {
    confidenceAdjustment = -5
  } else if (dataPoints > 1000) {
    confidenceAdjustment = 5
  }

  // Model-specific adjustments
  if (modelId === "lstm" && dataPoints < 50) {
    confidenceAdjustment -= 10 // LSTM needs more data
  }
  if (modelId === "xgboost" && dataPoints > 1000) {
    confidenceAdjustment -= 2 // XGBoost doesn't benefit as much from very large datasets
  }

  return Math.min(99, Math.max(50, baseConfidence + confidenceAdjustment))
}

function getAdjustedMAE(modelId: string, dataPoints: number): string {
  const baseMAE = availableModels.find((m) => m.id === modelId)?.metrics.mae || 15
  const adjustmentFactor = dataPoints < 30 ? 1.2 : dataPoints < 100 ? 1.1 : dataPoints > 1000 ? 0.9 : 1
  return (baseMAE * adjustmentFactor).toFixed(2)
}

function getAdjustedRMSE(modelId: string, dataPoints: number): string {
  const baseRMSE = availableModels.find((m) => m.id === modelId)?.metrics.rmse || 20
  const adjustmentFactor = dataPoints < 30 ? 1.2 : dataPoints < 100 ? 1.1 : dataPoints > 1000 ? 0.9 : 1
  return (baseRMSE * adjustmentFactor).toFixed(2)
}

function getAdjustedR2(modelId: string, dataPoints: number): string {
  const baseR2 = availableModels.find((m) => m.id === modelId)?.metrics.r2 || 0.8
  const adjustmentFactor = dataPoints < 30 ? 1.2 : dataPoints < 100 ? 1.1 : dataPoints > 1000 ? 0.9 : 1
  return Math.min(0.99, baseR2 / adjustmentFactor).toFixed(2)
}

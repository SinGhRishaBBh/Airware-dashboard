"use client"

import { useEffect, useState } from "react"
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, XAxis, YAxis } from "recharts"

import { generatePredictions, type ModelPrediction } from "@/lib/ml-models"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"

interface AQIPredictionChartProps {
  city: string
  timeframe: string
  modelId: string
  data?: any[]
}

export default function AQIPredictionChart({ city, timeframe, modelId, data: propData }: AQIPredictionChartProps) {
  const [data, setData] = useState<ModelPrediction[]>([])
  const [loading, setLoading] = useState(true)
  const [hasActualData, setHasActualData] = useState(false)

  useEffect(() => {
    async function fetchPredictions() {
      setLoading(true)

      let parsedData: any[] = []
      if (propData) {
        parsedData = propData
      } else {
        // Try to get data from sessionStorage first
        const storedData = sessionStorage.getItem("aqiData")
        if (storedData) {
          try {
            parsedData = JSON.parse(storedData)
          } catch (error) {
            console.error("Error parsing stored data:", error)
          }
        }
      }

      // Generate predictions using the selected model
      const predictions = await generatePredictions(modelId, parsedData, timeframe, city)

      // Check if we have any actual data
      setHasActualData(predictions.some((p) => p.actual !== undefined))

      setData(predictions)
      setLoading(false)
    }

    fetchPredictions()
  }, [city, timeframe, modelId, propData])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Loading predictions...</p>
      </div>
    )
  }

  return (
    <ChartContainer
      config={{
        predicted: {
          label: "Predicted AQI",
          color: "hsl(var(--chart-1))",
        },
        actual: {
          label: "Actual AQI",
          color: "hsl(var(--chart-2))",
        },
      }}
      className="h-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} minTickGap={10} />
          <YAxis tickLine={false} axisLine={false} tickMargin={8} domain={[0, "dataMax + 50"]} tickCount={6} />
          {hasActualData && <Legend />}
          <ChartTooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid gap-2">
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">Date</span>
                        <span className="font-bold text-sm">{payload[0].payload.date}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">Predicted AQI</span>
                        <span className="font-bold text-sm" style={{ color: "var(--color-predicted)" }}>
                          {payload[0].value}
                        </span>
                      </div>
                      {payload[0].payload.actual !== undefined && (
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">Actual AQI</span>
                          <span className="font-bold text-sm" style={{ color: "var(--color-actual)" }}>
                            {payload[0].payload.actual}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              }
              return null
            }}
          />
          <Area
            type="monotone"
            dataKey="predicted"
            stroke="var(--color-predicted)"
            fill="var(--color-predicted)"
            fillOpacity={0.2}
            strokeWidth={2}
            activeDot={{ r: 6, strokeWidth: 0 }}
            name="Predicted AQI"
          />
          {hasActualData && (
            <Area
              type="monotone"
              dataKey="actual"
              stroke="var(--color-actual)"
              fill="var(--color-actual)"
              fillOpacity={0.1}
              strokeWidth={2}
              strokeDasharray="3 3"
              activeDot={{ r: 6, strokeWidth: 0 }}
              name="Actual AQI"
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

"use client"

import { useState } from "react"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"

import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PollutantComparisonChartProps {
  cities: string[]
  timeframe: string
}

export default function PollutantComparisonChart({ cities, timeframe }: PollutantComparisonChartProps) {
  const [selectedPollutant, setSelectedPollutant] = useState("pm25")

  // Generate pollutant comparison data based on cities and timeframe
  const generateData = () => {
    // Base pollutant values for different cities
    const basePollutants = {
      delhi: { pm25: 120, pm10: 150, no2: 65, so2: 15, o3: 30, co: 1.2 },
      mumbai: { pm25: 60, pm10: 90, no2: 40, so2: 10, o3: 25, co: 0.9 },
      bangalore: { pm25: 30, pm10: 50, no2: 25, so2: 8, o3: 20, co: 0.7 },
      chennai: { pm25: 70, pm10: 100, no2: 45, so2: 12, o3: 28, co: 1.0 },
      kolkata: { pm25: 90, pm10: 120, no2: 55, so2: 14, o3: 32, co: 1.1 },
      hyderabad: { pm25: 50, pm10: 80, no2: 35, so2: 10, o3: 22, co: 0.8 },
      pune: { pm25: 55, pm10: 85, no2: 38, so2: 11, o3: 24, co: 0.9 },
      ahmedabad: { pm25: 65, pm10: 95, no2: 42, so2: 13, o3: 26, co: 1.0 },
    }

    const data = []

    // Create data for each city
    cities.forEach((city) => {
      const cityData = {
        city: city.charAt(0).toUpperCase() + city.slice(1),
        ...basePollutants[city as keyof typeof basePollutants],
      }

      // Add some randomness
      Object.keys(cityData).forEach((key) => {
        if (key !== "city") {
          const randomFactor = (Math.random() - 0.5) * 0.2
          cityData[key as keyof typeof cityData] =
            typeof cityData[key as keyof typeof cityData] === "number"
              ? Math.round((cityData[key as keyof typeof cityData] as number) * (1 + randomFactor) * 10) / 10
              : cityData[key as keyof typeof cityData]
        }
      })

      data.push(cityData)
    })

    return data
  }

  const data = generateData()

  // Create config object for ChartContainer
  const createConfig = () => {
    const config: Record<string, { label: string; color: string }> = {}

    const colors = [
      "hsl(var(--chart-1))",
      "hsl(var(--chart-2))",
      "hsl(var(--chart-3))",
      "hsl(var(--chart-4))",
      "hsl(var(--chart-5))",
    ]

    cities.forEach((city, index) => {
      config[city] = {
        label: city.charAt(0).toUpperCase() + city.slice(1),
        color: colors[index % colors.length],
      }
    })

    return config
  }

  const pollutantLabels = {
    pm25: "PM2.5 (µg/m³)",
    pm10: "PM10 (µg/m³)",
    no2: "NO₂ (ppb)",
    so2: "SO₂ (ppb)",
    o3: "O₃ (ppb)",
    co: "CO (ppm)",
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Select value={selectedPollutant} onValueChange={setSelectedPollutant}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select pollutant" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pm25">PM2.5</SelectItem>
            <SelectItem value="pm10">PM10</SelectItem>
            <SelectItem value="no2">NO₂</SelectItem>
            <SelectItem value="so2">SO₂</SelectItem>
            <SelectItem value="o3">O₃</SelectItem>
            <SelectItem value="co">CO</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ChartContainer config={createConfig()} className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="city" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              label={{
                value: pollutantLabels[selectedPollutant as keyof typeof pollutantLabels],
                angle: -90,
                position: "insideLeft",
                style: { textAnchor: "middle" },
              }}
            />
            <ChartTooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="grid gap-2">
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">City</span>
                          <span className="font-bold text-sm">{payload[0].payload.city}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            {selectedPollutant.toUpperCase()}
                          </span>
                          <span className="font-bold text-sm" style={{ color: payload[0].color }}>
                            {payload[0].value}{" "}
                            {selectedPollutant === "pm25" || selectedPollutant === "pm10"
                              ? "µg/m³"
                              : selectedPollutant === "co"
                                ? "ppm"
                                : "ppb"}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                }
                return null
              }}
            />
            <Bar dataKey={selectedPollutant} fill="hsl(var(--chart-1))" />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>

      <div className="rounded-lg border p-4">
        <h3 className="mb-2 text-sm font-medium">
          {pollutantLabels[selectedPollutant as keyof typeof pollutantLabels]} Comparison
        </h3>
        <p className="text-sm text-muted-foreground">
          {selectedPollutant === "pm25" &&
            "Fine particulate matter with diameter less than 2.5 micrometers. Can penetrate deep into the lungs and bloodstream."}
          {selectedPollutant === "pm10" &&
            "Coarse particulate matter with diameter less than 10 micrometers. Can cause respiratory issues."}
          {selectedPollutant === "no2" &&
            "Nitrogen dioxide, primarily from vehicle exhaust and power plants. Can cause inflammation of airways."}
          {selectedPollutant === "so2" &&
            "Sulfur dioxide, primarily from industrial processes. Can cause respiratory problems and acid rain."}
          {selectedPollutant === "o3" &&
            "Ozone, formed by chemical reactions between oxides of nitrogen and VOCs. Can trigger asthma and reduce lung function."}
          {selectedPollutant === "co" &&
            "Carbon monoxide, primarily from vehicle exhaust. Reduces oxygen delivery to organs and tissues."}
        </p>
      </div>
    </div>
  )
}

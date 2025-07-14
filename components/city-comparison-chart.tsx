"use client"

import { Line, LineChart, Legend, ResponsiveContainer, XAxis, YAxis } from "recharts"

import { ChartContainer, ChartTooltip } from "@/components/ui/chart"

interface CityComparisonChartProps {
  cities: string[]
  timeframe: string
}

export default function CityComparisonChart({ cities, timeframe }: CityComparisonChartProps) {
  // Generate comparison data based on cities and timeframe
  const generateData = () => {
    const data = []
    const days = timeframe === "week" ? 7 : timeframe === "month" ? 30 : 365
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Base AQI values for different cities
    const baseAqi = {
      delhi: 180,
      mumbai: 95,
      bangalore: 45,
      chennai: 120,
      kolkata: 135,
      hyderabad: 85,
      pune: 90,
      ahmedabad: 110,
    }

    // Generate data points
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate)
      date.setDate(date.getDate() + i)

      const dataPoint: any = {
        date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      }

      // Add AQI for each city
      cities.forEach((city) => {
        // Add some randomness to the historical data
        const randomFactor = Math.sin(i * 0.2) * 20 + (Math.random() - 0.5) * 15

        // Calculate AQI
        let aqi = baseAqi[city as keyof typeof baseAqi] + randomFactor

        // Ensure AQI is within reasonable bounds
        aqi = Math.max(20, Math.min(500, aqi))

        dataPoint[city] = Math.round(aqi)
      })

      data.push(dataPoint)
    }

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

  return (
    <ChartContainer config={createConfig()} className="h-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 10,
          }}
        >
          <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} minTickGap={30} />
          <YAxis tickLine={false} axisLine={false} tickMargin={8} domain={[0, "dataMax + 50"]} tickCount={6} />
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
                      <div className="grid grid-cols-2 gap-2">
                        {payload.map((entry, index) => (
                          <div key={`tooltip-${index}`} className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              {entry.name.charAt(0).toUpperCase() + entry.name.slice(1)}
                            </span>
                            <span className="font-bold text-sm" style={{ color: entry.color }}>
                              {entry.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              }
              return null
            }}
          />
          <Legend />
          {cities.map((city, index) => (
            <Line
              key={city}
              type="monotone"
              dataKey={city}
              stroke={`var(--color-${city})`}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

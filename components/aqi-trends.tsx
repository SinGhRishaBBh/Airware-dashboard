"use client"

import { useEffect, useState } from "react"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

import { fetchAQIData, fetchHistoricalAQIData } from "@/lib/aqi-api"

interface AQITrendsProps {
  city: string
}

export default function AQITrends({ city }: AQITrendsProps) {
  const [trends, setTrends] = useState<Array<{ date: string; aqi: number }>>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Try to get trend data from the database
        const res = await fetch(`/api/data/city-trends?city=${encodeURIComponent(city)}`)
        if (!res.ok) throw new Error("API error")
        const dbResult = await res.json()
        if (dbResult.success && Array.isArray(dbResult.trends) && dbResult.trends.length > 0) {
          setTrends(dbResult.trends)
          setError(null)
        } else {
          // Fallback to historical API
          const history = await fetchHistoricalAQIData(city.toLowerCase(), 7)
          if (history && history.length > 0) {
            setTrends(history.map((d, i) => ({
              date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
              aqi: d.aqi,
            })))
          } else {
            // Fallback to mock data if no history available
            const data = await fetchAQIData(city.toLowerCase())
            const mockTrends = Array.from({ length: 7 }, (_, i) => ({
              date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
              aqi: Math.floor(data.aqi * (0.8 + Math.random() * 0.4)),
            }))
            setTrends(mockTrends)
          }
          setError(null)
        }
      } catch (err) {
        console.error("Error fetching AQI trends:", err)
        setError("Failed to fetch AQI trends")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 5 * 60 * 1000) // Update every 5 minutes
    return () => clearInterval(interval)
  }, [city])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">Loading AQI trends...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-sm text-red-500">
        {error}
      </div>
    )
  }

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={trends} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                          Date
                        </span>
                        <span className="font-bold text-muted-foreground">
                          {data.date}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                          AQI
                        </span>
                        <span className="font-bold text-muted-foreground">
                          {data.aqi}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              }
              return null
            }}
          />
          <Line type="monotone" dataKey="aqi" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

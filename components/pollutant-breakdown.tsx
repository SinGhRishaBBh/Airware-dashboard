"use client"

import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchAQIData } from "@/lib/aqi-api"

interface WeatherBreakdownProps {
  city: string
  data?: any[]
}

export default function WeatherBreakdown({ city, data: propData }: WeatherBreakdownProps) {
  const [weather, setWeather] = useState<{
    temperature: number
    humidity: number
    windSpeed: number
    icon: string
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (propData && Array.isArray(propData) && propData.length > 0) {
      // Use the most recent weather info from uploaded data
      const last = propData[propData.length - 1]
      if (last && last.temperature !== undefined && last.humidity !== undefined && last.windSpeed !== undefined && last.icon) {
        setWeather({
          temperature: last.temperature,
          humidity: last.humidity,
          windSpeed: last.windSpeed,
          icon: last.icon,
        })
        setError(null)
        setLoading(false)
        return
      }
    }
    const fetchData = async () => {
      setLoading(true)
      try {
        const data = await fetchAQIData(city.toLowerCase())
        setWeather(data.weather)
        setError(null)
      } catch (err) {
        console.error("Error fetching weather data:", err)
        setError("Failed to fetch weather data")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
    const interval = setInterval(fetchData, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [city, propData])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">Loading weather data...</p>
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

  if (!weather) {
    return null
  }

  return (
    <Card>
      <CardContent>
        <div className="flex flex-col items-center gap-4 p-4">
          <img
            src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
            alt=""
            className="w-16 h-16"
          />
          <div className="flex flex-col gap-2 text-lg">
            <span><b>Temperature:</b> {weather.temperature}&deg;C</span>
            <span><b>Humidity:</b> {weather.humidity}%</span>
            <span><b>Wind Speed:</b> {weather.windSpeed} m/s</span>
            <span><b>Weather Code:</b> {weather.icon}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

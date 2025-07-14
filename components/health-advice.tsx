"use client"

import { useEffect, useState, useCallback } from "react"
import { Activity, AlertCircle, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { fetchAQIData } from "@/lib/aqi-api"

interface HealthAdviceProps {
  city?: string
}

interface AQICategory {
  name: string
  color: string
  bgColor: string
  textColor: string
  advice: string
  sensitiveAdvice: string
  generalAdvice: string
}

const aqiCategories: AQICategory[] = [
  {
    name: "Good",
    color: "bg-green-500",
    bgColor: "bg-green-100",
    textColor: "text-green-700",
    advice: "Air quality is satisfactory, and air pollution poses little or no risk.",
    sensitiveAdvice: "No special precautions needed.",
    generalAdvice: "Enjoy your usual outdoor activities.",
  },
  {
    name: "Moderate",
    color: "bg-yellow-500",
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-700",
    advice: "Air quality is acceptable. However, there may be a risk for some people.",
    sensitiveAdvice: "Consider reducing prolonged or heavy outdoor exertion.",
    generalAdvice: "Most people can continue their normal activities.",
  },
  {
    name: "Unhealthy for Sensitive Groups",
    color: "bg-orange-500",
    bgColor: "bg-orange-100",
    textColor: "text-orange-700",
    advice: "Members of sensitive groups may experience health effects.",
    sensitiveAdvice: "Reduce prolonged or heavy outdoor exertion. Take more breaks during outdoor activities.",
    generalAdvice: "Consider reducing prolonged or heavy outdoor exertion if you experience symptoms.",
  },
  {
    name: "Unhealthy",
    color: "bg-red-500",
    bgColor: "bg-red-100",
    textColor: "text-red-700",
    advice: "Everyone may begin to experience health effects.",
    sensitiveAdvice: "Avoid prolonged or heavy outdoor exertion. Move activities indoors.",
    generalAdvice: "Reduce prolonged or heavy outdoor exertion. Take more breaks during outdoor activities.",
  },
  {
    name: "Very Unhealthy",
    color: "bg-purple-500",
    bgColor: "bg-purple-100",
    textColor: "text-purple-700",
    advice: "Health warnings of emergency conditions. The entire population is more likely to be affected.",
    sensitiveAdvice: "Avoid all outdoor exertion. Stay indoors and keep windows closed.",
    generalAdvice: "Avoid prolonged or heavy outdoor exertion. Consider moving activities indoors.",
  },
  {
    name: "Hazardous",
    color: "bg-red-700",
    bgColor: "bg-red-100",
    textColor: "text-red-700",
    advice: "Health alert: everyone may experience more serious health effects.",
    sensitiveAdvice: "Stay indoors and keep windows closed. Use air purifiers if available.",
    generalAdvice: "Avoid all outdoor activities. Stay indoors and keep windows closed.",
  },
]

export default function HealthAdvice({ city = "Delhi" }: HealthAdviceProps) {
  const [aqi, setAqi] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchData = useCallback(async () => {
    if (!city) {
      setError("City is required")
      setLoading(false)
      return
    }

    try {
      const data = await fetchAQIData(city.toLowerCase())
      setAqi(data.aqi)
      setError(null)
      setLastUpdated(new Date())
    } catch (err) {
      console.error("Error fetching AQI data:", err)
      setError("Failed to fetch AQI data")
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }, [city])

  // Reset state when city changes
  useEffect(() => {
    setAqi(null)
    setError(null)
    setLoading(true)
    fetchData()
  }, [city, fetchData])

  // Set up polling for updates
  useEffect(() => {
    const interval = setInterval(fetchData, 5 * 60 * 1000) // Update every 5 minutes
    return () => clearInterval(interval)
  }, [fetchData])

  const getAQICategory = (value: number): AQICategory => {
    if (value <= 50) return aqiCategories[0]
    if (value <= 100) return aqiCategories[1]
    if (value <= 150) return aqiCategories[2]
    if (value <= 200) return aqiCategories[3]
    if (value <= 300) return aqiCategories[4]
    return aqiCategories[5]
  }

  if (loading && !isRefreshing) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">Loading health advice for {city}...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{error}</p>
          <Button variant="outline" className="mt-4" onClick={fetchData}>
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  const category = aqi ? getAQICategory(aqi) : aqiCategories[0]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Health Advice for {city}
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          className={isRefreshing ? "animate-spin" : ""}
          onClick={() => {
            setIsRefreshing(true)
            fetchData()
          }}
          disabled={isRefreshing}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className={`rounded-lg border p-4 ${category.bgColor}`}>
          <h3 className="mb-2 text-sm font-medium">Current AQI: {aqi}</h3>
          <p className={`text-sm font-medium ${category.textColor}`}>{category.name}</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <h3 className="mb-2 text-sm font-medium">General Information</h3>
            <p className="text-sm text-muted-foreground">{category.advice}</p>
          </div>
          
          <div>
            <h3 className="mb-2 text-sm font-medium">For Sensitive Groups</h3>
            <p className="text-sm text-muted-foreground">{category.sensitiveAdvice}</p>
          </div>
          
          <div>
            <h3 className="mb-2 text-sm font-medium">For General Public</h3>
            <p className="text-sm text-muted-foreground">{category.generalAdvice}</p>
          </div>
        </div>

        {lastUpdated && (
          <p className="text-xs text-muted-foreground">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

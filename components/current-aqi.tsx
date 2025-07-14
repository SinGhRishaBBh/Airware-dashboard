"use client"

import { useEffect, useState, useCallback } from "react"
import { Check, ChevronsUpDown, MapPin, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"

const cities = [
  { name: "Delhi", aqi: 150 },
  { name: "Mumbai", aqi: 80 },
  { name: "Bangalore", aqi: 65 },
  { name: "Chennai", aqi: 95 },
  { name: "Kolkata", aqi: 110 },
  { name: "Hyderabad", aqi: 75 },
  { name: "Pune", aqi: 85 },
  { name: "Ahmedabad", aqi: 120 },
  { name: "Visakhapatnam", aqi: 70 },
  { name: "Lucknow", aqi: 130 },
  { name: "Kanpur", aqi: 140 },
  { name: "Nagpur", aqi: 90 },
  { name: "Indore", aqi: 85 },
  { name: "Thane", aqi: 80 },
  { name: "Bhopal", aqi: 95 },
  { name: "Patna", aqi: 125 },
  { name: "Vadodara", aqi: 100 },
  { name: "Ghaziabad", aqi: 145 },
  { name: "Ludhiana", aqi: 125 },
].sort((a, b) => a.name.localeCompare(b.name))

interface CurrentAQIProps {
  onCityChange?: (city: string) => void
}

export default function CurrentAQI({ onCityChange }: CurrentAQIProps) {
  const [aqi, setAqi] = useState<number | null>(null)
  const [location, setLocation] = useState("Delhi")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<string>("")
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [weather, setWeather] = useState<{ temperature: number; humidity: number; windSpeed: number; icon: string } | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/data/city-trends?city=${encodeURIComponent(location)}`)
      if (!res.ok) throw new Error("API error")
      const result = await res.json()
      if (result.success && result.trends && result.trends.length > 0) {
        // Use the latest trend as current AQI
        const latest = result.trends[result.trends.length - 1]
        setAqi(latest.aqi)
        setWeather(null) // or set weather if available in your trends
        setLastUpdated(latest.date)
      } else {
        throw new Error("No AQI data available")
      }
    } catch (error) {
      console.error("Error fetching AQI data:", error)
      setError("Failed to fetch AQI data")
      // Fallback to static data if API fails
      const city = cities.find(c => c.name === location)
      if (city) {
        setAqi(city.aqi)
        setWeather(null)
      }
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }, [location])

  // Initial data fetch
  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Set up polling every 5 minutes
  useEffect(() => {
    const interval = setInterval(fetchData, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [fetchData])

  // Function to determine AQI category and color
  const getAQIInfo = (value: number) => {
    if (value <= 50) {
      return { category: "Good", color: "bg-green-500", textColor: "text-green-500" }
    } else if (value <= 100) {
      return { category: "Moderate", color: "bg-yellow-500", textColor: "text-yellow-500" }
    } else if (value <= 150) {
      return { category: "Unhealthy for Sensitive Groups", color: "bg-orange-500", textColor: "text-orange-500" }
    } else if (value <= 200) {
      return { category: "Unhealthy", color: "bg-red-500", textColor: "text-red-500" }
    } else if (value <= 300) {
      return { category: "Very Unhealthy", color: "bg-purple-500", textColor: "text-purple-500" }
    } else {
      return { category: "Hazardous", color: "bg-rose-900", textColor: "text-rose-900" }
    }
  }

  const handleCitySelect = (cityName: string) => {
    setLocation(cityName)
    setOpen(false)
    onCityChange?.(cityName)
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    fetchData()
  }

  if (loading && aqi === null) {
    return (
      <div className="flex items-center justify-center h-24">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">Loading AQI data...</p>
        </div>
      </div>
    )
  }

  const aqiInfo = aqi !== null ? getAQIInfo(aqi) : null
  const progressPercentage = aqi !== null ? (aqi / 500) * 100 : 0

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[200px] justify-between"
            >
              <MapPin className="mr-2 h-4 w-4" />
              {location}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search city..." />
              <CommandEmpty>No city found.</CommandEmpty>
              <CommandGroup>
                {cities.map((city) => (
                  <CommandItem
                    key={city.name}
                    value={city.name}
                    onSelect={() => handleCitySelect(city.name)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        location === city.name ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {city.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
        <Button
          variant="ghost"
          size="icon"
          className={isRefreshing ? "animate-spin" : ""}
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {error && (
        <div className="text-sm text-red-500">
          {error}
        </div>
      )}

      {aqi !== null && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Current AQI</span>
            <span className={`font-bold text-xl ${aqiInfo?.textColor}`}>{aqi}</span>
          </div>
          <Progress 
            value={progressPercentage} 
            className={cn("h-2", aqiInfo?.color)}
          />
          <p className={`text-sm font-medium ${aqiInfo?.textColor}`}>{aqiInfo?.category}</p>
        </div>
      )}

      <p className="mt-1 text-xs text-muted-foreground">
        {lastUpdated ? `Last updated: ${lastUpdated}` : "Select a city to view AQI"}
      </p>
    </div>
  )
}

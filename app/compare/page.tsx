"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Download, Plus, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import CityComparisonChart from "@/components/city-comparison-chart"
import PollutantComparisonChart from "@/components/pollutant-comparison-chart"

export default function ComparePage() {
  const [selectedCities, setSelectedCities] = useState<string[]>(["delhi", "mumbai"])
  const [timeframe, setTimeframe] = useState("month")

  const handleAddCity = () => {
    if (selectedCities.length < 5) {
      // Find a city that's not already selected
      const allCities = ["delhi", "mumbai", "bangalore", "chennai", "kolkata", "hyderabad", "pune", "ahmedabad"]
      const availableCities = allCities.filter((city) => !selectedCities.includes(city))

      if (availableCities.length > 0) {
        setSelectedCities([...selectedCities, availableCities[0]])
      }
    }
  }

  const handleRemoveCity = (index: number) => {
    if (selectedCities.length > 2) {
      const newCities = [...selectedCities]
      newCities.splice(index, 1)
      setSelectedCities(newCities)
    }
  }

  const handleChangeCity = (index: number, value: string) => {
    const newCities = [...selectedCities]
    newCities[index] = value
    setSelectedCities(newCities)
  }

  return (
    <div className="container py-10">
      <div className="mb-8 flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Compare Cities</h1>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-medium">AQI Comparison</h2>
          <p className="text-sm text-muted-foreground">Compare air quality across different Indian cities</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {selectedCities.map((city, index) => (
            <div key={index} className="flex items-center gap-1">
              <Select value={city} onValueChange={(value) => handleChangeCity(index, value)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="delhi">Delhi</SelectItem>
                  <SelectItem value="mumbai">Mumbai</SelectItem>
                  <SelectItem value="bangalore">Bangalore</SelectItem>
                  <SelectItem value="chennai">Chennai</SelectItem>
                  <SelectItem value="kolkata">Kolkata</SelectItem>
                  <SelectItem value="hyderabad">Hyderabad</SelectItem>
                  <SelectItem value="pune">Pune</SelectItem>
                  <SelectItem value="ahmedabad">Ahmedabad</SelectItem>
                </SelectContent>
              </Select>
              {selectedCities.length > 2 && (
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleRemoveCity(index)}>
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remove city</span>
                </Button>
              )}
            </div>
          ))}
          {selectedCities.length < 5 && (
            <Button variant="outline" size="icon" className="h-10 w-10" onClick={handleAddCity}>
              <Plus className="h-4 w-4" />
              <span className="sr-only">Add city</span>
            </Button>
          )}
        </div>
      </div>

      <div className="mb-4 flex justify-end">
        <Select value={timeframe} onValueChange={setTimeframe}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Last 7 Days</SelectItem>
            <SelectItem value="month">Last 30 Days</SelectItem>
            <SelectItem value="year">Last 12 Months</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="overall" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="overall">Overall AQI</TabsTrigger>
          <TabsTrigger value="pollutants">By Pollutant</TabsTrigger>
        </TabsList>
        <TabsContent value="overall">
          <Card>
            <CardHeader>
              <CardTitle>Overall AQI Comparison</CardTitle>
              <CardDescription>Compare air quality index across selected cities</CardDescription>
            </CardHeader>
            <CardContent className="h-[500px]">
              <CityComparisonChart cities={selectedCities} timeframe={timeframe} />
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="gap-1">
                <Download className="h-4 w-4" />
                Export Data
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="pollutants">
          <Card>
            <CardHeader>
              <CardTitle>Pollutant Comparison</CardTitle>
              <CardDescription>Compare individual pollutant levels across selected cities</CardDescription>
            </CardHeader>
            <CardContent>
              <PollutantComparisonChart cities={selectedCities} timeframe={timeframe} />
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="gap-1">
                <Download className="h-4 w-4" />
                Export Data
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

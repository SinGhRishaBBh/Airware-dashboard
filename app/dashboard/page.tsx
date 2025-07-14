"use client"

import { Suspense, useState } from "react"
import Link from "next/link"
import { ArrowRight, FileUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import CurrentAQI from "@/components/current-aqi"
import HealthAdvice from "@/components/health-advice"
import WeatherBreakdown from "@/components/pollutant-breakdown"
import AQITrends from "@/components/aqi-trends"

export default function DashboardPage() {
  const [selectedCity, setSelectedCity] = useState("Delhi")

  return (
    <div className="container mx-auto min-h-screen px-4 py-6 sm:px-6 sm:py-8 md:py-10">
      {/* Header Section */}
      <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">AQI Dashboard</h1>
        <nav className="flex flex-wrap items-center gap-4">
          <Link href="/upload" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Upload Data
          </Link>
          <Link href="/predictions" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Predictions
          </Link>
          <Link href="/compare" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            Compare Cities
          </Link>
        </nav>
      </div>

      {/* Upload Data Section - Top */}
      <Card className="mb-6">
        <CardHeader className="border-b px-6 py-4">
          <CardTitle className="text-lg font-semibold sm:text-xl">Upload AQI Data</CardTitle>
          <CardDescription className="text-sm">Upload your own AQI measurements for analysis</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Suspense fallback={<Skeleton className="h-32 w-full rounded-lg" />}>
            <div className="flex flex-col items-center justify-center gap-4 text-center">
              <FileUp className="h-12 w-12 text-muted-foreground" />
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Upload Your Data</h3>
                <p className="text-sm text-muted-foreground">
                  Upload CSV or Excel files containing AQI measurements for detailed analysis and predictions.
                </p>
              </div>
              <Button asChild className="mt-2">
                <Link href="/upload">
                  Upload Data
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </Suspense>
        </CardContent>
      </Card>

      {/* Main Grid - Top Section */}
      <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
        {/* Current AQI Card */}
        <Card className="flex h-full flex-col overflow-hidden">
          <CardHeader className="border-b px-6 py-4">
            <CardTitle className="text-lg font-semibold sm:text-xl">Current AQI</CardTitle>
            <CardDescription className="text-sm">Real-time air quality index</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 p-6">
            <Suspense fallback={<Skeleton className="h-32 w-full rounded-lg" />}>
              <CurrentAQI onCityChange={setSelectedCity} />
            </Suspense>
          </CardContent>
        </Card>

        {/* Health Advice Card */}
        <Card className="flex h-full flex-col overflow-hidden">
          <CardHeader className="border-b px-6 py-4">
            <CardTitle className="text-lg font-semibold sm:text-xl">Health Advice</CardTitle>
            <CardDescription className="text-sm">Recommendations based on current AQI</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 p-6">
            <Suspense fallback={<Skeleton className="h-32 w-full rounded-lg" />}>
              <HealthAdvice city={selectedCity} />
            </Suspense>
          </CardContent>
        </Card>

        {/* Weather Breakdown Card */}
        <Card className="flex h-full flex-col overflow-hidden md:col-span-2 lg:col-span-1">
          <CardHeader className="border-b px-6 py-4">
            <CardTitle className="text-lg font-semibold sm:text-xl">Weather Breakdown</CardTitle>
            <CardDescription className="text-sm">Detailed weather conditions</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 p-6">
            <Suspense fallback={<Skeleton className="h-32 w-full rounded-lg" />}>
              <WeatherBreakdown city={selectedCity.toLowerCase()} />
            </Suspense>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid - Bottom Section */}
      <div className="mt-6 grid gap-6 sm:gap-8 md:mt-8">
        {/* AQI Trends Card */}
        <Card>
          <CardHeader className="border-b px-6 py-4">
            <CardTitle className="text-lg font-semibold sm:text-xl">AQI Trends</CardTitle>
            <CardDescription className="text-sm">Historical air quality data</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <Suspense fallback={<Skeleton className="h-64 w-full rounded-lg" />}>
              <AQITrends city={selectedCity.toLowerCase()} />
            </Suspense>
          </CardContent>
        </Card>
      </div>

      {/* Footer Section */}
      <footer className="mt-8 border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} AQI Dashboard. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">
              About
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">
              Contact Us
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
} 
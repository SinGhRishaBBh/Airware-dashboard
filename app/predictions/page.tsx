"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Calendar, Download } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"

import AQIPredictionChart from "@/components/aqi-prediction-chart"
import WeatherBreakdown from "@/components/pollutant-breakdown"
import ModelSelection from "@/components/model-selection"
import ModelMetricsCard from "@/components/model-metrics-card"

export default function PredictionsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedCity, setSelectedCity] = useState("delhi")
  const [timeframe, setTimeframe] = useState("week")
  const [selectedModel, setSelectedModel] = useState("ensemble")
  const [hasUploadedData, setHasUploadedData] = useState(false)
  const [dataPoints, setDataPoints] = useState(0)
  const [uploadedData, setUploadedData] = useState<any[] | null>(null)
  const [useUploaded, setUseUploaded] = useState(false)
  const [loadingUploaded, setLoadingUploaded] = useState(false)

  useEffect(() => {
    // Check for uploaded data by ID in query params
    const id = searchParams.get("id")
    if (id) {
      setLoadingUploaded(true)
      fetch(`/api/data/${id}`)
        .then(res => res.json())
        .then(result => {
          if (result.success && Array.isArray(result.data)) {
            setUploadedData(result.data)
            setDataPoints(result.data.length)
            setHasUploadedData(true)
            setUseUploaded(true)
            toast({
              title: "Using uploaded data",
              description: `Showing predictions based on your uploaded file.`,
            })
          } else {
            setUploadedData(null)
            setHasUploadedData(false)
            setUseUploaded(false)
            toast({
              title: "Failed to load uploaded data",
              description: result.error || "Unknown error",
              variant: "destructive",
            })
          }
        })
        .catch(() => {
          setUploadedData(null)
          setHasUploadedData(false)
          setUseUploaded(false)
          toast({
            title: "Failed to load uploaded data",
            description: "Network or server error.",
            variant: "destructive",
          })
        })
        .finally(() => setLoadingUploaded(false))
    } else {
      // Fallback to sessionStorage logic
      const storedData = sessionStorage.getItem("aqiData")
      const storedCity = sessionStorage.getItem("aqiCity")
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData)
          if (Array.isArray(parsedData) && parsedData.length > 0) {
            setHasUploadedData(true)
            setDataPoints(parsedData.length)
            setUploadedData(parsedData)
            setUseUploaded(true)
            if (storedCity) {
              setSelectedCity(storedCity.toLowerCase())
            }
            toast({
              title: "Using uploaded data",
              description: `Showing predictions based on your uploaded data for ${storedCity || selectedCity}.`,
            })
          }
        } catch (error) {
          console.error("Error parsing stored data:", error)
        }
      }
    }
  }, [searchParams])

  const handleCityChange = (city: string) => {
    setSelectedCity(city)
    if (hasUploadedData) {
      sessionStorage.setItem("aqiCity", city)
    }
    // Save city selection to database
    fetch("/api/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        city,
        details: {
          model: selectedModel,
          timeframe,
          timestamp: new Date().toISOString(),
        },
      }),
    })
  }

  // Toggle between uploaded and live data
  const handleToggleDataSource = () => {
    setUseUploaded((prev) => !prev)
  }

  const handleModelChange = (modelId: string) => {
    setSelectedModel(modelId)
  }

  const handleExportData = () => {
    // Get the data from sessionStorage
    const storedData = sessionStorage.getItem("aqiData")

    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData)

        if (Array.isArray(parsedData) && parsedData.length > 0) {
          // Convert to CSV
          const headers = Object.keys(parsedData[0]).join(",")
          const rows = parsedData.map((row) => Object.values(row).join(","))
          const csv = [headers, ...rows].join("\n")

          // Create a blob and download
          const blob = new Blob([csv], { type: "text/csv" })
          const url = URL.createObjectURL(blob)
          const a = document.createElement("a")
          a.href = url
          a.download = `aqi-data-${selectedCity}-${new Date().toISOString().split("T")[0]}.csv`
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(url)

          toast({
            title: "Data exported",
            description: "Your AQI data has been exported as a CSV file.",
          })
        } else {
          toast({
            title: "No data to export",
            description: "There is no data available to export.",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error exporting data:", error)
        toast({
          title: "Export failed",
          description: "An error occurred while exporting the data.",
          variant: "destructive",
        })
      }
    } else {
      toast({
        title: "No data to export",
        description: "There is no data available to export.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container py-10">
      <div className="mb-8 flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">AQI Predictions</h1>
      </div>
      {hasUploadedData && (
        <div className="mb-4 flex items-center gap-4">
          <Button variant={useUploaded ? "default" : "outline"} size="sm" onClick={handleToggleDataSource} disabled={loadingUploaded}>
            {useUploaded ? "Using Uploaded Data" : "Use Uploaded Data"}
          </Button>
          <Button variant={!useUploaded ? "default" : "outline"} size="sm" onClick={handleToggleDataSource} disabled={loadingUploaded}>
            {!useUploaded ? "Using Live Data" : "Use Live Data"}
          </Button>
          {loadingUploaded && <span className="text-xs text-muted-foreground ml-2">Loading uploaded data...</span>}
        </div>
      )}
      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        <div className="space-y-6">
          <ModelSelection selectedModel={selectedModel} onModelChange={handleModelChange} dataPoints={dataPoints} />

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Settings</CardTitle>
              <CardDescription>Configure prediction parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">City</label>
                <Select value={selectedCity} onValueChange={handleCityChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select city" />
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
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Timeframe</label>
                <Select value={timeframe} onValueChange={setTimeframe}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="week">Next 7 Days</SelectItem>
                    <SelectItem value="month">Next 30 Days</SelectItem>
                    <SelectItem value="quarter">Next 90 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-2">
                <Button variant="outline" size="sm" className="w-full gap-1" onClick={handleExportData}>
                  <Download className="h-4 w-4" />
                  Export Data
                </Button>
              </div>
            </CardContent>
          </Card>

          <ModelMetricsCard modelId={selectedModel} dataPoints={dataPoints} />
        </div>

        <div className="space-y-6">
          <Tabs defaultValue="chart" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="chart">Chart View</TabsTrigger>
              <TabsTrigger value="breakdown">Pollutant Breakdown</TabsTrigger>
            </TabsList>
            <TabsContent value="chart">
              <Card>
                <CardHeader>
                  <CardTitle>
                    AQI Prediction for {selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1)}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {timeframe === "week" ? "Next 7 days" : timeframe === "month" ? "Next 30 days" : "Next 90 days"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <AQIPredictionChart city={selectedCity} timeframe={timeframe} modelId={selectedModel} data={useUploaded && uploadedData ? uploadedData : undefined} />
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div>
                    <p className="text-sm font-medium">
                      Using{" "}
                      {selectedModel === "xgboost"
                        ? "XGBoost"
                        : selectedModel === "lstm"
                          ? "LSTM Neural Network"
                          : "Ensemble"}{" "}
                      model
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {useUploaded && uploadedData
                        ? `Based on ${dataPoints} data points from your uploaded data`
                        : "Based on historical data and current weather patterns"}
                    </p>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="breakdown">
              <Card>
                <CardHeader>
                  <CardTitle>
                    Pollutant Breakdown for {selectedCity.charAt(0).toUpperCase() + selectedCity.slice(1)}
                  </CardTitle>
                  <CardDescription>Predicted levels of individual pollutants over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <WeatherBreakdown city={selectedCity} data={useUploaded && uploadedData ? uploadedData : undefined} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Card>
            <CardHeader>
              <CardTitle>Model Explanation</CardTitle>
              <CardDescription>How the selected model generates predictions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedModel === "xgboost" && (
                  <>
                    <p>
                      The XGBoost model uses gradient boosting decision trees to predict AQI values based on historical
                      patterns. It excels at capturing non-linear relationships in the data and can provide accurate
                      short-term predictions.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Key Features</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Uses a window size of 24 time steps</li>
                          <li>• Focuses primarily on historical AQI values</li>
                          <li>• Handles missing data and outliers well</li>
                          <li>• Fast training and prediction speed</li>
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Best Used For</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Short-term forecasts (1-7 days)</li>
                          <li>• Scenarios with limited historical data</li>
                          <li>• When quick predictions are needed</li>
                          <li>• When interpretability is important</li>
                        </ul>
                      </div>
                    </div>
                  </>
                )}

                {selectedModel === "lstm" && (
                  <>
                    <p>
                      The LSTM (Long Short-Term Memory) neural network is a deep learning model designed to capture
                      complex temporal patterns in time series data. It excels at learning long-term dependencies and
                      can incorporate multiple features for more accurate predictions.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Key Features</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Uses a window size of 90 time steps</li>
                          <li>• Incorporates multiple pollutant features (PM2.5, PM10, NO2, etc.)</li>
                          <li>• Bidirectional architecture for better pattern recognition</li>
                          <li>• Captures seasonal and cyclical patterns</li>
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Best Used For</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Medium to long-term forecasts (7-90 days)</li>
                          <li>• When multiple features are available</li>
                          <li>• When complex temporal patterns exist</li>
                          <li>• When high accuracy is critical</li>
                        </ul>
                      </div>
                    </div>
                  </>
                )}

                {selectedModel === "ensemble" && (
                  <>
                    <p>
                      The Ensemble model combines the strengths of both XGBoost and LSTM models to provide more robust
                      and accurate predictions. It leverages the fast learning capabilities of XGBoost with the complex
                      pattern recognition of LSTM neural networks.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Key Features</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Combines predictions from multiple models</li>
                          <li>• Weighted averaging based on model confidence</li>
                          <li>• Adapts to different prediction horizons</li>
                          <li>• More robust to outliers and anomalies</li>
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Best Used For</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• All prediction timeframes</li>
                          <li>• When highest possible accuracy is needed</li>
                          <li>• When data quality varies</li>
                          <li>• For critical decision-making scenarios</li>
                        </ul>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

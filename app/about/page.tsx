"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <div className="container py-10">
      <div className="mb-8 flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">About AQI Dashboard</h1>
      </div>

      <div className="grid gap-6">
        {/* Website Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Website Overview</CardTitle>
            <CardDescription>Learn about our AQI monitoring and prediction platform</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              The AQI Dashboard is a comprehensive platform for monitoring, analyzing, and predicting air quality index (AQI) 
              across different cities. Our platform provides real-time AQI data, historical trends, and predictive analytics 
              to help users make informed decisions about air quality.
            </p>
            <div className="space-y-2">
              <h3 className="font-medium">Key Features:</h3>
              <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                <li>Real-time AQI monitoring for multiple cities</li>
                <li>Detailed pollutant breakdown analysis</li>
                <li>Health advice based on current AQI levels</li>
                <li>Historical AQI trends visualization</li>
                <li>Custom data upload and analysis</li>
                <li>City comparison capabilities</li>
                <li>Advanced AQI prediction models</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Model Details */}
        <Card>
          <CardHeader>
            <CardTitle>Prediction Models</CardTitle>
            <CardDescription>Technical details about our AQI prediction models</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h3 className="font-medium">LSTM Model</h3>
              <p className="text-sm text-muted-foreground">
                Our Long Short-Term Memory (LSTM) neural network model is designed to capture temporal patterns in AQI data. 
                It processes historical AQI measurements to predict future values, taking into account seasonal variations and 
                long-term trends.
              </p>
              <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                <li>Input: Historical AQI data (last 30 days)</li>
                <li>Output: AQI predictions for next 7 days</li>
                <li>Accuracy: 85-90% for 24-hour predictions</li>
                <li>Features: Temperature, humidity, wind speed</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">XGBoost Model</h3>
              <p className="text-sm text-muted-foreground">
                The XGBoost (Extreme Gradient Boosting) model provides highly accurate predictions by combining multiple 
                decision trees with gradient boosting. It excels at handling complex relationships between environmental 
                factors and AQI levels.
              </p>
              <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                <li>Input: Multiple environmental parameters</li>
                <li>Output: AQI predictions and category classification</li>
                <li>Accuracy: 82-87% for predictions</li>
                <li>Features: All major pollutants (PM2.5, PM10, NO2, etc.)</li>
              </ul>
            </div>

            <div className="mt-4 rounded-lg bg-muted p-4">
              <p className="text-sm text-muted-foreground">
                We are continuously working to improve our prediction accuracy by incorporating additional models and 
                enhancing our existing ones. Future updates will include more advanced machine learning models to provide 
                even better predictions.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Data Sources */}
        <Card>
          <CardHeader>
            <CardTitle>Data Sources</CardTitle>
            <CardDescription>Information about our data collection and processing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Our platform aggregates AQI data from multiple reliable sources, including government monitoring stations, 
              environmental agencies, and validated sensor networks. We process and validate this data to ensure accuracy 
              and reliability.
            </p>
            <div className="space-y-2">
              <h3 className="font-medium">Data Collection:</h3>
              <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                <li>Government monitoring stations</li>
                <li>Environmental protection agencies</li>
                <li>Weather monitoring networks</li>
                <li>User-contributed data (validated)</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 
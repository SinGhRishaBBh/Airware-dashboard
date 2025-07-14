"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function TermsPage() {
  return (
    <div className="container py-10">
      <div className="mb-8 flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Terms and Conditions</h1>
      </div>

      <div className="grid gap-6">
        {/* Acceptance of Terms */}
        <Card>
          <CardHeader>
            <CardTitle>1. Acceptance of Terms</CardTitle>
            <CardDescription>By accessing and using the AQI Dashboard, you agree to these terms</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              By accessing and using the AQI Dashboard ("the Service"), you agree to be bound by these Terms and Conditions. 
              If you do not agree to these terms, please do not use the Service.
            </p>
          </CardContent>
        </Card>

        {/* Service Description */}
        <Card>
          <CardHeader>
            <CardTitle>2. Service Description</CardTitle>
            <CardDescription>Overview of the AQI Dashboard services</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              The AQI Dashboard provides air quality monitoring, analysis, and prediction services. The Service includes:
            </p>
            <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
              <li>Real-time AQI monitoring and historical data</li>
              <li>Air quality predictions using machine learning models</li>
              <li>Data upload and analysis capabilities</li>
              <li>Health advice based on AQI levels</li>
              <li>City comparison features</li>
            </ul>
          </CardContent>
        </Card>

        {/* User Responsibilities */}
        <Card>
          <CardHeader>
            <CardTitle>3. User Responsibilities</CardTitle>
            <CardDescription>Your obligations when using the Service</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">When using the Service, you agree to:</p>
            <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
              <li>Provide accurate and complete information when uploading data</li>
              <li>Use the Service only for lawful purposes</li>
              <li>Not attempt to manipulate or falsify data</li>
              <li>Not use the Service for any harmful or malicious purposes</li>
              <li>Respect the intellectual property rights of the Service</li>
            </ul>
          </CardContent>
        </Card>

        {/* Data Usage and Privacy */}
        <Card>
          <CardHeader>
            <CardTitle>4. Data Usage and Privacy</CardTitle>
            <CardDescription>How we handle your data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              We take data privacy seriously. By using the Service, you acknowledge that:
            </p>
            <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
              <li>Uploaded data may be used to improve our prediction models</li>
              <li>Aggregated, anonymized data may be used for research purposes</li>
              <li>Your personal information is protected as per our Privacy Policy</li>
              <li>You retain ownership of your uploaded data</li>
            </ul>
          </CardContent>
        </Card>

        {/* Disclaimer of Warranties */}
        <Card>
          <CardHeader>
            <CardTitle>5. Disclaimer of Warranties</CardTitle>
            <CardDescription>Limitations of our service</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              The Service is provided "as is" without any warranties. We do not guarantee:
            </p>
            <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
              <li>100% accuracy of AQI predictions</li>
              <li>Uninterrupted or error-free service</li>
              <li>Completeness of historical data</li>
              <li>Fitness for any particular purpose</li>
            </ul>
          </CardContent>
        </Card>

        {/* Limitation of Liability */}
        <Card>
          <CardHeader>
            <CardTitle>6. Limitation of Liability</CardTitle>
            <CardDescription>Our liability limitations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              We shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from:
            </p>
            <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
              <li>Use or inability to use the Service</li>
              <li>Inaccurate predictions or data</li>
              <li>Service interruptions or errors</li>
              <li>Loss of data or business interruption</li>
            </ul>
          </CardContent>
        </Card>

        {/* Changes to Terms */}
        <Card>
          <CardHeader>
            <CardTitle>7. Changes to Terms</CardTitle>
            <CardDescription>Updates to these terms</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              We reserve the right to modify these terms at any time. Users will be notified of significant changes. 
              Continued use of the Service after changes constitutes acceptance of the new terms.
            </p>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>8. Contact Information</CardTitle>
            <CardDescription>How to reach us</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              For questions about these Terms and Conditions, please contact us through the support channels provided 
              in the application.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 
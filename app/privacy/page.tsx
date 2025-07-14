"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function PrivacyPage() {
  return (
    <div className="container py-10">
      <div className="mb-8 flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Privacy Policy</h1>
      </div>

      <div className="grid gap-6">
        {/* Information Collection */}
        <Card>
          <CardHeader>
            <CardTitle>1. Information We Collect</CardTitle>
            <CardDescription>Types of data collected by the AQI Dashboard</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              We collect the following types of information to provide and improve our services:
            </p>
            <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
              <li>User-provided data (city preferences, uploaded AQI data)</li>
              <li>Usage data (interaction with features, prediction requests)</li>
              <li>Technical data (browser type, device information)</li>
              <li>Location data (city selection for AQI monitoring)</li>
            </ul>
          </CardContent>
        </Card>

        {/* Data Usage */}
        <Card>
          <CardHeader>
            <CardTitle>2. How We Use Your Data</CardTitle>
            <CardDescription>Purposes for which we use collected information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">Your data is used to:</p>
            <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
              <li>Provide AQI monitoring and prediction services</li>
              <li>Improve our machine learning models</li>
              <li>Personalize your experience</li>
              <li>Analyze usage patterns for service improvement</li>
              <li>Maintain and enhance application security</li>
            </ul>
          </CardContent>
        </Card>

        {/* Data Storage and Security */}
        <Card>
          <CardHeader>
            <CardTitle>3. Data Storage and Security</CardTitle>
            <CardDescription>How we protect your information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              We implement various security measures to protect your data:
            </p>
            <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
              <li>Encryption of data in transit and at rest</li>
              <li>Secure cloud storage with access controls</li>
              <li>Regular security audits and updates</li>
              <li>Limited access to personal information</li>
              <li>Secure data backup procedures</li>
            </ul>
          </CardContent>
        </Card>

        {/* Data Sharing */}
        <Card>
          <CardHeader>
            <CardTitle>4. Data Sharing and Disclosure</CardTitle>
            <CardDescription>When and how we share your information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              We may share your data in the following circumstances:
            </p>
            <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
              <li>With your explicit consent</li>
              <li>For legal compliance requirements</li>
              <li>As aggregated, anonymized data for research</li>
              <li>With service providers who assist in operations</li>
            </ul>
            <p className="text-sm text-muted-foreground mt-4">
              We do not sell your personal information to third parties.
            </p>
          </CardContent>
        </Card>

        {/* User Rights */}
        <Card>
          <CardHeader>
            <CardTitle>5. Your Rights and Choices</CardTitle>
            <CardDescription>Control over your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">You have the right to:</p>
            <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
              <li>Access your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of data collection</li>
              <li>Export your data</li>
            </ul>
          </CardContent>
        </Card>

        {/* Cookies and Tracking */}
        <Card>
          <CardHeader>
            <CardTitle>6. Cookies and Tracking</CardTitle>
            <CardDescription>How we use cookies and tracking technologies</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              We use cookies and similar technologies to:
            </p>
            <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
              <li>Remember your preferences</li>
              <li>Analyze application usage</li>
              <li>Improve user experience</li>
              <li>Maintain session information</li>
            </ul>
            <p className="text-sm text-muted-foreground mt-4">
              You can control cookie preferences through your browser settings.
            </p>
          </CardContent>
        </Card>

        {/* Data Retention */}
        <Card>
          <CardHeader>
            <CardTitle>7. Data Retention</CardTitle>
            <CardDescription>How long we keep your information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              We retain your data for as long as necessary to:
            </p>
            <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
              <li>Provide our services</li>
              <li>Comply with legal obligations</li>
              <li>Resolve disputes</li>
              <li>Enforce agreements</li>
            </ul>
            <p className="text-sm text-muted-foreground mt-4">
              You can request data deletion at any time through our support channels.
            </p>
          </CardContent>
        </Card>

        {/* Updates to Privacy Policy */}
        <Card>
          <CardHeader>
            <CardTitle>8. Updates to Privacy Policy</CardTitle>
            <CardDescription>Changes to our privacy practices</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              We may update this privacy policy periodically. We will notify you of any significant changes through:
            </p>
            <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
              <li>Email notifications</li>
              <li>Application notifications</li>
              <li>Updates to this page</li>
            </ul>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>9. Contact Us</CardTitle>
            <CardDescription>How to reach us about privacy concerns</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              For privacy-related questions or concerns, please contact us through the support channels provided 
              in the application. We will respond to your inquiry within a reasonable timeframe.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 
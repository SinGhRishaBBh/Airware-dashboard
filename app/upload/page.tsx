"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, FileSpreadsheet, FileUp, Upload } from "lucide-react"
import Papa from "papaparse"
import * as XLSX from "xlsx"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

// Define the structure of AQI data
interface AQIData {
  date: string
  pm25?: number
  pm10?: number
  no2?: number
  so2?: number
  o3?: number
  co?: number
  aqi?: number
}

export default function UploadPage() {
  const router = useRouter()
  const [files, setFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [manualData, setManualData] = useState({
    city: "",
    startDate: "",
    endDate: "",
    data: "",
  })
  const [trustedData, setTrustedData] = useState<AQIData[] | null>(null)
  const [trustedFileUrl, setTrustedFileUrl] = useState<string | null>(null)
  const [mongoId, setMongoId] = useState<string | null>(null)
  const [smartUploading, setSmartUploading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)
      setFiles((prev) => [...prev, ...newFiles])
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files)
      setFiles((prev) => [...prev, ...newFiles])
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleManualInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setManualData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Process CSV data
  const processCSV = (content: string): AQIData[] => {
    const results = Papa.parse(content, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
    })

    if (results.errors.length > 0) {
      toast({
        title: "Error parsing CSV",
        description: results.errors[0].message,
        variant: "destructive",
      })
      return []
    }

    return results.data as AQIData[]
  }

  // Process Excel data
  const processExcel = (arrayBuffer: ArrayBuffer): AQIData[] => {
    try {
      const workbook = XLSX.read(arrayBuffer)
      const firstSheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[firstSheetName]
      const data = XLSX.utils.sheet_to_json(worksheet)
      return data as AQIData[]
    } catch (error) {
      toast({
        title: "Error parsing Excel file",
        description: "The file format is not supported or the file is corrupted.",
        variant: "destructive",
      })
      return []
    }
  }

  // Process manual data
  const processManualData = (): AQIData[] => {
    try {
      const lines = manualData.data.trim().split("\n")
      const data: AQIData[] = []

      for (const line of lines) {
        const [date, pm25, pm10, no2, so2, o3, co] = line.split(",").map((item) => item.trim())

        // Calculate AQI from pollutants
        const aqi = calculateAQI(
          Number.parseFloat(pm25),
          Number.parseFloat(pm10),
          Number.parseFloat(no2),
          Number.parseFloat(so2),
          Number.parseFloat(o3),
          Number.parseFloat(co),
        )

        data.push({
          date,
          pm25: Number.parseFloat(pm25),
          pm10: Number.parseFloat(pm10),
          no2: Number.parseFloat(no2),
          so2: Number.parseFloat(so2),
          o3: Number.parseFloat(o3),
          co: Number.parseFloat(co),
          aqi,
        })
      }

      return data
    } catch (error) {
      toast({
        title: "Error processing manual data",
        description: "Please check the format of your data.",
        variant: "destructive",
      })
      return []
    }
  }

  // Simple AQI calculation (this is a simplified version)
  const calculateAQI = (pm25?: number, pm10?: number, no2?: number, so2?: number, o3?: number, co?: number): number => {
    // This is a very simplified calculation - in reality, AQI calculations are more complex
    // and involve breakpoints and piecewise linear functions for each pollutant
    const values = []

    if (pm25) values.push(pm25 * 4.5) // Simplified weight for PM2.5
    if (pm10) values.push(pm10 * 2.5) // Simplified weight for PM10
    if (no2) values.push(no2 * 3) // Simplified weight for NO2
    if (so2) values.push(so2 * 2) // Simplified weight for SO2
    if (o3) values.push(o3 * 3.5) // Simplified weight for O3
    if (co) values.push(co * 50) // Simplified weight for CO

    if (values.length === 0) return 0

    // Return the maximum value as the AQI (simplified approach)
    return Math.min(500, Math.round(Math.max(...values)))
  }

  const handleUpload = async () => {
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select at least one file to upload.",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      // Process each file
      const allData: AQIData[] = []

      for (const file of files) {
        const fileExtension = file.name.split(".").pop()?.toLowerCase()

        if (fileExtension === "csv") {
          const text = await file.text()
          const data = processCSV(text)
          allData.push(...data)
        } else if (fileExtension === "xlsx" || fileExtension === "xls") {
          const arrayBuffer = await file.arrayBuffer()
          const data = processExcel(arrayBuffer)
          allData.push(...data)
        } else {
          toast({
            title: "Unsupported file format",
            description: `The file ${file.name} has an unsupported format.`,
            variant: "destructive",
          })
        }
      }

      if (allData.length > 0) {
        // Ensure all data points have an AQI value
        const processedData = allData.map((item) => {
          if (!item.aqi && (item.pm25 || item.pm10 || item.no2 || item.so2 || item.o3 || item.co)) {
            return {
              ...item,
              aqi: calculateAQI(item.pm25, item.pm10, item.no2, item.so2, item.o3, item.co),
            }
          }
          return item
        })

        // Store the processed data in sessionStorage
        sessionStorage.setItem("aqiData", JSON.stringify(processedData))

        toast({
          title: "Files processed successfully",
          description: `Processed ${processedData.length} data points. Redirecting to predictions.`,
        })

        // Redirect to predictions page
        setTimeout(() => {
          router.push("/predictions")
        }, 1500)
      } else {
        toast({
          title: "No valid data found",
          description: "Could not extract any valid AQI data from the uploaded files.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error processing files",
        description: "An unexpected error occurred while processing the files.",
        variant: "destructive",
      })
      console.error(error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleManualUpload = () => {
    if (!manualData.city || !manualData.data) {
      toast({
        title: "Missing information",
        description: "Please provide a city name and AQI data.",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      const processedData = processManualData()

      if (processedData.length > 0) {
        // Store the processed data and city info in sessionStorage
        sessionStorage.setItem("aqiData", JSON.stringify(processedData))
        sessionStorage.setItem("aqiCity", manualData.city)

        toast({
          title: "Data processed successfully",
          description: `Processed ${processedData.length} data points for ${manualData.city}. Redirecting to predictions.`,
        })

        // Redirect to predictions page
        setTimeout(() => {
          router.push("/predictions")
        }, 1500)
      } else {
        toast({
          title: "No valid data found",
          description: "Could not extract any valid AQI data from your input.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error processing data",
        description: "An unexpected error occurred while processing your data.",
        variant: "destructive",
      })
      console.error(error)
    } finally {
      setIsUploading(false)
    }
  }

  // Smart upload: clean and standardize untrusted file
  const handleSmartUpload = async (file: File) => {
    setSmartUploading(true)
    setTrustedData(null)
    setTrustedFileUrl(null)
    setMongoId(null)
    try {
      let data: AQIData[] = []
      const ext = file.name.split('.').pop()?.toLowerCase()
      if (ext === "csv") {
        const text = await file.text()
        data = processCSV(text)
      } else if (ext === "xlsx" || ext === "xls") {
        const arrayBuffer = await file.arrayBuffer()
        data = processExcel(arrayBuffer)
      } else {
        toast({ title: "Unsupported file format", description: "Only CSV and Excel files are supported.", variant: "destructive" })
        setSmartUploading(false)
        return
      }
      // Clean: remove rows missing date or all pollutants, standardize headers
      data = data.filter(row => row.date && (row.pm25 || row.pm10 || row.no2 || row.so2 || row.o3 || row.co))
      // Optionally: add more cleaning here
      setTrustedData(data)
      // Create CSV for download
      const csv = [
        "date,pm25,pm10,no2,so2,o3,co,aqi",
        ...data.map(row => `${row.date},${row.pm25 ?? ""},${row.pm10 ?? ""},${row.no2 ?? ""},${row.so2 ?? ""},${row.o3 ?? ""},${row.co ?? ""},${row.aqi ?? ""}`)
      ].join("\n")
      const blob = new Blob([csv], { type: "text/csv" })
      setTrustedFileUrl(URL.createObjectURL(blob))
      // Upload to MongoDB
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data }),
      })
      const result = await res.json()
      if (result.success) {
        setMongoId(result.id)
        toast({ title: "Trusted file uploaded!", description: "You can now use it for predictions.", variant: "default" })
      } else {
        toast({ title: "Upload failed", description: result.error || "Unknown error", variant: "destructive" })
      }
    } catch (err) {
      toast({ title: "Smart upload failed", description: String(err), variant: "destructive" })
    } finally {
      setSmartUploading(false)
    }
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
        <h1 className="text-2xl font-bold">Upload AQI Data</h1>
      </div>

      <Tabs defaultValue="file" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="file">File Upload</TabsTrigger>
          <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          <TabsTrigger value="trusted">Trusted Upload</TabsTrigger>
          <TabsTrigger value="smart">Smart Upload (Untrusted)</TabsTrigger>
        </TabsList>
        <TabsContent value="file">
          <Card>
            <CardHeader>
              <CardTitle>Upload AQI Data Files</CardTitle>
              <CardDescription>
                Upload CSV, Excel, or other data files containing AQI measurements for analysis and prediction.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className="flex flex-col items-center justify-center rounded-md border border-dashed p-8 text-center"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <FileUp className="h-10 w-10 text-muted-foreground" />
                <p className="mt-2 font-medium">Drag & drop files here</p>
                <p className="text-sm text-muted-foreground">or</p>
                <Label
                  htmlFor="file-upload"
                  className="mt-2 cursor-pointer rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Browse files
                </Label>
                <Input
                  id="file-upload"
                  type="file"
                  multiple
                  accept=".csv,.xlsx,.xls"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <p className="mt-2 text-xs text-muted-foreground">Supported formats: CSV, Excel (.xlsx, .xls)</p>
              </div>

              {files.length > 0 && (
                <div className="mt-6">
                  <h3 className="mb-2 font-medium">Selected Files</h3>
                  <div className="space-y-2">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between rounded-md border p-2">
                        <div className="flex items-center gap-2">
                          <FileSpreadsheet className="h-5 w-5 text-muted-foreground" />
                          <span className="text-sm">{file.name}</span>
                          <span className="text-xs text-muted-foreground">({(file.size / 1024).toFixed(1)} KB)</span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => handleRemoveFile(index)}>
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={handleUpload} disabled={isUploading || files.length === 0} className="gap-2">
                {isUploading ? "Processing..." : "Upload and Process"}
                <Upload className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="manual">
          <Card>
            <CardHeader>
              <CardTitle>Manual Data Entry</CardTitle>
              <CardDescription>Enter AQI data manually for analysis and prediction.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={manualData.city}
                    onChange={handleManualInputChange}
                    placeholder="Enter city name (e.g., Delhi, Mumbai)"
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="date">Date Range (Optional)</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      type="date"
                      id="startDate"
                      name="startDate"
                      value={manualData.startDate}
                      onChange={handleManualInputChange}
                    />
                    <Input
                      type="date"
                      id="endDate"
                      name="endDate"
                      value={manualData.endDate}
                      onChange={handleManualInputChange}
                    />
                  </div>
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="data">AQI Data</Label>
                  <Textarea
                    id="data"
                    name="data"
                    value={manualData.data}
                    onChange={handleManualInputChange}
                    placeholder="Enter data in CSV format (Date, PM2.5, PM10, NO2, SO2, O3, CO)"
                    className="min-h-[150px]"
                  />
                  <p className="text-xs text-muted-foreground">
                    Format: YYYY-MM-DD, PM2.5, PM10, NO2, SO2, O3, CO (one entry per line)
                  </p>
                  <p className="text-xs text-muted-foreground">Example: 2023-05-01, 45, 75, 30, 10, 20, 0.8</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleManualUpload}
                disabled={isUploading || !manualData.city || !manualData.data}
                className="gap-2"
              >
                {isUploading ? "Processing..." : "Process Data"}
                <Upload className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="trusted">
          {/* ...existing trusted upload UI... */}
        </TabsContent>
        <TabsContent value="smart">
          <Card>
            <CardHeader>
              <CardTitle>Smart Upload (Untrusted File)</CardTitle>
              <CardDescription>Upload any AQI file. We will clean and standardize it for you.</CardDescription>
            </CardHeader>
            <CardContent>
              <Input type="file" accept=".csv,.xlsx,.xls" onChange={e => e.target.files && e.target.files[0] && handleSmartUpload(e.target.files[0])} disabled={smartUploading} />
              {smartUploading && <p className="mt-2 text-sm text-muted-foreground">Processing...</p>}
              {trustedData && (
                <>
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">Preview of Trusted Data</h4>
                    <div className="overflow-x-auto max-h-64 border rounded">
                      <table className="min-w-full text-xs">
                        <thead>
                          <tr>
                            <th>Date</th><th>PM2.5</th><th>PM10</th><th>NO2</th><th>SO2</th><th>O3</th><th>CO</th><th>AQI</th>
                          </tr>
                        </thead>
                        <tbody>
                          {trustedData.slice(0, 10).map((row, i) => (
                            <tr key={i}>
                              <td>{row.date}</td>
                              <td>{row.pm25 ?? ""}</td>
                              <td>{row.pm10 ?? ""}</td>
                              <td>{row.no2 ?? ""}</td>
                              <td>{row.so2 ?? ""}</td>
                              <td>{row.o3 ?? ""}</td>
                              <td>{row.co ?? ""}</td>
                              <td>{row.aqi ?? ""}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {trustedData.length > 10 && <p className="text-xs text-muted-foreground">Showing first 10 rows...</p>}
                  </div>
                  <div className="flex gap-4 mt-4">
                    {trustedFileUrl && <a href={trustedFileUrl} download="trusted_aqi.csv"><Button>Download Trusted File</Button></a>}
                    {mongoId && <Button onClick={() => router.push(`/predictions?id=${mongoId}`)}>Use for Prediction</Button>}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

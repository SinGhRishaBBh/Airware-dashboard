import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import mongoose from "mongoose"

const AQIDataSchema = new mongoose.Schema({
  userId: String, // optional, for user association
  data: Array,    // array of AQI data objects
  uploadedAt: { type: Date, default: Date.now },
})

const CitySelectionSchema = new mongoose.Schema({
  city: String,
  details: mongoose.Schema.Types.Mixed,
  selectedAt: { type: Date, default: Date.now },
})

const AQIData = mongoose.models.AQIData || mongoose.model("AQIData", AQIDataSchema)
const CitySelection = mongoose.models.CitySelection || mongoose.model("CitySelection", CitySelectionSchema)

export async function POST(req: NextRequest) {
  await connectToDatabase()
  const body = await req.json()
  // If city selection event
  if (body.city) {
    const { city, details } = body
    const doc = await CitySelection.create({ city, details })
    return NextResponse.json({ success: true, id: doc._id })
  }
  // Otherwise, treat as AQI data upload
  const { userId, data } = body
  const doc = await AQIData.create({ userId, data })
  return NextResponse.json({ success: true, id: doc._id })
} 
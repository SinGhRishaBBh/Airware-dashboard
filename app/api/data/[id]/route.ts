import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import mongoose from "mongoose"

const AQIDataSchema = new mongoose.Schema({
  userId: String,
  data: Array,
  uploadedAt: { type: Date, default: Date.now },
})

const AQIData = mongoose.models.AQIData || mongoose.model("AQIData", AQIDataSchema)

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await connectToDatabase()
  const { id } = params
  const doc = await AQIData.findById(id)
  if (!doc) {
    return NextResponse.json({ success: false, error: "Not found" }, { status: 404 })
  }
  return NextResponse.json({ success: true, data: doc.data })
} 
import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import mongoose from "mongoose"

// In-memory cache and rate limiter
const aqiCache: { [city: string]: { data: any, timestamp: number } } = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const rateLimit: { [ip: string]: number[] } = {};
const LIMIT = 20; // max 20 requests
const WINDOW = 60 * 1000; // per minute

const CitySelectionSchema = new mongoose.Schema({
  city: String,
  details: mongoose.Schema.Types.Mixed,
  selectedAt: { type: Date, default: Date.now },
})

const CitySelection = mongoose.models.CitySelection || mongoose.model("CitySelection", CitySelectionSchema)

export async function GET(req: NextRequest) {
  // --- Rate Limiting ---
  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  const now = Date.now();
  rateLimit[ip] = (rateLimit[ip] || []).filter(ts => now - ts < WINDOW);
  if (rateLimit[ip].length >= LIMIT) {
    return new NextResponse('Too many requests', { status: 429 });
  }
  rateLimit[ip].push(now);

  // --- Caching ---
  const { searchParams } = new URL(req.url);
  const city = searchParams.get("city");
  if (!city) {
    return NextResponse.json({ success: false, error: "City is required" }, { status: 400 });
  }
  if (
    aqiCache[city] &&
    now - aqiCache[city].timestamp < CACHE_DURATION
  ) {
    return NextResponse.json(aqiCache[city].data);
  }

  await connectToDatabase()
  // Find the most recent 7 selections for this city
  const selections = await CitySelection.find({ city: new RegExp(`^${city}$`, "i") })
    .sort({ selectedAt: -1 })
    .limit(7)
    .lean()
  // Map to AQI trend data (simulate AQI if not present)
  const trends = selections.map(sel => ({
    date: sel.selectedAt.toLocaleDateString(),
    aqi: sel.details?.aqi ?? Math.floor(80 + Math.random() * 120),
  })).reverse()

  const responseData = { success: true, trends };
  aqiCache[city] = { data: responseData, timestamp: now };
  return NextResponse.json(responseData);
} 
interface AQIData {
  aqi: number
  city: string
  weather: {
    temperature: number
    humidity: number
    windSpeed: number
    icon: string
  }
  timestamp: string
}

// Fallback AQI data for major Indian cities (updated with more accurate values)
const fallbackData: Record<string, AQIData> = {
  delhi: {
    aqi: 185,
    city: "Delhi",
    weather: {
      temperature: 30,
      humidity: 40,
      windSpeed: 2,
      icon: "01d",
    },
    timestamp: new Date().toISOString(),
  },
  mumbai: {
    aqi: 95,
    city: "Mumbai",
    weather: {
      temperature: 28,
      humidity: 60,
      windSpeed: 3,
      icon: "01d",
    },
    timestamp: new Date().toISOString(),
  },
  bangalore: {
    aqi: 45,
    city: "Bangalore",
    weather: {
      temperature: 25,
      humidity: 55,
      windSpeed: 2,
      icon: "01d",
    },
    timestamp: new Date().toISOString(),
  },
  // Add more cities as needed
}

// Function to validate and normalize AQI value
function normalizeAQI(value: number): number {
  if (isNaN(value) || value < 0) return 0
  if (value > 500) return 500
  return Math.round(value)
}

// Function to validate and normalize pollutant values
function normalizePollutant(value: number | undefined): number {
  if (value === undefined || isNaN(value) || value < 0) return 0
  return Math.round(value * 100) / 100 // Round to 2 decimal places
}

// Function to get station ID for a city
function getStationId(city: string): string {
  const stationMap: Record<string, string> = {
    'delhi': 'delhi',
    'mumbai': 'mumbai',
    'bangalore': 'bangalore',
    'hyderabad': 'hyderabad',
    'chennai': 'chennai',
    'kolkata': 'kolkata',
    'pune': 'pune',
    'ahmedabad': 'ahmedabad',
    'jaipur': 'jaipur',
    'lucknow': 'lucknow',
    'kanpur': 'kanpur',
    'nagpur': 'nagpur',
    'indore': 'indore',
    'thane': 'thane',
    'bhopal': 'bhopal',
    'vizag': 'visakhapatnam',
    'patna': 'patna',
    'vadodara': 'vadodara',
    'ghaziabad': 'ghaziabad',
    'ludhiana': 'ludhiana',
  }
  return stationMap[city.toLowerCase()] || city
}

// Mapping for Indian cities to their state and country
const cityStateCountryMap: Record<string, { state: string; country: string }> = {
  delhi: { state: "Delhi", country: "India" },
  mumbai: { state: "Maharashtra", country: "India" },
  bangalore: { state: "Karnataka", country: "India" },
  chennai: { state: "Tamil Nadu", country: "India" },
  hyderabad: { state: "Telangana", country: "India" },
  kolkata: { state: "West Bengal", country: "India" },
  pune: { state: "Maharashtra", country: "India" },
  ahmedabad: { state: "Gujarat", country: "India" },
  visakhapatnam: { state: "Andhra Pradesh", country: "India" },
  lucknow: { state: "Uttar Pradesh", country: "India" },
  kanpur: { state: "Uttar Pradesh", country: "India" },
  nagpur: { state: "Maharashtra", country: "India" },
  indore: { state: "Madhya Pradesh", country: "India" },
  thane: { state: "Maharashtra", country: "India" },
  bhopal: { state: "Madhya Pradesh", country: "India" },
  patna: { state: "Bihar", country: "India" },
  vadodara: { state: "Gujarat", country: "India" },
  ghaziabad: { state: "Uttar Pradesh", country: "India" },
  ludhiana: { state: "Punjab", country: "India" },
  surat: { state: "Gujarat", country: "India" },
  agra: { state: "Uttar Pradesh", country: "India" },
  nashik: { state: "Maharashtra", country: "India" },
  faridabad: { state: "Haryana", country: "India" },
  meerut: { state: "Uttar Pradesh", country: "India" },
  rajkot: { state: "Gujarat", country: "India" },
  varanasi: { state: "Uttar Pradesh", country: "India" },
  amritsar: { state: "Punjab", country: "India" },
  allahabad: { state: "Uttar Pradesh", country: "India" },
  howrah: { state: "West Bengal", country: "India" },
  ranchi: { state: "Jharkhand", country: "India" },
  coimbatore: { state: "Tamil Nadu", country: "India" },
  jabalpur: { state: "Madhya Pradesh", country: "India" },
  gwalior: { state: "Madhya Pradesh", country: "India" },
  vijayawada: { state: "Andhra Pradesh", country: "India" },
  chandigarh: { state: "Chandigarh", country: "India" },
  mysore: { state: "Karnataka", country: "India" },
  guwahati: { state: "Assam", country: "India" },
  hubli: { state: "Karnataka", country: "India" },
  tiruchirappalli: { state: "Tamil Nadu", country: "India" },
  bareilly: { state: "Uttar Pradesh", country: "India" },
  aligarh: { state: "Uttar Pradesh", country: "India" },
  moradabad: { state: "Uttar Pradesh", country: "India" },
  jodhpur: { state: "Rajasthan", country: "India" },
  madurai: { state: "Tamil Nadu", country: "India" },
  raipur: { state: "Chhattisgarh", country: "India" },
  kota: { state: "Rajasthan", country: "India" },
  salem: { state: "Tamil Nadu", country: "India" },
  bhubaneswar: { state: "Odisha", country: "India" },
  warangal: { state: "Telangana", country: "India" },
  guntur: { state: "Andhra Pradesh", country: "India" },
  dehradun: { state: "Uttarakhand", country: "India" },
  asansol: { state: "West Bengal", country: "India" },
  nanded: { state: "Maharashtra", country: "India" },
  ajmer: { state: "Rajasthan", country: "India" },
  ujjain: { state: "Madhya Pradesh", country: "India" },
  jamshedpur: { state: "Jharkhand", country: "India" },
  dhanbad: { state: "Jharkhand", country: "India" },
  siliguri: { state: "West Bengal", country: "India" },
  nellore: { state: "Andhra Pradesh", country: "India" },
  gorakhpur: { state: "Uttar Pradesh", country: "India" },
  belgaum: { state: "Karnataka", country: "India" },
  kalyan: { state: "Maharashtra", country: "India" },
  jamnagar: { state: "Gujarat", country: "India" },
  bhatpara: { state: "West Bengal", country: "India" },
  saharanpur: { state: "Uttar Pradesh", country: "India" },
  kolhapur: { state: "Maharashtra", country: "India" },
  cawnpore: { state: "Uttar Pradesh", country: "India" },
  ulhasnagar: { state: "Maharashtra", country: "India" },
  sangli: { state: "Maharashtra", country: "India" },
  malegaon: { state: "Maharashtra", country: "India" },
  jalgaon: { state: "Maharashtra", country: "India" },
  loni: { state: "Uttar Pradesh", country: "India" },
  panihati: { state: "West Bengal", country: "India" },
  tiruppur: { state: "Tamil Nadu", country: "India" },
  secunderabad: { state: "Telangana", country: "India" },
  mathura: { state: "Uttar Pradesh", country: "India" },
  chandrapur: { state: "Maharashtra", country: "India" },
  bardhaman: { state: "West Bengal", country: "India" },
  muzaffarnagar: { state: "Uttar Pradesh", country: "India" },
  biharsharif: { state: "Bihar", country: "India" },
  panipat: { state: "Haryana", country: "India" },
  darbhanga: { state: "Bihar", country: "India" },
  bathinda: { state: "Punjab", country: "India" },
  jalna: { state: "Maharashtra", country: "India" },
  katihar: { state: "Bihar", country: "India" },
  srinagar: { state: "Jammu and Kashmir", country: "India" },
  amravati: { state: "Maharashtra", country: "India" },
  muzaffarpur: { state: "Bihar", country: "India" },
  anantapur: { state: "Andhra Pradesh", country: "India" },
  rohtak: { state: "Haryana", country: "India" },
  kurnool: { state: "Andhra Pradesh", country: "India" },
  shimoga: { state: "Karnataka", country: "India" },
  tirunelveli: { state: "Tamil Nadu", country: "India" },
  bidar: { state: "Karnataka", country: "India" },
  hospet: { state: "Karnataka", country: "India" },
  nizamabad: { state: "Telangana", country: "India" },
  parbhani: { state: "Maharashtra", country: "India" },
  tumkur: { state: "Karnataka", country: "India" },
  khammam: { state: "Telangana", country: "India" },
  ongole: { state: "Andhra Pradesh", country: "India" },
  eluru: { state: "Andhra Pradesh", country: "India" },
  satna: { state: "Madhya Pradesh", country: "India" },
  cuddalore: { state: "Tamil Nadu", country: "India" },
  kakinada: { state: "Andhra Pradesh", country: "India" },
  bhagalpur: { state: "Bihar", country: "India" },
  palghar: { state: "Maharashtra", country: "India" },
  gopalpur: { state: "Odisha", country: "India" },
  balasore: { state: "Odisha", country: "India" },
  barasat: { state: "West Bengal", country: "India" },
  bankura: { state: "West Bengal", country: "India" },
  darjeeling: { state: "West Bengal", country: "India" },
  purulia: { state: "West Bengal", country: "India" },
  haldia: { state: "West Bengal", country: "India" },
  krishnanagar: { state: "West Bengal", country: "India" },
  medinipur: { state: "West Bengal", country: "India" },
  berhampore: { state: "West Bengal", country: "India" },
  raiganj: { state: "West Bengal", country: "India" },
  jalpaiguri: { state: "West Bengal", country: "India" },
  malda: { state: "West Bengal", country: "India" },
  coochbehar: { state: "West Bengal", country: "India" },
  sivasagar: { state: "Assam", country: "India" },
  dibrugarh: { state: "Assam", country: "India" },
  silchar: { state: "Assam", country: "India" },
  tezpur: { state: "Assam", country: "India" },
  goalpara: { state: "Assam", country: "India" },
  nagaon: { state: "Assam", country: "India" },
  dhubri: { state: "Assam", country: "India" },
  diphu: { state: "Assam", country: "India" },
  tura: { state: "Meghalaya", country: "India" },
  shillong: { state: "Meghalaya", country: "India" },
  agartala: { state: "Tripura", country: "India" },
  aizawl: { state: "Mizoram", country: "India" },
  imphal: { state: "Manipur", country: "India" },
  kohima: { state: "Nagaland", country: "India" },
  itanagar: { state: "Arunachal Pradesh", country: "India" },
  gangtok: { state: "Sikkim", country: "India" },
  portblair: { state: "Andaman and Nicobar Islands", country: "India" },
  panaji: { state: "Goa", country: "India" },
  pondicherry: { state: "Puducherry", country: "India" },
  karaikal: { state: "Puducherry", country: "India" },
  yanam: { state: "Puducherry", country: "India" },
  mahe: { state: "Puducherry", country: "India" },
  lakshadweep: { state: "Lakshadweep", country: "India" },
  kavaratti: { state: "Lakshadweep", country: "India" },
  daman: { state: "Daman and Diu", country: "India" },
  diu: { state: "Daman and Diu", country: "India" },
  silvassa: { state: "Dadra and Nagar Haveli", country: "India" },
  dnh: { state: "Dadra and Nagar Haveli", country: "India" },
}

// Helper to fetch weather and AQI from OpenWeatherMap
async function fetchFromOpenWeather(city: string): Promise<AQIData | null> {
  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY
  if (!apiKey) return null
  try {
    // Get city weather
    const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`)
    if (!weatherRes.ok) throw new Error('Weather fetch failed')
    const weatherData = await weatherRes.json()
    // Get city AQI (using coordinates from weather)
    const { lon, lat } = weatherData.coord
    const aqiRes = await fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`)
    if (!aqiRes.ok) throw new Error('AQI fetch failed')
    const aqiData = await aqiRes.json()
    // OpenWeather AQI: 1=Good, 2=Fair, 3=Moderate, 4=Poor, 5=Very Poor
    const aqiMap = [0, 50, 100, 150, 200, 300]
    const aqi = aqiMap[aqiData.list[0]?.main.aqi] || 99
    return {
      aqi,
      city: weatherData.name,
      weather: {
        temperature: Math.round(weatherData.main.temp),
        humidity: weatherData.main.humidity,
        windSpeed: weatherData.wind.speed,
        icon: weatherData.weather[0]?.icon || "01d",
      },
      timestamp: new Date().toISOString(),
    }
  } catch (err) {
    console.error('OpenWeatherMap backup fetch failed:', err)
    return null
  }
}

export async function fetchAQIData(city: string): Promise<AQIData> {
  const apiKey = process.env.NEXT_PUBLIC_IQAIR_API_KEY
  const cityKey = city.toLowerCase()
  const fallback = fallbackData[cityKey] || {
    aqi: 99,
    city,
    weather: {
      temperature: 25,
      humidity: 50,
      windSpeed: 2,
      icon: "01d",
    },
    timestamp: new Date().toISOString(),
  }

  if (!apiKey) {
    console.warn('IQAir API key not found, trying OpenWeatherMap for', city)
    const openWeather = await fetchFromOpenWeather(city)
    if (openWeather) return openWeather
    console.warn('OpenWeatherMap API key not found or failed, using fallback/mock data for', city)
    return fallback
  }

  const mapping = cityStateCountryMap[cityKey]
  if (!mapping) {
    console.warn(`No mapping found for city: ${city}, trying OpenWeatherMap`)
    const openWeather = await fetchFromOpenWeather(city)
    if (openWeather) return openWeather
    return fallback
  }

  const url = `https://api.airvisual.com/v2/city?city=${encodeURIComponent(mapping.state === "Delhi" ? "New Delhi" : city)}&state=${encodeURIComponent(mapping.state)}&country=${encodeURIComponent(mapping.country)}&key=${apiKey}`

  try {
    const response = await fetch(url)
    if (response.status === 429) {
      throw new Error("Rate limit exceeded. Please try again later.")
    }
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    if (data.status !== "success" || !data.data) {
      throw new Error("Invalid response from IQAir API")
    }
    const current = data.data.current
    return {
      aqi: normalizeAQI(current.pollution.aqius),
      city: data.data.city,
      weather: {
        temperature: current.weather.tp,
        humidity: current.weather.hu,
        windSpeed: current.weather.ws,
        icon: current.weather.ic,
      },
      timestamp: new Date(current.pollution.ts).toISOString(),
    }
  } catch (error) {
    console.error('Error fetching AQI data from IQAir, trying OpenWeatherMap:', error)
    const openWeather = await fetchFromOpenWeather(city)
    if (openWeather) return openWeather
    return fallback
  }
}

// Function to calculate AQI based on pollutant values
function calculateAQI(pollutants: {
  pm25: number
  pm10: number
  no2: number
  so2: number
  o3: number
  co: number
}): number {
  // AQI calculation based on Indian AQI standards
  const pm25AQI = calculatePollutantAQI(pollutants.pm25, 'pm25')
  const pm10AQI = calculatePollutantAQI(pollutants.pm10, 'pm10')
  const no2AQI = calculatePollutantAQI(pollutants.no2, 'no2')
  const so2AQI = calculatePollutantAQI(pollutants.so2, 'so2')
  const o3AQI = calculatePollutantAQI(pollutants.o3, 'o3')
  const coAQI = calculatePollutantAQI(pollutants.co, 'co')

  // Return the highest AQI value
  return Math.max(pm25AQI, pm10AQI, no2AQI, so2AQI, o3AQI, coAQI)
}

// Function to calculate AQI for individual pollutants
function calculatePollutantAQI(value: number, pollutant: string): number {
  // AQI breakpoints for different pollutants (based on Indian AQI standards)
  const breakpoints: Record<string, number[][]> = {
    pm25: [
      [0, 30, 0, 50],
      [31, 60, 51, 100],
      [61, 90, 101, 200],
      [91, 120, 201, 300],
      [121, 250, 301, 400],
      [251, 500, 401, 500]
    ],
    pm10: [
      [0, 50, 0, 50],
      [51, 100, 51, 100],
      [101, 250, 101, 200],
      [251, 350, 201, 300],
      [351, 430, 301, 400],
      [431, 500, 401, 500]
    ],
    no2: [
      [0, 40, 0, 50],
      [41, 80, 51, 100],
      [81, 180, 101, 200],
      [181, 280, 201, 300],
      [281, 400, 301, 400],
      [401, 500, 401, 500]
    ],
    so2: [
      [0, 40, 0, 50],
      [41, 80, 51, 100],
      [81, 380, 101, 200],
      [381, 800, 201, 300],
      [801, 1600, 301, 400],
      [1601, 2000, 401, 500]
    ],
    o3: [
      [0, 50, 0, 50],
      [51, 100, 51, 100],
      [101, 168, 101, 200],
      [169, 208, 201, 300],
      [209, 748, 301, 400],
      [749, 1000, 401, 500]
    ],
    co: [
      [0, 1, 0, 50],
      [1.1, 2, 51, 100],
      [2.1, 10, 101, 200],
      [10.1, 17, 201, 300],
      [17.1, 34, 301, 400],
      [34.1, 50, 401, 500]
    ]
  }

  const pollutantBreakpoints = breakpoints[pollutant]
  if (!pollutantBreakpoints) return 0

  for (const [clow, chigh, ilow, ihigh] of pollutantBreakpoints) {
    if (value >= clow && value <= chigh) {
      return Math.round(((ihigh - ilow) / (chigh - clow)) * (value - clow) + ilow)
    }
  }

  return 0
}

// Fetch historical AQI data for the past N days using OpenWeatherMap
export async function fetchHistoricalAQIData(city: string, days: number): Promise<AQIData[]> {
  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY
  const results: AQIData[] = []
  if (!apiKey) {
    console.warn('OpenWeatherMap API key not found, using mock data for history')
    // Fallback: return mock data for each day
    for (let i = 0; i < days; i++) {
      results.push({
        aqi: 99,
        city,
        weather: {
          temperature: 25,
          humidity: 50,
          windSpeed: 2,
          icon: "01d",
        },
        timestamp: new Date(Date.now() - (days - 1 - i) * 24 * 60 * 60 * 1000).toISOString(),
      })
    }
    return results
  }
  try {
    // Get city coordinates from OpenWeatherMap
    const geoRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`)
    if (!geoRes.ok) throw new Error('Weather fetch failed')
    const geoData = await geoRes.json()
    const { lon, lat } = geoData.coord
    // For each day, fetch historical AQI
    for (let i = 0; i < days; i++) {
      const dt = Math.floor((Date.now() - (days - 1 - i) * 24 * 60 * 60 * 1000) / 1000)
      const aqiRes = await fetch(`https://api.openweathermap.org/data/2.5/air_pollution/history?lat=${lat}&lon=${lon}&start=${dt}&end=${dt + 86399}&appid=${apiKey}`)
      if (!aqiRes.ok) {
        // fallback for this day
        results.push({
          aqi: 99,
          city,
          weather: {
            temperature: 25,
            humidity: 50,
            windSpeed: 2,
            icon: "01d",
          },
          timestamp: new Date(dt * 1000).toISOString(),
        })
        continue
      }
      const aqiData = await aqiRes.json()
      // Use the first AQI value of the day if available
      const aqiVal = aqiData.list && aqiData.list.length > 0 ? aqiData.list[0].main.aqi : 3
      // OpenWeather AQI: 1=Good, 2=Fair, 3=Moderate, 4=Poor, 5=Very Poor
      const aqiMap = [0, 50, 100, 150, 200, 300]
      results.push({
        aqi: aqiMap[aqiVal] || 99,
        city,
        weather: {
          temperature: Math.round(geoData.main.temp),
          humidity: geoData.main.humidity,
          windSpeed: geoData.wind.speed,
          icon: geoData.weather[0]?.icon || "01d",
        },
        timestamp: new Date(dt * 1000).toISOString(),
      })
    }
    return results
  } catch (err) {
    console.error('OpenWeatherMap history fetch failed:', err)
    // Fallback: return mock data for each day
    for (let i = 0; i < days; i++) {
      results.push({
        aqi: 99,
        city,
        weather: {
          temperature: 25,
          humidity: 50,
          windSpeed: 2,
          icon: "01d",
        },
        timestamp: new Date(Date.now() - (days - 1 - i) * 24 * 60 * 60 * 1000).toISOString(),
      })
    }
    return results
  }
} 
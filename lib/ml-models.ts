// Interface for model metrics
export interface ModelMetrics {
  mae: number
  rmse: number
  r2: number
  confidence: number
}

// Interface for model predictions
export interface ModelPrediction {
  date: string
  actual?: number
  predicted: number
}

// Interface for model info
export interface ModelInfo {
  id: string
  name: string
  description: string
  metrics: ModelMetrics
  strengths: string[]
  limitations: string[]
}

// Available models
export const availableModels: ModelInfo[] = [
  {
    id: "xgboost",
    name: "XGBoost",
    description:
      "A gradient boosting model that uses historical AQI data to predict future values. Effective for short-term predictions.",
    metrics: {
      mae: 12.45,
      rmse: 18.32,
      r2: 0.87,
      confidence: 85,
    },
    strengths: [
      "Fast training and prediction speed",
      "Handles non-linear relationships well",
      "Good performance with limited data",
      "Less prone to overfitting",
    ],
    limitations: [
      "Less effective for long-term predictions",
      "May miss complex temporal patterns",
      "Limited ability to capture seasonal trends",
    ],
  },
  {
    id: "lstm",
    name: "LSTM Neural Network",
    description:
      "A deep learning model that uses multiple features to predict AQI values. Excellent for capturing complex temporal patterns.",
    metrics: {
      mae: 9.78,
      rmse: 14.65,
      r2: 0.92,
      confidence: 91,
    },
    strengths: [
      "Captures complex temporal dependencies",
      "Excellent for long-term predictions",
      "Utilizes multiple features for better accuracy",
      "Learns seasonal and cyclical patterns",
    ],
    limitations: [
      "Requires more data for training",
      "Slower training and prediction time",
      "More complex to interpret",
      "May overfit with insufficient data",
    ],
  },
  {
    id: "ensemble",
    name: "Ensemble (XGBoost + LSTM)",
    description:
      "A combined approach that leverages the strengths of both XGBoost and LSTM models for more robust predictions.",
    metrics: {
      mae: 8.12,
      rmse: 12.43,
      r2: 0.94,
      confidence: 93,
    },
    strengths: [
      "Combines strengths of multiple models",
      "More robust predictions across different scenarios",
      "Better handling of outliers and anomalies",
      "Higher overall accuracy",
    ],
    limitations: [
      "More computationally intensive",
      "Increased complexity",
      "Requires more parameters to tune",
      "May not always outperform individual models",
    ],
  },
]

// Function to generate predictions based on model and data
export async function generatePredictions(
  modelId: string,
  data: any[],
  timeframe: string,
  city: string,
): Promise<ModelPrediction[]> {
  // In a real implementation, this would use TensorFlow.js to run the actual models
  // For this demo, we'll simulate predictions with some randomness based on model characteristics

  const days = timeframe === "week" ? 7 : timeframe === "month" ? 30 : 90
  const startDate = new Date()
  const predictions: ModelPrediction[] = []

  // Get base AQI from data or use defaults
  let baseAqi = 100
  if (data && data.length > 0) {
    // Calculate average AQI from data
    const aqiValues = data.filter((item) => item.aqi).map((item) => item.aqi)
    if (aqiValues.length > 0) {
      baseAqi = aqiValues.reduce((sum, val) => sum + val, 0) / aqiValues.length
    }
  } else {
    // Default base AQI values for different cities
    const cityAqi: { [key: string]: number } = {
      delhi: 180,
      mumbai: 95,
      bangalore: 45,
      chennai: 120,
      kolkata: 135,
      hyderabad: 85,
      pune: 90,
      ahmedabad: 110,
    }
    baseAqi = cityAqi[city.toLowerCase()] || 100
  }

  // Model-specific parameters
  const modelParams: { [key: string]: any } = {
    xgboost: {
      volatility: 0.15,
      trend: 0.3,
      seasonality: 0.2,
    },
    lstm: {
      volatility: 0.1,
      trend: 0.2,
      seasonality: 0.4,
    },
    ensemble: {
      volatility: 0.08,
      trend: 0.25,
      seasonality: 0.3,
    },
  }

  const params = modelParams[modelId]

  // Extract actual values from data if available
  const actualValues: { [key: string]: number } = {}
  if (data && data.length > 0) {
    // Get the most recent data points
    const recentData = [...data].sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0
      const dateB = b.date ? new Date(b.date).getTime() : 0
      return dateB - dateA
    })

    // Use the most recent data points for the first few days (if available)
    const actualDays = Math.min(days, recentData.length)
    for (let i = 0; i < actualDays; i++) {
      if (recentData[i] && recentData[i].aqi) {
        const date = new Date(startDate)
        date.setDate(date.getDate() + i)
        const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
        actualValues[dateStr] = recentData[i].aqi
      }
    }
  }

  // Generate predictions
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate)
    date.setDate(date.getDate() + i)
    const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" })

    // Add randomness, trend, and seasonality based on model characteristics
    const randomFactor = (Math.random() - 0.5) * 2 * params.volatility * baseAqi
    const trendFactor = i * params.trend
    const seasonalFactor = Math.sin((i / days) * Math.PI * 2) * params.seasonality * baseAqi * 0.2

    // Calculate predicted AQI
    let predictedAqi = baseAqi + randomFactor + trendFactor + seasonalFactor

    // Ensure AQI is within reasonable bounds
    predictedAqi = Math.max(20, Math.min(500, predictedAqi))

    // Create prediction object with actual value if available
    const prediction: ModelPrediction = {
      date: dateStr,
      predicted: Math.round(predictedAqi),
    }

    // Add actual value if available
    if (actualValues[dateStr]) {
      prediction.actual = actualValues[dateStr]
    }

    predictions.push(prediction)
  }

  // Simulate model loading delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return predictions
}

// Function to get model confidence based on data quality and quantity
export function getModelConfidence(modelId: string, dataPoints: number): number {
  const baseConfidence = availableModels.find((m) => m.id === modelId)?.metrics.confidence || 80

  // Adjust confidence based on data quantity
  let confidenceAdjustment = 0
  if (dataPoints < 10) {
    confidenceAdjustment = -15
  } else if (dataPoints < 30) {
    confidenceAdjustment = -10
  } else if (dataPoints < 100) {
    confidenceAdjustment = -5
  } else if (dataPoints > 1000) {
    confidenceAdjustment = 5
  }

  // Model-specific adjustments
  if (modelId === "lstm" && dataPoints < 50) {
    confidenceAdjustment -= 10 // LSTM needs more data
  }
  if (modelId === "xgboost" && dataPoints > 1000) {
    confidenceAdjustment -= 2 // XGBoost doesn't benefit as much from very large datasets
  }

  return Math.min(99, Math.max(50, baseConfidence + confidenceAdjustment))
}

// Function to get adjusted model metrics based on data
export function getAdjustedMetrics(modelId: string, dataPoints: number): ModelMetrics {
  const baseMetrics = availableModels.find((m) => m.id === modelId)?.metrics || {
    mae: 15,
    rmse: 20,
    r2: 0.8,
    confidence: 80,
  }

  // Adjust metrics based on data quantity
  const adjustmentFactor = dataPoints < 30 ? 1.2 : dataPoints < 100 ? 1.1 : dataPoints > 1000 ? 0.9 : 1

  return {
    mae: +(baseMetrics.mae * adjustmentFactor).toFixed(2),
    rmse: +(baseMetrics.rmse * adjustmentFactor).toFixed(2),
    r2: +Math.min(0.99, baseMetrics.r2 / adjustmentFactor).toFixed(2),
    confidence: getModelConfidence(modelId, dataPoints),
  }
}

/**
 * Machine Learning Models Configuration
 * Central data structure for ML model information across the application
 * 
 * Update model properties here to sync across:
 * - ML Models page (/ml-models)
 * - Dashboard Analytics page (/dashboard/analytics)
 * - Dashboard Predictions page (/dashboard/predictions)
 */

import { Activity, LucideIcon } from "lucide-react"

export type ModelStatus = "connected" | "training" | "not-connected"

export interface MLModel {
  id: string
  name: string
  icon: LucideIcon
  type: string
  objective: string
  status: ModelStatus
  
  // Evaluation Metrics (use null for N/A)
  metrics: {
    accuracy: number | null
    precision: number | null
    recall: number | null
    f1Score: number | null
  }
  
  // Use Cases
  useCases: string[]
  
  // Dataset Information
  dataset: {
    samples: number | null
    description: string
  }
  
  // Links
  githubUrl: string
  dashboardUrl: string
  
  // Styling
  color: "green" | "red" | "blue" | "amber"
}

/**
 * ML Models Configuration
 * Set status to "connected" and fill in metrics when models are ready
 * Set status to "not-connected" to display N/A for all metrics
 */
export const ML_MODELS: MLModel[] = [
  {
    id: "lstm-time-series-forecaster",
    name: "LSTM Time-Series Forecaster",
    icon: Activity,
    type: "LSTM Neural Network (Regression)",
    objective: "Predicts the next timestep's sensor values (15 features) based on 50 consecutive previous timesteps. Forecasts future readings for accelerometer, gyroscope, heart rate, and SpO2 sensors using temporal pattern analysis.",
    status: "connected",
    
    metrics: {
      accuracy: 0.9699, // R² Score: 96.99%
      precision: null, // Not applicable for regression
      recall: null, // Not applicable for regression
      f1Score: null, // Not applicable for regression
    },
    
    useCases: [
      "Predict future sensor readings based on historical data",
      "Time-series forecasting for health monitoring",
      "Anomaly detection through prediction deviation",
      "Real-time trend analysis and extrapolation",
    ],
    
    dataset: {
      samples: 50000,
      description: "50-timestep sequences predicting next values for 15 features: HR, SpO2, AccX, AccY, AccZ, GyroX, GyroY, GyroZ, Aroll, Apitch, Groll, Gpitch, Gy, Combroll, Combpitch",
    },
    
    githubUrl: "https://github.com/Meet2304/Project-Talaria",
    dashboardUrl: "/dashboard/predictions",
    
    color: "blue",
  },
]

/**
 * Utility Functions
 */

export const formatMetric = (value: number | null): string => {
  if (value === null) return "N/A"
  return `${(value * 100).toFixed(1)}%`
}

export const formatSamples = (samples: number | null): string => {
  if (samples === null) return "N/A"
  if (samples >= 1000) return `${(samples / 1000).toFixed(0)}K+`
  return samples.toString()
}

export const getModelById = (id: string): MLModel | undefined => {
  return ML_MODELS.find((model) => model.id === id)
}

export const getConnectedModelsCount = (): number => {
  return ML_MODELS.filter((model) => model.status === "connected").length
}

export const getTotalSamples = (): number | null => {
  const samples = ML_MODELS.reduce((total, model) => {
    if (model.dataset.samples === null) return total
    return total + model.dataset.samples
  }, 0)
  return samples === 0 ? null : samples
}

export const getAverageAccuracy = (): number | null => {
  const validMetrics = ML_MODELS.filter(
    (model) => model.metrics.accuracy !== null
  )
  if (validMetrics.length === 0) return null
  
  const sum = validMetrics.reduce(
    (total, model) => total + (model.metrics.accuracy || 0),
    0
  )
  return sum / validMetrics.length
}

export const getColorClasses = (color: string) => {
  const colors: Record<string, { bg: string; text: string; icon: string; border: string }> = {
    green: { 
      bg: "bg-green-50", 
      text: "text-green-700", 
      icon: "text-green-600",
      border: "border-green-200"
    },
    red: { 
      bg: "bg-red-50", 
      text: "text-red-700", 
      icon: "text-red-600",
      border: "border-red-200"
    },
    blue: { 
      bg: "bg-blue-50", 
      text: "text-blue-700", 
      icon: "text-blue-600",
      border: "border-blue-200"
    },
    amber: { 
      bg: "bg-amber-50", 
      text: "text-amber-700", 
      icon: "text-amber-600",
      border: "border-amber-200"
    },
  }
  return colors[color] || colors.blue
}

/**
 * Example: How to connect a model
 * 
 * Simply update the model configuration above:
 * 
 * {
 *   ...
 *   status: "connected",  // Change from "not-connected"
 *   metrics: {
 *     accuracy: 0.945,    // Add actual values (as decimals, not percentages)
 *     precision: 0.932,
 *     recall: 0.951,
 *     f1Score: 0.941,
 *   },
 *   dataset: {
 *     samples: 10000,     // Add actual sample count
 *     description: "..."
 *   }
 * }
 */

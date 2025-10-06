/**
 * Machine Learning Models Configuration
 * Central data structure for ML model information across the application
 * 
 * Update model properties here to sync across:
 * - ML Models page (/ml-models)
 * - Dashboard Analytics page (/dashboard/analytics)
 * - Dashboard Predictions page (/dashboard/predictions)
 */

import { Activity, TrendingUp, LucideIcon } from "lucide-react"

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
    id: "gait-pattern-recognition",
    name: "Gait Pattern Recognition",
    icon: Activity,
    type: "CNN-LSTM Hybrid",
    objective: "Provides real-time gait analysis by identifying subtle walking patterns and anomalies that may indicate potential health issues.",
    status: "not-connected", // Change to "connected" when model is ready
    
    metrics: {
      accuracy: null,  // Will show as N/A
      precision: null,
      recall: null,
      f1Score: null,
    },
    
    useCases: [
      "Early detection of gait abnormalities",
      "Fall risk assessment",
      "Rehabilitation progress tracking",
      "Neurological disorder screening",
    ],
    
    dataset: {
      samples: null, // Will show as N/A
      description: "Gait cycle recordings from MPU6050 sensor data",
    },
    
    githubUrl: "https://github.com/your-org/gait-recognition-model",
    dashboardUrl: "/dashboard/predictions",
    
    color: "green",
  },
  {
    id: "cardiovascular-health-predictor",
    name: "Cardiovascular Health Predictor",
    icon: TrendingUp,
    type: "Random Forest Ensemble",
    objective: "Predicts cardiovascular health risks by analyzing heart rate variability patterns and identifying anomalies that may indicate underlying cardiac conditions.",
    status: "not-connected", // Change to "connected" when model is ready
    
    metrics: {
      accuracy: null,  // Will show as N/A
      precision: null,
      recall: null,
      f1Score: null,
    },
    
    useCases: [
      "Cardiovascular disease risk prediction",
      "Arrhythmia detection",
      "Stress level monitoring",
      "Athletic performance optimization",
    ],
    
    dataset: {
      samples: null, // Will show as N/A
      description: "Heart rate samples from MAX30102 sensor data",
    },
    
    githubUrl: "https://github.com/your-org/cardiovascular-predictor",
    dashboardUrl: "/dashboard/predictions",
    
    color: "red",
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

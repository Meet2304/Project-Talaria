# ML Models Synchronization & Configuration System

## Date: October 7, 2025

## Overview
Implemented a centralized configuration system for ML models that synchronizes data across the ML Models page and Dashboard Analytics page. All model information is managed through a single source of truth with automatic N/A display for disconnected models.

---

## Architecture

### Central Configuration File
**Location:** `src/lib/ml-models-config.ts`

This file contains:
- ML model data structure
- Model configurations
- Utility functions for formatting
- Color scheme definitions

### Data Flow
```
ml-models-config.ts (Single Source of Truth)
    ↓
    ├──→ ML Models Page (/ml-models)
    ├──→ Dashboard Analytics (/dashboard/analytics)
    └──→ Dashboard Predictions (/dashboard/predictions)

All three pages display the SAME 2 models with IDENTICAL information:
- Gait Pattern Recognition
- Cardiovascular Health Predictor
```

---

## Model Configuration Structure

### TypeScript Interface
```typescript
interface MLModel {
  id: string                    // Unique identifier
  name: string                  // Model name
  icon: LucideIcon             // Icon component
  type: string                  // Model architecture type
  objective: string             // Model purpose
  status: ModelStatus           // "connected" | "training" | "not-connected"
  
  metrics: {                    // Evaluation metrics (null = N/A)
    accuracy: number | null
    precision: number | null
    recall: number | null
    f1Score: number | null
  }
  
  useCases: string[]            // Array of use cases
  
  dataset: {
    samples: number | null      // Training samples count (null = N/A)
    description: string
  }
  
  githubUrl: string             // Link to GitHub repository
  dashboardUrl: string          // Link to dashboard predictions
  color: "green" | "red" | "blue" | "amber"  // Color theme
}
```

---

## Current Configuration

### Model 1: Gait Pattern Recognition
```typescript
{
  id: "gait-pattern-recognition",
  name: "Gait Pattern Recognition",
  type: "CNN-LSTM Hybrid",
  status: "not-connected",      // ← Change to "connected" when ready
  metrics: {
    accuracy: null,             // ← Shows as "N/A"
    precision: null,
    recall: null,
    f1Score: null,
  },
  dataset: {
    samples: null,              // ← Shows as "N/A"
    description: "Gait cycle recordings from MPU6050 sensor data"
  }
}
```

### Model 2: Cardiovascular Health Predictor
```typescript
{
  id: "cardiovascular-health-predictor",
  name: "Cardiovascular Health Predictor",
  type: "Random Forest Ensemble",
  status: "not-connected",      // ← Change to "connected" when ready
  metrics: {
    accuracy: null,             // ← Shows as "N/A"
    precision: null,
    recall: null,
    f1Score: null,
  },
  dataset: {
    samples: null,              // ← Shows as "N/A"
    description: "Heart rate samples from MAX30102 sensor data"
  }
}
```

---

## How to Connect Models

### Step 1: Update Model Status
Change `status` from `"not-connected"` to `"connected"`:

```typescript
status: "connected",  // Previously: "not-connected"
```

### Step 2: Add Metrics
Fill in actual metrics as decimals (0-1 range):

```typescript
metrics: {
  accuracy: 0.945,    // 94.5%
  precision: 0.932,   // 93.2%
  recall: 0.951,      // 95.1%
  f1Score: 0.941,     // 94.1%
}
```

### Step 3: Add Dataset Information
Provide training sample count:

```typescript
dataset: {
  samples: 10000,     // Number of training samples
  description: "Gait cycle recordings from MPU6050 sensor data"
}
```

### Complete Example
```typescript
{
  id: "gait-pattern-recognition",
  name: "Gait Pattern Recognition",
  icon: Activity,
  type: "CNN-LSTM Hybrid",
  objective: "Provides real-time gait analysis...",
  status: "connected",  // ✅ Connected
  
  metrics: {
    accuracy: 0.945,    // ✅ 94.5%
    precision: 0.932,   // ✅ 93.2%
    recall: 0.951,      // ✅ 95.1%
    f1Score: 0.941,     // ✅ 94.1%
  },
  
  useCases: [...],
  
  dataset: {
    samples: 10000,     // ✅ 10K+
    description: "Gait cycle recordings from MPU6050 sensor data"
  },
  
  githubUrl: "https://github.com/your-org/gait-recognition-model",
  dashboardUrl: "/dashboard/predictions",
  color: "green",
}
```

---

## Utility Functions

### Format Metrics
```typescript
formatMetric(value: number | null): string
// null → "N/A"
// 0.945 → "94.5%"
```

### Format Samples
```typescript
formatSamples(samples: number | null): string
// null → "N/A"
// 10000 → "10K+"
// 500 → "500"
```

### Get Connected Models Count
```typescript
getConnectedModelsCount(): number
// Returns number of models with status "connected"
```

### Get Average Accuracy
```typescript
getAverageAccuracy(): number | null
// Returns average accuracy of connected models
// null if no models are connected
```

---

## Page Implementations

### ML Models Page (/ml-models)
**Design:** Side-by-side minimalistic layout

**Features:**
- 2-column grid on desktop
- Compact card design
- Connection status badges
- N/A for disconnected models
- GitHub and Try Model buttons
- Clean spacing and typography

**Layout:**
```
┌─────────────────┬─────────────────┐
│   Model 1       │   Model 2       │
│   [Icon] Name   │   [Icon] Name   │
│   Badge         │   Badge         │
│                 │                 │
│   Objective     │   Objective     │
│                 │                 │
│   Metrics Grid  │   Metrics Grid  │
│   (2x2)         │   (2x2)         │
│                 │                 │
│   Dataset Info  │   Dataset Info  │
│                 │                 │
│   [GitHub] [Try]│   [GitHub] [Try]│
└─────────────────┴─────────────────┘
```

---

### Dashboard Analytics Page
**Design:** Integrated model performance section

**Features:**
- Added "ML Model Performance" card
- 2-column grid for models
- Compact metrics display (Accuracy + F1 Score only)
- Status badges
- Synced with ML Models page data
- Shows same 2 models

**Location:** After main chart, before additional charts

---

### Dashboard Predictions Page
**Design:** Full model details with predictions

**Features:**
- Displays both models in 2-column grid
- Complete model information cards
- All 4 metrics (Accuracy, Precision, Recall, F1 Score)
- Dataset information
- Use cases (top 3)
- GitHub link buttons
- Status badges (Active/Not Connected)
- Dynamic status message showing connected count
- Synced with ML Models page data

**Layout:**
```
┌─────────────────────────────────┐
│   Model Card 1                  │
│   [Icon] Name        [Badge]    │
│   Type • Objective              │
│                                 │
│   ┌────────┬────────┐          │
│   │Accuracy│Precision│          │
│   │  N/A   │   N/A   │          │
│   ├────────┼────────┤          │
│   │ Recall │F1 Score│          │
│   │  N/A   │   N/A   │          │
│   └────────┴────────┘          │
│                                 │
│   Training Dataset              │
│   N/A samples                   │
│                                 │
│   Key Use Cases:                │
│   • Use case 1                  │
│   • Use case 2                  │
│   • Use case 3                  │
│                                 │
│   [View Model on GitHub]        │
└─────────────────────────────────┘
```

**Location:** Main content area of predictions page

---

## Visual Design

### Minimalistic Layout Principles
✅ Clean white backgrounds  
✅ Minimal borders (light slate-200)  
✅ Compact padding and spacing  
✅ Small, clear typography  
✅ Badge indicators for status  
✅ Subtle hover effects  
✅ No gradients or heavy shadows  

### Color System
```typescript
green: { bg: "bg-green-50", icon: "text-green-600", border: "border-green-200" }
red:   { bg: "bg-red-50", icon: "text-red-600", border: "border-red-200" }
blue:  { bg: "bg-blue-50", icon: "text-blue-600", border: "border-blue-200" }
amber: { bg: "bg-amber-50", icon: "text-amber-600", border: "border-amber-200" }
```

---

## Default Display (Models Not Connected)

### ML Models Page
```
┌──────────────────────────────┐
│ [Icon] Gait Pattern Recognition │
│ [Badge: Not Connected]       │
│ CNN-LSTM Hybrid              │
│                              │
│ Objective description...     │
│                              │
│ ┌────────┬────────┐         │
│ │Accuracy│Precision│         │
│ │  N/A   │   N/A   │         │
│ ├────────┼────────┤         │
│ │ Recall │F1 Score│         │
│ │  N/A   │   N/A   │         │
│ └────────┴────────┘         │
│                              │
│ Training Dataset: N/A samples│
│                              │
│ [GitHub]  [Try Model]        │
└──────────────────────────────┘
```

### Dashboard Analytics
```
ML Model Performance
├─ Gait Pattern Recognition
│  [Inactive Badge]
│  Accuracy: N/A  |  F1: N/A
│  Dataset: N/A samples
│
└─ Cardiovascular Health
   [Inactive Badge]
   Accuracy: N/A  |  F1: N/A
   Dataset: N/A samples
```

---

## Benefits

### ✅ Single Source of Truth
- Update once, changes everywhere
- No data duplication
- Consistent information across pages

### ✅ Easy Model Connection
- Simple boolean status change
- Add metrics and it works
- No code refactoring needed

### ✅ Automatic N/A Handling
- Null values display as N/A
- No manual string updates
- Type-safe implementation

### ✅ Minimalistic Design
- Clean, uncluttered layout
- Easy to scan information
- Professional appearance

### ✅ Scalable
- Add more models easily
- Consistent formatting
- Maintainable codebase

---

## Usage Examples

### Check Current Configuration
```typescript
import { ML_MODELS } from "@/lib/ml-models-config"

console.log(ML_MODELS)
// See all model configurations
```

### Get Specific Model
```typescript
import { getModelById } from "@/lib/ml-models-config"

const model = getModelById("gait-pattern-recognition")
console.log(model.status)  // "not-connected"
```

### Get Statistics
```typescript
import { getConnectedModelsCount, getAverageAccuracy } from "@/lib/ml-models-config"

const connected = getConnectedModelsCount()  // 0
const avgAccuracy = getAverageAccuracy()     // null
```

---

## Future Enhancements

1. **Real-time Updates**: WebSocket connection for live metrics
2. **Historical Tracking**: Store model performance over time
3. **Model Versioning**: Track different versions of models
4. **A/B Testing**: Compare model performance
5. **Auto-deployment**: Connect to CI/CD pipeline
6. **Model Monitoring**: Add alerts for performance degradation
7. **Export**: Download model reports as PDF/CSV

---

## Files Modified

1. **Created**: `src/lib/ml-models-config.ts` - Central configuration
2. **Modified**: `src/app/ml-models/page.tsx` - Side-by-side layout
3. **Modified**: `src/app/dashboard/analytics/page.tsx` - Added ML section
4. **Modified**: `src/app/dashboard/predictions/page.tsx` - Synced with ML models config

---

## Page Comparison

### All Three Pages Show the SAME 2 Models:

| Page | Display Style | Metrics Shown | Additional Features |
|------|--------------|---------------|-------------------|
| **ML Models** | Side-by-side cards | All 4 (Acc, Prec, Rec, F1) | Dataset info, GitHub + Try buttons |
| **Analytics** | Compact grid | 2 (Acc, F1) | Minimal dashboard view |
| **Predictions** | Detailed cards | All 4 (Acc, Prec, Rec, F1) | Use cases, GitHub button |

**Key Point:** Updating `ml-models-config.ts` updates ALL three pages simultaneously!

---

## Summary

✅ Centralized model configuration  
✅ Automatic N/A display for disconnected models  
✅ Synchronized across **3 pages**: ML Models, Analytics, and Predictions  
✅ Side-by-side minimalistic layout  
✅ Easy to connect actual models  
✅ Type-safe TypeScript implementation  
✅ Professional, clean design  
✅ **Only 2 models displayed consistently across all pages**

**Next Step:** Connect your actual ML models by updating the configuration in `ml-models-config.ts`

---

Made on Earth, by Humans  
© 2025 Talaria. All rights reserved.

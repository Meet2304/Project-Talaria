# Firebase ML Model Setup Guide

## Overview
This guide explains how to set up your LSTM TensorFlow Lite model with Firebase ML for use with the Talaria web application.

## Prerequisites
- Your trained LSTM model in `.tflite` format
- Firebase project with ML enabled
- TensorFlow.js Converter tool
- Firebase CLI installed

## Architecture

The application uses **Firebase ML (Machine Learning)** to host and serve the model, not Firebase Storage. This provides:
- Automatic model versioning
- Better model management
- Optimized delivery
- Integration with Firebase ecosystem

## Step 1: Convert TFLite Model to TensorFlow.js Format

Firebase ML for web requires models in TensorFlow.js format, not `.tflite`.

### Option A: Convert from SavedModel
If you have the original SavedModel:

```bash
# Install the converter
pip install tensorflowjs

# Convert to TensorFlow.js format
tensorflowjs_converter \
    --input_format=tf_saved_model \
    --output_format=tfjs_graph_model \
    --signature_name=serving_default \
    --saved_model_tags=serve \
    /path/to/saved_model \
    /path/to/output/tfjs_model
```

### Option B: Convert from TFLite
If you only have the `.tflite` file:

```python
import tensorflow as tf

# Load TFLite model
interpreter = tf.lite.Interpreter(model_path="model.tflite")
interpreter.allocate_tensors()

# You'll need to recreate the model architecture
# Save it as SavedModel, then convert to TensorFlow.js
# This is model-specific based on your LSTM architecture
```

## Step 2: Upload Model to Firebase ML

### Using Firebase Console:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Machine Learning** section
4. Click **Custom Models** tab
5. Click **Add Model**
6. Name: `Talaria-LSTM-v2`
7. Upload the converted TensorFlow.js model files (`model.json` and weight shards)

### Using Firebase CLI:
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Deploy the model
firebase ml:models:upload \
    --project your-project-id \
    --name Talaria-LSTM-v2 \
    --path /path/to/tfjs_model
```

## Step 3: Configure Environment Variables

Ensure your `.env.local` file has the required Firebase configuration:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

## Step 4: Enable Firebase ML API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project
3. Navigate to **APIs & Services** → **Library**
4. Search for "Firebase ML API"
5. Click **Enable**

## Model Access Configuration

### For Web Applications:
The model is accessed via Firebase ML REST API. The application will:
1. Request model metadata from Firebase ML
2. Get the download URL
3. Load the TensorFlow.js model
4. Run inference in the browser

## Model Input Format

Your LSTM model expects:
- **Input Shape**: `[batch_size, 50, 15]`
  - `batch_size`: 1 (single prediction)
  - `50`: Number of time steps (samples)
  - `15`: Number of features per sample

### Features (in order):
1. AccX
2. AccY
3. AccZ
4. GyroX
5. GyroY
6. GyroZ
7. Aroll
8. Apitch
9. Groll
10. Gpitch
11. Gy
12. Combroll
13. Combpitch
14. Heart Rate
15. SpO2

## Input Data Format Examples

### CSV Format
```csv
0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 72, 98
0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.4, 73, 97
... (48 more rows for total of 50 samples)
```

### JSON Format
```json
[
  [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 72, 98],
  [0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.4, 73, 97],
  ...
]
```

## Using the Model

1. Navigate to **Dashboard → Predictions**
2. Click **"Load Model"** button
3. Wait for the model to download and initialize
4. Input your data (CSV or JSON format)
5. Click **"Run Inference"**
6. View the prediction results

## Features

- ✅ Load model from Firebase Storage
- ✅ Input validation (50 samples × 15 features)
- ✅ CSV and JSON input support
- ✅ Download input template
- ✅ Real-time prediction results
- ✅ Confidence scores for all classes
- 🔄 Load latest sensor data (coming soon)

## Troubleshooting

### "Failed to load model"
- **Check Firebase ML Console**: Verify model "Talaria-LSTM-v2" exists in Firebase ML
- **Verify API is enabled**: Ensure Firebase ML API is enabled in Google Cloud Console
- **Check environment variables**: Confirm `NEXT_PUBLIC_FIREBASE_PROJECT_ID` and `NEXT_PUBLIC_FIREBASE_API_KEY` are set
- **Model format**: Ensure model is in TensorFlow.js format (not .tflite)
- **Browser console**: Check for detailed error messages

### "Model download URL not found"
- The model must be in TensorFlow.js format
- Check if the model was uploaded correctly to Firebase ML
- Verify the model name matches exactly: "Talaria-LSTM-v2"

### "Firebase project ID not configured"
- Add `NEXT_PUBLIC_FIREBASE_PROJECT_ID` to your `.env.local` file
- Restart the development server after adding environment variables

### "Invalid input format"
- Ensure you have exactly 50 samples
- Ensure each sample has exactly 15 features
- Check for missing commas in CSV or brackets in JSON

### Model loads but predictions are incorrect
- Verify the model was converted correctly from .tflite to TensorFlow.js
- Check that input features are in the correct order
- Ensure data is properly normalized (same as training data)
- Check model input/output shapes match expectations

### CORS Errors
- Firebase ML API should handle CORS automatically
- If issues persist, check Firebase project settings
- Verify API key has proper permissions

## Technical Notes

### Firebase ML vs Firebase Storage
- **Firebase ML** (used now): Designed for ML model hosting, better versioning, optimized delivery
- **Firebase Storage** (previous approach): General file storage, requires manual URL management

### Model Format Requirements
- Must be TensorFlow.js format (not .tflite)
- .tflite models must be converted first
- Model files: `model.json` + weight shard files

### API Endpoints
The application uses Firebase ML REST API:
```
https://firebaseml.googleapis.com/v1beta2/projects/{projectId}/models/{modelName}:download
```

### Security
- Model access uses Firebase API key
- Consider implementing authentication for production
- API key should be restricted to specific domains in Firebase Console

## Model Information

Current model configuration in `src/lib/ml-models-config.ts`:

```typescript
{
  name: "LSTM Gait & Cardiovascular Analyzer",
  type: "LSTM Neural Network",
  status: "connected",
  metrics: {
    accuracy: 0.92,
    precision: 0.89,
    recall: 0.91,
    f1Score: 0.90,
  },
  dataset: {
    samples: 50000,
    description: "50-sample sequences of 15 features..."
  }
}
```

Update these values to match your actual model's performance metrics.

## Next Steps

1. Convert your `.tflite` model to TensorFlow.js format
2. Upload to Firebase Storage
3. Test the model with sample data
4. Integrate with real-time sensor data fetching
5. Add custom class labels for prediction results

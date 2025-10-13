# Talaria - Machine Learning Integration

## 🤖 Overview

Talaria integrates an LSTM (Long Short-Term Memory) neural network deployed on Google Cloud Vertex AI for time-series forecasting of sensor data. The model predicts future sensor values based on historical patterns.

---

## 📊 Model Details

### Model Type: LSTM Time-Series Forecasting

**Architecture:**
- Neural Network: LSTM (Long Short-Term Memory)
- Task: Regression (Time-Series Forecasting)
- Framework: TensorFlow/Keras
- Deployment: Google Cloud Vertex AI

### What It Does

The model analyzes **50 consecutive timesteps** of sensor data and predicts the **next timestep's values** for all 15 sensor features.

**Input:**
- Shape: `[1, 50, 15]`
- 1 batch
- 50 timesteps (samples)
- 15 features per timestep

**Output:**
- Shape: `[15]`
- 15 predicted values (one for each sensor feature)
- These are **continuous values**, not classification probabilities

---

## 📈 Model Performance

### Metrics

| Metric | Value | Description |
|--------|-------|-------------|
| **R² Score** | 96.99% | Coefficient of determination - how well predictions match actual values |
| **MAE** | 0.103 | Mean Absolute Error - average prediction error |
| **RMSE** | 0.174 | Root Mean Square Error - prediction error magnitude |

### Interpretation

- **R² of 96.99%** means the model explains 97% of variance in the data
- **Low MAE and RMSE** indicate accurate predictions
- Model performs consistently across all 15 features

---

## 🔬 Sensor Features

The model uses 15 sensor features in a specific order:

### 1-2: Cardiovascular Sensors (MAX30102)
| # | Feature | Description | Unit | Range |
|---|---------|-------------|------|-------|
| 1 | **HR** | Heart Rate | bpm | 40-220 |
| 2 | **SpO2** | Blood Oxygen Saturation | % | 70-100 |

### 3-5: Accelerometer (MPU6050)
| # | Feature | Description | Unit | Range |
|---|---------|-------------|------|-------|
| 3 | **AccX** | Acceleration X-axis | m/s² | -16 to +16 |
| 4 | **AccY** | Acceleration Y-axis | m/s² | -16 to +16 |
| 5 | **AccZ** | Acceleration Z-axis | m/s² | -16 to +16 |

### 6-8: Gyroscope (MPU6050)
| # | Feature | Description | Unit | Range |
|---|---------|-------------|------|-------|
| 6 | **GyroX** | Angular Velocity X-axis | °/s | -250 to +250 |
| 7 | **GyroY** | Angular Velocity Y-axis | °/s | -250 to +250 |
| 8 | **GyroZ** | Angular Velocity Z-axis | °/s | -250 to +250 |

### 9-15: Orientation Angles
| # | Feature | Description | Unit | Range |
|---|---------|-------------|------|-------|
| 9 | **Aroll** | Accelerometer Roll | degrees | -180 to +180 |
| 10 | **Apitch** | Accelerometer Pitch | degrees | -90 to +90 |
| 11 | **Groll** | Gyroscope Roll | degrees | -180 to +180 |
| 12 | **Gpitch** | Gyroscope Pitch | degrees | -90 to +90 |
| 13 | **Gy** | Gyroscope Yaw | degrees | -180 to +180 |
| 14 | **Combroll** | Combined Roll | degrees | -180 to +180 |
| 15 | **Combpitch** | Combined Pitch | degrees | -90 to +90 |

---

## 🎯 Use Cases

### 1. Predictive Health Monitoring
- Forecast heart rate trends
- Predict SpO2 changes
- Early detection of anomalies

### 2. Gait Pattern Analysis
- Predict movement patterns
- Identify irregular gaits
- Track rehabilitation progress

### 3. Real-Time Forecasting
- Anticipate sensor values
- Proactive health alerts
- Trend visualization

---

## 🔧 Integration Architecture

### Vertex AI Endpoint

**Location:** Google Cloud Vertex AI
**Deployment:** Custom container with TensorFlow Serving
**Endpoint Type:** Online prediction (real-time)

### API Integration

**Endpoint:** `/api/vertex-ai/predict`

**Request Format:**
```json
{
  "data": [
    [75.2, 98.5, 0.15, -0.03, 9.81, ...],  // Sample 1
    [76.1, 98.7, 0.18, -0.02, 9.79, ...],  // Sample 2
    ...                                     // 48 more samples
  ],
  "modelType": "vertex-ai"
}
```

**Response Format:**
```json
{
  "success": true,
  "prediction": {
    "predictedValues": [
      77.3,    // Predicted HR
      98.8,    // Predicted SpO2
      0.21,    // Predicted AccX
      ...      // 12 more values
    ],
    "features": [
      "HR", "SpO2", "AccX", "AccY", "AccZ",
      "GyroX", "GyroY", "GyroZ",
      "Aroll", "Apitch", "Groll", "Gpitch", "Gy",
      "Combroll", "Combpitch"
    ],
    "confidence": 0.97,
    "metadata": {
      "modelType": "LSTM Time-Series Forecasting",
      "description": "Predicts next timestep's sensor values",
      "r2Score": 0.9699,
      "mae": 0.103,
      "rmse": 0.174
    }
  },
  "timestamp": "2025-10-13T10:30:00Z"
}
```

---

## 📥 Data Input Methods

### Method 1: Load from Firebase

1. Navigate to **Dashboard → Predictions**
2. Select **"Load from Firebase"** tab
3. Choose device from dropdown
4. Click **"Load Latest 50 Samples"**
5. Data automatically formatted for inference

**Advantages:**
- Uses real sensor data
- Automatic formatting
- Chronologically ordered
- No manual data preparation

### Method 2: Manual CSV Input

**Format Requirements:**
- 50 rows (samples)
- 15 columns (features)
- No headers
- Comma-separated values

**Example:**
```csv
75.2,98.5,0.15,-0.03,9.81,2.5,-1.2,0.8,5.2,-2.1,4.8,-2.3,0.5,5.0,-2.2
76.1,98.7,0.18,-0.02,9.79,2.6,-1.1,0.9,5.3,-2.0,4.9,-2.2,0.6,5.1,-2.1
...
```

**How to Use:**
1. Prepare CSV file with 50 rows
2. Copy entire content
3. Paste in **Manual Input** textarea
4. Click **Run Inference**

### Method 3: Generate Random Data (Testing)

For quick testing without real data:

1. Click **"Generate Random Data"** button
2. System generates realistic random values:
   - HR: 60-180 bpm
   - SpO2: 90-100%
   - Accelerometer: realistic motion ranges
   - Gyroscope: typical angular velocities
3. Data auto-populates in textarea
4. Click **Run Inference**

---

## 🔐 Authentication Setup

### Local Development

Use Application Default Credentials:

```bash
# Install Google Cloud CLI
# https://cloud.google.com/sdk/docs/install

# Authenticate
gcloud auth application-default login

# Set project
gcloud config set project YOUR_PROJECT_ID
```

### Production Deployment (Vercel)

1. **Create Service Account:**
   - Go to [IAM & Admin](https://console.cloud.google.com/iam-admin/serviceaccounts)
   - Create service account: `talaria-vertex-ai`
   - Grant role: **Vertex AI User**
   - Create JSON key

2. **Add to Vercel:**
   - Project Settings → Environment Variables
   - Add variable: `GOOGLE_SERVICE_ACCOUNT_KEY`
   - Value: Entire JSON content (as string)
   - Apply to: Production, Preview, Development

3. **Verify:**
   ```bash
   # Check in Vercel logs
   console.log(process.env.GOOGLE_SERVICE_ACCOUNT_KEY ? 'Set' : 'Missing')
   ```

---

## 🚀 Usage Examples

### Example 1: Check API Status

**Request:**
```bash
curl https://your-app.vercel.app/api/vertex-ai/predict
```

**Response:**
```json
{
  "status": "ready",
  "config": {
    "projectId": "your-project-id",
    "location": "us-central1",
    "endpointId": "1234567890",
    "authenticated": true
  },
  "message": "Vertex AI API is configured and ready"
}
```

### Example 2: Run Prediction

**Request:**
```javascript
const response = await fetch('/api/vertex-ai/predict', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    data: sensorData,  // 50×15 array
    modelType: 'vertex-ai'
  })
});

const result = await response.json();
console.log(result.prediction.predictedValues);
```

### Example 3: Load from Firebase

```javascript
// Component handles this automatically
// User selects device → clicks Load → system:
// 1. Queries latest 50 samples
// 2. Formats as 50×15 array
// 3. Ready for inference
```

---

## 🎨 Result Visualization

Predictions are displayed with color-coded categories:

| Category | Features | Color |
|----------|----------|-------|
| **Cardiovascular** | HR, SpO2 | 🔴 Red |
| **Accelerometer** | AccX, AccY, AccZ | 🔵 Blue |
| **Gyroscope** | GyroX, GyroY, GyroZ, Gy | 🟢 Green |
| **Orientation** | Aroll, Apitch, Groll, Gpitch, Combroll, Combpitch | 🟣 Purple |

Each prediction shows:
- Feature name
- Predicted value (rounded to 3 decimals)
- Feature description
- Color-coded badge

---

## 🐛 Troubleshooting

### Error: "API configuration incomplete"

**Cause:** Missing environment variables

**Solution:**
```bash
# Verify in .env.local:
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_CLOUD_LOCATION=us-central1
VERTEX_AI_ENDPOINT_ID=your-endpoint-id
```

### Error: "Authentication failed"

**Cause:** Invalid or missing credentials

**Solutions:**
- **Local:** Run `gcloud auth application-default login`
- **Vercel:** Check `GOOGLE_SERVICE_ACCOUNT_KEY` is set correctly

### Error: "Endpoint not found"

**Cause:** Incorrect endpoint ID or not deployed

**Solution:**
1. Go to [Vertex AI Endpoints](https://console.cloud.google.com/vertex-ai/endpoints)
2. Verify endpoint exists and is deployed
3. Copy correct endpoint ID
4. Update environment variable

### Error: "Invalid input shape"

**Cause:** Data doesn't match required 50×15 shape

**Solution:**
- Ensure exactly 50 samples
- Each sample must have 15 features
- Features in correct order
- No missing values

### Slow Response Times

**Causes & Solutions:**
- **Cold start:** First request after inactivity takes longer (expected)
- **Large payload:** Ensure data is compressed
- **Network:** Check connection to Google Cloud
- **Endpoint:** Verify endpoint scaling settings

---

## 💰 Cost Considerations

### Vertex AI Pricing

**Online Prediction:**
- ~$0.00004 per prediction
- ~$0.04 per 1,000 predictions
- ~$40 per 1,000,000 predictions

**Compute Hours:**
- Charged when endpoint is deployed
- ~$0.11 per hour for n1-standard-2
- Consider auto-scaling to minimize costs

### Optimization Tips

1. **Batch Predictions** (future enhancement)
   - Group multiple predictions
   - Reduce API calls
   - Lower costs

2. **Caching** (future enhancement)
   - Cache recent predictions
   - Avoid redundant calls
   - Faster response times

3. **Monitoring**
   - Set billing alerts in GCP Console
   - Monitor usage patterns
   - Optimize based on usage

---

## 🔮 Future Enhancements

### Planned Features

- [ ] **Batch Prediction API** - Process multiple sequences at once
- [ ] **Prediction Caching** - Store recent predictions
- [ ] **Confidence Intervals** - Show prediction uncertainty
- [ ] **Anomaly Detection** - Flag unusual predictions
- [ ] **Historical Comparison** - Compare predictions vs actual
- [ ] **Model Versioning** - Support multiple model versions
- [ ] **A/B Testing** - Compare different models
- [ ] **Offline Mode** - Client-side inference with TensorFlow.js

### Model Improvements

- [ ] Retrain with more data
- [ ] Add attention mechanisms
- [ ] Multi-step forecasting (predict multiple timesteps)
- [ ] Ensemble models for better accuracy
- [ ] Transfer learning for individual users

---

## 📚 Related Documentation

- **Vertex AI Official Docs:** [cloud.google.com/vertex-ai/docs](https://cloud.google.com/vertex-ai/docs)
- **TensorFlow Serving:** [tensorflow.org/tfx/guide/serving](https://www.tensorflow.org/tfx/guide/serving)
- **LSTM Networks:** [colah.github.io/posts/2015-08-Understanding-LSTMs](https://colah.github.io/posts/2015-08-Understanding-LSTMs/)

---

**Last Updated:** October 2025

**See Also:**
- [SETUP.md](./SETUP.md) - Initial setup
- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide

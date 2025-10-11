# Local Model Setup Guide

## ✅ Setup Complete! Next Steps:

The code has been updated to load your TensorFlow.js model from local files instead of Firebase Storage. Follow these simple steps to complete the setup:

---

## 📁 Step 1: Copy Model Files

### Source Location:
```
C:\Meet\Projects\Project_9_Talaria_Integrated Footwear System for Concurrent Cardiovascular and Gait Analysis\Project-Talaria\Machine Learning Model\tfjs_model_output\
```

### Target Location:
```
C:\Meet\Projects\Project_9_Talaria_Integrated Footwear System for Concurrent Cardiovascular and Gait Analysis\Project-Talaria\Talaria\public\models\Talaria-LSTM-v2\
```

### Files to Copy:
✅ **The directory `public/models/Talaria-LSTM-v2/` has already been created for you!**

Now copy these files from your `tfjs_model_output` folder:
- `model.json` (required - main model file)
- All `.bin` files (weight files - usually named like `group1-shard1of1.bin`)

### Quick Copy Command (PowerShell):
```powershell
Copy-Item "C:\Meet\Projects\Project_9_Talaria_Integrated Footwear System for Concurrent Cardiovascular and Gait Analysis\Project-Talaria\Machine Learning Model\tfjs_model_output\*" -Destination "C:\Meet\Projects\Project_9_Talaria_Integrated Footwear System for Concurrent Cardiovascular and Gait Analysis\Project-Talaria\Talaria\public\models\Talaria-LSTM-v2\" -Recurse
```

### Manual Copy Steps:
1. Open File Explorer
2. Navigate to your `Machine Learning Model\tfjs_model_output\` folder
3. Select `model.json` and all `.bin` files
4. Copy them (Ctrl+C)
5. Navigate to `Talaria\public\models\Talaria-LSTM-v2\`
6. Paste (Ctrl+V)

---

## 🚀 Step 2: Verify File Structure

After copying, your folder structure should look like:
```
Talaria/
└── public/
    └── models/
        └── Talaria-LSTM-v2/
            ├── model.json
            └── group1-shard1of1.bin (or similar .bin files)
```

**Verify files exist:**
```powershell
ls "C:\Meet\Projects\Project_9_Talaria_Integrated Footwear System for Concurrent Cardiovascular and Gait Analysis\Project-Talaria\Talaria\public\models\Talaria-LSTM-v2\"
```

---

## 🔧 Step 3: Start Development Server

If your server is already running, **restart it** so Next.js picks up the new files:

1. Stop current server: Press `Ctrl+C` in the terminal
2. Start again:
```powershell
cd "C:\Meet\Projects\Project_9_Talaria_Integrated Footwear System for Concurrent Cardiovascular and Gait Analysis\Project-Talaria\Talaria"
npm run dev
```

---

## 🧪 Step 4: Test Model Loading

1. Open your browser to http://localhost:3000
2. Navigate to **Dashboard** → **Predictions**
3. Click **"Load Model"** button
4. Watch the console for logs:
   - ✅ Success: "Model loaded successfully!"
   - ❌ Error: Check troubleshooting section below

---

## 📊 Understanding Your Model

### Input Requirements:
- **Shape**: `[1, 50, 15]`
  - 1 batch
  - 50 time steps (samples)
  - 15 features per sample

### Feature Order (MUST match training):
1. HR (Heart Rate)
2. SpO2 (Blood Oxygen Saturation)
3. AccX (Accelerometer X)
4. AccY (Accelerometer Y)
5. AccZ (Accelerometer Z)
6. GyroX (Gyroscope X)
7. GyroY (Gyroscope Y)
8. GyroZ (Gyroscope Z)
9. Aroll (Accelerometer Roll)
10. Apitch (Accelerometer Pitch)
11. Groll (Gyroscope Roll)
12. Gpitch (Gyroscope Pitch)
13. Gy (Gyroscope Yaw)
14. Combroll (Combined Roll)
15. Combpitch (Combined Pitch)

---

## 🔢 Scaler Integration (Next Step)

Your model was trained with a scaler (StandardScaler or MinMaxScaler). You'll need to apply the same scaling to inference data.

### Option 1: Export Scaler to JSON (Recommended)

Create a Python script to export scaler parameters:

```python
import pickle
import json
import numpy as np

# Load your scaler
with open('path/to/your/scaler.pkl', 'rb') as f:
    scaler = pickle.load(f)

# Export scaler parameters
scaler_params = {
    'type': scaler.__class__.__name__,  # 'StandardScaler' or 'MinMaxScaler'
    'mean': scaler.mean_.tolist() if hasattr(scaler, 'mean_') else None,
    'scale': scaler.scale_.tolist() if hasattr(scaler, 'scale_') else None,
    'min': scaler.min_.tolist() if hasattr(scaler, 'min_') else None,
    'data_min': scaler.data_min_.tolist() if hasattr(scaler, 'data_min_') else None,
    'data_max': scaler.data_max_.tolist() if hasattr(scaler, 'data_max_') else None,
    'data_range': scaler.data_range_.tolist() if hasattr(scaler, 'data_range_') else None,
}

# Save to JSON
with open('scaler_params.json', 'w') as f:
    json.dump(scaler_params, f, indent=2)

print(f"Scaler type: {scaler_params['type']}")
print("Scaler exported successfully!")
```

### Option 2: Manual Preprocessing

If you know your scaler parameters, you can manually implement scaling in the component.

**Let me know:**
1. What type of scaler did you use? (StandardScaler / MinMaxScaler)
2. Do you have the scaler parameters or the `.pkl` file?

---

## 🐛 Troubleshooting

### Model Not Loading - 404 Error
**Symptoms:** Error message "Model files not found"

**Solutions:**
1. ✅ Verify files were copied correctly:
   ```powershell
   ls "...\Talaria\public\models\Talaria-LSTM-v2\"
   ```
2. ✅ Check file names are exactly: `model.json` and `.bin` files
3. ✅ Restart development server (Ctrl+C, then `npm run dev`)
4. ✅ Clear browser cache (Ctrl+Shift+R to hard refresh)

### Model Loads but Inference Fails
**Symptoms:** Model loads successfully but predictions throw errors

**Possible causes:**
1. ❌ Input data not properly scaled (need scaler)
2. ❌ Wrong input shape (must be [1, 50, 15])
3. ❌ Features in wrong order
4. ❌ Missing values (NaN) in input data

### CORS Error
**Not applicable** - Since files are hosted locally in `public/`, Next.js serves them correctly. No CORS issues.

### Large Model File Warning
If your `.bin` files are large (>10MB each):
- ⚠️ First load may be slow
- ✅ Browser will cache them for subsequent loads
- ✅ Consider showing a loading progress indicator

---

## 📝 What Changed from Firebase Storage?

### Before (Firebase Storage):
```typescript
// Old approach - required paid Firebase tier
const modelJsonRef = ref(storage, "ml-models/Talaria-LSTM-v2/model.json");
const modelJsonUrl = await getDownloadURL(modelJsonRef);
const model = await tf.loadLayersModel(modelJsonUrl);
```

### After (Local Hosting):
```typescript
// New approach - free, works immediately
const MODEL_PATH = "/models/Talaria-LSTM-v2/model.json";
const model = await tf.loadLayersModel(MODEL_PATH);
```

### Benefits:
- ✅ **Free** - no Firebase Storage costs
- ✅ **Fast** - files served directly by Next.js
- ✅ **Simple** - no cloud configuration needed
- ✅ **Offline-capable** - works without internet (after first load)
- ✅ **Version control** - model files can be committed to git (if not too large)

---

## 🎯 Next Actions

1. **Immediate:** Copy model files to `public/models/Talaria-LSTM-v2/`
2. **Test:** Load model in Predictions page
3. **Scaler:** Export scaler parameters to JSON
4. **Integration:** Add preprocessing function
5. **Test:** Run full inference with real data from Firebase

---

## 🆘 Need Help?

Common questions:

**Q: Can I use a different folder name?**
A: Yes! Change `MODEL_PATH` in `ml-inference-interface.tsx` to match your folder name.

**Q: My model.json references wrong paths**
A: Check if `model.json` has relative paths like `"./group1-shard1of1.bin"`. TensorFlow.js resolves these automatically from the model.json location.

**Q: Can I host multiple models?**
A: Yes! Create separate folders:
```
public/
└── models/
    ├── Talaria-LSTM-v2/
    ├── Model-v3/
    └── Experimental-Model/
```

**Q: Model files are too large for git**
A: Add to `.gitignore`:
```
public/models/**/*.bin
```
Keep `model.json` in git, document where to get `.bin` files.

---

**Status:** ✅ Code updated, directory created, ready for model files!

# 🚀 Upload TensorFlow.js Model to Firebase Storage

## Step-by-Step Guide

### Step 1: Prepare Your Model Files

After running the TensorFlow.js converter, you should have:
```
tfjs_model_output/
├── model.json
└── group1-shard1of1.bin  (or multiple shard files)
```

### Step 2: Upload to Firebase Storage

#### Option A: Using Firebase Console (Easiest) ✅

1. **Go to Firebase Console**
   - URL: https://console.firebase.google.com/u/0/project/project-talaria-1d870/storage

2. **Navigate to Storage**
   - Click on **"Storage"** in the left sidebar
   - Click on **"Files"** tab

3. **Create the ml-models folder**
   - Click **"Create folder"**
   - Name it: `ml-models`
   - Click inside the `ml-models` folder

4. **Create the model subfolder**
   - Click **"Create folder"** again
   - Name it: `Talaria-LSTM-v2`
   - Click inside the `Talaria-LSTM-v2` folder

5. **Upload model files**
   - Click **"Upload file"** or drag and drop
   - Select ALL files from your `tfjs_model_output` folder:
     - `model.json`
     - All `.bin` files (group1-shard1of1.bin, etc.)
   - Click **"Upload"**

6. **Verify the structure**
   Your Firebase Storage should look like:
   ```
   gs://project-talaria-1d870.firebasestorage.app/
   └── ml-models/
       └── Talaria-LSTM-v2/
           ├── model.json
           └── group1-shard1of1.bin
   ```

#### Option B: Using Firebase CLI

```bash
# Install Firebase CLI if not already installed
npm install -g firebase-tools

# Login to Firebase
firebase login

# Navigate to your project
cd "C:\Meet\Projects\Project_9_Talaria_Integrated Footwear System for Concurrent Cardiovascular and Gait Analysis\Project-Talaria\Machine Learning Model"

# Deploy files to Firebase Storage
firebase storage:upload tfjs_model_output/model.json ml-models/Talaria-LSTM-v2/model.json
firebase storage:upload tfjs_model_output/group1-shard1of1.bin ml-models/Talaria-LSTM-v2/group1-shard1of1.bin

# If you have multiple shard files:
firebase storage:upload tfjs_model_output/group1-shard2of2.bin ml-models/Talaria-LSTM-v2/group1-shard2of2.bin
# ... and so on for each shard file
```

### Step 3: Configure Firebase Storage Rules

1. Go to Firebase Console → Storage → Rules tab

2. Update rules to allow read access:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow read access to ML models
    match /ml-models/{allPaths=**} {
      allow read: if true;
      allow write: if false;  // Only allow uploads via console/admin
    }
    
    // Default rules for other files
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

3. Click **"Publish"**

### Step 4: Test the Model

1. **Start your dev server:**
```bash
cd "C:\Meet\Projects\Project_9_Talaria_Integrated Footwear System for Concurrent Cardiovascular and Gait Analysis\Project-Talaria\Talaria"
npm run dev
```

2. **Navigate to Predictions page:**
   - Open: http://localhost:3001
   - Go to: Dashboard → Predictions

3. **Click "Load Model":**
   - Should see "Model loaded successfully!"
   - Check browser console (F12) for model details

4. **Verify model info in console:**
   ```
   Model loaded successfully!
   Model input shape: [null, 50, 15]
   Model output shape: [null, X]  // X = number of classes
   ```

### Troubleshooting

#### Error: "storage/object-not-found"
```
Problem: Model files not found
Solution:
1. Check file path in Firebase Storage
2. Ensure path is: ml-models/Talaria-LSTM-v2/model.json
3. Verify all .bin files are uploaded
```

#### Error: "storage/unauthorized"
```
Problem: Storage rules don't allow access
Solution:
1. Go to Storage → Rules
2. Add read permission for ml-models path
3. Publish the rules
```

#### Error: "Failed to fetch"
```
Problem: CORS or network issue
Solution:
1. Check internet connection
2. Verify Firebase project is active
3. Check browser console for detailed error
```

#### Model loads but predictions fail
```
Problem: Input shape mismatch
Solution:
1. Check console for model input shape
2. Ensure your input is [1, 50, 15]
3. Verify data preprocessing (scaling)
```

### Verification Checklist

- [ ] `model.json` uploaded to `ml-models/Talaria-LSTM-v2/`
- [ ] All `.bin` files uploaded to same folder
- [ ] Storage rules allow read access
- [ ] Dev server running
- [ ] Can click "Load Model" without errors
- [ ] Console shows "Model loaded successfully!"
- [ ] Console displays correct input/output shapes

### Quick Commands

**Check if files exist:**
```bash
# Using Firebase CLI
firebase storage:ls ml-models/Talaria-LSTM-v2/
```

**Download a file to verify:**
```bash
firebase storage:get ml-models/Talaria-LSTM-v2/model.json
```

**Delete and re-upload if needed:**
```bash
firebase storage:rm ml-models/Talaria-LSTM-v2/model.json
firebase storage:upload tfjs_model_output/model.json ml-models/Talaria-LSTM-v2/model.json
```

---

## What Changed from Firebase ML to Firebase Storage?

| Aspect | Firebase ML | Firebase Storage |
|--------|-------------|------------------|
| Format Support | .tflite only | TensorFlow.js (.json + .bin) |
| Web SDK | Limited | Full support |
| Model Loading | REST API | Direct URL access |
| Setup | Complex | Simple |
| Recommended for Web | ❌ No | ✅ Yes |

Firebase ML is designed for mobile apps (Android/iOS) with .tflite models.
For web applications, Firebase Storage is the correct approach.

---

## Next Steps

After successful upload:
1. ✅ Test model loading
2. ✅ Export scaler parameters
3. ✅ Test inference with sample data
4. ✅ Integrate with real-time sensor data

Need help? Check the error message in the browser console for specific issues!

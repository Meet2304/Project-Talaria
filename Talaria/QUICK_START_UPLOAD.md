# 🎯 Quick Start: Upload Your Model

## TL;DR - What You Need to Do Now

### ✅ You've Already Done:
1. Converted your `.h5` model to TensorFlow.js format
2. Have `model.json` and `.bin` files in `tfjs_model_output` folder

### 📤 Next Steps (5 minutes):

#### **Option 1: Using Firebase Console (Recommended)**

1. **Go to:** https://console.firebase.google.com/u/0/project/project-talaria-1d870/storage

2. **Create folders:**
   - Click "Create folder" → Name: `ml-models`
   - Inside `ml-models`, create another folder → Name: `Talaria-LSTM-v2`

3. **Upload files:**
   - Go inside `Talaria-LSTM-v2` folder
   - Drag and drop ALL files from your `tfjs_model_output` folder:
     - `model.json`
     - All `.bin` files

4. **Update Storage Rules:**
   - Go to Storage → Rules tab
   - Replace with:
   ```javascript
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /ml-models/{allPaths=**} {
         allow read: if true;
       }
     }
   }
   ```
   - Click "Publish"

5. **Test it:**
   ```bash
   npm run dev
   ```
   - Go to: http://localhost:3001/dashboard/predictions
   - Click "Load Model"
   - Should see: "Model loaded successfully!"

---

## Your Final Folder Structure in Firebase Storage:

```
gs://project-talaria-1d870.firebasestorage.app/
└── ml-models/
    └── Talaria-LSTM-v2/
        ├── model.json
        └── group1-shard1of1.bin (and any other .bin files)
```

---

## Why This Changed

❌ **Before:** Tried to use Firebase ML
- Problem: Firebase ML only supports `.tflite` for mobile
- Web apps can't use Firebase ML directly

✅ **Now:** Using Firebase Storage
- Stores TensorFlow.js files
- Works perfectly with web applications
- Simpler setup and access

---

## What the Code Does Now

```typescript
// Loads model from Firebase Storage
const modelJsonRef = ref(storage, 'ml-models/Talaria-LSTM-v2/model.json');
const modelUrl = await getDownloadURL(modelJsonRef);
const loadedModel = await tf.loadLayersModel(modelUrl);
```

---

## Need Help?

See detailed guide: `UPLOAD_MODEL_TO_STORAGE.md`

**Common Issues:**
- **"Object not found"**: Check folder path is exactly `ml-models/Talaria-LSTM-v2/`
- **"Unauthorized"**: Update Storage rules to allow read access
- **Model won't load**: Make sure ALL `.bin` files are uploaded

---

## After Upload Works:

Next we'll:
1. ✅ Add scaler preprocessing
2. ✅ Test with real data
3. ✅ Display predictions properly
4. ✅ Integrate with your sensor data

That's it! Upload the files and you're ready to go! 🚀

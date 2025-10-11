# 🚨 Model Conversion Issue - Python Library Conflict

## Problem Summary

Your current converted model in `public/models/Talaria-LSTM-v2/` is **missing the first LSTM layer** (`lstm_1`). The existing `model.json` only has:
- lstm_2 (64 units)
- lstm_3 (32 units) 

But your original model has **3 LSTM layers**:
- lstm_1 (128 units) ← **MISSING**
- lstm_2 (64 units)
- lstm_3 (32 units)

Additionally, there's a Keras 3.x InputLayer compatibility issue with TensorFlow.js.

## Root Cause

Python library incompatibility:
- **tensorflowjs** library is outdated
- **numpy** is too new (Python 3.13)
- They conflict: `AttributeError: module 'numpy' has no attribute 'object'`

## Quick Solution Options

### Option 1: Use Python 3.10 or 3.11 (Recommended)

Create a new Python environment with older version:

```powershell
# Install Python 3.10 or 3.11 if you don't have it
# Then create virtual environment:
cd "C:\Meet\Projects\Project_9_Talaria_Integrated Footwear System for Concurrent Cardiovascular and Gait Analysis\Project-Talaria\Machine Learning Model\LSTM_v1"

# Create venv with Python 3.10/3.11
python3.10 -m venv venv_convert

# Activate
.\venv_convert\Scripts\activate

# Install packages
pip install tensorflow==2.15.0 tensorflowjs==4.12.0 numpy==1.24.3

# Run conversion
tensorflowjs_converter \
  --input_format=keras \
  --output_format=tfjs_layers_model \
  lstm_sensor_model.h5 \
  tfjs_complete_output

# Copy to web app
Remove-Item "..\..\Talaria\public\models\Talaria-LSTM-v2\*" -Force
Copy-Item "tfjs_complete_output\*" -Destination "..\..\Talaria\public\models\Talaria-LSTM-v2\" -Recurse -Force
```

### Option 2: Downgrade numpy in Current Environment

```powershell
pip uninstall numpy
pip install numpy==1.24.3
pip install tensorflowjs==4.12.0

cd "C:\Meet\Projects\Project_9_Talaria_Integrated Footwear System for Concurrent Cardiovascular and Gait Analysis\Project-Talaria\Machine Learning Model\LSTM_v1"

tensorflowjs_converter \
  --input_format=keras \
  --output_format=tfjs_layers_model \
  lstm_sensor_model.h5 \
  tfjs_complete_output
```

### Option 3: Use Google Colab (Easiest!)

1. **Upload to Google Colab** - create a new notebook
2. **Run this code:**

```python
# Install tensorflowjs
!pip install tensorflowjs==4.12.0

# Upload your lstm_sensor_model.h5 file using the upload button

# Convert
!tensorflowjs_converter \
  --input_format=keras \
  --output_format=tfjs_layers_model \
  lstm_sensor_model.h5 \
  tfjs_output

# Download the tfjs_output folder (model.json and .bin files)

# Then copy to your local machine
```

3. **Copy downloaded files** to `Talaria\public\models\Talaria-LSTM-v2\`

### Option 4: Use Windows WSL with Python 3.10

```bash
# In WSL
cd /mnt/c/Meet/Projects/...

python3 -m venv venv_convert
source venv_convert/bin/activate
pip install tensorflow tensorflowjs

tensorflowjs_converter \
  --input_format=keras \
  --output_format=tfjs_layers_model \
  Machine\ Learning\ Model/LSTM_v1/lstm_sensor_model.h5 \
  tfjs_output
```

## What Went Wrong

1. **First conversion attempt** (the one you have now):
   - Was done with tfjs_model_output
   - Somehow lost the first LSTM layer
   - Has only 2 LSTM layers instead of 3

2. **Python 3.13 incompatibility**:
   - numpy removed deprecated aliases (`np.object`, `np.bool`)
   - tensorflowjs still uses these old aliases
   - Causes import errors

## How to Verify Successful Conversion

After reconverting, check the model.json:

```bash
# Count LSTM layers (should be 3)
Select-String -Path "public\models\Talaria-LSTM-v2\model.json" -Pattern '"lstm_' | Measure-Object

# Check file size (should be ~1-2 MB for weights)
ls "public\models\Talaria-LSTM-v2\" -l
```

The model.json should contain:
- ✅ InputLayer with `batch_shape: [null, 50, 15]`
- ✅ lstm_1 layer (128 units)
- ✅ lstm_2 layer (64 units)
- ✅ lstm_3 layer (32 units)
- ✅ dense_1 layer (64 units)
- ✅ output layer (15 units)

## Expected Weights

Your complete model should have these weight tensors:
1. lstm_1/kernel: (15, 512)
2. lstm_1/recurrent_kernel: (128, 512)
3. lstm_1/bias: (512,)
4. lstm_2/kernel: (128, 256)
5. lstm_2/recurrent_kernel: (64, 256)
6. lstm_2/bias: (256,)
7. lstm_3/kernel: (64, 128)
8. lstm_3/recurrent_kernel: (32, 128)
9. lstm_3/bias: (128,)
10. dense_1/kernel: (32, 64)
11. dense_1/bias: (64,)
12. output/kernel: (64, 15)
13. output/bias: (15,)

**Total: 13 weight tensors**

## Current Issue

Your existing model.json only has 10 weight tensors - missing the 3 from lstm_1!

## Recommendation

**Use Option 3 (Google Colab)** - it's the easiest and most reliable:
1. No local setup needed
2. All packages compatible
3. Takes 5 minutes
4. Just upload .h5, run conversion, download result

---

**After successful conversion**, restart your dev server and the model should load without errors!

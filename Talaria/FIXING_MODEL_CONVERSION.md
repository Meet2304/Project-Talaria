# Fixing Keras 3.x Model Conversion Issue

## 🔴 Problem
You're getting an error: `An InputLayer should be passed either a 'batchInputShape' or an 'inputShape'`

This is because:
- Your model was trained with **Keras 3.10.0** (newer version)
- TensorFlow.js has compatibility issues with Keras 3.x InputLayer format
- The conversion didn't preserve the input layer correctly

## ✅ Solution Options

### Option 1: Reconvert with Specific Flags (Recommended)

Use these exact conversion commands:

#### Method A: Use input_format=keras_saved_model
```bash
# First, save your Keras model in SavedModel format (in Python)
python -c "
from tensorflow import keras
model = keras.models.load_model('model.h5')
model.save('saved_model', save_format='tf')
"

# Then convert using SavedModel format
tensorflowjs_converter \
  --input_format=tf_saved_model \
  --output_format=tfjs_layers_model \
  saved_model \
  tfjs_output_fixed
```

#### Method B: Rebuild InputLayer (Easier)
```python
# reconvert_model.py
import tensorflow as tf
from tensorflow import keras
import tensorflowjs as tfjs

# Load the original model
model = keras.models.load_model('model.h5')

# Create a new model with explicit InputLayer
input_layer = keras.Input(shape=(50, 15), name='input')
x = input_layer

# Copy all layers except the InputLayer
for layer in model.layers[1:]:  # Skip the first InputLayer
    x = layer(x)

# Create new model
new_model = keras.Model(inputs=input_layer, outputs=x)

# Copy weights
new_model.set_weights(model.get_weights())

# Save for TensorFlow.js
tfjs.converters.save_keras_model(new_model, 'tfjs_output_fixed')

print("✅ Model reconverted successfully!")
```

Run it:
```bash
python reconvert_model.py
```

### Option 2: Use Graph Model Format (Alternative)

If layers model continues to fail, convert to graph model format:

```python
# convert_to_graph.py
import tensorflow as tf
from tensorflow import keras
import tensorflowjs as tfjs

# Load model
model = keras.models.load_model('model.h5')

# Convert to concrete function
@tf.function
def model_fn(x):
    return model(x)

# Get concrete function
concrete_func = model_fn.get_concrete_function(
    tf.TensorSpec(shape=[None, 50, 15], dtype=tf.float32)
)

# Save as graph model
tfjs.converters.save_keras_model(
    model, 
    'tfjs_graph_model',
    quantization_dtype=None,
    skip_op_check=True
)

print("✅ Graph model saved!")
```

**Then update the loading code:**
```typescript
// In ml-inference-interface.tsx
const MODEL_PATH = "/models/Talaria-LSTM-v2/model.json";

// Change from:
const loadedModel = await tf.loadLayersModel(MODEL_PATH);

// To:
const loadedModel = await tf.loadGraphModel(MODEL_PATH);
```

### Option 3: Update TensorFlow.js (Try First!)

Your current version might not fully support Keras 3.x. Update to latest:

```bash
cd "C:\Meet\Projects\Project_9_Talaria_Integrated Footwear System for Concurrent Cardiovascular and Gait Analysis\Project-Talaria\Talaria"

npm install @tensorflow/tfjs@latest
```

Then try loading again without reconverting.

## 🔧 Quick Fix Script

Save this as `fix_model_conversion.py`:

```python
#!/usr/bin/env python3
"""
Fix Keras 3.x model for TensorFlow.js compatibility
"""
import os
import sys
import tensorflow as tf
from tensorflow import keras

def fix_and_convert(model_path, output_dir):
    """
    Load Keras model and reconvert with proper InputLayer
    """
    print(f"Loading model from: {model_path}")
    
    try:
        # Load the original model
        model = keras.models.load_model(model_path)
        print(f"✅ Model loaded successfully")
        print(f"   Input shape: {model.input_shape}")
        print(f"   Output shape: {model.output_shape}")
        print(f"   Total layers: {len(model.layers)}")
        
        # Create new model with explicit Input layer
        print("\nRebuilding model with explicit InputLayer...")
        
        # Get the input shape (skip batch dimension)
        input_shape = model.input_shape[1:]  # (50, 15)
        
        # Create new input
        new_input = keras.Input(shape=input_shape, name='input')
        x = new_input
        
        # Copy all layers except first InputLayer
        for i, layer in enumerate(model.layers[1:], 1):
            print(f"   Copying layer {i}: {layer.name} ({layer.__class__.__name__})")
            x = layer(x)
        
        # Create new model
        new_model = keras.Model(inputs=new_input, outputs=x, name='talaria_lstm')
        
        # Copy weights from old model
        print("\nCopying weights...")
        new_model.set_weights(model.get_weights())
        
        # Verify
        print("\n✅ New model created successfully")
        print(f"   Input shape: {new_model.input_shape}")
        print(f"   Output shape: {new_model.output_shape}")
        
        # Convert to TensorFlow.js format
        print(f"\nConverting to TensorFlow.js format...")
        print(f"   Output directory: {output_dir}")
        
        # Use tensorflowjs converter
        import tensorflowjs as tfjs
        
        tfjs.converters.save_keras_model(
            new_model, 
            output_dir,
            quantization_dtype=None,
            skip_op_check=False,
            strip_debug_ops=True
        )
        
        print("\n🎉 Conversion complete!")
        print(f"\nNext steps:")
        print(f"1. Copy files from '{output_dir}' to:")
        print(f"   Talaria/public/models/Talaria-LSTM-v2/")
        print(f"2. Restart your development server")
        print(f"3. Try loading the model again")
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    # Paths
    MODEL_PATH = "model.h5"  # Your original .h5 file
    OUTPUT_DIR = "tfjs_fixed_output"
    
    # Check if model exists
    if not os.path.exists(MODEL_PATH):
        print(f"❌ Model file not found: {MODEL_PATH}")
        print(f"   Current directory: {os.getcwd()}")
        print(f"\nPlease run this script from the directory containing your model.h5 file")
        sys.exit(1)
    
    # Run conversion
    fix_and_convert(MODEL_PATH, OUTPUT_DIR)
```

**Run it:**
```bash
cd "C:\Meet\Projects\Project_9_Talaria_Integrated Footwear System for Concurrent Cardiovascular and Gait Analysis\Project-Talaria\Machine Learning Model"

python fix_model_conversion.py
```

## 📋 Step-by-Step Instructions

### 1. Navigate to Model Directory
```powershell
cd "C:\Meet\Projects\Project_9_Talaria_Integrated Footwear System for Concurrent Cardiovascular and Gait Analysis\Project-Talaria\Machine Learning Model"
```

### 2. Save the Fix Script
Copy the `fix_model_conversion.py` script above and save it in the Machine Learning Model directory.

### 3. Run the Conversion
```bash
python fix_model_conversion.py
```

### 4. Copy Fixed Files
```powershell
# Remove old files
Remove-Item "C:\Meet\Projects\Project_9_Talaria_Integrated Footwear System for Concurrent Cardiovascular and Gait Analysis\Project-Talaria\Talaria\public\models\Talaria-LSTM-v2\*" -Force

# Copy new files
Copy-Item "tfjs_fixed_output\*" -Destination "C:\Meet\Projects\Project_9_Talaria_Integrated Footwear System for Concurrent Cardiovascular and Gait Analysis\Project-Talaria\Talaria\public\models\Talaria-LSTM-v2\" -Recurse -Force
```

### 5. Restart Dev Server
```bash
cd "..\Talaria"
# Press Ctrl+C to stop, then:
npm run dev
```

### 6. Test Model Loading
Navigate to Dashboard → Predictions and click "Load Model"

## 🐛 Troubleshooting

### Still getting InputLayer error?
- Check TensorFlow and Keras versions:
  ```bash
  python -c "import tensorflow as tf; import keras; print(f'TF: {tf.__version__}, Keras: {keras.__version__}')"
  ```
- Should be: TensorFlow 2.15+ and Keras 3.x

### Python module not found?
```bash
pip install tensorflow tensorflowjs
```

### Different error after reconversion?
Share the new error message - we may need to try the graph model approach instead.

## 📊 Feature Order Reminder

Your model expects features in this exact order:
1. **HR** (Heart Rate)
2. **SpO2** (Blood Oxygen)
3. **AccX** (Accelerometer X)
4. **AccY** (Accelerometer Y)
5. **AccZ** (Accelerometer Z)
6. **GyroX** (Gyroscope X)
7. **GyroY** (Gyroscope Y)
8. **GyroZ** (Gyroscope Z)
9. **Aroll** (Accelerometer Roll)
10. **Apitch** (Accelerometer Pitch)
11. **Groll** (Gyroscope Roll)
12. **Gpitch** (Gyroscope Pitch)
13. **Gy** (Gyroscope Yaw)
14. **Combroll** (Combined Roll)
15. **Combpitch** (Combined Pitch)

✅ **This has already been updated in the code!**

---

**Recommended:** Try Option 1 Method B (Python script) first - it's the most reliable fix for Keras 3.x compatibility issues.

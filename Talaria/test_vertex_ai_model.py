"""
Test Vertex AI Model Directly
This script tests your deployed Vertex AI model with sample data
"""

import json
from google.cloud import aiplatform
from google.oauth2 import service_account

# Configuration
PROJECT_ID = "project-talaria-474215"
LOCATION = "asia-south1"
ENDPOINT_ID = "9135793736679161856"
SERVICE_ACCOUNT_KEY_FILE = "service-account-key.json"

def test_vertex_ai_prediction():
    """Test the Vertex AI model with sample data"""
    
    print("=" * 70)
    print("VERTEX AI MODEL TEST")
    print("=" * 70)
    
    # Step 1: Load credentials
    print("\n[1] Loading service account credentials...")
    try:
        credentials = service_account.Credentials.from_service_account_file(
            SERVICE_ACCOUNT_KEY_FILE,
            scopes=['https://www.googleapis.com/auth/cloud-platform']
        )
        print(f"✅ Credentials loaded from: {SERVICE_ACCOUNT_KEY_FILE}")
        print(f"   Service Account: {credentials.service_account_email}")
    except Exception as e:
        print(f"❌ Error loading credentials: {e}")
        return
    
    # Step 2: Initialize Vertex AI
    print("\n[2] Initializing Vertex AI...")
    try:
        aiplatform.init(
            project=PROJECT_ID,
            location=LOCATION,
            credentials=credentials
        )
        print(f"✅ Vertex AI initialized")
        print(f"   Project: {PROJECT_ID}")
        print(f"   Location: {LOCATION}")
    except Exception as e:
        print(f"❌ Error initializing Vertex AI: {e}")
        return
    
    # Step 3: Get the endpoint
    print("\n[3] Getting endpoint...")
    try:
        endpoint = aiplatform.Endpoint(
            endpoint_name=ENDPOINT_ID,
            project=PROJECT_ID,
            location=LOCATION,
            credentials=credentials
        )
        print(f"✅ Endpoint found: {endpoint.display_name}")
        print(f"   Endpoint ID: {ENDPOINT_ID}")
        print(f"   Resource Name: {endpoint.resource_name}")
    except Exception as e:
        print(f"❌ Error getting endpoint: {e}")
        return
    
    # Step 4: Prepare sample data
    print("\n[4] Preparing sample data...")
    # Sample data: 50 timesteps x 15 features (adjust based on your model's input)
    # Features: [accel_x, accel_y, accel_z, gyro_x, gyro_y, gyro_z, 
    #            mag_x, mag_y, mag_z, heart_rate, spo2, temp, 
    #            pressure, humidity, altitude]
    
    import random
    sample_data = []
    for _ in range(50):  # 50 timesteps
        sample_data.append([
            random.uniform(-10, 10),  # accel_x
            random.uniform(-10, 10),  # accel_y
            random.uniform(-10, 10),  # accel_z
            random.uniform(-250, 250),  # gyro_x
            random.uniform(-250, 250),  # gyro_y
            random.uniform(-250, 250),  # gyro_z
            random.uniform(-50, 50),  # mag_x
            random.uniform(-50, 50),  # mag_y
            random.uniform(-50, 50),  # mag_z
            random.uniform(60, 100),  # heart_rate
            random.uniform(95, 100),  # spo2
            random.uniform(20, 40),  # temp
            random.uniform(900, 1100),  # pressure
            random.uniform(30, 70),  # humidity
            random.uniform(0, 1000),  # altitude
        ])
    
    # Format for Vertex AI - wrap in array for batch prediction
    instances = [sample_data]
    
    print(f"✅ Sample data prepared")
    print(f"   Shape: 50 timesteps x 15 features")
    print(f"   First sample: {sample_data[0][:3]}... (showing first 3 features)")
    print(f"   Instances format: List with {len(instances)} batch(es)")
    
    # Step 5: Make prediction
    print("\n[5] Making prediction...")
    try:
        response = endpoint.predict(instances=instances)
        print("✅ Prediction successful!")
        print("\n" + "=" * 70)
        print("PREDICTION RESULTS")
        print("=" * 70)
        print(f"\nFull Response: {response}")
        
        if hasattr(response, 'predictions'):
            predictions = response.predictions
            print(f"\nPredictions: {predictions}")
            
            if predictions:
                pred = predictions[0]
                if isinstance(pred, list):
                    # If it's a list of probabilities
                    print(f"\nClass Probabilities:")
                    for i, prob in enumerate(pred):
                        print(f"  Class {i}: {prob:.4f}")
                    predicted_class = pred.index(max(pred))
                    confidence = max(pred)
                    print(f"\n🎯 Predicted Class: {predicted_class}")
                    print(f"🎯 Confidence: {confidence:.4f} ({confidence*100:.2f}%)")
                else:
                    print(f"\nPrediction: {pred}")
        
        if hasattr(response, 'deployed_model_id'):
            print(f"\nDeployed Model ID: {response.deployed_model_id}")
        
        if hasattr(response, 'model_display_name'):
            print(f"Model Display Name: {response.model_display_name}")
        
        print("\n" + "=" * 70)
        print("✅ TEST COMPLETED SUCCESSFULLY")
        print("=" * 70)
        
    except Exception as e:
        print(f"❌ Error making prediction: {e}")
        print(f"\n   Error type: {type(e).__name__}")
        print(f"   Error details: {str(e)}")
        return

if __name__ == "__main__":
    test_vertex_ai_prediction()

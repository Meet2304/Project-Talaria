import { NextRequest, NextResponse } from 'next/server';
import { GoogleAuth, JWT } from 'google-auth-library';
import { formatLSTMInput, processVertexAIResponse, parseInputData, validateSensorData } from '@/lib/vertex-ai';

/**
 * API Route for Vertex AI Model Inference
 * POST /api/vertex-ai/predict
 * 
 * This route acts as a secure proxy between the client and Vertex AI.
 * It handles authentication and formats requests/responses properly.
 */

interface PredictRequest {
  data: string | number[][]; // Can be CSV string or array
  modelType?: 'vertex-ai' | 'local'; // Default to vertex-ai
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: PredictRequest = await request.json();
    
    if (!body.data) {
      return NextResponse.json(
        { error: 'Missing required field: data' },
        { status: 400 }
      );
    }

    // Parse and validate input data
    let samples: number[][];
    
    if (typeof body.data === 'string') {
      try {
        samples = parseInputData(body.data);
      } catch (error) {
        return NextResponse.json(
          { 
            error: 'Invalid input format', 
            details: error instanceof Error ? error.message : 'Unknown error'
          },
          { status: 400 }
        );
      }
    } else if (Array.isArray(body.data)) {
      if (!validateSensorData(body.data)) {
        return NextResponse.json(
          { error: 'Invalid data format. Expected 50 samples with 15 features each.' },
          { status: 400 }
        );
      }
      samples = body.data;
    } else {
      return NextResponse.json(
        { error: 'Data must be a string (CSV/JSON) or array' },
        { status: 400 }
      );
    }

    // Get Vertex AI configuration from environment variables
    const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
    const location = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';
    const endpointId = process.env.VERTEX_AI_ENDPOINT_ID;
    
    if (!projectId || !endpointId) {
      return NextResponse.json(
        { 
          error: 'Server configuration error', 
          details: 'Missing GOOGLE_CLOUD_PROJECT_ID or VERTEX_AI_ENDPOINT_ID environment variables'
        },
        { status: 500 }
      );
    }

    // Get access token using Application Default Credentials
    // For local development: Use gcloud auth application-default login
    // For production: Service account credentials via GOOGLE_APPLICATION_CREDENTIALS
    const accessToken = await getGoogleCloudAccessToken();
    
    if (!accessToken) {
      return NextResponse.json(
        { 
          error: 'Authentication error', 
          details: 'Failed to obtain Google Cloud access token. Ensure credentials are properly configured.'
        },
        { status: 401 }
      );
    }

    // Format input for LSTM model
    const formattedInput = formatLSTMInput(samples);
    
    // Call Vertex AI
    // Note: Vertex AI REST API accepts both project ID and project number
    // Using project ID: project-talaria-474215
    const apiEndpoint = process.env.VERTEX_AI_API_ENDPOINT || 'https://aiplatform.googleapis.com';
    
    // Try with regional endpoint first (more reliable)
    const regionalEndpoint = `https://${location}-aiplatform.googleapis.com`;
    const url = `${regionalEndpoint}/v1/projects/${projectId}/locations/${location}/endpoints/${endpointId}:predict`;
    
    console.log('🌐 Calling Vertex AI endpoint:', url);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formattedInput),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Vertex AI Error:', errorText);
      
      return NextResponse.json(
        { 
          error: 'Vertex AI prediction failed', 
          details: `HTTP ${response.status}: ${errorText}`,
          statusCode: response.status
        },
        { status: response.status }
      );
    }
    
    const vertexResponse = await response.json();
    
    // Process and format the response
    const result = processVertexAIResponse(vertexResponse);
    
    // Return the predicted sensor values for the next timestep
    return NextResponse.json({
      success: true,
      prediction: {
        predictedValues: result.predictions[0], // Array of 15 predicted sensor values
        features: [
          "HR", "SpO2", "AccX", "AccY", "AccZ",
          "GyroX", "GyroY", "GyroZ", "Aroll", "Apitch",
          "Groll", "Gpitch", "Gy", "Combroll", "Combpitch"
        ],
        confidence: result.confidence,
      },
      metadata: {
        modelDisplayName: vertexResponse.modelDisplayName,
        deployedModelId: vertexResponse.deployedModelId,
        modelVersionId: vertexResponse.modelVersionId,
        modelType: "LSTM Time-Series Forecasting",
        description: "Predicts the next timestep's sensor values based on the previous 50 timesteps"
      }
    });
    
  } catch (error) {
    console.error('API Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * Get Google Cloud access token
 * 
 * Uses Application Default Credentials (ADC) which works for:
 * - Service Account JSON: Set GOOGLE_SERVICE_ACCOUNT_KEY_JSON env var
 * - Local development: gcloud auth application-default login (if installed)
 * - Production: Automatically uses service account credentials
 */
async function getGoogleCloudAccessToken(): Promise<string | null> {
  try {
    // Option 1: Use service account JSON from environment variable
    const serviceAccountJson = process.env.GOOGLE_SERVICE_ACCOUNT_KEY_JSON;
    
    if (serviceAccountJson) {
      console.log('🔑 Using service account from environment variable');
      console.log('📝 Service account JSON length:', serviceAccountJson.length);
      console.log('📝 First 50 chars:', serviceAccountJson.substring(0, 50));
      
      // Remove surrounding quotes if present
      let jsonString = serviceAccountJson.trim();
      if ((jsonString.startsWith("'") && jsonString.endsWith("'")) || 
          (jsonString.startsWith('"') && jsonString.endsWith('"'))) {
        jsonString = jsonString.slice(1, -1);
        console.log('✂️ Removed surrounding quotes');
      }
      
      // Replace escaped newlines (\\n) with actual newlines (\n) for private key
      jsonString = jsonString.replace(/\\\\n/g, '\\n');
      
      const credentials = JSON.parse(jsonString);
      console.log('✅ Successfully parsed service account credentials');
      console.log('📧 Service account email:', credentials.client_email);
      console.log('🔑 Private key starts with:', credentials.private_key.substring(0, 50));
      console.log('🔑 Private key length:', credentials.private_key.length);
      
      // Use JWT constructor directly (recommended by Google)
      const jwtClient = new JWT({
        email: credentials.client_email,
        key: credentials.private_key,
        scopes: ['https://www.googleapis.com/auth/cloud-platform'],
      });

      const accessToken = await jwtClient.getAccessToken();
      
      if (!accessToken.token) {
        console.error('❌ Failed to get access token from service account');
        return null;
      }
      
      console.log('✅ Successfully obtained access token');
      return accessToken.token || null;
    }

    // Option 2: Use Application Default Credentials (gcloud)
    console.log('🔑 Attempting to use Application Default Credentials');
    const auth = new GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/cloud-platform'],
    });

    const client = await auth.getClient();
    const accessToken = await client.getAccessToken();
    
    if (!accessToken.token) {
      console.error('❌ Failed to get access token from credentials');
      return null;
    }

    return accessToken.token || null;
    
  } catch (error) {
    console.error('❌ Error getting access token:', error);
    
    // Provide helpful error message
    if (error instanceof Error) {
      if (error.message.includes('Could not load the default credentials')) {
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.error('🔑 AUTHENTICATION REQUIRED');
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.error('');
        console.error('Option 1 (Recommended): Set service account in .env.local');
        console.error('  1. Get your service account JSON key from Google Cloud Console');
        console.error('  2. Add to .env.local:');
        console.error('     GOOGLE_SERVICE_ACCOUNT_KEY_JSON=\'{"type":"service_account",...}\'');
        console.error('  3. Restart the dev server');
        console.error('');
        console.error('Option 2: Install and authenticate with gcloud CLI');
        console.error('  1. Install: https://cloud.google.com/sdk/docs/install');
        console.error('  2. Run: gcloud auth application-default login');
        console.error('');
        console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      }
    }
    
    return null;
  }
}

/**
 * GET endpoint to check API health and configuration
 */
export async function GET() {
  const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
  const location = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';
  const endpointId = process.env.VERTEX_AI_ENDPOINT_ID;
  const hasServiceAccount = !!process.env.GOOGLE_SERVICE_ACCOUNT_KEY_JSON;
  
  return NextResponse.json({
    status: 'ok',
    configuration: {
      projectId: projectId ? '✓ configured' : '✗ missing',
      location: location,
      endpointId: endpointId ? '✓ configured' : '✗ missing',
      authentication: hasServiceAccount ? '✓ service account configured' : '⚠️ requires setup',
    },
    instructions: {
      requiredEnvVars: [
        'GOOGLE_CLOUD_PROJECT_ID',
        'VERTEX_AI_ENDPOINT_ID',
        'GOOGLE_SERVICE_ACCOUNT_KEY_JSON (or use gcloud auth)',
      ],
      optionalEnvVars: [
        'GOOGLE_CLOUD_LOCATION (default: us-central1)',
        'VERTEX_AI_API_ENDPOINT (default: https://aiplatform.googleapis.com)',
      ],
    }
  });
}

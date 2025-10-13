# Talaria - Setup Guide

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** 18.x or higher
- **npm** or **yarn** package manager
- **Firebase Account** with Realtime Database
- **Google Cloud Account** (for ML predictions)
- **Git** for version control

---

## 🚀 Quick Start

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>

# Navigate to the project
cd Project-Talaria/Talaria

# Install dependencies
npm install
```

### 2. Environment Configuration

Create a `.env.local` file in the root directory:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your_project-default-rtdb.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Google Cloud Vertex AI (for ML predictions)
GOOGLE_CLOUD_PROJECT_ID=your-gcp-project-id
GOOGLE_CLOUD_LOCATION=us-central1
VERTEX_AI_ENDPOINT_ID=your-endpoint-id

# For production deployment (service account JSON)
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"..."}
```

#### Getting Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project or create a new one
3. Go to **Project Settings** (⚙️ icon)
4. Under **Your apps**, select your web app or create one
5. Copy the configuration values to your `.env.local`

#### Getting Vertex AI Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **Vertex AI** → **Endpoints**
3. Note your **Project ID**, **Region**, and **Endpoint ID**
4. Create a service account with **Vertex AI User** role
5. Download the JSON key file

### 3. Firebase Setup

#### Create Realtime Database

1. In Firebase Console, go to **Build** → **Realtime Database**
2. Click **Create Database**
3. Choose location (e.g., us-central1)
4. Start in **Test Mode** (update rules later)

#### Database Structure

Your data should follow this structure:

```json
{
  "devices": {
    "DEVICE_001": {
      "metadata": {
        "name": "Primary Sensor",
        "location": "Lab A",
        "lastUpdated": "2025-10-13T10:30:00Z"
      },
      "sensorData": {
        "1697200800000": {
          "timestamp": 1697200800000,
          "HR": 75.2,
          "SpO2": 98.5,
          "AccX": 0.15,
          "AccY": -0.03,
          "AccZ": 9.81,
          "GyroX": 2.5,
          "GyroY": -1.2,
          "GyroZ": 0.8,
          "Aroll": 5.2,
          "Apitch": -2.1,
          "Groll": 4.8,
          "Gpitch": -2.3,
          "Gy": 0.5,
          "Combroll": 5.0,
          "Combpitch": -2.2
        }
      }
    }
  }
}
```

#### Security Rules

For development:
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

For production (recommended):
```json
{
  "rules": {
    "devices": {
      "$deviceId": {
        ".read": true,
        "sensorData": {
          ".write": "auth != null"
        }
      }
    }
  }
}
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Project Structure

```
Talaria/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Landing page
│   │   ├── about/              # About page
│   │   ├── ml-models/          # ML models info page
│   │   ├── dashboard/          # Dashboard pages
│   │   │   ├── database/       # Database viewer
│   │   │   ├── predictions/    # ML predictions
│   │   │   └── analytics/      # Analytics dashboard
│   │   └── api/                # API routes
│   │       └── vertex-ai/      # Vertex AI endpoints
│   ├── components/             # React components
│   │   ├── ui/                 # shadcn/ui components
│   │   └── *.tsx               # Custom components
│   └── lib/                    # Utilities and configs
├── public/                     # Static assets
│   └── images/                 # Images
├── docs/                       # Documentation
├── .env.local                  # Environment variables
├── next.config.js              # Next.js configuration
└── package.json                # Dependencies
```

---

## 🛠️ Available Scripts

```bash
# Development server with hot reload
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run ESLint
npm run lint

# Type checking
npm run type-check
```

---

## 🔧 Configuration Files

### `next.config.js`

Key optimizations included:
- Image optimization (AVIF/WebP)
- Bundle size optimization
- Compression (Gzip/Brotli)
- Security headers

### `tsconfig.json`

Strict TypeScript configuration for type safety.

### `tailwind.config.ts`

Custom theme configuration with design tokens.

---

## 🎯 Testing the Setup

### 1. Check Homepage
Visit `http://localhost:3000` - should see the landing page

### 2. Test Database Connection
Navigate to `/dashboard/database` - should connect to Firebase

### 3. Test ML Predictions
Go to `/dashboard/predictions` - check API status

### 4. Verify All Pages
- `/about` - About page with hardware/software info
- `/ml-models` - ML model details
- `/dashboard/analytics` - Analytics dashboard

---

## 🐛 Troubleshooting

### Build Errors

**Error: Module not found**
```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
```

### Firebase Connection Issues

**Error: Database connection failed**
- Verify all Firebase environment variables are set correctly
- Check Database URL includes correct region
- Ensure Firebase project is active

### Vertex AI Authentication

**Error: Authentication failed**

For local development:
```bash
gcloud auth application-default login
gcloud config set project YOUR_PROJECT_ID
```

For production, ensure `GOOGLE_SERVICE_ACCOUNT_KEY` is set.

### Port Already in Use

```bash
# Kill process on port 3000
npx kill-port 3000

# Or use a different port
PORT=3001 npm run dev
```

---

## 📝 Next Steps

1. ✅ Complete environment setup
2. ✅ Configure Firebase Realtime Database
3. ✅ Set up Vertex AI credentials
4. ✅ Test local development
5. 📋 Review [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment
6. 📋 Read [ARCHITECTURE.md](./ARCHITECTURE.md) to understand the system
7. 📋 Check [ML_MODELS.md](./ML_MODELS.md) for ML integration details

---

## 💡 Tips

- Use `.env.example` as a template for your `.env.local`
- Never commit `.env.local` to version control
- Keep your service account keys secure
- Use Firebase security rules in production
- Monitor your Vertex AI usage and quotas

---

**Last Updated:** October 2025

# Talaria - Architecture Documentation

## 🏗️ System Overview

Talaria is a full-stack web application for real-time cardiovascular and gait analysis. It combines IoT sensor data collection, cloud storage, and machine learning predictions in a modern, responsive interface.

---

## 🎯 Core Components

### 1. Frontend (Next.js 15)

**Framework:** Next.js 15 with App Router
**Language:** TypeScript (strict mode)
**Styling:** Tailwind CSS
**UI Components:** shadcn/ui + Lucide React icons

#### Key Features
- Server-side rendering (SSR)
- Static site generation (SSG) for public pages
- Client-side interactivity
- Responsive design (mobile-first)
- Real-time data updates

#### Page Structure
```
/                          → Landing page (SSG)
/about                     → About page with hardware/software info
/ml-models                 → ML model documentation
/dashboard
  /database                → Real-time database viewer
  /predictions             → ML inference interface
  /analytics               → Analytics dashboard
```

### 2. Backend (Next.js API Routes)

**Location:** `/src/app/api/`

#### API Endpoints

**Vertex AI Integration** (`/api/vertex-ai/predict`)
- GET: Check API configuration status
- POST: Run ML inference on sensor data
- Handles authentication with Google Cloud
- Returns predictions with metadata

**Firebase Operations** (client-side SDK)
- Real-time data subscriptions
- Device management
- Sensor data queries with date ranges

### 3. Database (Firebase Realtime Database)

**Architecture:** NoSQL, real-time synchronized

#### Data Structure
```json
{
  "devices": {
    "{deviceId}": {
      "metadata": {
        "name": "string",
        "location": "string",
        "lastUpdated": "ISO8601 timestamp"
      },
      "sensorData": {
        "{timestamp}": {
          "timestamp": "number (milliseconds)",
          "HR": "number (heart rate)",
          "SpO2": "number (oxygen saturation)",
          "AccX": "number (accelerometer X)",
          "AccY": "number (accelerometer Y)",
          "AccZ": "number (accelerometer Z)",
          "GyroX": "number (gyroscope X)",
          "GyroY": "number (gyroscope Y)",
          "GyroZ": "number (gyroscope Z)",
          "Aroll": "number (accelerometer roll)",
          "Apitch": "number (accelerometer pitch)",
          "Groll": "number (gyroscope roll)",
          "Gpitch": "number (gyroscope pitch)",
          "Gy": "number (gyroscope yaw)",
          "Combroll": "number (combined roll)",
          "Combpitch": "number (combined pitch)"
        }
      }
    }
  }
}
```

#### Query Optimization
- Indexed by timestamp for fast range queries
- Ordered queries for chronological data
- Limit queries to prevent over-fetching
- Real-time listeners with cleanup

### 4. Machine Learning (Google Cloud Vertex AI)

**Model Type:** LSTM Neural Network
**Purpose:** Time-series forecasting
**Input:** 50 timesteps × 15 features
**Output:** 15 predicted values (next timestep)

#### Integration Flow
```
User Input → API Route → Vertex AI Endpoint → Response
    ↓
Format Data (50×15 matrix)
    ↓
Authenticate (Service Account)
    ↓
Send to Vertex AI
    ↓
Receive Predictions
    ↓
Format Response
    ↓
Display Results
```

---

## 📊 Data Flow

### 1. Sensor Data Collection Flow

```
ESP32-S3 Device
    ↓ (reads sensors)
MAX30102 (HR, SpO2) + MPU6050 (IMU)
    ↓ (WiFi transmission)
Firebase Realtime Database
    ↓ (real-time sync)
Web Application
    ↓ (displays)
User Interface
```

### 2. ML Prediction Flow

```
User Action (Load Data / Manual Input)
    ↓
Load 50 samples from Firebase or CSV
    ↓
Validate data format (50×15)
    ↓
Send to API endpoint
    ↓
API authenticates with Google Cloud
    ↓
Forward to Vertex AI endpoint
    ↓
LSTM model processes data
    ↓
Return predictions (15 values)
    ↓
Display formatted results
```

### 3. Real-time Database Updates

```
Device sends data to Firebase
    ↓
Firebase triggers listener in web app
    ↓
React component re-renders
    ↓
Chart updates with new data
    ↓
User sees real-time updates
```

---

## 🔧 Technology Stack

### Frontend Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| Next.js | React framework | 15.5.4 |
| React | UI library | 19.0.0 |
| TypeScript | Type safety | 5.x |
| Tailwind CSS | Styling | 3.x |
| shadcn/ui | UI components | Latest |
| Lucide React | Icons | 0.468.0 |
| Recharts | Data visualization | 2.15.0 |
| Framer Motion | Animations | 12.0.0 |

### Backend Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| Next.js API Routes | Server endpoints | 15.5.4 |
| Firebase Admin SDK | Database operations | 13.1.0 |
| Google Auth Library | Cloud authentication | 9.x |

### Database & Cloud

| Service | Purpose |
|---------|---------|
| Firebase Realtime Database | Real-time data storage |
| Google Cloud Vertex AI | ML model hosting |
| Vercel | Hosting & deployment |

### Development Tools

| Tool | Purpose |
|------|---------|
| ESLint | Code linting |
| Prettier | Code formatting |
| TypeScript | Type checking |

---

## 🏛️ Component Architecture

### Core Components

#### 1. `vertex-ai-inference-interface.tsx`
**Purpose:** ML predictions interface
- Handles CSV/JSON input
- Firebase data loading
- API communication
- Result visualization

**Key Features:**
- Multi-tab interface (Manual / Firebase)
- Real-time API status checking
- CSV parser with validation
- Random data generation for testing
- Color-coded prediction results

#### 2. `database-debug-panel.tsx`
**Purpose:** Firebase database viewer
- Device selection
- Date range queries
- Real-time data display
- Data export functionality

**Key Features:**
- Responsive data table
- Timestamp formatting
- Sensor value color coding
- Auto-refresh capability

#### 3. `toast.tsx`
**Purpose:** User notifications
- Success/error messages
- Consistent styling
- Auto-dismiss
- Position management

#### 4. UI Components (`/components/ui/`)
- `button.tsx` - Customizable button variants
- `card.tsx` - Content containers
- `badge.tsx` - Status indicators
- `alert.tsx` - Important messages
- `input.tsx` - Form inputs

### Utilities (`/lib/`)

#### `firebase.ts`
- Firebase initialization
- Database connection
- Real-time listeners
- Data queries

#### `vertex-ai.ts`
- Model configuration
- Feature definitions
- Data formatting
- Constants

#### `ml-models-config.ts`
- Model metadata
- Performance metrics
- Model descriptions

---

## 🔐 Security Architecture

### Client-Side Security

**Firebase Configuration:**
- Public API keys (safe for client-side)
- Security enforced by Firebase Rules
- Real-time rule validation

**Environment Variables:**
- All client variables prefixed `NEXT_PUBLIC_`
- No sensitive keys in client bundle
- Build-time variable injection

### Server-Side Security

**API Routes:**
- Server-only execution
- Environment variable access
- Service account authentication

**Google Cloud Authentication:**
- Service account JSON key (server-only)
- IAM role-based access
- Endpoint-level permissions

### Deployment Security

**Vercel Configuration:**
- Environment variables encrypted at rest
- HTTPS enforced
- Security headers:
  - XSS Protection
  - Frame Options
  - Content Security Policy
  - HSTS

---

## 🚀 Performance Optimizations

### Build-Time Optimizations

1. **Code Splitting**
   - Automatic route-based splitting
   - Dynamic imports for large libraries
   - Tree shaking for unused code

2. **Image Optimization**
   - AVIF/WebP conversion
   - Responsive images
   - Lazy loading
   - Blur placeholders

3. **Bundle Optimization**
   - Minification
   - Compression (Gzip/Brotli)
   - Dead code elimination

### Runtime Optimizations

1. **React Optimizations**
   - Memoization (`useMemo`, `useCallback`)
   - Suspense boundaries
   - Error boundaries

2. **Data Fetching**
   - Real-time listeners (no polling)
   - Query result limits
   - Timestamp-based indexing

3. **Caching Strategy**
   - Static assets: 1 year cache
   - API responses: no cache (real-time)
   - Images: immutable cache

---

## 📈 Scalability Considerations

### Current Capacity
- **Frontend:** Serverless, auto-scales
- **Database:** Firebase scales automatically
- **ML:** Vertex AI auto-scaling endpoints

### Optimization Paths

1. **Database Scaling**
   - Implement data archival for old records
   - Use Firebase Firestore for better indexing
   - Implement data aggregation

2. **ML Scaling**
   - Batch predictions for efficiency
   - Cache recent predictions
   - Implement rate limiting

3. **Frontend Scaling**
   - CDN caching (Vercel Edge Network)
   - Service worker for offline support
   - Progressive Web App (PWA) features

---

## 🧪 Testing Strategy

### Current Testing
- TypeScript type checking
- ESLint code quality
- Build-time error detection

### Recommended Testing
```bash
# Unit tests (Jest + React Testing Library)
npm run test

# E2E tests (Playwright)
npm run test:e2e

# Type checking
npm run type-check

# Linting
npm run lint
```

---

## 🔄 Development Workflow

### Local Development
1. Clone repository
2. Install dependencies: `npm install`
3. Configure `.env.local`
4. Start dev server: `npm run dev`
5. Make changes with hot reload

### Git Workflow
1. Create feature branch
2. Make changes
3. Commit with descriptive messages
4. Push to remote
5. Create pull request
6. Vercel creates preview deployment
7. Review and merge

### Deployment Flow
```
git push → GitHub → Vercel → Auto Deploy → Live Site
```

---

## 📝 Future Enhancements

### Planned Features
- [ ] User authentication system
- [ ] Historical data analytics
- [ ] Advanced data visualization
- [ ] Export data to CSV/JSON
- [ ] Mobile app (React Native)
- [ ] WebSocket for live streaming
- [ ] Predictive health alerts

### Technical Improvements
- [ ] Unit test coverage > 80%
- [ ] E2E test suite
- [ ] Performance monitoring dashboard
- [ ] Error tracking (Sentry)
- [ ] A/B testing framework

---

## 🛠️ Maintenance

### Regular Tasks
- Monitor Vercel deployment logs
- Check Firebase usage quotas
- Review Vertex AI costs
- Update dependencies monthly
- Review and update security rules

### Monitoring Metrics
- Page load times
- API response times
- Database query performance
- ML prediction latency
- Error rates

---

**Last Updated:** October 2025

**Related Documentation:**
- [SETUP.md](./SETUP.md) - Setup instructions
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide
- [ML_MODELS.md](./ML_MODELS.md) - ML integration details

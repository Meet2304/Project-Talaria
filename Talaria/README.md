# Talaria 🦅

## Integrated Footwear System for Concurrent Cardiovascular & Gait Analysis

[![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Realtime%20DB-orange?style=flat&logo=firebase)](https://firebase.google.com/)
[![Vertex AI](https://img.shields.io/badge/Vertex%20AI-ML%20Model-4285F4?style=flat&logo=google-cloud)](https://cloud.google.com/vertex-ai)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat&logo=vercel)](https://vercel.com)

---

## 📖 Overview

Talaria is a modern, full-stack web application for real-time cardiovascular and gait analysis. Built with Next.js 15, it provides seamless integration between IoT sensors (MAX30102 & MPU6050), cloud storage (Firebase), and machine learning predictions (Google Cloud Vertex AI).

**Key Capabilities:**
- 🫀 Real-time heart rate and SpO2 monitoring
- 🚶 6-axis motion tracking and gait analysis
- 🤖 LSTM-based time-series forecasting (96.99% R² score)
- 📊 Live data visualization and analytics
- 🌐 Cloud-synchronized sensor data

---

## ✨ Features

### 🎯 Core Functionality
- **Real-Time Monitoring** - Live sensor data streaming via Firebase Realtime Database
- **ML Predictions** - Time-series forecasting with LSTM neural network
- **Data Analytics** - Historical data analysis with interactive charts
- **Responsive Design** - Mobile-first UI built with Tailwind CSS and shadcn/ui
- **Professional Interface** - Clean, modern design with smooth animations

### � Technical Highlights
- **Next.js 15** with App Router for optimal performance
- **TypeScript** strict mode for type safety
- **Firebase Realtime Database** for real-time data sync
- **Google Cloud Vertex AI** for ML inference
- **Optimized Build** - Image optimization, code splitting, compression

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Firebase project with Realtime Database
- Google Cloud account (for ML features)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd Project-Talaria/Talaria

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local
# Edit .env.local with your Firebase and GCP credentials

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

---

## 📚 Documentation

Comprehensive documentation is available in the `/docs` directory:

| Document | Description |
|----------|-------------|
| **[SETUP.md](./docs/SETUP.md)** | Complete setup instructions including Firebase and Vertex AI configuration |
| **[ARCHITECTURE.md](./docs/ARCHITECTURE.md)** | System architecture, tech stack, and component details |
| **[DEPLOYMENT.md](./docs/DEPLOYMENT.md)** | Vercel deployment guide with optimization tips |
| **[ML_MODELS.md](./docs/ML_MODELS.md)** | ML model details, integration guide, and API documentation |
| **[CHANGELOG.md](./docs/CHANGELOG.md)** | Version history and recent updates |

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** Next.js 15.5.4 with App Router
- **Language:** TypeScript 5.7 (strict mode)
- **Styling:** Tailwind CSS 3.4
- **UI Components:** shadcn/ui + Lucide React icons
- **Charts:** Recharts
- **Animations:** Framer Motion

### Backend & Cloud
- **Database:** Firebase Realtime Database
- **ML Platform:** Google Cloud Vertex AI
- **Hosting:** Vercel (serverless)
- **API:** Next.js API Routes

### Hardware Integration
- **Microcontroller:** ESP32-S3 Mini Dev Board
- **Heart Rate Sensor:** MAX30102 (HR + SpO2)
- **Motion Sensor:** MPU6050 (6-axis IMU)
- **Power:** TP4056 + 3.7V LiPo Battery

---

## 📊 ML Model Performance

**Model:** LSTM Time-Series Forecasting
- **R² Score:** 96.99%
- **MAE:** 0.103
- **RMSE:** 0.174

**Input:** 50 timesteps × 15 sensor features
**Output:** 15 predicted values for next timestep

See [ML_MODELS.md](./docs/ML_MODELS.md) for complete details.

---

## 📁 Project Structure

```
Talaria/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── page.tsx      # Landing page
│   │   ├── about/        # About page
│   │   ├── ml-models/    # ML model info
│   │   ├── dashboard/    # Dashboard pages
│   │   └── api/          # API routes
│   ├── components/       # React components
│   │   ├── ui/           # shadcn/ui components
│   │   └── *.tsx         # Custom components
│   └── lib/              # Utilities and configs
├── public/               # Static assets
├── docs/                 # Documentation
└── README.md             # This file
```

---

## 🔧 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Create production build
npm start        # Start production server
npm run lint     # Run ESLint
```

---

## � Deployment

Deploy to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

Or follow the comprehensive [Deployment Guide](./docs/DEPLOYMENT.md).

---

## 🎯 Use Cases

- **Healthcare Monitoring** - Continuous cardiovascular health tracking
- **Rehabilitation** - Gait analysis for physical therapy
- **Sports Science** - Athletic performance monitoring
- **Research** - Time-series data collection and analysis
- **IoT Integration** - Real-time sensor data streaming

---

## 🐛 Troubleshooting

Common issues and solutions:

| Issue | Solution |
|-------|----------|
| Build errors | Run `rm -rf node_modules .next && npm install` |
| Firebase connection fails | Verify environment variables in `.env.local` |
| ML predictions not working | Check Vertex AI credentials and endpoint ID |
| Port 3000 in use | Run `npx kill-port 3000` or use `PORT=3001 npm run dev` |

For more help, see [SETUP.md](./docs/SETUP.md#troubleshooting).

---

## 🔒 Security

- All Firebase API keys are public-facing (secured by Firebase Rules)
- Service account keys are environment variables (never committed)
- Security headers prevent XSS and clickjacking
- HTTPS enforced in production

---

## 🤝 Contributing

We welcome contributions! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure:
- Code follows TypeScript best practices
- All tests pass
- Documentation is updated
- Commits are descriptive

---

## 📄 License

This project is developed as part of a research initiative for concurrent cardiovascular and gait analysis.

---

## 🙏 Acknowledgments

- **Next.js Team** for the amazing framework
- **Vercel** for hosting and deployment platform
- **Firebase** for real-time database
- **Google Cloud** for Vertex AI ML platform
- **shadcn/ui** for beautiful UI components

---

## 📧 Contact

For questions, issues, or collaboration:
- 📝 Open an issue on GitHub
- 📧 Contact the development team

---

**Built with ❤️ using Next.js, TypeScript, and modern web technologies**

---

Last Updated: October 2025 • Version 1.0.0

Private project - All rights reserved.

---

Built with ❤️ for health monitoring innovation

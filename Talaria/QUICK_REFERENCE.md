# Talaria - Quick Reference

Quick commands and links for common development tasks.

---

## 🚀 Quick Commands

### Development
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Type check
npx tsc --noEmit
```

### Deployment
```bash
# Deploy to Vercel (CLI)
vercel

# Deploy to production
vercel --prod

# Check deployment status
vercel ls
```

### Maintenance
```bash
# Update all dependencies
npm update

# Check for outdated packages
npm outdated

# Clean install
rm -rf node_modules .next && npm install
```

---

## 📚 Documentation Quick Links

| Task | Link |
|------|------|
| Initial setup | [docs/SETUP.md](./docs/SETUP.md) |
| Deploy to production | [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) |
| Understand architecture | [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) |
| ML integration | [docs/ML_MODELS.md](./docs/ML_MODELS.md) |
| Version history | [docs/CHANGELOG.md](./docs/CHANGELOG.md) |

---

## 🔗 Important URLs

### Local Development
- **Dev Server:** http://localhost:3000
- **Database Viewer:** http://localhost:3000/dashboard/database
- **Predictions:** http://localhost:3000/dashboard/predictions
- **Analytics:** http://localhost:3000/dashboard/analytics

### External Services
- **Firebase Console:** https://console.firebase.google.com/
- **Google Cloud Console:** https://console.cloud.google.com/
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Vertex AI Endpoints:** https://console.cloud.google.com/vertex-ai/endpoints

---

## 🔑 Environment Variables

### Required (Firebase)
```bash
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_DATABASE_URL
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
```

### Optional (ML Features)
```bash
GOOGLE_CLOUD_PROJECT_ID
GOOGLE_CLOUD_LOCATION
VERTEX_AI_ENDPOINT_ID
GOOGLE_SERVICE_ACCOUNT_KEY
```

---

## 🐛 Common Issues

### Port 3000 in Use
```bash
npx kill-port 3000
# Or use different port
PORT=3001 npm run dev
```

### Build Errors
```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

### Firebase Connection
1. Check environment variables
2. Verify Firebase project is active
3. Check Database URL region

### Vertex AI Auth
**Local:**
```bash
gcloud auth application-default login
```
**Vercel:** Set `GOOGLE_SERVICE_ACCOUNT_KEY`

---

## 📊 ML Model Quick Info

- **Type:** LSTM Time-Series Forecasting
- **Input:** 50 timesteps × 15 features
- **Output:** 15 predicted values
- **Performance:** R² 96.99%, MAE 0.103

**Feature Order:**
HR, SpO2, AccX, AccY, AccZ, GyroX, GyroY, GyroZ, Aroll, Apitch, Groll, Gpitch, Gy, Combroll, Combpitch

---

## 🎯 Project Structure

```
Talaria/
├── src/              # Source code
│   ├── app/          # Pages & API routes
│   ├── components/   # React components
│   └── lib/          # Utilities
├── public/           # Static assets
├── docs/             # Documentation
└── README.md         # Main readme
```

---

## 🔄 Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature

# Make changes and commit
git add .
git commit -m "Description of changes"

# Push to remote
git push origin feature/your-feature

# Create PR on GitHub
```

---

## 📱 Contact & Support

- **Issues:** GitHub Issues
- **Docs:** `/docs` directory
- **README:** Main project README

---

**Last Updated:** October 2025

# Quick Start - Firebase Integration

## ✅ What's Been Completed

All dashboard components have been successfully integrated with Firebase Realtime Database:

1. **Section Cards** - Display real-time health metrics (Heart Rate, SpO2, Steps, Duration)
2. **Interactive Chart** - Visualize sensor data over time with metric switching
3. **Data Table** - Show recent sensor readings in table format
4. **Custom Hooks** - Four React hooks for easy Firebase data access

## 🚀 Quick Setup (3 Steps)

### Step 1: Create `.env.local` File
In your project root, create `.env.local` with your Firebase credentials:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

**Get these from**: Firebase Console → Project Settings → Your Web App

### Step 2: Start Development Server
```bash
npm run dev
```

### Step 3: Test Dashboard
Open http://localhost:3000/dashboard - you should see real-time data!

## 📁 Files Modified

- ✅ `src/components/section-cards.tsx` - Real-time health metrics cards
- ✅ `src/components/chart-area-interactive.tsx` - Interactive sensor data chart
- ✅ `src/app/dashboard/page.tsx` - Dashboard page with Firebase integration
- ✅ `src/lib/firebase.ts` - Firebase configuration (created)
- ✅ `src/types/sensor.ts` - TypeScript types (created)
- ✅ `src/hooks/use-sensor-data.ts` - Custom React hooks (created)
- ✅ `.env.local.example` - Environment variables template (created)

## 🔥 Firebase Database Structure

Your Firebase Realtime Database needs this structure:

```
/sensorReadings
  /<unique_id>
    timestamp: 1735582800000
    mpu6050:
      accelX: 0.52
      accelY: -0.31
      accelZ: 9.67
      gyroX: -1.23
      gyroY: 0.85
      gyroZ: -0.42
    max30102:
      heartRate: 72
      spo2: 98
```

## 🎯 Features

### Section Cards
- **Heart Rate**: Average BPM with trend indicator
- **SpO2**: Blood oxygen percentage with trend
- **Steps**: Total step count from accelerometer
- **Duration**: Active monitoring duration

### Interactive Chart
- Switch between Heart Rate, SpO2, and Movement metrics
- Time range filters (Last 7, 30, or 100 readings)
- Hover tooltips with detailed information
- Auto-updating with new Firebase data

### Data Table
- Recent 50 sensor readings
- Timestamp, heart rate, SpO2, and acceleration data
- Sortable columns
- Pagination support

## ⚠️ Troubleshooting

### "No data available"
→ Add sensor readings to Firebase at `/sensorReadings` path

### "Error loading data"
→ Check `.env.local` file has correct Firebase credentials

### Dashboard loading forever
→ Verify Firebase Database URL and check browser console

## 📚 Documentation

For detailed setup instructions, see:
- `FIREBASE_SETUP.md` - Complete Firebase integration guide
- `.env.local.example` - Environment variables template

## 🎨 What to Customize

You can easily customize:
- Number of readings displayed (change `limit` parameter in hooks)
- Card colors and icons (edit `section-cards.tsx`)
- Chart appearance (edit `chart-area-interactive.tsx`)
- Table columns (edit `data-table.tsx` and dashboard page mapping)

---

**Next Step**: Add your Firebase credentials to `.env.local` and start the dev server!

# Firebase Integration Setup Guide

## Overview
The Talaria dashboard has been successfully integrated with Firebase Realtime Database to display real-time sensor data from MPU6050 (accelerometer/gyroscope) and MAX30102 (heart rate/SpO2) sensors.

## Updated Components

### 1. **Section Cards** (`src/components/section-cards.tsx`)
- **What Changed**: Now displays real-time health metrics instead of static placeholder data
- **Features**:
  - Average Heart Rate with BPM trending
  - Blood Oxygen Level (SpO2) with percentage trending
  - Total Steps counted from accelerometer data
  - Active Duration in minutes
  - Live updating with Firebase real-time listeners
  - Error handling with user-friendly messages

### 2. **Interactive Chart** (`src/components/chart-area-interactive.tsx`)
- **What Changed**: Completely rewritten to visualize sensor data over time
- **Features**:
  - Three metric types: Heart Rate, SpO2, and Movement Intensity
  - Switchable between metrics using dropdown selector
  - Time range filters (Last 7, 30, or 100 readings)
  - Area chart with gradient fills
  - Formatted timestamps and appropriate Y-axis ranges
  - Loading states and error handling
  - Mobile-responsive selectors

### 3. **Dashboard Page** (`src/app/dashboard/page.tsx`)
- **What Changed**: Now fetches and displays live sensor data from Firebase
- **Features**:
  - Uses `useSensorData` hook to fetch last 50 readings
  - Transforms sensor data to table format
  - Loading and error states
  - Real-time updates when new data arrives

## Firebase Configuration

### Required Environment Variables
Create a `.env.local` file in the project root with your Firebase credentials:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### How to Get Firebase Credentials

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Select Your Project**: `project-talaria-1d870` (or create a new one)
3. **Navigate to Project Settings**:
   - Click the gear icon ⚙️ next to "Project Overview"
   - Select "Project settings"
4. **Scroll to "Your apps"** section
5. **Click on the Web App** or create one if it doesn't exist
6. **Copy the Firebase config object** values into your `.env.local` file

### Firebase Database Structure
Your Firebase Realtime Database should have this structure:

```json
{
  "sensorReadings": {
    "<unique_id>": {
      "timestamp": 1735582800000,
      "mpu6050": {
        "accelX": 0.52,
        "accelY": -0.31,
        "accelZ": 9.67,
        "gyroX": -1.23,
        "gyroY": 0.85,
        "gyroZ": -0.42
      },
      "max30102": {
        "heartRate": 72,
        "spo2": 98
      }
    }
  }
}
```

### Firebase Security Rules
Set up your Firebase Realtime Database rules to allow reading:

```json
{
  "rules": {
    "sensorReadings": {
      ".read": true,
      ".write": "auth != null"
    }
  }
}
```

**Note**: For production, implement proper authentication and more restrictive rules.

## Custom Hooks

### 1. `useSensorData(limit: number)`
Fetches the most recent sensor readings from Firebase.

**Parameters**:
- `limit`: Number of readings to fetch (default: 100)

**Returns**:
```typescript
{
  data: SensorReading[],    // Array of sensor readings
  loading: boolean,          // True while fetching
  error: string | null       // Error message if any
}
```

### 2. `useLatestReading()`
Fetches only the most recent sensor reading.

**Returns**:
```typescript
{
  reading: SensorReading | null,  // Latest sensor reading
  loading: boolean,                // True while fetching
  error: string | null             // Error message if any
}
```

### 3. `useDashboardStats()`
Calculates dashboard statistics from recent sensor data.

**Returns**:
```typescript
{
  stats: DashboardStats | null,   // Calculated statistics
  loading: boolean,                // True while calculating
  error: string | null             // Error message if any
}
```

**DashboardStats includes**:
- `avgHeartRate`: Average heart rate from last 100 readings
- `avgSpo2`: Average SpO2 from last 100 readings
- `totalSteps`: Estimated steps from accelerometer
- `activeDuration`: Active session duration in minutes
- `heartRateTrend`: Percentage change in heart rate
- `spo2Trend`: Percentage change in SpO2
- `stepsTrend`: Percentage change in step count

### 4. `useChartData(limit: number)`
Formats sensor data for chart visualization.

**Parameters**:
- `limit`: Number of readings to fetch (default: 30)

**Returns**:
```typescript
{
  chartData: ChartDataPoint[],    // Formatted chart data
  loading: boolean,                // True while fetching
  error: string | null             // Error message if any
}
```

## Testing the Integration

### 1. **Start the Development Server**
```bash
npm run dev
```

### 2. **Navigate to Dashboard**
Open http://localhost:3000/dashboard in your browser

### 3. **Check for Data**
You should see:
- ✅ Section cards with real-time heart rate, SpO2, steps, and duration
- ✅ Interactive chart showing sensor data over time
- ✅ Data table with recent sensor readings
- ⚠️ If you see "No data available" or loading messages, check your Firebase configuration

### 4. **Test Real-Time Updates**
- Add new sensor readings to your Firebase database manually
- The dashboard should automatically update without refreshing
- Try the Firebase Realtime Database console to add test data

### 5. **Test Chart Interactions**
- Switch between Heart Rate, SpO2, and Movement metrics
- Change time range (Last 7, 30, or 100 readings)
- Hover over chart to see detailed tooltips

## Troubleshooting

### Issue: "Error loading data" messages
**Solution**: 
1. Verify `.env.local` file exists and has correct Firebase credentials
2. Check Firebase Database URL is correct
3. Ensure Firebase Database rules allow reading
4. Verify sensor data exists in the `sensorReadings` path

### Issue: Dashboard shows loading forever
**Solution**:
1. Check browser console for errors (F12)
2. Verify Firebase SDK is installed: `npm list firebase`
3. Check network tab to see if Firebase requests are failing
4. Ensure you're using the correct database URL format

### Issue: Chart not displaying
**Solution**:
1. Verify sensor data has valid timestamps
2. Check that heart rate, SpO2, and accelerometer values are numbers
3. Ensure at least one sensor reading exists in Firebase

### Issue: "No sensor data available"
**Solution**:
1. Verify data exists at `/sensorReadings` in Firebase
2. Check Firebase console to see your data structure
3. Ensure readings have the correct format (see structure above)

## Data Format Requirements

### MPU6050 Sensor Data
- `accelX`, `accelY`, `accelZ`: Number (in g, typically -16 to +16)
- `gyroX`, `gyroY`, `gyroZ`: Number (in °/s, typically -250 to +250)

### MAX30102 Sensor Data
- `heartRate`: Number (BPM, typically 40-200)
- `spo2`: Number (percentage, typically 85-100)

### Timestamp
- Must be a valid Unix timestamp in milliseconds
- Example: `1735582800000` (converts to human-readable date)

## Next Steps

1. **Add your Firebase credentials** to `.env.local`
2. **Populate Firebase** with sensor readings from your hardware
3. **Test the dashboard** to see real-time updates
4. **Customize** the dashboard components as needed
5. **Implement authentication** for production use
6. **Set up proper Firebase security rules**

## Additional Resources

- [Firebase Realtime Database Documentation](https://firebase.google.com/docs/database)
- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [Recharts Documentation](https://recharts.org/)
- [shadcn/ui Components](https://ui.shadcn.com/)

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify Firebase configuration is correct
3. Ensure sensor data format matches the expected structure
4. Check that Firebase SDK is properly installed

---

**Created**: June 10, 2025  
**Last Updated**: June 10, 2025  
**Version**: 1.0.0

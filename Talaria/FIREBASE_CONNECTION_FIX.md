# 🔥 FIREBASE DATABASE CONNECTION - CRITICAL STEPS

## ⚠️ IMMEDIATE ACTION REQUIRED

Your Firebase configuration is set up correctly, but you need to verify a few things:

### Step 1: Restart the Development Server

**IMPORTANT:** Environment variables are only loaded when the server starts. You MUST restart:

```powershell
# In your terminal, press Ctrl+C to stop the server
# Then run:
npm run dev
```

### Step 2: Check Firebase Realtime Database Rules

Your database might be blocking read access. Go to:
1. Firebase Console: https://console.firebase.google.com/
2. Select project: **project-talaria-1d870**
3. Go to: **Realtime Database** > **Rules** tab
4. Temporarily set rules to:

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

Click **Publish** to save.

⚠️ **WARNING:** These rules allow anyone to read/write. For production, use proper authentication.

### Step 3: Verify Your Data Path

Based on your Firebase configuration, your database URL is:
```
https://project-talaria-1d870-default-rtdb.firebaseio.com
```

The app is looking for data at: `/readings`

**Check your Firebase Console:**
1. Go to Realtime Database > Data tab
2. Verify you have data at the path: `/readings`
3. If your data is at a different path (like `/sensorData` or `/devices`), you'll see it in the Firebase Debug Panel

### Step 4: Use the Firebase Debug Panel

After restarting the server:
1. Go to: http://localhost:3000/dashboard/database
2. You'll see a **blue Firebase Debug Panel** at the top
3. It will show you:
   - ✓ or ✗ for each environment variable
   - Available paths in your database
   - Raw data from Firebase
   - Any connection errors

**Look at the browser console (F12)** for detailed logs showing exactly what's happening.

### Step 5: Common Issues & Solutions

#### Issue: "No data at /readings"
**Solution:** Your data might be at a different path. Check the Debug Panel's "Available Paths" section.

#### Issue: "Permission denied"
**Solution:** Update your Firebase Realtime Database rules (see Step 2).

#### Issue: "NEXT_PUBLIC_FIREBASE_DATABASE_URL is undefined"
**Solution:** Restart the development server (Step 1).

#### Issue: Environment variables not loading
**Solution:** 
- Make sure `.env.local` is in the project root (same folder as `package.json`)
- Restart the development server completely
- Check that variable names start with `NEXT_PUBLIC_`

### Step 6: Verify Data Structure

Your sensor readings should have this structure:
```json
{
  "readings": {
    "reading-id-1": {
      "timestamp": 1234567890,
      "max30102": {
        "heartRate": 75,
        "spo2": 98
      },
      "mpu6050": {
        "accelX": 0.5,
        "accelY": -0.2,
        "accelZ": 9.8,
        "gyroX": 0.1,
        "gyroY": -0.05,
        "gyroZ": 0.0
      }
    }
  }
}
```

## 🎯 Expected Result

After following these steps:
1. Database page shows the Firebase Debug Panel with ✓ for all environment variables
2. You see a list of "Available Paths" in the debug panel
3. The data table shows your sensor readings
4. Analytics page displays KPI cards with real data
5. Browser console shows logs like: "📊 useAllSensorData: Parsed X readings"

## 🆘 Still Not Working?

1. Open browser DevTools (F12) and check the **Console** tab
2. Look for red error messages or the 📊 emoji logs
3. Take a screenshot of:
   - The Firebase Debug Panel
   - Browser console logs
   - Your Firebase Console Data tab

The debug panel will tell you EXACTLY what's wrong!

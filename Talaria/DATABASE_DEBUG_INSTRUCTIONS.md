# Database Debug Instructions

## ✅ Fixed Issues

1. **Removed hardcoded device ID** - Now reads from root `/`
2. **Removed wrong path prefix** - No more `devices/` prefix
3. **Dynamic multi-device support** - Works with any ESP32
4. **Proper imports** - Only `ref` and `onValue` from Firebase

## 🔍 How to Debug Database Updates

### Method 1: Check Browser Console

1. Open http://localhost:3001 in your browser
2. Press F12 to open Developer Tools
3. Go to Console tab
4. Navigate to Dashboard > Database page
5. Look for any error messages in red

### Method 2: Check Network Tab

1. Open Developer Tools (F12)
2. Go to Network tab
3. Refresh the page
4. Look for any failed requests to Firebase

### Method 3: Test Firebase Connection Directly

Add this temporary debug code to your dashboard page:

```typescript
// Add to src/app/dashboard/database/page.tsx at the top
useEffect(() => {
  console.log('=== DATABASE DEBUG ===');
  console.log('Database object:', database);
  console.log('Database URL:', database.app.options.databaseURL);
  
  // Test direct connection
  const testRef = ref(database, '/');
  onValue(testRef, (snapshot) => {
    console.log('Firebase connected:', snapshot.exists());
    console.log('Root keys:', Object.keys(snapshot.val() || {}));
    
    if (snapshot.exists()) {
      const data = snapshot.val();
      console.log('Device IDs:', Object.keys(data));
      Object.keys(data).forEach(deviceId => {
        const device = data[deviceId];
        if (device.readings) {
          const readingCount = Object.keys(device.readings).length;
          console.log(`Device ${deviceId}: ${readingCount} readings`);
        }
      });
    }
  }, (error) => {
    console.error('Firebase error:', error);
  });
}, []);
```

## 🔧 Common Issues & Solutions

### Issue 1: "No data showing"
**Check:**
- Is your ESP32 actually sending data?
- Check Firebase Console: https://console.firebase.google.com/
- Go to Realtime Database > Data tab
- Verify you see your device ID and readings

**Fix:**
- Verify `.env.local` has correct Firebase credentials
- Check Firebase Rules allow reading

### Issue 2: "Permission Denied"
**Firebase Rules:**
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

### Issue 3: "Old data showing"
**Solutions:**
1. Click Refresh button
2. Hard reload browser (Ctrl+Shift+R)
3. Check Firebase Console for latest data
4. Verify ESP32 is connected and sending

## 📊 Verify Your Database Structure

Your structure should look like:
```
{
  "DHPGuCZhvxTDQOgdIL981Ktmv0B2": {
    "readings": {
      "-ObJyL3BmycL_de2fPUy": {
        "ts": 1760214737166,
        "accX": [...],
        "hr": [...],
        "spo2": [...],
        ...
      }
    }
  }
}
```

## ✅ Verification Checklist

- [ ] Dev server running on http://localhost:3001
- [ ] No errors in terminal
- [ ] No errors in browser console
- [ ] Firebase credentials in `.env.local`
- [ ] Firebase database URL correct
- [ ] Firebase rules allow reading
- [ ] ESP32 connected and sending data
- [ ] Can see data in Firebase Console

## 🎯 Expected Behavior

**When working correctly:**
1. Navigate to Dashboard > Database
2. See loading spinner briefly
3. See data table with readings
4. See "Last Updated" timestamp
5. Click Refresh → New data appears
6. Real-time updates when ESP32 sends data

## 📱 Test Real-Time Updates

1. Keep Dashboard > Database page open
2. Have ESP32 send new data
3. Should see table update automatically
4. No refresh button needed (but it works too)

## 🔍 Debug Output Example

When working, console should show:
```
useDashboardStats - Data length: 42
useDashboardStats - Sample data: {id: "-ObJyL3BmycL_de2fPUy", device_id: "DHPGuCZhvxTDQOgdIL981Ktmv0B2", ts: 1760214737166, ...}
useDashboardStats - Valid readings: 42
```

## 🚨 If Still Not Working

1. **Check Firebase Console manually:**
   - https://console.firebase.google.com/
   - Select your project
   - Go to Realtime Database
   - Do you see data?

2. **Verify Environment Variables:**
   ```bash
   # In Talaria folder
   cat .env.local
   ```
   Should show all NEXT_PUBLIC_FIREBASE_* variables

3. **Test with a simple script:**
   Create `test-firebase.js`:
   ```javascript
   const admin = require('firebase-admin');
   const serviceAccount = require('./serviceAccountKey.json');
   
   admin.initializeApp({
     credential: admin.credential.cert(serviceAccount),
     databaseURL: 'YOUR_DATABASE_URL'
   });
   
   const db = admin.database();
   db.ref('/').once('value', (snapshot) => {
     console.log('Data:', snapshot.val());
   });
   ```

## 📧 Need More Help?

Provide this information:
1. Screenshots of Firebase Console showing data
2. Browser console errors (if any)
3. Terminal errors (if any)
4. Content of .env.local (without sensitive values)
5. Network tab showing Firebase requests

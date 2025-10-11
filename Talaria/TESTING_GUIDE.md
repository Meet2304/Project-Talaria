# Testing Guide - Database Visualizer Updates

## What to Test

### 1. Real-Time Synchronization
**Test Steps:**
1. Open the dashboard database page
2. Have the ESP32 device send new data to Firebase
3. Verify the page updates automatically without refreshing
4. Check that the "Last updated" timestamp changes
5. Confirm the "Live Connection" badge shows a pulsing green dot

**Expected Behavior:**
- Data updates automatically when Firebase changes
- No manual page refresh needed
- Last update time updates in real-time
- Statistics recalculate automatically

### 2. Manual Refresh Button
**Test Steps:**
1. Click the "Refresh" button in the header
2. Observe the spinning refresh icon
3. Verify the last update timestamp changes
4. Confirm data is refreshed from Firebase

**Expected Behavior:**
- Refresh icon spins during loading
- Data reloads from Firebase
- Last update time updates
- Statistics recalculate

### 3. New Field Display
**Test Steps:**
1. Expand a sensor reading by clicking the expand button
2. Verify all new fields are displayed:
   - Heart Rate (HR) with validity indicator
   - SpO2 with validity indicator
   - Temperature in Celsius
   - Accelerometer X/Y/Z values
   - Gyroscope X/Y/Z values
   - Pitch angle
   - Roll angle
   - Yaw angle
   - IR and Red LED values

**Expected Behavior:**
- All fields display correctly
- Values are properly formatted
- Validity indicators (✓) show for valid readings
- Color coding applied (red for HR, blue for SpO2)
- Angles show in degrees

### 4. Statistics Panel
**Test Steps:**
1. Check the statistics cards at the top
2. Verify all five statistics display:
   - Total Readings
   - Total Samples
   - Avg Heart Rate (BPM)
   - Avg SpO2 (%)
   - Time Span (hours)

**Expected Behavior:**
- All statistics calculate correctly
- Numbers update when data changes
- No NaN or undefined values
- Proper formatting with units

### 5. Export Functionality
**Test Steps:**
1. Click the "Export JSON" button
2. Verify a JSON file downloads
3. Open the file and check the structure
4. Confirm all fields are present

**Expected Behavior:**
- File downloads with timestamp in name
- JSON is valid and properly formatted
- Contains all readings with complete data
- Includes all new fields

### 6. Backward Compatibility
**Test Steps:**
1. If you have old data in Firebase with legacy field names (`bpm`, `ax`, `ay`, etc.)
2. Verify it displays correctly
3. Check that both old and new data work together

**Expected Behavior:**
- Old data displays without errors
- Falls back to legacy field names when new ones aren't available
- No crashes or missing data
- Smooth migration path

## Common Issues to Check

### Issue: No Data Displayed
**Check:**
- Firebase connection is configured correctly
- Device ID matches: `abJOOmcIBVV0oqiUVVYasBkznZa2`
- Firebase database path: `devices/{deviceId}/readings`
- Environment variables are set in `.env.local`

### Issue: Real-Time Updates Not Working
**Check:**
- Firebase Realtime Database rules allow reads
- Network connection is stable
- Browser console for Firebase errors
- Check that `onValue` listener is attached

### Issue: Statistics Show 0 or NaN
**Check:**
- Data arrays have values
- `hr` and `spo2` fields exist in Firebase
- Valid readings are being filtered correctly
- At least one reading with valid data exists

### Issue: Expand Shows No Data
**Check:**
- Reading has `n` value (sample count)
- Array fields (accX, gyroX, etc.) are present
- Arrays have matching lengths
- Sample index is within array bounds

## Device Configuration

The database visualizer expects data in this format from your ESP32:

```cpp
// Device ID (must match in code)
const char* DEVICE_ID = "abJOOmcIBVV0oqiUVVYasBkznZa2";

// Firebase path
// devices/{DEVICE_ID}/readings/{timestamp}

// Data structure (arrays of n samples)
{
  "accX": [array of n values],
  "accY": [array of n values],
  "accZ": [array of n values],
  "gyroX": [array of n values],
  "gyroY": [array of n values],
  "gyroZ": [array of n values],
  "hr": [array of n values],
  "hr_valid": [array of n flags],
  "spo2": [array of n values],
  "spo2_valid": [array of n flags],
  "ir": [array of n values],
  "red": [array of n values],
  "temp_c": [array of n values],
  "apitch": [array of n values],
  "aroll": [array of n values],
  "combpitch": [array of n values],
  "combroll": [array of n values],
  "gpitch": [array of n values],
  "groll": [array of n values],
  "gyaw": [array of n values],
  "n": 17,  // number of samples
  "sample_rate_ms": 100,
  "client_ts_ms": 48531,
  "ts": 1760191990401,  // Unix timestamp in milliseconds
  "device_id": "abJOOmcIBVV0oqiUVVYasBkznZa2"
}
```

## Firebase Console Check

1. Go to Firebase Console
2. Navigate to Realtime Database
3. Check path: `devices/abJOOmcIBVV0oqiUVVYasBkznZa2/readings`
4. Verify data structure matches expected format
5. Check that new readings appear when device sends data

## Browser Console

Open browser DevTools and check for:
- Firebase connection messages
- Data fetch logs
- Any error messages
- WebSocket connection status

## Performance Monitoring

Watch for:
- Memory usage (should be stable)
- CPU usage during updates (should be minimal)
- Network requests (should use WebSocket, not polling)
- Render performance (should be smooth)

## Success Criteria

✅ Data displays immediately on page load
✅ Real-time updates work without manual refresh
✅ Refresh button provides manual sync option
✅ All 13+ sensor fields display correctly
✅ Statistics calculate accurately
✅ Export functionality works
✅ No console errors
✅ Smooth performance with large datasets
✅ Mobile responsive design works
✅ Backward compatible with old data

## Support

If you encounter issues:
1. Check browser console for errors
2. Verify Firebase connection status
3. Check device ID matches in both places
4. Review Firebase database rules
5. Ensure environment variables are set
6. Check network connectivity

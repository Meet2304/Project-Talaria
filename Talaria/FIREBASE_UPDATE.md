# Firebase Integration Update - Database & Analytics

## Overview
Updated the Database and Analytics pages to properly fetch and display real-time data from Firebase Realtime Database.

## Changes Made

### 1. ✅ Fixed Firebase Database Path

**File**: `src/hooks/use-sensor-data.ts`

**Issue**: The hooks were looking for data at `/sensorData` but your Firebase database uses `/sensorReadings`

**Fix**: Changed all references from `"sensorData"` to `"sensorReadings"`

```typescript
// Before
const sensorRef = ref(database, "sensorData");

// After  
const sensorRef = ref(database, "sensorReadings");
```

### 2. ✅ Added New Hook for Complete Database Access

**File**: `src/hooks/use-sensor-data.ts`

**New Hook**: `useAllSensorData()`

**Purpose**: Fetches ALL sensor readings from Firebase without any limit

**Features**:
- No limit on number of readings returned
- Real-time updates with Firebase `onValue` listener
- Returns all data sorted by timestamp (most recent first)
- Proper error handling and loading states

**Usage**:
```typescript
const { data, loading, error } = useAllSensorData();
```

### 3. ✅ Enhanced Database Page

**File**: `src/app/dashboard/database/page.tsx`

**Changes**:

#### Uses `useAllSensorData()` Hook
- Fetches complete database instead of limited 100 readings
- Real-time updates when new data arrives in Firebase

#### Improved Header Section
- **Export Button**: Download entire database as JSON file
  - Filename includes timestamp: `talaria-sensor-data-[ISO-timestamp].json`
  - Disabled when no data or still loading
  - One-click export functionality

#### Database Statistics Dashboard
Added 4-column statistics grid showing:
1. **Total Readings**: Complete count of all sensor readings
2. **Avg Heart Rate**: Average across all readings (in BPM)
3. **Avg SpO2**: Average blood oxygen level (percentage)
4. **Time Span**: Duration from oldest to newest reading (in hours)

#### Live Connection Indicator
- Green pulsing badge showing "Live Connection"
- Real-time last updated timestamp
- Visual feedback that data is streaming from Firebase

#### Data Table
- Shows all readings with detailed information:
  - Timestamp
  - Heart Rate (BPM)
  - SpO2 (%)
  - Accelerometer values (X, Y, Z)
  - Gyroscope values (X, Y, Z)
  - Reading number

### 4. ✅ Analytics Page Already Configured

**File**: `src/app/dashboard/analytics/page.tsx`

**Status**: Already properly integrated with Firebase

**Components Using Firebase Data**:
1. **SectionCards** - KPI metrics (Heart Rate, SpO2, Steps, Duration)
   - Uses `useDashboardStats()` hook
   - Real-time calculations from last 100 readings
   - Trend indicators showing percentage changes

2. **ChartAreaInteractive** - Main chart visualization
   - Uses `useChartData()` hook
   - Switchable metrics (Heart Rate, SpO2, Movement)
   - Configurable time ranges (Last 7, 30, or 100 readings)
   - Real-time updates

**How It Works**:
- All components automatically fetch from Firebase on mount
- Real-time listeners keep data in sync
- Loading and error states handled gracefully
- No manual refresh needed - updates automatically

## Data Flow

```
Firebase Realtime Database (/sensorReadings)
    ↓
Custom React Hooks (use-sensor-data.ts)
    ↓
Dashboard Pages (Database & Analytics)
    ↓
UI Components (Cards, Charts, Tables)
```

### Hooks Summary

| Hook | Purpose | Limit | Use Case |
|------|---------|-------|----------|
| `useSensorData(limit)` | Fetch recent readings | Configurable | Charts, limited views |
| `useAllSensorData()` | Fetch entire database | None | Database page, exports |
| `useLatestReading()` | Single most recent | 1 | Real-time monitoring |
| `useDashboardStats()` | Calculate metrics | 100 | KPI cards |
| `useChartData(limit)` | Format for charts | Configurable | Chart components |

## Features Added

### Database Page Features
✅ **Complete Database View**
- All sensor readings displayed in table
- No pagination limits - full dataset access

✅ **Export Functionality**
- One-click JSON export
- Timestamped filenames
- Complete data preservation

✅ **Statistics Dashboard**
- Total reading count
- Average heart rate across all data
- Average SpO2 across all data  
- Time span calculation

✅ **Real-time Updates**
- Live connection indicator with pulse animation
- Auto-updates when new data arrives
- Last updated timestamp display

### Analytics Page Features (Already Working)
✅ **KPI Metrics**
- Heart Rate with trend
- SpO2 with trend
- Total Steps with trend
- Active Duration

✅ **Interactive Charts**
- Switchable metrics (HR, SpO2, Movement)
- Time range filters
- Hover tooltips
- Gradient area fills

✅ **Placeholder Charts**
- Heart Rate Zones
- SpO2 Variability
- Gait Analysis
- Activity Heatmap

## Testing Checklist

### Database Page Tests
- [x] Page loads without errors
- [x] Fetches all data from Firebase
- [x] Statistics calculated correctly
- [x] Export button downloads JSON
- [x] Live connection badge shows
- [x] Data table displays all readings
- [x] Real-time updates work

### Analytics Page Tests
- [x] KPI cards show real data
- [x] Chart displays sensor data
- [x] Metric switching works
- [x] Time range filters work
- [x] Loading states display
- [x] Error handling works
- [x] Real-time updates work

## Firebase Database Structure

Your database should have this structure at `/sensorReadings`:

```json
{
  "sensorReadings": {
    "unique-id-1": {
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
    },
    "unique-id-2": { ... }
  }
}
```

## Troubleshooting

### "No data available" Message
**Cause**: Database path mismatch or no data in Firebase  
**Solution**: 
1. Verify data exists at `/sensorReadings` path in Firebase Console
2. Check `.env.local` has correct Firebase Database URL
3. Ensure Firebase rules allow reading

### Data Not Updating
**Cause**: Firebase listener not connected  
**Solution**:
1. Check browser console for Firebase errors
2. Verify internet connection
3. Check Firebase Database rules allow real-time access

### Export Button Not Working
**Cause**: Browser blocking downloads or no data  
**Solution**:
1. Ensure data has loaded (check loading state)
2. Check browser allows downloads from localhost
3. Verify sensor readings array is not empty

## Performance Notes

- **Database Page**: Fetches ALL data - may be slower with large datasets (1000+ readings)
- **Analytics Page**: Uses limited queries (100 readings) - faster performance
- **Real-time Listeners**: Minimal overhead, efficient Firebase connection
- **Auto-cleanup**: All listeners properly cleaned up on component unmount

## Next Steps

### Recommended Enhancements:

1. **Database Page**:
   - Add pagination for large datasets
   - Add date range filters
   - Add search/filter functionality
   - Add CSV export option
   - Add column sorting

2. **Analytics Page**:
   - Implement the 4 placeholder charts:
     - Heart Rate Zones (bar chart)
     - SpO2 Variability (line chart with bands)
     - Gait Analysis (step pattern visualization)
     - Activity Heatmap (time-based heatmap)

3. **General**:
   - Add data refresh button (manual trigger)
   - Add connection status indicator
   - Add data quality metrics
   - Add data validation alerts

---

**Implementation Date**: June 10, 2025  
**Status**: ✅ Complete and Tested  
**Breaking Changes**: None - All existing functionality preserved

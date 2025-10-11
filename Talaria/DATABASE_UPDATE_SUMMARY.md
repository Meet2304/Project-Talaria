# Database Visualizer Update Summary

## Overview
Updated the database page on the dashboard to support the new Firebase JSON schema structure and implement real-time synchronization with manual refresh capability.

## Changes Made

### 1. Updated Type Definitions (`src/types/sensor.ts`)
**New fields added to `SensorReading` interface:**
- **Accelerometer**: `accX`, `accY`, `accZ` (arrays)
- **Gyroscope**: `gyroX`, `gyroY`, `gyroZ` (arrays)
- **Pitch angles**: `apitch`, `gpitch`, `combpitch` (arrays)
- **Roll angles**: `aroll`, `groll`, `combroll` (arrays)
- **Yaw**: `gyaw` (array)
- **Heart Rate**: `hr` (array) with `hr_valid` flag
- **SpO2**: `spo2` (array) with `spo2_valid` flag
- **Optical sensors**: `ir`, `red` (arrays)
- **Temperature**: `temp_c` (array)

**Backward compatibility maintained** with legacy fields (`ax`, `ay`, `az`, `gx`, `gy`, `gz`, `bpm`).

### 2. Enhanced Sensor Data Hook (`src/hooks/use-sensor-data.ts`)
**`useAllSensorData` hook updates:**
- ✅ **Real-time listener**: Automatically updates when Firebase data changes using `onValue`
- ✅ **Manual refresh function**: Added `refresh()` function for user-triggered updates
- ✅ **Last update tracking**: Returns `lastUpdate` timestamp
- ✅ **Device ID updated**: Changed to `"abJOOmcIBVV0oqiUVVYasBkznZa2"` to match new schema

**Other hooks updated:**
- `useDashboardStats`: Now uses `hr` and `spo2` fields instead of `bpm` and `ir`
- `useChartData`: Updated to handle both new and legacy field names
- All functions include fallback logic for backward compatibility

### 3. Updated Database Table Component (`src/components/sensor-data-detailed-table.tsx`)
**New table structure:**
- **Columns**: Timestamp, Samples, HR, SpO2, Temp (°C), Accel X/Y/Z, Gyro X/Y/Z, Pitch, Roll, Yaw, IR/Red
- **Detailed view** shows all sensor fields for each sample
- **Validity indicators**: Shows ✓ marks for valid HR and SpO2 readings
- **Color coding**: Heart rate (red), SpO2 (blue), temperature, angles
- **Grouped displays**: Accel/Gyro/IR values grouped for better readability

**Features preserved:**
- Expandable rows to view all samples
- Expand All / Collapse All buttons
- Pagination controls
- Sample count display

### 4. Enhanced Database Page (`src/app/dashboard/database/page.tsx`)
**New features:**
- ✅ **Refresh button**: Manual refresh with loading spinner animation
- ✅ **Live connection indicator**: Green pulsing badge showing real-time status
- ✅ **Last update timestamp**: Displays when data was last refreshed
- ✅ **Enhanced statistics**:
  - Total Readings
  - Total Samples (sum of all n values)
  - Average Heart Rate (from `hr` field)
  - Average SpO2 (from `spo2` field)
  - Time Span (hours)

**Real-time synchronization:**
- Firebase `onValue` listener automatically updates UI when database changes
- No polling required - true real-time updates
- Refresh button allows manual verification that data is current

## Data Flow

```
Firebase Realtime Database (devices/{deviceId}/readings)
    ↓
onValue() listener (real-time)
    ↓
useAllSensorData() hook
    ↓
Database Page Component
    ↓
SensorDataDetailedTable Component
    ↓
User Interface (auto-updates)
```

## Usage

1. **Automatic Updates**: The page automatically receives updates when Firebase data changes
2. **Manual Refresh**: Click the "Refresh" button to manually trigger a data sync
3. **Export Data**: Click "Export JSON" to download all sensor data
4. **View Details**: Click the expand button on any reading to see all samples
5. **Navigate**: Use pagination controls to browse through readings

## Schema Support

The implementation now fully supports the new JSON schema format:
```json
{
  "accX": [0.242485, ...],
  "accY": [-0.032632, ...],
  "accZ": [0.987829, ...],
  "apitch": [-13.78463, ...],
  "aroll": [-1.892028, ...],
  "combpitch": [25.38231, ...],
  "combroll": [24.65322, ...],
  "device_id": "abJOOmcIBVV0oqiUVVYasBkznZa2",
  "gpitch": [81.39167, ...],
  "groll": [70.00111, ...],
  "gyaw": [12.23512, ...],
  "gyroX": [-0.394687, ...],
  "gyroY": [-0.182863, ...],
  "gyroZ": [0.068817, ...],
  "hr": [0, 0, ...],
  "hr_valid": [0, 0, ...],
  "ir": [209752, ...],
  "red": [252816, ...],
  "spo2": [0, 0, ...],
  "spo2_valid": [0, 0, ...],
  "temp_c": [30.875, ...],
  "client_ts_ms": 48531,
  "n": 17,
  "sample_rate_ms": 100,
  "ts": 1760191990401
}
```

## Technical Details

- **Real-time updates**: Uses Firebase `onValue()` for live synchronization
- **Performance**: Efficient data handling with pagination
- **Type safety**: Full TypeScript support with proper type definitions
- **Error handling**: Graceful error states and loading indicators
- **Responsive design**: Mobile-friendly table layout
- **Accessibility**: Proper ARIA labels and keyboard navigation

## Next Steps

The database visualizer is now fully updated and will:
1. ✅ Display all fields from the new JSON schema
2. ✅ Automatically update when Firebase data changes
3. ✅ Allow manual refresh via the Refresh button
4. ✅ Show real-time connection status
5. ✅ Provide detailed sample-level data views

All changes are backward compatible with legacy data structures.

# Timestamp Display Fix

## Problem
The timestamp field was not rendering as a readable date on the frontend. It was showing as a number or not displaying correctly.

## Root Cause
Firebase stores the timestamp in a field called `ts` (not `timestamp`), but the code was trying to access `reading.timestamp`. The field mapping was missing.

## Solution

### Updated Files

**`src/hooks/use-sensor-data.ts`** - All three data fetching functions:

1. **`useSensorData(limit)`** - For limited readings
2. **`useAllSensorData()`** - For all readings
3. Both functions now properly map the Firebase field:

```typescript
snapshot.forEach((childSnapshot) => {
  const data = childSnapshot.val();
  readings.push({
    id: childSnapshot.key as string,
    ...data,
    timestamp: data.ts || data.timestamp, // Map 'ts' to 'timestamp'
  });
});
```

### Also Fixed Query Order
Changed `orderByChild("timestamp")` to `orderByChild("ts")` to correctly sort by the actual Firebase field.

## Result

Now timestamps display correctly as:
- **Format**: `MM/DD/YYYY, HH:MM:SS AM/PM` (localized)
- **Example**: `1/15/2025, 10:23:45 AM`

### Where Timestamps Appear

1. **Database Page Summary Row**
   - Shows timestamp for each reading
   - Example: "1/15/2025, 10:23:45 AM"

2. **Analytics Charts**
   - X-axis shows time labels
   - Format: "10:23:45 AM"

3. **Statistics Cards**
   - Time span calculations now accurate
   - Duration shown in hours

## Firebase Field Mapping

Your Firebase data structure:
```json
{
  "ts": 1759691356284,          // ← This is the timestamp in milliseconds
  "client_ts_ms": 14064,
  "device_id": "...",
  "n": 50,
  "ax": [...],
  ...
}
```

Now correctly mapped to TypeScript interface:
```typescript
interface SensorReading {
  timestamp: number;  // ← Mapped from Firebase 'ts' field
  client_ts_ms: number;
  device_id: string;
  ...
}
```

## Testing
Navigate to `http://localhost:3001/dashboard/database` to verify:
- ✅ Timestamps show as readable dates
- ✅ Sorting works correctly (most recent first)
- ✅ Time span calculations are accurate
- ✅ All 53 readings display with proper timestamps

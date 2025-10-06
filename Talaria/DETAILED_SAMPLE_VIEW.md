# Detailed Sample View - Complete Implementation

## What Was Changed

Created a new **expandable/collapsible detailed table** that shows **all 50 individual samples** from each of the 53 readings.

### New Component: `SensorDataDetailedTable`

**Location**: `src/components/sensor-data-detailed-table.tsx`

#### Features:

1. **Expandable Rows**
   - Each reading shows as a summary row with an expand button
   - Click to reveal all 50 samples for that reading
   - Each sample shown on its own row with full sensor data

2. **Expand All / Collapse All**
   - Button to expand all readings on current page at once
   - Quickly collapse all back to summary view

3. **Complete Sample Display**
   - All 50 samples displayed per reading
   - Shows sample number (1-50) for each
   - Full precision for all sensor values:
     - Heart Rate (BPM)
     - IR sensor value
     - Accelerometer X, Y, Z (6 decimal places)
     - Gyroscope X, Y, Z (6 decimal places)

4. **Pagination**
   - Shows 10 readings per page (default)
   - Navigate with Previous/Next buttons
   - Page indicator shows current position
   - Shows how many readings are expanded

5. **Visual Organization**
   - Summary rows have gray background
   - Expanded sample rows are white
   - Color-coded badges for heart rate and IR
   - Monospace font for numerical precision

## Data Summary

### Total Data Display Capacity
- **53 readings** total
- **50 samples** per reading
- **2,650 total sample rows** when all expanded
- **10 sensor channels** per sample

### Per Sample Display
1. Sample # (1-50)
2. Heart Rate (BPM) - with red badge if > 0
3. IR Sensor - with blue badge
4. Accelerometer X (g-force)
5. Accelerometer Y (g-force)
6. Accelerometer Z (g-force)
7. Gyroscope X (degrees/sec)
8. Gyroscope Y (degrees/sec)
9. Gyroscope Z (degrees/sec)

### Pagination Strategy
- **10 readings per page** = 6 total pages
- Each page can expand to show **up to 500 sample rows** (10 readings × 50 samples)
- Summary view keeps page lightweight
- Expand only the readings you want to analyze in detail

## How to Use

1. **Navigate to Database Page**
   - Go to `http://localhost:3001/dashboard/database`

2. **View Summary**
   - Each row shows one reading with timestamp
   - Badge shows "50 samples" 
   - Text indicates to click expand

3. **Expand Single Reading**
   - Click the down arrow button in first column
   - All 50 samples appear below the summary row
   - Click up arrow to collapse

4. **Expand All on Page**
   - Click "Expand All" button in header
   - All 10 readings on current page expand
   - Shows all 500 samples at once
   - Click "Collapse All" to hide samples

5. **Navigate Pages**
   - Use Previous/Next buttons
   - Expansion state resets when changing pages
   - Page indicator shows "Page X of 6"

## Performance Considerations

- **Efficient Rendering**: Only renders expanded samples (not all 2,650 at once)
- **Page-based Loading**: 10 readings per page keeps DOM manageable
- **Lazy Expansion**: Samples only rendered when expanded
- **State Management**: Tracks which readings are expanded per page

## Example Data View

### Summary Row (Collapsed)
```
[▼] #1  2025-01-15 10:23:45  [50 samples]  Click expand to see all 50 samples
```

### Expanded View (Showing 3 of 50 samples)
```
[▲] #1  2025-01-15 10:23:45  [50 samples]  Click expand to see all 50 samples
        14064ms              1            [0 BPM]  [1004]  -0.000495  0.000808  0.999949  -0.174137  -0.353206  0.667924
                             2            [0 BPM]  [1005]   0.003167 -0.002610  0.994089  -0.517649  -0.078397 -0.706122
                             3            [0 BPM]  [996]   -0.000007  0.001785  0.995798   0.558687  -0.406641  1.293878
        ... 47 more samples ...
```

## Updated Files

1. **Created**: `src/components/sensor-data-detailed-table.tsx` (new component)
2. **Modified**: `src/app/dashboard/database/page.tsx` (imports and uses new component)

## Statistics Still Available

The statistics cards at the top still show:
- **Total Readings**: 53
- **Average Heart Rate**: Calculated from all samples
- **Average IR**: Calculated from all samples  
- **Time Span**: Duration of data collection
- **Export JSON**: Download all raw data

## Next Steps

You can now:
- ✅ View all 53 readings
- ✅ Expand any reading to see all 50 samples
- ✅ See every individual sensor value with full precision
- ✅ Navigate through pages efficiently
- ✅ Export complete data to JSON for external analysis

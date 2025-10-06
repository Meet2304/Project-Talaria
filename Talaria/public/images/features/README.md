# Feature Images Directory

This directory contains visualization images for the Key Features section on the Talaria home page.

## Required Images

### 1. heart-rate-monitoring.png
**Purpose**: Visualize heart rate monitoring capabilities  
**Content Suggestions**:
- Heart rate waveform/ECG graph
- BPM (beats per minute) display showing numbers like "72 BPM"
- Real-time monitoring interface mockup
- Color scheme: Red accents (#dc2626, #ef4444)
- Include MAX30102 sensor reference if possible

### 2. spo2-monitoring.png
**Purpose**: Show blood oxygen saturation tracking  
**Content Suggestions**:
- SpO2 percentage display (e.g., "98%")
- Pulse oximetry waveform
- Oxygen saturation graph over time
- Color scheme: Blue accents (#2563eb, #3b82f6)
- Clean, medical-grade visualization

### 3. gait-analysis.png
**Purpose**: Illustrate movement and gait tracking  
**Content Suggestions**:
- Footstep pattern visualization
- Accelerometer/gyroscope data graphs (X, Y, Z axes)
- Movement trajectory or stride analysis
- Step count or cadence display
- Color scheme: Green accents (#16a34a, #22c55e)
- Motion lines or directional arrows

### 4. live-analytics.png
**Purpose**: Display dashboard and analytics interface  
**Content Suggestions**:
- Dashboard mockup with multiple widgets
- Various chart types (line graphs, bar charts, pie charts)
- Real-time data indicators
- Firebase integration visual cues
- Color scheme: Purple/multi-color (#9333ea, #a855f7)
- Professional analytics interface

## Image Specifications

### Technical Requirements
- **Format**: PNG (with transparency support)
- **Aspect Ratio**: 76:59 (approximately 1.29:1)
- **Recommended Dimensions**: 1520px × 1180px
- **File Size**: Optimize to < 500KB per image
- **Color Space**: sRGB
- **Bit Depth**: 24-bit or 32-bit (with alpha)

### Design Guidelines
- **Style**: Clean, modern, professional
- **Background**: Light/white or transparent
- **Shadows**: Subtle shadows for depth
- **Typography**: If including text, use clean sans-serif fonts
- **Icons**: Sharp, recognizable icons
- **Contrast**: Ensure good contrast for readability
- **Consistency**: Maintain consistent visual language across all 4 images

### Color Palette (Talaria Brand)
- **Primary**: Slate (#0f172a, #1e293b, #334155, #475569, #64748b)
- **Accent**: Blue (#1e40af, #2563eb, #3b82f6)
- **Feature Colors**:
  - Heart Rate: Red (#dc2626, #ef4444)
  - SpO2: Blue (#2563eb, #3b82f6)
  - Gait: Green (#16a34a, #22c55e)
  - Analytics: Purple (#9333ea, #a855f7)

## Design Tools Suggestions

### Creating Images
1. **Figma** - Design mockups and interfaces
2. **Adobe Illustrator** - Vector graphics and charts
3. **Canva** - Quick mockups with templates
4. **Sketch** - UI/UX design tool
5. **Photoshop** - Photo editing and composition

### Stock Resources
- **Unsplash** - Free high-quality images
- **Pexels** - Free stock photos and videos
- **Freepik** - Vectors and graphics
- **Icons8** - UI elements and mockups
- **Dribbble** - Design inspiration

### Chart/Graph Tools
- **Chart.js** - Create charts, screenshot them
- **Recharts** - React chart library
- **D3.js** - Custom data visualizations
- **Google Charts** - Simple charts and graphs

## Quick Start Options

### Option 1: Design from Scratch
Create custom visualizations that exactly match your brand and data.

### Option 2: Use Placeholders
Temporarily use placeholder images while designing:
```
https://via.placeholder.com/1520x1180/f1f5f9/64748b?text=Heart+Rate+Monitoring
https://via.placeholder.com/1520x1180/f1f5f9/3b82f6?text=SpO2+Monitoring
https://via.placeholder.com/1520x1180/f1f5f9/22c55e?text=Gait+Analysis
https://via.placeholder.com/1520x1180/f1f5f9/a855f7?text=Live+Analytics
```

### Option 3: Screenshot Actual Data
If you have the Talaria system running:
1. Capture screenshots of actual monitoring interfaces
2. Crop to appropriate aspect ratio
3. Clean up and enhance in image editor
4. Add labels and annotations

## Image Optimization

After creating images, optimize them:

```bash
# Using ImageOptim (macOS)
# Drag and drop images into ImageOptim

# Using TinyPNG (Online)
# Upload to https://tinypng.com/

# Using CLI tools
pngquant --quality=80-95 image.png
```

## File Naming Convention
✅ Use exactly these names:
- `heart-rate-monitoring.png`
- `spo2-monitoring.png`
- `gait-analysis.png`
- `live-analytics.png`

❌ Don't use:
- Different file extensions (.jpg, .svg, .webp)
- Different naming (heart_rate.png, heartrate.png)
- Spaces in names (heart rate monitoring.png)

## Testing Images

After adding images:
1. Place images in this directory (`/public/images/features/`)
2. Restart the Next.js dev server
3. Navigate to the home page
4. Verify images load correctly
5. Check responsive behavior on different screen sizes
6. Ensure sharp corners are not cutting off images

## Fallback Handling

If images fail to load, the layout will still render with the text content. Consider adding:
- Error state handling
- Skeleton loaders
- Fallback placeholders

## Accessibility

Ensure images have descriptive alt text (already configured):
- "Heart rate monitoring visualization"
- "SpO2 monitoring visualization"
- "Gait analysis visualization"
- "Live analytics dashboard visualization"

## Need Help?

If you need assistance with:
- Image design
- Finding appropriate visuals
- Technical optimization
- Responsive behavior

Contact the development team or refer to the main documentation in `FEATURES_SECTION_UPDATE.md`.

## Status

- [ ] heart-rate-monitoring.png - Pending
- [ ] spo2-monitoring.png - Pending
- [ ] gait-analysis.png - Pending
- [ ] live-analytics.png - Pending

Update this checklist as images are added!

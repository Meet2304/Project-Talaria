# Gallery and ML Models Page Updates

## Date: October 7, 2025

## Changes Made

### 1. Gallery Page Updates

#### Component: `src/components/bento-gallery.tsx`

**Changes:**
- **Transparent Background**: Changed from `bg-background` to `bg-transparent` for the main section
- **Three-Row Layout**: Split images into 3 horizontal scrollable rows instead of single bento grid
- **Horizontal Scrolling**: Each row can be scrolled left and right independently
- **Hidden Scrollbars**: Added CSS to hide scrollbars while maintaining scroll functionality
- **Fixed Image Size**: All images display as 300x300px squares for consistency

**Technical Details:**
```typescript
// Images are split into 3 equal rows
const row1 = imageItems.slice(0, Math.ceil(imageItems.length / 3))
const row2 = imageItems.slice(Math.ceil(imageItems.length / 3), Math.ceil((imageItems.length * 2) / 3))
const row3 = imageItems.slice(Math.ceil((imageItems.length * 2) / 3))

// Each row is independently scrollable
<div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
```

**Features Retained:**
- Image hover effects with scale animation
- Click to open modal for full-size view
- Gradient overlay on hover showing title and description
- Smooth animations with Framer Motion

---

### 2. ML Models Page Updates

#### Component: `src/app/ml-models/page.tsx`

**Changes:**
- **Reduced Models**: Showing only 2 models instead of 4:
  1. Gait Pattern Recognition (CNN-LSTM, 94.5% accuracy)
  2. Cardiovascular Health Predictor (Random Forest, 91.8% accuracy)

- **Added Action Buttons**: Each model now has two action buttons:
  - **View on GitHub**: Links to the model's GitHub repository (external link icon)
  - **Try in Dashboard**: Links to `/dashboard/predictions` page (play icon)

- **Updated Statistics**: 
  - Training Samples: 35K+ (was 50K+)
  - Average Accuracy: 93.2% (was 93.8%)
  - Production Models: 2 (was 4)

**New Model Properties:**
```typescript
{
  githubUrl: "https://github.com/your-org/model-name",
  dashboardUrl: "/dashboard/predictions"
}
```

**Button Implementation:**
```tsx
<Link href={model.githubUrl} target="_blank" rel="noopener noreferrer">
  <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white">
    <ExternalLink className="w-4 h-4 mr-2" />
    View on GitHub
  </Button>
</Link>

<Link href={model.dashboardUrl}>
  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
    <Play className="w-4 h-4 mr-2" />
    Try in Dashboard
  </Button>
</Link>
```

**Features Retained:**
- Detailed model information (type, metrics, use cases)
- Color-coded sections for each model
- Evaluation metrics display (Accuracy, Precision, Recall, F1 Score)
- Training dataset information
- Continuous improvement overview section

---

## New Imports Added

### ML Models Page:
```typescript
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ExternalLink, Play } from "lucide-react";
```

---

## GitHub URLs

Currently using placeholder URLs. Update these with actual repository links:
- Gait Pattern Recognition: `https://github.com/your-org/gait-recognition-model`
- Cardiovascular Predictor: `https://github.com/your-org/cardiovascular-predictor`

---

## User Experience Improvements

1. **Gallery Page**:
   - Cleaner, more transparent design that blends with background
   - Easier navigation with horizontal scrolling per row
   - Better organization with 3-row layout
   - Consistent image sizing for visual harmony

2. **ML Models Page**:
   - More focused with 2 key models
   - Clear call-to-action buttons for exploration
   - Direct links to try models in live dashboard
   - External links to view source code on GitHub
   - Better conversion funnel: Learn → View Code → Try It Out

---

## Next Steps

1. Replace placeholder GitHub URLs with actual repository links
2. Add product images to `/public/images/gallery/` directory (product-1.jpg through product-9.jpg)
3. Test horizontal scrolling behavior on mobile devices
4. Verify dashboard predictions page is ready for model testing
5. Consider adding more interactive elements to model cards (e.g., live prediction preview)

---

## Files Modified

1. `src/components/bento-gallery.tsx` - Gallery component restructure
2. `src/app/ml-models/page.tsx` - ML models page with 2 models and action buttons

---

Made on Earth, by Humans
© 2025 Talaria. All rights reserved.

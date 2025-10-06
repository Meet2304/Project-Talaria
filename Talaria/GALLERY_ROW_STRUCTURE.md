# Gallery Structure Update: Row-Based Layout with Headers

## Date: October 7, 2025

## Overview
Updated the gallery component to display images in organized rows, each with its own heading and description. Each row contains 5 images with varying widths for visual interest.

---

## Changes Made

### 1. **New Data Structure**

#### Added `GalleryRow` Type
```typescript
type GalleryRow = {
  id: number | string
  heading: string           // Row title
  description: string       // Row description
  images: ImageItem[]       // Array of 5 images
}
```

#### Updated Default Data
- Changed from flat array of images to structured rows
- Created 3 gallery rows with 5 images each (15 total images)
- Each row has a thematic focus

---

## Gallery Structure

### **Row 1: Design & Innovation**
*"Explore the cutting-edge design and innovative features of Talaria footwear"*

**5 Images:**
1. Talaria Footwear - Front View (Large)
2. Sensor Integration (Medium)
3. Side Profile (Medium)
4. Top View (Large)
5. Comfort Design (Medium)

---

### **Row 2: Technology & Components**
*"Advanced sensor technology and internal components powering real-time health monitoring"*

**5 Images:**
1. Internal Components (Medium)
2. Wireless Connectivity (Large)
3. Charging Port (Medium)
4. Sensor Array (Medium)
5. Power Management (Large)

---

### **Row 3: Development & Testing**
*"From prototype to production - see the development journey and rigorous testing process"*

**5 Images:**
1. Prototype Development (Large)
2. Testing Phase (Medium)
3. Quality Assurance (Medium)
4. User Testing (Large)
5. Final Product (Medium)

---

## Visual Layout

```
┌────────────────────────────────────────────────────────┐
│              Product Showcase (Main Title)             │
│         Main gallery description goes here             │
└────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────┐
│  Design & Innovation                                   │
│  Explore the cutting-edge design and innovative...     │
└────────────────────────────────────────────────────────┘
    ← Scroll horizontally →
┌──────────┐ ┌────────┐ ┌────────┐ ┌──────────┐ ┌────────┐
│  Image 1 │ │Image 2 │ │Image 3 │ │  Image 4 │ │Image 5 │
│  (Large) │ │(Medium)│ │(Medium)│ │  (Large) │ │(Medium)│
└──────────┘ └────────┘ └────────┘ └──────────┘ └────────┘

┌────────────────────────────────────────────────────────┐
│  Technology & Components                               │
│  Advanced sensor technology and internal components... │
└────────────────────────────────────────────────────────┘
    ← Scroll horizontally →
┌────────┐ ┌──────────┐ ┌────────┐ ┌────────┐ ┌──────────┐
│Image 6 │ │  Image 7 │ │Image 8 │ │Image 9 │ │ Image 10 │
│(Medium)│ │  (Large) │ │(Medium)│ │(Medium)│ │  (Large) │
└────────┘ └──────────┘ └────────┘ └────────┘ └──────────┘

┌────────────────────────────────────────────────────────┐
│  Development & Testing                                 │
│  From prototype to production - see the development... │
└────────────────────────────────────────────────────────┘
    ← Scroll horizontally →
┌──────────┐ ┌────────┐ ┌────────┐ ┌──────────┐ ┌────────┐
│ Image 11 │ │Image 12│ │Image 13│ │ Image 14 │ │Image 15│
│  (Large) │ │(Medium)│ │(Medium)│ │  (Large) │ │(Medium)│
└──────────┘ └────────┘ └────────┘ └──────────┘ └────────┘
```

---

## Component API Changes

### Updated Props
```typescript
interface InteractiveImageBentoGalleryProps {
  galleryRows?: GalleryRow[]   // Array of rows (replaces imageItems)
  title?: string               // Main gallery title
  description?: string         // Main gallery description
  // Removed: imagesPerRow (now fixed at 5)
}
```

### Default Values
```typescript
galleryRows = DEFAULT_GALLERY_ROWS  // 3 rows, 5 images each
title = "Product Showcase"
description = "Discover the intricate details of Talaria's sensor-integrated footwear"
```

---

## New Component: ImageRowWithHeader

Replaced `ImageRow` with `ImageRowWithHeader` which includes:

1. **Row Header Section**
   - Heading: Large, bold text (2xl/3xl)
   - Description: Subtitle text with context

2. **Horizontal Scrollable Images**
   - 5 images per row
   - Varying widths (small, medium, large)
   - Smooth horizontal scrolling
   - Hidden scrollbars

```typescript
const ImageRowWithHeader = ({ 
  row,
  onImageClick 
}: { 
  row: GalleryRow
  onImageClick: (item: ImageItem) => void
}) => (
  <div className="mb-12">
    {/* Row Header */}
    <div className="mb-6 px-4">
      <h3>{row.heading}</h3>
      <p>{row.description}</p>
    </div>
    
    {/* Row Images */}
    <div className="flex gap-4 overflow-x-auto">
      {row.images.map((item) => (
        // Image card...
      ))}
    </div>
  </div>
)
```

---

## Styling Details

### Row Headers
```css
Heading:
- Font: 2xl/3xl (responsive)
- Weight: Bold (font-bold)
- Color: slate-900
- Margin bottom: 0.5rem

Description:
- Font: base
- Color: slate-600
- Max width: 3xl (48rem)
```

### Spacing
```css
Between rows: 3rem (space-y-12)
Header to images: 1.5rem (mb-6)
Between images: 1rem (gap-4)
Bottom padding on scroll: 1rem (pb-4)
```

---

## Width Distribution Pattern

### Row-based Variation
```
Row 1: Large → Medium → Medium → Large → Medium
Row 2: Medium → Large → Medium → Medium → Large
Row 3: Large → Medium → Medium → Large → Medium
```

### Pixel Widths
- **Small**: 250px
- **Medium**: 350px
- **Large**: 450px

---

## Features

### ✅ Organized Content
- Clear thematic grouping
- Contextual headings for each row
- Better storytelling through structure

### ✅ Improved Navigation
- Users understand what they're viewing
- Easy to scan different categories
- Clear visual hierarchy

### ✅ Scalability
- Easy to add new rows
- Simple to update row content
- Flexible image count per row

### ✅ Maintained Features
- Horizontal scrolling per row
- Variable image widths
- Click to view full-size modal
- Hover effects and animations
- Hidden scrollbars
- Responsive design

---

## Usage Example

### Basic Usage (Default 3 Rows)
```typescript
<InteractiveImageBentoGallery />
```

### Custom Rows
```typescript
const customRows: GalleryRow[] = [
  {
    id: 1,
    heading: "My Custom Row",
    description: "Description of this row",
    images: [
      { id: 1, title: "...", desc: "...", url: "...", width: "large" },
      // ... 4 more images
    ]
  },
  // ... more rows
]

<InteractiveImageBentoGallery galleryRows={customRows} />
```

### Custom Titles
```typescript
<InteractiveImageBentoGallery
  title="My Gallery"
  description="Custom main description"
/>
```

---

## Benefits of Row-Based Structure

### 1. **Better Organization**
- Groups related images together
- Clear thematic sections
- Easier content management

### 2. **Enhanced User Experience**
- Context for each image group
- Better understanding of content
- Improved scannability

### 3. **Content Storytelling**
- Tell a story through sections
- Guide users through content
- Create narrative flow

### 4. **Easier Maintenance**
- Update one section at a time
- Add/remove sections easily
- Clear data structure

### 5. **SEO Benefits**
- Structured headings (H3 tags)
- Descriptive text for context
- Better semantic HTML

---

## Migration from Previous Version

### Before
```typescript
const galleryImages = [
  { id: 1, title: "...", ... },
  { id: 2, title: "...", ... },
  // ... all images in flat array
]

<InteractiveImageBentoGallery
  imageItems={galleryImages}
  imagesPerRow={3}
/>
```

### After
```typescript
// Component now uses DEFAULT_GALLERY_ROWS internally
// No need to pass data if using defaults

<InteractiveImageBentoGallery />

// Or with custom rows
const galleryRows = [
  { 
    id: 1, 
    heading: "...", 
    description: "...",
    images: [...] // 5 images
  }
]

<InteractiveImageBentoGallery galleryRows={galleryRows} />
```

---

## File Modified

1. `src/components/bento-gallery.tsx` - Complete restructure with row-based layout

---

## Statistics

- **Total Images**: 15 (up from 9)
- **Rows**: 3
- **Images per Row**: 5
- **New Types**: 1 (GalleryRow)
- **New Components**: 1 (ImageRowWithHeader)
- **Lines of Code**: ~380

---

Made on Earth, by Humans  
© 2025 Talaria. All rights reserved.

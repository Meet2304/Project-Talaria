# Gallery Component Architecture

## Component Structure

```
InteractiveImageBentoGallery
├── DEFAULT_GALLERY_IMAGES (Data Layer)
├── ImageModal (Modal Component)
├── ImageRow (Row Component)
│   └── Individual Image Cards
└── Main Gallery Layout
    ├── Header (Title & Description)
    ├── Scrollable Rows
    └── Modal Portal
```

---

## Data Flow

```
Page (gallery/page.tsx)
    ↓
    Renders with defaults
    ↓
Component (bento-gallery.tsx)
    ↓
    Uses DEFAULT_GALLERY_IMAGES
    ↓
    Splits into rows (3 images each)
    ↓
    Renders ImageRow components
    ↓
    Individual image cards with varying widths
```

---

## Visual Layout

```
┌─────────────────────────────────────────────────────────┐
│                    Product Showcase                      │
│            Discover the intricate details...             │
└─────────────────────────────────────────────────────────┘

Row 1: ←─────────────────────────────────────────────────→
┌──────────────┐ ┌────────────┐ ┌──────────┐
│   Image 1    │ │  Image 2   │ │ Image 3  │
│   (Large)    │ │  (Medium)  │ │ (Small)  │
│   450px      │ │   350px    │ │  250px   │
└──────────────┘ └────────────┘ └──────────┘

Row 2: ←─────────────────────────────────────────────────→
┌────────────┐ ┌──────────────┐ ┌──────────┐
│  Image 4   │ │   Image 5    │ │ Image 6  │
│  (Medium)  │ │   (Large)    │ │ (Small)  │
│   350px    │ │    450px     │ │  250px   │
└────────────┘ └──────────────┘ └──────────┘

Row 3: ←─────────────────────────────────────────────────→
┌────────────┐ ┌──────────────┐ ┌──────────┐
│  Image 7   │ │   Image 8    │ │ Image 9  │
│  (Medium)  │ │   (Large)    │ │ (Small)  │
│   350px    │ │    450px     │ │  250px   │
└────────────┘ └──────────────┘ └──────────┘
```

---

## Width Variants

```typescript
Small:  ■■■■■ (250px)
Medium: ■■■■■■■ (350px)
Large:  ■■■■■■■■■ (450px)
```

---

## Component API

### Props Interface
```typescript
interface InteractiveImageBentoGalleryProps {
  imageItems?: ImageItem[]        // Optional, uses defaults
  title?: string                  // Optional, default: "Product Showcase"
  description?: string            // Optional, default provided
  imagesPerRow?: number          // Optional, default: 3
}
```

### ImageItem Type
```typescript
type ImageItem = {
  id: number | string
  title: string
  desc: string
  url: string
  width?: "small" | "medium" | "large"  // Controls card width
}
```

---

## Interaction Flow

```
User Flow:
1. User lands on gallery page
   ↓
2. Component renders with default images
   ↓
3. User scrolls horizontally on any row
   ↓
4. User hovers over image
   → Gradient overlay appears
   → Title and description visible
   → Image scales slightly (1.02x)
   ↓
5. User clicks image
   → Modal opens with full-size view
   → Title and description below image
   ↓
6. User clicks X or outside modal
   → Modal closes with animation
```

---

## Responsive Behavior

```
Desktop (≥1024px):
- 3 images per row (default)
- Full horizontal scroll
- All widths respected

Tablet (768px - 1023px):
- 3 images per row
- Horizontal scroll enabled
- Proportional scaling

Mobile (<768px):
- 3 images per row
- Touch-enabled scroll
- Maintains aspect ratios
```

---

## Animation States

```
Image Card:
- Initial: opacity: 0, y: 20, scale: 0.95
- Visible: opacity: 1, y: 0, scale: 1
- Hover: scale: 1.02

Modal:
- Open: opacity: 0 → 1, scale: 0.9 → 1
- Close: opacity: 1 → 0, scale: 1 → 0.9

Gradient Overlay:
- Default: opacity: 0
- Hover: opacity: 1
```

---

## File Organization

```
src/
├── components/
│   └── bento-gallery.tsx          (Self-contained component)
│       ├── DEFAULT_GALLERY_IMAGES (Data)
│       ├── ImageModal             (Subcomponent)
│       ├── ImageRow               (Subcomponent)
│       └── InteractiveImageBentoGallery (Main)
│
└── app/
    └── gallery/
        └── page.tsx               (Minimal page wrapper)
```

---

## Advantages of This Architecture

### ✅ Modularity
- Component works independently
- Can be dropped into any page
- Self-contained with defaults

### ✅ Flexibility
- Easy to override with custom data
- Configurable rows and layout
- Customizable titles and descriptions

### ✅ Maintainability  
- Single source of truth for gallery data
- Clear component boundaries
- Well-documented interfaces

### ✅ Performance
- Efficient row-based rendering
- Optimized animations
- Lazy evaluation of modal

### ✅ User Experience
- Smooth horizontal scrolling
- Intuitive interactions
- Responsive on all devices
- Hidden scrollbars for clean look

---

## Comparison: Before vs After

### Before (Non-Professional)
```typescript
// Page File (154 lines)
export default function GalleryPage() {
  const galleryImages = [
    { id: 1, title: "...", url: "...", span: "..." },
    { id: 2, title: "...", url: "...", span: "..." },
    // ... 7 more items (90 lines of data)
  ]
  
  return (
    <InteractiveImageBentoGallery 
      imageItems={galleryImages}
      title="..."
      description="..."
    />
  )
}
```

**Issues:**
- ❌ Hardcoded data in page
- ❌ Tight coupling
- ❌ Not reusable
- ❌ Poor maintainability

---

### After (Professional)
```typescript
// Page File (75 lines)
export default function GalleryPage() {
  return (
    <InteractiveImageBentoGallery 
      title="Product Showcase"
      description="Discover the intricate details..."
    />
  )
}

// Component handles all data internally
```

**Benefits:**
- ✅ Clean separation of concerns
- ✅ Reusable component
- ✅ Default data in component
- ✅ Easy to maintain
- ✅ Professional architecture

---

Made on Earth, by Humans  
© 2025 Talaria. All rights reserved.

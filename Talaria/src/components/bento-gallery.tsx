"use client"

import React, { useRef, useState } from "react"
import {
  motion,
  AnimatePresence,
} from "framer-motion"
import { X } from "lucide-react"

/**
 * Image item structure for gallery
 */
type ImageItem = {
  id: number | string
  title: string
  desc: string
  url: string
  width?: "small" | "medium" | "large" // Width variant
}

/**
 * Gallery row structure with heading and description
 */
type GalleryRow = {
  id: number | string
  heading: string
  description: string
  images: ImageItem[]
}

/**
 * Props for the gallery component
 */
interface InteractiveImageBentoGalleryProps {
  galleryRows?: GalleryRow[]
}

/**
 * Default gallery images for Talaria footwear
 * Using only existing images to prevent 404 errors
 */
const DEFAULT_GALLERY_ROWS: GalleryRow[] = [
  {
    id: 1,
    heading: "Design & Innovation",
    description: "Explore the cutting-edge design and innovative features of Talaria footwear",
    images: [
      {
        id: 1,
        title: "Talaria Footwear - Front Isometric View",
        desc: "Smart footwear with integrated sensors for concurrent cardiovascular and gait analysis",
        url: "/images/gallery/Talaria_Front Isometric_v1.jpg",
        width: "large",
      },
      {
        id: 2,
        title: "Top Isometric View",
        desc: "Complete sensor array overview showing MAX30102 and MPU6050 placement",
        url: "/images/gallery/Talaria_Top_Isometric_v1.jpg",
        width: "large",
      },
      {
        id: 3,
        title: "Front Perspective",
        desc: "Ergonomic design optimized for comfort and sensor accuracy",
        url: "/images/gallery/Talaria_Front Isometric_v1.jpg",
        width: "medium",
      },
      {
        id: 4,
        title: "Top View Detail",
        desc: "Detailed view of component integration and layout",
        url: "/images/gallery/Talaria_Top_Isometric_v1.jpg",
        width: "medium",
      },
      {
        id: 5,
        title: "Design Overview",
        desc: "Full footwear design showcasing the sleek, modern aesthetic",
        url: "/images/gallery/Talaria_Front Isometric_v1.jpg",
        width: "large",
      },
    ],
  },
  {
    id: 2,
    heading: "Technology & Components",
    description: "Advanced sensor technology and internal components powering real-time health monitoring",
    images: [
      {
        id: 6,
        title: "Sensor Integration",
        desc: "MPU6050 accelerometer and gyroscope for precise gait analysis",
        url: "/images/gallery/Talaria_Top_Isometric_v1.jpg",
        width: "large",
      },
      {
        id: 7,
        title: "Component Layout",
        desc: "Strategic placement of sensors and electronics for optimal performance",
        url: "/images/gallery/Talaria_Front Isometric_v1.jpg",
        width: "medium",
      },
      {
        id: 8,
        title: "Heart Rate Monitoring",
        desc: "MAX30102 sensor for continuous heart rate and SpO2 tracking",
        url: "/images/gallery/Talaria_Top_Isometric_v1.jpg",
        width: "medium",
      },
      {
        id: 9,
        title: "System Architecture",
        desc: "Wireless connectivity and real-time data transmission to Firebase",
        url: "/images/gallery/Talaria_Front Isometric_v1.jpg",
        width: "large",
      },
      {
        id: 10,
        title: "Hardware Overview",
        desc: "Complete hardware stack including power management and communication modules",
        url: "/images/gallery/Talaria_Top_Isometric_v1.jpg",
        width: "medium",
      },
    ],
  },
  {
    id: 3,
    heading: "Development & Testing",
    description: "From prototype to production - see the development journey and rigorous testing process",
    images: [
      {
        id: 11,
        title: "Prototype Design",
        desc: "Initial design concept and 3D modeling phase",
        url: "/images/gallery/Talaria_Front Isometric_v1.jpg",
        width: "large",
      },
      {
        id: 12,
        title: "Assembly Process",
        desc: "Integration of sensors and electronic components during assembly",
        url: "/images/gallery/Talaria_Top_Isometric_v1.jpg",
        width: "medium",
      },
      {
        id: 13,
        title: "Quality Testing",
        desc: "Rigorous quality assurance and performance validation procedures",
        url: "/images/gallery/Talaria_Front Isometric_v1.jpg",
        width: "medium",
      },
      {
        id: 14,
        title: "Field Testing",
        desc: "Real-world testing scenarios for gait analysis and cardiovascular monitoring",
        url: "/images/gallery/Talaria_Top_Isometric_v1.jpg",
        width: "large",
      },
      {
        id: 15,
        title: "Production Ready",
        desc: "Final production version with all features fully implemented and tested",
        url: "/images/gallery/Talaria_Front Isometric_v1.jpg",
        width: "medium",
      },
    ],
  },
]

/**
 * Animation variants for container staggering
 */
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

/**
 * Get width class based on size variant
 */
const getWidthClass = (width: "small" | "medium" | "large" = "medium"): string => {
  const widthMap = {
    small: "w-[250px]",
    medium: "w-[350px]",
    large: "w-[450px]",
  }
  return widthMap[width]
}

/**
 * Modal component for full-size image viewing
 */
const ImageModal = ({
  item,
  onClose,
}: {
  item: ImageItem
  onClose: () => void
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="relative w-full max-w-4xl p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={item.url}
          alt={item.title}
          className="h-auto max-h-[90vh] w-full object-contain"
        />
        <div className="mt-4 text-center">
          <h3 className="text-xl font-bold text-white">{item.title}</h3>
          <p className="mt-2 text-sm text-white/80">{item.desc}</p>
        </div>
      </motion.div>
      <button
        onClick={onClose}
        className="absolute right-4 top-4 text-white/80 transition-colors hover:text-white"
        aria-label="Close image view"
      >
        <X size={32} strokeWidth={2} />
      </button>
    </motion.div>
  )
}

/**
 * Single row of scrollable images with heading and description
 */
const ImageRowWithHeader = ({ 
  row,
  onImageClick 
}: { 
  row: GalleryRow
  onImageClick: (_item: ImageItem) => void
}) => (
  <div className="mb-12 relative">
    {/* Row Header */}
    <div className="mb-4 px-4">
      <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
        {row.heading}
      </h3>
      <p className="text-base text-slate-600 max-w-3xl">
        {row.description}
      </p>
    </div>
    
    {/* Row Images */}
    <div 
      className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide px-4 relative"
      style={{ 
        scrollbarWidth: 'none', 
        msOverflowStyle: 'none',
        WebkitOverflowScrolling: 'touch'
      }}
    >
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      {row.images.map((item) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          className={`group relative flex-shrink-0 ${getWidthClass(item.width)} h-[300px] cursor-pointer overflow-hidden border bg-card shadow-sm transition-shadow duration-300 ease-in-out hover:shadow-lg`}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          onClick={() => onImageClick(item)}
          onKeyDown={(e) => e.key === "Enter" && onImageClick(item)}
          tabIndex={0}
          role="button"
          aria-label={`View ${item.title}`}
        >
          <img
            src={item.url}
            alt={item.title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <div className="relative z-10 p-4 translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 flex items-end h-full">
            <div>
              <h3 className="text-lg font-bold text-white">{item.title}</h3>
              <p className="mt-1 text-sm text-white/80">{item.desc}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
)

/**
 * Main gallery component with horizontal scrolling rows
 * Each row has a heading, description, and 5 images with varying widths
 * 
 * @param galleryRows - Array of gallery rows with images (uses defaults if not provided)
 */
const InteractiveImageBentoGallery: React.FC<
  InteractiveImageBentoGalleryProps
> = ({ 
  galleryRows = DEFAULT_GALLERY_ROWS,
}) => {
  const [selectedItem, setSelectedItem] = useState<ImageItem | null>(null)
  const targetRef = useRef<HTMLDivElement>(null)

  const handleImageClick = (item: ImageItem) => {
    setSelectedItem(item)
  }

  const handleCloseModal = () => {
    setSelectedItem(null)
  }

  return (
    <section
      ref={targetRef}
      className="relative w-full overflow-hidden bg-transparent py-8 sm:py-12"
    >
      {/* Gallery Rows with Headers */}
      <motion.div
        className="space-y-12"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {galleryRows.map((row) => (
          <ImageRowWithHeader 
            key={row.id} 
            row={row} 
            onImageClick={handleImageClick}
          />
        ))}
      </motion.div>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedItem && (
          <ImageModal 
            item={selectedItem} 
            onClose={handleCloseModal} 
          />
        )}
      </AnimatePresence>
    </section>
  )
}

export default InteractiveImageBentoGallery

"use client";

import { DitheringShader } from "./dithering-shader";
import { useEffect, useState } from "react";

export const WaveBackground = () => {
  const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Prevent hydration mismatch by using fixed dimensions on first render
  return (
    <div className="fixed inset-0 -z-10">
      <DitheringShader
        width={mounted ? dimensions.width : 1920}
        height={mounted ? dimensions.height : 1080}
        colorBack="#f1f5f9"
        colorFront="#b8b6c6bd"
        shape="wave"
        type="8x8"
        pxSize={3}
        speed={0.5}
        className="w-full h-full"
      />
    </div>
  );
};

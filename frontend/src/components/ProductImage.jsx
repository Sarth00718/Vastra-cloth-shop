import React, { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * ProductImage Component
 * Handles product images with proper aspect ratio and object-fit
 * Provides loading states and error handling
 */
const ProductImage = ({
  src,
  alt,
  className = '',
  containerClassName = '',
  aspectRatio = 'square', // 'square', 'portrait', 'landscape', 'auto'
  objectFit = 'cover', // 'cover', 'contain', 'fill'
  showSkeleton = true,
  onClick,
  style = {},
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const aspectRatioClasses = {
    square: 'aspect-square',
    portrait: 'aspect-[3/4]',
    landscape: 'aspect-[4/3]',
    auto: '',
  };

  const objectFitClasses = {
    cover: 'object-cover',
    contain: 'object-contain',
    fill: 'object-fill',
  };

  return (
    <div
      className={`relative w-full overflow-hidden ${aspectRatioClasses[aspectRatio]} ${containerClassName}`}
      onClick={onClick}
    >
      {/* Loading skeleton */}
      {showSkeleton && !isLoaded && !hasError && (
        <div className="absolute inset-0 bg-slate-800 animate-pulse" />
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-2">📷</div>
            <p className="text-slate-400 text-sm">Image unavailable</p>
          </div>
        </div>
      )}

      {/* Actual image */}
      {!hasError && (
        <motion.img
          src={src}
          alt={alt}
          referrerPolicy="no-referrer-when-downgrade"
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className={`w-full h-full ${objectFitClasses[objectFit]} ${className}`}
          style={style}
        />
      )}
    </div>
  );
};

export default ProductImage;

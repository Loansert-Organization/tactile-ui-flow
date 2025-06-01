
import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  lazy?: boolean;
  blur?: boolean;
  aspectRatio?: 'square' | '16:9' | '4:3' | '3:2';
  sizes?: string;
  priority?: boolean;
}

export const OptimizedImage = React.forwardRef<HTMLImageElement, OptimizedImageProps>(
  ({ 
    src, 
    alt, 
    fallbackSrc = '/icons/icon-192x192.png',
    lazy = true,
    blur = true,
    aspectRatio,
    sizes,
    priority = false,
    className,
    ...props 
  }, ref) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [isInView, setIsInView] = useState(!lazy || priority);
    const imgRef = useRef<HTMLImageElement>(null);

    // Intersection Observer for lazy loading
    useEffect(() => {
      if (!lazy || priority || isInView) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        },
        { 
          rootMargin: '50px',
          threshold: 0.1 
        }
      );

      if (imgRef.current) {
        observer.observe(imgRef.current);
      }

      return () => observer.disconnect();
    }, [lazy, priority, isInView]);

    const aspectRatioClasses = {
      'square': 'aspect-square',
      '16:9': 'aspect-video',
      '4:3': 'aspect-[4/3]',
      '3:2': 'aspect-[3/2]'
    };

    const handleLoad = () => {
      setIsLoaded(true);
      setHasError(false);
    };

    const handleError = () => {
      setHasError(true);
      setIsLoaded(false);
    };

    // Generate srcSet for responsive images
    const generateSrcSet = (baseSrc: string) => {
      if (!baseSrc.includes('unsplash.com') && !baseSrc.includes('placeholder.com')) {
        return undefined;
      }
      
      return `${baseSrc}&w=300 300w, ${baseSrc}&w=600 600w, ${baseSrc}&w=900 900w, ${baseSrc}&w=1200 1200w`;
    };

    const imageSrc = hasError ? fallbackSrc : src;
    const shouldLoad = isInView || priority;

    return (
      <div 
        className={cn(
          'relative overflow-hidden bg-gray-800',
          aspectRatio && aspectRatioClasses[aspectRatio],
          className
        )}
      >
        {/* Blur placeholder */}
        {blur && !isLoaded && shouldLoad && (
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-pink-900/20 animate-pulse" />
        )}

        {/* Main image */}
        {shouldLoad && (
          <img
            ref={ref || imgRef}
            src={imageSrc}
            alt={alt}
            srcSet={generateSrcSet(imageSrc)}
            sizes={sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
            onLoad={handleLoad}
            onError={handleError}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
            className={cn(
              'w-full h-full object-cover transition-opacity duration-300',
              isLoaded ? 'opacity-100' : 'opacity-0'
            )}
            {...props}
          />
        )}

        {/* Loading skeleton */}
        {!shouldLoad && (
          <div className="absolute inset-0 bg-gray-700 animate-pulse" />
        )}
      </div>
    );
  }
);

OptimizedImage.displayName = "OptimizedImage";

'use client';

import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { SliderImage } from '@/app/admin/sliders/SliderManagementClient';

interface HomeSliderProps {
  images: SliderImage[];
}

export function HomeSlider({ images: initialImages }: HomeSliderProps) {
  const { data: images = [] } = useQuery({
    queryKey: ['slider_images'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('slider_images')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true });
      if (error) throw error;
      return data as SliderImage[];
    },
    initialData: initialImages // Safely inject server-provided data
  });

  const itemsPerViewDesktop = 3;
  const itemsPerViewMobile = 1;
  const [itemsPerView, setItemsPerView] = useState(3);

  const displayImages = images.length > 0 ? [...images, ...images, ...images] : [];
  
  const [currentIndex, setCurrentIndex] = useState(images.length);
  const [isTransitioning, setIsTransitioning] = useState(true);

  // Swipe & Cooldown Tracking
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const isCooldown = useRef(false);
  const [isReady, setIsReady] = useState(false);
  
  // Sync index specifically when the images array becomes populated for the first time
  useEffect(() => {
    if (images.length > 0 && !isReady) {
      setCurrentIndex(images.length);
      setIsReady(true);
    }
  }, [images.length, isReady]);

  useEffect(() => {
    const handleResize = () => {
      setItemsPerView(window.innerWidth < 768 ? itemsPerViewMobile : itemsPerViewDesktop);
    };
    handleResize(); 
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-play logic
  useEffect(() => {
    if (!images || images.length === 0) return;
    
    const timer = setInterval(() => {
      if (isCooldown.current) return; // Wait during user interaction
      setIsTransitioning(true);
      setCurrentIndex((prev) => prev + 1);
    }, 4000);
    
    return () => clearInterval(timer);
  }, [images]);

  const handleTransitionEnd = () => {
    if (currentIndex >= images.length * 2) {
      setIsTransitioning(false);
      setCurrentIndex(currentIndex - images.length);
    } else if (currentIndex <= 0) {
      setIsTransitioning(false);
      setCurrentIndex(currentIndex + images.length);
    }
  };

  const triggerCooldown = () => {
    isCooldown.current = true;
    setTimeout(() => {
      isCooldown.current = false;
    }, 4000); // 4 second cool-off period after manual interaction
  };

  const handleDotClick = (actualIndex: number) => {
    triggerCooldown();
    setIsTransitioning(true);
    setCurrentIndex(images.length + actualIndex);
  };

  const minSwipeDistance = 50;

  const handleStart = (clientX: number) => {
    setTouchEnd(null);
    setTouchStart(clientX);
  };

  const handleMove = (clientX: number) => {
    if (touchStart !== null) {
      setTouchEnd(clientX);
    }
  };

  const handleEnd = () => {
    if (touchStart === null || touchEnd === null) {
      setTouchStart(null);
      setTouchEnd(null);
      return;
    }
    
    const distance = touchStart - touchEnd;
    setTouchStart(null);
    setTouchEnd(null);

    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe || isRightSwipe) {
      triggerCooldown();
      setIsTransitioning(true);
      if (isLeftSwipe) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setCurrentIndex(prev => prev - 1);
      }
    }
  };

  // Remove the early return to ensure ResizeObserver and other hooks run
  // if (!images || images.length === 0) return null;

  const activeDotIndex = currentIndex % images.length;

  return (
    <section 
      className="w-full bg-[#E5E7EB] mt-8 md:mt-12 overflow-hidden relative group cursor-grab active:cursor-grabbing text-black"
      onTouchStart={(e) => handleStart(e.targetTouches[0].clientX)}
      onTouchMove={(e) => handleMove(e.targetTouches[0].clientX)}
      onTouchEnd={handleEnd}
      onMouseDown={(e) => handleStart(e.clientX)}
      onMouseMove={(e) => handleMove(e.clientX)}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
    >
      <div 
        className={cn(
          "flex w-full", 
          isTransitioning ? "transition-transform duration-[1500ms] ease-in-out" : "transition-none"
        )}
        style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
        onTransitionEnd={handleTransitionEnd}
      >
        {displayImages.map((img, idx) => (
          <div 
            key={`${img.id}-${idx}`} 
            className="flex-shrink-0"
            style={{ width: `${100 / itemsPerView}%` }}
          >
            <div className="relative aspect-[16/9] overflow-hidden w-full select-none pointer-events-none group/img">
              {img.link ? (
                <Link href={img.link} className="absolute inset-0 block w-full h-full pointer-events-auto">
                  <picture className="absolute inset-0 block w-full h-full">
                    {img.mobile_image_url && <source media="(max-width: 768px)" srcSet={img.mobile_image_url} />}
                    <img 
                      src={img.image_url} 
                      alt="Banner" 
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-[1.03]"
                      draggable={false}
                    />
                  </picture>
                </Link>
              ) : (
                <picture className="absolute inset-0 block w-full h-full">
                  {img.mobile_image_url && <source media="(max-width: 768px)" srcSet={img.mobile_image_url} />}
                  <img 
                    src={img.image_url} 
                    alt="Banner" 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700"
                    draggable={false}
                  />
                </picture>
              )}
            </div>
          </div>
        ))}
        
        {/* Placeholder if no images yet to maintain layout height */}
        {images.length === 0 && (
          <div className="w-full aspect-[16/9] bg-gray-200 animate-pulse flex items-center justify-center">
            <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Loading Banners...</span>
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 p-2 bg-black/10 backdrop-blur-md rounded-full shadow-sm">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => handleDotClick(idx)}
              className={cn(
                "w-1.5 h-1.5 rounded-full transition-all duration-500",
                idx === activeDotIndex 
                  ? "bg-white w-4" 
                  : "bg-white/50 hover:bg-white"
              )}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}

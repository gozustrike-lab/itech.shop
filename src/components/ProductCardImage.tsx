'use client';

import { useState, useRef } from 'react';
import { getProductImages } from '@/lib/catalog-images';

interface ProductCardImageProps {
  product: {
    _id?: string;
    id?: string | number;
    name?: string;
    cleanName?: string;
    slug?: string;
    mainImage?: string | null;
    secondaryImage?: string | null;
    gallery?: Array<any>;
  };
  alt?: string;
  className?: string;
}

export default function ProductCardImage({
  product,
  alt,
  className = '',
}: ProductCardImageProps) {
  const [activeView, setActiveView] = useState<number>(0);
  const [isCardHovered, setIsCardHovered] = useState<boolean>(false);
  const [manualViewSelected, setManualViewSelected] = useState<boolean>(false);

  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const hasSwiped = useRef<boolean>(false);

  const imageSet = getProductImages(product);
  const views = [
    { label: 'Frontal', url: imageSet.main },
    { label: 'Ángulo', url: imageSet.secondary },
    { label: 'Detalle', url: imageSet.tertiary },
  ].filter((v) => !!v.url);

  // If card is hovered and user has not manually picked a view, show view 1 (secondary / angle view)
  const currentViewIndex = manualViewSelected
    ? activeView
    : isCardHovered && views.length > 1
    ? 1
    : 0;

  const currentView = views[currentViewIndex] || views[0];
  const title = alt || product.cleanName || product.name || 'Producto iTech';

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    hasSwiped.current = false;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (views.length <= 1) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;

    // Minimum swipe threshold 30px, and horizontal dominant
    if (Math.abs(deltaX) > 28 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2) {
      hasSwiped.current = true;
      if (deltaX < 0) {
        // Swiped left -> next photo
        setManualViewSelected(true);
        setActiveView((prev) => (prev + 1) % views.length);
      } else {
        // Swiped right -> prev photo
        setManualViewSelected(true);
        setActiveView((prev) => (prev - 1 + views.length) % views.length);
      }
    }
  };

  const handleClickCapture = (e: React.MouseEvent) => {
    if (hasSwiped.current) {
      e.preventDefault();
      e.stopPropagation();
      hasSwiped.current = false;
    }
  };

  return (
    <div
      className={`relative aspect-square w-full rounded-2xl bg-[#F6F7F9] border-0 flex items-center justify-center overflow-hidden group/image transition-all select-none touch-pan-y ${className}`}
      onMouseEnter={() => setIsCardHovered(true)}
      onMouseLeave={() => {
        setIsCardHovered(false);
        setManualViewSelected(false);
        setActiveView(0);
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClickCapture={handleClickCapture}
    >
      {/* Pre-rendered Layers for smooth, instantaneous crossfade */}
      {views.map((view, idx) => {
        const isCurrent = idx === currentViewIndex;
        return (
          <img
            key={`${view.url}-${idx}`}
            src={view.url}
            alt={`${title} - Vista ${view.label}`}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-300 pointer-events-none ${
              isCurrent
                ? 'opacity-100 scale-100 z-10'
                : 'opacity-0 scale-95 z-0'
            }`}
            loading="lazy"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/images/placeholder.webp';
            }}
          />
        );
      })}

      {/* Interactive 3-View Switcher (Mobile touch dots + Desktop pills) */}
      {views.length > 1 && (
        <div
          className="absolute bottom-2 inset-x-0 z-20 flex items-center justify-center gap-1.5 px-3 py-1 pointer-events-auto"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          {/* Mobile Touch Indicator Dots & Active Label */}
          <div className="flex md:hidden items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full shadow-md border border-white/10">
            <span className="text-[9px] font-bold text-turquoise-300 pr-0.5">
              {currentView.label}
            </span>
            <div className="flex items-center gap-1">
              {views.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setManualViewSelected(true);
                    setActiveView(idx);
                  }}
                  className={`transition-all duration-200 ${
                    idx === currentViewIndex
                      ? 'w-3 h-1.5 rounded-full bg-white shadow-sm'
                      : 'w-1.5 h-1.5 rounded-full bg-white/40'
                  }`}
                  aria-label={`Vista ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Desktop Hover Pill Bar */}
          <div className="hidden md:flex bg-white/95 backdrop-blur-md border border-zinc-200/80 shadow-md px-2 py-1 rounded-full items-center gap-1.5 transition-all duration-200 opacity-0 group-hover/image:opacity-100">
            {views.map((view, idx) => {
              const isSelected = idx === currentViewIndex;
              return (
                <button
                  key={idx}
                  type="button"
                  onMouseEnter={() => {
                    setManualViewSelected(true);
                    setActiveView(idx);
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setManualViewSelected(true);
                    setActiveView(idx);
                  }}
                  className={`px-2 py-0.5 rounded-full text-[9px] font-bold transition-all duration-200 flex items-center gap-1 ${
                    isSelected
                      ? 'bg-primary text-white shadow-sm shadow-turquoise-600/30'
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                  }`}
                  aria-label={`Ver foto ${view.label}`}
                >
                  <span
                    className={`w-1 h-1 rounded-full ${
                      isSelected ? 'bg-white' : 'bg-zinc-400'
                    }`}
                  />
                  {view.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

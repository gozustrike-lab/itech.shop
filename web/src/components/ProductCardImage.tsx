'use client';

import { useState } from 'react';
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

  return (
    <div
      className={`relative aspect-square w-full rounded-xl bg-white border border-zinc-100 flex items-center justify-center overflow-hidden group/image transition-all ${className}`}
      onMouseEnter={() => setIsCardHovered(true)}
      onMouseLeave={() => {
        setIsCardHovered(false);
        setManualViewSelected(false);
        setActiveView(0);
      }}
    >
      {/* Pre-rendered Layers for smooth, instantaneous crossfade */}
      {views.map((view, idx) => {
        const isCurrent = idx === currentViewIndex;
        return (
          <img
            key={`${view.url}-${idx}`}
            src={view.url}
            alt={`${title} - Vista ${view.label}`}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-300 ${
              isCurrent
                ? 'opacity-100 scale-100 z-10'
                : 'opacity-0 scale-95 pointer-events-none z-0'
            }`}
            loading="lazy"
            onError={(e) => {
              // Graceful fallback to placeholder if needed
              (e.currentTarget as HTMLImageElement).src = '/images/placeholder.webp';
            }}
          />
        );
      })}

      {/* Top Floating Badge on Card Hover */}
      <div className="absolute top-2.5 right-2.5 z-20 pointer-events-none transition-opacity duration-200 opacity-0 group-hover/image:opacity-100">
        <span className="bg-zinc-900/80 backdrop-blur-md text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
          <span>Vista {currentViewIndex + 1}/3:</span>
          <span className="text-turquoise-300 font-semibold">{currentView.label}</span>
        </span>
      </div>

      {/* Interactive 3-View Switcher (Mobile dots + Desktop pills) */}
      {views.length > 1 && (
        <div
          className="absolute bottom-2 inset-x-0 z-20 flex items-center justify-center gap-1.5 px-3 py-1 pointer-events-auto"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          {/* Mobile Touch Indicator Dots */}
          <div className="flex md:hidden items-center gap-1.5 bg-black/45 backdrop-blur-md px-2.5 py-1 rounded-full shadow-sm">
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
                    ? 'w-3.5 h-1.5 rounded-full bg-white shadow-sm'
                    : 'w-1.5 h-1.5 rounded-full bg-white/45'
                }`}
                aria-label={`Vista ${idx + 1}`}
              />
            ))}
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

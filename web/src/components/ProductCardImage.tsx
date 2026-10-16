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
      className={`relative aspect-square w-full rounded-xl bg-white border border-zinc-100 p-3 flex items-center justify-center overflow-hidden group/image transition-all ${className}`}
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
            className={`absolute inset-0 w-full h-full object-contain p-3 transition-all duration-300 ${
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

      {/* Interactive 3-View Switcher Pills */}
      {views.length > 1 && (
        <div
          className="absolute bottom-2 inset-x-0 z-20 flex items-center justify-center gap-1.5 px-3 py-1 transition-all duration-200 opacity-0 group-hover/image:opacity-100"
          onClick={(e) => {
            // Prevent navigating away when clicking thumbnail dots
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <div className="bg-white/90 backdrop-blur-md border border-zinc-200/80 shadow-md px-2 py-1 rounded-full flex items-center gap-1.5">
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

'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Rows3, LayoutGrid } from 'lucide-react';

type ViewMode = 'single' | 'double';

interface GridToggleProps {
  value: ViewMode;
  onChange: (mode: ViewMode) => void;
}

export default function GridToggle({ value, onChange }: GridToggleProps) {
  return (
    <div className="relative flex items-center gap-1 p-1 rounded-xl bg-zinc-100 border border-zinc-200/80 shadow-sm">
      <button
        onClick={() => onChange('single')}
        className={`relative z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
          value === 'single' ? 'bg-primary text-white shadow-sm' : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60'
        }`}
        title="Vista Grande (1 Columna)"
      >
        <Rows3 className="w-3.5 h-3.5" />
        <span className="text-[11px]">Grande</span>
      </button>
      <button
        onClick={() => onChange('double')}
        className={`relative z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
          value === 'double' ? 'bg-primary text-white shadow-sm' : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60'
        }`}
        title="Vista Cuadrícula (2 Columnas)"
      >
        <LayoutGrid className="w-3.5 h-3.5" />
        <span className="text-[11px]">Cuadrícula</span>
      </button>
    </div>
  );
}

// ─── Hook for persisted grid view ─────────────────────────────

const STORAGE_KEY = 'itech_grid_view_v2';

export function useGridView(defaultMode: ViewMode = 'single'): {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  isReady: boolean;
} {
  const [viewMode, setViewModeState] = useState<ViewMode>(defaultMode);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'single' || stored === 'double') {
        setViewModeState(stored);
      }
    } catch {
      // ignore
    }
    setIsReady(true);
  }, []);

  const setViewMode = useCallback((mode: ViewMode) => {
    setViewModeState(mode);
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // ignore
    }
  }, []);

  return { viewMode, setViewMode, isReady };
}

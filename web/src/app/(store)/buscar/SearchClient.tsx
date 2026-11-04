'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  Search,
  X,
  SlidersHorizontal,
  ArrowUpDown,
  ChevronRight,
  Star,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
} from 'lucide-react';
import { useStore } from '@/lib/store-context';
import { formatPrice } from '@/lib/store-data';

type SortOption = 'relevance' | 'price-asc' | 'price-desc';

interface SearchClientProps {
  initialProducts?: any[];
  initialCategories?: any[];
}

function cleanProductTitle(rawName: string): string {
  return String(rawName || '')
    .replace(/\s*[•\-]\s*Ord:\s*[\w\-]+/gi, '')
    .replace(/\\"/g, '"')
    .trim();
}

function getSearchStockBadge(product: any) {
  if (product.inStock === false) {
    return {
      text: '🔴 Sin Stock',
      className: 'bg-rose-50 border border-rose-200 text-rose-700 font-bold',
      isOut: true,
    };
  }
  const name = (product.name || '').toLowerCase();
  if (name.includes('dell latitude') || name.includes('3330')) {
    return {
      text: '⚡ Solo 2 en stock',
      className: 'bg-amber-50 border border-amber-200 text-amber-800 font-bold',
      isOut: false,
    };
  }
  if (name.includes('ipad 9') || name.includes('10.2')) {
    return {
      text: '🔥 Más vendido',
      className: 'bg-orange-50 border border-orange-200 text-orange-800 font-bold',
      isOut: false,
    };
  }
  if (name.includes('macbook pro 16') || name.includes('16"')) {
    return {
      text: '🔥 ¡Última unidad!',
      className: 'bg-purple-50 border border-purple-200 text-purple-800 font-bold',
      isOut: false,
    };
  }
  return {
    text: '🟢 En Stock',
    className: 'bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold',
    isOut: false,
  };
}

export default function SearchClient({ initialProducts, initialCategories }: SearchClientProps = {}) {
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useStore();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [showFilters, setShowFilters] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus search input on mount
  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 350);
    return () => clearTimeout(t);
  }, []);

  const productList = useMemo(() => {
    if (Array.isArray(initialProducts) && initialProducts.length > 0) {
      return initialProducts.map((p: any) => {
        const cleanName = cleanProductTitle(p.name);
        return {
          id: p._id,
          slug: p.slug,
          name: cleanName,
          price: p.price,
          inStock: p.inStock !== false,
          image: p.mainImage || '',
          category: p.category?.slug || '',
          categoryLabel: p.category?.name || 'Tecnología',
          description: p.description || '',
          longDescription: p.longDescription || '',
          features: p.features || [],
          rating: p.rating || 5,
          reviews: p.reviewCount || 0,
          sku: p.sku || '',
          collection: p.collection || '',
          color: { name: p.color || '' },
          images: (p.gallery || []).map((g: any) => ({ original: g.url || '', thumbnail: g.url || '' })),
        };
      });
    }
    return [];
  }, [initialProducts]);

  // Real-time search with inStock prioritization
  const results = useMemo(() => {
    let filtered =
      selectedCategory === 'todos'
        ? [...productList]
        : productList.filter((p) => {
            if (selectedCategory === 'cargadores') {
              return p.category === 'cargadores' || p.name.toLowerCase().includes('cargador');
            }
            if (selectedCategory === 'accesorios') {
              return p.category === 'accesorios' || p.category === 'cargadores' || p.name.toLowerCase().includes('cargador');
            }
            return p.category === selectedCategory;
          });

    // Stock filter toggle
    if (onlyInStock) {
      filtered = filtered.filter((p) => p.inStock);
    }

    // Text search — indexes name, description, category
    if (query.trim()) {
      const terms = query
        .toLowerCase()
        .trim()
        .split(/\s+/)
        .filter(Boolean);

      filtered = filtered.filter((p) => {
        const corpus = [
          p.name,
          p.description,
          p.longDescription,
          p.categoryLabel,
          p.category,
        ]
          .join(' ')
          .toLowerCase();
        return terms.every((t) => corpus.includes(t));
      });

      // Relevance sort
      const q = query.toLowerCase().trim();
      filtered.sort((a, b) => {
        const aExact = a.name.toLowerCase() === q ? 0 : 1;
        const bExact = b.name.toLowerCase() === q ? 0 : 1;
        if (aExact !== bExact) return aExact - bExact;
        const aStarts = a.name.toLowerCase().startsWith(q) ? 0 : 1;
        const bStarts = b.name.toLowerCase().startsWith(q) ? 0 : 1;
        if (aStarts !== bStarts) return aStarts - bStarts;
        return 0;
      });
    }

    // Sort by stock first (in stock on top, out of stock on bottom)
    filtered.sort((a, b) => {
      const aStock = a.inStock ? 1 : 0;
      const bStock = b.inStock ? 1 : 0;
      if (aStock !== bStock) return bStock - aStock;

      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return 0;
    });

    return filtered;
  }, [query, selectedCategory, onlyInStock, sortBy, productList]);

  // Allowed categories only: Laptops, Tablets, Cargadores, Accesorios
  const categoryList = useMemo(() => {
    const allowed = [
      { id: 'todos', label: 'Todos' },
      { id: 'laptops', label: 'Laptops' },
      { id: 'tablets', label: 'Tablets' },
      { id: 'cargadores', label: 'Cargadores' },
      { id: 'accesorios', label: 'Accesorios' },
    ];

    return allowed.map((cat) => {
      if (cat.id === 'todos') {
        return { ...cat, count: productList.length };
      }
      const count = productList.filter((p: any) => {
        if (cat.id === 'cargadores') {
          return p.category === 'cargadores' || p.name.toLowerCase().includes('cargador');
        }
        if (cat.id === 'accesorios') {
          return p.category === 'accesorios' || p.category === 'cargadores' || p.name.toLowerCase().includes('cargador');
        }
        return p.category === cat.id;
      }).length;
      return { ...cat, count };
    });
  }, [productList]);

  const clearAll = () => {
    setQuery('');
    setSelectedCategory('todos');
    setOnlyInStock(false);
    setSortBy('relevance');
    inputRef.current?.focus();
  };

  const hasActiveFilters =
    query.trim() !== '' || selectedCategory !== 'todos' || sortBy !== 'relevance' || onlyInStock;

  const totalInStock = useMemo(() => productList.filter((p) => p.inStock).length, [productList]);
  const totalOutStock = productList.length - totalInStock;

  return (
    <div className="relative pt-16 pb-20 sm:pb-24 min-h-screen bg-background">
      {/* ═══ STICKY SEARCH HEADER ═══ */}
      <div className="sticky top-14 sm:top-16 z-30 bg-background/95 backdrop-blur-xl border-b border-zinc-200/60 shadow-sm">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 py-3">
          {/* Search Bar */}
          <div className="relative flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-foreground/40 pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar por equipo o modelo... (MacBook, iPad, Dell Latitude, Cargador)"
                className="w-full pl-11 pr-10 py-3 rounded-xl bg-zinc-100/90 text-sm text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:bg-white transition-all shadow-inner"
              />
              {query && (
                <button
                  onClick={() => { setQuery(''); inputRef.current?.focus(); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-zinc-200 flex items-center justify-center hover:bg-zinc-300 transition-colors"
                >
                  <X className="w-3.5 h-3.5 text-foreground/60" />
                </button>
              )}
            </div>

            {/* Filter toggle button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`relative w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                showFilters || hasActiveFilters
                  ? 'bg-primary text-white shadow-md shadow-turquoise-500/25'
                  : 'bg-zinc-100 text-foreground/70 hover:bg-zinc-200'
              }`}
              aria-label="Filtros"
            >
              <SlidersHorizontal className="w-4 h-4" />
              {hasActiveFilters && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-turquoise-400 border-2 border-background animate-pulse" />
              )}
            </button>
          </div>

          {/* Quick Filter Pills (Categories & Stock Toggle) */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-3 pb-1">
            <button
              onClick={() => setOnlyInStock(!onlyInStock)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 ${
                onlyInStock
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${onlyInStock ? 'bg-white' : 'bg-emerald-500'}`} />
              Solo disponibles ({totalInStock})
            </button>

            {categoryList.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap flex-shrink-0 ${
                  selectedCategory === cat.id
                    ? 'bg-primary text-white shadow-sm shadow-turquoise-500/20'
                    : 'bg-zinc-100 text-foreground/60 hover:bg-zinc-200'
                }`}
              >
                {cat.label} ({cat.count})
              </button>
            ))}
          </div>

          {/* ═══ ADVANCED FILTER PANEL ═══ */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="pt-3 pb-2 border-t border-zinc-200/50 mt-2 space-y-3">
                  {/* Price Sort */}
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-foreground/40 mb-2 flex items-center gap-1.5">
                      <ArrowUpDown className="w-3 h-3" />
                      Ordenar por precio
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {(
                        [
                          { id: 'relevance' as SortOption, label: 'Relevancia / Stock' },
                          { id: 'price-asc' as SortOption, label: 'Menor a mayor' },
                          { id: 'price-desc' as SortOption, label: 'Mayor a menor' },
                        ] as const
                      ).map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => setSortBy(opt.id)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                            sortBy === opt.id
                              ? 'bg-turquoise-100 text-primary font-bold'
                              : 'bg-zinc-100 text-foreground/60 hover:bg-zinc-200'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Clear all */}
                  {hasActiveFilters && (
                    <button
                      onClick={clearAll}
                      className="text-xs text-primary font-bold hover:underline block pt-1"
                    >
                      Limpiar todos los filtros
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ═══ RESULTS ═══ */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 pt-5">
        {/* Results summary */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-foreground/60">
            {query.trim() ? (
              <>
                <span className="font-bold text-foreground">
                  {results.length}
                </span>{' '}
                resultado{results.length !== 1 ? 's' : ''} para &ldquo;
                <span className="text-primary font-semibold">{query}</span>&rdquo;
              </>
            ) : (
              <>
                Mostrando{' '}
                <span className="font-bold text-foreground">
                  {results.length}
                </span>{' '}
                equipos
              </>
            )}
            {onlyInStock && <span className="ml-1 text-emerald-600 font-medium">• Solo con stock</span>}
          </p>

          {totalOutStock > 0 && !onlyInStock && (
            <span className="text-[11px] text-zinc-400 font-medium">
              {totalInStock} en stock • {totalOutStock} agotados al final
            </span>
          )}
        </div>

        {/* ═══ PRODUCT LIST ═══ */}
        {results.length > 0 ? (
          <div className="space-y-3 sm:space-y-4">
            <AnimatePresence mode="popLayout">
              {results.map((product, idx) => {
                const badge = getSearchStockBadge(product);

                return (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.3, delay: idx * 0.03 }}
                    className="group cursor-pointer"
                    onClick={() => router.push(`/coleccion/${product.slug}`)}
                  >
                    <div
                      className={`flex gap-3.5 sm:gap-4 p-3 sm:p-4 rounded-2xl border transition-all duration-300 ${
                        product.inStock
                          ? 'bg-white/80 border-zinc-100 hover:bg-white hover:shadow-lg hover:shadow-zinc-200/50'
                          : 'bg-zinc-50/60 border-zinc-200/60 opacity-80 hover:opacity-100'
                      }`}
                    >
                      {/* Product Image */}
                      <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden bg-zinc-100 flex-shrink-0">
                        <img
                          src={product.image}
                          alt={product.name}
                          className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                            !product.inStock ? 'grayscale-[40%]' : ''
                          }`}
                          loading="lazy"
                        />
                        {/* Category badge */}
                        <div className="absolute top-1.5 left-1.5">
                          <span className="px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-sm text-[9px] sm:text-[10px] font-bold text-turquoise-700 shadow-sm">
                            {product.categoryLabel}
                          </span>
                        </div>
                        {/* Favorite button */}
                        <motion.button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(product.id);
                          }}
                          className="absolute bottom-1.5 right-1.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                          whileTap={{ scale: 0.85 }}
                        >
                          <Star
                            className={`w-3.5 h-3.5 ${
                              isFavorite(product.id)
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-foreground/40'
                            }`}
                            fill={isFavorite(product.id) ? 'currentColor' : 'none'}
                          />
                        </motion.button>
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                        <div>
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className={`inline-flex items-center text-[10px] sm:text-xs px-2 py-0.5 rounded-md ${badge.className}`}>
                              {badge.text}
                            </span>
                          </div>

                          <h3
                            className={`text-sm sm:text-base font-bold transition-colors mb-1 truncate ${
                              product.inStock
                                ? 'text-foreground group-hover:text-primary'
                                : 'text-zinc-600 line-through decoration-zinc-400'
                            }`}
                          >
                            {product.name}
                          </h3>

                          <p className="text-xs text-foreground/50 leading-relaxed line-clamp-2">
                            {product.description}
                          </p>
                        </div>

                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-100">
                          <div>
                            <span
                              className={`text-base sm:text-lg font-black ${
                                product.inStock ? 'text-primary' : 'text-zinc-500'
                              }`}
                            >
                              {formatPrice(product.price)}
                            </span>
                          </div>

                          {product.inStock ? (
                            <span className="text-xs font-bold text-turquoise-600 inline-flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                              Ver equipo{' '}
                              <ChevronRight className="w-3.5 h-3.5" />
                            </span>
                          ) : (
                            <span className="text-[11px] font-semibold text-rose-600 inline-flex items-center gap-1">
                              <span>Consultar reingreso</span>
                              <ChevronRight className="w-3 h-3" />
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          /* Empty state */
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-zinc-100 flex items-center justify-center mx-auto mb-4">
              <Search className="w-7 h-7 text-foreground/20" />
            </div>
            <p className="text-foreground/60 text-base font-bold mb-1">
              No se encontraron equipos
            </p>
            <p className="text-foreground/40 text-xs mb-5">
              Intenta con otra palabra clave o revisa las categorías disponibles.
            </p>
            <button
              onClick={clearAll}
              className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-turquoise-600 transition-colors shadow-md shadow-turquoise-500/20"
            >
              Ver todos los equipos disponibles
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

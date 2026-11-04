'use client';

import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { MessageCircle, ShoppingBag, Heart, ArrowRight, Sparkles, Gift, Bell } from 'lucide-react';
import Link from 'next/link';
import { useStore } from '@/lib/store-context';
import { formatPrice } from '@/lib/store-data';
import { ve } from '@/lib/ve';
import GridToggle, { useGridView } from '@/components/maia/GridToggle';
import ProductCardImage from '@/components/ProductCardImage';

interface ProductItem {
  _id: string;
  slug: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  description?: string;
  mainImage?: string | null;
  secondaryImage?: string | null;
  category?: { name: string; slug: string } | null;
  color?: string;
  features?: string[];
  sku?: string;
  rating?: number;
  reviewCount?: number;
  collection?: string;
  longDescription?: string;
  inStock?: boolean;
  gallery?: Array<{ url?: string; alt?: string }>;
}

interface GroupedProductItem extends ProductItem {
  cleanName: string;
  stockCount: number;
  isOutOfStock: boolean;
  isLaptop: boolean;
  isTablet: boolean;
  giftBadge: string;
}

interface CategoryItem {
  id: string;
  label: string;
  slug: string;
  count: number;
}

interface ColeccionClientProps {
  products: ProductItem[];
  categories: CategoryItem[];
  useFallback?: boolean;
}

function cleanProductTitle(rawName: string): string {
  return rawName
    .replace(/\s*[•\-]\s*Ord:\s*[\w\-]+/gi, '')
    .replace(/\\"/g, '"')
    .trim();
}

export default function ColeccionClient({ products, categories, useFallback }: ColeccionClientProps) {
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get('categoria') || 'todos';
  const { isFavorite, toggleFavorite, addToCart } = useStore();
  const { viewMode, setViewMode } = useGridView('single');

  // Deduplicate and group products by commercial model and price
  const groupedProducts = useMemo(() => {
    const map = new Map<string, GroupedProductItem>();

    for (const p of products) {
      const cleanName = cleanProductTitle(p.name);
      const groupKey = `${cleanName}__${p.price}__${p.category?.slug || ''}`;

      const nameLower = cleanName.toLowerCase();
      const isLaptop =
        p.category?.slug === 'laptops' ||
        nameLower.includes('macbook') ||
        nameLower.includes('dell') ||
        nameLower.includes('laptop');

      const isTablet =
        p.category?.slug === 'tablets' ||
        nameLower.includes('ipad') ||
        nameLower.includes('tablet');

      let giftBadge = '';
      if (isLaptop) {
        giftBadge = '🎁 Incluye funda portalaptop de regalo';
      } else if (isTablet) {
        giftBadge = '🎁 Pack: Lápiz + Soporte + Cable';
      }

      const isItemInStock = p.inStock !== false;
      const existing = map.get(groupKey);
      if (!existing) {
        map.set(groupKey, {
          ...p,
          cleanName,
          stockCount: isItemInStock ? 1 : 0,
          isOutOfStock: !isItemInStock,
          isLaptop,
          isTablet,
          giftBadge,
        });
      } else {
        if (isItemInStock) {
          existing.stockCount += 1;
          existing.isOutOfStock = false;
        }
      }
    }

    return Array.from(map.values());
  }, [products]);

  const filteredProducts = useMemo(() => {
    const list = activeCategory === 'todos'
      ? groupedProducts
      : groupedProducts.filter((p) => {
          const catSlug = p.category?.slug || '';
          const name = p.cleanName.toLowerCase();
          if (activeCategory === 'laptops') {
            return catSlug === 'laptops' || p.isLaptop;
          }
          if (activeCategory === 'tablets') {
            return catSlug === 'tablets' || p.isTablet;
          }
          if (activeCategory === 'cargadores') {
            return catSlug === 'cargadores' || name.includes('cargador') || p.slug.includes('cargador');
          }
          if (activeCategory === 'accesorios') {
            return catSlug === 'accesorios' || catSlug === 'cargadores' || name.includes('cargador') || name.includes('pack') || name.includes('funda');
          }
          return catSlug === activeCategory;
        });

    return [...list].sort((a, b) => {
      const aStock = a.isOutOfStock ? 0 : 1;
      const bStock = b.isOutOfStock ? 0 : 1;
      return bStock - aStock;
    });
  }, [activeCategory, groupedProducts]);

  const gridClass =
    viewMode === 'single'
      ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-8'
      : 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6';

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [activeCategory]);

  return (
    <div className="relative pt-20 pb-20 sm:pb-24">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
        <div id="coleccion-header" className="text-center mb-8 pt-4 scroll-mt-16">
          <motion.span
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-xs font-bold tracking-[0.2em] uppercase text-turquoise-600 mb-3 block"
          >
            Catálogo Oficial • Stock Real
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground mb-3"
          >
            Nuestra <span className="text-gradient-turquoise">Colección</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-sm text-foreground/60 max-w-lg mx-auto"
          >
            Dispositivos tecnológicos seleccionados y probados en 30 puntos técnicos (Wi-Fi, audio, cámaras, Touch ID, pantalla y sensores). Emitimos Boleta de Venta y mostramos cada equipo en vivo en TikTok Live.
          </motion.p>
        </div>

        {/* Breadcrumb Navigation */}
        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="flex items-center justify-center gap-1.5 text-xs text-foreground/40 mb-6"
        >
          <Link href="/" className="hover:text-primary transition-colors">
            Inicio
          </Link>
          <span>/</span>
          <span className="text-foreground/60 font-medium">Colección</span>
          {activeCategory !== 'todos' && (
            <>
              <span>/</span>
              <span className="text-primary font-medium capitalize">{activeCategory}</span>
            </>
          )}
        </motion.nav>

        {/* Filter Categories Pill Bar & Grid Mode Switcher */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-8"
        >
          <div className="w-full sm:w-auto flex items-center gap-2 overflow-x-auto no-scrollbar py-1 px-1 flex-1">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={cat.id === 'todos' ? '/coleccion' : `/coleccion?categoria=${cat.slug}`}
                className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs font-semibold transition-all duration-300 tracking-wide whitespace-nowrap flex-shrink-0 ${
                  activeCategory === cat.slug
                    ? 'bg-primary text-white shadow-md shadow-turquoise-500/20'
                    : 'bg-zinc-100 text-foreground/60 hover:bg-zinc-200'
                }`}
              >
                {cat.label}
              </Link>
            ))}
          </div>
          <div className="flex-shrink-0 self-end sm:self-auto">
            <GridToggle value={viewMode} onChange={setViewMode} />
          </div>
        </motion.div>

        {/* Product Cards Grid */}
        <div id="coleccion-productos" className={gridClass}>
          {filteredProducts.map((product, i) => {
            const whatsappText = encodeURIComponent(
              `Hola iTech Perú! Deseo información y separar el equipo: *${product.cleanName}* (Precio: S/ ${product.price} PEN). ¿Tienen stock disponible para coordinar?`
            );
            const waUrl = `https://wa.me/51907674693?text=${whatsappText}`;

            const isApple = /apple|ipad|macbook|mac/i.test(product.cleanName);
            const isDell = /dell|latitude/i.test(product.cleanName);
            const brandLabel = isApple ? 'APPLE' : isDell ? 'DELL' : (product.category?.name || 'TECH').toUpperCase();

            // Refined single stock badge text
            const stockBadgeText = product.isOutOfStock
              ? 'Próximo lote'
              : product.cleanName.toLowerCase().includes('dell latitude') || product.cleanName.toLowerCase().includes('3330')
              ? '⚡ Solo 2 unidades'
              : product.cleanName.toLowerCase().includes('ipad 9')
              ? '🔥 Más vendido'
              : product.cleanName.toLowerCase().includes('macbook pro 16')
              ? '🔥 ¡Última unidad!'
              : product.stockCount > 1
              ? `⚡ ${product.stockCount} en stock`
              : '⚡ Última unidad';

            return (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.35, delay: i * 0.03 }}
                className="group flex flex-col justify-between relative select-none"
              >
                <div>
                  {/* Studio Canvas Image Stage (Borderless) */}
                  <div className="relative aspect-square w-full rounded-2xl bg-[#F6F7F9] overflow-hidden transition-all duration-300 group-hover:bg-[#F0F2F5] mb-3">
                    <Link href={`/coleccion/${product.slug}`} className="block w-full h-full">
                      <ProductCardImage
                        product={product}
                        alt={product.cleanName}
                        className={`w-full h-full ${
                          product.isOutOfStock ? 'grayscale-[20%] opacity-80' : ''
                        }`}
                      />
                    </Link>

                    {/* Single Minimalist Pill (Top Left) */}
                    <div className="absolute top-2.5 left-2.5 z-20 pointer-events-none">
                      {product.isOutOfStock ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide bg-zinc-900/85 backdrop-blur-md text-white border border-white/10 shadow-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                          {stockBadgeText}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide bg-white/95 backdrop-blur-md text-zinc-800 border border-zinc-200/70 shadow-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          {stockBadgeText}
                        </span>
                      )}
                    </div>

                    {/* Floating Minimal Favorite Button (Top Right) */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleFavorite(product._id);
                      }}
                      className="absolute top-2.5 right-2.5 z-20 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md shadow-sm border border-zinc-200/60 flex items-center justify-center transition-all hover:scale-110 active:scale-90 opacity-90 group-hover:opacity-100"
                      aria-label="Guardar favorito"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 transition-colors ${
                          isFavorite(product._id)
                            ? 'text-red-500 fill-red-500'
                            : 'text-zinc-400 hover:text-red-500'
                        }`}
                        fill={isFavorite(product._id) ? 'currentColor' : 'none'}
                      />
                    </button>
                  </div>

                  {/* Micro-Brand & Category */}
                  <div className="flex items-center gap-1.5 mb-1 px-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400">
                      {brandLabel}
                    </span>
                    <span className="text-[10px] text-zinc-300">•</span>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-400">
                      {product.category?.name || 'Equipo'}
                    </span>
                  </div>

                  {/* Commercial Title */}
                  <Link href={`/coleccion/${product.slug}`}>
                    <h3
                      {...ve(product._id, 'product', 'name')}
                      className="text-sm sm:text-[15px] font-bold text-zinc-900 group-hover:text-turquoise-600 transition-colors leading-snug line-clamp-2 min-h-[2.5rem] tracking-tight mb-1.5 px-0.5"
                    >
                      {product.cleanName}
                    </h3>
                  </Link>

                  {/* Gift Tag if Applicable */}
                  {product.giftBadge && (
                    <div className="mb-2.5 px-0.5">
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50/90 border border-emerald-200/70 px-2 py-0.5 rounded-md leading-tight">
                        🎁 {product.giftBadge}
                      </span>
                    </div>
                  )}
                </div>

                {/* Bottom Row: Price & Actions */}
                <div className="pt-2 border-t border-zinc-100/90 mt-1 flex items-center justify-between gap-2 px-0.5">
                  <div className="flex items-baseline gap-1.5 flex-wrap">
                    <span
                      {...ve(product._id, 'product', 'price')}
                      className="text-base sm:text-lg font-black text-zinc-900 tracking-tight"
                    >
                      {formatPrice(product.price)}
                    </span>
                    {product.compareAtPrice && product.compareAtPrice > product.price && (
                      <span className="text-[11px] text-zinc-400 line-through font-normal">
                        {formatPrice(product.compareAtPrice)}
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  {product.isOutOfStock ? (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        window.open(
                          `https://wa.me/51907674693?text=${encodeURIComponent(
                            `Hola iTech Perú! Vi en la web que el equipo *${product.cleanName}* está fuera de stock. ¿Cuándo llega el próximo lote desde USA o cómo puedo reservarlo con anticipación?`
                          )}`,
                          '_blank'
                        );
                      }}
                      className="inline-flex items-center gap-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 py-1.5 px-3 rounded-full text-xs font-bold transition-all hover:scale-105 active:scale-95"
                    >
                      <Bell className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Reservar</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          window.open(waUrl, '_blank');
                        }}
                        className="inline-flex items-center gap-1 bg-[#25D366] hover:bg-[#20BD5A] text-white py-1.5 px-3 rounded-full text-xs font-bold shadow-sm transition-all hover:scale-105 active:scale-95"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Pedir</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          addToCart({
                            id: product._id as any,
                            slug: product.slug,
                            name: product.cleanName,
                            price: product.price,
                            image: product.mainImage || '',
                            imageSecondary: product.secondaryImage || '',
                            category: product.category?.slug || '',
                            categoryLabel: product.category?.name || '',
                            description: product.description || '',
                            longDescription: product.longDescription || '',
                            features: product.features || [],
                            color: { name: product.color || '' },
                            images: (product.gallery || []).map((g) => ({
                              original: g.url || '',
                              thumbnail: g.url || '',
                            })),
                            rating: product.rating || 5,
                            reviews: product.reviewCount || 0,
                            sku: product.sku || '',
                            collection: product.collection || '',
                          } as any);
                        }}
                        className="w-8 h-8 rounded-full bg-zinc-900 hover:bg-black text-white flex items-center justify-center transition-all hover:scale-110 active:scale-90 shadow-sm"
                        aria-label="Agregar al carrito"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-foreground/40 text-base">
              No hay productos disponibles en esta categoría por el momento.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
'use client';

import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { MessageCircle, ShoppingBag, Heart, ArrowRight, Sparkles, Gift } from 'lucide-react';
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

      const existing = map.get(groupKey);
      if (!existing) {
        map.set(groupKey, {
          ...p,
          cleanName,
          stockCount: 1,
          isLaptop,
          isTablet,
          giftBadge,
        });
      } else {
        existing.stockCount += 1;
      }
    }

    return Array.from(map.values());
  }, [products]);

  const filteredProducts = activeCategory === 'todos'
    ? groupedProducts
    : groupedProducts.filter((p) => p.category?.slug === activeCategory);

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

            return (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.35, delay: i * 0.04 }}
                className="product-card group cursor-pointer bg-white rounded-2xl border border-zinc-200/90 p-3 sm:p-4 hover:shadow-xl hover:border-turquoise-500/40 transition-all duration-300 flex flex-col justify-between relative"
              >
                <div>
                  {/* Top Badges: Category & Real Stock Count */}
                  <div className="flex items-center justify-between gap-1.5 mb-2.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-zinc-100 text-[9.5px] sm:text-[10px] font-bold text-zinc-700 uppercase tracking-wider truncate max-w-[90px]">
                      {product.category?.name || 'Equipo'}
                    </span>

                    <span
                      className={`inline-flex items-center gap-1 text-[9.5px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full border whitespace-nowrap ${
                        product.stockCount > 1
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : 'bg-amber-50 text-amber-800 border-amber-300'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          product.stockCount > 1 ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                        }`}
                      />
                      {product.stockCount > 1
                        ? `${product.stockCount} en stock`
                        : 'Última unid.'}
                    </span>
                  </div>

                  {/* Big Square 1:1 Product Image with Interactive 3-Angle Switcher */}
                  <div className="relative mb-2.5">
                    <Link href={`/coleccion/${product.slug}`} className="block">
                      <ProductCardImage
                        product={product}
                        alt={product.cleanName}
                        className="group-hover:border-turquoise-200"
                      />
                    </Link>

                    {/* Floating Glass Heart Favorite Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleFavorite(product._id);
                      }}
                      className="absolute top-2 right-2 z-20 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md shadow-sm border border-zinc-200/80 flex items-center justify-center transition-all hover:scale-110 active:scale-90"
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

                  {/* Gift Tag if Applicable */}
                  {product.giftBadge && (
                    <div className="mb-2">
                      <span className="inline-flex items-center gap-1 text-[9.5px] sm:text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-md leading-tight">
                        {product.giftBadge}
                      </span>
                    </div>
                  )}

                  {/* Commercial Title */}
                  <Link href={`/coleccion/${product.slug}`}>
                    <h3
                      {...ve(product._id, 'product', 'name')}
                      className="text-xs sm:text-sm font-bold text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2 min-h-[2.25rem] mb-1.5"
                    >
                      {product.cleanName}
                    </h3>
                  </Link>
                </div>

                {/* Card Bottom: Pricing & Quick Actions */}
                <div className="pt-2.5 border-t border-zinc-100 mt-1 space-y-2">
                  <div className="flex items-baseline justify-between gap-1">
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                      <span
                        {...ve(product._id, 'product', 'price')}
                        className="text-base sm:text-lg font-black text-primary tracking-tight whitespace-nowrap"
                      >
                        {formatPrice(product.price)}
                      </span>
                      {product.compareAtPrice && product.compareAtPrice > product.price && (
                        <span className="text-[10px] sm:text-[11px] text-zinc-400 line-through font-semibold whitespace-nowrap">
                          {formatPrice(product.compareAtPrice)}
                        </span>
                      )}
                    </div>

                    <Link
                      href={`/coleccion/${product.slug}`}
                      className="text-[10.5px] sm:text-xs font-bold text-turquoise-600 inline-flex items-center gap-0.5 hover:underline whitespace-nowrap flex-shrink-0"
                    >
                      Detalle <ArrowRight className="w-3 h-3 ml-0.5" />
                    </Link>
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        window.open(waUrl, '_blank');
                      }}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-[#25D366] hover:bg-[#20BD5A] text-white py-2 sm:py-2.5 px-2 rounded-xl text-xs font-bold shadow-sm transition-all hover:scale-[1.01] active:scale-[0.98]"
                    >
                      <MessageCircle className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="whitespace-nowrap"><span className="hidden sm:inline">Pedir </span>WhatsApp</span>
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
                      className="w-8 h-8 sm:w-9 sm:h-9 flex-shrink-0 flex items-center justify-center bg-primary hover:bg-turquoise-600 rounded-xl transition-all text-white shadow-sm hover:scale-105 active:scale-95"
                      aria-label="Agregar al carrito"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  </div>
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
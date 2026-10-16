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
      ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6 lg:gap-8'
      : 'grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6';

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

        {/* Filter Categories Pill Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-2 mb-10"
        >
          <div className="flex flex-wrap items-center justify-center gap-2 flex-1">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={cat.id === 'todos' ? '/coleccion' : `/coleccion?categoria=${cat.slug}`}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 tracking-wide ${
                  activeCategory === cat.slug
                    ? 'bg-primary text-white shadow-lg shadow-turquoise-500/20'
                    : 'bg-zinc-100 text-foreground/60 hover:bg-zinc-200'
                }`}
              >
                {cat.label}
              </Link>
            ))}
          </div>
          <GridToggle value={viewMode} onChange={setViewMode} />
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
                className="product-card group cursor-pointer bg-white rounded-2xl border border-zinc-200/80 p-3 sm:p-4 hover:shadow-xl hover:border-turquoise-500/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Top Badges: Category & Real Stock Count */}
                  <div className="flex items-center justify-between gap-1.5 mb-2.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-zinc-100 text-[10px] font-bold text-foreground/70 uppercase tracking-wider">
                      {product.category?.name || 'Tecnología'}
                    </span>

                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
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
                        ? `Stock: ${product.stockCount} unid.`
                        : '¡Última unidad!'}
                    </span>
                  </div>

                  {/* Big Square 1:1 Product Image with Interactive 3-Angle Switcher */}
                  <Link href={`/coleccion/${product.slug}`} className="block mb-3">
                    <ProductCardImage
                      product={product}
                      alt={product.cleanName}
                      className="group-hover:border-turquoise-200"
                    />
                  </Link>

                  {/* Gift Tag if Applicable */}
                  {product.giftBadge && (
                    <div className="mb-2">
                      <span className="inline-block text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-md">
                        {product.giftBadge}
                      </span>
                    </div>
                  )}

                  {/* Commercial Title */}
                  <Link href={`/coleccion/${product.slug}`}>
                    <h3
                      {...ve(product._id, 'product', 'name')}
                      className="text-sm font-bold text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2 mb-2"
                    >
                      {product.cleanName}
                    </h3>
                  </Link>
                </div>

                {/* Card Bottom: Pricing & Quick Actions */}
                <div className="pt-3 border-t border-zinc-100 mt-2 space-y-2.5">
                  <div className="flex items-baseline justify-between">
                    <div>
                      {product.compareAtPrice && product.compareAtPrice > product.price && (
                        <span className="text-[11px] text-foreground/40 line-through block font-medium">
                          {formatPrice(product.compareAtPrice)}
                        </span>
                      )}
                      <span
                        {...ve(product._id, 'product', 'price')}
                        className="text-lg font-black text-primary"
                      >
                        {formatPrice(product.price)}
                      </span>
                    </div>

                    <Link
                      href={`/coleccion/${product.slug}`}
                      className="text-[11px] font-bold text-turquoise-600 inline-flex items-center gap-1 hover:underline"
                    >
                      Ver Detalle <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>

                  {/* Quick WhatsApp Action Button */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        window.open(waUrl, '_blank');
                      }}
                      className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      Pedir por WhatsApp
                    </button>

                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleFavorite(product._id);
                      }}
                      className="w-9 h-9 flex items-center justify-center bg-zinc-100 hover:bg-zinc-200 rounded-xl transition-colors"
                      aria-label="Guardar favorito"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          isFavorite(product._id)
                            ? 'text-red-500 fill-red-500'
                            : 'text-foreground/50'
                        }`}
                        fill={isFavorite(product._id) ? 'currentColor' : 'none'}
                      />
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
                      className="w-9 h-9 flex items-center justify-center bg-primary hover:bg-turquoise-600 rounded-xl transition-colors text-white"
                      aria-label="Agregar al carrito"
                    >
                      <ShoppingBag className="w-4 h-4" />
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
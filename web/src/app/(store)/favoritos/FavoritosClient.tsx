'use client';

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, ShoppingBag, ArrowLeft, Trash2 } from 'lucide-react';
import { useStore } from '@/lib/store-context';
import { formatPrice } from '@/lib/store-data';
import OfficialWhatsAppIcon from '@/components/OfficialWhatsAppIcon';

interface FavoritosClientProps {
  allProducts?: any[];
}

export default function FavoritosClient({ allProducts = [] }: FavoritosClientProps) {
  const router = useRouter();
  const { favorites, favoriteItems, toggleFavorite, addToCart } = useStore();

  const favoriteProducts = useMemo(() => {
    const favSet = new Set(favorites.map(String));
    if (favSet.size === 0) return [];

    const result: any[] = [];
    const addedIds = new Set<string>();

    // 1. Resolve against live Sanity products
    for (const p of allProducts) {
      const pId = String(p._id);
      const pSlug = String(p.slug);
      if (favSet.has(pId) || favSet.has(pSlug)) {
        const cleanName = (p.name || '')
          .replace(/\s*[•\-]\s*Ord:\s*[\w\-]+/gi, '')
          .replace(/\\"/g, '"')
          .trim();
        const rawImg = p.mainImage || p.gallery?.[0]?.url || '';
        const imgUrl = typeof rawImg === 'string' ? rawImg : rawImg?.asset?.url || '';

        result.push({
          _id: p._id,
          slug: p.slug,
          name: cleanName,
          cleanName,
          price: p.price,
          compareAtPrice: p.compareAtPrice,
          image: imgUrl,
          categoryName: p.category?.name || 'Equipo',
          description: p.description || '',
          giftBadge: p.cleanName?.toLowerCase().includes('dell') || /laptop|macbook/i.test(cleanName)
            ? 'Incluye funda portalaptop de regalo'
            : /ipad|tablet/i.test(cleanName)
            ? 'Pack: Lápiz + Soporte + Cable'
            : '',
          isOutOfStock: p.inStock === false,
        });
        addedIds.add(pId);
        addedIds.add(pSlug);
      }
    }

    // 2. Also merge any stored snapshots from localStorage
    for (const item of favoriteItems || []) {
      const itemId = String(item._id || item.slug);
      if (favSet.has(itemId) && !addedIds.has(String(item._id)) && !addedIds.has(String(item.slug))) {
        result.push(item);
        addedIds.add(String(item._id));
        if (item.slug) addedIds.add(String(item.slug));
      }
    }

    return result;
  }, [allProducts, favorites, favoriteItems]);

  return (
    <div id="favoritos-contenido" className="relative pt-24 pb-24 sm:pb-32 px-4 min-h-screen bg-[#FDFDFE] scroll-mt-16">
      <div className="max-w-4xl mx-auto">
        {/* Navigation Breadcrumb & Header */}
        <div className="mb-8">
          <Link
            href="/coleccion"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-500 hover:text-turquoise-600 transition-colors mb-3"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Volver al Catálogo
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-zinc-200/60 pb-5">
            <div>
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-turquoise-600 block mb-1">
                Tu Selección Personal
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight">
                Mis Equipos Favoritos
              </h1>
            </div>
            <p className="text-xs font-medium text-zinc-500">
              {favoriteProducts.length} {favoriteProducts.length === 1 ? 'equipo guardado' : 'equipos guardados'}
            </p>
          </div>
        </div>

        {/* Empty State */}
        {favoriteProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center rounded-3xl bg-white border border-zinc-200/70 p-8 shadow-sm">
            <div className="w-20 h-20 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center mb-5 shadow-sm">
              <Heart className="w-9 h-9 text-rose-400" />
            </div>
            <h2 className="text-xl font-bold text-zinc-900 mb-2">Tu lista de favoritos está vacía</h2>
            <p className="text-zinc-500 text-xs sm:text-sm max-w-md mb-7 leading-relaxed">
              Guarda las laptops, MacBooks e iPads certificados que más te interesen tocando el icono de corazón en cada equipo para consultarlos cuando quieras.
            </p>
            <button
              onClick={() => router.push('/coleccion')}
              className="inline-flex items-center gap-2 bg-zinc-900 hover:bg-black text-white px-7 py-3.5 rounded-full text-xs sm:text-sm font-bold shadow-md transition-all hover:scale-105 active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Explorar Catálogo Completo</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3.5">
            <AnimatePresence>
              {favoriteProducts.map((product) => {
                const productUrl = `https://www.itechperu.shop/coleccion/${product.slug}`;
                const giftLine = product.giftBadge ? `🎁 *Obsequio incluido:* ${product.giftBadge}` : '';
                const categoryLine = product.categoryName ? `🏷️ *Categoría:* ${product.categoryName}` : '';
                const waLines = [
                  '¡Hola iTech Perú! 🇵🇪 Vengo de mi lista de favoritos web.',
                  'Deseo coordinar la compra de este equipo:',
                  '',
                  `💻 *Equipo:* ${product.cleanName || product.name}`,
                  `💰 *Precio:* S/ ${product.price}.00 PEN`,
                  categoryLine,
                  giftLine,
                  `⚡ *Disponibilidad:* ${product.isOutOfStock ? 'Reserva próximo lote' : 'En stock para entrega inmediata'}`,
                  '📦 *Despacho:* Envío 100% seguro por Shalom a todo el Perú con Boleta de Venta',
                  '',
                  `🔗 *Ficha oficial:* ${productUrl}`,
                  '',
                  '¿Me brindan los datos de pago para coordinar el despacho por Shalom? ¡Gracias!'
                ].filter(Boolean);

                const waUrl = `https://wa.me/51907674693?text=${encodeURIComponent(waLines.join('\n'))}`;

                return (
                  <motion.div
                    key={product._id || product.slug}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.25 }}
                    className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-zinc-200/80 shadow-sm hover:border-zinc-300 transition-all"
                  >
                    {/* Left: Product Info */}
                    <div className="flex items-center gap-3.5 w-full sm:w-auto flex-1 min-w-0">
                      <Link
                        href={`/coleccion/${product.slug}`}
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-[#F6F7F9] overflow-hidden flex-shrink-0 border border-zinc-100 flex items-center justify-center group"
                      >
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.cleanName || product.name}
                            className="w-full h-full object-contain p-1 group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="w-full h-full bg-zinc-100" />
                        )}
                      </Link>

                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-0.5">
                          {product.categoryName || 'Equipo'}
                        </span>
                        <Link
                          href={`/coleccion/${product.slug}`}
                          className="font-bold text-sm text-zinc-900 hover:text-turquoise-600 transition-colors line-clamp-2 leading-snug tracking-tight"
                        >
                          {product.cleanName || product.name}
                        </Link>
                        {product.giftBadge && (
                          <span className="inline-block text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded mt-1">
                            🎁 {product.giftBadge}
                          </span>
                        )}
                        <div className="flex items-baseline gap-2 mt-1.5">
                          <span className="text-base font-black text-zinc-900 tracking-tight">
                            {formatPrice(product.price)}
                          </span>
                          {product.compareAtPrice && product.compareAtPrice > product.price && (
                            <span className="text-[11px] text-zinc-400 line-through">
                              {formatPrice(product.compareAtPrice)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-100">
                      {/* WhatsApp Button */}
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 bg-[#25D366] hover:bg-[#20BD5A] text-white py-2 px-3.5 rounded-xl text-xs font-bold shadow-sm transition-all active:scale-95"
                      >
                        <OfficialWhatsAppIcon className="w-3.5 h-3.5 fill-current" />
                        <span>Pedir por WhatsApp</span>
                      </a>

                      {/* Add to Cart */}
                      <button
                        onClick={() => {
                          addToCart({
                            id: product._id as any,
                            slug: product.slug,
                            name: product.cleanName || product.name,
                            price: product.price,
                            image: product.image,
                            category: product.categorySlug || '',
                            categoryLabel: product.categoryName || '',
                            description: product.description || '',
                            inStock: !product.isOutOfStock,
                          } as any);
                        }}
                        className="w-9 h-9 rounded-xl bg-zinc-900 hover:bg-black text-white flex items-center justify-center shadow-sm transition-all active:scale-95 flex-shrink-0"
                        title="Agregar al carrito"
                        aria-label="Agregar al carrito"
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </button>

                      {/* Remove Favorite */}
                      <button
                        onClick={() => toggleFavorite(product._id || product.slug)}
                        className="w-9 h-9 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-500 flex items-center justify-center transition-all active:scale-95 flex-shrink-0 border border-rose-200/60"
                        title="Quitar de favoritos"
                        aria-label="Quitar de favoritos"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Bottom Shalom and Trust Note */}
            <div className="p-4 rounded-2xl bg-zinc-100/70 border border-zinc-200/60 text-center mt-6">
              <p className="text-xs text-zinc-600 font-medium">
                📦 Todos los equipos se envían 100% asegurados por Shalom a todo el Perú con Boleta de Venta electrónica.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

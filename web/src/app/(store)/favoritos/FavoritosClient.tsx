'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useStore } from '@/lib/store-context';
import { products as fallbackProducts, formatPrice } from '@/lib/store-data';
import { ve } from '@/lib/ve';
import { useSiteConfig } from '@/contexts/SiteConfigContext';

export default function FavoritosClient({ initialProducts = [] }: { initialProducts?: any[] }) {
  const router = useRouter();
  const { favorites, toggleFavorite, addToCart } = useStore();
  const siteConfig = useSiteConfig();

  const allProducts = useMemo(() => {
    const sanityMapped = (initialProducts || []).map((p: any) => ({
      id: p._id,
      slug: p.slug,
      name: p.name,
      price: p.price,
      image: p.mainImage || '/images/placeholder.webp',
      imageSecondary: p.secondaryImage || '',
      category: p.category?.slug || '',
      categoryLabel: p.category?.name || 'Tecnología',
      description: p.description || '',
      longDescription: p.longDescription || '',
      features: p.features || [],
      color: { name: p.color || '' },
      images: (p.gallery || []).map((g: any) => ({ original: g.url || '', thumbnail: g.url || '' })),
      rating: p.rating || 5,
      reviews: p.reviewCount || 0,
      sku: p.sku || '',
      collection: p.collection || '',
    }));
    return [...sanityMapped, ...fallbackProducts];
  }, [initialProducts]);

  const favoriteProducts = allProducts.filter((p) => favorites.includes(String(p.id)));

  return (
    <div id="favoritos-contenido" className="relative pt-20 pb-20 sm:pb-24 px-4 min-h-screen scroll-mt-16">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-foreground/50 hover:text-primary transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Inicio
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Mis Favoritos</h1>
          <p className="text-sm text-foreground/50 mt-1">
            {favoriteProducts.length} {favoriteProducts.length === 1 ? 'producto guardado' : 'productos guardados'}
          </p>
        </div>

        {favoriteProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-full bg-turquoise-50 flex items-center justify-center mb-4">
              <Heart className="w-10 h-10 text-turquoise-300" />
            </div>
            <p className="text-foreground/40 text-lg mb-2">Sin favoritos aún</p>
            <p className="text-foreground/30 text-sm mb-6">
              Explora el catálogo y guarda los equipos que más te interesen
            </p>
            <motion.button
              onClick={() => router.push(siteConfig.featuredSection?.ctaLink || '/coleccion')}
              {...ve('siteSettings', 'siteSettings', 'featuredSection.ctaLabel')}
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full text-sm font-semibold shadow-lg shadow-turquoise-500/20"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <ShoppingBag className="w-4 h-4" /> {siteConfig.featuredSection?.ctaLabel || 'Ver Catálogo'}
            </motion.button>
          </div>
        ) : (
          <div className="space-y-4">
            {favoriteProducts.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
                className="flex gap-4 p-3 rounded-2xl bg-white/60 border border-zinc-100/60 overflow-hidden max-w-full"
              >
                <Link
                  href={`/coleccion/${product.slug}`}
                  {...ve(String(product.id), 'product', 'mainImage')}
                  className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 cursor-pointer"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </Link>
                <div className="flex-1 min-w-0 w-0 overflow-hidden break-words">
                  <Link
                    href={`/coleccion/${product.slug}`}
                    {...ve(String(product.id), 'product', 'name')}
                    className="block font-semibold text-sm text-foreground line-clamp-2 cursor-pointer hover:text-primary transition-colors break-words"
                  >
                    {product.name}
                  </Link>
                  <p {...ve(String(product.id), 'product', 'description')} className="text-xs text-foreground/40 mt-0.5 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between mt-3 min-w-0 gap-2">
                    <span {...ve(String(product.id), 'product', 'price')} className="text-base font-bold text-primary">
                      {formatPrice(product.price)}
                    </span>
                    <div className="flex items-center gap-2">
                      <motion.button
                        onClick={() => addToCart(product as any)}
                        className="w-8 h-8 rounded-full bg-turquoise-50 flex items-center justify-center text-primary hover:bg-turquoise-100 transition-colors"
                        whileTap={{ scale: 0.9 }}
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        onClick={() => toggleFavorite(String(product.id))}
                        className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-500 hover:bg-red-100 transition-colors"
                        whileTap={{ scale: 0.9 }}
                      >
                        <Heart className="w-4 h-4" fill="currentColor" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
import type { Metadata } from 'next';
import { Suspense } from 'react';
import { sanityFetch } from '@/sanity/live';
import { ALL_PRODUCTS_QUERY, ALL_CATEGORIES_QUERY } from '@/lib/sanity.queries';
import { products as storeProducts, categories as storeCategories } from '@/lib/store-data';
import ColeccionClient from './ColeccionClient';

export const metadata: Metadata = {
  title: 'Catálogo Oficial de MacBooks, iPads & Laptops | iTech Perú',
  description: 'Catálogo oficial de laptops, MacBooks e iPads probados en 30 puntos técnicos con Boleta de Venta. 🎁 Accesorios y fundas de regalo. Stock real disponible.',
  openGraph: {
    title: 'Catálogo Oficial | iTech Perú — Laptops, MacBooks & iPads',
    description: 'Tecnología testeada en 30 puntos técnicos con Boleta de Venta. 🎁 Funda portalaptop o pack iPad de regalo. Envíos a todo el Perú.',
    type: 'website',
    locale: 'es_PE',
    siteName: 'iTech Perú',
    images: [
      { url: '/og-image-square.jpg', width: 1200, height: 1200, alt: 'Catálogo Oficial iTech Perú' },
      { url: '/og-image.jpg', width: 1200, height: 630, alt: 'iTech Perú — Laptops y MacBooks' },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Catálogo Oficial | iTech Perú',
    description: 'MacBooks, iPads y laptops testeados en 30 puntos técnicos con Boleta de Venta.',
    images: ['/og-image.jpg'],
  },
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ColeccionPage() {
  const [sanityProducts, sanityCategories] = await Promise.all([
    sanityFetch<any[]>({ query: ALL_PRODUCTS_QUERY }).then(r => (r.data ?? []) as any[]).catch(() => []),
    sanityFetch<any[]>({ query: ALL_CATEGORIES_QUERY }).then(r => (r.data ?? []) as any[]).catch(() => []),
  ]);

  // Use Sanity data if available, else fall back to store-data
  const hasSanityData = Array.isArray(sanityProducts) && sanityProducts.length > 0;
  const allProducts = hasSanityData ? sanityProducts : storeProducts.map(p => ({
    _id: `store-${p.id}`, slug: p.slug, name: p.name, price: p.price,
    description: p.description, mainImage: p.image, secondaryImage: p.imageSecondary,
    category: { name: p.categoryLabel, slug: p.category },
    color: p.color?.name, features: p.features, sku: p.sku, rating: p.rating,
    reviewCount: p.reviews, collection: p.collection, longDescription: p.longDescription,
    inStock: true,
    gallery: p.images.map(img => ({ url: img.original, alt: p.name })),
  }));

  const cats = hasSanityData && Array.isArray(sanityCategories) && sanityCategories.length > 0
    ? [
        { id: 'todos', label: 'Todos', slug: 'todos', count: sanityProducts.length },
        ...sanityCategories.map((c: any) => ({ id: c.slug, label: c.name, slug: c.slug, count: c.count || 0 })),
      ]
    : storeCategories.map(c => ({ id: c.id, label: c.label, slug: c.id, count: c.count }));

  return (
    <Suspense fallback={<ColeccionSkeleton />}>
      <ColeccionClient products={allProducts} categories={cats} useFallback={!hasSanityData} />
    </Suspense>
  );
}

function ColeccionSkeleton() {
  return (
    <div className="relative pt-20 pb-20 sm:pb-24">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
        <div className="text-center mb-8 pt-4">
          <div className="h-4 w-32 bg-zinc-200 animate-pulse mx-auto mb-3 rounded" />
          <div className="h-10 w-64 bg-zinc-200 animate-pulse mx-auto mb-3 rounded" />
          <div className="h-4 w-80 bg-zinc-200 animate-pulse mx-auto rounded" />
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-9 w-24 bg-zinc-200 animate-pulse rounded-full" />
          ))}
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i}>
              <div className="aspect-[3/4] rounded-2xl bg-zinc-200 animate-pulse mb-2.5" />
              <div className="h-4 w-3/4 bg-zinc-200 animate-pulse rounded mb-1" />
              <div className="h-5 w-1/3 bg-zinc-200 animate-pulse rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
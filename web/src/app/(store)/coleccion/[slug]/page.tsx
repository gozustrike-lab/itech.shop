import type { Metadata } from 'next';
import { sanityFetch } from '@/sanity/live';
import { PRODUCT_BY_SLUG_QUERY, ALL_PRODUCTS_QUERY } from '@/lib/sanity.queries';
import { products as storeProducts, getProductBySlug, formatPrice } from '@/lib/store-data';
import ProductDetailClient from './ProductDetailClient';
import { notFound } from 'next/navigation';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://maia-store.vercel.app';

// Shared product type for passing to client
export interface ProductData {
  _id: string;
  slug: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  description: string;
  longDescription: string;
  mainImage: string;
  secondaryImage?: string;
  gallery: Array<{ original: string; thumbnail: string }>;
  category: string;
  categoryLabel: string;
  categorySlug: string;
  color: { name: string };
  features: string[];
  sku: string;
  rating: number;
  reviews: number;
  collection: string;
  inStock: boolean;
  materials?: string[];
  size?: string;
}

function mapSanityProduct(p: any): ProductData {
  return {
    _id: p._id, slug: p.slug, name: p.name, price: p.price,
    compareAtPrice: p.compareAtPrice, description: p.description || '', longDescription: p.longDescription || '',
    mainImage: p.mainImage || '', secondaryImage: p.secondaryImage || '',
    gallery: (p.gallery || []).map((g: any) => ({ original: g.url || '', thumbnail: g.url || '' })),
    category: p.category?.slug || '', categoryLabel: p.category?.name || '', categorySlug: p.category?.slug || '',
    color: { name: p.color || '' }, features: p.features || [], sku: p.sku || '',
    rating: p.rating || 5, reviews: p.reviewCount || 0, collection: p.collection || '',
    inStock: p.inStock ?? true, materials: p.materials, size: p.size,
  };
}

function mapStoreProduct(p: any): ProductData {
  return {
    _id: `store-${p.id}`, slug: p.slug, name: p.name, price: p.price,
    compareAtPrice: p.compareAtPrice, description: p.description || '', longDescription: p.longDescription || '',
    mainImage: p.image, secondaryImage: p.imageSecondary,
    gallery: p.images, category: p.category, categoryLabel: p.categoryLabel,
    categorySlug: p.category, color: p.color, features: p.features, sku: p.sku,
    rating: p.rating, reviews: p.reviews, collection: p.collection,
    inStock: true, materials: p.materials, size: p.size,
  };
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Skip static generation — products are fetched from Sanity or store-data at request time
export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;

  let name = '';
  let description = '';
  let image = '';

  try {
    const sanityRes = await sanityFetch<any>({ query: PRODUCT_BY_SLUG_QUERY, params: { slug } });
    if (sanityRes?.data) {
      name = sanityRes.data.name;
      description = sanityRes.data.description || sanityRes.data.longDescription || '';
      image = sanityRes.data.mainImage?.asset?.url || '';
    }
  } catch {}

  if (!name) {
    const storeProduct = getProductBySlug(slug);
    if (storeProduct) {
      name = storeProduct.name;
      description = storeProduct.longDescription || storeProduct.description;
      image = storeProduct.image;
    }
  }

  if (!name) return { title: 'Producto no encontrado | iTech Peru' };

  return {
    title: `${name} | iTech Peru`,
    description,
    openGraph: {
      title: `${name} — iTech Peru`,
      description,
      type: 'website',
      url: `${BASE_URL}/coleccion/${slug}`,
      images: image ? [{ url: image, width: 800, height: 800, alt: name }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${name} — iTech Peru`,
      description,
      images: image ? [image] : [],
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Try Sanity first
  let product: ProductData | null = null;
  let allProducts: ProductData[] = [];
  let useFallback = true;

  try {
    const sanityProduct = await sanityFetch<any>({ query: PRODUCT_BY_SLUG_QUERY, params: { slug } });
    const spData = sanityProduct?.data;
    if (spData) {
      product = mapSanityProduct(spData);
      const allSanity: any = await sanityFetch({ query: ALL_PRODUCTS_QUERY });
      allProducts = (allSanity?.data ?? []).map(mapSanityProduct);
      useFallback = false;
    }
  } catch {}

  // Fallback to store-data
  if (!product) {
    const storeProduct = getProductBySlug(slug);
    if (!storeProduct) notFound();
    product = mapStoreProduct(storeProduct);
    allProducts = storeProducts.map(mapStoreProduct);
  }

  return <ProductDetailClient product={product} allProducts={allProducts} useFallback={useFallback} />;
}
import type { Metadata } from 'next';
import { sanityFetch } from '@/sanity/live';
import { ALL_PRODUCTS_QUERY, ALL_CATEGORIES_QUERY } from '@/lib/sanity.queries';
import SearchClient from './SearchClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Buscar | iTech Peru',
  description: 'Busca smartphones, laptops, consolas y accesorios certificados en iTech Peru.',
};

export default async function SearchRoute() {
  const [sanityProducts, sanityCategories] = await Promise.all([
    sanityFetch<any[]>({ query: ALL_PRODUCTS_QUERY }).then(r => (r.data ?? []) as any[]).catch(() => []),
    sanityFetch<any[]>({ query: ALL_CATEGORIES_QUERY }).then(r => (r.data ?? []) as any[]).catch(() => []),
  ]);

  return <SearchClient initialProducts={sanityProducts} initialCategories={sanityCategories} />;
}
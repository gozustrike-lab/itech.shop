import type { Metadata } from 'next';
import { sanityFetch } from '@/sanity/live';
import { ALL_PRODUCTS_QUERY } from '@/lib/sanity.queries';
import FavoritosClient from './FavoritosClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Mis Favoritos | iTech Peru',
  description: 'Revisa tus equipos y productos tecnológicos favoritos guardados en iTech Peru.',
};

export default async function FavoritosRoute() {
  const sanityProducts = await sanityFetch<any[]>({ query: ALL_PRODUCTS_QUERY })
    .then((r) => (r.data ?? []) as any[])
    .catch(() => []);
  return <FavoritosClient initialProducts={sanityProducts} />;
}
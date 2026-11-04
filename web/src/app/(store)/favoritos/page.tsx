import type { Metadata } from 'next';
import { sanityFetch } from '@/sanity/live';
import { ALL_PRODUCTS_QUERY } from '@/lib/sanity.queries';
import FavoritosClient from './FavoritosClient';

export const metadata: Metadata = {
  title: 'Mis Favoritos | iTech Perú',
  description: 'Revisa tus equipos tecnológicos y laptops guardados como favoritos en iTech Perú con Boleta de Venta y envíos Shalom a todo el Perú.',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function FavoritosRoute() {
  const sanityProducts = await sanityFetch<any[]>({ query: ALL_PRODUCTS_QUERY })
    .then((r) => (r.data ?? []) as any[])
    .catch(() => []);

  return <FavoritosClient allProducts={sanityProducts} />;
}

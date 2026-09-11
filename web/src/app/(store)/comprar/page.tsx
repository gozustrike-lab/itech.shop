import type { Metadata } from 'next';
import { sanityFetch } from '@/sanity/live';
import { HOW_TO_BUY_PAGE_QUERY } from '@/lib/sanity.queries';
import ComprarClient from './ComprarClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const data = await sanityFetch<any>({ query: HOW_TO_BUY_PAGE_QUERY }).then(r => r.data).catch(() => null);
  return {
    title: data?.title || 'Cómo Comprar',
    description: data?.subtitle || 'Aprende cómo comprar equipos certificados y métodos de pago seguros.',
  };
}

export default async function ComprarRoute() {
  const data = await sanityFetch<any>({ query: HOW_TO_BUY_PAGE_QUERY }).then(r => r.data).catch(() => null);
  return <ComprarClient data={data} />;
}
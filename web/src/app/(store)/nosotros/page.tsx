import type { Metadata } from 'next';
import { sanityFetch } from '@/sanity/live';
import { ABOUT_PAGE_QUERY } from '@/lib/sanity.queries';
import NosotrosPage from '@/components/maia/pages/NosotrosPage';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const data = await sanityFetch<any>({ query: ABOUT_PAGE_QUERY }).then(r => r.data).catch(() => null);
  return {
    title: data?.title || 'Nosotros',
    description: data?.subtitle || 'Conoce nuestra historia y compromiso con la tecnología renovada garantizada.',
  };
}

export default async function NosotrosRoute() {
  const data = await sanityFetch<any>({ query: ABOUT_PAGE_QUERY }).then(r => r.data).catch(() => null);
  return <NosotrosPage data={data} />;
}
import type { Metadata } from 'next';
import { sanityFetch } from '@/sanity/live';
import { CONTACT_PAGE_QUERY } from '@/lib/sanity.queries';
import ContactoClient from './ContactoClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const data = await sanityFetch<any>({ query: CONTACT_PAGE_QUERY }).then(r => r.data).catch(() => null);
  return {
    title: data?.title || 'Contacto',
    description: data?.subtitle || 'Contáctanos por WhatsApp, teléfono o correo para asesoría especializada.',
  };
}

export default async function ContactoRoute() {
  const data = await sanityFetch<any>({ query: CONTACT_PAGE_QUERY }).then(r => r.data).catch(() => null);
  return <ContactoClient data={data} />;
}
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { categories } from '@/lib/store-data';

// Map of category IDs to human-readable names for metadata
const CATEGORY_NAMES: Record<string, string> = {
  smartphones: 'Smartphones',
  laptops: 'Laptops',
  tablets: 'Tablets',
  gaming: 'Gaming',
  audio: 'Audio',
  accesorios: 'Accesorios',
};

interface PageProps {
  params: Promise<{ categoria: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { categoria } = await params;
  const label = CATEGORY_NAMES[categoria] || categoria;

  return {
    title: `${label} | Catálogo — iTech Peru`,
    description: `Descubre nuestra selección de ${label.toLowerCase()} certificados y renovados. Equipos con 12 meses de garantía real en todo el Perú.`,
  };
}

// Allow static generation for known categories
export function generateStaticParams() {
  return categories
    .filter((c) => c.id !== 'todos')
    .map((cat) => ({ categoria: cat.id }));
}

export default async function CategoriaPage({ params }: PageProps) {
  const { categoria } = await params;

  // Redirect to the canonical query-based URL for backwards compatibility
  redirect(`/coleccion?categoria=${categoria}`);
}
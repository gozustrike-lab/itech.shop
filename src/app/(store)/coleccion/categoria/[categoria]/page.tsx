import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

// Allowed categories: laptops, tablets, cargadores, accesorios
const CATEGORY_NAMES: Record<string, string> = {
  laptops: 'Laptops',
  tablets: 'Tablets',
  cargadores: 'Cargadores',
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
    description: `Descubre nuestra selección de ${label.toLowerCase()} certificados. Equipos testeados en 30 puntos técnicos con boleta de venta.`,
  };
}

export function generateStaticParams() {
  return [
    { categoria: 'laptops' },
    { categoria: 'tablets' },
    { categoria: 'cargadores' },
    { categoria: 'accesorios' },
  ];
}

export default async function CategoriaPage({ params }: PageProps) {
  const { categoria } = await params;

  if (!CATEGORY_NAMES[categoria]) {
    redirect('/coleccion');
  }

  // Redirect to canonical query-based URL
  redirect(`/coleccion?categoria=${categoria}`);
}

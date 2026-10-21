import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Catálogo Oficial de Equipos Certificados | iTech Perú',
  description:
    'Catálogo digital interactivo con stock en vivo: Apple MacBooks, iPads Pro y Laptops de alta gama testeadas en 30 puntos técnicos. Emitimos Boleta de Venta. Envíos inmediatos a todo el Perú.',
  openGraph: {
    title: 'iTech Perú | Catálogo Oficial de Tecnología Certificada',
    description:
      'Apple MacBooks, iPads Pro y Laptops Corporativas Grado A probados en 30 puntos técnicos. Emitimos Boleta de Venta. 🎁 Obsequio incluido con cada compra.',
    url: 'https://www.itechperu.shop/catalogo',
    siteName: 'iTech Perú',
    type: 'website',
    locale: 'es_PE',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Catálogo Oficial iTech Perú — Tecnología Certificada',
        type: 'image/jpeg',
      },
      {
        url: '/og-image-square.jpg',
        width: 1200,
        height: 1200,
        alt: 'Catálogo Oficial iTech Perú',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'iTech Perú | Catálogo Oficial de Tecnología Certificada',
    description:
      'Apple MacBooks, iPads Pro y Laptops Corporativas Grado A testeadas en 30 puntos técnicos con Boleta de Venta.',
    images: ['/og-image.jpg'],
  },
};

export default function CatalogoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { Providers } from "@/components/maia/Providers";
import Navigation from "@/components/maia/Navigation";
import Footer from "@/components/maia/Footer";
import BottomAppBar from "@/components/maia/BottomAppBar";
import CartDrawer from "@/components/maia/CartDrawer";
import ScrollToTop from "@/components/maia/ScrollToTop";
import ScrollProgress from "@/components/maia/ScrollProgress";
import { VisualEditing } from "@/components/cms/VisualEditing";
import { SanityLiveWithToken } from "@/components/SanityLiveWithToken";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.itechperu.shop";

export const metadata: Metadata = {
  title: {
    default: "iTech Perú | Catálogo Oficial de Laptops, MacBooks & iPads Certificados",
    template: "%s | iTech Perú",
  },
  description:
    "Laptops, MacBooks, iPads y tecnología testeada en 30 puntos técnicos con Boleta de Venta. 🎁 Obsequios incluidos: fundas portalaptop y lápices táctiles. Envíos inmediatos en Lima y todo el Perú.",
  keywords: [
    "iTech Perú", "laptops seminuevas Lima", "MacBook Pro Perú", "iPad baratos Perú",
    "laptops con boleta", "MacBook Pro 16", "Dell Latitude", "tecnología certificada",
    "comprar MacBook Lima", "laptops probadas", "itechperu.shop", "Lima", "Perú",
  ],
  authors: [{ name: "iTech Perú" }],
  metadataBase: new URL(siteUrl),
  alternates: { canonical: siteUrl },
  manifest: "/manifest.json",
  openGraph: {
    title: "iTech Perú | Catálogo Oficial de Laptops, MacBooks & iPads",
    description: "Equipos testeados en 30 puntos técnicos con Boleta de Venta. 🎁 Funda portalaptop o pack de accesorios de regalo. Stock real con envío inmediato.",
    type: "website", locale: "es_PE", siteName: "iTech Perú", url: siteUrl,
    images: [
      { url: "/og-image-square.jpg", width: 1200, height: 1200, alt: "iTech Perú — Logo Oficial y Catálogo", type: "image/jpeg" },
      { url: "/og-image.jpg", width: 1200, height: 630, alt: "iTech Perú — Laptops, MacBooks & iPads Certificados", type: "image/jpeg" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "iTech Perú | Catálogo Oficial de Tecnología Certificada",
    description: "MacBooks, iPads y laptops testeados en 30 puntos técnicos con Boleta de Venta.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true, follow: true,
    googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
  },
};

import { sanityFetch } from "@/sanity/live";
import { SITE_SETTINGS_QUERY, FOOTER_SETTINGS_QUERY } from "@/lib/sanity.queries";
import { SiteConfigProvider } from "@/contexts/SiteConfigContext";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function StoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isEnabled: isDraftMode } = await draftMode();

  const [siteConfig, footerSettings] = await Promise.all([
    sanityFetch<any>({ query: SITE_SETTINGS_QUERY }).then((r) => r.data).catch(() => null),
    sanityFetch<any>({ query: FOOTER_SETTINGS_QUERY }).then((r) => r.data).catch(() => null),
  ]);

  return (
    <Providers>
      <SiteConfigProvider config={siteConfig}>
        <Navigation />
        <main className="flex-1">{children}</main>
        <Footer footerSettings={footerSettings} />
        <BottomAppBar />
        <CartDrawer />
        <ScrollToTop />
        <ScrollProgress />
        {isDraftMode && (
          <>
            <SanityLiveWithToken includeDrafts />
            <VisualEditing />
          </>
        )}
      </SiteConfigProvider>
    </Providers>
  );
}

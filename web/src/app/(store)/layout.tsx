import type { Metadata } from "next";
import { Providers } from "@/components/maia/Providers";
import Navigation from "@/components/maia/Navigation";
import Footer from "@/components/maia/Footer";
import BottomAppBar from "@/components/maia/BottomAppBar";
import CartDrawer from "@/components/maia/CartDrawer";
import ScrollToTop from "@/components/maia/ScrollToTop";
import ScrollProgress from "@/components/maia/ScrollProgress";
import { VisualEditing } from "@/components/cms/VisualEditing";
import { SanityLiveWithToken } from "@/components/SanityLiveWithToken";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://maia-store.vercel.app";

export const metadata: Metadata = {
  title: {
    default: "iTech Peru | Tecnología Renovada y Certificada",
    template: "%s | iTech Peru",
  },
  description:
    "Especialistas en smartphones, laptops, consolas y tecnología renovada con 12 meses de garantía real en todo el Perú. Ahorra hasta 40% con equipos certificados.",
  keywords: [
    "tecnología renovada", "smartphones reacondicionados", "laptops seminuevas",
    "iTech Peru", "iPhone Perú", "MacBook Perú", "garantía 12 meses",
    "tecnología certificada", "Lima", "Perú",
  ],
  authors: [{ name: "iTech Peru" }],
  metadataBase: new URL(siteUrl),
  alternates: { canonical: siteUrl },
  manifest: "/manifest.json",
  openGraph: {
    title: "iTech Peru | Tecnología Renovada y Certificada",
    description: "Smartphones, laptops, consolas y accesorios con 12 meses de garantía real. Envíos a todo el Perú.",
    type: "website", locale: "es_PE", siteName: "iTech Peru", url: siteUrl,
    images: [
      { url: "/og-image-square.jpg", width: 1200, height: 1200, alt: "iTech Peru — Tecnología Renovada", type: "image/jpeg" },
      { url: "/og-image.jpg", width: 1200, height: 630, alt: "iTech Peru — Tecnología Renovada", type: "image/jpeg" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "iTech Peru | Tecnología Renovada y Certificada",
    description: "Smartphones, laptops y consolas con 12 meses de garantía real. Envíos a todo el Perú.",
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
        <SanityLiveWithToken includeDrafts />
        <VisualEditing />
      </SiteConfigProvider>
    </Providers>
  );
}
'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  Instagram,
  Music,
  Phone,
  MapPin,
  Truck,
  ShieldCheck,
  CreditCard,
  MessageCircle,
  ChevronRight,
  ArrowRight,
  Sparkles,
  FileText,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ve } from '@/lib/ve';
import { useSiteConfig } from '@/contexts/SiteConfigContext';

export interface FooterProps {
  footerSettings?: {
    _id?: string;
    copyright?: string;
    brandDescription?: string;
    newsletterText?: string;
    showTrustBadges?: boolean;
    storytelling?: {
      badge?: string;
      title?: string;
      subtitle?: string;
      ctaLabel?: string;
      ctaLink?: string;
    };
    trustItems?: Array<{
      label: string;
      desc: string;
    }>;
    quickLinks?: Array<{
      label: string;
      href: string;
    }>;
    socialLinks?: Array<{
      platform: string;
      label: string;
      handle: string;
      url: string;
    }>;
  } | null;
}

// ═══════════════════════════════════════════════════════════════
// TRUST BAND — Banda de Confianza y Calidad Tech
// ═══════════════════════════════════════════════════════════════

const defaultTrustItems = [
  {
    icon: ShieldCheck,
    label: '100% Testeado',
    desc: 'Inspección técnica en 30 puntos clave',
  },
  {
    icon: Truck,
    label: 'Envíos a Todo el Perú',
    desc: 'Despacho asegurado únicamente por Shalom',
  },
  {
    icon: FileText,
    label: 'Boleta de Venta Legal',
    desc: 'Comprobante electrónico por cada compra',
  },
  {
    icon: CreditCard,
    label: 'Pago 100% Seguro',
    desc: 'BCP, Interbank, Yape, Plin y tarjetas',
  },
];

function TrustBand({ items }: { items?: Array<{ label: string; desc: string }> }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const displayItems = items && items.length > 0 ? items : defaultTrustItems;

  return (
    <div ref={ref} className="bg-[#0C101A] border-y border-zinc-800/80 relative z-10" {...ve('footerSettings', 'footerSettings', 'trustItems')}>
      <div className="max-w-[1440px] mx-auto px-5 sm:px-6 lg:px-12 xl:px-16 py-8 sm:py-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {displayItems.map((item: any, i) => {
            const Icon = defaultTrustItems[i % defaultTrustItems.length].icon;
            return (
              <motion.div
                key={item.label + i}
                initial={{ opacity: 0, y: 14 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.35, delay: i * 0.06 }}
                className="flex items-center gap-3.5 p-3.5 sm:p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-turquoise-500/30 hover:bg-white/[0.04] transition-all duration-300"
              >
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-turquoise-500/10 border border-turquoise-500/20 flex items-center justify-center flex-shrink-0 text-turquoise-400">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                    {item.label}
                  </h4>
                  <p className="text-[11px] text-zinc-400 mt-0.5 line-clamp-1 leading-snug">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// TECH STORYTELLING / BANNER — Asesoría Directa por WhatsApp
// ═══════════════════════════════════════════════════════════════

function Storytelling({ storytelling }: { storytelling?: NonNullable<FooterProps['footerSettings']>['storytelling'] }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const router = useRouter();
  const siteConfig = useSiteConfig();
  const whatsappNumber = siteConfig.whatsapp || '51907674693';

  const badge = storytelling?.badge || 'IMPORTACIÓN DIRECTA USA • ASESORÍA PERSONALIZADA';
  const title = storytelling?.title || '¿Deseas Asesoría o Buscas un Equipo Específico?';
  const subtitle = storytelling?.subtitle || 'Te enviamos fotos reales, salud de batería en vivo y resolvemos cualquier consulta al instante.';

  return (
    <div ref={ref} className="relative bg-gradient-to-b from-[#0C101A] via-[#090D16] to-[#070A10] overflow-hidden py-14 sm:py-20 border-b border-zinc-800/80">
      {/* Ambient Tech Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-turquoise-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-5 text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-turquoise-500/10 border border-turquoise-500/20 text-turquoise-400 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{badge}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight mb-4">
            {title}
          </h2>

          <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto mb-8 leading-relaxed">
            {subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('¡Hola iTech Perú! Deseo asesoría sobre los equipos disponibles.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#25D366] hover:bg-[#20BD5A] text-white px-7 py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-green-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chatear por WhatsApp (+51 907 674 693)</span>
            </a>

            <button
              onClick={() => router.push('/coleccion')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-200 border border-zinc-700/80 px-6 py-3.5 rounded-xl font-semibold text-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Ver Catálogo Completo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// FOOTER CONTENT — Modern 4-Column Tech Layout
// ═══════════════════════════════════════════════════════════════

function FooterContent({ footerSettings }: { footerSettings?: FooterProps['footerSettings'] }) {
  const currentYear = new Date().getFullYear();
  const siteConfig = useSiteConfig();
  const whatsappNumber = siteConfig.whatsapp || '51907674693';
  const instagramLink = siteConfig.social?.find(s => s.platform?.toLowerCase().includes('instagram'))?.url || 'https://instagram.com/itechperu';
  const tiktokLink = siteConfig.social?.find(s => s.platform?.toLowerCase().includes('tiktok'))?.url || 'https://tiktok.com/@itechperu';

  return (
    <footer id="footer" className="relative bg-[#070A10] text-white scroll-mt-16 pt-12 sm:pt-16 pb-10">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-6 lg:px-12 xl:px-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 pb-12 border-b border-zinc-800/60">
          
          {/* Column 1 — Brand & Trust */}
          <div className="col-span-2 sm:col-span-1">
            <Link href="/" className="inline-flex items-baseline gap-1.5 mb-4 group">
              <span className="text-2xl font-black tracking-tight text-white group-hover:text-turquoise-400 transition-colors">
                iTech
              </span>
              <span className="text-xs font-black tracking-[0.2em] text-turquoise-400 uppercase px-1.5 py-0.5 rounded bg-turquoise-500/10 border border-turquoise-500/20">
                PERÚ
              </span>
            </Link>

            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-5 max-w-xs">
              {footerSettings?.brandDescription || siteConfig.footerText || siteConfig.description || 'Especialistas en importación directa de tecnología seminueva seleccionada. Laptops, iPads y accesorios testeados en 30 puntos técnicos con boleta de venta legal y envío seguro a todo el Perú.'}
            </p>

            <div className="flex items-center gap-2">
              <a
                href={instagramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-pink-400 hover:border-pink-500/40 hover:bg-pink-500/10 transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={tiktokLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:border-zinc-500 hover:bg-zinc-800 transition-all"
                aria-label="TikTok"
              >
                <Music className="w-4 h-4" />
              </a>
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-green-400 hover:border-green-500/40 hover:bg-green-500/10 transition-all"
                aria-label="WhatsApp"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2 — Catálogo Tech */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-zinc-300 mb-4">
              Catálogo
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link href="/coleccion?categoria=laptops" className="text-zinc-400 hover:text-turquoise-400 transition-colors">
                  Laptops & MacBooks
                </Link>
              </li>
              <li>
                <Link href="/coleccion?categoria=tablets" className="text-zinc-400 hover:text-turquoise-400 transition-colors">
                  iPads & Tablets
                </Link>
              </li>
              <li>
                <Link href="/coleccion?categoria=cargadores" className="text-zinc-400 hover:text-turquoise-400 transition-colors">
                  Cargadores Originales
                </Link>
              </li>
              <li>
                <Link href="/coleccion?categoria=accesorios" className="text-zinc-400 hover:text-turquoise-400 transition-colors">
                  Accesorios y Fundas
                </Link>
              </li>
              <li>
                <Link href="/catalogo" className="text-turquoise-400 font-semibold hover:underline inline-flex items-center gap-1">
                  <span>Showroom Digital</span>
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </li>
              <li>
                <Link href="/coleccion" className="text-zinc-400 hover:text-white transition-colors">
                  Ver Todo el Inventario
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 — Información y Respaldo */}
          <div>
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-zinc-300 mb-4">
              Información
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link href="/nosotros" className="text-zinc-400 hover:text-turquoise-400 transition-colors">
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link href="/comprar" className="text-zinc-400 hover:text-turquoise-400 transition-colors">
                  Cómo Comprar y Envíos
                </Link>
              </li>
              <li>
                <Link href="/comprar" className="text-zinc-400 hover:text-turquoise-400 transition-colors">
                  Test de 30 Puntos Técnicos
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-zinc-400 hover:text-turquoise-400 transition-colors">
                  Emisión de Boleta de Venta
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-zinc-400 hover:text-turquoise-400 transition-colors">
                  Centro de Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 — Contacto Directo & Pagos */}
          <div className="col-span-2 sm:col-span-1">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-zinc-300 mb-4">
              Atención Directa
            </h4>
            <ul className="space-y-3 mb-5 text-xs sm:text-sm">
              <li>
                <a
                  href={`tel:${siteConfig.phone || '+51 907 674 693'}`}
                  className="flex items-center gap-2 text-zinc-300 hover:text-turquoise-400 transition-colors font-medium"
                >
                  <Phone className="w-4 h-4 text-turquoise-400 flex-shrink-0" />
                  <span>{siteConfig.phone || '+51 907 674 693'}</span>
                </a>
              </li>
              <li className="flex items-center gap-2 text-zinc-400 text-xs">
                <MapPin className="w-4 h-4 text-zinc-500 flex-shrink-0" />
                <span>{siteConfig.schedule || 'Lun a Sáb: 10:00 - 20:00'}</span>
              </li>
            </ul>

            {/* Payment methods badges */}
            <div>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">
                Medios de Pago Aceptados
              </p>
              <div className="flex flex-wrap gap-1.5">
                {['BCP', 'Interbank', 'Yape', 'Plin', 'Visa', 'Mastercard'].map((method) => (
                  <span
                    key={method}
                    className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300"
                  >
                    {method}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Compliance */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-zinc-500">
          <div className="flex items-center gap-2">
            <span>&copy; {currentYear} iTech Perú E.I.R.L.</span>
            <span>•</span>
            <span>Comprobante de Venta Electrónica</span>
          </div>
          <div>
            <span>Desarrollado con alto rendimiento por </span>
            <a
              href="https://www.fastpagepro.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-turquoise-400 hover:underline font-semibold"
            >
              FastPagePro
            </a>
          </div>
        </div>
      </div>

      {/* Mobile bottom safe area */}
      <div className="h-16 sm:h-0" />
    </footer>
  );
}

// ═══════════════════════════════════════════════════════════════
// EXPORTED COMPONENT
// ═══════════════════════════════════════════════════════════════

export default function Footer({ footerSettings }: FooterProps) {
  return (
    <>
      <TrustBand items={footerSettings?.trustItems} />
      <Storytelling storytelling={footerSettings?.storytelling} />
      <FooterContent footerSettings={footerSettings} />
    </>
  );
}

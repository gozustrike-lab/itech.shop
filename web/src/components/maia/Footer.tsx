'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import {
  Instagram,
  Music,
  Phone,
  MapPin,
  Heart,
  Truck,
  ShieldCheck,
  Star,
  ChevronRight,
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
// TRUST BAND — Banda de confianza CRO (2x2 mobile)
// ═══════════════════════════════════════════════════════════════

const defaultTrustIcons = [ShieldCheck, Truck, Star, ShieldCheck];

const defaultTrustItems = [
  {
    label: '100% Certificado',
    desc: 'Inspección técnica en 30 puntos',
  },
  {
    label: 'Envíos a Todo el Perú',
    desc: 'Olva Courier y Shalom',
  },
  {
    label: 'Garantía 12 Meses',
    desc: 'Respaldo técnico directo',
  },
  {
    label: 'Pago Seguro',
    desc: 'Tarjetas, Yape, Plin y transferencia',
  },
];

function TrustBand({ items }: { items?: Array<{ label: string; desc: string }> }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const displayItems = items && items.length > 0 ? items : defaultTrustItems;

  return (
    <div ref={ref} className="bg-warm-50 border-y border-warm-200/60" {...ve('footerSettings', 'footerSettings', 'trustItems')}>
      <div className="max-w-[1440px] mx-auto px-5 sm:px-6 lg:px-12 xl:px-16 py-10 sm:py-12 lg:py-14">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">
          {displayItems.map((item, i) => {
            const Icon = defaultTrustIcons[i % defaultTrustIcons.length];
            return (
              <motion.div
                key={item.label + i}
                {...ve('footerSettings', 'footerSettings', `trustItems[${i}].label`)}
                initial={{ opacity: 0, y: 16 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center text-center group cursor-pointer"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white border border-warm-200 flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:-translate-y-0.5 transition-all duration-300 mb-3">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-warm-500" />
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-deep-800 mb-0.5" {...ve('footerSettings', 'footerSettings', `trustItems[${i}].label`)}>
                  {item.label}
                </h3>
                <p className="text-[10px] sm:text-xs text-foreground/40" {...ve('footerSettings', 'footerSettings', `trustItems[${i}].desc`)}>
                  {item.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// STORYTELLING — "Tecnología que Renueva"
// ═══════════════════════════════════════════════════════════════

function Storytelling({ storytelling }: { storytelling?: NonNullable<FooterProps['footerSettings']>['storytelling'] }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const router = useRouter();

  const badge = storytelling?.badge || 'TECNOLOGÍA CERTIFICADA EN PERÚ';
  const title = storytelling?.title || 'Cada equipo iTech Peru es probado y garantizado';
  const subtitle = storytelling?.subtitle || 'Dispositivos renovados grado A con 12 meses de garantía real. Rendimiento como nuevo y hasta 40% de ahorro.';
  const ctaLabel = storytelling?.ctaLabel || 'Explorar Catálogo';
  const ctaLink = storytelling?.ctaLink || '/coleccion';

  return (
    <div ref={ref} className="relative bg-deep-800 overflow-hidden" {...ve('footerSettings', 'footerSettings', 'storytelling')}>
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-warm-400/40 to-transparent" />

      <div className="relative max-w-[1440px] mx-auto px-5 sm:px-6 lg:px-12 xl:px-16 py-16 sm:py-20 lg:py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl mx-auto"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-8 h-px bg-warm-400/40" />
            <div className="w-1.5 h-1.5 rotate-45 border border-warm-400/60" />
            <div className="w-8 h-px bg-warm-400/40" />
          </div>

          <p
            {...ve('footerSettings', 'footerSettings', 'storytelling.badge')}
            className="text-[11px] sm:text-xs font-semibold tracking-[0.25em] uppercase text-warm-400 mb-4 cursor-pointer"
          >
            {badge}
          </p>

          <h2
            {...ve('footerSettings', 'footerSettings', 'storytelling.title')}
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight mb-5 cursor-pointer"
          >
            {title}
          </h2>

          <p
            {...ve('footerSettings', 'footerSettings', 'storytelling.subtitle')}
            className="text-sm sm:text-base text-white/50 leading-relaxed mb-8 max-w-lg mx-auto cursor-pointer"
          >
            {subtitle}
          </p>

          <motion.button
            {...ve('footerSettings', 'footerSettings', 'storytelling.ctaLabel')}
            onClick={() => router.push(ctaLink)}
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-warm-400 hover:bg-warm-500 text-deep-800 px-7 sm:px-8 py-3.5 rounded-full text-sm font-bold shadow-lg shadow-warm-500/20 hover:shadow-warm-500/30 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
          >
            {ctaLabel}
            <ChevronRight className="w-4 h-4" />
          </motion.button>

          <div className="flex items-center justify-center gap-3 mt-10">
            <div className="w-12 h-px bg-warm-400/20" />
            <div className="w-1.5 h-1.5 rotate-45 border border-warm-400/30" />
            <div className="w-12 h-px bg-warm-400/20" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// FOOTER — Premium 4-column layout
// ═══════════════════════════════════════════════════════════════

function FooterContent({ footerSettings }: { footerSettings?: FooterProps['footerSettings'] }) {
  const currentYear = new Date().getFullYear();
  const siteConfig = useSiteConfig();
  const whatsappNumber = siteConfig.whatsapp || '51999888777';
  const instagramLink = siteConfig.social?.find(s => s.platform?.toLowerCase().includes('instagram'))?.url || 'https://instagram.com/itechperu';
  const tiktokLink = siteConfig.social?.find(s => s.platform?.toLowerCase().includes('tiktok'))?.url || 'https://tiktok.com/@itechperu';

  return (
    <footer id="footer" className="relative bg-deep-900 text-white scroll-mt-16">
      <div className="absolute top-0 left-0 right-0 overflow-hidden leading-[0]">
        <svg
          className="relative block w-full h-[60px] sm:h-[80px] lg:h-[100px]"
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
          fill="none"
        >
          <path
            d="M0,60 C240,100 480,20 720,60 C960,100 1200,20 1440,60 L1440,100 L0,100 Z"
            fill="#043f4a"
          />
          <path
            d="M0,70 C360,90 720,40 1080,70 C1260,85 1380,55 1440,70 L1440,100 L0,100 Z"
            fill="#032e36"
            opacity="0.5"
          />
        </svg>
      </div>

      <div className="relative max-w-[1440px] mx-auto px-5 sm:px-6 lg:px-12 xl:px-16 pt-16 sm:pt-20 lg:pt-24 pb-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 mb-12 sm:mb-14">
          {/* Column 1 — Brand */}
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="mb-4 block group">
              <span className="text-2xl font-extrabold text-white group-hover:text-warm-400 transition-colors duration-300">iTech</span>
              <span className="text-2xl font-extralight tracking-[0.2em] text-warm-400 ml-1.5 group-hover:text-warm-300 transition-colors duration-300">PERU</span>
            </Link>
            <p className="text-white/40 text-sm leading-relaxed mb-6 max-w-xs" {...ve('siteSettings', 'siteSettings', 'footerText')}>
              {siteConfig.footerText || siteConfig.description || 'Compra inteligente: tecnología de segunda mano verificada por técnicos, con garantía escrita y envío seguro a todo el Perú.'}
            </p>
            {/* Social Icons */}
            <div className="flex gap-2.5">
              {[
                { icon: Instagram, href: instagramLink, hoverBg: 'hover:bg-pink-500/20 hover:text-pink-300', label: 'Instagram' },
                { icon: Music, href: tiktokLink, hoverBg: 'hover:bg-slate-400/20 hover:text-slate-300', label: 'TikTok' },
                { icon: Phone, href: `https://wa.me/${whatsappNumber}`, hoverBg: 'hover:bg-green-500/20 hover:text-green-300', label: 'WhatsApp' },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-white/50 ${social.hoverBg} hover:border-white/10 transition-all duration-300 hover:-translate-y-0.5`}
                  aria-label={social.label}
                >
                  <social.icon className="w-[18px] h-[18px]" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2 — Tienda */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-warm-400/80 mb-4">Catálogo</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Smartphones', href: '/coleccion?categoria=smartphones' },
                { label: 'Laptops', href: '/coleccion?categoria=laptops' },
                { label: 'Tablets', href: '/coleccion?categoria=tablets' },
                { label: 'Gaming', href: '/coleccion?categoria=gaming' },
                { label: 'Audio', href: '/coleccion?categoria=audio' },
                { label: 'Accesorios', href: '/coleccion?categoria=accesorios' },
                { label: 'Ver Todo', href: '/coleccion' },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/40 hover:text-warm-400 transition-colors duration-300 inline-flex items-center gap-1 group"
                  >
                    <span className="w-0 group-hover:w-2 h-px bg-warm-400 transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Informacion */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-warm-400/80 mb-4">Informacion</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Nosotros', href: '/nosotros' },
                { label: 'Envios', href: '/comprar' },
                { label: 'Contacto', href: '/contacto' },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/40 hover:text-warm-400 transition-colors duration-300 inline-flex items-center gap-1 group"
                  >
                    <span className="w-0 group-hover:w-2 h-px bg-warm-400 transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — Contacto */}
          <div className="col-span-2 sm:col-span-1">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-warm-400/80 mb-4">Contacto</h4>
            <ul className="space-y-3 mb-6">
              <li>
                <a
                  href={`tel:${siteConfig.phone || '+51906431630'}`}
                  className="flex items-center gap-2.5 text-sm text-white/40 hover:text-warm-400 transition-colors duration-300"
                >
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  {siteConfig.phone || '+51 906 431 630'}
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-white/40">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                {siteConfig.schedule || 'Lun a Sáb: 10:00 - 20:00'}
              </li>
            </ul>
            {/* WhatsApp quick action */}
            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hola iTech Peru! Quisiera hacer una consulta')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366]/10 border border-[#25D366]/20 hover:bg-[#25D366]/20 text-[#25D366] px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 hover:-translate-y-0.5"
            >
              <Phone className="w-3.5 h-3.5" />
              Escribenos
            </a>
          </div>
        </div>

        {/* Bottom credits bar */}
        <div className="pt-6 border-t border-white/5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[11px] text-white/25 text-center sm:text-left" {...ve('footerSettings', 'footerSettings', 'copyright')}>
              &copy; {currentYear} iTech Peru. Todos los derechos reservados.
            </p>
            {/* HARDCODED FastPagePro Credit (NEVER in CMS) */}
            <p className="text-[11px] text-white/25 text-center sm:text-right">
              Desarrollado por{' '}
              <a
                href="https://www.fastpagepro.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#c9a86c] hover:text-warm-300 transition-colors font-semibold"
              >
                FastPagePro
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Mobile bottom safe area for BottomAppBar */}
      <div className="h-20 sm:h-0" />
    </footer>
  );
}

// ═══════════════════════════════════════════════════════════════
// EXPORTED FOOTER — Composite of all sections
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

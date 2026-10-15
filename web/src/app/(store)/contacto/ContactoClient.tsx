'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Instagram, Phone, ChevronRight, MapPin } from 'lucide-react';
import { ve } from '@/lib/ve';

// TikTok SVG icon (Lucide doesn't have TikTok)
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  );
}
import { testimonials } from '@/lib/store-data';
import InfiniteMarquee from '@/components/maia/InfiniteMarquee';

interface ContactPageData {
  _id?: string;
  title?: string;
  subtitle?: string;
  contactInfo?: Array<{ label: string; value: string; icon?: string; url?: string }>;
  ctaTitle?: string;
  ctaDescription?: string;
}

import { useSiteConfig } from '@/contexts/SiteConfigContext';

export default function ContactoClient({ data }: { data?: ContactPageData | null }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-60px' });
  const siteConfig = useSiteConfig();

  const title = data?.title || 'Contactanos';
  const subtitle = data?.subtitle || 'Estamos Aqui Para Ti';
  const whatsappNum = siteConfig.whatsapp || '51999888777';
  const phoneNum = siteConfig.phone || '+51906431630';
  const scheduleText = siteConfig.schedule || 'Lun a Sáb: 10:00 - 20:00';
  const instagramLink = siteConfig.social?.find(s => s.platform?.toLowerCase().includes('instagram'))?.url || 'https://instagram.com/itechperu';
  const tiktokLink = siteConfig.social?.find(s => s.platform?.toLowerCase().includes('tiktok'))?.url || 'https://tiktok.com/@itechperu';

  return (
    <div ref={sectionRef} className="relative pt-20 pb-20 sm:pb-24">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
        {/* Page Header */}
        <div className="text-center mb-10 pt-4">
          <motion.span initial={{ opacity: 0, y: 15 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="text-xs font-semibold tracking-[0.2em] uppercase text-turquoise-600 mb-3 block" {...ve('contactPage', 'contactPage', 'title')}>
            {title}
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 15 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.05 }} className="text-3xl sm:text-4xl font-bold text-foreground mb-3" {...ve('contactPage', 'contactPage', 'subtitle')}>
            {subtitle}
          </motion.h1>
          <div className="section-divider mx-auto mt-5" />
        </div>

        {/* Breadcrumb */}
        <motion.nav initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ duration: 0.3 }} className="flex items-center justify-center gap-1.5 text-xs text-foreground/40 mb-10">
          <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground/60 font-medium">Contacto</span>
        </motion.nav>

        {/* Contact Cards */}
        <div className="grid sm:grid-cols-4 gap-4 lg:gap-6 mb-16 sm:mb-20">
          {[
            { icon: Phone, title: 'WhatsApp', detail: `+${whatsappNum}`, desc: `Atención: ${scheduleText}`, href: `https://wa.me/${whatsappNum}?text=Hola%20iTech%20Peru!`, color: 'bg-green-50 border-green-100', veField: 'whatsapp' },
            { icon: Phone, title: 'Teléfono', detail: phoneNum, desc: 'Llamadas y consultas directas de 10am a 8pm.', href: `tel:${phoneNum}`, color: 'bg-blue-50 border-blue-100', veField: 'phone' },
            { icon: Instagram, title: 'Instagram', detail: '@itechperu', desc: 'Síguenos para nuevos lanzamientos y ofertas.', href: instagramLink, color: 'bg-pink-50 border-pink-100', veField: 'social' },
            { icon: TikTokIcon, title: 'TikTok', detail: '@itechperu', desc: 'Nuestra red oficial: reviews y unboxings.', href: tiktokLink, color: 'bg-slate-50 border-slate-100', veField: 'social' },
          ].map((card, i) => (
            <motion.a
              key={card.title}
              href={card.href}
              target={card.href.startsWith('http') ? '_blank' : undefined}
              rel={card.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.15 + i * 0.08 }}
              whileHover={{ y: -3 }}
              className={`p-5 lg:p-6 rounded-2xl border ${card.color} transition-all duration-500 hover:shadow-xl group`}
              {...ve('siteSettings', 'siteSettings', card.veField)}
            >
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center mb-3 shadow-sm">
                <card.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-base font-bold text-foreground mb-0.5">{card.title}</h3>
              <p className="text-sm font-semibold text-primary mb-1">{card.detail}</p>
              <p className="text-xs text-foreground/50">{card.desc}</p>
            </motion.a>
          ))}
        </div>

        {/* Testimonials — Infinite Marquee */}
        <div id="contacto-testimonios" className="mb-16 sm:mb-20 scroll-mt-16">
          <div className="text-center mb-10">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-3">
              Lo que Dicen <span className="text-gradient-turquoise">Nuestros Clientes</span>
            </h2>
            <div className="section-divider mx-auto" />
          </div>

          <InfiniteMarquee speed={38} className="mb-5">
            {testimonials.slice(0, 6).map((t, i) => (
              <div key={`c-${i}`} className="flex-shrink-0 w-[320px] sm:w-[360px] p-5 rounded-2xl bg-zinc-50/60 border border-zinc-100/60 backdrop-blur-sm hover:bg-white/80 transition-all duration-500">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <svg key={j} className="w-3.5 h-3.5 text-amber-400 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" /></svg>
                  ))}
                </div>
                <p className="text-xs text-foreground/60 leading-relaxed mb-3 line-clamp-3">{t.text}</p>
                <div className="flex items-center gap-2 pt-3 border-t border-zinc-100">
                  <div className="w-8 h-8 rounded-full bg-turquoise-100 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-turquoise-700">{t.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">{t.name}</p>
                    <p className="text-[10px] text-foreground/40 flex items-center gap-0.5">
                      <MapPin className="w-3 h-3" /> {t.location}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </InfiniteMarquee>
        </div>

        {/* CTA Banner */}
        <motion.div id="contacto-cta" initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.3 }} className="relative rounded-2xl overflow-hidden scroll-mt-16">
          <div className="absolute inset-0">
            <Image src="/images/collection.jpg" alt="Tecnología renovada garantizada" fill className="object-cover" sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-r from-turquoise-900/90 to-turquoise-700/80" />
          </div>
          <div className="relative z-10 px-6 sm:px-12 py-14 sm:py-16 text-center">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3" {...ve('contactPage', 'contactPage', 'ctaTitle')}>¿Listo para Renovar tu Equipo?</h3>
            <p className="text-sm text-turquoise-100/90 max-w-md mx-auto mb-6" {...ve('contactPage', 'contactPage', 'ctaDescription')}>
              Encuentra el dispositivo ideal con la mejor tecnología y garantía. Contáctanos hoy y recibe asesoría técnica especializada.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a href={`https://wa.me/${whatsappNum}?text=Hola%20iTech%20Peru!`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-white text-primary px-6 py-3 rounded-full text-sm font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <Phone className="w-4 h-4" /> Escribir por WhatsApp
              </a>
              <a href="https://instagram.com/itechperu" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white px-6 py-3 rounded-full text-sm font-semibold border border-white/25 hover:bg-white/25 transition-all duration-300">
                <Instagram className="w-4 h-4" /> Seguir en Instagram
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
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
import { testimonials as fallbackTestimonials } from '@/lib/store-data';
import InfiniteMarquee from '@/components/maia/InfiniteMarquee';
import { useSiteConfig } from '@/contexts/SiteConfigContext';

interface ContactPageData {
  _id?: string;
  title?: string;
  subtitle?: string;
  contactInfo?: Array<{ label: string; value: string; desc?: string; icon?: string; url?: string }>;
  ctaTitle?: string;
  ctaDescription?: string;
  ctaImage?: string | null;
  ctaButtons?: Array<{ label: string; url: string; type?: string }>;
}

const cardColors = [
  'bg-green-50 border-green-100',
  'bg-blue-50 border-blue-100',
  'bg-pink-50 border-pink-100',
  'bg-slate-50 border-slate-100',
];

export default function ContactoClient({
  data,
  sanityTestimonials = [],
}: {
  data?: ContactPageData | null;
  sanityTestimonials?: any[];
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-60px' });
  const siteConfig = useSiteConfig();

  const title = data?.title || 'Contáctanos';
  const subtitle = data?.subtitle || 'Estamos Aquí Para Ti';
  const whatsappNum = siteConfig.whatsapp || '51999888777';
  const phoneNum = siteConfig.phone || '+51 906 431 630';
  const scheduleText = siteConfig.schedule || 'Lun a Sáb: 10:00 - 20:00';
  const instagramLink = siteConfig.social?.find(s => s.platform?.toLowerCase().includes('instagram'))?.url || 'https://instagram.com/itechperu';
  const tiktokLink = siteConfig.social?.find(s => s.platform?.toLowerCase().includes('tiktok'))?.url || 'https://tiktok.com/@itechperu';

  const defaultContactCards = [
    { label: 'WhatsApp', value: `+${whatsappNum}`, desc: `Atención: ${scheduleText}`, url: `https://wa.me/${whatsappNum}?text=Hola%20iTech%20Peru!` },
    { label: 'Teléfono', value: phoneNum, desc: 'Llamadas y consultas directas de 10am a 8pm.', url: `tel:${phoneNum}` },
    { label: 'Instagram', value: '@itechperu', desc: 'Síguenos para nuevos lanzamientos y ofertas.', url: instagramLink },
    { label: 'TikTok', value: '@itechperu', desc: 'Nuestra red oficial: reviews y unboxings.', url: tiktokLink },
  ];

  const contactCards = data?.contactInfo && data.contactInfo.length > 0
    ? data.contactInfo.map((c, i) => ({
        label: c.label,
        value: c.value,
        desc: c.desc || defaultContactCards[i]?.desc || '',
        url: c.url || defaultContactCards[i]?.url || '#',
      }))
    : defaultContactCards;

  const ctaTitle = data?.ctaTitle || '¿Listo para Renovar tu Equipo?';
  const ctaDescription = data?.ctaDescription || 'Encuentra el dispositivo ideal con la mejor tecnología y garantía. Contáctanos hoy y recibe asesoría técnica especializada.';
  const ctaButtons = data?.ctaButtons && data.ctaButtons.length > 0
    ? data.ctaButtons
    : [
        { label: 'Escribir por WhatsApp', url: `https://wa.me/${whatsappNum}?text=Hola%20iTech%20Peru!`, type: 'primary' },
        { label: 'Seguir en Instagram', url: instagramLink, type: 'secondary' },
      ];

  const displayTestimonials = sanityTestimonials.length > 0
    ? sanityTestimonials.map((t: any) => ({
        _id: t._id,
        name: t.authorName || '',
        location: t.company || t.authorRole || 'Perú',
        rating: t.rating || 5,
        text: typeof t.quote === 'string' ? t.quote : Array.isArray(t.quote) ? t.quote.map((b: any) => b.children?.map((c: any) => c.text).join('') || '').join(' ') : '',
      }))
    : fallbackTestimonials.map((t, idx) => ({
        _id: `fallback-${idx}`,
        name: t.name,
        location: t.location,
        rating: t.rating,
        text: t.text,
      }));

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
        <div className="grid sm:grid-cols-4 gap-4 lg:gap-6 mb-16 sm:mb-20" {...ve('contactPage', 'contactPage', 'contactInfo')}>
          {contactCards.map((card, i) => {
            const lowerLabel = card.label.toLowerCase();
            const CardIcon = lowerLabel.includes('instagram')
              ? Instagram
              : lowerLabel.includes('tiktok')
                ? TikTokIcon
                : Phone;
            const colorClass = cardColors[i % cardColors.length];
            return (
              <motion.a
                key={card.label + i}
                href={card.url}
                target={card.url.startsWith('http') ? '_blank' : undefined}
                rel={card.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.15 + i * 0.08 }}
                whileHover={{ y: -3 }}
                className={`p-5 lg:p-6 rounded-2xl border ${colorClass} transition-all duration-500 hover:shadow-xl group`}
                {...ve('contactPage', 'contactPage', `contactInfo[${i}].label`)}
              >
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center mb-3 shadow-sm">
                  <CardIcon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-base font-bold text-foreground mb-0.5" {...ve('contactPage', 'contactPage', `contactInfo[${i}].label`)}>{card.label}</h3>
                <p className="text-sm font-semibold text-primary mb-1" {...ve('contactPage', 'contactPage', `contactInfo[${i}].value`)}>{card.value}</p>
                <p className="text-xs text-foreground/50" {...ve('contactPage', 'contactPage', `contactInfo[${i}].desc`)}>{card.desc}</p>
              </motion.a>
            );
          })}
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
            {displayTestimonials.slice(0, 6).map((t, i) => (
              <div
                key={`c-${t._id}-${i}`}
                {...(t._id.startsWith('fallback-') ? {} : ve(t._id, 'testimonial', 'quote'))}
                className="flex-shrink-0 w-[320px] sm:w-[360px] p-5 rounded-2xl bg-zinc-50/60 border border-zinc-100/60 backdrop-blur-sm hover:bg-white/80 transition-all duration-500"
              >
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
                    <p {...(t._id.startsWith('fallback-') ? {} : ve(t._id, 'testimonial', 'authorName'))} className="text-xs font-semibold text-foreground">{t.name}</p>
                    <p {...(t._id.startsWith('fallback-') ? {} : ve(t._id, 'testimonial', 'company'))} className="text-[10px] text-foreground/40 flex items-center gap-0.5">
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
          <div className="absolute inset-0" {...ve('contactPage', 'contactPage', 'ctaImage')}>
            <Image src={data?.ctaImage || '/images/collection.jpg'} alt="Tecnología renovada garantizada" fill className="object-cover" sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-r from-turquoise-900/90 to-turquoise-700/80" />
          </div>
          <div className="relative z-10 px-6 sm:px-12 py-14 sm:py-16 text-center">
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3" {...ve('contactPage', 'contactPage', 'ctaTitle')}>
              {ctaTitle}
            </h3>
            <p className="text-sm text-turquoise-100/90 max-w-md mx-auto mb-6" {...ve('contactPage', 'contactPage', 'ctaDescription')}>
              {ctaDescription}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3" {...ve('contactPage', 'contactPage', 'ctaButtons')}>
              {ctaButtons.map((btn, i) => {
                const isPrimary = btn.type !== 'secondary';
                const BtnIcon = btn.label.toLowerCase().includes('instagram') ? Instagram : Phone;
                return (
                  <a
                    key={btn.label + i}
                    href={btn.url}
                    target={btn.url.startsWith('http') ? '_blank' : undefined}
                    rel={btn.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                    {...ve('contactPage', 'contactPage', `ctaButtons[${i}].label`)}
                    className={
                      isPrimary
                        ? 'inline-flex items-center gap-2 bg-white text-primary px-6 py-3 rounded-full text-sm font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105'
                        : 'inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white px-6 py-3 rounded-full text-sm font-semibold border border-white/25 hover:bg-white/25 transition-all duration-300'
                    }
                  >
                    <BtnIcon className="w-4 h-4" /> {btn.label}
                  </a>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
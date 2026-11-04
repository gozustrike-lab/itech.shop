'use client';

import ShalomTrackingModule from '@/components/ShalomTrackingModule';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { Instagram, Phone, ChevronRight, MapPin, Sparkles, MessageCircle, Clock, ShieldCheck, Truck } from 'lucide-react';
import { ve } from '@/lib/ve';
import { useSiteConfig } from '@/contexts/SiteConfigContext';

// TikTok SVG icon
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  );
}

interface ContactPageData {
  _id?: string;
  title?: string;
  subtitle?: string;
  contactInfo?: Array<{ label: string; value: string; icon?: string; url?: string }>;
  ctaTitle?: string;
  ctaDescription?: string;
}

export default function ContactoClient({ data }: { data?: ContactPageData | null }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-60px' });
  const siteConfig = useSiteConfig();

  const title = data?.title || 'ATENCIÓN AL CLIENTE';
  const subtitle = data?.subtitle || 'Canales Oficiales iTech Perú';
  const whatsappNum = siteConfig.whatsapp || '51907674693';
  const phoneNum = siteConfig.phone || '+51 907 674 693';
  const scheduleText = siteConfig.schedule || 'Lunes a Sábado: 9:00 AM - 8:00 PM';
  const instagramLink = siteConfig.social?.find(s => s.platform?.toLowerCase().includes('instagram'))?.url || 'https://instagram.com/itechperu';
  const tiktokLink = siteConfig.social?.find(s => s.platform?.toLowerCase().includes('tiktok'))?.url || 'https://tiktok.com/@itechperuu';

  return (
    <div ref={sectionRef} className="relative pt-24 pb-24 sm:pb-28">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-1.5 text-xs text-zinc-400 mb-6"
        >
          <Link href="/" className="hover:text-zinc-900 transition-colors">Inicio</Link>
          <ChevronRight className="w-3 h-3 text-zinc-300" />
          <span className="text-zinc-700 font-semibold">Contacto</span>
        </motion.nav>

        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 text-[11px] font-bold tracking-[0.16em] uppercase text-zinc-600 mb-3"
            {...ve('contactPage', 'contactPage', 'title')}
          >
            <Sparkles className="w-3 h-3 text-turquoise-600" />
            <span>{title}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black text-zinc-900 tracking-tight leading-tight mb-4"
            {...ve('contactPage', 'contactPage', 'subtitle')}
          >
            {subtitle}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-sm sm:text-base text-zinc-500 max-w-lg mx-auto leading-relaxed"
          >
            ¿Tienes alguna consulta técnica, deseas verificar stock en vivo o rastrear tu envío? Estamos listos para atenderte.
          </motion.p>
          <div className="w-12 h-1 bg-zinc-900 mx-auto rounded-full mt-6" />
        </div>

        {/* ═══ 4 Symmetrical Contact Cards ═══ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {[
            {
              icon: MessageCircle,
              title: 'WhatsApp Oficial',
              detail: `+${whatsappNum}`,
              desc: `Respuesta rápida. ${scheduleText}`,
              href: `https://wa.me/${whatsappNum}?text=Hola%20iTech%20Perú!%20Deseo%20consultar%20por%20un%20equipo.`,
              badge: 'Canal Principal',
              badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
              cta: 'Escribir por WhatsApp →',
            },
            {
              icon: TikTokIcon,
              title: 'TikTok Live',
              detail: '@itechperuu',
              desc: 'Transmisiones en vivo, precios especiales y demostraciones técnicas.',
              href: tiktokLink,
              badge: 'En Vivo',
              badgeColor: 'bg-zinc-900 text-white border-zinc-800',
              cta: 'Ver en TikTok →',
            },
            {
              icon: Instagram,
              title: 'Instagram',
              detail: '@itechperuu',
              desc: 'Unboxings de lotes de importación, fotos de stock y novedades.',
              href: instagramLink,
              badge: 'Comunidad',
              badgeColor: 'bg-pink-50 text-pink-700 border-pink-200',
              cta: 'Seguir en Instagram →',
            },
            {
              icon: Truck,
              title: 'Envíos Nacionales',
              detail: 'Agencias Shalom',
              desc: 'Despachos diarios a Lima y todas las provincias del Perú.',
              href: '/comprar',
              badge: 'Cobertura 100%',
              badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
              cta: 'Ver Envíos Shalom →',
            },
          ].map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.15 + i * 0.06 }}
              className="group rounded-3xl bg-[#F8F9FA] border border-zinc-200/70 p-6 flex flex-col justify-between hover:bg-white hover:border-zinc-300 hover:shadow-xl transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-zinc-200/80 shadow-sm flex items-center justify-center group-hover:scale-105 transition-transform">
                    <card.icon className="w-6 h-6 text-zinc-900" />
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${card.badgeColor}`}>
                    {card.badge}
                  </span>
                </div>

                <h3 className="text-base font-bold text-zinc-900 mb-1">{card.title}</h3>
                <p className="text-sm font-black text-zinc-800 tracking-tight mb-2">{card.detail}</p>
                <p className="text-xs text-zinc-500 leading-relaxed mb-6">{card.desc}</p>
              </div>

              <div className="pt-3 border-t border-zinc-200/60">
                <a
                  href={card.href}
                  target={card.href.startsWith('http') ? '_blank' : undefined}
                  rel={card.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="w-full inline-flex items-center justify-between text-xs font-bold text-zinc-900 hover:text-turquoise-700 transition-colors"
                >
                  <span>{card.cta}</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ═══ Módulo Interactivo de Seguimiento Shalom Oficial ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-16"
        >
          <ShalomTrackingModule />
        </motion.div>

        {/* ═══ Customer Assurance Strip ═══ */}
        <div className="rounded-3xl bg-[#090D16] border border-zinc-800 p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden text-center mb-16">
          <div className="max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-turquoise-300 mb-4">
              <ShieldCheck className="w-4 h-4" />
              Compromiso iTech Perú
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
              ¿Listo para Renovar tu Equipo?
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mb-6">
              Todos nuestros dispositivos pasan por 30 puntos de inspección técnica especializada y se entregan con Boleta de Venta electrónica.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={`https://wa.me/${whatsappNum}?text=Hola%20iTech%20Perú!%20Deseo%20asesoría%20para%20elegir%20mi%20equipo.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BD5A] text-white px-6 py-3 rounded-full text-xs font-bold shadow-lg transition-all hover:scale-105 active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Consultar por WhatsApp</span>
              </a>
              <Link
                href="/coleccion"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 py-3 rounded-full text-xs font-bold transition-all"
              >
                <span>Explorar Catálogo</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

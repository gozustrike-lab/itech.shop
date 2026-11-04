'use client';

import ShalomTrackingModule from '@/components/ShalomTrackingModule';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ve } from '@/lib/ve';
import Link from 'next/link';
import {
  MessageCircle,
  Landmark,
  QrCode,
  Building2,
  ShieldCheck,
  Truck,
  ChevronRight,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { paymentMethods } from '@/lib/store-data';
import { useSiteConfig } from '@/contexts/SiteConfigContext';

const iconMap: Record<string, React.ElementType> = {
  'whatsapp': MessageCircle,
  'yape-plin': QrCode,
  'bcp': Building2,
  'transferencia': Building2,
  'interbancaria': Landmark,
};

interface HowToBuyData {
  _id?: string;
  title?: string;
  subtitle?: string;
  shippingInfo?: string;
  steps?: Array<{ stepNumber?: number; icon?: string; title: string; description: string }>;
  paymentMethods?: Array<{ name: string; description: string; icon?: string }>;
}

export default function ComprarPage({ data }: { data?: HowToBuyData | null }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-60px' });
  const siteConfig = useSiteConfig();
  const whatsappNum = siteConfig.whatsapp || '51907674693';

  const title = data?.title || 'MÉTODOS DE PAGO Y RESERVAS';
  const subtitle = data?.subtitle || 'Cómo Comprar en iTech Perú';
  const shippingInfo = data?.shippingInfo || 'Compra transparente y segura. Todos nuestros equipos incluyen Boleta de Venta y despacho asegurado por Shalom.';

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
          <span className="text-zinc-700 font-semibold">Cómo Comprar</span>
        </motion.nav>

        {/* Clean Editorial Header (Symmetrical & Premium) */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 text-[11px] font-bold tracking-[0.16em] uppercase text-zinc-600 mb-3"
            {...ve('howToBuyPage', 'howToBuyPage', 'title')}
          >
            <Sparkles className="w-3 h-3 text-turquoise-600" />
            <span>{title}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="text-3xl sm:text-4xl md:text-5xl font-black text-zinc-900 tracking-tight leading-tight mb-4"
            {...ve('howToBuyPage', 'howToBuyPage', 'subtitle')}
          >
            {subtitle}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-sm sm:text-base text-zinc-500 max-w-xl mx-auto leading-relaxed"
            {...ve('howToBuyPage', 'howToBuyPage', 'shippingInfo')}
          >
            {shippingInfo}
          </motion.p>
          <div className="w-12 h-1 bg-zinc-900 mx-auto rounded-full mt-6" />
        </div>

        {/* ═══ Symmetrical Live Reservation Banner ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mb-14 rounded-3xl bg-[#090D16] border border-zinc-800/80 p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden"
        >
          {/* Subtle ambient tech glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-turquoise-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-black uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                Precios Exclusivos de Live
              </div>
              <span className="text-xs text-zinc-400 font-medium">
                TikTok Live • Promociones en tiempo real
              </span>
            </div>

            <div className="max-w-2xl mb-8">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
                ¿Cómo asegurar tu equipo y congelar la oferta?
              </h2>
              <p className="text-sm text-zinc-300 leading-relaxed">
                Para garantizar que la unidad se reserve a tu nombre con el precio especial anunciado en transmisión:
              </p>
            </div>

            {/* Symmetrical 2-Column Split: Lima vs Provincias */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
              {/* Lima Metropolitana */}
              <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-5 sm:p-6 flex flex-col justify-between hover:bg-white/[0.06] transition-colors">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold text-turquoise-300 tracking-wide uppercase flex items-center gap-1.5">
                      📍 Lima Metropolitana
                    </span>
                    <span className="text-lg font-black text-white px-3 py-1 rounded-xl bg-turquoise-500/20 border border-turquoise-500/40">
                      S/ 50
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mb-4">
                    Separas tu unidad con <strong>S/ 50</strong>. El saldo pendiente se cancela contraentrega o previo a la entrega coordinada.
                  </p>
                </div>
                <div className="pt-3 border-t border-white/10 flex items-center gap-2 text-xs text-zinc-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Entrega rápida y verificación técnica in-situ</span>
                </div>
              </div>

              {/* Provincias */}
              <div className="rounded-2xl bg-white/[0.04] border border-white/10 p-5 sm:p-6 flex flex-col justify-between hover:bg-white/[0.06] transition-colors">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold text-amber-300 tracking-wide uppercase flex items-center gap-1.5">
                      📦 Provincias (Todo el Perú)
                    </span>
                    <span className="text-lg font-black text-white px-3 py-1 rounded-xl bg-amber-500/20 border border-amber-500/40">
                      S/ 100
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mb-4">
                    Separas tu equipo con <strong>S/ 100</strong>. El saldo se cancela para despachar de inmediato tu paquete por Shalom.
                  </p>
                </div>
                <div className="pt-3 border-t border-white/10 flex items-center gap-2 text-xs text-zinc-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Foto del empaque y número de guía Shalom en tiempo real</span>
                </div>
              </div>
            </div>

            {/* Shalom Guarantee Banner */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-300">
              <div className="flex items-center gap-2.5">
                <Truck className="w-4 h-4 text-turquoise-400 flex-shrink-0" />
                <span>
                  Despachos a todo el país realizados <strong>únicamente a través de Shalom</strong> con número de guía oficial.
                </span>
              </div>
              <a
                href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent('Hola iTech Perú! Deseo separar una laptop/iPad con el precio de TikTok Live.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="whitespace-nowrap px-4 py-2 rounded-full bg-white text-zinc-950 font-bold hover:bg-zinc-200 transition-colors shadow-sm"
              >
                Separar por WhatsApp →
              </a>
            </div>
          </div>
        </motion.div>

        {/* ═══ Módulo Interactivo de Seguimiento Shalom Oficial ═══ */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-16"
        >
          <ShalomTrackingModule />
        </motion.div>

        {/* Section Heading: Payment Methods */}
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight mb-2">
            Canales y Métodos de Pago
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 max-w-md mx-auto">
            Múltiples opciones seguras para tu comodidad con emisión inmediata de Boleta de Venta.
          </p>
        </div>

        {/* ═══ Symmetrical 2x2 Payment Methods Grid ═══ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {paymentMethods.map((method, index) => {
            const Icon = iconMap[method.id] || MessageCircle;
            return (
              <motion.div
                key={method.id}
                initial={{ opacity: 0, y: 16 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.15 + index * 0.06 }}
                className="group rounded-3xl bg-[#F8F9FA] border border-zinc-200/70 p-6 sm:p-7 flex flex-col justify-between hover:bg-white hover:border-zinc-300 hover:shadow-xl transition-all duration-300"
              >
                <div>
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-zinc-200/80 shadow-sm flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                      <Icon className="w-6 h-6 text-zinc-900" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-zinc-900 mb-1">{method.title}</h3>
                      <p className="text-xs text-zinc-500 leading-relaxed">{method.description}</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-6 pt-2">
                    {method.steps.map((step, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <div className="w-5 h-5 rounded-full bg-zinc-200 text-zinc-700 flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px] font-bold">
                          {i + 1}
                        </div>
                        <p className="text-xs text-zinc-600 leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-200/60 flex items-center justify-between">
                  <a
                    href={method.id === 'whatsapp' ? `https://wa.me/${whatsappNum}?text=${encodeURIComponent('Hola iTech Perú! Quisiera hacer un pedido')}` : method.href}
                    target={(method.id === 'whatsapp' || method.href.startsWith('http')) ? '_blank' : undefined}
                    rel={(method.id === 'whatsapp' || method.href.startsWith('http')) ? 'noopener noreferrer' : undefined}
                    className="w-full inline-flex items-center justify-center gap-2 bg-zinc-900 hover:bg-black text-white px-5 py-3 rounded-full text-xs font-bold transition-all shadow-sm hover:scale-[1.01] active:scale-[0.99]"
                  >
                    <span>{method.cta}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ═══ Symmetrical Trust Signals ═══ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-16">
          <div className="flex items-start gap-4 p-6 rounded-2xl bg-[#F8F9FA] border border-zinc-200/60">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0 border border-emerald-200">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-900 mb-1">Boleta de Venta y Transparencia</h4>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Todas las compras se formalizan con Boleta de Venta electrónica, detalle de número de serie y especificaciones del equipo.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-6 rounded-2xl bg-[#F8F9FA] border border-zinc-200/60">
            <div className="w-11 h-11 rounded-2xl bg-cyan-50 text-cyan-700 flex items-center justify-center flex-shrink-0 border border-cyan-200">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-900 mb-1">Envíos Shalom a Todo el Perú</h4>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Despachos diarios y protegidos con embalaje de alta densidad a cualquier agencia Shalom del país o a tu dirección.
              </p>
            </div>
          </div>
        </div>

        {/* ═══ FAQ ═══ */}
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 mb-2">Preguntas Frecuentes</h3>
            <div className="w-8 h-1 bg-zinc-300 mx-auto rounded-full" />
          </div>

          <div className="space-y-3">
            {[
              {
                q: '¿Cómo hago el seguimiento de mi envío por Shalom?',
                a: 'Una vez dejado el paquete en la agencia Shalom, te enviamos la fotografía de la guía de remisión oficial con el número de rastreo para que monitorees la llegada en la web o app de Shalom.'
              },
              {
                q: '¿Los equipos se entregan listos para usar?',
                a: 'Sí, todas las laptops, MacBooks e iPads vienen probados en 30 puntos técnicos, limpios, con cargador y listos para iniciar sesión.'
              },
              {
                q: '¿Puedo solicitar fotos o videos del equipo antes de separar?',
                a: '¡Por supuesto! Escríbenos al WhatsApp (+51 907 674 693) y nuestros asesores te enviarán videos en alta definición mostrando pantalla, estética y rendimiento.'
              }
            ].map((faq, i) => (
              <details
                key={i}
                className="group bg-zinc-50 border border-zinc-200/80 rounded-2xl overflow-hidden transition-colors"
              >
                <summary className="flex items-center justify-between p-4 sm:p-5 cursor-pointer text-xs sm:text-sm font-bold text-zinc-900 hover:text-turquoise-700 transition-colors">
                  <span>{faq.q}</span>
                  <ChevronRight className="w-4 h-4 text-zinc-400 group-open:rotate-90 transition-transform flex-shrink-0 ml-2" />
                </summary>
                <div className="px-5 pb-5 text-xs text-zinc-500 leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

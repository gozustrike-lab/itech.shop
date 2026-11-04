'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ve } from '@/lib/ve';
import Link from 'next/link';
import {
  MessageCircle,
  CreditCard,
  QrCode,
  Building2,
  ShieldCheck,
  Truck,
  ChevronRight,
} from 'lucide-react';
import { paymentMethods } from '@/lib/store-data';

const iconMap: Record<string, React.ElementType> = {
  'whatsapp': MessageCircle,
  'tarjeta': CreditCard,
  'yape-plin': QrCode,
  'transferencia': Building2,
};

interface HowToBuyData {
  _id?: string;
  title?: string;
  subtitle?: string;
  shippingInfo?: string;
  steps?: Array<{ stepNumber?: number; icon?: string; title: string; description: string }>;
  paymentMethods?: Array<{ name: string; description: string; icon?: string }>;
}

import { useSiteConfig } from '@/contexts/SiteConfigContext';

export default function ComprarClient({ data }: { data?: HowToBuyData | null }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-60px' });
  const siteConfig = useSiteConfig();
  const whatsappNum = siteConfig.whatsapp || '51907674693';

  const title = data?.title || 'Métodos de Pago';
  const subtitle = data?.subtitle || 'Cómo Comprar';
  const shippingInfo = data?.shippingInfo || 'Elige el método de pago que más te convenga. Todos nuestros procesos son seguros, rápidos y confiables.';

  return (
    <div ref={sectionRef} className="relative pt-20 pb-20 sm:pb-24">
      {/* Hero */}
      <div id="comprar-metodos" className="bg-primary py-12 sm:py-16 px-4 mb-10 scroll-mt-16">
        <div className="max-w-4xl mx-auto text-center">
          <motion.span initial={{ opacity: 0, y: 15 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="text-xs font-semibold tracking-[0.2em] uppercase text-turquoise-200 mb-3 block" {...ve('howToBuyPage', 'howToBuyPage', 'title')}>
            {title}
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 15 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.05 }} className="text-3xl sm:text-4xl font-bold text-white mb-3" {...ve('howToBuyPage', 'howToBuyPage', 'subtitle')}>
            {subtitle}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 15 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.1 }} className="text-sm text-turquoise-100/80 max-w-lg mx-auto" {...ve('howToBuyPage', 'howToBuyPage', 'shippingInfo')}>
            {shippingInfo}
          </motion.p>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
        {/* Breadcrumb */}
        <motion.nav initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ duration: 0.3 }} className="flex items-center gap-1.5 text-xs text-foreground/40 mb-8">
          <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground/60 font-medium">Cómo Comprar</span>
        </motion.nav>

        
        {/* Banner Reserva de Promociones Live */}
        <div className="mb-10 p-5 sm:p-7 rounded-2xl bg-gradient-to-r from-slate-900 via-zinc-900 to-turquoise-950 border border-turquoise-500/30 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-black uppercase tracking-wider mb-2.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              Precios Exclusivos de Live
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
              ¿Cómo acceder a las promociones y separar tu equipo?
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl mb-4 leading-relaxed">
              Para congelar el precio promocional y asegurar tu unidad tal como lo explicamos en nuestras transmisiones en vivo (TikTok Live):
            </p>

            <div className="grid sm:grid-cols-2 gap-3 max-w-xl mb-4">
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-turquoise-300 uppercase tracking-wide">📍 Lima Metropolitana</span>
                  <span className="text-base font-black text-white px-2 py-0.5 rounded bg-turquoise-500/20 border border-turquoise-500/30">S/ 50</span>
                </div>
                <p className="text-xs text-zinc-300 leading-snug">
                  Separas con <strong>S/ 50</strong>. El saldo se cancela contraentrega o previo a la entrega.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-wide">📦 Provincias</span>
                  <span className="text-base font-black text-white px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/30">S/ 100</span>
                </div>
                <p className="text-xs text-zinc-300 leading-snug">
                  Separas con <strong>S/ 100</strong>. El saldo se cancela para despachar tu paquete por Shalom.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <span>🚚 Envíos a todo el Perú realizados <strong>únicamente por Shalom</strong> con número de guía y seguimiento.</span>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="grid sm:grid-cols-2 gap-4 mb-14">
          {paymentMethods.map((method, index) => {
            const Icon = iconMap[method.id] || MessageCircle;
            return (
              <motion.div
                key={method.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.15 + index * 0.08 }}
                className="group p-6 rounded-2xl bg-white/60 border border-zinc-100/60 backdrop-blur-sm hover:bg-white/80 transition-all duration-500"
              >
                <div className="flex items-start gap-3 mb-5">
                  <div className="w-12 h-12 rounded-xl bg-turquoise-50 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground mb-1">{method.title}</h3>
                    <p className="text-xs text-foreground/50 leading-relaxed">{method.description}</p>
                  </div>
                </div>
                <div className="space-y-2.5 mb-5">
                  {method.steps.map((step, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <div className="w-6 h-6 rounded-full bg-turquoise-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-[10px] font-bold text-primary">{i + 1}</span>
                      </div>
                      <p className="text-xs text-foreground/60 leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
                <a
                  href={method.id === 'whatsapp' ? `https://wa.me/${whatsappNum}?text=${encodeURIComponent('Hola iTech Peru! Quisiera hacer un pedido')}` : method.href}
                  target={(method.id === 'whatsapp' || method.href.startsWith('http')) ? '_blank' : undefined}
                  rel={(method.id === 'whatsapp' || method.href.startsWith('http')) ? 'noopener noreferrer' : undefined}
                  className="inline-flex items-center gap-1.5 bg-primary hover:bg-turquoise-600 text-white px-5 py-2.5 rounded-xl text-xs font-semibold transition-colors shadow-lg shadow-turquoise-500/15"
                >
                  {method.cta}
                  <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </motion.div>
            );
          })}
        </div>

{/* Trust Signals */}
        <div className="grid sm:grid-cols-2 gap-4 mb-14">
          {[
            { icon: ShieldCheck, title: 'Pago 100% Seguro', desc: 'Todas las transacciones estan protegidas con encriptacion SSL de 256 bits y verificacion en tiempo real.' },
            { icon: Truck, title: 'Envio a Todo el Peru', desc: 'Realizamos todos nuestros envíos exclusivamente a través de Shalom a nivel nacional con retiro en agencia o despacho asegurado.' },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.4 + i * 0.08 }}
              className="flex items-start gap-3 p-5 rounded-2xl bg-turquoise-50/50 border border-turquoise-100/50"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-foreground mb-1">{item.title}</h4>
                <p className="text-xs text-foreground/50 leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* FAQ */}
        <div id="comprar-faq" className="text-center mb-8 scroll-mt-16">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-3">Preguntas Frecuentes</h2>
          <div className="section-divider mx-auto" />
        </div>
        <div className="max-w-2xl mx-auto space-y-3">
          {[
            { q: '¿Cuánto tiempo tarda el envío?', a: 'Los envíos a Lima metropolitana toman de 24 a 48 horas hábiles. A provincias, de 2 a 4 días hábiles mediante únicamente por Shalom con número de seguimiento en tiempo real.' },
            { q: '¿Cómo es el control de calidad de los equipos?', a: 'Todos nuestros dispositivos cuentan testeado en 30 puntos técnicos contra cualquier falla técnica o defecto de hardware. Si se presenta algún inconveniente, lo reparamos o reemplazamos sin costo.' },
            { q: '¿Los equipos son originales y liberados?', a: 'Sí, el 100% de nuestros equipos son originales y están liberados de fábrica para cualquier operador del Perú (Claro, Movistar, Entel, Bitel), listos para usar.' },
          ].map((faq, i) => (
            <motion.details
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.5 + i * 0.08 }}
              className="group bg-white/50 border border-zinc-100/60 rounded-xl overflow-hidden"
            >
              <summary className="flex items-center justify-between p-4 cursor-pointer text-sm font-semibold text-foreground hover:text-primary transition-colors">
                {faq.q}
                <ChevronRight className="w-4 h-4 text-turquoise-400 group-open:rotate-90 transition-transform" />
              </summary>
              <div className="px-4 pb-4 text-xs text-foreground/50 leading-relaxed">{faq.a}</div>
            </motion.details>
          ))}
        </div>
      </div>
    </div>
  );
}
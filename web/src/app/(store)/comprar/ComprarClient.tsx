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
import { paymentMethods as fallbackPaymentMethods } from '@/lib/store-data';
import { useSiteConfig } from '@/contexts/SiteConfigContext';

const defaultIcons = [MessageCircle, CreditCard, QrCode, Building2];

interface HowToBuyData {
  _id?: string;
  title?: string;
  subtitle?: string;
  shippingInfo?: string;
  whatsappNumber?: string;
  whatsappMessage?: string;
  steps?: Array<{ stepNumber?: number; icon?: string; title: string; description: string }>;
  paymentMethods?: Array<{
    name: string;
    description: string;
    icon?: string;
    steps?: string[];
    ctaLabel?: string;
    ctaLink?: string;
  }>;
  trustSignals?: Array<{ title: string; desc: string }>;
  faqs?: Array<{ q: string; a: string }>;
}

const defaultTrustSignals = [
  { title: 'Pago 100% Seguro', desc: 'Todas las transacciones están protegidas con encriptación SSL de 256 bits y verificación en tiempo real.' },
  { title: 'Envío a Todo el Perú', desc: 'Realizamos envíos a través de Olva Courier y Shalom Express a todas las ciudades del país.' },
];

const defaultFaqs = [
  { q: '¿Cuánto tiempo tarda el envío?', a: 'Los envíos a Lima metropolitana toman de 24 a 48 horas hábiles. A provincias, de 2 a 4 días hábiles mediante Olva Courier o Shalom con número de seguimiento en tiempo real.' },
  { q: '¿Cómo funciona la garantía de los equipos?', a: 'Todos nuestros dispositivos cuentan con 12 meses de garantía real contra cualquier falla técnica o defecto de hardware. Si se presenta algún inconveniente, lo reparamos o reemplazamos sin costo.' },
  { q: '¿Los equipos son originales y liberados?', a: 'Sí, el 100% de nuestros equipos son originales y están liberados de fábrica para cualquier operador del Perú (Claro, Movistar, Entel, Bitel), listos para usar.' },
];

export default function ComprarClient({ data }: { data?: HowToBuyData | null }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-60px' });
  const siteConfig = useSiteConfig();
  const whatsappNum = data?.whatsappNumber || siteConfig.whatsapp || '51999888777';
  const defaultWaMsg = data?.whatsappMessage || 'Hola iTech Peru! Quisiera hacer un pedido';

  const title = data?.title || 'Métodos de Pago';
  const subtitle = data?.subtitle || 'Cómo Comprar';
  const shippingInfo = data?.shippingInfo || 'Elige el método de pago que más te convenga. Todos nuestros procesos son seguros, rápidos y confiables.';

  const displayPaymentMethods = data?.paymentMethods && data.paymentMethods.length > 0
    ? data.paymentMethods.map((m, i) => ({
        name: m.name,
        description: m.description,
        icon: m.icon,
        steps: m.steps && m.steps.length > 0 ? m.steps : (fallbackPaymentMethods[i]?.steps || []),
        ctaLabel: m.ctaLabel || fallbackPaymentMethods[i]?.cta || 'Consultar por WhatsApp',
        ctaLink: m.ctaLink || `https://wa.me/${whatsappNum}?text=${encodeURIComponent(`${defaultWaMsg} (${m.name})`)}`,
      }))
    : fallbackPaymentMethods.map((m) => ({
        name: m.title,
        description: m.description,
        icon: undefined,
        steps: m.steps,
        ctaLabel: m.cta,
        ctaLink: `https://wa.me/${whatsappNum}?text=${encodeURIComponent(`${defaultWaMsg} (${m.title})`)}`,
      }));

  const displayTrustSignals = data?.trustSignals && data.trustSignals.length > 0 ? data.trustSignals : defaultTrustSignals;
  const displayFaqs = data?.faqs && data.faqs.length > 0 ? data.faqs : defaultFaqs;

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

        {/* Payment Methods */}
        <div className="grid sm:grid-cols-2 gap-4 mb-14" {...ve('howToBuyPage', 'howToBuyPage', 'paymentMethods')}>
          {displayPaymentMethods.map((method, index) => {
            const Icon = defaultIcons[index % defaultIcons.length];
            const href = method.ctaLink || `https://wa.me/${whatsappNum}?text=${encodeURIComponent(defaultWaMsg)}`;
            const isExternal = href.startsWith('http');
            return (
              <motion.div
                key={method.name + index}
                {...ve('howToBuyPage', 'howToBuyPage', `paymentMethods[${index}].name`)}
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
                    <h3 className="text-base font-bold text-foreground mb-1" {...ve('howToBuyPage', 'howToBuyPage', `paymentMethods[${index}].name`)}>
                      {method.name}
                    </h3>
                    <p className="text-xs text-foreground/50 leading-relaxed" {...ve('howToBuyPage', 'howToBuyPage', `paymentMethods[${index}].description`)}>
                      {method.description}
                    </p>
                  </div>
                </div>
                <div className="space-y-2.5 mb-5" {...ve('howToBuyPage', 'howToBuyPage', `paymentMethods[${index}].steps`)}>
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
                  href={href}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  {...ve('howToBuyPage', 'howToBuyPage', `paymentMethods[${index}].ctaLabel`)}
                  className="inline-flex items-center gap-1.5 bg-primary hover:bg-turquoise-600 text-white px-5 py-2.5 rounded-xl text-xs font-semibold transition-colors shadow-lg shadow-turquoise-500/15"
                >
                  {method.ctaLabel}
                  <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </motion.div>
            );
          })}
        </div>

        {/* Trust Signals */}
        <div className="grid sm:grid-cols-2 gap-4 mb-14" {...ve('howToBuyPage', 'howToBuyPage', 'trustSignals')}>
          {displayTrustSignals.map((item, i) => {
            const Icon = i % 2 === 0 ? ShieldCheck : Truck;
            return (
              <motion.div
                key={item.title + i}
                {...ve('howToBuyPage', 'howToBuyPage', `trustSignals[${i}].title`)}
                initial={{ opacity: 0, y: 15 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.4 + i * 0.08 }}
                className="flex items-start gap-3 p-5 rounded-2xl bg-turquoise-50/50 border border-turquoise-100/50"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground mb-1" {...ve('howToBuyPage', 'howToBuyPage', `trustSignals[${i}].title`)}>{item.title}</h4>
                  <p className="text-xs text-foreground/50 leading-relaxed" {...ve('howToBuyPage', 'howToBuyPage', `trustSignals[${i}].desc`)}>{item.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* FAQ */}
        <div id="comprar-faq" className="text-center mb-8 scroll-mt-16">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-3">Preguntas Frecuentes</h2>
          <div className="section-divider mx-auto" />
        </div>
        <div className="max-w-2xl mx-auto space-y-3" {...ve('howToBuyPage', 'howToBuyPage', 'faqs')}>
          {displayFaqs.map((faq, i) => (
            <motion.details
              key={i}
              {...ve('howToBuyPage', 'howToBuyPage', `faqs[${i}].q`)}
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.5 + i * 0.08 }}
              className="group bg-white/50 border border-zinc-100/60 rounded-xl overflow-hidden"
            >
              <summary className="flex items-center justify-between p-4 cursor-pointer text-sm font-semibold text-foreground hover:text-primary transition-colors">
                {faq.q}
                <ChevronRight className="w-4 h-4 text-turquoise-400 group-open:rotate-90 transition-transform" />
              </summary>
              <div className="px-4 pb-4 text-xs text-foreground/50 leading-relaxed" {...ve('howToBuyPage', 'howToBuyPage', `faqs[${i}].a`)}>{faq.a}</div>
            </motion.details>
          ))}
        </div>
      </div>
    </div>
  );
}
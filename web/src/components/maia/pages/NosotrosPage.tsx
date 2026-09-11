'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import { Heart, Gem, HandHeart, Star } from 'lucide-react';
import { ve } from '@/lib/ve';

interface FeatureItem {
  icon?: any;
  title: string;
  description: string;
}

export interface AboutPageData {
  _id?: string;
  title?: string;
  subtitle?: string;
  mainImage?: string | null;
  storyParagraphs?: any[];
  features?: FeatureItem[];
  yearsExperience?: number;
  experienceLabel?: string;
}

const defaultFeatures: FeatureItem[] = [
  { icon: '🛡️', title: 'Revisión de 30 Puntos', description: 'Protocolo de inspección técnica certificado: pantalla, cámaras, botones, parlantes, sensores y conectividad.' },
  { icon: '🔋', title: 'Baterías Certificadas', description: 'Medimos y publicamos la salud real de cada batería. Si está bajo el estándar, la reemplazamos por una nueva.' },
  { icon: '🔧', title: 'Renovación Profesional', description: 'Limpieza interna profunda, pasta térmica nueva, firmware actualizado y desbloqueo verificado.' },
  { icon: '🚚', title: 'Garantía y Envío Seguro', description: '12 meses de garantía real y envíos protegidos a todo el Perú con embalaje reforzado.' },
];

export default function NosotrosPage({ data }: { data?: AboutPageData | null }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const imageRef = useRef<HTMLDivElement>(null);

  const title = data?.title || 'Nuestra Historia';
  const subtitle = data?.subtitle || 'Tecnología que Renueva';
  const displayFeatures = data?.features && data.features.length > 0 ? data.features : defaultFeatures;
  const years = data?.yearsExperience ?? 5;
  const experienceLabel = data?.experienceLabel || 'Años de Experiencia';

  // Render story paragraphs: from Sanity if provided, otherwise default tech story
  const hasStoryBlocks = Array.isArray(data?.storyParagraphs) && data.storyParagraphs.length > 0;
  const parsedParagraphs = hasStoryBlocks
    ? data!.storyParagraphs!.map((b: any) =>
        b?.children?.map((c: any) => c.text).join('') || ''
      ).filter(Boolean)
    : [];

  return (
    <div ref={sectionRef} className="relative pt-20 pb-32 sm:pb-24 overflow-hidden">
      <div className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
        {/* Page Header */}
        <div className="text-center mb-12 pt-4">
          <motion.span initial={{ opacity: 0, y: 15 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="text-xs font-semibold tracking-[0.2em] uppercase text-turquoise-600 mb-3 block" {...ve('aboutPage', 'aboutPage', 'title')}>
            {title}
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 15 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.05 }} className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4" {...ve('aboutPage', 'aboutPage', 'subtitle')}>
            {subtitle}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 15 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.1 }} className="text-sm text-foreground/40 max-w-lg mx-auto">
            Dispositivos tecnológicos certificados y renovados con garantía real de 12 meses en todo el Perú.
          </motion.p>
          <div className="section-divider mx-auto mt-5" />
        </div>

        {/* Content Grid */}
        <div id="nosotros-historia" className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-16">
          <div ref={imageRef} className="relative">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-zinc-100">
              <Image
                src={data?.mainImage || '/images/hero-craft.jpg'}
                alt={title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                {...ve('aboutPage', 'aboutPage', 'mainImage')}
              />
            </div>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, delay: 0.3 }} className="absolute -bottom-4 -right-4 sm:right-4 bg-white rounded-xl p-4 shadow-xl border border-zinc-100/60">
              <p className="text-2xl font-bold text-primary" {...ve('aboutPage', 'aboutPage', 'yearsExperience')}>{years}+</p>
              <p className="text-[10px] text-foreground/50 font-medium" {...ve('aboutPage', 'aboutPage', 'experienceLabel')}>{experienceLabel}</p>
            </motion.div>
          </div>

          <div className="space-y-5">
            {parsedParagraphs.length > 0 ? (
              parsedParagraphs.map((p, idx) => (
                <motion.p key={idx} initial={{ opacity: 0, y: 15 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.15 + idx * 0.05 }} className="text-sm text-foreground/60 leading-relaxed" {...ve('aboutPage', 'aboutPage', 'storyParagraphs')}>
                  {p}
                </motion.p>
              ))
            ) : (
              <>
                <motion.p initial={{ opacity: 0, y: 15 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.15 }} className="text-sm text-foreground/60 leading-relaxed" {...ve('aboutPage', 'aboutPage', 'storyParagraphs')}>
                  En <strong className="text-foreground">iTech Peru</strong>, somos especialistas en tecnología renovada y certificada de alta gama. Nuestra misión es democratizar el acceso a los mejores smartphones, laptops, consolas y accesorios con calidad impecable, garantía y precios transparentes.
                </motion.p>
                <motion.p initial={{ opacity: 0, y: 15 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.2 }} className="text-sm text-foreground/60 leading-relaxed" {...ve('aboutPage', 'aboutPage', 'storyParagraphs')}>
                  Cada dispositivo atraviesa un riguroso protocolo de diagnóstico en 30 puntos clave: evaluamos salud de batería, rendimiento de CPU/GPU, pantalla original, cámaras, conectividad y estado estético para garantizar que recibas una experiencia como nueva.
                </motion.p>
                <motion.p initial={{ opacity: 0, y: 15 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.25 }} className="text-sm text-foreground/60 leading-relaxed" {...ve('aboutPage', 'aboutPage', 'storyParagraphs')}>
                  Apostamos por la economía circular y la tecnología responsable. Todos nuestros equipos cuentan con 12 meses de garantía directa y soporte postventa especializado en todo el Perú.
                </motion.p>
              </>
            )}
          </div>
        </div>

        {/* Features Grid */}
        <div id="nosotros-valores" className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 scroll-mt-16">
          {displayFeatures.map((feature, index) => {
            const isEmoji = typeof feature.icon === 'string';
            return (
              <motion.div key={feature.title || index} initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }} className="group p-5 rounded-2xl bg-white/50 border border-zinc-100/60 backdrop-blur-sm hover:bg-white/80 transition-all duration-500">
                <div className="w-12 h-12 rounded-xl bg-turquoise-50 flex items-center justify-center mb-3 group-hover:bg-turquoise-100 transition-colors duration-300 text-2xl">
                  {isEmoji ? (
                    <span>{feature.icon}</span>
                  ) : feature.icon ? (
                    <feature.icon className="w-6 h-6 text-turquoise-600" />
                  ) : (
                    <span>✨</span>
                  )}
                </div>
                <h3 className="text-sm font-bold text-foreground mb-1.5">{feature.title}</h3>
                <p className="text-xs text-foreground/50 leading-relaxed">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

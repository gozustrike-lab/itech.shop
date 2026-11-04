'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Sparkles, ShoppingBag, Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useStore } from '@/lib/store-context';
import { formatPrice } from '@/lib/store-data';
import { ve } from '@/lib/ve';
import InfiniteMarquee from '@/components/maia/InfiniteMarquee';
import { useSiteConfig } from '@/contexts/SiteConfigContext';
import ProductCardImage from '@/components/ProductCardImage';

// ─── Types ─────────────────────────────────────────────────────
export interface SanityHeroSlide {
  _id: string;
  title?: string;
  subtitle?: any;
  bgImage?: string | null;
  mobileImage?: string | null;
  ctaLabel?: string;
  ctaLink?: string;
  ctaType?: string;
  order?: number;
}

export interface SanityProduct {
  _id: string;
  slug: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  description?: string;
  longDescription?: string;
  mainImage?: string | null;
  secondaryImage?: string | null;
  gallery?: Array<{ url?: string; alt?: string }>;
  category?: { _id: string; name: string; slug: string } | null;
  color?: string;
  rating?: number;
  reviewCount?: number;
  features?: string[];
  sku?: string;
  inStock?: boolean;
  collection?: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface SanityTestimonial {
  _id: string;
  authorName: string;
  authorRole?: string;
  company?: string;
  quote?: any;
  photo?: string | null;
  rating?: number;
  featured?: boolean;
  order?: number;
  product?: { _id: string; name: string; slug: string } | null;
}

export interface HomeData {
  heroSlides: SanityHeroSlide[];
  featuredProducts: SanityProduct[];
  outOfStockProducts?: SanityProduct[];
  testimonials: SanityTestimonial[];
  useFallback: boolean;
}

// ─── Fallback hero slides (when Sanity has no heroSlides) ─────
const FALLBACK_BG = [
  '/images/hero-desktop.webp',
  '/images/hero-desktop.webp',
  '/images/hero-desktop.webp',
];
const FALLBACK_MOBILE = [
  '/images/hero-mobile.webp',
  '/images/hero-mobile.webp',
  '/images/hero-mobile.webp',
];

const FALLBACK_HERO_SLIDES: SanityHeroSlide[] = [
  {
    _id: 'fallback-hero-0',
    title: 'Tecnología Certificada a tu Alcance',
    subtitle: 'MacBooks, iPads y Laptops probados en 30 puntos técnicos con Boleta de Venta. Stock real y entrega inmediata en Lima y provincias.',
    bgImage: '/images/hero-desktop.webp',
    mobileImage: '/images/hero-mobile.webp',
    ctaLabel: 'Ver Catálogo',
    ctaLink: '/coleccion',
    order: 0,
  },
  {
    _id: 'fallback-hero-1',
    title: 'Testeado en 30 Puntos Técnicos',
    subtitle: 'Cada equipo pasa por rigurosas pruebas de pantalla, cámaras, Touch ID, audio, puertos y batería.',
    bgImage: '/images/hero-desktop.webp',
    mobileImage: '/images/hero-mobile.webp',
    ctaLabel: 'Ver MacBooks',
    ctaLink: '/coleccion?categoria=laptops',
    order: 1,
  },
  {
    _id: 'fallback-hero-2',
    title: 'Emitimos Boleta de Venta',
    subtitle: 'Compra con total transparencia. 🎁 Funda portalaptop nueva de regalo en laptops y pack completo en iPads.',
    bgImage: '/images/hero-desktop.webp',
    mobileImage: '/images/hero-mobile.webp',
    ctaLabel: 'Ver Catálogo',
    ctaLink: '/coleccion',
    order: 2,
  },
];


function getUrgencyBadge(product: any) {
  if (product.inStock === false) {
    return {
      text: '🔴 Sin Stock',
      pillClass: 'bg-rose-600 text-white shadow-sm',
    };
  }
  const name = (product.name || '').toLowerCase();
  if (name.includes('dell latitude') || name.includes('3330')) {
    return {
      text: '⚡ Solo 2 en stock',
      pillClass: 'bg-amber-500 text-white shadow-sm',
    };
  }
  if (name.includes('ipad 9') || name.includes('10.2')) {
    return {
      text: '🔥 Más vendido • Top ventas',
      pillClass: 'bg-orange-500 text-white shadow-sm',
    };
  }
  if (name.includes('macbook pro 16') || name.includes('macbook pro 13') || name.includes('16"')) {
    return {
      text: '🔥 ¡Última unidad disponible!',
      pillClass: 'bg-purple-600 text-white shadow-sm',
    };
  }
  if (name.includes('ipad pro') || name.includes('ipad air') || name.includes('mini')) {
    return {
      text: '⚡ Stock limitado',
      pillClass: 'bg-emerald-600 text-white shadow-sm',
    };
  }
  return {
    text: '✨ Stock verificado',
    pillClass: 'bg-zinc-800 text-white shadow-sm',
  };
}

export default function HomePage({ data }: { data: HomeData }) {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { isFavorite, toggleFavorite, addToCart } = useStore();
  const [currentSlide, setCurrentSlide] = useState(0);
  const siteConfig = useSiteConfig();

  // Clean slides: always use pristine, text-free mobile and desktop backgrounds
  const heroSlides = data.heroSlides.length > 0
    ? data.heroSlides.map((slide, i) => ({
        ...slide,
        bgImage: '/images/hero-desktop.webp',
        mobileImage: '/images/hero-mobile.webp',
      }))
    : FALLBACK_HERO_SLIDES;

  const currentHeroSlide = heroSlides[currentSlide] || heroSlides[0];
  const slideTitle = currentHeroSlide?.title || siteConfig.title || 'Tecnología que Renueva';
  const slideSubtitle = (typeof currentHeroSlide?.subtitle === 'string' ? currentHeroSlide.subtitle : null) || siteConfig.description || 'Dispositivos tecnológicos seleccionados y probados en 30 puntos técnicos. Emitimos Boleta de Venta y enviamos a todo el Perú.';
  const slideCtaLabel = currentHeroSlide?.ctaLabel || 'Ver Catálogo';
  const slideCtaLink = currentHeroSlide?.ctaLink || '/coleccion';

  const featured = data.featuredProducts;
  const outOfStock = data.outOfStockProducts || [];
  const testimonials = data.testimonials;
  const useFallback = data.useFallback;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  }, [heroSlides.length]);

  useEffect(() => {
    const timer = setInterval(nextSlide, 3500);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <>
      {/* ═══ HERO SECTION ═══ */}
      <section id="inicio" className="relative h-[100dvh] min-h-[100dvh] overflow-hidden scroll-mt-16 bg-[#080C14]">
        <div className="absolute inset-0" aria-hidden="true">
          {heroSlides.map((slide, i) => (
            <div
              key={slide._id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                i === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              {/* Desktop widescreen hero (>= 768px) */}
              <div
                className="hidden md:block absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url('${slide.bgImage || '/images/hero-desktop.webp'}')`,
                }}
              />
              {/* Mobile vertical portrait hero (< 768px) */}
              <div
                className="block md:hidden absolute inset-0 bg-cover bg-bottom bg-no-repeat"
                style={{
                  backgroundImage: `url('${slide.mobileImage || '/images/hero-mobile.webp'}')`,
                }}
              />
            </div>
          ))}
        </div>

        {/* Ambient Dark Scrim for High-Contrast Readable Typography */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/85 via-black/35 via-45% to-transparent md:from-black/75 md:via-black/30 md:to-black/70 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-20 z-10 bg-gradient-to-t from-background via-background/30 to-transparent pointer-events-none" />

        <div className="absolute bottom-20 sm:bottom-10 md:bottom-12 left-1/2 -translate-x-1/2 md:left-16 lg:left-24 md:translate-x-0 z-20 flex items-center gap-2">
          {heroSlides.map((slide, i) => (
            <button
              key={slide._id}
              onClick={() => setCurrentSlide(i)}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === currentSlide ? 'w-6 bg-white/80' : 'w-2 bg-white/30'
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center pt-16 pb-48 sm:pb-36 md:pb-0 md:justify-center md:items-start md:text-left md:pt-0 h-full px-5 sm:px-8 md:pl-16 lg:pl-24 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-3 sm:mb-6"
          >
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-turquoise-300" />
            <span {...(currentHeroSlide?._id && !currentHeroSlide._id.startsWith('fallback-') ? ve(currentHeroSlide._id, 'heroSlide', 'title') : ve('siteSettings', 'siteSettings', 'tagline'))} className="text-xs sm:text-sm font-medium text-white/85">
              {siteConfig.tagline || 'Tecnología Renovada Certificada'}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            {...(currentHeroSlide?._id && !currentHeroSlide._id.startsWith('fallback-') ? ve(currentHeroSlide._id, 'heroSlide', 'title') : ve('siteSettings', 'siteSettings', 'title'))}
            className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold leading-[1.12] tracking-tight mb-2 sm:mb-4 text-white max-w-sm sm:max-w-2xl md:max-w-xl text-center md:text-left drop-shadow-md"
          >
            {slideTitle}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            {...(currentHeroSlide?._id && !currentHeroSlide._id.startsWith('fallback-') ? ve(currentHeroSlide._id, 'heroSlide', 'subtitle') : ve('siteSettings', 'siteSettings', 'description'))}
            className="text-xs sm:text-sm md:text-base lg:text-lg text-white/85 max-w-[280px] sm:max-w-md md:max-w-xl mx-auto md:mx-0 mb-4 sm:mb-6 leading-relaxed text-center md:text-left drop-shadow-sm"
          >
            {slideSubtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-row items-center justify-center md:justify-start gap-2.5 sm:gap-3 w-full max-w-xs sm:max-w-sm md:max-w-none"
          >
            <motion.button
              onClick={() => router.push(slideCtaLink)}
              className="flex-1 sm:flex-initial bg-gradient-to-r from-turquoise-500 to-turquoise-600 hover:from-turquoise-400 hover:to-turquoise-500 text-white px-5 sm:px-7 py-3 sm:py-3.5 rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-turquoise-500/25 transition-all whitespace-nowrap active:scale-[0.98]"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {slideCtaLabel}
            </motion.button>
            <Link
              href="/comprar"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-3 sm:py-3.5 rounded-xl text-xs sm:text-sm font-semibold border border-white/20 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all whitespace-nowrap active:scale-[0.98]"
            >
              <ShoppingBag className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
              Cómo Comprar
            </Link>
          </motion.div>
        </div>

        <motion.div
          className="hidden md:block absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <button
            onClick={() => document.getElementById('featured-products')?.scrollIntoView({ behavior: 'smooth' })}
            className="flex flex-col items-center gap-1.5 text-white/30 hover:text-white/60 transition-colors"
            aria-label="Explorar"
          >
            <span className="text-[10px] font-medium tracking-widest uppercase">Explorar</span>
            <ArrowDown className="w-4 h-4" />
          </button>
        </motion.div>
      </section>

      {/* ═══ FEATURED ═══ */}
      <section id="featured-products" className="py-20 sm:py-28 lg:py-36 scroll-mt-16">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
          <div className="text-center mb-12 sm:mb-16">
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-turquoise-600 mb-3 block">Destacados</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-3">
              Equipos <span className="text-gradient-turquoise">Destacados</span>
            </h2>
            <p className="text-foreground/40 text-sm max-w-md mx-auto">
              Los dispositivos tecnológicos testeados en 30 puntos más elegidos por nuestros clientes con boleta de venta.
            </p>
            <div className="section-divider mx-auto mt-5" />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 mb-12 sm:mb-16">
            {featured.map((product, i) => {
              const cleanTitle = (product.name || '').replace(/\s*[•\-]\s*Ord:\s*[\w\-]+/gi, '').replace(/\\"/g, '"').trim();
              const isOutOfStock = product.inStock === false;

              const isApple = /apple|ipad|macbook|mac/i.test(cleanTitle);
              const isDell = /dell|latitude/i.test(cleanTitle);
              const brandLabel = isApple ? 'APPLE' : isDell ? 'DELL' : (product.category?.name || 'TECH').toUpperCase();

              // Refined single stock badge text
              const stockBadgeText = isOutOfStock
                ? 'Próximo lote'
                : cleanTitle.toLowerCase().includes('dell latitude') || cleanTitle.toLowerCase().includes('3330')
                ? '⚡ Solo 2 unidades'
                : cleanTitle.toLowerCase().includes('ipad 9')
                ? '🔥 Más vendido'
                : cleanTitle.toLowerCase().includes('macbook pro 16')
                ? '🔥 ¡Última unidad!'
                : '🟢 En stock';

              return (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.05 }}
                  className="group flex flex-col justify-between relative select-none cursor-pointer"
                >
                  <Link href={`/coleccion/${product.slug}`}>
                    {/* Studio Canvas Image Stage (Borderless) */}
                    <div
                      {...ve(product._id, 'product', 'mainImage')}
                      className="relative aspect-square w-full rounded-2xl bg-[#F6F7F9] overflow-hidden mb-3 group-hover:bg-[#F0F2F5] transition-colors"
                    >
                      <ProductCardImage
                        product={product}
                        alt={product.name}
                        className={`w-full h-full ${isOutOfStock ? 'grayscale-[20%] opacity-80' : ''}`}
                      />

                      {/* Single Minimalist Pill (Top Left) */}
                      <div className="absolute top-2.5 left-2.5 z-20 pointer-events-none">
                        {isOutOfStock ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide bg-zinc-900/85 backdrop-blur-md text-white border border-white/10 shadow-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                            {stockBadgeText}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide bg-white/95 backdrop-blur-md text-zinc-800 border border-zinc-200/70 shadow-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            {stockBadgeText}
                          </span>
                        )}
                      </div>

                      {/* Floating Minimal Favorite Button */}
                      <div className="absolute top-2.5 right-2.5 z-20 opacity-90 group-hover:opacity-100">
                        <motion.button
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(product._id); }}
                          className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md shadow-sm border border-zinc-200/60 flex items-center justify-center transition-all hover:scale-110 active:scale-90"
                          whileTap={{ scale: 0.85 }}
                          aria-label="Guardar favorito"
                        >
                          <Heart className={`w-3.5 h-3.5 ${isFavorite(product._id) ? 'text-red-500 fill-red-500' : 'text-zinc-400 hover:text-red-500'}`} fill={isFavorite(product._id) ? 'currentColor' : 'none'} />
                        </motion.button>
                      </div>
                    </div>

                    {/* Micro-Brand & Category */}
                    <div className="flex items-center gap-1.5 mb-1 px-0.5">
                      <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400">
                        {brandLabel}
                      </span>
                      <span className="text-[10px] text-zinc-300">•</span>
                      <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-400">
                        {product.category?.name || 'Equipo'}
                      </span>
                    </div>

                    {/* Clean Title */}
                    <h3 {...ve(product._id, 'product', 'name')} className="text-sm sm:text-[15px] font-bold text-zinc-900 group-hover:text-turquoise-600 transition-colors mb-1.5 leading-snug line-clamp-2 min-h-[2.5rem] tracking-tight px-0.5">
                      {cleanTitle}
                    </h3>

                    {/* Bottom Row: Price & Minimal Action */}
                    <div className="pt-2 border-t border-zinc-100/90 mt-1 flex items-center justify-between gap-2 px-0.5">
                      <div className="flex items-baseline gap-1.5 flex-wrap">
                        <span {...ve(product._id, 'product', 'price')} className="text-base sm:text-lg font-black text-zinc-900 tracking-tight">
                          {formatPrice(product.price)}
                        </span>
                        {product.compareAtPrice && product.compareAtPrice > product.price && (
                          <span className="text-[11px] text-zinc-400 line-through font-normal">
                            {formatPrice(product.compareAtPrice)}
                          </span>
                        )}
                      </div>

                      {isOutOfStock ? (
                        <span className="inline-flex items-center gap-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 py-1.5 px-3 rounded-full text-xs font-bold transition-all">
                          Reservar →
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-zinc-900 group-hover:bg-black text-white py-1.5 px-3.5 rounded-full text-xs font-bold shadow-sm transition-all group-hover:scale-105 active:scale-95">
                          Ver equipo →
                        </span>
                      )}
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* ═══ SECCIÓN SEPARADA: PRODUCTOS AGOTADOS / PRÓXIMO LOTE ═══ */}
          {outOfStock.length > 0 && (
            <div className="mt-14 pt-12 border-t border-zinc-200/70">
              <div className="text-center mb-10">
                <span className="text-[11px] font-black tracking-widest uppercase text-rose-600 inline-flex items-center gap-1.5 bg-rose-50 px-3.5 py-1.5 rounded-full border border-rose-200">
                  <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
                  Próximo Lote de Importación • Agotados
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-foreground mt-3">
                  Equipos en <span className="text-rose-600">Espera de Reposición</span>
                </h3>
                <p className="text-foreground/50 text-xs sm:text-sm max-w-lg mx-auto mt-2">
                  Estos modelos se agotaron en nuestro almacén. Puedes solicitar ser notificado o reservar tu equipo con anticipación antes de que llegue el siguiente lote de USA.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 mb-8">
                {outOfStock.map((product, i) => {
                  const cleanName = (product.name || '').replace(/\s*[•\-]\s*Ord:\s*[\w\-]+/gi, '').replace(/\\"/g, '"').trim();
                  const isApple = /apple|ipad|macbook|mac/i.test(cleanName);
                  const isDell = /dell|latitude/i.test(cleanName);
                  const brandLabel = isApple ? 'APPLE' : isDell ? 'DELL' : (product.category?.name || 'TECH').toUpperCase();

                  return (
                    <motion.div
                      key={product._id}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.35, delay: i * 0.05 }}
                      className="group flex flex-col justify-between cursor-pointer select-none"
                    >
                      <Link href={`/coleccion/${product.slug}`}>
                        {/* Studio Canvas Image Stage (Borderless) */}
                        <div className="relative aspect-square w-full rounded-2xl bg-[#F6F7F9] overflow-hidden mb-3 group-hover:bg-[#F0F2F5] transition-colors">
                          <ProductCardImage
                            product={product}
                            alt={product.name}
                            className="w-full h-full grayscale-[20%] opacity-80"
                          />

                          {/* Single Minimalist Pill (Top Left) */}
                          <div className="absolute top-2.5 left-2.5 z-20 pointer-events-none">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide bg-zinc-900/85 backdrop-blur-md text-white border border-white/10 shadow-sm">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                              Próximo lote
                            </span>
                          </div>
                        </div>

                        {/* Micro-Brand & Category */}
                        <div className="flex items-center gap-1.5 mb-1 px-0.5">
                          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400">
                            {brandLabel}
                          </span>
                          <span className="text-[10px] text-zinc-300">•</span>
                          <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-400">
                            {product.category?.name || 'Equipo'}
                          </span>
                        </div>

                        {/* Clean Title */}
                        <h4 className="text-sm sm:text-[15px] font-bold text-zinc-900 group-hover:text-turquoise-600 transition-colors line-clamp-1 mb-1 px-0.5 tracking-tight">
                          {cleanName}
                        </h4>

                        <p className="text-[11px] text-zinc-400 line-clamp-1 mb-2 px-0.5">{product.description}</p>

                        {/* Bottom Row: Price & WhatsApp Reservation */}
                        <div className="pt-2 border-t border-zinc-100/90 mt-1 flex items-center justify-between gap-2 px-0.5">
                          <span className="text-base sm:text-lg font-black text-zinc-900 tracking-tight">
                            {formatPrice(product.price)}
                          </span>
                          <span className="inline-flex items-center gap-1 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 py-1.5 px-3 rounded-full text-xs font-bold transition-all hover:scale-105 active:scale-95">
                            Reservar por WhatsApp →
                          </span>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="text-center">
            <Link href="/coleccion" className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-full text-base font-semibold shadow-xl shadow-turquoise-500/20 hover:bg-turquoise-600 transition-colors">
              <ShoppingBag className="w-5 h-5" />
              Ver Toda la Coleccion
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section id="testimonios" className="py-20 sm:py-28 lg:py-36 scroll-mt-16">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
          <div className="text-center mb-10 sm:mb-14">
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-turquoise-600 mb-3 block">Testimonios</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
              Lo que Dicen <span className="text-gradient-turquoise">Nuestros Clientes</span>
            </h2>
            <div className="section-divider mx-auto" />
          </div>

          <div className="mb-5">
            <InfiniteMarquee speed={40} className="py-1">
              {testimonials.slice(0, 6).map((t, i) => (
                <TestimonialCard key={`r1-${t._id}-${i}`} testimonial={t} />
              ))}
            </InfiniteMarquee>
          </div>
          <div>
            <InfiniteMarquee speed={35} direction="right" className="py-1">
              {[...testimonials].reverse().slice(0, 6).map((t, i) => (
                <TestimonialCard key={`r2-${t._id}-${i}`} testimonial={t} />
              ))}
            </InfiniteMarquee>
          </div>
        </div>
      </section>
    </>
  );
}

// ─── Testimonial Card ────────────────────────────────────────
function TestimonialCard({ testimonial: t }: { testimonial: SanityTestimonial }) {
  const text = typeof t.quote === 'string' ? t.quote : Array.isArray(t.quote) ? t.quote.map((b: any) => b.children?.map((c: any) => c.text).join('') || '').join(' ') : '';
  const name = t.authorName || '';
  const location = t.company || t.authorRole || '';
  const rating = t.rating || 5;

  return (
    <div {...ve(t._id, 'testimonial', 'quote')} className="flex-shrink-0 w-[320px] sm:w-[380px] p-5 rounded-2xl bg-zinc-50/60 border border-zinc-100/60 backdrop-blur-sm hover:bg-white/80 transition-all duration-500">
      <div className="flex gap-0.5 mb-3">
        {Array.from({ length: rating }).map((_, j) => (
          <svg key={j} className="w-3.5 h-3.5 text-amber-400 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" /></svg>
        ))}
      </div>
      <p className="text-foreground/60 text-xs leading-relaxed mb-4 line-clamp-3">{text}</p>
      <div className="flex items-center gap-2.5 pt-3 border-t border-zinc-100">
        <div className="w-8 h-8 rounded-full bg-turquoise-100 flex items-center justify-center">
          {t.photo ? (
            <img src={t.photo} alt={name} className="w-full h-full rounded-full object-cover" />
          ) : (
            <span className="text-xs font-bold text-turquoise-700">{name.charAt(0)}</span>
          )}
        </div>
        <div>
          <p {...ve(t._id, 'testimonial', 'authorName')} className="text-xs font-semibold text-foreground">{name}</p>
          <p {...ve(t._id, 'testimonial', 'company')} className="text-[10px] text-foreground/40">{location}</p>
        </div>
      </div>
    </div>
  );
}
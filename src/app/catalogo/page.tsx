'use client';

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Package,
  Smartphone,
  ExternalLink,
  Cpu,
  HardDrive,
  Layers,
  Monitor,
  Gift,
  Share2,
  Copy,
  Check,
  Search,
  MessageCircle,
  Home,
  CheckCheck,
} from 'lucide-react';
import { getProductImages } from '@/lib/catalog-images';

interface ProductItem {
  _id: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  description: string;
  mainImage: string;
  category?: { name: string; slug: string };
  features?: string[];
}

interface GroupedProduct {
  groupKey: string;
  cleanTitle: string;
  categoryName: string;
  categorySlug: string;
  brand: string;
  mainImage: string;
  slug: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  description: string;
  stockCount: number;
  skus: string[];
  specs: {
    display: string;
    cpu: string;
    graphics?: string;
    ram: string;
    storage: string;
    connectivity: string;
    condition: string;
    gift: string;
    warranty: string;
  };
}

// Clean internal order suffixes like " • Ord: 01205"
function cleanProductTitle(rawName: string): string {
  let title = rawName
    .replace(/\s*[•\-]\s*Ord:\s*[\w\-]+/gi, '')
    .replace(/\\"/g, '"')
    .trim();

  if (title.toLowerCase().includes('cargador') && title.toLowerCase().includes('96w')) {
    title = 'Cargador Rápido 96W USB-C Power Adapter (Nuevo)';
  }
  return title;
}

// Generate structured specs based on product model
function extractDetailedSpecs(item: ProductItem): GroupedProduct['specs'] {
  const name = item.name.toLowerCase();
  const desc = (item.description || '').toLowerCase();

  // MacBook Pro 16" (A2141)
  if (name.includes('macbook pro 16') || desc.includes('macbook pro 16')) {
    const is32Gb = name.includes('32gb') || desc.includes('32gb') || name.includes('1tb') || desc.includes('1tb');
    return {
      display: 'Retina 16" IPS (3072 x 1920) 500 nits True Tone P3 con biseles ultradelgados',
      cpu: 'Intel Core i7 6 Núcleos (12 Hilos) hasta 4.5 GHz Turbo Boost • macOS actualizado',
      graphics: 'Doble Tarjeta Gráfica: 4GB Video Dedicado AMD Radeon Pro + Intel UHD Graphics 630',
      ram: is32Gb ? '32 GB DDR4 2666 MHz de alta velocidad' : '16 GB DDR4 2666 MHz de alta velocidad',
      storage: is32Gb ? '1 TB (1000 GB) SSD NVMe Ultrarrápido' : '512 GB SSD NVMe Ultrarrápido',
      connectivity: '4 puertos Thunderbolt 3 (USB-C), Jack 3.5mm, Wi-Fi ac, Bluetooth 5.0',
      condition: 'Seminuevo Grado A Impecable • Teclado Magic Keyboard con Touch Bar y Touch ID',
      gift: '🎁 REGALO: Funda portalaptop nueva acolchada de protección',
      warranty: 'Emitimos Boleta de Venta • 100% probado en 30 puntos (WiFi, audio, cámaras, Touch ID, pantalla, puertos y sensores). Si tiene algún detalle se informa en observación.',
    };
  }

  // MacBook Pro 15.4" (A1990)
  if (name.includes('15.4') || desc.includes('15.4') || name.includes('macbook pro 15')) {
    return {
      display: 'Retina 15.4" IPS (2880 x 1800) True Tone amplia gama de color P3',
      cpu: 'Intel Core i7 6 Núcleos (12 Hilos) de alto rendimiento • macOS actualizado',
      graphics: 'Doble Tarjeta Gráfica: 4GB Video Dedicado AMD Radeon Pro + Intel UHD Graphics',
      ram: '16 GB DDR4 de alta velocidad',
      storage: '512 GB SSD NVMe Ultrarrápido',
      connectivity: '4 puertos Thunderbolt 3 (USB-C), Wi-Fi, Bluetooth, Audio Hi-Fi',
      condition: 'Seminuevo Grado A • Teclado retroiluminado con Touch Bar y Touch ID',
      gift: '🎁 REGALO: Funda portalaptop nueva acolchada de protección',
      warranty: 'Emitimos Boleta de Venta • 100% probado en 30 puntos (WiFi, audio, cámaras, Touch ID, pantalla, puertos y sensores). Si tiene algún detalle se informa en observación.',
    };
  }

  // MacBook Pro 13.3" (2020) Core i7 (A2251)
  if (name.includes('2020') && (name.includes('i7') || desc.includes('i7'))) {
    return {
      display: 'Retina 13.3" IPS (2560 x 1600) 500 nits con tecnología True Tone',
      cpu: 'Intel Core i7 10ma Generación Quad-Core (hasta 4.1 GHz) • macOS actualizado',
      graphics: 'Intel Iris Plus Graphics de alto rendimiento para edición y diseño',
      ram: '16 GB LPDDR4X a 3733 MHz ultrarrápida',
      storage: '512 GB SSD NVMe de alta velocidad',
      connectivity: '4 puertos Thunderbolt 3 (USB-C) ultrarrápidos, Wi-Fi, Bluetooth 5.0',
      condition: 'Seminuevo Grado A • Magic Keyboard con Touch Bar y Touch ID físico',
      gift: '🎁 REGALO: Funda portalaptop nueva acolchada de protección',
      warranty: 'Emitimos Boleta de Venta • 100% probado en 30 puntos (WiFi, audio, cámaras, Touch ID, pantalla, puertos y sensores). Si tiene algún detalle se informa en observación.',
    };
  }

  // MacBook Pro 13.3" Core i5 (A2159 / A1989 / A1706)
  if (name.includes('macbook pro 13') || desc.includes('macbook pro 13')) {
    const is16Gb = name.includes('16gb') || desc.includes('16gb');
    const is512Gb = name.includes('512gb') || desc.includes('512gb');
    return {
      display: 'Retina 13.3" IPS (2560 x 1600) con retroiluminación LED y True Tone',
      cpu: 'Intel Core i5 Quad-Core Turbo Boost • macOS actualizado',
      graphics: 'Intel Iris Plus Graphics integrado para tareas fluidas y multimedia',
      ram: is16Gb ? '16 GB RAM' : '8 GB RAM',
      storage: is512Gb ? '512 GB SSD NVMe Ultrarrápido' : '256 GB SSD NVMe Ultrarrápido',
      connectivity: 'Puertos Thunderbolt 3 (USB-C), Wi-Fi, Bluetooth, Jack 3.5mm',
      condition: 'Seminuevo Grado A • Teclado retroiluminado con Touch Bar y lector Touch ID',
      gift: '🎁 REGALO: Funda portalaptop nueva acolchada de protección',
      warranty: 'Emitimos Boleta de Venta • 100% probado en 30 puntos (WiFi, audio, cámaras, Touch ID, pantalla, puertos y sensores). Si tiene algún detalle se informa en observación.',
    };
  }

  // Dell Latitude 3330 (Core i5 11va Gen)
  if (name.includes('dell') || desc.includes('dell') || name.includes('latitude')) {
    return {
      display: '13.3" Full HD Antirreflejo (1920 x 1080) biseles delgados de alta definición',
      cpu: 'Intel Core i5-1155G7 11va Gen (4 Núcleos / 8 Hilos hasta 4.5 GHz) • Windows 11 Pro',
      graphics: 'Intel Iris Xe Graphics para productividad fluida y multitarea',
      ram: '8 GB DDR4',
      storage: '256 GB SSD M.2 NVMe Ultrarrápido',
      connectivity: 'USB-C con DisplayPort, USB 3.2, HDMI 2.0, Wi-Fi 6, Bluetooth',
      condition: 'Seminuevo Grado A Corporativo (Robusto, ultraportátil y elegante)',
      gift: '🎁 REGALO: Funda portalaptop nueva acolchada de protección',
      warranty: 'Emitimos Boleta de Venta • 100% probado en 30 puntos (WiFi, audio, cámaras, pantalla, puertos, teclado y sensores). Si tiene algún detalle se informa en observación.',
    };
  }

  // iPad Pro 12.9" 2da Gen
  if (name.includes('12.9') || desc.includes('12.9')) {
    return {
      display: 'Retina 12.9" 120Hz ProMotion (2732 x 2048) con gama cromática P3 y True Tone',
      cpu: 'Chip Apple A10X Fusion con arquitectura de 64 bits y coprocesador M10',
      ram: '4 GB RAM de alta respuesta',
      storage: '256 GB de Almacenamiento interno',
      connectivity: 'Wi-Fi 802.11ac dual band, Bluetooth 4.2, Conector Lightning, Smart Connector',
      condition: 'Seminuevo Grado A • Compatible con Apple Pencil 1 y Smart Keyboard',
      gift: '🎁 PACK REGALO: Lápiz Óptico + Soporte Ajustable Vertical/Horizontal + Cable Nuevos',
      warranty: 'Emitimos Boleta de Venta • 100% probado en 30 puntos (WiFi, pantalla 120Hz, cámaras, audio y Touch ID operativos). Si tiene algún detalle se informa en observación.',
    };
  }

  // iPad Air 3ra Gen 10.5"
  if (name.includes('air 3') || desc.includes('air 3')) {
    const isCellular = name.includes('4g') || name.includes('chip') || desc.includes('4g') || desc.includes('cellular');
    return {
      display: 'Retina 10.5" True Tone Laminada con gama amplia P3 (2224 x 1668)',
      cpu: 'Chip Apple A12 Bionic con arquitectura de 64 bits y Neural Engine',
      ram: '3 GB RAM',
      storage: '256 GB de Almacenamiento interno',
      connectivity: isCellular
        ? 'WiFi Dual Band + 4G LTE con ranura para chip (Libre para cualquier operador)'
        : 'WiFi 802.11ac Dual Band de alta velocidad',
      condition: 'Seminuevo Grado A • Compatible con Apple Pencil y Smart Keyboard',
      gift: '🎁 PACK REGALO: Lápiz Óptico + Soporte Ajustable Vertical/Horizontal + Cable Nuevos',
      warranty: 'Emitimos Boleta de Venta • 100% probado en 30 puntos (WiFi, chip 4G, cámaras, audio, Touch ID y pantalla operativos). Si tiene algún detalle se informa en observación.',
    };
  }

  // iPad 9na Gen 10.2"
  if (name.includes('ipad 9') || desc.includes('ipad 9') || desc.includes('a13 bionic')) {
    const isCellular = name.includes('4g') || desc.includes('4g') || desc.includes('chip');
    return {
      display: 'Retina 10.2" con tecnología True Tone (2160 x 1620) y brillo de 500 nits',
      cpu: 'Chip Apple A13 Bionic con Neural Engine de alto rendimiento',
      ram: '3 GB RAM',
      storage: '64 GB de Almacenamiento interno',
      connectivity: isCellular
        ? 'WiFi Dual Band + 4G LTE Datos Móviles (Libre para chip de cualquier operador)'
        : 'WiFi 802.11ac Dual Band',
      condition: 'Seminuevo Grado A • Cámara Frontal 12MP Ultra Gran Angular Center Stage',
      gift: '🎁 PACK REGALO: Lápiz Óptico + Soporte Ajustable Vertical/Horizontal + Cable Nuevos',
      warranty: 'Emitimos Boleta de Venta • 100% probado en 30 puntos (WiFi, chip 4G, cámaras Center Stage, audio, Touch ID y pantalla operativos). Si tiene algún detalle se informa en observación.',
    };
  }

  // iPad Pro 10.5"
  if (name.includes('10.5') || desc.includes('10.5')) {
    const is512Gb = name.includes('512gb') || desc.includes('512gb');
    const isCellular = name.includes('chip') || name.includes('4g') || desc.includes('chip') || desc.includes('4g');
    return {
      display: 'Retina 10.5" Ultra Fluida 120Hz ProMotion True Tone (2224 x 1668)',
      cpu: 'Chip Apple A10X Fusion Quad-Core de alto rendimiento',
      ram: '4 GB RAM',
      storage: is512Gb ? '512 GB de Almacenamiento' : '256 GB de Almacenamiento',
      connectivity: isCellular
        ? 'WiFi Dual Band + Celular 4G LTE con bandeja SIM física (Libre todo operador)'
        : 'WiFi 802.11ac Dual Band de alta velocidad',
      condition: 'Seminuevo Grado A • Pantalla con tasa de refresco ultra rápida de 120Hz',
      gift: '🎁 PACK REGALO: Lápiz Óptico + Soporte Ajustable Vertical/Horizontal + Cable Nuevos',
      warranty: 'Emitimos Boleta de Venta • 100% probado en 30 puntos (WiFi, chip 4G, pantalla 120Hz, cámaras, audio y Touch ID operativos). Si tiene algún detalle se informa en observación.',
    };
  }

  // iPad Mini 5
  if (name.includes('mini 5') || desc.includes('mini 5')) {
    return {
      display: 'Retina 7.9" True Tone amplia gama P3 (2048 x 1536) ultra portátil',
      cpu: 'Chip Apple A12 Bionic con arquitectura Neural Engine',
      ram: '3 GB RAM',
      storage: '256 GB de Almacenamiento interno',
      connectivity: 'WiFi 802.11ac Dual Band, Bluetooth 5.0',
      condition: 'Seminuevo Grado A • Incluye mica de protección de pantalla instalada',
      gift: '🎁 PACK REGALO: Mica de Pantalla + Lápiz Óptico + Soporte + Cable Nuevos',
      warranty: 'Emitimos Boleta de Venta • 100% probado en 30 puntos (WiFi, cámaras, audio, Touch ID y pantalla operativos). Si tiene algún detalle se informa en observación.',
    };
  }

  // Cargador 96W USB-C
  if (name.includes('96w') || desc.includes('96w') || name.includes('cargador')) {
    return {
      display: 'Potencia 96W Carga Rápida USB-C PD (Power Delivery)',
      cpu: 'Voltaje universal 100-240V 50/60Hz con clavija plana americana estándar',
      ram: 'Circuito inteligente de seguridad contra sobrevoltaje, cortocircuito y temperatura',
      storage: 'Compatible con MacBook Pro 16", 15", 13", MacBook Air, iPad Pro y laptops USB-C',
      connectivity: 'Conector de salida USB-C reversible universal',
      condition: 'Producto 100% Nuevo en Caja (Compatible de alta calidad - No es original Apple)',
      gift: '🎁 Producto nuevo en empaque protector probado',
      warranty: 'Emitimos Boleta de Venta • Producto 100% nuevo en caja',
    };
  }

  return {
    display: 'Pantalla de alta resolución y fidelidad visual',
    cpu: 'Procesador multinúcleo de alto rendimiento',
    ram: 'Memoria de respuesta ágil para multitarea',
    storage: 'Almacenamiento sólido de alta velocidad',
    connectivity: 'Conectividad inalámbrica y puertos esenciales',
    condition: 'Seminuevo Grado A Verificado',
    gift: '🎁 Pack de obsequio incluido según categoría',
    warranty: 'Emitimos Boleta de Venta • Probado en 30 puntos técnicos',
  };
}

export default function CatalogoShowroomPage() {
  const [groupedProducts, setGroupedProducts] = useState<GroupedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'todos' | 'laptops' | 'tablets' | 'accesorios'>('todos');

  const CATALOG_URL = 'https://www.itechperu.shop/catalogo';

  useEffect(() => {
    const query = encodeURIComponent(`*[_type == "product"] | order(order asc) {
      _id, "slug": slug.current, sku, name,
      price, compareAtPrice, description,
      "mainImage": coalesce(mainImage.asset->url, mainImageUrl),
      gallery[] { "url": coalesce(image.asset->url, url), alt },
      "category": category->{ _id, name, "slug": slug.current }
    }`);

    const sanityUrl = `https://kqneikcb.api.sanity.io/v2025-01-01/data/query/production?query=${query}`;

    fetch(sanityUrl)
      .then((res) => res.json())
      .then((data) => {
        if (data.result && Array.isArray(data.result)) {
          const map = new Map<string, GroupedProduct>();

          for (const item of data.result as ProductItem[]) {
            const rawTitle = item.name || '';
            const lowerRaw = rawTitle.toLowerCase();

            // Exclude internal repair parts (pantalla / display)
            if (lowerRaw.includes('pantalla completa') || lowerRaw.includes('display original')) {
              continue;
            }

            const cleanTitle = cleanProductTitle(rawTitle);
            const specs = extractDetailedSpecs(item);
            const groupKey = `${cleanTitle}-${item.price}`;

            const existing = map.get(groupKey);
            const imageSet = getProductImages(item);
            if (!existing) {
              map.set(groupKey, {
                groupKey,
                cleanTitle,
                categoryName: item.category?.name || 'Tecnología',
                categorySlug: item.category?.slug || 'tecnologia',
                brand: cleanTitle.toLowerCase().includes('dell') ? 'Dell' : 'Apple',
                mainImage: imageSet.main,
                slug: item.slug,
                sku: item.sku,
                price: item.price,
                compareAtPrice: item.compareAtPrice,
                description: item.description,
                stockCount: 1,
                skus: [item.sku],
                specs,
              });
            } else {
              existing.stockCount += 1;
              existing.skus.push(item.sku);
            }
          }

          setGroupedProducts(Array.from(map.values()));
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const laptops = useMemo(
    () =>
      groupedProducts.filter(
        (p) =>
          p.categorySlug === 'laptops' ||
          p.cleanTitle.toLowerCase().includes('macbook') ||
          p.cleanTitle.toLowerCase().includes('dell')
      ),
    [groupedProducts]
  );

  const tablets = useMemo(
    () =>
      groupedProducts.filter(
        (p) =>
          p.categorySlug === 'tablets' ||
          p.cleanTitle.toLowerCase().includes('ipad')
      ),
    [groupedProducts]
  );

  const otherItems = useMemo(
    () =>
      groupedProducts.filter(
        (p) =>
          !laptops.some((l) => l.groupKey === p.groupKey) &&
          !tablets.some((t) => t.groupKey === p.groupKey)
      ),
    [groupedProducts, laptops, tablets]
  );

  const totalStockUnits = useMemo(
    () => groupedProducts.reduce((acc, curr) => acc + curr.stockCount, 0),
    [groupedProducts]
  );

  // Filtered list based on Search & Category
  const filteredProducts = useMemo(() => {
    let list = groupedProducts;

    if (selectedCategory === 'laptops') list = laptops;
    if (selectedCategory === 'tablets') list = tablets;
    if (selectedCategory === 'accesorios') list = otherItems;

    if (!searchQuery.trim()) return list;

    const q = searchQuery.toLowerCase().trim();
    return list.filter(
      (p) =>
        p.cleanTitle.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.specs.cpu.toLowerCase().includes(q) ||
        p.specs.ram.toLowerCase().includes(q) ||
        p.specs.storage.toLowerCase().includes(q)
    );
  }, [groupedProducts, laptops, tablets, otherItems, selectedCategory, searchQuery]);

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `¡Hola! Te comparto el Catálogo Oficial en vivo de iTech Perú con los modelos de MacBooks, iPads y Laptops Certificados disponibles hoy:\n\n👉 ${CATALOG_URL}`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleCopyLink = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(CATALOG_URL);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 font-sans antialiased selection:bg-teal-500 selection:text-white">
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* STICKY TOP SHARING & NAVIGATION BAR (Móvil y Escritorio) */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-50 bg-[#0A101D]/90 backdrop-blur-xl border-b border-teal-500/20 shadow-xl">
        <div className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3">
          {/* Brand & Live Inventory Status */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group">
            <img
              src="/icon.png"
              alt="iTech Perú"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl object-contain bg-slate-900 border border-teal-500/40 p-0.5 group-hover:scale-105 transition-transform"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm sm:text-base font-black tracking-tight text-white">
                  iTech <span className="text-teal-400 font-light">PERÚ</span>
                </span>
                <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-teal-950 text-teal-300 border border-teal-800/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                  Showroom Digital
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">
                {totalStockUnits} Equipos Testeados en Stock Inmediato
              </p>
            </div>
          </Link>

          {/* Quick Sharing & Web Buttons */}
          <div className="flex items-center gap-2">
            {/* Share via WhatsApp */}
            <button
              onClick={handleShareWhatsApp}
              className="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20BD5A] text-white px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-green-900/20 transition-all hover:scale-[1.02] active:scale-95"
              title="Reenviar catálogo por WhatsApp"
            >
              <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span><span className="hidden sm:inline">Reenviar por </span>WhatsApp</span>
            </button>

            {/* Copy Link */}
            <button
              onClick={handleCopyLink}
              className={`inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all active:scale-95 ${
                copiedLink
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-500 shadow-md shadow-emerald-900/30'
                  : 'bg-white/10 hover:bg-white/15 text-slate-200 border-white/15'
              }`}
              title="Copiar enlace del catálogo"
            >
              {copiedLink ? (
                <>
                  <CheckCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
                  <span>¡Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-300" />
                  <span className="hidden sm:inline">Copiar Enlace</span>
                </>
              )}
            </button>

            {/* Back to Home Store */}
            <Link
              href="/"
              className="hidden lg:inline-flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white px-3 py-2 rounded-xl text-xs font-bold border border-slate-700 transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Tienda Web</span>
            </Link>
          </div>
        </div>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-4">
          <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-bold text-slate-300">
            Cargando inventario digital de iTech Perú...
          </p>
        </div>
      ) : (
        <main className="w-full max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-8">
          {/* ═══════════════════════════════════════════════════════════════════ */}
          {/* HERO DIGITAL SHOWROOM COVER */}
          {/* ═══════════════════════════════════════════════════════════════════ */}
          <div className="w-full rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-10 bg-gradient-to-br from-[#0B1220] via-[#0D1B2A] to-[#042427] border border-teal-500/30 shadow-2xl relative overflow-hidden">
            {/* Background Decorative Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-5 gap-3">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    CATÁLOGO DIGITAL EN VIVO
                  </span>
                </div>
                <div className="text-xs text-slate-300">
                  Actualizado en tiempo real • <strong className="text-white">{totalStockUnits} unidades físicas listas</strong>
                </div>
              </div>

              <div className="space-y-3">
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                  Catálogo Oficial:{' '}
                  <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                    Apple MacBooks, iPads & Laptops
                  </span>
                </h1>

                <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
                  Equipos testeados exhaustivamente en 30 puntos técnicos (WiFi, audio, cámaras, Touch ID, pantalla Retina, teclado, puertos y batería). Emitimos Boleta de Venta. Puedes reenviar esta página directamente a tus clientes o contactos; los enlaces de compra conectan directamente con nuestros asesores en WhatsApp.
                </p>
              </div>

              {/* Gift Packs Banner */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="flex items-center gap-3 bg-white/10 border border-white/15 px-4 py-2.5 rounded-xl">
                  <Gift className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span className="text-xs text-slate-200">
                    🎁 <strong>Laptops & MacBooks:</strong> Incluyen funda portalaptop nueva acolchada de obsequio.
                  </span>
                </div>
                <div className="flex items-center gap-3 bg-white/10 border border-white/15 px-4 py-2.5 rounded-xl">
                  <Gift className="w-5 h-5 text-teal-400 shrink-0" />
                  <span className="text-xs text-slate-200">
                    🎁 <strong>iPads & Tablets:</strong> Incluyen lápiz óptico + soporte ajustable + cable nuevos.
                  </span>
                </div>
              </div>

              {/* Trust Badges Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                <div className="bg-white/5 rounded-xl p-3 border border-white/10 flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-white">Emitimos Boleta</h4>
                    <p className="text-[10px] text-slate-400">Total transparencia</p>
                  </div>
                </div>
                <div className="bg-white/5 rounded-xl p-3 border border-white/10 flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-white">30 Puntos Test</h4>
                    <p className="text-[10px] text-slate-400">Inspección de hardware</p>
                  </div>
                </div>
                <div className="bg-white/5 rounded-xl p-3 border border-white/10 flex items-center gap-2.5">
                  <Package className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-white">Envíos Todo Perú</h4>
                    <p className="text-[10px] text-slate-400">Shalom & Olva Courier</p>
                  </div>
                </div>
                <div className="bg-white/5 rounded-xl p-3 border border-white/10 flex items-center gap-2.5">
                  <Smartphone className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-white">En Vivo en TikTok</h4>
                    <p className="text-[10px] text-slate-400">@itechperu</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════════ */}
          {/* SEARCH & CATEGORY FILTERS CONTROLS */}
          {/* ═══════════════════════════════════════════════════════════════════ */}
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              {/* Category Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                <button
                  onClick={() => setSelectedCategory('todos')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedCategory === 'todos'
                      ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                      : 'bg-[#0D1525] text-slate-300 hover:text-white border border-slate-800'
                  }`}
                >
                  Todos ({totalStockUnits})
                </button>
                <button
                  onClick={() => setSelectedCategory('laptops')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedCategory === 'laptops'
                      ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                      : 'bg-[#0D1525] text-slate-300 hover:text-white border border-slate-800'
                  }`}
                >
                  💻 Laptops & MacBooks ({laptops.reduce((a, b) => a + b.stockCount, 0)})
                </button>
                <button
                  onClick={() => setSelectedCategory('tablets')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedCategory === 'tablets'
                      ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                      : 'bg-[#0D1525] text-slate-300 hover:text-white border border-slate-800'
                  }`}
                >
                  📱 iPads & Tablets ({tablets.reduce((a, b) => a + b.stockCount, 0)})
                </button>
                <button
                  onClick={() => setSelectedCategory('accesorios')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedCategory === 'accesorios'
                      ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                      : 'bg-[#0D1525] text-slate-300 hover:text-white border border-slate-800'
                  }`}
                >
                  🔌 Accesorios ({otherItems.reduce((a, b) => a + b.stockCount, 0)})
                </button>
              </div>

              {/* Instant Search Bar */}
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar modelo, procesador, RAM..."
                  className="w-full bg-[#0D1525] border border-slate-800 focus:border-teal-500 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                  >
                    Limpiar
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════════ */}
          {/* PRODUCT SHOWROOM GRID */}
          {/* ═══════════════════════════════════════════════════════════════════ */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-[#0D1525] rounded-2xl border border-slate-800 space-y-3">
              <p className="text-slate-400 text-sm">
                No se encontraron modelos con el término "{searchQuery}".
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('todos');
                }}
                className="text-xs text-teal-400 font-bold hover:underline"
              >
                Ver todos los productos disponibles
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((item) => (
                <CatalogProductCard key={item.groupKey} item={item} />
              ))}
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════ */}
          {/* DELUXE DIGITAL FOOTER */}
          {/* ═══════════════════════════════════════════════════════════════════ */}
          <footer className="border-t border-slate-800 pt-8 mt-12 text-center text-xs text-slate-400 space-y-3">
            <div className="flex flex-wrap items-center justify-center gap-4 font-bold text-slate-300">
              <Link href="/" className="hover:text-teal-400 transition-colors">
                🌐 www.itechperu.shop
              </Link>
              <span>•</span>
              <a
                href="https://wa.me/51907674693"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-teal-400 transition-colors"
              >
                📲 WhatsApp Ventas: +51 907 674 693 / +51 924 967 876
              </a>
              <span>•</span>
              <a
                href="https://www.tiktok.com/@itechperu"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-teal-400 transition-colors"
              >
                🎵 TikTok Live: @itechperu
              </a>
            </div>
            <p className="text-slate-500">
              iTech Perú • Importaciones Directas USA • Precios en Soles (PEN) sujetos a disponibilidad de inventario.
            </p>
            <p className="text-[11px] text-slate-500">
              Este catálogo digital interactivo sustituye los archivos PDF pesados, garantizando stock y precios 100% actualizados en todo momento.
            </p>
          </footer>
        </main>
      )}

      {/* Floating WhatsApp Quick Action Button */}
      <a
        href="https://wa.me/51907674693?text=Hola%20iTech%20Per%C3%BA!%20Deseo%20hacer%20una%20consulta%20sobre%20el%20cat%C3%A1logo%20digital."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20BD5A] text-white px-4 py-3 rounded-full shadow-2xl shadow-green-950 font-bold text-xs sm:text-sm transition-all hover:scale-105 active:scale-95"
      >
        <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
        <span>Consultar Asesor</span>
      </a>
    </div>
  );
}

// Ultra-Premium Product Card Component with Big 1:1 Image & Full Specs
function CatalogProductCard({ item }: { item: GroupedProduct }) {
  const whatsappUrl = `https://wa.me/51907674693?text=${encodeURIComponent(
    `Hola iTech Perú! Vi en el Catálogo Digital el equipo: *${item.cleanTitle}* (Precio: S/ ${item.price} PEN). Deseo coordinar la compra y verificar la disponibilidad inmediata.`
  )}`;

  const webUrl = `https://www.itechperu.shop/coleccion/${item.slug}`;

  return (
    <div className="bg-[#0D1525] text-white rounded-2xl border border-slate-800/90 hover:border-teal-500/50 p-4 sm:p-5 shadow-xl flex flex-col justify-between transition-all duration-300">
      <div className="space-y-4">
        {/* Top Badges: Category & Stock Count */}
        <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
          <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-teal-300 bg-teal-950/80 border border-teal-800/60 px-3 py-0.5 rounded-full">
            {item.categoryName}
          </span>

          <span
            className={`inline-flex items-center gap-1.5 text-xs font-extrabold px-3 py-0.5 rounded-full border ${
              item.stockCount > 1
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60'
                : 'bg-amber-950/80 text-amber-300 border-amber-800/60'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                item.stockCount > 1 ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
            />
            {item.stockCount > 1 ? `Stock: ${item.stockCount} unid.` : '¡Última unidad!'}
          </span>
        </div>

        {/* Full-Frame Product Image: 1:1 Aspect Ratio edge-to-edge */}
        <div className="relative aspect-square w-full bg-white rounded-2xl border border-slate-700/80 overflow-hidden shadow-lg group">
          <a href={webUrl} target="_blank" rel="noopener noreferrer" className="w-full h-full block">
            <img
              src={
                item.mainImage ||
                'https://cdn.sanity.io/images/kqneikcb/production/1189f3e9e0778c529d6fb8c59b5227fad2dc161d-800x800.png'
              }
              alt={item.cleanTitle}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
              crossOrigin="anonymous"
            />
          </a>
        </div>

        {/* Commercial Title (Clickable Hyperlink to Web) */}
        <div>
          <a
            href={webUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-extrabold text-base text-white leading-snug hover:text-teal-300 transition-colors block line-clamp-2"
          >
            {item.cleanTitle}
          </a>
        </div>

        {/* Technical Specifications Grid */}
        <div className="space-y-2 text-xs bg-[#090F1C] p-3.5 rounded-xl border border-slate-800/80">
          <div className="flex items-start gap-2">
            <span className="font-bold text-slate-400 shrink-0 flex items-center gap-1">
              <Monitor className="w-3.5 h-3.5 text-teal-400" /> Pantalla:
            </span>
            <span className="text-slate-200 font-medium leading-tight">
              {item.specs.display}
            </span>
          </div>

          <div className="flex items-start gap-2">
            <span className="font-bold text-slate-400 shrink-0 flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-teal-400" /> Procesador:
            </span>
            <span className="text-slate-200 font-medium leading-tight">
              {item.specs.cpu}
            </span>
          </div>

          {item.specs.graphics && (
            <div className="flex items-start gap-2">
              <span className="font-bold text-slate-400 shrink-0 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-teal-400" /> Gráficos:
              </span>
              <span className="text-white font-bold leading-tight">
                {item.specs.graphics}
              </span>
            </div>
          )}

          <div className="flex items-start gap-2">
            <span className="font-bold text-slate-400 shrink-0 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-teal-400" /> RAM:
            </span>
            <span className="text-white font-extrabold leading-tight">
              {item.specs.ram}
            </span>
          </div>

          <div className="flex items-start gap-2">
            <span className="font-bold text-slate-400 shrink-0 flex items-center gap-1">
              <HardDrive className="w-3.5 h-3.5 text-teal-400" /> Disco:
            </span>
            <span className="text-white font-extrabold leading-tight">
              {item.specs.storage}
            </span>
          </div>

          <div className="flex items-start gap-2">
            <span className="font-bold text-slate-400 shrink-0 flex items-center gap-1">
              📶 Red:
            </span>
            <span className="text-slate-200 font-medium leading-tight">
              {item.specs.connectivity}
            </span>
          </div>

          {/* Gift Badge */}
          <div className="flex items-start gap-2 pt-1.5 border-t border-slate-800">
            <span className="text-teal-300 font-extrabold bg-teal-950/80 border border-teal-800/60 px-2 py-0.5 rounded text-[11px] leading-tight w-full">
              {item.specs.gift}
            </span>
          </div>

          {/* Inspection Note */}
          <div className="flex items-start gap-2">
            <span className="text-slate-400 font-medium text-[11px]">
              ✨ {item.specs.condition} • 🛡️ {item.specs.warranty}
            </span>
          </div>
        </div>
      </div>

      {/* Card Bottom: Pricing & Call to Action Buttons */}
      <div className="mt-4 pt-3 border-t border-slate-800 space-y-2.5">
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-[11px] text-slate-400 block line-through">
              Precio Regular: S/ {item.compareAtPrice || item.price + 150}
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl sm:text-2xl font-black text-emerald-400">
                S/ {item.price}
              </span>
              <span className="text-xs font-bold text-slate-400">PEN (OFERTA)</span>
            </div>
          </div>
          <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded">
            Emitimos Boleta
          </span>
        </div>

        {/* WhatsApp Order Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BD5A] text-white py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-green-950/30 transition-all hover:scale-[1.01] active:scale-[0.98]"
        >
          <MessageCircle className="w-4 h-4 shrink-0" />
          <span>Separar por WhatsApp (+51 907 674 693)</span>
        </a>

        {/* Link to Official Web Store Product Page */}
        <a
          href={webUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-1.5 text-slate-400 hover:text-teal-300 text-xs py-1 transition-colors group/link"
        >
          <span>Ver ficha completa en www.itechperu.shop</span>
          <ExternalLink className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
        </a>
      </div>
    </div>
  );
}

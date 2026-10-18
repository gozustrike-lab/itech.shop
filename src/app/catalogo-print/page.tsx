'use client';

import { useEffect, useState } from 'react';
import {
  Printer,
  Download,
  ArrowLeft,
  Smartphone,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Package,
  ExternalLink,
  MessageCircle,
  Cpu,
  HardDrive,
  Layers,
  Monitor,
  Gift,
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

// Clean internal order suffixes like " • Ord: 01205" or " - Ord: 950-1"
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

// Generate structured specs based on product details
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

  // Fallback
  return {
    display: 'Pantalla de alta definición con tecnología antirreflejo',
    cpu: 'Procesador multinúcleo de alto rendimiento',
    ram: 'Memoria RAM optimizada para multitarea',
    storage: 'Almacenamiento de alta velocidad',
    connectivity: 'Conectividad inalámbrica Wi-Fi y Bluetooth',
    condition: 'Seminuevo Grado A Certificado',
    gift: '🎁 Accesorios de regalo incluidos',
    warranty: 'Emitimos Boleta de Venta • Testeado en 30 puntos técnicos',
  };
}

export default function CatalogoPrintPage() {
  const [groupedProducts, setGroupedProducts] = useState<GroupedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const projectId = 'kqneikcb';
    const dataset = 'production';
    const query = encodeURIComponent(`*[_type == "product"] | order(order asc) {
      _id, "slug": slug.current, sku, name,
      price, compareAtPrice, description,
      "mainImage": coalesce(mainImage.asset->url, mainImageUrl),
      "category": category->{ name, "slug": slug.current },
      features
    }`);

    fetch(`https://${projectId}.api.sanity.io/v2025-01-01/data/query/${dataset}?query=${query}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.result && data.result.length > 0) {
          const rawItems: ProductItem[] = data.result.filter(
            (item: ProductItem) =>
              !item.name.toLowerCase().includes('pantalla completa') &&
              !item.name.toLowerCase().includes('display original')
          );

          // Deduplicate and group by normalized commercial identity
          const map = new Map<string, GroupedProduct>();

          for (const item of rawItems) {
            const cleanTitle = cleanProductTitle(item.name);
            const specs = extractDetailedSpecs(item);
            // Grouping key based on clean title and price
            const groupKey = `${cleanTitle}__${item.price}`;

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

  const laptops = groupedProducts.filter(
    (p) =>
      p.categorySlug === 'laptops' ||
      p.cleanTitle.toLowerCase().includes('macbook') ||
      p.cleanTitle.toLowerCase().includes('dell')
  );

  const tablets = groupedProducts.filter(
    (p) =>
      p.categorySlug === 'tablets' ||
      p.cleanTitle.toLowerCase().includes('ipad')
  );

  const otherItems = groupedProducts.filter(
    (p) =>
      !laptops.some((l) => l.groupKey === p.groupKey) &&
      !tablets.some((t) => t.groupKey === p.groupKey)
  );

  const totalStockUnits = groupedProducts.reduce((acc, curr) => acc + curr.stockCount, 0);

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 font-sans antialiased selection:bg-teal-500 selection:text-white">
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
          <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-bold text-slate-300">
            Cargando catálogo oficial iTech Perú...
          </p>
        </div>
      ) : (
        <div className="w-full max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-10">
          {/* ═══════════════════════════════════════════════════════════════════ */}
          {/* COVER PAGE: FULL-WIDTH EDGE-TO-EDGE DELUXE DIGITAL SHOWROOM */}
          {/* ═══════════════════════════════════════════════════════════════════ */}
          <div className="w-full rounded-2xl sm:rounded-3xl p-5 sm:p-10 lg:p-12 mb-8 bg-gradient-to-br from-[#0B1220] via-[#0D1B2A] to-[#042427] border border-teal-500/30 shadow-2xl">
            <div>
              {/* Cover Top Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-6 mb-8 gap-4">
                <div className="flex items-center gap-3.5 sm:gap-4">
                  <img
                    src="/icon.png"
                    alt="iTech Perú"
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl shadow-xl shadow-teal-500/20 object-contain bg-slate-900 border border-teal-500/40 p-1 shrink-0"
                  />
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2">
                      iTech <span className="text-teal-400 font-light">PERÚ</span>
                    </h1>
                    <p className="text-[10px] sm:text-[11px] text-teal-300 font-bold tracking-widest uppercase">
                      Tecnología Renovada Certificada • Importaciones Directas USA
                    </p>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <span className="inline-block bg-teal-500/20 text-teal-300 text-xs font-bold px-3.5 py-1.5 rounded-full border border-teal-500/30">
                    CATÁLOGO OFICIAL • {new Date().getFullYear()}
                  </span>
                  <p className="text-xs text-slate-400 mt-1.5">
                    Inventario: <strong className="text-white">{totalStockUnits} Equipos en Stock Físico</strong>
                  </p>
                </div>
              </div>

              {/* Cover Main Content */}
              <div className="my-8 space-y-5">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  STOCK REAL LISTO PARA ENTREGA INMEDIATA
                </span>

                <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                  Apple MacBooks, iPads Pro & <br />
                  <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                    Laptops de Alta Gama Grado A
                  </span>
                </h2>

                <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
                  Todos nuestros equipos son originales y testeados minuciosamente en 30 puntos técnicos (Wi-Fi, altavoces, cámaras, Touch ID/Face ID, pantalla, botones, puertos y sensores). Emitimos Boleta de Venta. Si algún equipo presenta algún detalle estético o de batería de segunda mano, se informa como observación previa y se muestra en vivo en TikTok Live antes de la compra.
                </p>

                {/* Gift Packs Banner */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="flex items-center gap-3 bg-white/10 border border-white/15 px-4 py-3 rounded-2xl">
                    <Gift className="w-6 h-6 text-emerald-400 shrink-0" />
                    <span className="text-xs text-slate-200">
                      🎁 <strong>Laptops & MacBooks:</strong> Incluyen funda portalaptop nueva acolchada de regalo.
                    </span>
                  </div>
                  <div className="flex items-center gap-3 bg-white/10 border border-white/15 px-4 py-3 rounded-2xl">
                    <Gift className="w-6 h-6 text-teal-400 shrink-0" />
                    <span className="text-xs text-slate-200">
                      🎁 <strong>iPads & Tablets:</strong> Incluyen lápiz óptico + soporte ajustable + cable nuevos de regalo.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* TRUST PILLARS */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-y border-white/10 my-4">
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <ShieldCheck className="w-6 h-6 text-emerald-400 mb-2" />
                <h4 className="text-xs font-bold text-white">Emitimos Boleta</h4>
                <p className="text-[11px] text-slate-400">
                  Comprobante legal por tu compra • Total transparencia comercial
                </p>
              </div>
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 mb-2" />
                <h4 className="text-xs font-bold text-white">30 Puntos Test</h4>
                <p className="text-[11px] text-slate-400">
                  Inspección de pantalla, teclado, puertos y batería
                </p>
              </div>
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <Package className="w-6 h-6 text-emerald-400 mb-2" />
                <h4 className="text-xs font-bold text-white">Envíos a Todo el Perú</h4>
                <p className="text-[11px] text-slate-400">
                  Entregas en Lima y envíos vía Shalom y Olva Courier
                </p>
              </div>
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                <Smartphone className="w-6 h-6 text-emerald-400 mb-2" />
                <h4 className="text-xs font-bold text-white">En Vivo en TikTok</h4>
                <p className="text-[11px] text-slate-400">
                  Transmisión en tiempo real mostrando cada equipo físico
                </p>
              </div>
            </div>

            {/* INTERACTIVE COVER FOOTER */}
            <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-300 pt-4 border-t border-white/10 gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-bold text-white">📲 Contacto Directo:</span>
                <a
                  href="https://wa.me/51907674693"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 font-bold hover:underline"
                >
                  +51 907 674 693
                </a>
                <span>•</span>
                <a
                  href="https://wa.me/51924967876"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 font-bold hover:underline"
                >
                  +51 924 967 876
                </a>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href="https://www.tiktok.com/@itechperu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 hover:text-white font-semibold hover:underline"
                >
                  TikTok: <strong>@itechperu</strong>
                </a>
                <span>•</span>
                <a
                  href="https://www.itechperu.shop"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-400 hover:text-emerald-300 font-bold hover:underline"
                >
                  www.itechperu.shop
                </a>
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════════ */}
          {/* SECTION: LAPTOPS & APPLE MACBOOKS */}
          {/* ═══════════════════════════════════════════════════════════════════ */}
          {laptops.length > 0 && (
            <div className="mb-12">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-teal-500 pb-3 mb-6 gap-2">
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-teal-400 animate-pulse" />
                    Laptops & Apple MacBooks ({laptops.length} Modelos • {laptops.reduce((a, b) => a + b.stockCount, 0)} Unidades)
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Equipos de alto rendimiento para programación, diseño, oficina y universidad
                  </p>
                </div>
                <span className="text-xs font-bold text-teal-300 bg-teal-950/80 px-3 py-1 rounded-full border border-teal-700/60 self-start sm:self-auto">
                  🎁 Incluye Funda Portalaptop de Regalo
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {laptops.map((item) => (
                  <CatalogProductCard key={item.groupKey} item={item} />
                ))}
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════ */}
          {/* SECTION: APPLE IPADS & TABLETS */}
          {/* ═══════════════════════════════════════════════════════════════════ */}
          {tablets.length > 0 && (
            <div className="mb-12">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-teal-500 pb-3 mb-6 gap-2">
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-teal-400 animate-pulse" />
                    Apple iPads & Tablets ({tablets.length} Modelos • {tablets.reduce((a, b) => a + b.stockCount, 0)} Unidades)
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Pantallas Retina ultranítidas para estudio, diseño digital, streaming y productividad
                  </p>
                </div>
                <span className="text-xs font-bold text-teal-300 bg-teal-950/80 px-3 py-1 rounded-full border border-teal-700/60 self-start sm:self-auto">
                  🎁 Incluye Pack: Lápiz + Soporte + Cable
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {tablets.map((item) => (
                  <CatalogProductCard key={item.groupKey} item={item} />
                ))}
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════ */}
          {/* SECTION: ACCESSORIES & HARDWARE */}
          {/* ═══════════════════════════════════════════════════════════════════ */}
          {otherItems.length > 0 && (
            <div className="mb-12">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-slate-700 pb-3 mb-6 gap-2">
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-slate-400" />
                    Accesorios & Cargadores ({otherItems.length} Artículos)
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Cargadores rápidos certificados y componentes de alta calidad
                  </p>
                </div>
                <span className="text-xs font-bold text-slate-300 bg-slate-800 px-3 py-1 rounded-full border border-slate-700 self-start sm:self-auto">
                  100% Nuevos en Caja
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {otherItems.map((item) => (
                  <CatalogProductCard key={item.groupKey} item={item} />
                ))}
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════════ */}
          {/* DELUXE DIGITAL FOOTER */}
          {/* ═══════════════════════════════════════════════════════════════════ */}
          <div className="border-t border-slate-800 pt-8 mt-12 text-center text-xs text-slate-400 space-y-2.5">
            <div className="flex flex-wrap items-center justify-center gap-4 font-bold text-slate-300">
              <a href="https://www.itechperu.shop" target="_blank" rel="noopener noreferrer" className="hover:text-teal-400 transition-colors">
                🌐 www.itechperu.shop
              </a>
              <span>•</span>
              <a href="https://wa.me/51907674693" target="_blank" rel="noopener noreferrer" className="hover:text-teal-400 transition-colors">
                📲 WhatsApp Ventas: +51 907 674 693 / +51 924 967 876
              </a>
              <span>•</span>
              <a href="https://www.tiktok.com/@itechperu" target="_blank" rel="noopener noreferrer" className="hover:text-teal-400 transition-colors">
                🎵 TikTok Live: @itechperu
              </a>
            </div>
            <p className="text-slate-500">
              iTech Perú • Importaciones Directas USA • Precios en Soles (PEN) sujetos a disponibilidad de inventario.
            </p>
            <p className="text-[11px] text-slate-500">
              Los enlaces y números de este catálogo son interactivos. Haz clic en cualquier producto o botón de WhatsApp para separar tu equipo en vivo.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Ultra-Premium Product Card Component with Big 1080x1080 Image & Complete Specs
function CatalogProductCard({ item }: { item: GroupedProduct }) {
  const whatsappUrl = `https://wa.me/51907674693?text=${encodeURIComponent(
    `Hola iTech Perú! Vi en el Catálogo el equipo: *${item.cleanTitle}* (Precio Oferta: S/ ${item.price} PEN). Deseo coordinar la compra y verificar la disponibilidad inmediata.`
  )}`;

  const webUrl = `https://www.itechperu.shop/coleccion/${item.slug}`;

  return (
    <div className="bg-[#0D1525] text-white rounded-2xl border border-slate-800/90 hover:border-teal-500/50 p-4 sm:p-5 shadow-xl flex flex-col justify-between transition-all duration-300">
      <div className="space-y-4">
        {/* Top Badges: Category & Real Stock Count */}
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
            {item.stockCount > 1
              ? `Stock: ${item.stockCount} unid.`
              : '¡Última unidad!'}
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

        {/* Detailed Technical Specifications Grid (Zero Truncation) */}
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
              <Layers className="w-3.5 h-3.5 text-teal-400" /> Memoria RAM:
            </span>
            <span className="text-white font-extrabold leading-tight">
              {item.specs.ram}
            </span>
          </div>

          <div className="flex items-start gap-2">
            <span className="font-bold text-slate-400 shrink-0 flex items-center gap-1">
              <HardDrive className="w-3.5 h-3.5 text-teal-400" /> Disco / SSD:
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

          {/* Gift Bundle Badge */}
          <div className="flex items-start gap-2 pt-1.5 border-t border-slate-800">
            <span className="text-teal-300 font-extrabold bg-teal-950/80 border border-teal-800/60 px-2 py-0.5 rounded text-[11px] leading-tight w-full">
              {item.specs.gift}
            </span>
          </div>

          {/* Warranty & Condition */}
          <div className="flex items-start gap-2">
            <span className="text-slate-400 font-medium text-[11px]">
              ✨ {item.specs.condition} • 🛡️ {item.specs.warranty}
            </span>
          </div>
        </div>
      </div>

      {/* Pricing & Interactive Hyperlinks */}
      <div className="pt-4 border-t border-slate-800/80 mt-4 space-y-3">
        <div className="flex items-baseline justify-between">
          <div>
            {item.compareAtPrice && item.compareAtPrice > item.price && (
              <span className="text-xs text-slate-400 line-through block font-medium">
                Precio Regular: S/ {Number(item.compareAtPrice).toLocaleString('es-PE')}
              </span>
            )}
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-teal-400">
                S/ {Number(item.price || 0).toLocaleString('es-PE')}
              </span>
              <span className="text-xs font-black text-slate-400 uppercase">
                PEN (Oferta)
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-300 bg-teal-950/80 border border-teal-800/60 px-2.5 py-1 rounded-md">
              <CheckCircle2 className="h-3 w-3 text-teal-400" />
              Emitimos Boleta
            </span>
          </div>
        </div>

        {/* Primary Clickable WhatsApp CTA (Active Hyperlink in PDF & Web) */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white font-black text-xs tracking-wide shadow-lg shadow-green-500/15 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <MessageCircle className="w-4 h-4 flex-shrink-0" />
          <span>📲 Separar por WhatsApp (+51 907 674 693)</span>
        </a>

        {/* Secondary Clickable Web Link */}
        <a
          href={webUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1 text-[11px] text-slate-400 hover:text-teal-400 font-semibold text-center hover:underline transition-colors py-0.5"
        >
          <span>🌐 Ver ficha en web www.itechperu.shop</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}

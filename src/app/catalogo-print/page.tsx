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
} from 'lucide-react';

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

export default function CatalogoPrintPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/catalog/export-whatsapp')
      .then(() => {
        // Fetch products via internal Sanity query endpoint or API
        return fetch('/api/store?type=products').catch(() => null);
      })
      .catch(() => null);

    // Fetch from Sanity API directly for fast client-side rendering
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
          setProducts(data.result);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const laptops = products.filter(
    (p) =>
      p.category?.slug === 'laptops' ||
      p.name.toLowerCase().includes('macbook') ||
      p.name.toLowerCase().includes('dell')
  );
  const tablets = products.filter(
    (p) =>
      p.category?.slug === 'tablets' ||
      p.name.toLowerCase().includes('ipad')
  );
  const otherItems = products.filter(
    (p) =>
      !laptops.some((l) => l._id === p._id) &&
      !tablets.some((t) => t._id === p._id)
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 print:bg-white print:text-black">
      {/* Floating Action Bar (Hidden during print) */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-3 bg-slate-900/90 backdrop-blur-md text-white px-4 py-2.5 rounded-full shadow-2xl border border-white/10 print:hidden">
        <a
          href="/"
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors pr-2 border-r border-slate-700"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Volver a la Web
        </a>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95"
        >
          <Printer className="w-3.5 h-3.5" />
          Guardar como PDF / Imprimir
        </button>
        <a
          href="/api/catalog/export-whatsapp"
          className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white transition-colors pl-2"
        >
          <Download className="w-3.5 h-3.5" />
          CSV WhatsApp
        </a>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-sm font-semibold text-slate-600">
            Cargando catálogo oficial iTech Perú...
          </p>
        </div>
      ) : (
        <div className="max-w-[210mm] mx-auto p-4 sm:p-8 print:p-0 print:max-w-none">
          {/* COVER PAGE (PAGE 1) */}
          <div className="page-break-after bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white rounded-3xl p-8 sm:p-12 mb-8 print:mb-0 print:rounded-none print:min-h-[297mm] flex flex-col justify-between shadow-2xl print:shadow-none">
            <div>
              <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                    <Smartphone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-1.5">
                      iTech <span className="text-emerald-400 font-light">PERU</span>
                    </h1>
                    <p className="text-[11px] text-emerald-300/80 font-medium tracking-widest uppercase">
                      Tecnología Renovada Certificada
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-block bg-emerald-500/20 text-emerald-300 text-[11px] font-bold px-3 py-1 rounded-full border border-emerald-500/30">
                    CATÁLOGO OFICIAL • {new Date().getFullYear()}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1">
                    www.itechperu.shop
                  </p>
                </div>
              </div>

              <div className="my-10 text-center sm:text-left">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3 block">
                  Inventario en Físico Listo para Entrega
                </span>
                <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight mb-4">
                  Laptops, MacBooks, iPads & Accesorios Grado A
                </h2>
                <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed mb-6">
                  Todos nuestros equipos son originales, testeados en 30 puntos
                  técnicos, con batería en óptimo estado y garantía escrita.
                  Exhibidos en directo en TikTok Live.
                </p>

                <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 px-4 py-2 rounded-xl text-xs text-white">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>
                    🎁 <strong>Promoción Activa:</strong> Todas las laptops y
                    MacBooks incluyen funda portalaptop nueva de regalo.
                  </span>
                </div>
              </div>
            </div>

            {/* TRUST PILLARS */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-y border-white/10 my-6">
              <div className="bg-white/5 rounded-2xl p-3.5 border border-white/10">
                <ShieldCheck className="w-5 h-5 text-emerald-400 mb-2" />
                <h4 className="text-xs font-bold text-white">Garantía Real</h4>
                <p className="text-[10px] text-slate-400">
                  Respaldo técnico directo por 12 meses
                </p>
              </div>
              <div className="bg-white/5 rounded-2xl p-3.5 border border-white/10">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 mb-2" />
                <h4 className="text-xs font-bold text-white">30 Puntos Test</h4>
                <p className="text-[10px] text-slate-400">
                  Pantalla, teclado, puertos y batería
                </p>
              </div>
              <div className="bg-white/5 rounded-2xl p-3.5 border border-white/10">
                <Package className="w-5 h-5 text-emerald-400 mb-2" />
                <h4 className="text-xs font-bold text-white">Envíos Perú</h4>
                <p className="text-[10px] text-slate-400">
                  Olva Courier y Shalom a todo el país
                </p>
              </div>
              <div className="bg-white/5 rounded-2xl p-3.5 border border-white/10">
                <Smartphone className="w-5 h-5 text-emerald-400 mb-2" />
                <h4 className="text-xs font-bold text-white">TikTok Live</h4>
                <p className="text-[10px] text-slate-400">
                  Muestra en tiempo real por streaming
                </p>
              </div>
            </div>

            {/* FOOTER OF COVER */}
            <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 pt-4">
              <div>
                <strong>Contacto Directo WhatsApp:</strong> +51 907 674 693 / +51 924 967 876
              </div>
              <div className="mt-2 sm:mt-0">
                TikTok: <strong>@itechperu</strong> • Web: <strong>www.itechperu.shop</strong>
              </div>
            </div>
          </div>

          {/* SECTION: LAPTOPS & MACBOOKS */}
          {laptops.length > 0 && (
            <div className="mb-10 print:mb-6">
              <div className="flex items-center justify-between border-b-2 border-emerald-600 pb-2 mb-6">
                <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                  Laptops & Apple MacBooks ({laptops.length})
                </h3>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                  🎁 Incluye funda portalaptop nueva
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 print:grid-cols-2 print:gap-3">
                {laptops.map((item) => (
                  <ProductCard key={item._id} item={item} />
                ))}
              </div>
            </div>
          )}

          {/* SECTION: TABLETS & IPADS */}
          {tablets.length > 0 && (
            <div className="mb-10 print:mb-6">
              <div className="flex items-center justify-between border-b-2 border-teal-600 pb-2 mb-6">
                <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />
                  Apple iPads & Tablets ({tablets.length})
                </h3>
                <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-3 py-1 rounded-full">
                  100% Originales • Pantalla Retina
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 print:grid-cols-2 print:gap-3">
                {tablets.map((item) => (
                  <ProductCard key={item._id} item={item} />
                ))}
              </div>
            </div>
          )}

          {/* SECTION: ACCESSORIES & OTHERS */}
          {otherItems.length > 0 && (
            <div className="mb-10 print:mb-6">
              <div className="flex items-center justify-between border-b-2 border-slate-600 pb-2 mb-6">
                <h3 className="text-lg font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-600" />
                  Accesorios & Repuestos ({otherItems.length})
                </h3>
                <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
                  Garantizados
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 print:grid-cols-2 print:gap-3">
                {otherItems.map((item) => (
                  <ProductCard key={item._id} item={item} />
                ))}
              </div>
            </div>
          )}

          {/* PRINT FOOTER */}
          <div className="border-t border-slate-200 pt-6 mt-8 text-center text-xs text-slate-500 print:text-[10px]">
            <p className="font-semibold text-slate-700">
              iTech Perú • RUC 20608546193 • www.itechperu.shop
            </p>
            <p className="mt-1">
              Precios sujetos a disponibilidad de stock. Fotos referenciales del modelo.
              El equipo físico exacto se muestra en vivo por nuestro TikTok Live.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function ProductCard({ item }: { item: ProductItem }) {
  const isLaptop =
    item.category?.slug === 'laptops' ||
    item.name.toLowerCase().includes('macbook') ||
    item.name.toLowerCase().includes('dell');

  return (
    <div className="catalog-print-card bg-white rounded-2xl border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between print:rounded-xl print:border-slate-300 print:shadow-none print:break-inside-avoid">
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
            {item.category?.name || 'Tecnología'}
          </span>
          {item.sku && (
            <span className="text-[9px] font-mono text-slate-400">
              SKU: {item.sku}
            </span>
          )}
        </div>

        <div className="relative aspect-video rounded-xl bg-slate-50 border border-slate-100 overflow-hidden mb-3 flex items-center justify-center p-2">
          <img
            src={item.mainImage || 'https://cdn.sanity.io/images/kqneikcb/production/1189f3e9e0778c529d6fb8c59b5227fad2dc161d-800x800.png'}
            alt={item.name}
            className="max-h-36 max-w-full object-contain"
            loading="lazy"
          />
        </div>

        <h4 className="font-bold text-sm text-slate-900 leading-snug mb-1.5 line-clamp-2">
          {item.name}
        </h4>

        {item.description && (
          <p className="text-xs text-slate-500 mb-3 line-clamp-3 leading-relaxed">
            {item.description}
          </p>
        )}
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
        <div>
          <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">
            Precio Especial
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-black text-emerald-600">
              S/ {Number(item.price || 0).toLocaleString('es-PE')}
            </span>
            {item.compareAtPrice && item.compareAtPrice > item.price && (
              <span className="text-xs text-slate-400 line-through">
                S/ {Number(item.compareAtPrice).toLocaleString('es-PE')}
              </span>
            )}
          </div>
        </div>

        {isLaptop && (
          <div className="text-right">
            <span className="text-[9px] font-bold text-amber-700 bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-full">
              🎁 Funda gratis
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

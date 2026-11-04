// ============================================================
// Maia Store — Shared Data Layer
// Products, categories, testimonials, payment methods, etc.
// Auto-generated from scripts/import-products.mjs
// ============================================================

export interface ProductImage {
  original: string;
  optimized: string;
  thumbnail: string;
}

export interface Product {
  id: number;
  slug: string;
  sku: string;
  name: string;
  fullName: string;
  price: number;
  image: string;
  imageSecondary?: string;
  images: ProductImage[];
  category: string;
  categoryLabel: string;
  collection: { id: string; name: string };
  type: { id: string; name: string };
  color: { name: string; code: string | null };
  size: number | null;
  description: string;
  longDescription: string;
  features: string[];
  rating: number;
  reviews: number;
  inStock: boolean;
}

export interface BankAccount {
  bank: string;
  accountType: string;
  number: string;
  holder: string;
  logo: string;
}

export interface QRPayment {
  id: string;
  label: string;
  color: string;
  bgColor: string;
  number: string;
  holder: string;
}

export interface Category {
  id: string;
  label: string;
  slug: string;
  count: number;
}

export interface Testimonial {
  name: string;
  location: string;
  text: string;
  rating: number;
}

export interface PaymentMethod {
  id: string;
  title: string;
  description: string;
  cta: string;
  href: string;
  steps: string[];
}

export interface FeatureValue {
  icon: string;
  title: string;
  description: string;
}

// ─── Products (Real — Juego Botón Collection) ──────────────────

export const products: Product[] = [];
export const testimonials: any[] = [];
export const categories: Category[] = [];

export const paymentMethods: PaymentMethod[] = [
  {
    id: 'whatsapp',
    title: 'WhatsApp Directo',
    description:
      'Coordina tu pedido de forma personalizada. Te enviamos fotos reales en alta resolución del equipo, video test y confirmación inmediata con tu asesor asignado.',
    cta: 'Chatear por WhatsApp',
    href: 'https://wa.me/51907674693?text=Hola%20iTech%20Per%C3%BA!%20Quisiera%20hacer%20un%20pedido',
    steps: [
      'Escríbenos al WhatsApp oficial (+51 907 674 693)',
      'Cuéntanos qué equipo o accesorio deseas separar',
      'Recibe fotos y video demostrativo del equipo exacto',
      'Elige tu método de pago preferido (Yape o BCP)',
      'Coordinamos tu entrega o despacho seguro por Shalom con Boleta de Venta',
    ],
  },
  {
    id: 'yape-plin',
    title: 'Yape / Plin',
    description:
      'Transferencias móviles inmediatas sin comisiones a nivel nacional. Escanea nuestro QR oficial o transfiere al número registrado a nombre de la empresa.',
    cta: 'Pedir QR por WhatsApp',
    href: 'https://wa.me/51907674693?text=Hola%20iTech%20Per%C3%BA!%20Deseo%20el%20c%C3%B3digo%20QR%20para%20pagar%20por%20Yape%20/%20Plin',
    steps: [
      'Confirma tu pedido y monto final por WhatsApp',
      'Solicita el código QR o número oficial (907 674 693)',
      'Realiza el Yapeo o Plin desde tu aplicativo bancario',
      'Envía la captura de tu comprobante al chat',
      'Validamos al instante y emitimos tu Boleta de Venta',
    ],
  },
  {
    id: 'bcp',
    title: 'Transferencia BCP',
    description:
      'Pago directo e inmediato mediante Banca Móvil BCP, Yape a cuenta BCP o ventanilla / agente BCP a nombre de nuestra razón social oficial.',
    cta: 'Solicitar Cuenta BCP',
    href: 'https://wa.me/51907674693?text=Hola%20iTech%20Per%C3%BA!%20Por%20favor%20br%C3%ADndenme%20los%20datos%20de%20la%20Cuenta%20BCP',
    steps: [
      'Solicita el número de Cuenta Corriente BCP en Soles por WhatsApp',
      'Transfiere desde tu app BCP o acércate a cualquier agente BCP',
      'Envía la foto o captura del voucher de depósito',
      'Verificamos el abono en minutos y generamos tu Boleta de Venta',
      'Embalamos tu equipo con protección hermética para despacho Shalom',
    ],
  },
  {
    id: 'interbancaria',
    title: 'Transferencia Interbancaria (CCI)',
    description:
      'Paga desde cualquier entidad financiera del Perú (BBVA, Interbank, Scotiabank, BanBif, Caja Piura, etc.) vía Código de Cuenta Interbancario (CCI) de forma segura.',
    cta: 'Solicitar CCI Interbancario',
    href: 'https://wa.me/51907674693?text=Hola%20iTech%20Per%C3%BA!%20Por%20favor%20br%C3%ADndenme%20el%20c%C3%B3digo%20CCI%20para%20transferencia%20interbancaria',
    steps: [
      'Solicita nuestro Código de Cuenta Interbancario (CCI) oficial',
      'Realiza la transferencia desde la app o web de tu banco habitual',
      'Envía la constancia de la transferencia interbancaria por WhatsApp',
      'Confirmamos la acreditación interbancaria (inmediata o diferida)',
      'Procesamos el envío Shalom con tu número de guía para seguimiento',
    ],
  },
];

// ─── Helper Functions ────────────────────────────────────────

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(categoryId: string): Product[] {
  if (categoryId === 'todos') return products;
  return products.filter((p) => p.category === categoryId);
}

export function getProductsByCollection(collectionId: string): Product[] {
  return products.filter((p) => p.collection.id === collectionId);
}

export function getProductVariants(currentProduct: Product): Product[] {
  // Group by same collection + same type (different colors are variants)
  return products.filter(
    (p) =>
      p.collection.id === currentProduct.collection.id &&
      p.type.id === currentProduct.type.id
  );
}

export function getRelatedProducts(currentId: number, limit = 4): Product[] {
  const current = products.find((p) => p.id === currentId);
  if (!current) return products.slice(0, limit);
  const sameCategory = products.filter(
    (p) => p.category === current.category && p.id !== currentId
  );
  if (sameCategory.length >= limit) return sameCategory.slice(0, limit);
  const others = products.filter(
    (p) => p.category !== current.category && p.id !== currentId
  );
  return [...sameCategory, ...others].slice(0, limit);
}

export function formatPrice(price: number): string {
  return `S/. ${price.toFixed(2)}`;
}

export function generateWhatsAppLink(
  product: Product,
  options?: { quantity?: number; productUrl?: string; phone?: string; inStock?: boolean },
): string {
  const quantity = options?.quantity ?? 1;
  const productUrl = options?.productUrl || (typeof window !== 'undefined' ? window.location.href : '');
  const phone = (options?.phone || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '51907674693').replace(/\D/g, '');
  const cleanTitle = (product.name || product.fullName || '')
    .replace(/\s*[•\-]\s*Ord:\s*[\w\-]+/gi, '')
    .replace(/\\"/g, '"')
    .trim();

  const isOutOfStock = options?.inStock === false || (product as any)?.inStock === false;

  const lines = isOutOfStock
    ? [
        '¡Hola iTech Perú! 🇵🇪 Vi este equipo en su tienda oficial:',
        '',
        `💻 *Equipo:* ${cleanTitle}`,
        `💰 *Precio de referencia:* ${formatPrice(product.price)}`,
        productUrl ? `🔗 *Ficha oficial:* ${productUrl}` : '',
        '',
        '⏳ *Disponibilidad:* Sin Stock (Reserva disponible)',
        '📦 *Despacho:* Envíos 100% seguros por Shalom a todo el Perú con Boleta de Venta',
        '',
        '¿Cuándo tendrán stock disponible o cómo puedo reservarlo con anticipación?'
      ]
    : [
        '¡Hola iTech Perú! 🇵🇪 Deseo coordinar la compra de este equipo:',
        '',
        `💻 *Equipo:* ${cleanTitle}`,
        `💰 *Precio:* ${formatPrice(product.price)}`,
        quantity > 1 ? `🔢 *Cantidad:* ${quantity}` : '',
        productUrl ? `🔗 *Ficha oficial:* ${productUrl}` : '',
        '',
        '⚡ *Disponibilidad:* En stock para entrega inmediata',
        '📦 *Despacho:* Envío 100% seguro por Shalom a todo el Perú con Boleta de Venta',
        '',
        '¿Me confirman stock y datos de pago para coordinar la entrega o despacho por Shalom?'
      ];

  return `https://wa.me/${phone}?text=${encodeURIComponent(lines.filter(Boolean).join('\n'))}`;
}

export function generateWhatsAppGeneral(phone: string = '51907674693'): string {
  const cleanPhone = phone.replace(/\D/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent('¡Hola iTech Perú! Quisiera hacer una consulta sobre sus equipos.')}`;
}

// ─── Bank Accounts ────────────────────────────────────────────

export const bankAccounts: BankAccount[] = [
  {
    bank: 'Banco de Crédito del Perú (BCP)',
    accountType: 'Cuenta Corriente en Soles',
    number: '193-2845671-0-42',
    holder: 'iTech Perú E.I.R.L.',
    logo: '🏦',
  },
  {
    bank: 'Transferencia Interbancaria (Cualquier Banco)',
    accountType: 'Código de Cuenta Interbancario (CCI Nacional)',
    number: '002-193-002845671042-18',
    holder: 'iTech Perú E.I.R.L.',
    logo: '🇵🇪',
  },
];

// ─── QR Payments (Yape / Plin) ──────────────────────────────

export const qrPayments: QRPayment[] = [
  {
    id: 'yape',
    label: 'Yape',
    color: '#742DB5',
    bgColor: 'bg-purple-600',
    number: '907 674 693',
    holder: 'iTech Peru E.I.R.L.',
  },
  {
    id: 'plin',
    label: 'Plin',
    color: '#00C853',
    bgColor: 'bg-green-500',
    number: '907 674 693',
    holder: 'iTech Peru E.I.R.L.',
  },
];

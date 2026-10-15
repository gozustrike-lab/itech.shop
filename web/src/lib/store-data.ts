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
      'Haz tu pedido directamente por WhatsApp y recibe atención personalizada. Te enviamos fotos y videos del equipo, estado de batería y confirmación inmediata.',
    cta: 'Chatear Ahora',
    href: 'https://wa.me/51999888777?text=Hola%20iTech%20Peru!%20Quisiera%20hacer%20un%20pedido',
    steps: [
      'Escríbenos por WhatsApp al +51 999 888 777',
      'Cuéntanos qué equipo o accesorio te interesa',
      'Te enviamos fotos reales, salud de batería y detalles',
      'Confirma tu pedido y método de pago',
      'Recibe tu equipo en la puerta de tu casa con garantía',
    ],
  },
  {
    id: 'tarjeta',
    title: 'Tarjeta de Crédito/Débito',
    description:
      'Paga de forma segura con tu tarjeta Visa, Mastercard o American Express a través de nuestra pasarela de pagos en línea certificada con encriptación SSL de 256 bits. Tus datos están 100% protegidos.',
    cta: 'Pagar en Línea',
    href: '#',
    steps: [
      'Selecciona el equipo que deseas comprar',
      'Elige "Pagar con Tarjeta" como método',
      'Ingresa los datos de tu tarjeta de forma segura',
      'Recibe confirmación de pago al instante',
      'Preparamos tu envío de inmediato',
    ],
  },
  {
    id: 'yape-plin',
    title: 'Yape / Plin',
    description:
      'Transferencias instantáneas a través de Yape o Plin, las plataformas de pago móvil más populares del Perú. Solo escanea el código QR o realiza la transferencia directamente desde tu celular.',
    cta: 'Escanear QR',
    href: '#',
    steps: [
      'Confirma tu pedido por WhatsApp',
      'Te enviamos el código QR de Yape/Plin',
      'Escanea y realiza la transferencia',
      'Envíanos el comprobante por chat',
      'Procesamos tu pedido de inmediato',
    ],
  },
  {
    id: 'transferencia',
    title: 'Transferencia Bancaria',
    description:
      'Realiza tu pago por transferencia bancaria a nuestras cuentas en BCP, Interbank o Banco de la Nación. Una vez confirmada la transferencia, envíanos el comprobante por WhatsApp para procesar tu pedido.',
    cta: 'Ver Cuentas',
    href: 'https://wa.me/51999888777?text=Hola!%20Necesito%20los%20datos%20para%20transferencia%20bancaria',
    steps: [
      'Solicita los datos bancarios por WhatsApp',
      'Realiza la transferencia desde tu banca',
      'Envía la captura del comprobante',
      'Verificamos el depósito (puede tomar 1-2 horas)',
      'Despachamos tu pedido una vez confirmado',
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
  options?: { quantity?: number; productUrl?: string; phone?: string },
): string {
  const quantity = options?.quantity ?? 1;
  const productUrl = options?.productUrl || (typeof window !== 'undefined' ? window.location.href : '');
  const phone = (options?.phone || '51999888777').replace(/\D/g, '');

  const message = [
    `🛍️ Producto: ${product.name || product.fullName}`,
    `💰 Precio: ${formatPrice(product.price)}`,
    `🔢 Cantidad: ${quantity}`,
    ``,
    `🔗 ${productUrl}`,
    ``,
    `¡Hola iTech Peru! Estoy interesado en este equipo con garantía. ¿Tienen disponibilidad?`,
  ].join('\n');

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function generateWhatsAppGeneral(phone: string = '51999888777'): string {
  const cleanPhone = phone.replace(/\D/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent('Hola iTech Peru! Quisiera hacer una consulta')}`;
}

// ─── Bank Accounts ────────────────────────────────────────────

export const bankAccounts: BankAccount[] = [
  {
    bank: 'BCP',
    accountType: 'Cuenta Corriente en Soles',
    number: '193-2845671-0-42',
    holder: 'iTech Peru E.I.R.L.',
    logo: '🏦',
  },
  {
    bank: 'Interbank',
    accountType: 'Cuenta Ahorro en Soles',
    number: '2001-0056-7890-12',
    holder: 'iTech Peru E.I.R.L.',
    logo: '🏦',
  },
  {
    bank: 'Banco de la Nación',
    accountType: 'Cuenta Corriente Nacional',
    number: '00-067-123456',
    holder: 'iTech Peru E.I.R.L.',
    logo: '🏦',
  },
];

// ─── QR Payments (Yape / Plin) ──────────────────────────────

export const qrPayments: QRPayment[] = [
  {
    id: 'yape',
    label: 'Yape',
    color: '#742DB5',
    bgColor: 'bg-purple-600',
    number: '999 888 777',
    holder: 'iTech Peru E.I.R.L.',
  },
  {
    id: 'plin',
    label: 'Plin',
    color: '#00C853',
    bgColor: 'bg-green-500',
    number: '999 888 777',
    holder: 'iTech Peru E.I.R.L.',
  },
];

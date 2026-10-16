// ============================================================
// iTech Peru — Multi-Angle Product Image Resolver
// Maps each model to its genuine front, angle, and detail photos.
// ============================================================

export interface ProductImageSet {
  main: string;
  secondary: string;
  tertiary: string;
  all: string[];
}

export const CATALOG_BASE_URL = 'https://www.itechperu.shop';

export function resolveModelKey(rawName: string = '', slug: string = ''): string {
  // First strip order id from name to avoid numbers in "Ord: 15918" matching screen sizes
  const name = rawName.replace(/\s*[•\-]\s*Ord:\s*[\w\-]+/gi, '').toLowerCase();

  if (name.includes('cargador') || name.includes('96w') || name.includes('adapter')) {
    return 'charger-96w';
  }
  if (name.includes('dell') || name.includes('latitude') || name.includes('3330')) {
    return 'dell-latitude-3330';
  }
  if (name.includes('12.9')) {
    return 'ipad-pro-129';
  }
  if (name.includes('mini 5') || name.includes('mini')) {
    return 'ipad-mini-5';
  }
  if (name.includes('air 3') || (name.includes('air') && (name.includes('3ra') || name.includes('10.5')))) {
    return 'ipad-air-3';
  }
  if (name.includes('9na') || name.includes('9th') || name.includes('10.2')) {
    return 'ipad-9';
  }
  if (name.includes('10.5') && (name.includes('pro') || name.includes('promotion'))) {
    return 'ipad-pro-105';
  }

  // MacBooks: look specifically for screen size patterns
  if (name.includes('macbook') || name.includes('a2141') || name.includes('display') || name.includes('pantalla')) {
    if (
      name.includes('16"') ||
      name.includes('16 pulg') ||
      name.includes('16\'') ||
      name.includes('16\\"') ||
      name.includes('a2141')
    ) {
      return 'macbook-pro-16';
    }
    if (
      name.includes('15.4') ||
      name.includes('15"') ||
      name.includes('15 pulg') ||
      name.includes('15\'') ||
      name.includes('15\\"')
    ) {
      return 'macbook-pro-15';
    }
    if (
      name.includes('13.3') ||
      name.includes('13"') ||
      name.includes('13 pulg') ||
      name.includes('13\'') ||
      name.includes('13\\"')
    ) {
      return 'macbook-pro-13';
    }
    if (/\b16\b/.test(name) && !name.includes('16gb')) return 'macbook-pro-16';
    if (/\b15\b/.test(name)) return 'macbook-pro-15';
    if (/\b13\b/.test(name)) return 'macbook-pro-13';
    return 'macbook-pro-16';
  }

  return 'charger-96w';
}

export function getProductImages(
  product: {
    name?: string;
    cleanName?: string;
    slug?: string;
    mainImage?: string | null;
    secondaryImage?: string | null;
    gallery?: Array<any>;
  },
  options: { absolute?: boolean } = {}
): ProductImageSet {
  const modelKey = resolveModelKey(product.name || product.cleanName || '', product.slug || '');
  const prefix = options.absolute ? CATALOG_BASE_URL : '';

  let fallbackViews: [string, string, string] = [
    `${prefix}/images/placeholder.webp`,
    `${prefix}/images/placeholder.webp`,
    `${prefix}/images/placeholder.webp`,
  ];

  if (modelKey) {
    fallbackViews = [
      `${prefix}/catalog/${modelKey}-1.png`,
      `${prefix}/catalog/${modelKey}-2.png`,
      `${prefix}/catalog/${modelKey}-3.png`,
    ];
  }

  // Determine main image
  let main = product.mainImage || fallbackViews[0];

  // Determine secondary image (never let it be identical to main or empty)
  let secondary = product.secondaryImage || fallbackViews[1];
  if (!secondary || secondary === main) {
    secondary = fallbackViews[1];
  }

  // Determine tertiary image
  let tertiary = fallbackViews[2];
  if (product.gallery && product.gallery.length > 1) {
    const item = product.gallery[1];
    const galleryCandidate = item?.url || item?.original || (typeof item === 'string' ? item : null);
    if (galleryCandidate && galleryCandidate !== main && galleryCandidate !== secondary) {
      tertiary = galleryCandidate;
    }
  }

  // In case fallbackViews were used and need absolute prefix:
  if (options.absolute) {
    if (main.startsWith('/')) main = `${CATALOG_BASE_URL}${main}`;
    if (secondary.startsWith('/')) secondary = `${CATALOG_BASE_URL}${secondary}`;
    if (tertiary.startsWith('/')) tertiary = `${CATALOG_BASE_URL}${tertiary}`;
  }

  return {
    main,
    secondary,
    tertiary,
    all: [main, secondary, tertiary],
  };
}

// ============================================================
// iTech Peru — Generate Meta & WhatsApp Business Scheduled Feed
// Generates public/catalogo-whatsapp.csv
// ============================================================

const fs = require('fs');
const path = require('path');

function resolveModelKey(rawName = '', slug = '') {
  const name = rawName.replace(/\s*[•\-]\s*Ord:\s*[\w\-]+/gi, '').toLowerCase();

  if (name.includes('cargador') || name.includes('96w') || name.includes('adapter')) return 'charger-96w';
  if (name.includes('dell') || name.includes('latitude') || name.includes('3330')) return 'dell-latitude-3330';
  if (name.includes('12.9')) return 'ipad-pro-129';
  if (name.includes('mini 5') || name.includes('mini')) return 'ipad-mini-5';
  if (name.includes('air 3') || (name.includes('air') && (name.includes('3ra') || name.includes('10.5')))) return 'ipad-air-3';
  if (name.includes('9na') || name.includes('9th') || name.includes('10.2')) return 'ipad-9';
  if (name.includes('10.5') && (name.includes('pro') || name.includes('promotion'))) return 'ipad-pro-105';

  if (name.includes('macbook') || name.includes('a2141') || name.includes('display') || name.includes('pantalla')) {
    if (name.includes('16"') || name.includes('16 pulg') || name.includes('16\'') || name.includes('16\\"') || name.includes('a2141')) return 'macbook-pro-16';
    if (name.includes('15.4') || name.includes('15"') || name.includes('15 pulg') || name.includes('15\'') || name.includes('15\\"')) return 'macbook-pro-15';
    if (name.includes('13.3') || name.includes('13"') || name.includes('13 pulg') || name.includes('13\'') || name.includes('13\\"')) return 'macbook-pro-13';
    if (/\b16\b/.test(name) && !name.includes('16gb')) return 'macbook-pro-16';
    if (/\b15\b/.test(name)) return 'macbook-pro-15';
    if (/\b13\b/.test(name)) return 'macbook-pro-13';
    return 'macbook-pro-16';
  }
  return 'charger-96w';
}

async function main() {
  const STORE_BASE_URL = 'https://www.itechperu.shop';
  const query = encodeURIComponent(`*[_type == "product"] | order(order asc) {
    _id, "slug": slug.current, sku, name,
    price, compareAtPrice, description,
    "mainImage": coalesce(mainImage.asset->url, mainImageUrl),
    "secondaryImage": coalesce(secondaryImage.asset->url, secondaryImageUrl),
    gallery[] { "url": coalesce(image.asset->url, url), alt },
    "category": category->{ _id, name, "slug": slug.current }
  }`);

  const sanityUrl = `https://kqneikcb.api.sanity.io/v2025-01-01/data/query/production?query=${query}`;
  console.log('Fetching live products from Sanity...');
  const res = await fetch(sanityUrl);
  const data = await res.json();
  const items = data.result || [];

  console.log(`Fetched ${items.length} products.`);

  const headers = [
    'id',
    'title',
    'description',
    'availability',
    'condition',
    'price',
    'link',
    'image_link',
    'additional_image_link',
    'brand',
    'google_product_category',
    'fb_product_category',
  ];

  const escapeCsv = (str) => `"${String(str ?? '').replace(/"/g, '""')}"`;

  const rows = items.map((p) => {
    const isMacBook = p.name.toLowerCase().includes('macbook') || p.name.toLowerCase().includes('apple');
    const isDell = p.name.toLowerCase().includes('dell');
    const brand = isMacBook ? 'Apple' : isDell ? 'Dell' : 'iTech';
    const isLaptop = p.category?.slug === 'laptops' || p.name.toLowerCase().includes('macbook') || p.name.toLowerCase().includes('laptop');
    const isTablet = p.category?.slug === 'tablets' || p.name.toLowerCase().includes('ipad');

    const googleCategory = isLaptop
      ? 'Electronics > Computers > Laptops'
      : isTablet
      ? 'Electronics > Computers > Tablet Computers'
      : 'Electronics > Electronics Accessories';

    const fbCategory = isLaptop
      ? 'Electronics > Computers > Laptops'
      : isTablet
      ? 'Electronics > Computers > Tablets'
      : 'Electronics > Electronics Accessories';

    const cleanDescription = (p.description || '')
      .replace(/\\"/g, '"')
      .replace(/•/g, '-')
      .trim();

    const fullDescription = `${cleanDescription} - Emitimos Boleta de Venta - Testeado en 30 puntos técnicos (WiFi, audio, cámaras, pantalla, Touch ID, puertos y sensores operativos) - [WhatsApp: +51 907 674 693 - TikTok Live: @itechperu]`;
    const productLink = p.slug ? `${STORE_BASE_URL}/coleccion/${p.slug}` : `${STORE_BASE_URL}/coleccion`;

    const modelKey = resolveModelKey(p.name, p.slug);
    const mainImageUrl = p.mainImage || `${STORE_BASE_URL}/catalog/${modelKey}-1.png`;
    const secondaryImageUrl = `${STORE_BASE_URL}/catalog/${modelKey}-2.png`;
    const tertiaryImageUrl = `${STORE_BASE_URL}/catalog/${modelKey}-3.png`;
    const additionalImages = `${secondaryImageUrl},${tertiaryImageUrl}`;

    const cleanTitle = String(p.name || '').replace(/\s*[•\-]\s*Ord:\s*[\w\-]+/gi, '').replace(/\\"/g, '"').trim();

    return [
      escapeCsv(p.sku || p._id),
      escapeCsv(cleanTitle),
      escapeCsv(fullDescription),
      escapeCsv(p.inStock !== false ? 'in stock' : 'out of stock'),
      escapeCsv('refurbished'),
      escapeCsv(`${Number(p.price || 0).toFixed(2)} PEN`),
      escapeCsv(productLink),
      escapeCsv(mainImageUrl),
      escapeCsv(additionalImages),
      escapeCsv(brand),
      escapeCsv(googleCategory),
      escapeCsv(fbCategory),
    ].join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\r\n');

  const targets = [
    path.join(__dirname, '..', 'public', 'catalogo-whatsapp.csv'),
    path.join(__dirname, '..', 'web', 'public', 'catalogo-whatsapp.csv'),
  ];

  targets.forEach((targetPath) => {
    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    fs.writeFileSync(targetPath, csvContent, 'utf8');
    console.log(`Saved: ${targetPath}`);
  });
}

main().catch(console.error);

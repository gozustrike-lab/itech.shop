import { NextResponse } from 'next/server';
import { sanityFetch } from '@/sanity/live';
import { ALL_PRODUCTS_QUERY } from '@/lib/sanity.queries';
import { getProductImages } from '@/lib/catalog-images';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

export async function GET() {
  try {
    const { data: products } = await sanityFetch<any[]>({
      query: ALL_PRODUCTS_QUERY,
    });

    const items = Array.isArray(products) ? products : [];
    const STORE_BASE_URL = 'https://www.itechperu.shop';

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

    const escapeCsv = (str: string | number) => {
      const val = String(str ?? '').replace(/"/g, '""');
      return `"${val}"`;
    };

    const rows = items.map((p: any) => {
      const isMacBook =
        p.name.toLowerCase().includes('macbook') || p.name.toLowerCase().includes('apple');
      const isDell = p.name.toLowerCase().includes('dell');
      const brand = isMacBook ? 'Apple' : isDell ? 'Dell' : 'iTech';
      const isLaptop =
        p.category?.slug === 'laptops' ||
        p.name.toLowerCase().includes('macbook') ||
        p.name.toLowerCase().includes('laptop');
      const isTablet =
        p.category?.slug === 'tablets' || p.name.toLowerCase().includes('ipad');

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

      const fullDescription = `${p.description || ''} • Emitimos Boleta de Venta • Testeado en 30 puntos técnicos (WiFi, audio, cámaras, pantalla, Touch ID, puertos y sensores operativos) • [WhatsApp: +51 907 674 693 • TikTok Live: @itechperu]`;
      const productLink = p.slug
        ? `${STORE_BASE_URL}/coleccion/${p.slug}`
        : `${STORE_BASE_URL}/coleccion`;

      const images = getProductImages(p, { absolute: true });
      const mainImageUrl = images.main;
      const additionalImages = [images.secondary, images.tertiary]
        .filter((img) => img && img !== mainImageUrl)
        .join(',');

      const cleanTitle = String(p.name || '')
        .replace(/\s*[•\-]\s*Ord:\s*[\w\-]+/gi, '')
        .replace(/\\"/g, '"')
        .trim();

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

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="catalogo_whatsapp_business.csv"',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=60, s-maxage=300',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

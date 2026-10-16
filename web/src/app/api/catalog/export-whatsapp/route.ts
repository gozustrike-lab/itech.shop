import { NextResponse } from 'next/server';
import { sanityFetch } from '@/sanity/live';
import { ALL_PRODUCTS_QUERY } from '@/lib/sanity.queries';

export const dynamic = 'force-dynamic';
export const revalidate = 60;

export async function GET() {
  try {
    const { data: products } = await sanityFetch<any[]>({
      query: ALL_PRODUCTS_QUERY,
    });

    const items = Array.isArray(products) ? products : [];
    const STORE_BASE_URL = "https://www.itechperu.shop";

    const headers = [
      "id",
      "title",
      "description",
      "availability",
      "condition",
      "price",
      "link",
      "image_link",
      "brand",
      "google_product_category"
    ];

    const escapeCsv = (str: string | number) => {
      const val = String(str ?? "").replace(/"/g, '""');
      return `"${val}"`;
    };

    const rows = items.map((p: any) => {
      const isMacBook = p.name.toLowerCase().includes('macbook') || p.name.toLowerCase().includes('apple');
      const isDell = p.name.toLowerCase().includes('dell');
      const brand = isMacBook ? 'Apple' : isDell ? 'Dell' : 'iTech';
      const isLaptop = p.category?.slug === 'laptops' || p.name.toLowerCase().includes('macbook') || p.name.toLowerCase().includes('laptop');
      const isTablet = p.category?.slug === 'tablets' || p.name.toLowerCase().includes('ipad');

      const googleCategory = isLaptop
        ? "Electronics > Computers > Laptops"
        : isTablet
        ? "Electronics > Computers > Tablet Computers"
        : "Electronics > Electronics Accessories";

      const fullDescription = `${p.description || ''} • 12 meses de garantía real iTech Perú • Revisión técnica en 30 puntos • [WhatsApp: +51 907 674 693 • TikTok Live: @itechperu]`;
      const productLink = p.slug ? `${STORE_BASE_URL}/coleccion/${p.slug}` : `${STORE_BASE_URL}/coleccion`;
      const imageUrl = p.mainImage || 'https://cdn.sanity.io/images/kqneikcb/production/1189f3e9e0778c529d6fb8c59b5227fad2dc161d-800x800.png';

      return [
        escapeCsv(p.sku || p._id),
        escapeCsv(p.name),
        escapeCsv(fullDescription),
        escapeCsv(p.inStock !== false ? "in stock" : "out of stock"),
        escapeCsv("refurbished"),
        escapeCsv(`${Number(p.price || 0).toFixed(2)} PEN`),
        escapeCsv(productLink),
        escapeCsv(imageUrl),
        escapeCsv(brand),
        escapeCsv(googleCategory),
      ].join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\r\n");

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="catalogo_whatsapp_business.csv"',
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=60, s-maxage=300",
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

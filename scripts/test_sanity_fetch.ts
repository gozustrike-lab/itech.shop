import { createClient } from 'next-sanity';

const client = createClient({
  projectId: 'kqneikcb',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
});

const ALL_PRODUCTS_QUERY = `
*[_type == "product"] | order(order asc) {
  _id, "slug": slug.current, sku, name,
  price, compareAtPrice, description, longDescription,
  features, color, size, materials,
  rating, reviewCount, inStock, featured, order,
  collection,
  "mainImage": coalesce(mainImage.asset->url, mainImageUrl),
  "secondaryImage": coalesce(secondaryImage.asset->url, secondaryImageUrl),
  gallery[] { "url": coalesce(image.asset->url, url), alt },
  "category": category->{ _id, name, "slug": slug.current },
  seoTitle, seoDescription
}`;

async function main() {
  const prods = await client.fetch(ALL_PRODUCTS_QUERY);
  console.log('Total products from ALL_PRODUCTS_QUERY:', prods.length);
  const featured = prods.filter((p: any) => p.featured);
  console.log('Featured products count:', featured.length);
  console.log('Featured products names:', featured.map((p: any) => ({ name: p.name, featured: p.featured, img: p.mainImage })));
}

main().catch(console.error);

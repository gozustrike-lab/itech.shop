'use client';

export async function shareProduct(
  productName: string,
  slug: string,
  price: string
): Promise<boolean> {
  const url =
    typeof window !== 'undefined'
      ? `${window.location.origin}/coleccion/${slug}`
      : '';
  const text = `${productName} — ${price} | iTech Peru`;

  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({ title: productName, text, url });
      return true;
    } catch {
      return false;
    }
  }

  // Fallback: copy link
  try {
    await navigator.clipboard.writeText(`${text}\n${url}`);
    return true;
  } catch {
    return false;
  }
}

import { createDataAttribute } from "@sanity/visual-editing-csm";

const cache = new Map<string, string>();

/**
 * Genera atributos `data-sanity` para el overlay de Edición Visual.
 * En el Presentation Tool iframe, permite que al hacer clic en cualquier
 * texto o botón se abra el documento y campo correspondiente en el Studio.
 */
export function ve(id: string, type: string, path: string): Record<string, string> {
  if (!id || id.startsWith("fallback-")) return {};

  const key = `${id}:${type}:${path}`;
  let value = cache.get(key);
  if (!value) {
    try {
      const da = createDataAttribute({ id, type, path, baseUrl: "/admin" });
      value = da.toString();
      cache.set(key, value);
    } catch {
      return {};
    }
  }
  return { "data-sanity": value };
}

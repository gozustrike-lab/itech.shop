# 🚀 Plantilla Universal de Sanity CMS (Structure + Visual Editing)

Esta carpeta contiene la arquitectura completa, probada y libre de errores de **Sanity CMS v3 + Next.js App Router (React 19 / Next 15-16)** con soporte para:
1. **Panel de Estructura (/admin)**: Edición organizada por grupos, singletons y colecciones.
2. **Edición Visual / Presentation Tool (/admin/presentation)**: Vista previa en vivo con bordes y badges para editar al hacer clic en cualquier elemento.
3. **Draft Mode en tiempo real**: Refresco automático sin desconectar WebSockets ni romper recargas de iframe.
4. **Soporte de Dominio Canónico y CORS**: Prevención de errores de iframe, CSP `frame-ancestors` y URLs quemadas.

---

## 📦 1. Dependencias a Instalar en el Nuevo Proyecto

Ejecuta en la terminal de tu nuevo proyecto:

```bash
npm install next-sanity sanity @sanity/visual-editing @sanity/visual-editing-csm @sanity/client
```

---

## 🔑 2. Variables de Entorno (`.env.local` y Vercel)

```env
NEXT_PUBLIC_SANITY_PROJECT_ID="tu_project_id"
NEXT_PUBLIC_SANITY_DATASET="production"
NEXT_PUBLIC_SANITY_API_READ_TOKEN="tu_token_con_permisos_viewer"
SANITY_API_READ_TOKEN="mismo_token_o_editor"
NEXT_PUBLIC_SITE_URL="https://tu-dominio.com"
```

---

## 📁 3. Estructura de Archivos a Copiar

```text
├── sanity.config.ts                  # Configuración central de Sanity Studio + Presentation Tool
├── sanity/
│   ├── lib/constants.ts              # Nombre de empresa, título de CMS, URLs
│   ├── schema.ts                     # Registro central de esquemas
│   └── schemas/
│       ├── siteSettings.ts           # Singleton: Datos globales del sitio
│       └── ...                       # Tus esquemas personalizados
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   ├── layout.tsx            # Aislamiento visual del Studio
│   │   │   └── [[...index]]/page.tsx # Montaje del Studio en /admin con redirección canónica
│   │   └── api/
│   │       ├── draft-mode/enable/route.ts # Activa Draft Mode y redirige a la ruta solicitada
│   │       └── disable-preview/route.ts   # Desactiva Draft Mode
│   ├── components/
│   │   ├── cms/VisualEditing.tsx     # Componente del overlay de edición visual
│   │   └── SanityLiveWithToken.tsx   # Listener en tiempo real con debounce
│   ├── lib/
│   │   └── ve.ts                     # Helper ve() para generar atributos data-sanity
│   └── sanity/
│       └── live.ts                   # Cliente sanityFetch con stega habilitado
```

---

## 🛡️ 4. Configurar Cabeceras de Iframe en `next.config.ts`

Agrega esto a tu `next.config.ts` para permitir que el Presentation Tool muestre tu sitio en iframe sin bloqueos de seguridad:

```ts
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'self' https://*.vercel.app http://localhost:3000 http://localhost:4000",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
```

---

## 🌐 5. CORS en Sanity Cloud

En [sanity.io/manage](https://sanity.io/manage) -> Tu Proyecto -> **API** -> **CORS Origins**:
Agrega:
- `http://localhost:3000` (con Credentials habilitado)
- `http://localhost:4000` (con Credentials habilitado)
- `https://tu-dominio.com` (con Credentials habilitado)
- `https://*.vercel.app` (con Credentials habilitado)

# 🧠 PROMPT MAESTRO: Transformar Cualquier Proyecto Web a Sanity CMS (Structure + Edición Visual Completa)

> **Instrucciones de uso:**
> Copia y pega el bloque delimitado por `=== INICIO DEL PROMPT ===` y `=== FIN DEL PROMPT ===` en el chat del asistente AI en tu nuevo proyecto.

---

```markdown
=== INICIO DEL PROMPT ===
Actúa como Arquitecto de Software Senior y Especialista en Sanity CMS v3 + Next.js App Router (React 19).

Tu misión es transformar este sitio web (actualmente con textos, botones, imágenes y secciones estáticas o hardcodeadas) en un sistema 100% gestionado dinámicamente desde Sanity CMS, con dos modos indispensables de edición:
1. Panel de Estructura (/admin): Navegación organizada por secciones, singletons y documentos.
2. Edición Visual en Tiempo Real (/admin/presentation): Vista previa interactiva donde cada texto, botón, imagen y elemento tiene su overlay azul ("Open in Studio") y abre directamente el campo exacto del CMS al hacer clic.

Sigue rigurosamente estas reglas y pasos de implementación:

---

### REGLAS DE ARQUITECTURA CRÍTICAS (Evitar errores comunes)

1. Enrutamiento del Studio:
   - Monta Sanity Studio en `/admin` dentro de `src/app/admin/[[...index]]/page.tsx` usando `<NextStudio config={sanityConfig} />`.
   - En `sanity.config.ts`, define obligatoriamente `basePath: "/admin"`. NUNCA uses `history="hash"`, ya que rompe las URLs de intención `/admin/intent/edit/...` que envía el Presentation Tool.
   - Si se accede desde dominios de prueba o subdominios, asegúrate de que el Studio y el iframe utilicen el mismo origen para evitar bloqueos de cookies de terceros.

2. Presentation Tool & Preview URL:
   - Configura el plugin `presentationTool` en `sanity.config.ts` con `previewMode: { enable: "/api/draft-mode/enable" }`.
   - Define `previewUrl.initial` como `"/"` o derivado de `getSiteUrl()`, asegurando que en desarrollo local use `http://localhost:3000` (o el puerto activo) y en producción use el dominio del proyecto. NUNCA quemes un localhost:3000 fijo en producción.
   - En `src/app/api/draft-mode/enable/route.ts`, lee tanto `searchParams.get("sanity-preview-pathname")` como `searchParams.get("redirect")` para redirigir a la subpágina solicitada.

3. Atributos de Edición Visual (`data-sanity`):
   - Crea un helper `ve(id: string, type: string, path: string)` usando `createDataAttribute({ baseUrl: "/admin" })` de `@sanity/visual-editing-csm`.
   - Aplica `{...ve("docId", "docType", "field.path")}` a los contenedores y elementos JSX correspondientes.
   - En `sanity.queries.ts`, utiliza consultas GROQ optimizadas con `coalesce()` para campos que puedan tener fallbacks.
   - En componentes con enlaces, NUNCA anides etiquetas `<button>` dentro de `<Link>` (genera errores de DOM nesting e hidración en React 19). Mantén los botones de acción como hermanos del `<Link>`.

4. Actualizaciones en Vivo sin Cortes:
   - En el layout principal (`(store)/layout.tsx`), incluye el componente `<VisualEditing />` (de `@sanity/visual-editing/react`) y un listener de Sanity Live.
   - El listener debe refrescar los Server Components mediante `router.refresh()` con debounce (aprox. 500ms), NUNCA con `window.location.reload()`, para no desconectar el iframe del Presentation Tool mientras el usuario escribe.

5. Seguridad de Iframe (CSP):
   - En `next.config.ts`, agrega en las cabeceras `Content-Security-Policy: frame-ancestors 'self' https://*.vercel.app http://localhost:3000 http://localhost:4000 <tus-dominios>` para que el iframe de Vista Previa no sea bloqueado.

---

### PASOS DE EJECUCIÓN

1. AUDITORÍA DEL SITIO:
   - Inspecciona los componentes de la página (Navbar, Hero, Secciones, Productos/Servicios, Testimonios, Footer).
   - Identifica todos los datos hardcodeados: textos, títulos, subtítulos, botones (labels y URLs), imágenes y logos.

2. ESQUEMAS DE SANITY (`sanity/schemas/`):
   - Crea los esquemas correspondientes (ej. `siteSettings`, `heroSlide`, `product`, `aboutPage`, `footerSettings`, etc.).
   - Asegúrate de que los nombres de los tipos dentro de los arrays (`of: [...]`) coincidan exactamente con la estructura de datos para evitar el error *"Item of type X not valid for this list"*.
   - Registra todos los tipos en `sanity/schema.ts` y agrégalos a la estructura en `sanity.config.ts`.

3. INTEGRACIÓN CON LOS COMPONENTES JSX:
   - Modifica los componentes para recibir los datos desde Sanity con fallback seguro a los datos actuales si el CMS aún no tiene contenido cargado.
   - Agrega los atributos `data-sanity` usando el helper `ve()` en cada elemento interactivo.
   - Verifica que todos los botones y enlaces del CMS lean tanto `url` como `href` con fallback (`coalesce(url, href)`).

4. VERIFICACIÓN FINAL:
   - Ejecuta `npx tsc --noEmit` para asegurar cero errores de tipos.
   - Prueba las rutas de la tienda y verifica que `/admin` cargue el panel y `/admin/presentation` conecte la vista previa correctamente.

Procede paso a paso, mostrando los archivos modificados y confirmando cada paso.
=== FIN DEL PROMPT ===
```

// @ts-nocheck
import { defineType, defineField } from "sanity";

export default defineType({
  name: "siteSettings",
  title: "Configuración del Sitio",
  type: "document",
  icon: () => "⚙️",
  fields: [
    defineField({ name: "title", title: "Título del Sitio / Marca", type: "string" }),
    defineField({ name: "companyName", title: "Nombre Comercial", type: "string" }),
    defineField({ name: "tagline", title: "Tagline / Frase Corta", type: "string" }),
    defineField({ name: "description", title: "Descripción del Sitio", type: "text", rows: 3 }),
    defineField({ name: "phone", title: "Teléfono", type: "string" }),
    defineField({ name: "whatsapp", title: "WhatsApp", type: "string", description: "Número con código de país. Ej: 51999888777" }),
    defineField({ name: "email", title: "Email de Contacto", type: "string" }),
    defineField({
      name: "nav",
      title: "Navegación Principal",
      type: "array",
      of: [
        {
          type: "object",
          name: "link",
          title: "Enlace",
          fields: [
            { name: "label", title: "Etiqueta", type: "string" },
            { name: "url", title: "URL", type: "string" },
          ],
          preview: {
            select: { title: "label", subtitle: "url" },
          },
        },
      ],
    }),
    defineField({
      name: "social",
      title: "Redes Sociales",
      type: "array",
      of: [
        {
          type: "object",
          name: "socialLink",
          title: "Red Social",
          fields: [
            { name: "platform", title: "Plataforma", type: "string" },
            { name: "url", title: "URL", type: "url" },
          ],
          preview: {
            select: { title: "platform", subtitle: "url" },
          },
        },
      ],
    }),
    defineField({ name: "logo", title: "Logo", type: "image", options: { hotspot: true } }),
    defineField({ name: "ogImage", title: "OG Image (Compartir)", type: "image", options: { hotspot: true } }),
  ],
  preview: {
    prepare() {
      return { title: "Configuración del Sitio" };
    },
  },
});

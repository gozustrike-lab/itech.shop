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
    defineField({ name: "footerText", title: "Texto del Footer", type: "text", rows: 2 }),
    defineField({ name: "phone", title: "Teléfono", type: "string" }),
    defineField({ name: "schedule", title: "Horario de Atención", type: "string" }),
    defineField({ name: "whatsapp", title: "WhatsApp", type: "string", description: "Número con código de país, sin +. Ej: 51999888777" }),
    defineField({ name: "email", title: "Email", type: "string" }),
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
        },
      ],
    }),
    defineField({ name: "slogan", title: "Slogan", type: "string" }),
    defineField({ name: "logo", title: "Logo", type: "image", options: { hotspot: true } }),
    defineField({ name: "logoWhite", title: "Logo Blanco", type: "image", options: { hotspot: true }, description: "Logo para fondos oscuros" }),
    defineField({ name: "ogImage", title: "OG Image (Compartir)", type: "image", options: { hotspot: true }, description: "Imagen para redes sociales (1200x630 o 1200x1200)" }),
    defineField({ name: "instagramUrl", title: "Instagram (URL)", type: "url" }),
    defineField({ name: "tiktokUrl", title: "TikTok (URL)", type: "url" }),
    defineField({ name: "facebookUrl", title: "Facebook (URL)", type: "url" }),
    defineField({
      name: "heroSlides",
      title: "Slides del Hero",
      type: "array",
      of: [{
        type: "object",
        fields: [
          { name: "title", title: "Título", type: "string" },
          { name: "subtitle", title: "Subtítulo", type: "string" },
          { name: "image", title: "Imagen", type: "image", options: { hotspot: true } },
          { name: "ctaLabel", title: "Texto del Botón", type: "string" },
          { name: "ctaLink", title: "Enlace del Botón", type: "string" },
        ],
      }],
      description: "Imágenes y textos del carrusel principal",
    }),
    defineField({
      name: "testimonials",
      title: "Testimonios",
      type: "array",
      of: [{
        type: "object",
        fields: [
          { name: "name", title: "Nombre", type: "string" },
          { name: "location", title: "Ubicación", type: "string" },
          { name: "text", title: "Texto", type: "text", rows: 3 },
          { name: "rating", title: "Calificación", type: "number", validation: (Rule) => Rule.min(1).max(5) },
          { name: "photo", title: "Foto", type: "image", options: { hotspot: true } },
        ],
      }],
    }),
    defineField({ name: "seoTitle", title: "SEO Título", type: "string" }),
    defineField({ name: "seoDescription", title: "SEO Descripción", type: "text", rows: 3, description: "Máximo 160 caracteres" }),
  ],
});
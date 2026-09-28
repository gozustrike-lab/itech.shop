// @ts-nocheck
import { defineType, defineField } from "sanity";

export default defineType({
  name: "aboutPage",
  title: "Nosotros",
  type: "document",
  icon: () => "👩‍🎨",
  fields: [
    defineField({
      name: "title",
      title: "Título de la Sección",
      type: "string",
      initialValue: "Nuestra Historia",
    }),
    defineField({
      name: "subtitle",
      title: "Subtítulo",
      type: "string",
      initialValue: "Tecnología que Renueva",
    }),
    defineField({
      name: "mainImage",
      title: "Imagen Principal",
      type: "image",
      options: { hotspot: true },
      description: "Imagen principal de Nosotros (1200x1500px recomendado)",
    }),
    defineField({
      name: "storyParagraphs",
      title: "Párrafos de la Historia",
      type: "array",
      of: [{ type: "block" }],
      description: "La historia de iTech Peru",
    }),
    defineField({
      name: "features",
      title: "Características / Pilares",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "icon", title: "Icono (emoji)", type: "string", initialValue: "💎" },
            { name: "title", title: "Título", type: "string" },
            { name: "description", title: "Descripción", type: "text", rows: 3 },
          ],
          preview: {
            select: { title: "title", subtitle: "description", media: "icon" },
          },
        },
      ],
    }),
    defineField({
      name: "headerDescription",
      title: "Descripción Superior",
      type: "text",
      rows: 2,
      initialValue: "Dispositivos tecnológicos certificados y renovados con garantía real de 12 meses en todo el Perú.",
    }),
    defineField({
      name: "yearsExperience",
      title: "Años de Experiencia",
      type: "number",
      initialValue: 5,
    }),
    defineField({
      name: "experienceLabel",
      title: "Etiqueta de Experiencia",
      type: "string",
      initialValue: "Años de Experiencia",
    }),
    defineField({
      name: "ctaLabel",
      title: "Texto del Botón CTA",
      type: "string",
      initialValue: "Ver Equipos Certificados",
    }),
    defineField({
      name: "ctaLink",
      title: "Enlace del Botón CTA",
      type: "string",
      initialValue: "/coleccion",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Página Nosotros", subtitle: "Contenido de la sección About" };
    },
  },
});

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { presentationTool, defineLocations } from "sanity/presentation";
import { schemaTypes } from "./sanity/schema";
import { STUDIO_TITLE } from "./sanity/lib/constants";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "tu_project_id";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

function getSiteUrl(): string {
  if (typeof window !== "undefined" && window.location?.hostname === "localhost") {
    return window.location.origin;
  }
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  return "http://localhost:3000";
}

const siteUrl = getSiteUrl();

export default defineConfig({
  basePath: "/admin",
  name: "cms-workspace",
  title: STUDIO_TITLE,
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: (S) => {
        return S.list().title("Panel de Control").items([
          S.listItem().title("Configuración del Sitio").id("settings-group").child(
            S.document().schemaType("siteSettings").documentId("siteSettings").title("Configuración General"),
          ),
          ...S.documentTypeListItems().filter(
            (item) => !["siteSettings"].includes(item.getId() || ""),
          ),
        ]);
      },
    }),
    presentationTool({
      name: "presentation",
      title: "Vista Previa",
      previewUrl: {
        initial: siteUrl,
        previewMode: { enable: "/api/draft-mode/enable" },
      },
      resolve: {
        locations: {
          siteSettings: defineLocations({
            select: {},
            resolve: () => ({
              locations: [
                { title: "Inicio", href: "/" },
              ],
            }),
          }),
        },
      },
    }),
  ],
  schema: {
    types: schemaTypes,
  },
});

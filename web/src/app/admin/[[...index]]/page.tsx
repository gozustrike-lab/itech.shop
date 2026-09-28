"use client";

import { useEffect } from "react";
import { NextStudio } from "next-sanity/studio";
import sanityConfig from "../../../../sanity.config";

const OFFICIAL_ORIGIN = "https://www.itechperu.shop";

function SanityConfigGuard() {
  const projectId = sanityConfig.projectId;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const { hostname, pathname, search, hash } = window.location;
    if (hostname !== "localhost" && hostname !== "127.0.0.1") {
      const cleanedSearch = search
        .replace(/https?%3A%2F%2F[^&]+vercel\.app/gi, encodeURIComponent(OFFICIAL_ORIGIN))
        .replace(/https?:\/\/[^&]+vercel\.app/gi, OFFICIAL_ORIGIN);

      if (hostname !== "www.itechperu.shop" && hostname !== "itechperu.shop") {
        window.location.replace(`${OFFICIAL_ORIGIN}${pathname}${cleanedSearch}${hash}`);
        return;
      }
      if (cleanedSearch !== search) {
        window.location.replace(`${OFFICIAL_ORIGIN}${pathname}${cleanedSearch}${hash}`);
      }
    }
  }, []);

  if (!projectId) {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        background: "#1c1c1c",
        color: "#fff",
        fontFamily: "system-ui, -apple-system, sans-serif",
        textAlign: "center",
        padding: "2rem",
      }}>
        <div style={{ maxWidth: 520 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>&#x26A0;&#xFE0F;</div>
          <h1 style={{ fontSize: 22, marginBottom: 12, color: "#f87171" }}>
            Sanity Studio &#8212; Configuraci&#243;n incompleta
          </h1>
          <p style={{ fontSize: 14, color: "#a1a1aa", marginBottom: 24, lineHeight: 1.6 }}>
            La variable de entorno <code style={{ background: "#27272a", padding: "2px 8px", borderRadius: 4, color: "#fbbf24" }}>NEXT_PUBLIC_SANITY_PROJECT_ID</code> no est&#225; configurada.
          </p>
        </div>
      </div>
    );
  }

  return <NextStudio config={sanityConfig} />;
}

export default function AdminPage() {
  return <SanityConfigGuard />;
}
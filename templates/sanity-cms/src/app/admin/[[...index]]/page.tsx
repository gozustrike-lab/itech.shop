"use client";

import { useEffect } from "react";
import { NextStudio } from "next-sanity/studio";
import sanityConfig from "../../../../sanity.config";

export default function AdminPage() {
  const projectId = sanityConfig.projectId;

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
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
          <h1 style={{ fontSize: 22, marginBottom: 12, color: "#f87171" }}>
            Sanity Studio — Configuración incompleta
          </h1>
          <p style={{ fontSize: 14, color: "#a1a1aa", marginBottom: 24, lineHeight: 1.6 }}>
            La variable de entorno <code style={{ background: "#27272a", padding: "2px 8px", borderRadius: 4, color: "#fbbf24" }}>NEXT_PUBLIC_SANITY_PROJECT_ID</code> no está configurada.
          </p>
        </div>
      </div>
    );
  }

  return <NextStudio config={sanityConfig} />;
}

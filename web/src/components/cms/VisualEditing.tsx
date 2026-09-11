"use client";

import { VisualEditing as SanityVisualEditing } from "@sanity/visual-editing/react";
import { useEffect, useState } from "react";

export function VisualEditing() {
  const [showHint, setShowHint] = useState(true);
  const [isInIframe, setIsInIframe] = useState(false);

  useEffect(() => {
    try {
      setIsInIframe(window.self !== window.top);
    } catch {
      setIsInIframe(true);
    }
    const timer = setTimeout(() => setShowHint(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <SanityVisualEditing portal={true} />
      {isInIframe && showHint && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 999999,
            background: "rgba(0,108,131,0.95)",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: 12,
            fontSize: 13,
            fontWeight: 600,
            boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(255,255,255,0.15)",
            display: "flex",
            alignItems: "center",
            gap: 8,
            pointerEvents: "none",
            animation: "fadeInUp 0.3s ease-out",
          }}
        >
          <span style={{ fontSize: 16 }}>✏️</span>
          <span>Modo Edici&oacute;n &mdash; Haz clic en cualquier elemento para editarlo</span>
          <button
            onClick={() => setShowHint(false)}
            style={{
              background: "none",
              border: "none",
              color: "rgba(255,255,255,0.6)",
              cursor: "pointer",
              fontSize: 18,
              lineHeight: 1,
              padding: "0 4px",
              pointerEvents: "auto",
            }}
            aria-label="Cerrar hint"
          >
            &times;
          </button>
        </div>
      )}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateX(-50%) translateY(10px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </>
  );
}

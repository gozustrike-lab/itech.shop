/**
 * Admin Layout — Aislado de la interfaz de la tienda.
 * Sanity Studio corre en pantalla completa sin navegación ni footer del sitio.
 */
export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999999,
        background: "#1c1c1c",
      }}
    >
      {children}
    </div>
  );
}

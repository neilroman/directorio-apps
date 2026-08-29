import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "App";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = {
  params: Promise<{ id: string }>;
};

async function fetchAppData(id: string) {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  try {
    const res = await fetch(
      `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/directory_apps/${id}?key=${apiKey}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.fields) return null;
    const f = data.fields;
    return {
      nombre: f.nombre?.stringValue ?? "",
      descripcionCorta: f.descripcionCorta?.stringValue ?? "",
      iconoUrl: f.iconoUrl?.stringValue ?? null,
      plataforma: f.plataforma?.stringValue ?? "",
      categoria: f.categoria?.stringValue ?? "",
    };
  } catch {
    return null;
  }
}

export default async function Image({ params }: Props) {
  const { id } = await params;
  const app = await fetchAppData(id);

  const nombre = app?.nombre ?? "App";
  const descripcion = app?.descripcionCorta ?? "";
  const desc =
    descripcion.length > 110 ? descripcion.slice(0, 110) + "…" : descripcion;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #0a0a0a 0%, #111827 100%)",
          padding: "72px 80px",
        }}
      >
        {/* Contenido principal */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "48px",
            flex: 1,
          }}
        >
          {/* Ícono */}
          {app?.iconoUrl ? (
            <img
              src={app.iconoUrl}
              width={180}
              height={180}
              style={{
                borderRadius: "36px",
                objectFit: "cover",
                flexShrink: 0,
                boxShadow: "0 0 0 1px rgba(255,255,255,0.1)",
              }}
            />
          ) : (
            <div
              style={{
                width: "180px",
                height: "180px",
                borderRadius: "36px",
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "80px",
                flexShrink: 0,
              }}
            >
              📱
            </div>
          )}

          {/* Texto */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              flex: 1,
              minWidth: 0,
            }}
          >
            <div
              style={{
                fontSize: nombre.length > 20 ? "58px" : "72px",
                fontWeight: "bold",
                color: "white",
                lineHeight: 1.1,
                letterSpacing: "-1px",
              }}
            >
              {nombre}
            </div>
            {desc && (
              <div
                style={{
                  fontSize: "28px",
                  color: "#9ca3af",
                  lineHeight: 1.5,
                }}
              >
                {desc}
              </div>
            )}
            {/* Badges */}
            <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
              {app?.plataforma && (
                <div
                  style={{
                    background: "rgba(99,102,241,0.15)",
                    border: "1px solid rgba(99,102,241,0.4)",
                    borderRadius: "999px",
                    padding: "8px 22px",
                    color: "#a5b4fc",
                    fontSize: "20px",
                  }}
                >
                  {app.plataforma}
                </div>
              )}
              {app?.categoria && (
                <div
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "999px",
                    padding: "8px 22px",
                    color: "#6b7280",
                    fontSize: "20px",
                  }}
                >
                  {app.categoria}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer branding */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            paddingTop: "28px",
            marginTop: "28px",
          }}
        >
          <div
            style={{
              fontSize: "22px",
              color: "#6366f1",
              fontWeight: "600",
              letterSpacing: "0.5px",
            }}
          >
            Directorio de Apps
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}

import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Directorio de Apps";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0a0a0a 0%, #111827 100%)",
          padding: "80px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "28px",
            marginBottom: "36px",
          }}
        >
          <div
            style={{
              width: "96px",
              height: "96px",
              borderRadius: "24px",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "48px",
            }}
          >
            📱
          </div>
          <div
            style={{
              fontSize: "68px",
              fontWeight: "bold",
              color: "white",
              letterSpacing: "-1px",
            }}
          >
            Directorio de Apps
          </div>
        </div>
        <div
          style={{
            fontSize: "30px",
            color: "#9ca3af",
            textAlign: "center",
            maxWidth: "820px",
            lineHeight: 1.5,
          }}
        >
          Publica y descubre apps para Windows y Android
        </div>
        <div
          style={{
            marginTop: "60px",
            display: "flex",
            gap: "16px",
          }}
        >
          {["Windows", "Android"].map((p) => (
            <div
              key={p}
              style={{
                background: "rgba(99,102,241,0.15)",
                border: "1px solid rgba(99,102,241,0.4)",
                borderRadius: "999px",
                padding: "10px 28px",
                color: "#a5b4fc",
                fontSize: "22px",
              }}
            >
              {p}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}

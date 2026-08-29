import type { Metadata } from "next";
import AppDetalleClient from "./AppDetalleClient";

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
    };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const app = await fetchAppData(id);

  if (!app) {
    return { title: "App no encontrada | Directorio de Apps" };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://directorio-apps.vercel.app";
  const pageUrl = `${siteUrl}/app/${id}`;
  const ogImage = app.iconoUrl
    ? { url: app.iconoUrl, width: 512, height: 512, alt: app.nombre }
    : { url: "/og-image.png", width: 1200, height: 630, alt: app.nombre };

  return {
    title: `${app.nombre} | Directorio de Apps`,
    description: app.descripcionCorta,
    openGraph: {
      title: app.nombre,
      description: app.descripcionCorta,
      type: "website",
      url: pageUrl,
      siteName: "Directorio de Apps",
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: app.nombre,
      description: app.descripcionCorta,
      images: [ogImage.url],
    },
  };
}

export default function AppDetallePage() {
  return <AppDetalleClient />;
}

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { db } from "@/lib/firebase";

type AppDetalle = {
  nombre: string;
  plataforma: string;
  categoria: string;
  descripcionCorta: string;
  descripcionLarga: string;
  enlace: string;
  version: string;
  requisitos: string;
  tags: string[];
  autorEmail: string;
  clicks: number;
  iconoUrl?: string;
  capturas?: string[];
};

export default function AppDetallePage() {
  const params = useParams();
  const id = params.id as string;

  const [app, setApp] = useState<AppDetalle | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchApp = async () => {
      try {
        const ref = doc(db, "directory_apps", id);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setApp(snap.data() as AppDetalle);
        } else {
          setNotFound(true);
        }
      } catch (err) {
        console.error(err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };
    fetchApp();
  }, [id]);

  const handleDescargar = async () => {
    if (!app) return;
    try {
      await updateDoc(doc(db, "directory_apps", id), {
        clicks: increment(1),
      });
    } catch (err) {
      console.error("No se pudo actualizar el contador", err);
    }
    window.open(app.enlace, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Cargando...</p>
      </div>
    );
  }

  if (notFound || !app) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Esta app no existe o fue eliminada.</p>
          <Link href="/" className="text-blue-600 hover:underline">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <Link href={`/${app.plataforma.toLowerCase()}`} className="text-sm text-gray-500 hover:text-gray-800">
            ← Volver a {app.plataforma}
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-10">
        <div className="bg-white border rounded-xl p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-20 h-20 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
              {app.iconoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={app.iconoUrl}
                  alt={app.nombre}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              ) : (
                <span className="text-3xl">📦</span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-medium">
                  {app.categoria}
                </span>
                <span className="text-xs text-gray-400">{app.plataforma}</span>
              </div>
              <h1 className="text-2xl font-bold">{app.nombre}</h1>
              <p className="text-gray-500 text-sm mt-1">{app.descripcionCorta}</p>
            </div>
          </div>

          <button
            onClick={handleDescargar}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition mb-8"
          >
            Descargar / Ver enlace
          </button>

          {app.capturas && app.capturas.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-3">Capturas de pantalla</h2>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {app.capturas.map((url, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={i}
                    src={url}
                    alt={`Captura ${i + 1}`}
                    className="h-48 w-auto rounded-lg border shrink-0 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="prose prose-sm max-w-none mb-8">
            <h2 className="text-lg font-semibold mb-2">Descripción</h2>
            <p className="whitespace-pre-line text-gray-700">{app.descripcionLarga}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm border-t pt-6">
            {app.version && (
              <div>
                <span className="text-gray-400">Versión</span>
                <p className="font-medium">{app.version}</p>
              </div>
            )}
            {app.requisitos && (
              <div>
                <span className="text-gray-400">Requisitos</span>
                <p className="font-medium">{app.requisitos}</p>
              </div>
            )}
            <div>
              <span className="text-gray-400">Publicado por</span>
              <p className="font-medium">{app.autorEmail}</p>
            </div>
            <div>
              <span className="text-gray-400">Descargas</span>
              <p className="font-medium">{app.clicks || 0}</p>
            </div>
          </div>

          {app.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {app.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
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

export default function AppDetalleClient() {
  const params = useParams();
  const id = params.id as string;

  const [app, setApp] = useState<AppDetalle | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const handleCopiar = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback silencioso
    }
  };

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
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <p className="text-zinc-500">Cargando...</p>
      </div>
    );
  }

  if (notFound || !app) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="text-center">
          <p className="text-zinc-400 mb-4">Esta app no existe o fue eliminada.</p>
          <Link href="/" className="text-blue-400 hover:underline">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <header className="border-b border-white/5 bg-[#0a0a0a]">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <Link href={`/${app.plataforma.toLowerCase()}`} className="text-sm text-zinc-400 hover:text-white">
            ← Volver a {app.plataforma}
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-10">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-20 h-20 rounded-xl bg-zinc-800 flex items-center justify-center overflow-hidden shrink-0">
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
                <span className="text-xs bg-blue-900/30 text-blue-400 px-2 py-1 rounded-full font-medium">
                  {app.categoria}
                </span>
                <span className="text-xs text-zinc-500">{app.plataforma}</span>
              </div>
              <h1 className="text-2xl font-bold text-white">{app.nombre}</h1>
              <p className="text-zinc-400 text-sm mt-1">{app.descripcionCorta}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-8">
            <button
              onClick={handleDescargar}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition"
            >
              Descargar / Ver enlace
            </button>
          </div>

          <div className="mb-8">
            <p className="text-xs text-zinc-500 mb-3 uppercase tracking-wide font-medium">Compartir</p>
            <div className="flex flex-wrap gap-2">
              {/* Facebook */}
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#1877F2] hover:bg-[#166fe5] text-white text-sm font-medium px-4 py-2 rounded-lg transition"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
                </svg>
                Facebook
              </a>

              {/* WhatsApp */}
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`${app.nombre} - ${app.descripcionCorta}\n${typeof window !== "undefined" ? window.location.href : ""}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white text-sm font-medium px-4 py-2 rounded-lg transition"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp
              </a>

              {/* X (Twitter) */}
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${app.nombre} - ${app.descripcionCorta}`)}&url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-black hover:bg-zinc-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition border border-zinc-700"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                X
              </a>

              {/* Telegram */}
              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}&text=${encodeURIComponent(`${app.nombre} - ${app.descripcionCorta}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#229ED9] hover:bg-[#1a8abf] text-white text-sm font-medium px-4 py-2 rounded-lg transition"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
                Telegram
              </a>

              {/* Copiar enlace */}
              <button
                onClick={handleCopiar}
                className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-medium px-4 py-2 rounded-lg transition"
              >
                {copied ? (
                  <>
                    <svg className="w-4 h-4 shrink-0 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    <span className="text-green-400">¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                    </svg>
                    Copiar enlace
                  </>
                )}
              </button>
            </div>
          </div>

          {app.capturas && app.capturas.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-3 text-white">Capturas de pantalla</h2>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {app.capturas.map((url, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={i}
                    src={url}
                    alt={`Captura ${i + 1}`}
                    className="h-48 w-auto rounded-lg border border-zinc-700 shrink-0 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="prose prose-sm max-w-none mb-8">
            <h2 className="text-lg font-semibold mb-2 text-white">Descripción</h2>
            <p className="whitespace-pre-line text-zinc-300">{app.descripcionLarga}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm border-t border-zinc-800 pt-6">
            {app.version && (
              <div>
                <span className="text-zinc-500">Versión</span>
                <p className="font-medium text-white">{app.version}</p>
              </div>
            )}
            {app.requisitos && (
              <div>
                <span className="text-zinc-500">Requisitos</span>
                <p className="font-medium text-white">{app.requisitos}</p>
              </div>
            )}
            <div>
              <span className="text-zinc-500">Publicado por</span>
              <p className="font-medium text-white">{app.autorEmail}</p>
            </div>
            <div>
              <span className="text-zinc-500">Descargas</span>
              <p className="font-medium text-white">{app.clicks || 0}</p>
            </div>
          </div>

          {app.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-6">
              {app.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-zinc-800 text-zinc-300 px-2 py-1 rounded-full"
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

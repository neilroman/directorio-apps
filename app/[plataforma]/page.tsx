"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

type AppItem = {
  id: string;
  nombre: string;
  categoria: string;
  descripcionCorta: string;
  plataforma: string;
  iconoUrl?: string;
};

export default function PlataformaPage() {
  const params = useParams();
  const plataformaUrl = params.plataforma as string;
  const plataforma =
    plataformaUrl === "windows" ? "Windows" : plataformaUrl === "android" ? "Android" : null;

  const [apps, setApps] = useState<AppItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!plataforma) {
      setLoading(false);
      return;
    }
    const fetchApps = async () => {
      const q = query(
        collection(db, "directory_apps"),
        where("plataforma", "==", plataforma),
        orderBy("creadoEn", "desc")
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as AppItem[];
      setApps(data);
      setLoading(false);
    };
    fetchApps();
  }, [plataforma]);

  if (!plataforma) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <p className="text-zinc-400">Plataforma no válida.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <header className="border-b border-white/5 bg-[#0a0a0a]">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-sm text-zinc-400 hover:text-white">
            ← Volver
          </Link>
          <h1 className="text-xl font-bold text-white">Apps de {plataforma}</h1>
          <div className="w-16" />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10">
        {loading && <p className="text-center text-zinc-500">Cargando...</p>}

        {!loading && apps.length === 0 && (
          <p className="text-center text-zinc-500">
            Todavía no hay apps publicadas en {plataforma}.
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {apps.map((app) => (
            <Link
              key={app.id}
              href={`/app/${app.id}`}
              className="border border-zinc-800 rounded-xl p-5 bg-zinc-900 hover:border-blue-500/40 transition flex gap-4"
            >
              <div className="w-14 h-14 rounded-lg bg-zinc-800 flex items-center justify-center overflow-hidden shrink-0">
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
                  <span className="text-2xl">📦</span>
                )}
              </div>
              <div className="min-w-0">
                <span className="text-xs text-blue-400 font-medium">{app.categoria}</span>
                <h3 className="text-lg font-semibold mt-1 truncate text-white">{app.nombre}</h3>
                <p className="text-zinc-400 text-sm mt-1 line-clamp-2">
                  {app.descripcionCorta}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
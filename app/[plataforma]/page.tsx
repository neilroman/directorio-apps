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
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Plataforma no válida.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-800">
            ← Volver
          </Link>
          <h1 className="text-xl font-bold">Apps de {plataforma}</h1>
          <div className="w-16" />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10">
        {loading && <p className="text-center text-gray-400">Cargando...</p>}

        {!loading && apps.length === 0 && (
          <p className="text-center text-gray-400">
            Todavía no hay apps publicadas en {plataforma}.
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {apps.map((app) => (
            <Link
              key={app.id}
              href={`/app/${app.id}`}
              className="border rounded-xl p-5 bg-white hover:shadow-md transition flex gap-4"
            >
              <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
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
                <span className="text-xs text-blue-600 font-medium">{app.categoria}</span>
                <h3 className="text-lg font-semibold mt-1 truncate">{app.nombre}</h3>
                <p className="text-gray-500 text-sm mt-1 line-clamp-2">
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
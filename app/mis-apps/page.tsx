"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/AuthContext";

type AppItem = {
  id: string;
  nombre: string;
  plataforma: string;
  categoria: string;
  descripcionCorta: string;
  iconoUrl?: string;
};

export default function MisAppsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [apps, setApps] = useState<AppItem[]>([]);
  const [cargandoApps, setCargandoApps] = useState(true);
  const [borrandoId, setBorrandoId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      if (!loading) setCargandoApps(false);
      return;
    }
    const fetchMisApps = async () => {
      const q = query(
        collection(db, "directory_apps"),
        where("autorId", "==", user.uid),
        orderBy("creadoEn", "desc")
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as AppItem[];
      setApps(data);
      setCargandoApps(false);
    };
    fetchMisApps();
  }, [user, loading]);

  const handleBorrar = async (id: string, nombre: string) => {
    const confirmar = window.confirm(
      `¿Seguro que quieres borrar "${nombre}"? Esta acción no se puede deshacer.`
    );
    if (!confirmar) return;

    setBorrandoId(id);
    try {
      await deleteDoc(doc(db, "directory_apps", id));
      setApps((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error(err);
      alert("No se pudo borrar la app. Inténtalo de nuevo.");
    } finally {
      setBorrandoId(null);
    }
  };

  if (!loading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="text-center">
          <p className="mb-4 text-zinc-400">Debes iniciar sesión para ver tus apps.</p>
          <button
            onClick={() => router.push("/login")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Iniciar sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <header className="border-b border-white/5 bg-[#0a0a0a]">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-sm text-zinc-400 hover:text-white">
            ← Volver
          </Link>
          <h1 className="text-xl font-bold text-white">Mis apps publicadas</h1>
          <div className="w-16" />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10">
        {(loading || cargandoApps) && (
          <p className="text-center text-zinc-500">Cargando...</p>
        )}

        {!loading && !cargandoApps && apps.length === 0 && (
          <div className="text-center">
            <p className="text-zinc-400 mb-4">Todavía no has publicado ninguna app.</p>
            <Link
              href="/publicar"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600"
            >
              Publicar mi primera app
            </Link>
          </div>
        )}

        <div className="space-y-3">
          {apps.map((app) => (
            <div
              key={app.id}
              className="border border-zinc-800 rounded-xl p-4 bg-zinc-900 flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center overflow-hidden shrink-0">
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
                  <span className="text-xl">📦</span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-blue-400 font-medium">{app.categoria}</span>
                  <span className="text-xs text-zinc-500">· {app.plataforma}</span>
                </div>
                <h3 className="font-semibold truncate text-white">{app.nombre}</h3>
                <p className="text-zinc-400 text-sm truncate">{app.descripcionCorta}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={`/app/${app.id}`}
                  className="text-sm text-zinc-400 hover:text-white px-3 py-1.5"
                >
                  Ver
                </Link>
                <button
                  onClick={() => handleBorrar(app.id, app.nombre)}
                  disabled={borrandoId === app.id}
                  className="text-sm text-red-400 hover:text-red-300 px-3 py-1.5 border border-red-800/50 rounded-lg disabled:opacity-40"
                >
                  {borrandoId === app.id ? "Borrando..." : "Borrar"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
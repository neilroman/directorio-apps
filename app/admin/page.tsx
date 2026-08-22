"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  collection,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  doc,
  updateDoc,
  where,
  setDoc,
  deleteField,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/AuthContext";

type AppItem = {
  id: string;
  nombre: string;
  plataforma: string;
  categoria: string;
  autorEmail: string;
  autorId: string;
};

type UsuarioEncontrado = {
  uid: string;
  email: string;
  banned?: boolean;
};

export default function AdminPage() {
  const { user, loading, isAdmin, isSuperAdmin } = useAuth();
  const router = useRouter();

  const [apps, setApps] = useState<AppItem[]>([]);
  const [cargandoApps, setCargandoApps] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [usuarioEncontrado, setUsuarioEncontrado] = useState<UsuarioEncontrado | null>(null);
  const [buscando, setBuscando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    if (!isAdmin) {
      if (!loading) setCargandoApps(false);
      return;
    }
    const fetchApps = async () => {
      const q = query(collection(db, "directory_apps"), orderBy("creadoEn", "desc"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as AppItem[];
      setApps(data);
      setCargandoApps(false);
    };
    fetchApps();
  }, [isAdmin, loading]);

  const handleBorrarApp = async (id: string, nombre: string) => {
    const confirmar = window.confirm(`¿Borrar "${nombre}" por infringir las normas?`);
    if (!confirmar) return;
    try {
      await deleteDoc(doc(db, "directory_apps", id));
      setApps((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error(err);
      alert("No se pudo borrar.");
    }
  };

  const handleBuscarUsuario = async () => {
    setMensaje("");
    setUsuarioEncontrado(null);
    if (!busqueda.trim()) return;
    setBuscando(true);
    try {
      const q = query(
        collection(db, "directory_users"),
        where("email", "==", busqueda.trim())
      );
      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        setMensaje("No se encontró ningún usuario con ese correo.");
      } else {
        const d = snapshot.docs[0];
        setUsuarioEncontrado({ uid: d.id, email: d.data().email, banned: d.data().banned });
      }
    } catch (err) {
      console.error(err);
      setMensaje("Error al buscar.");
    } finally {
      setBuscando(false);
    }
  };

  const handleBanear = async (banear: boolean) => {
    if (!usuarioEncontrado) return;
    const confirmar = window.confirm(
      banear
        ? `¿Banear a ${usuarioEncontrado.email}? No podrá publicar nuevas apps.`
        : `¿Quitar el baneo a ${usuarioEncontrado.email}?`
    );
    if (!confirmar) return;
    try {
      await updateDoc(doc(db, "directory_users", usuarioEncontrado.uid), {
        banned: banear,
      });
      setUsuarioEncontrado({ ...usuarioEncontrado, banned: banear });
    } catch (err) {
      console.error(err);
      alert("No se pudo actualizar el usuario.");
    }
  };

  const handleHacerAdmin = async () => {
    if (!usuarioEncontrado) return;
    const confirmar = window.confirm(
      `¿Nombrar administrador a ${usuarioEncontrado.email}?`
    );
    if (!confirmar) return;
    try {
      await setDoc(doc(db, "directory_admins", usuarioEncontrado.uid), {
        role: "admin",
        email: usuarioEncontrado.email,
      });
      setMensaje(`${usuarioEncontrado.email} ahora es administrador.`);
    } catch (err) {
      console.error(err);
      alert("No se pudo nombrar administrador.");
    }
  };

  const handleQuitarAdmin = async () => {
    if (!usuarioEncontrado) return;
    const confirmar = window.confirm(
      `¿Quitar los permisos de administrador a ${usuarioEncontrado.email}?`
    );
    if (!confirmar) return;
    try {
      await deleteDoc(doc(db, "directory_admins", usuarioEncontrado.uid));
      setMensaje(`Se quitaron los permisos de administrador a ${usuarioEncontrado.email}.`);
    } catch (err) {
      console.error(err);
      alert("No se pudo quitar el rol de administrador.");
    }
  };

  if (!loading && !user) {
    router.push("/login");
    return null;
  }

  if (!loading && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <p className="text-zinc-400">No tienes acceso a esta página.</p>
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
          <h1 className="text-xl font-bold text-white">Panel de administración</h1>
          <div className="w-16" />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10 space-y-10">
        {/* Buscar y moderar usuarios */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4 text-white">Moderar usuario</h2>
          <div className="flex gap-2 mb-4">
            <input
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Correo del usuario"
              className="flex-1 bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleBuscarUsuario}
              disabled={buscando}
              className="bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-40"
            >
              {buscando ? "Buscando..." : "Buscar"}
            </button>
          </div>

          {mensaje && <p className="text-sm text-zinc-400 mb-3">{mensaje}</p>}

          {usuarioEncontrado && (
            <div className="border border-zinc-700 rounded-lg p-4 flex items-center justify-between flex-wrap gap-3 bg-zinc-800">
              <div>
                <p className="font-medium text-white">{usuarioEncontrado.email}</p>
                <p className="text-xs text-zinc-500">UID: {usuarioEncontrado.uid}</p>
                {usuarioEncontrado.banned && (
                  <span className="text-xs text-red-400 font-medium">Baneado</span>
                )}
              </div>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => handleBanear(!usuarioEncontrado.banned)}
                  className="text-sm border border-red-800/50 text-red-400 px-3 py-1.5 rounded-lg hover:bg-red-900/20"
                >
                  {usuarioEncontrado.banned ? "Quitar baneo" : "Banear"}
                </button>

                {isSuperAdmin && (
                  <>
                    <button
                      onClick={handleHacerAdmin}
                      className="text-sm border border-blue-800/50 text-blue-400 px-3 py-1.5 rounded-lg hover:bg-blue-900/20"
                    >
                      Nombrar admin
                    </button>
                    <button
                      onClick={handleQuitarAdmin}
                      className="text-sm border border-zinc-700 text-zinc-400 px-3 py-1.5 rounded-lg hover:bg-zinc-700"
                    >
                      Quitar admin
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </section>

        {/* Todas las apps publicadas */}
        <section>
          <h2 className="text-lg font-semibold mb-4 text-white">Todas las apps publicadas</h2>

          {cargandoApps && <p className="text-zinc-500">Cargando...</p>}

          <div className="space-y-2">
            {apps.map((app) => (
              <div
                key={app.id}
                className="border border-zinc-800 rounded-lg p-4 bg-zinc-900 flex items-center justify-between gap-3 flex-wrap"
              >
                <div>
                  <p className="font-medium text-white">{app.nombre}</p>
                  <p className="text-xs text-zinc-500">
                    {app.plataforma} · {app.categoria} · {app.autorEmail}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/app/${app.id}`}
                    className="text-sm text-zinc-400 hover:text-white px-3 py-1.5"
                  >
                    Ver
                  </Link>
                  <button
                    onClick={() => handleBorrarApp(app.id, app.nombre)}
                    className="text-sm text-red-400 border border-red-800/50 px-3 py-1.5 rounded-lg hover:bg-red-900/20"
                  >
                    Borrar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
"use client";

import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";

export default function Home() {
  const { user, loading, logout, isAdmin } = useAuth();

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Barra superior */}
      <header className="border-b border-white/5 bg-[#0a0a0a]">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-white">Directorio de Apps</h1>

          <div className="flex items-center gap-3">
            {!loading && user && (
              <>
                <Link
                  href="/publicar"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600"
                >
                  Publicar app
                </Link>
                <Link
                  href="/mis-apps"
                  className="text-sm text-zinc-400 hover:text-white"
                >
                  Mis apps
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="text-sm text-blue-400 font-medium hover:text-blue-300"
                  >
                    Admin
                  </Link>
                )}
                <span className="text-sm text-zinc-400 hidden sm:inline">
                  {user.email}
                </span>
                <button
                  onClick={logout}
                  className="text-sm text-zinc-400 hover:text-white"
                >
                  Cerrar sesión
                </button>
              </>
            )}

            {!loading && !user && (
              <Link
                href="/login"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600"
              >
                Iniciar sesión
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-5xl font-extrabold text-center mb-2 text-white">
          Encuentra y publica apps
        </h2>
        <p className="text-zinc-500 text-center mb-10">
          Windows y Android, publicadas por la comunidad
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <Link
            href="/windows"
            className="border border-zinc-800 rounded-2xl overflow-hidden bg-zinc-900 text-center hover:border-blue-500/40 hover:shadow-[0_0_20px_rgba(59,130,246,0.1)] transition"
          >
            <img
              src="https://i.blogs.es/e2d0a8/windows/500_333.webp"
              alt="Windows"
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold text-white">Windows</h3>
              <p className="text-zinc-400 text-sm mt-1">Explorar apps de Windows</p>
            </div>
          </Link>

          <Link
            href="/android"
            className="border border-zinc-800 rounded-2xl overflow-hidden bg-zinc-900 text-center hover:border-blue-500/40 hover:shadow-[0_0_20px_rgba(59,130,246,0.1)] transition"
          >
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSV2ZV-mb10qRzRp8pZELDucBQ6OF9z3i7xnl3j4Pbqziu7XZEiu6wnbhsw&s=10"
              alt="Android"
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold text-white">Android</h3>
              <p className="text-zinc-400 text-sm mt-1">Explorar apps de Android</p>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
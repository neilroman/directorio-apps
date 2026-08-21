"use client";

import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";

export default function Home() {
  const { user, loading, logout, isAdmin } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Barra superior */}
      <header className="border-b bg-white">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Directorio de Apps</h1>

          <div className="flex items-center gap-3">
            {!loading && user && (
              <>
                <Link
                  href="/publicar"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
                >
                  Publicar app
                </Link>
                <Link
                  href="/mis-apps"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Mis apps
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="text-sm text-purple-600 font-medium hover:text-purple-800"
                  >
                    Admin
                  </Link>
                )}
                <span className="text-sm text-gray-600 hidden sm:inline">
                  {user.email}
                </span>
                <button
                  onClick={logout}
                  className="text-sm text-gray-500 hover:text-gray-800"
                >
                  Cerrar sesión
                </button>
              </>
            )}

            {!loading && !user && (
              <Link
                href="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
              >
                Iniciar sesión
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-2">
          Encuentra y publica apps
        </h2>
        <p className="text-gray-500 text-center mb-10">
          Windows y Android, publicadas por la comunidad
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <Link
            href="/windows"
            className="border rounded-xl p-8 bg-white text-center hover:shadow-md transition"
          >
            <div className="flex justify-center mb-3">
              <img
                src="https://i.blogs.es/e2d0a8/windows/500_333.webp"
                alt="Windows"
                className="h-12 w-auto object-contain"
              />
            </div>
            <h3 className="text-xl font-semibold">Windows</h3>
            <p className="text-gray-500 text-sm mt-1">Explorar apps de Windows</p>
          </Link>

          <Link
            href="/android"
            className="border rounded-xl p-8 bg-white text-center hover:shadow-md transition"
          >
            <div className="flex justify-center mb-3">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSV2ZV-mb10qRzRp8pZELDucBQ6OF9z3i7xnl3j4Pbqziu7XZEiu6wnbhsw&s=10"
                alt="Android"
                className="h-12 w-auto object-contain"
              />
            </div>
            <h3 className="text-xl font-semibold">Android</h3>
            <p className="text-gray-500 text-sm mt-1">Explorar apps de Android</p>
          </Link>
        </div>
      </main>
    </div>
  );
}
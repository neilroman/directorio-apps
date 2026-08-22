"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/AuthContext";

const CATEGORIAS = [
  "Utilidades",
  "Juegos",
  "Productividad",
  "Multimedia",
  "Desarrollo",
  "Educación",
  "Otros",
];

export default function PublicarPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [nombre, setNombre] = useState("");
  const [plataforma, setPlataforma] = useState("Android");
  const [categoria, setCategoria] = useState(CATEGORIAS[0]);
  const [descripcionCorta, setDescripcionCorta] = useState("");
  const [descripcionLarga, setDescripcionLarga] = useState("");
  const [enlace, setEnlace] = useState("");
  const [version, setVersion] = useState("");
  const [requisitos, setRequisitos] = useState("");
  const [tags, setTags] = useState("");
  const [iconoUrl, setIconoUrl] = useState("");
  const [capturasUrls, setCapturasUrls] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  if (!loading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="text-center">
          <p className="mb-4 text-zinc-400">Debes iniciar sesión para publicar una app.</p>
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setError("");
    setEnviando(true);
    try {
      await addDoc(collection(db, "directory_apps"), {
        nombre,
        plataforma,
        categoria,
        descripcionCorta,
        descripcionLarga,
        enlace,
        version,
        requisitos,
        tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
        iconoUrl: iconoUrl.trim(),
        capturas: capturasUrls
          .split(",")
          .map((u) => u.trim())
          .filter(Boolean),
        autorId: user.uid,
        autorEmail: user.email,
        clicks: 0,
        creadoEn: serverTimestamp(),
      });
      router.push("/");
    } catch (err) {
      console.error(err);
      setError("Hubo un error al publicar. Inténtalo de nuevo.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-10 px-4">
      <div className="max-w-xl mx-auto bg-zinc-900 p-8 rounded-xl border border-zinc-800">
        <h1 className="text-2xl font-bold mb-6 text-white">Publicar una app</h1>

        {error && (
          <p className="bg-red-900/20 text-red-400 text-sm p-3 rounded-lg mb-4 border border-red-800/30">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-zinc-300">Nombre de la app</label>
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-zinc-300">Plataforma</label>
              <select
                value={plataforma}
                onChange={(e) => setPlataforma(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Android">Android</option>
                <option value="Windows">Windows</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-zinc-300">Categoría</label>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {CATEGORIAS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-zinc-300">Descripción corta</label>
            <input
              value={descripcionCorta}
              onChange={(e) => setDescripcionCorta(e.target.value)}
              required
              maxLength={120}
              placeholder="Una frase que resuma qué hace la app"
              className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-zinc-300">
              Descripción completa (qué hace, funciones, etc.)
            </label>
            <textarea
              value={descripcionLarga}
              onChange={(e) => setDescripcionLarga(e.target.value)}
              required
              rows={6}
              placeholder="Explica con detalle qué hace tu app..."
              className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-zinc-300">Enlace de descarga</label>
            <input
              type="url"
              value={enlace}
              onChange={(e) => setEnlace(e.target.value)}
              required
              placeholder="https://github.com/tuusuario/turepo/releases/..."
              className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-zinc-300">
              URL del icono <span className="text-zinc-500 font-normal">(opcional)</span>
            </label>
            <input
              type="url"
              value={iconoUrl}
              onChange={(e) => setIconoUrl(e.target.value)}
              placeholder="https://raw.githubusercontent.com/.../icono.png"
              className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-zinc-500 mt-1">
              Enlace directo a una imagen (termina en .png, .jpg, .webp...).
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-zinc-300">
              URLs de capturas de pantalla{" "}
              <span className="text-zinc-500 font-normal">(opcional, separadas por comas)</span>
            </label>
            <textarea
              value={capturasUrls}
              onChange={(e) => setCapturasUrls(e.target.value)}
              rows={3}
              placeholder="https://.../captura1.png, https://.../captura2.png"
              className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-zinc-300">Versión</label>
              <input
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                placeholder="1.0.0"
                className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-zinc-300">Requisitos</label>
              <input
                value={requisitos}
                onChange={(e) => setRequisitos(e.target.value)}
                placeholder="Android 8.0+"
                className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-zinc-300">
              Tags (separados por comas)
            </label>
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="cad, offline, gratis"
              className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={enviando}
            className="w-full bg-blue-500 text-white py-2 rounded-lg font-medium hover:bg-blue-600 transition disabled:opacity-40"
          >
            {enviando ? "Publicando..." : "Publicar"}
          </button>
        </form>
      </div>
    </div>
  );
}
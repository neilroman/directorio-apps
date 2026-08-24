import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/AuthContext";
import ChatangoWidget from "@/components/ChatangoWidget";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Directorio de Apps",
  description: "Publica y descubre apps para Windows y Android",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://directorio-apps.vercel.app"),
  openGraph: {
    title: "Directorio de Apps",
    description: "Publica y descubre apps para Windows y Android",
    type: "website",
    locale: "es_ES",
    images: [{ url: "/favicon.ico", width: 48, height: 48, alt: "Directorio de Apps" }],
  },
  twitter: {
    card: "summary",
    title: "Directorio de Apps",
    description: "Publica y descubre apps para Windows y Android",
    images: ["/favicon.ico"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <div className="flex flex-1 min-h-full">
            <div className="flex-1 min-w-0">{children}</div>
            <aside className="w-[260px] shrink-0 hidden lg:flex flex-col bg-[#0a0a0a] border-l border-white/5">
              <div className="sticky top-0 h-screen flex items-center justify-center">
                <ChatangoWidget />
              </div>
            </aside>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
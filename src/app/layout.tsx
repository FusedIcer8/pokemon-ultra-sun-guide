import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pokemon Ultra Sun Guide — Routes, Pokemon, Items & Walkthrough",
  description: "The ultimate interactive companion guide for Pokemon Ultra Sun. Route encounters, Pokemon locations, walkthrough, items, and team-building tools.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)]">
        <Navbar />
        <main className="flex-1 pt-[var(--nav-height)]">{children}</main>
        <footer className="border-t border-gray-200 dark:border-gray-800 py-8 text-center text-sm text-gray-500">
          <div className="max-w-6xl mx-auto px-4">
            <p>Pokemon Ultra Sun Interactive Guide</p>
            <p className="mt-1 text-xs">Pokemon is a trademark of Nintendo / Game Freak. This is a fan-made guide.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}

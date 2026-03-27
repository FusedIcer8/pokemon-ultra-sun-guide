import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pokemon Ultra Sun Guide",
  description: "Interactive companion guide — routes, encounters, items, walkthrough",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen bg-[#FAFAF8] text-[#1C1C28] antialiased">
        <Navbar />
        <main className="pt-16">{children}</main>
        <footer className="mt-16 border-t border-[#E5E2DB] py-8 text-center text-sm text-[#9CA3AF]">
          <p>Pokemon Ultra Sun Interactive Guide</p>
          <p className="mt-1 text-xs">Pokemon is a trademark of Nintendo / Game Freak. Fan-made guide.</p>
        </footer>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Amiri, Fraunces, Inter } from "next/font/google";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Site administration | Rawdat ul-Huda",
  robots: { index: false, follow: false },
};

const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const amiri = Amiri({ subsets: ["arabic", "latin"], weight: ["400", "700"], variable: "--font-amiri", display: "swap" });

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${fraunces.variable} ${inter.variable} ${amiri.variable} bg-background font-body text-foreground antialiased`}>
        {children}
      </body>
    </html>
  );
}
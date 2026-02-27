import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Background from "@/components/ui/Background";
import { Toaster } from 'sonner';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tracintel | GEO Intelligence Dashboard",
  description: "Track, analyze, and improve brand performance on AI search platforms.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body
        className={`antialiased bg-white text-black selection:bg-black selection:text-white font-sans`}
      >
        <Background />
        <Toaster richColors position="top-right" theme="light" />
        {children}
      </body>
    </html>
  );
}

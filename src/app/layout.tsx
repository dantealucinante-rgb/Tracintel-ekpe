import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Background from "@/components/ui/Background";
import { Toaster } from 'sonner';

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
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
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body
        className={`antialiased bg-white text-black selection:bg-black selection:text-white m-0 p-0 overflow-x-hidden`}
      >
        <Background />
        <Toaster richColors position="top-right" theme="light" />
        {children}
      </body>
    </html>
  );
}

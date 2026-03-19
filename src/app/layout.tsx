import type { Metadata } from "next";
import { DM_Sans, Instrument_Serif } from "next/font/google";
import "./globals.css";
import Background from "@/components/ui/Background";
import { Toaster } from 'sonner';

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400"],
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
    <html lang="en" className={`${dmSans.variable} ${instrumentSerif.variable}`}>
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

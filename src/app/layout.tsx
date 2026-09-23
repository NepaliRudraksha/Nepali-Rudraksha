import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ClientHeaderWrapper, ClientFooterWrapper } from "@/components/layout/ClientLayoutWrappers";
import MaintenanceGuard from "@/components/MaintenanceGuard";
import { Providers } from "@/components/Providers";
import FloatingWhatsAppButton from "@/components/FloatingWhatsAppButton";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Nepali Rudraksha | Divine Beads, Better Life",
  description: "100% Authentic, Lab Certified Rudraksha from Nepal.",
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/fevicon.png', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${cormorantGaramond.variable} flex min-h-screen min-w-full flex-col antialiased`}>
        <Providers>
          <MaintenanceGuard>
            <ClientHeaderWrapper>
              <Header />
            </ClientHeaderWrapper>
            <main className="w-full flex-grow">{children}</main>
            <ClientFooterWrapper>
              <Footer />
            </ClientFooterWrapper>
            <FloatingWhatsAppButton />
          </MaintenanceGuard>
        </Providers>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ClientHeaderWrapper, ClientFooterWrapper } from "@/components/layout/ClientLayoutWrappers";
import MaintenanceGuard from "@/components/MaintenanceGuard";
import { Providers } from "@/components/Providers";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nepali Rudraksha | Divine Beads, Better Life",
  description: "100% Authentic, Lab Certified Rudraksha from Nepal.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} flex min-h-screen min-w-full flex-col antialiased`}>
        <Providers>
          <MaintenanceGuard>
            <ClientHeaderWrapper>
              <Header />
            </ClientHeaderWrapper>
            <main className="w-full flex-grow">{children}</main>
            <ClientFooterWrapper>
              <Footer />
            </ClientFooterWrapper>
          </MaintenanceGuard>
        </Providers>
      </body>
    </html>
  );
}

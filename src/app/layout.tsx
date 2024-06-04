import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ClientLayoutWrapper } from "@/components/ClientLayoutWrapper";
import { PropsWithChildren } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Oikotask",
  description: "Oikotask home management",
  manifest: "manifest.json",
  icons: "./logo_192x192.png",
  appleWebApp: true,
};

export default async function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen font-semibold`}>
        <ClientLayoutWrapper>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </ClientLayoutWrapper>
      </body>
    </html>
  );
}

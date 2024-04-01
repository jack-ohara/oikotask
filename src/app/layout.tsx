import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NextAuthProvider from "./components/NextAuthProvider";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider, theme } from "antd";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Oikotask",
  description: "Oikotask home management",
  manifest: "manifest.json",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-primary-bg min-h-screen text-gray-300 font-semibold`}
      >
        <AntdRegistry>
          <NextAuthProvider>{children}</NextAuthProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}

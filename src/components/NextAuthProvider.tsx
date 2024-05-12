"use client";

import { ConfigProvider, theme } from "antd";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

export default function NextAuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <SessionProvider>
      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
          token: { colorPrimary: "#065f46" },
        }}
        componentSize="large"
      >
        {children}
      </ConfigProvider>
    </SessionProvider>
  );
}

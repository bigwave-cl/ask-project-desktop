import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ask Project Manage",
  description: "React desktop version of Ask Project Manage powered by Tauri and Next.js.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}

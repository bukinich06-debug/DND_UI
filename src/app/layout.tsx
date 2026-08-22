import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DND UI",
  description: "Dungeons & Dragons adventure UI",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ height: "100%" }}>
      <body style={{ height: "100%", margin: 0 }}>{children}</body>
    </html>
  );
}

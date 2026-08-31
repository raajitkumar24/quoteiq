import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "QuoteIQ · Evidence-backed procurement intelligence",
  description:
    "Compile messy supplier quotations into verified comparisons and defensible award scenarios.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

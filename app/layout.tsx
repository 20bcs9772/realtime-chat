import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import { PageLoadingSkeleton } from "@/components/page-loading-skeleton";
import "./globals.css";

export const metadata: Metadata = {
  title: "Madhav Bansal",
  description: "Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable} antialiased scroll-smooth`}
    >
      <body className="font-sans">
        <Suspense fallback={<PageLoadingSkeleton />}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  );
}

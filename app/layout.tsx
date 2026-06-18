import type { Metadata } from "next";
import { Suspense } from "react";
import { NavigationLoader } from "@/components/navigation-loader";
import "./globals.css";

export const metadata: Metadata = {
  title: "Short-in",
  description:
    "Create custom short URLs, generate QR codes, and track clicks.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        {children}
        <Suspense fallback={null}>
          <NavigationLoader />
        </Suspense>
      </body>
    </html>
  );
}

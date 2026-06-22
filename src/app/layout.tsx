import type { Metadata } from "next";
import "./globals.css";

import { Providers } from "./providers";
import { 
  getCachedSchools, 
  getCachedProducts, 
  getCachedReadingPlan, 
  getCachedCategories,
  getCachedPublishers 
} from "@/lib/admin-cache";

export const metadata: Metadata = {
  title: "Neokudilonga",
  description: "A sua fonte de livros e jogos escolares.",
};

// Mark root layout dynamic to avoid prerendering issues in build pipelines
// when fetching data from internal route handlers.
export const dynamic = 'force-dynamic';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [
    initialSchools, 
    initialProducts, 
    initialReadingPlan, 
    initialCategories,
    initialPublishers
  ] = await Promise.all([
    getCachedSchools(),
    getCachedProducts(),
    getCachedReadingPlan(),
    getCachedCategories(),
    getCachedPublishers()
  ]);

  return (
    <html lang="pt" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="icon" href="/nk-favicon.svg?v=2" type="image/svg+xml" />
        <meta name="theme-color" content="#7A3E2E" />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>
        <Providers
          initialSchools={initialSchools}
          initialProducts={initialProducts}
          initialReadingPlan={initialReadingPlan}
          initialCategories={initialCategories}
          initialPublishers={initialPublishers}
        >
          {children}
        </Providers>
      </body>
    </html>
  );
}

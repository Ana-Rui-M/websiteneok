"use client";

import { ReactNode } from "react";
import { DataProvider } from "@/context/data-context";
import { LanguageProvider } from "@/context/language-context";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from "@/context/cart-context";
import { WhatsAppButton } from "@/components/whatsapp-button";
import RouteLoadingHandler from "@/components/ui/route-loading-handler";
import { 
  getCachedSchools, 
  getCachedProducts, 
  getCachedReadingPlan, 
  getCachedCategories,
  getCachedPublishers 
} from "@/lib/admin-cache";

export function Providers({ 
  children,
  initialSchools, 
  initialProducts, 
  initialReadingPlan, 
  initialCategories,
  initialPublishers
}: { 
  children: ReactNode;
  initialSchools: any[];
  initialProducts: any[];
  initialReadingPlan: any[];
  initialCategories: any[];
  initialPublishers: any[];
}) {

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <LanguageProvider>
        <DataProvider
          initialSchools={initialSchools}
          initialProducts={initialProducts}
          initialReadingPlan={initialReadingPlan}
          initialCategories={initialCategories}
          initialPublishers={initialPublishers}
        >
          <CartProvider>
            <RouteLoadingHandler />
            <Toaster />
            <WhatsAppButton />
            {children}
          </CartProvider>
        </DataProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
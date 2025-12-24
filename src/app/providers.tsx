import { ReactNode } from "react";
import { headers } from "next/headers";
import { DataProvider } from "@/context/data-context";
import { LanguageProvider } from "@/context/language-context";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { School, Product, ReadingPlanItem, Category } from "@/lib/types";
import { CartProvider } from "@/context/cart-context";
import { WhatsAppButton } from "@/components/whatsapp-button";
import RouteLoadingHandler from "@/components/ui/route-loading-handler";

async function getInitialData(baseUrl?: string): Promise<{
  initialSchools: School[];
  initialProducts: Product[];
  initialReadingPlan: ReadingPlanItem[];
  initialCategories: Category[];
}> {
  try {
    const baseEnv = process.env.NEXT_PUBLIC_BASE_URL || '';
    const base = baseUrl || baseEnv;
    const url = (path: string) => (base ? new URL(path, base).toString() : path);

    const [schoolsRes, productsRes, readingPlanRes, categoriesRes] = await Promise.all([
      fetch(url('/api/schools'), { cache: 'no-store' }),
      fetch(url('/api/products'), { cache: 'no-store' }),
      fetch(url('/api/reading-plan'), { cache: 'no-store' }),
      fetch(url('/api/categories'), { cache: 'no-store' }),
    ]);

    const initialSchools = schoolsRes.ok ? await schoolsRes.json() : [];
    const initialProducts = productsRes.ok ? await productsRes.json() : [];
    const initialReadingPlan = readingPlanRes.ok ? await readingPlanRes.json() : [];
    const initialCategories = categoriesRes.ok ? await categoriesRes.json() : [];

    return { initialSchools, initialProducts, initialReadingPlan, initialCategories };
  } catch (error) {
    console.error("Failed to fetch initial data:", error);
    return {
      initialSchools: [],
      initialProducts: [],
      initialReadingPlan: [],
      initialCategories: [],
    };
  }
}

export async function Providers({ children }: { children: ReactNode }) {
  // Compute an absolute base URL using request headers when env is not set
  const hdrs = await headers();
  const host = hdrs.get('host');
  const protoHeader = hdrs.get('x-forwarded-proto');
  const proto = protoHeader ? protoHeader : 'http';
  const baseFromHeaders = host ? `${proto}://${host}` : undefined;

  const { initialSchools, initialProducts, initialReadingPlan, initialCategories } = await getInitialData(baseFromHeaders);

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
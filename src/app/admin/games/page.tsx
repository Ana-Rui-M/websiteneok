
import { requireAdmin } from "@/lib/require-admin";
import GamesPageClient from "./client";
import { getCachedProducts, getCachedSchools } from "@/lib/admin-cache";

async function getGamesData() {
    const [products, schools] = await Promise.all([
        getCachedProducts(),
        getCachedSchools()
    ]);

    return { products, schools };
}

export default async function GamesPage() {
  await requireAdmin();
  const { products, schools } = await getGamesData();
  
  return (
    <GamesPageClient 
        initialProducts={products} 
        initialSchools={schools}
    />
  )
}

export const dynamic = 'force-dynamic';

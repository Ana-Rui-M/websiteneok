
import { requireAdmin } from "@/lib/require-admin";
import GamesPageClient from "./client";
import { getCachedProducts, getCachedSchools, getCachedReadingPlan } from "@/lib/admin-cache";

async function getGamesData() {
    const [products, schools, readingPlan] = await Promise.all([
        getCachedProducts(),
        getCachedSchools(),
        getCachedReadingPlan()
    ]);

    return { products, schools, readingPlan };
}

export default async function GamesPage() {
  await requireAdmin();
  const { products, schools, readingPlan } = await getGamesData();
  
  return (
    <GamesPageClient 
        initialProducts={products} 
        initialSchools={schools}
        initialReadingPlan={readingPlan}
    />
  )
}

export const dynamic = 'force-dynamic';

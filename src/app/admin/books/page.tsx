
import { requireAdmin } from "@/lib/require-admin";
import BooksPageClient from "./client";
import { getCachedProducts, getCachedReadingPlan, getCachedSchools, getCachedPublishers } from "@/lib/admin-cache";

async function getAdminData() {
    const [products, readingPlan, schools, publishers] = await Promise.all([
        getCachedProducts(),
        getCachedReadingPlan(),
        getCachedSchools(),
        getCachedPublishers()
    ]);

    return { products, readingPlan, schools, publishers };
}

export const dynamic = 'force-dynamic';

export default async function BooksPage() {
  await requireAdmin();
  const { products, readingPlan, schools, publishers } = await getAdminData();
  
  return (
    <BooksPageClient 
        initialProducts={products} 
        initialReadingPlan={readingPlan} 
        initialSchools={schools}
        initialPublishers={publishers}
    />
  )
}

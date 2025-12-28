
import { requireAdmin } from "@/lib/require-admin";
import type { Category } from "@/lib/types";
import CategoriesPageClient from "./client";
import { getCachedCategories } from "@/lib/admin-cache";

async function getCategoriesData() {
    const rawCategories = await getCachedCategories();
    const categories: Category[] = rawCategories.map(data => {
      const name = typeof data.name === 'object'
        ? data.name
        : { pt: (data as any).ptName || data.name || '', en: data.name || (data as any).ptName || '' };
      const type = data.type === 'game' ? 'game' : 'book';
      return { id: data.id, name, type } as Category;
    });
    return { categories };
}

export default async function CategoriesPage() {
  await requireAdmin();
  const { categories } = await getCategoriesData();
  
  return (
    <CategoriesPageClient 
        initialCategories={categories}
    />
  )
}

export const dynamic = 'force-dynamic';

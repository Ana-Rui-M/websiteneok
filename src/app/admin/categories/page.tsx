
import { firestore } from "@/lib/firebase-admin";
import { requireAdmin } from "@/lib/require-admin";
import type { Category } from "@/lib/types";
import CategoriesPageClient from "./client";

async function getCategoriesData() {
    const snapshot = await firestore.collection('categories').get();
    const categories: Category[] = snapshot.docs.map(doc => {
      const data: any = doc.data();
      const name = typeof data.name === 'object'
        ? data.name
        : { pt: data.ptName || data.name || '', en: data.name || data.ptName || '' };
      const type = data.type === 'game' ? 'game' : 'book';
      return { id: doc.id, name, type };
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

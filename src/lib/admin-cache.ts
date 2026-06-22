
import { firestore } from "@/lib/firebase-admin";
import { unstable_cache } from "next/cache";
import type { Product, ReadingPlanItem, School, Category, Order } from "@/lib/types";

// Helper function to serialize Firestore Timestamps
function serializeFirestoreTimestamps(data: any): any {
  if (data === null || typeof data !== 'object') {
    return data;
  }

  if (data instanceof Date) {
    return data.toISOString();
  }

  if (data.toDate && typeof data.toDate === 'function') { // Check for Firestore Timestamp
    return data.toDate().toISOString();
  }

  if (Array.isArray(data)) {
    return data.map(item => serializeFirestoreTimestamps(item));
  }

  const serializedData: { [key: string]: any } = {};
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      serializedData[key] = serializeFirestoreTimestamps(data[key]);
    }
  }
  return serializedData;
}

// Helper function to handle Firestore operations safely
async function safeFirestoreOperation<T>(operation: () => Promise<T[]>): Promise<T[]> {
  try {
    console.log('[admin-cache] Starting Firestore operation...');
    const result = await operation();
    console.log(`[admin-cache] Firestore operation returned ${result.length} items`);
    return result;
  } catch (error) {
    console.error('[admin-cache] Firestore operation failed:', error);
    return [];
  }
}

export const getCachedProducts = unstable_cache(
  async () => {
    if (!firestore) return [];
    return safeFirestoreOperation(async () => {
      const snapshot = await firestore!.collection('products').get();
      return snapshot.docs.map(doc => serializeFirestoreTimestamps({ id: doc.id, ...doc.data() }) as Product);
    });
  },
  ['admin-products'],
  { revalidate: 86400, tags: ['products', 'shop'] }
);

export const getCachedReadingPlan = unstable_cache(
  async () => {
    if (!firestore) return [];
    return safeFirestoreOperation(async () => {
      const snapshot = await firestore!.collection('readingPlan').get();
      return snapshot.docs.map(doc => serializeFirestoreTimestamps({ id: doc.id, ...doc.data() }) as ReadingPlanItem);
    });
  },
  ['admin-reading-plan'],
  { revalidate: 86400, tags: ['reading-plan', 'shop'] }
);

export const getCachedSchools = unstable_cache(
  async () => {
    if (!firestore) return [];
    return safeFirestoreOperation(async () => {
      const snapshot = await firestore!.collection('schools').get();
      const schools = snapshot.docs.map(doc => serializeFirestoreTimestamps({ id: doc.id, ...doc.data() }) as School);
      // Ordenar por 'order' (se existir) ou por nome como fallback
      return schools.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
    });
  },
  ['admin-schools'],
  { revalidate: 86400, tags: ['schools', 'shop'] }
);

export const getCachedCategories = unstable_cache(
  async () => {
    if (!firestore) return [];
    return safeFirestoreOperation(async () => {
      const snapshot = await firestore!.collection('categories').get();
      return snapshot.docs.map(doc => serializeFirestoreTimestamps({ id: doc.id, ...doc.data() }) as Category);
    });
  },
  ['admin-categories'],
  { revalidate: 86400, tags: ['categories', 'shop'] }
);

export const getCachedPublishers = unstable_cache(
  async () => {
    if (!firestore) return [];
    return safeFirestoreOperation(async () => {
      const snapshot = await firestore!.collection('publishers').get();
      return snapshot.docs.map(doc => serializeFirestoreTimestamps(doc.id)); // Publishers are just IDs, but serialize for consistency
    });
  },
  ['admin-publishers'],
  { revalidate: 86400, tags: ['publishers', 'shop'] }
);

export const getCachedOrders = unstable_cache(
  async () => {
    if (!firestore) return [];
    return safeFirestoreOperation(async () => {
      try {
        // Tentamos buscar ordenado por createdAt
        let snapshot = await firestore!.collection('orders').orderBy('createdAt', 'desc').get();
        
        // Se não houver resultados, pode ser que alguns documentos não tenham o campo createdAt
        // e o Firestore os exclui da consulta ordenada. Tentamos buscar todos.
        if (snapshot.empty) {
          snapshot = await firestore!.collection('orders').get();
        }
        
        const orders = snapshot.docs.map(doc => serializeFirestoreTimestamps({ id: doc.id, ...doc.data() }) as Order);
        
        // Ordenar por createdAt (se existir) ou por data de criação do documento
        return orders.sort((a, b) => {
          const aDate = a.createdAt || a.date || '';
          const bDate = b.createdAt || b.date || '';
          return new Date(bDate).getTime() - new Date(aDate).getTime();
        });
      } catch (error) {
        console.error('[Server Cache] Error fetching orders from Firestore:', error);
        return [];
      }
    });
  },
  ['admin-orders'],
  { revalidate: 300, tags: ['orders'] }
);

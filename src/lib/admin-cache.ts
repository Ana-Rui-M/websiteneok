
import { firestore } from "@/lib/firebase-admin";
import { unstable_cache } from "next/cache";
import type { Product, ReadingPlanItem, School, Category, Order } from "@/lib/types";

export const getCachedProducts = unstable_cache(
  async () => {
    console.log("[Server Cache] Fetching products from Firestore");
    const snapshot = await firestore.collection('products').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
  },
  ['admin-products'],
  { revalidate: 86400, tags: ['products', 'shop'] }
);

export const getCachedReadingPlan = unstable_cache(
  async () => {
    console.log("[Server Cache] Fetching reading plan from Firestore");
    const snapshot = await firestore.collection('readingPlan').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ReadingPlanItem));
  },
  ['admin-reading-plan'],
  { revalidate: 86400, tags: ['reading-plan', 'shop'] }
);

export const getCachedSchools = unstable_cache(
  async () => {
    console.log("[Server Cache] Fetching schools from Firestore");
    const snapshot = await firestore.collection('schools').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as School));
  },
  ['admin-schools'],
  { revalidate: 86400, tags: ['schools', 'shop'] }
);

export const getCachedCategories = unstable_cache(
  async () => {
    console.log("[Server Cache] Fetching categories from Firestore");
    const snapshot = await firestore.collection('categories').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
  },
  ['admin-categories'],
  { revalidate: 86400, tags: ['categories', 'shop'] }
);

export const getCachedPublishers = unstable_cache(
  async () => {
    console.log("[Server Cache] Fetching publishers from Firestore");
    const snapshot = await firestore.collection('publishers').get();
    return snapshot.docs.map(doc => doc.id);
  },
  ['admin-publishers'],
  { revalidate: 86400, tags: ['publishers', 'shop'] }
);

export const getCachedOrders = unstable_cache(
  async () => {
    console.log("[Server Cache] Fetching orders from Firestore");
    const snapshot = await firestore.collection('orders').orderBy('createdAt', 'desc').get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
  },
  ['admin-orders'],
  { revalidate: 300, tags: ['orders'] } // Orders cache shorter (5 min)
);

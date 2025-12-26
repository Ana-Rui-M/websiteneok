
import { Suspense } from 'react';
import { ShopPageContent } from '@/components/shop-page-content';
import Header from '@/components/header';
import { DataProvider } from '@/context/data-context';
import { firestore } from '@/lib/firebase-admin';

// Avoid prerendering Loja at build time; fetch data on request.
export const revalidate = 60;

async function getShopData() {
  const [
    schoolsSnapshot,
    productsSnapshot,
    readingPlanSnapshot,
    categoriesSnapshot,
  ] = await Promise.all([
    firestore.collection('schools').get(),
    firestore.collection('products').get(),
    firestore.collection('readingPlan').get(),
    firestore.collection('categories').get(),
  ]);

  const schoolsData = schoolsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  const productsData = productsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  const readingPlanData = readingPlanSnapshot.docs.map((doc) => doc.data());
  const categoriesData = categoriesSnapshot.docs.map((doc) => {
    const data = doc.data() as any;
    const name = typeof data.name === 'object'
      ? data.name
      : { pt: data.ptName || data.name || '', en: data.name || data.ptName || '' };
    const type = data.type === 'game' ? 'game' : 'book';
    return { id: doc.id, name, type };
  });

  return { schoolsData, productsData, readingPlanData, categoriesData };
}

function ShopPageLoading() {
    return (
        <div className="flex flex-1 items-center justify-center">
            <div className="font-headline text-xl text-muted-foreground">A carregar a loja...</div>
        </div>
    )
}

export default async function LojaPage() {
  const { schoolsData, productsData, readingPlanData, categoriesData } = await getShopData();

  return (
    <div className="flex min-h-screen w-full flex-col">
        <Header />
        <Suspense fallback={<ShopPageLoading />}>
            <DataProvider initialSchools={schoolsData} initialProducts={productsData} initialReadingPlan={readingPlanData} initialCategories={categoriesData}>
                <ShopPageContent 
                  initialSchools={schoolsData}
                  initialProducts={productsData}
                  initialReadingPlan={readingPlanData}
                  initialCategories={categoriesData}
                />
            </DataProvider>
        </Suspense>
    </div>
  );
}


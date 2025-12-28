
import { requireAdmin } from "@/lib/require-admin";
import OrdersPageClient from "./client";
import { getCachedOrders, getCachedSchools } from "@/lib/admin-cache";

async function getOrdersData() {
    const [orders, schools] = await Promise.all([
        getCachedOrders(),
        getCachedSchools()
    ]);

    return { orders, schools };
}

export default async function OrdersPage() {
  await requireAdmin();
  const { orders, schools } = await getOrdersData();
  
  return (
    <OrdersPageClient 
        initialOrders={orders}
        initialSchools={schools}
    />
  )
}

export const dynamic = 'force-dynamic';


import { requireAdmin } from "@/lib/require-admin";
import OrdersPageClient from "./client";
import { getCachedOrders, getCachedSchools } from "@/lib/admin-cache";

async function getOrdersData() {
    console.log("[OrdersPage] Fetching data...");
    try {
        const [orders, schools] = await Promise.all([
            getCachedOrders(),
            getCachedSchools()
        ]);
        console.log(`[OrdersPage] Data fetched: ${orders.length} orders, ${schools.length} schools`);
        return { orders, schools };
    } catch (error) {
        console.error("[OrdersPage] Error fetching data:", error);
        return { orders: [], schools: [] };
    }
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

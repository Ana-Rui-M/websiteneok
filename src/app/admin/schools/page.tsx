
import { requireAdmin } from "@/lib/require-admin";
import SchoolsPageClient from "./client";
import { getCachedSchools } from "@/lib/admin-cache";

async function getSchoolsData() {
    const schools = await getCachedSchools();
    return { schools };
}

export const dynamic = 'force-dynamic';
export default async function SchoolsPage() {
  await requireAdmin();
  const { schools } = await getSchoolsData();
  
  return (
    <SchoolsPageClient 
        initialSchools={schools}
    />
  )
}

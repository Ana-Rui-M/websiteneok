
import { requireAdmin } from "@/lib/require-admin";
import PublishersPageClient from "./client";
import { getCachedPublishers } from "@/lib/admin-cache";

async function getPublishersData() {
    const publishers = (await getCachedPublishers()).sort();
    return { publishers };
}

export default async function PublishersPage() {
  await requireAdmin();
  const { publishers } = await getPublishersData();
  
  return (
    <PublishersPageClient 
        initialPublishers={publishers}
    />
  )
}

export const dynamic = 'force-dynamic';

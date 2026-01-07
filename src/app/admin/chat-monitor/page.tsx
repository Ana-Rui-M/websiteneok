
import { requireAdmin } from "@/lib/require-admin";
import ChatMonitorClient from "./client";

export default async function ChatMonitorPage() {
  await requireAdmin();
  
  return <ChatMonitorClient />;
}

export const dynamic = 'force-dynamic';

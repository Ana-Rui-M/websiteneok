"use client";

import { useEffect, useState } from "react";
import { User, Shield } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

export function UserProfile() {
  const [userInfo, setUserInfo] = useState<{ email: string; role: string } | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await fetch('/api/auth/verify', { credentials: 'include' });
        const data = await res.json();
        if (data?.isAuthenticated) {
          setUserInfo({ email: data.email, role: data.role });
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };
    fetchUserInfo();
  }, []);

  if (!userInfo) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="sm" className="gap-2">
          <User className="size-4" />
          <div className="flex flex-col">
            <span className="text-xs font-medium">{userInfo.email}</span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Shield className="size-3" />
              {userInfo.role === 'owner' ? 'Owner' : 'Editor'}
            </span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

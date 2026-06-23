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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        console.log('[UserProfile] Fetching user info...');
        const res = await fetch('/api/auth/verify', { credentials: 'include' });
        const data = await res.json();
        console.log('[UserProfile] Response:', data);
        if (data?.isAuthenticated) {
          setUserInfo({ email: data.email, role: data.role });
        } else {
          setError('Not authenticated');
        }
      } catch (error) {
        console.error('[UserProfile] Error fetching user info:', error);
        setError('Failed to fetch');
      }
    };
    fetchUserInfo();
  }, []);

  if (error) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="sm" className="gap-2 text-destructive">
            <User className="size-4" />
            <span className="text-xs">{error}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  if (!userInfo) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="sm" className="gap-2 text-muted-foreground">
            <User className="size-4" />
            <span className="text-xs">Loading...</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
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

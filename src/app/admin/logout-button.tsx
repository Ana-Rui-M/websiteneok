"use client";

import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { LogOut } from "lucide-react";
import { getAuth, signOut } from "firebase/auth";
import { app } from "../../lib/firebase";

export function LogoutButton() {
    const router = useRouter();
    const { toast } = useToast();

    const handleLogout = async () => {
        try {
            const auth = getAuth(app);
            if (auth.currentUser) {
                await signOut(auth);
            }

            const response = await fetch("/api/auth/logout", {
                method: "POST",
            });

            if (response.ok) {
                toast({ title: "Logged out successfully." });
                router.push("/admin/login");
            } else {
                throw new Error("Failed to clear backend session.");
            }
        } catch (error) {
            console.error("Logout error:", error);
            toast({
                title: "Logout failed",
                description: "An error occurred during logout. Please try again.",
                variant: "destructive",
            });
        }
    };

    return (
        <SidebarMenuButton onClick={handleLogout} tooltip="Logout">
            <LogOut />
            <span>Logout</span>
        </SidebarMenuButton>
    );
}

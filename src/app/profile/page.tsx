import type { Metadata } from "next";
import { ProfileView } from "@/components/profile-view";

export const metadata: Metadata = {
  title: "My Profile | Wanderlust",
  description: "Manage your account settings and travel preferences with Wanderlust.",
};

export default function ProfilePage() {
  return (
    <main className="min-h-[calc(100vh-140px)] bg-white">
      <ProfileView />
    </main>
  );
}


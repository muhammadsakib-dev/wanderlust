import type { Metadata } from "next";
import { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/admin-dashboard";

export const metadata: Metadata = {
  title: "Admin Management | Wanderlust",
  description: "Manage travel destinations, bookings, and operations on Wanderlust.",
};

async function AdminProtectedDashboard() {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get("wanderlust_admin_session")?.value === "true";

  if (!isAdmin) {
    redirect("/admin/login?callbackUrl=/admin");
  }

  return <AdminDashboard />;
}

export default function AdminPage() {
  return (
    <main className="min-h-[calc(100vh-140px)] bg-slate-50/50">
      <Suspense
        fallback={
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center text-gray-500">
            <div className="w-6 h-6 border-2 border-[#14a1bf] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <span className="text-sm">Loading admin dashboard...</span>
          </div>
        }
      >
        <AdminProtectedDashboard />
      </Suspense>
    </main>
  );
}


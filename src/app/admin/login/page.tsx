import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminLoginForm } from "@/components/admin-login-form";

export const metadata: Metadata = {
  title: "Admin Portal Login | Wanderlust",
  description: "Sign in with administrator credentials to manage Wanderlust packages and bookings.",
};

export default function AdminLoginPage() {
  return (
    <main className="min-h-[calc(100vh-140px)] bg-slate-50/70 flex items-center justify-center">
      <Suspense fallback={<div className="py-20 text-center text-sm text-gray-400">Loading admin portal...</div>}>
        <AdminLoginForm />
      </Suspense>
    </main>
  );
}


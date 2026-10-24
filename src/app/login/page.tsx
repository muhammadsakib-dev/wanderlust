import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/login-form";

export const metadata: Metadata = {
  title: "Login | Wanderlust",
  description: "Resume your adventure with Wanderlust. Sign in to your account.",
};

export default function LoginPage() {
  return (
    <main className="min-h-[calc(100vh-140px)] bg-slate-50/50 flex items-center justify-center">
      <Suspense fallback={<div className="py-20 text-center text-sm text-gray-400">Loading sign-in...</div>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}


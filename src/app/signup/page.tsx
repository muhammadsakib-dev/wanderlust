import type { Metadata } from "next";
import { Suspense } from "react";
import { SignupForm } from "@/components/signup-form";

export const metadata: Metadata = {
  title: "Sign Up | Wanderlust",
  description: "Start your adventure with Wanderlust. Create an account today.",
};

export default function SignupPage() {
  return (
    <main className="min-h-[calc(100vh-140px)] bg-slate-50/50 flex items-center justify-center">
      <Suspense fallback={<div className="py-20 text-center text-sm text-gray-400">Loading registration...</div>}>
        <SignupForm />
      </Suspense>
    </main>
  );
}


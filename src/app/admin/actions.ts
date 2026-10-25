"use server";

import { cookies } from "next/headers";

export interface AdminLoginResult {
  success: boolean;
  error?: string;
}

export async function loginAdminAction(formData: FormData): Promise<AdminLoginResult> {
  const data: Record<string, string> = Object.fromEntries(formData) as Record<string, string>;
  const email = (data.email || "").trim().toLowerCase();
  const password = data.password || "";

  const adminEmail = (process.env.ADMIN_EMAIL || "admin@wanderlust.com").trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

  if (email === adminEmail && password === adminPassword) {
    const cookieStore = await cookies();
    cookieStore.set("wanderlust_admin_session", "true", {
      path: "/",
      maxAge: 86400, // 24 hours
      sameSite: "lax",
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
    });

    return { success: true };
  }

  return {
    success: false,
    error: "Invalid administrator credentials. Please check your email and password.",
  };
}

export async function logoutAdminAction(): Promise<{ success: boolean }> {
  const cookieStore = await cookies();
  cookieStore.delete("wanderlust_admin_session");
  return { success: true };
}


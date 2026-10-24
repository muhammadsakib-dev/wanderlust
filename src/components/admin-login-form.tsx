"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Shield, Mail, Lock, Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react";

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  const handleFillDemo = () => {
    setEmail("admin@wanderlust.com");
    setPassword("admin123");
    setErrorMessage("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    setTimeout(() => {
      // Validate credentials
      const validEmail = email.trim().toLowerCase() === "admin@wanderlust.com";
      const validPass = password.trim() === "admin123";

      if (validEmail && validPass) {
        if (typeof window !== "undefined") {
          localStorage.setItem("wanderlust_admin_session", "true");
          document.cookie =
            "wanderlust_admin_session=true; path=/; max-age=86400; SameSite=Lax";
        }
        router.push(callbackUrl);
        router.refresh();
      } else {
        setErrorMessage(
          "Invalid administrator credentials. Try demo credentials: admin@wanderlust.com / admin123"
        );
        setIsLoading(false);
      }
    }, 500);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center py-12 sm:py-16 px-4">
      {/* Return to website */}
      <div className="w-full max-w-[440px] mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 stroke-[1.75]" />
          <span>Back to Wanderlust</span>
        </Link>
      </div>

      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-12 h-12 rounded-full bg-[#14a1bf]/10 text-[#14a1bf] flex items-center justify-center mx-auto mb-3">
          <Shield className="w-6 h-6 stroke-[1.75]" />
        </div>
        <span className="text-xs font-semibold tracking-widest uppercase text-[#14a1bf]">
          Security Protected
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mt-1">
          Admin Portal Login
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-gray-500 max-w-sm mx-auto">
          Sign in with administrator credentials to manage travel destinations, bookings, and operations
        </p>
      </div>

      {/* Form Card */}
      <div className="w-full max-w-[440px] bg-white border border-gray-200 shadow-md p-7 sm:p-9 rounded-none">
        {errorMessage && (
          <div className="mb-5 p-3 text-xs sm:text-sm text-red-600 bg-red-50 border border-red-200">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-4.5">
          {/* Admin Email */}
          <div>
            <label
              htmlFor="admin-email"
              className="block text-xs sm:text-sm font-medium text-gray-900 mb-1.5"
            >
              Admin Email
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 w-4 h-4 text-gray-400 stroke-[1.75]" />
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@wanderlust.com"
                required
                className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-gray-50/70 border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#14a1bf] focus:bg-white transition-colors"
              />
            </div>
          </div>

          {/* Admin Password */}
          <div>
            <label
              htmlFor="admin-password"
              className="block text-xs sm:text-sm font-medium text-gray-900 mb-1.5"
            >
              Security Password
            </label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 w-4 h-4 text-gray-400 stroke-[1.75]" />
              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                required
                className="w-full pl-10 pr-10 py-2.5 text-sm bg-gray-50/70 border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#14a1bf] focus:bg-white transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 text-gray-400 hover:text-gray-600 cursor-pointer p-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 stroke-[1.75]" />
                ) : (
                  <Eye className="w-4 h-4 stroke-[1.75]" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#14a1bf] hover:bg-[#108fa9] text-white py-3 px-4 text-sm font-medium tracking-wide transition-colors cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2 rounded-none"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin stroke-[2]" />}
              <span>{isLoading ? "Verifying..." : "Access Admin Console"}</span>
            </button>
          </div>
        </form>

        {/* Demo Credentials Quick Fill */}
        <div className="mt-6 pt-5 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400 mb-2">Demo Testing Credentials:</p>
          <button
            type="button"
            onClick={handleFillDemo}
            className="text-xs font-medium text-[#14a1bf] hover:underline cursor-pointer"
          >
            Autofill (admin@wanderlust.com / admin123)
          </button>
        </div>
      </div>
    </div>
  );
}


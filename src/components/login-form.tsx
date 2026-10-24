"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { signIn } from "@/lib/auth-client";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [rememberMe, setRememberMe] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const res = await signIn.email({
        email,
        password,
        rememberMe,
        callbackURL: callbackUrl,
      });

      if (res?.error) {
        setErrorMessage(
          res.error.message || "Failed to sign in. Please verify your email and password."
        );
        setIsLoading(false);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An unexpected error occurred.";
      setErrorMessage(msg);
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage("");
    try {
      await signIn.social({
        provider: "google",
        callbackURL: callbackUrl,
      });
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Google sign-in is not configured yet. Please provide GOOGLE_CLIENT_ID in your .env file.";
      setErrorMessage(msg);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center py-12 sm:py-16 px-4">
      {/* Title & Subtitle */}
      <div className="text-center mb-8 sm:mb-9">
        <h1 className="text-3xl sm:text-4xl md:text-[40px] font-bold text-gray-900 tracking-tight">
          Welcome Back
        </h1>
        <p className="mt-2.5 text-sm sm:text-base text-gray-500 font-normal">
          Resume your adventure with Wanderlust
        </p>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-[450px] bg-white border border-gray-100 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.05)] p-7 sm:p-9 rounded-none">
        {errorMessage && (
          <div className="mb-5 p-3 text-xs sm:text-sm text-red-600 bg-red-50 border border-red-200">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-4.5">
          {/* Email Address */}
          <div>
            <label
              htmlFor="email"
              className="block text-xs sm:text-sm font-medium text-gray-900 mb-1.5"
            >
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 w-4 h-4 text-gray-400 stroke-[1.75]" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-gray-50/70 border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#14a1bf] focus:bg-white transition-colors"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-xs sm:text-sm font-medium text-gray-900 mb-1.5"
            >
              Password
            </label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 w-4 h-4 text-gray-400 stroke-[1.75]" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
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

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-xs sm:text-sm pt-0.5">
            <label className="flex items-center gap-2 cursor-pointer select-none text-gray-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 border border-gray-300 rounded-none text-[#14a1bf] focus:ring-[#14a1bf] cursor-pointer accent-[#14a1bf]"
              />
              <span>Remember me</span>
            </label>

            <Link
              href="#forgot-password"
              className="text-[#14a1bf] hover:text-[#108fa9] transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          {/* Sign In Button */}
          <div className="pt-1">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#14a1bf] hover:bg-[#108fa9] text-white py-2.5 px-4 text-sm font-medium tracking-wide transition-colors cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2 rounded-none"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin stroke-[2]" />}
              <span>{isLoading ? "Signing In..." : "Sign In"}</span>
            </button>
          </div>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-3 text-gray-400 font-normal">
              Or continue with
            </span>
          </div>
        </div>

        {/* Google Sign In Button */}
        <div>
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full border border-gray-200 hover:bg-gray-50/80 bg-white text-gray-700 py-2.5 px-4 text-sm font-medium flex items-center justify-center gap-2.5 transition-colors cursor-pointer rounded-none"
          >
            {/* Google Icon */}
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Sign Up With Google</span>
          </button>
        </div>

        {/* Footer Link */}
        <div className="mt-6 text-center text-xs sm:text-sm text-gray-500">
          <span>Don&apos;t have an account? </span>
          <Link
            href="/signup"
            className="text-[#14a1bf] hover:text-[#108fa9] font-medium transition-colors"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}


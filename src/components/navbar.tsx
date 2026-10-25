"use client";

// Essential Imports
import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { User, Menu, X, LogOut } from "lucide-react";
import { useSession, signOut } from "@/lib/auth-client";

export function Navbar() {

  // Router and State Management
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  // Determine Active Route
  const isHome = pathname === "/";
  const isDestinations = pathname.startsWith("/destinations");
  const isBookings = pathname === "/bookings";
  const isLogin = pathname === "/login";
  const isSignup = pathname === "/signup";
  const isProfile = pathname === "/profile";
  const isAdmin = pathname.startsWith("/admin");

  // Handle User Sign Out
  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100/80 shadow-xs">
      <div className="w-full px-4 sm:px-8 lg:px-12 h-18 flex items-center justify-between">
        {/* Left Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 lg:gap-8">
          <Link
            href="/"
            className={`text-[15px] font-medium tracking-wide transition-colors ${
              isHome
                ? "text-[#14a1bf] border-b-2 border-[#14a1bf] pb-0.5"
                : "text-gray-800 hover:text-[#14a1bf]"
            }`}
          >
            Home
          </Link>
          <Link
            href="/destinations"
            className={`text-[15px] font-medium tracking-wide transition-colors ${
              isDestinations
                ? "text-[#14a1bf] border-b-2 border-[#14a1bf] pb-0.5"
                : "text-gray-800 hover:text-[#14a1bf]"
            }`}
          >
            Destinations
          </Link>
          <Link
            href="/bookings"
            className={`text-[15px] font-medium tracking-wide transition-colors ${
              isBookings
                ? "text-[#14a1bf] border-b-2 border-[#14a1bf] pb-0.5"
                : "text-gray-800 hover:text-[#14a1bf]"
            }`}
          >
            My Bookings
          </Link>
          <Link
            href="/admin"
            className={`text-[15px] font-medium tracking-wide transition-colors ${
              isAdmin
                ? "text-[#14a1bf] border-b-2 border-[#14a1bf] pb-0.5"
                : "text-gray-800 hover:text-[#14a1bf]"
            }`}
          >
            Admin
          </Link>
        </nav>

        {/* Center Logo */}
        <div className="flex-1 md:flex-initial flex justify-start md:justify-center">
          <Link href="/" className="inline-flex items-center">
            <Image
              src="/images/Wanderlast.png"
              alt="Wanderlast"
              width={180}
              height={30}
              priority
              className="h-6 sm:h-7 w-auto object-contain"
            />
          </Link>
        </div>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {session?.user ? (

            // if user is logged in
            <>
            {/* User Profile Link */}
              <Link
                href="/profile"
                className={`flex items-center gap-2 text-[15px] font-medium tracking-wide transition-colors ${
                  isProfile
                    ? "text-[#14a1bf] border-b-2 border-[#14a1bf] pb-0.5"
                    : "text-gray-800 hover:text-[#14a1bf]"
                }`}
              >

                {/* User Avatar or Initial */}
                <div className="w-8 h-8 rounded-full bg-[#14a1bf]/10 text-[#14a1bf] flex items-center justify-center font-semibold text-xs uppercase">
                  {session.user.name ? session.user.name[0] : <User className="w-4 h-4" />}
                </div>

                {/* User Name Display on Navbar */}
                <span className="truncate max-w-30">
                  {session.user.name?.split(" ")[0] || "Profile"}
                </span>

              </Link>

              {/* Sign Out Button */}
              <button
                type="button"
                onClick={handleSignOut}
                className="flex items-center gap-1.5 text-gray-700 hover:text-red-600 text-[15px] font-medium tracking-wide transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4 stroke-[1.75]" />
                <span>Sign Out</span>
              </button>
            </>
          ) : (
            
            // if user is not logged in
            <>
              <Link
                href="/profile"
                className={`flex items-center gap-1.5 text-[15px] font-medium tracking-wide transition-colors ${
                  isProfile
                    ? "text-[#14a1bf] border-b-2 border-[#14a1bf] pb-0.5"
                    : "text-gray-800 hover:text-[#14a1bf]"
                }`}
              >
                <User className="w-4 h-4 stroke-2" />
                <span>Profile</span>
              </Link>
              <Link
                href="/login"
                className={`text-[15px] font-medium tracking-wide transition-colors ${
                  isLogin
                    ? "text-[#14a1bf] border-b-2 border-[#14a1bf] pb-0.5"
                    : "text-gray-800 hover:text-[#14a1bf]"
                }`}
              >
                Login
              </Link>
              <Link
                href="/signup"
                className={`text-[15px] font-medium tracking-wide transition-colors ${
                  isSignup
                    ? "text-[#14a1bf] border-b-2 border-[#14a1bf] pb-0.5"
                    : "text-gray-800 hover:text-[#14a1bf]"
                }`}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden items-center">
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            className="p-2 text-gray-700 hover:text-[#14a1bf] focus:outline-none cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-6 py-4 space-y-3 shadow-md animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-3 pb-3 border-b border-gray-100">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`font-medium text-base py-1 ${
                isHome ? "text-[#14a1bf]" : "text-gray-800 hover:text-[#14a1bf]"
              }`}
            >
              Home
            </Link>
            <Link
              href="/destinations"
              onClick={() => setMobileMenuOpen(false)}
              className={`font-medium text-base py-1 ${
                isDestinations ? "text-[#14a1bf]" : "text-gray-800 hover:text-[#14a1bf]"
              }`}
            >
              Destinations
            </Link>
            <Link
              href="/bookings"
              onClick={() => setMobileMenuOpen(false)}
              className={`font-medium text-base py-1 ${
                isBookings ? "text-[#14a1bf]" : "text-gray-800 hover:text-[#14a1bf]"
              }`}
            >
              My Bookings
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className={`font-medium text-base py-1 ${
                isAdmin ? "text-[#14a1bf]" : "text-gray-800 hover:text-[#14a1bf]"
              }`}
            >
              Admin
            </Link>
          </nav>
          <div className="flex flex-col space-y-3 pt-1">
            {session?.user ? (
              <>
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 font-medium text-base py-1 ${
                    isProfile ? "text-[#14a1bf]" : "text-gray-800 hover:text-[#14a1bf]"
                  }`}
                >
                  <div className="w-7 h-7 rounded-full bg-[#14a1bf]/10 text-[#14a1bf] flex items-center justify-center font-semibold text-xs uppercase">
                    {session.user.name ? session.user.name[0] : <User className="w-4 h-4" />}
                  </div>
                  <span>{session.user.name || session.user.email}</span>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleSignOut();
                  }}
                  className="flex items-center gap-2 text-gray-700 hover:text-red-600 font-medium text-base py-1 text-left cursor-pointer"
                >
                  <LogOut className="w-4 h-4 stroke-[1.75]" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 font-medium text-base py-1 ${
                    isProfile ? "text-[#14a1bf]" : "text-gray-800 hover:text-[#14a1bf]"
                  }`}
                >
                  <User className="w-4 h-4 stroke-[2]" />
                  <span>Profile</span>
                </Link>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`font-medium text-base py-1 ${
                    isLogin ? "text-[#14a1bf]" : "text-gray-800 hover:text-[#14a1bf]"
                  }`}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`font-medium text-base py-1 ${
                    isSignup ? "text-[#14a1bf]" : "text-gray-800 hover:text-[#14a1bf]"
                  }`}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

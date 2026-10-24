"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Menu, X } from "lucide-react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const pathname = usePathname();

  const isHome = pathname === "/";
  const isDestinations = pathname.startsWith("/destinations");

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
            className="text-gray-800 hover:text-[#14a1bf] text-[15px] font-medium tracking-wide transition-colors"
          >
            My Bookings
          </Link>
          <Link
            href="/admin"
            className="text-gray-800 hover:text-[#14a1bf] text-[15px] font-medium tracking-wide transition-colors"
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
          <Link
            href="#profile"
            className="flex items-center gap-1.5 text-gray-800 hover:text-[#14a1bf] text-[15px] font-medium tracking-wide transition-colors"
          >
            <User className="w-4 h-4 stroke-2" />
            <span>Profile</span>
          </Link>
          <Link
            href="#login"
            className="text-gray-800 hover:text-[#14a1bf] text-[15px] font-medium tracking-wide transition-colors"
          >
            Login
          </Link>
          <Link
            href="#signup"
            className="text-gray-800 hover:text-[#14a1bf] text-[15px] font-medium tracking-wide transition-colors"
          >
            Sign Up
          </Link>
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
              href="#bookings"
              onClick={() => setMobileMenuOpen(false)}
              className="text-gray-800 hover:text-[#14a1bf] font-medium text-base py-1"
            >
              My Bookings
            </Link>
            <Link
              href="#admin"
              onClick={() => setMobileMenuOpen(false)}
              className="text-gray-800 hover:text-[#14a1bf] font-medium text-base py-1"
            >
              Admin
            </Link>
          </nav>
          <div className="flex flex-col space-y-3 pt-1">
            <Link
              href="#profile"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 text-gray-800 hover:text-[#14a1bf] font-medium text-base py-1"
            >
              <User className="w-4 h-4 stroke-[2]" />
              <span>Profile</span>
            </Link>
            <Link
              href="#login"
              onClick={() => setMobileMenuOpen(false)}
              className="text-gray-800 hover:text-[#14a1bf] font-medium text-base py-1"
            >
              Login
            </Link>
            <Link
              href="#signup"
              onClick={() => setMobileMenuOpen(false)}
              className="text-gray-800 hover:text-[#14a1bf] font-medium text-base py-1"
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function Footer() {
  const [email, setEmail] = React.useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      console.log("Subscribed newsletter email:", email);
      setEmail("");
    }
  };

  return (
    <footer className="w-full bg-[#0d0d0d] text-white pt-16 sm:pt-20 pb-10 px-6 sm:px-10 lg:px-16 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        {/* Top Brand Name & Tagline */}
        <div className="mb-12 sm:mb-16">
          <Link href="/" className="inline-block">
            <h2 className="text-4xl sm:text-5xl md:text-[54px] font-serif font-normal tracking-tight text-white">
              Wanderlust
            </h2>
          </Link>
          <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-400 font-light max-w-xl">
            Your gateway to extraordinary travel experiences around the world.
          </p>
        </div>

        {/* 4 Column Links & Newsletter Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 pb-14 sm:pb-16">
          {/* Column 1: Newsletter */}
          <div>
            <h3 className="text-xs sm:text-sm font-semibold tracking-widest text-white uppercase mb-3">
              NEWSLETTER
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 font-light mb-4 leading-relaxed">
              Subscribe for exclusive travel deals and inspiration.
            </p>
            <form onSubmit={handleSubscribe} className="relative flex items-center max-w-xs">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                className="w-full bg-[#272727] text-white placeholder:text-gray-400 text-sm px-4 py-2.5 pr-10 outline-none focus:ring-1 focus:ring-white/40 transition-all rounded-none"
              />
              <button
                type="submit"
                aria-label="Subscribe to newsletter"
                className="absolute right-0 top-0 bottom-0 px-3 flex items-center justify-center text-gray-300 hover:text-white transition-colors cursor-pointer"
              >
                <ArrowUpRight className="w-4 h-4 stroke-[2]" />
              </button>
            </form>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-xs sm:text-sm font-semibold tracking-widest text-white uppercase mb-4">
              QUICK LINKS
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-sm text-gray-400 hover:text-white transition-colors font-light"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/destinations"
                  className="text-sm text-gray-400 hover:text-white transition-colors font-light"
                >
                  Destinations
                </Link>
              </li>
              <li>
                <Link
                  href="/bookings"
                  className="text-sm text-gray-400 hover:text-white transition-colors font-light"
                >
                  My Bookings
                </Link>
              </li>
              <li>
                <Link
                  href="/profile"
                  className="text-sm text-gray-400 hover:text-white transition-colors font-light"
                >
                  My Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div>
            <h3 className="text-xs sm:text-sm font-semibold tracking-widest text-white uppercase mb-4">
              SUPPORT
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="#help"
                  className="text-sm text-gray-400 hover:text-white transition-colors font-light"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="#terms"
                  className="text-sm text-gray-400 hover:text-white transition-colors font-light"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="#privacy"
                  className="text-sm text-gray-400 hover:text-white transition-colors font-light"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Us */}
          <div>
            <h3 className="text-xs sm:text-sm font-semibold tracking-widest text-white uppercase mb-4">
              CONTACT US
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="tel:7869011622"
                  className="text-sm text-gray-400 hover:text-white transition-colors font-light block"
                >
                  786 901 1622
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@wanderlust.com"
                  className="text-sm text-gray-400 hover:text-white transition-colors font-light block"
                >
                  info@wanderlust.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Social Icons */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs sm:text-sm text-gray-400 font-light">
            © 2026 Wanderlust. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (formerly Twitter)"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
              </svg>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}


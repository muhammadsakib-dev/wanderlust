// Completed

// Import Essential Modules and Components
import { Josefin_Sans } from "next/font/google";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { LoaderIcon } from "lucide-react"
import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";

// Font Configuration
const josefinSans = Josefin_Sans({
  subsets: ["latin"],
});

// Metadata Definition
export const metadata: Metadata = {
  title: "Wanderlast - Discover Your Next Adventure",
  description: "Explore breathtaking destinations and create unforgettable memories with our curated travel experiences.",
};

// Root Layout Component
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${josefinSans.className} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white">
        <Suspense fallback={<div className="flex-1 flex items-center justify-center"><LoaderIcon className="h-7 w-7 animate-spin" /></div>}>
          <Navbar />
        </Suspense>
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

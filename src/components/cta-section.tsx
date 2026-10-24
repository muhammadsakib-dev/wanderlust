import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CtaSection() {
  return (
    <section className="relative w-full h-100 overflow-hidden py-24 sm:py-28 md:py-36 flex items-center justify-center">
      {/* Background Image Container */}
      <div className="absolute inset-0 z-1">
        <Image
          src="/images/CTA.png"
          alt="Ready To Start Your Journey - Tropical island flight"
          fill
          sizes="100vw"
          quality={90}
          className="object-cover object-center"
        />
        {/* Soft Vignette and Contrast Overlay */}
        <div className="absolute inset-0 bg-black/40 sm:bg-black/35" />
        <div className="absolute inset-0 bg-linear-to-r from-black/50 via-transparent to-black/50" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center">
        <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-[60px] font-normal text-white tracking-tight leading-tight drop-shadow-sm">
          Ready To Start Your Journey?
        </h2>

        <p className="mt-3.5 sm:mt-4 text-sm sm:text-base md:text-lg text-white/90 font-light max-w-2xl leading-relaxed">
          Join thousands of travelers who have discovered the world with us
        </p>

        {/* CTA Button */}
        <div className="mt-7 sm:mt-8">
          <Link
            href="/destinations"
            className="bg-white hover:bg-gray-100 text-gray-900 font-medium text-xs sm:text-sm tracking-widest px-8 sm:px-10 py-3.5 sm:py-4 inline-flex items-center justify-center gap-3 transition-all duration-200 shadow-lg active:scale-95"
          >
            <span>BOOK YOUR TRIP TODAY</span>
            <ArrowRight className="w-4 h-4 text-gray-900 stroke-[2]" />
          </Link>
        </div>
      </div>
    </section>
  );
}


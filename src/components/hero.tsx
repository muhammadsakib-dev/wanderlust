"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

export function Hero() {
  const router = useRouter();
  const [location, setLocation] = React.useState("Address, City Or Zip");
  const [duration, setDuration] = React.useState("Anytime/3 Days");
  const [budget, setBudget] = React.useState("$0-$3000");
  const [people, setPeople] = React.useState("5-10");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/destinations");
  };

  return (
    <section className="relative w-full min-h-[calc(100vh-4.5rem)] flex flex-col justify-between overflow-hidden">
      {/* Background Hero Banner */}
      <div className="absolute inset-0 z-1">
        <Image
          src="/images/Banner.png"
          alt="Discover Your Next Adventure - Coastal travel destination"
          fill
          priority
          quality={90}
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Soft Contrast Overlay */}
        <div className="absolute inset-0 bg-black/35 md:bg-black/30" />
      </div>

      {/* Spacer for top alignment balance */}
      <div className="pt-10 sm:pt-16 md:pt-20" />

      {/* Main Hero Center Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center flex flex-col items-center my-auto py-8">
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[76px] font-normal text-white tracking-tight leading-[1.08] max-w-4xl drop-shadow-sm">
          Discover Your
          <br />
          Next Adventure
        </h1>

        <p className="mt-5 sm:mt-6 text-base sm:text-lg md:text-xl text-white/95 max-w-2xl font-light leading-relaxed drop-shadow-xs">
          Explore breathtaking destinations and create unforgettable memories with
          <br className="hidden sm:inline" /> our curated travel experiences.
        </p>

        {/* Call to Actions */}
        <div className="mt-8 sm:mt-9 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 w-full max-w-md sm:max-w-none">
          <Link
            href="/destinations"
            className="w-full sm:w-auto bg-[#14a1bf] hover:bg-[#108fa9] text-white font-medium text-xs sm:text-sm tracking-widest px-8 py-3.5 flex items-center justify-center gap-2.5 transition-all shadow-md active:scale-[0.98]"
          >
            <span>EXPLORE NOW</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/destinations"
            className="w-full sm:w-auto bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/25 text-white font-medium text-xs sm:text-sm tracking-widest px-8 py-3.5 transition-all shadow-md active:scale-[0.98] text-center"
          >
            VIEW DESTINATION
          </Link>
        </div>
      </div>

      {/* Docked Bottom Search Filter Bar */}
      <div className="relative z-10 w-full mt-auto">
        <form
          onSubmit={handleSearch}
          className="w-full bg-black/45 backdrop-blur-md border-t border-white/15"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-white/20">
            {/* Filter 1: Location */}
            <div className="px-6 py-4.5 sm:py-5 flex flex-col justify-center hover:bg-white/5 transition-colors cursor-pointer group">
              <label
                htmlFor="location-input"
                className="text-sm sm:text-base font-semibold text-white tracking-wide cursor-pointer"
              >
                Location
              </label>
              <input
                id="location-input"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Address, City Or Zip"
                className="mt-0.5 text-xs sm:text-sm text-white/80 placeholder:text-white/60 bg-transparent border-none outline-none focus:text-white p-0"
              />
            </div>

            {/* Filter 2: Date/Duration */}
            <div className="px-6 py-4.5 sm:py-5 flex flex-col justify-center hover:bg-white/5 transition-colors cursor-pointer group">
              <label
                htmlFor="duration-input"
                className="text-sm sm:text-base font-semibold text-white tracking-wide cursor-pointer"
              >
                Date/Duration
              </label>
              <input
                id="duration-input"
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Anytime/3 Days"
                className="mt-0.5 text-xs sm:text-sm text-white/80 placeholder:text-white/60 bg-transparent border-none outline-none focus:text-white p-0"
              />
            </div>

            {/* Filter 3: Budget */}
            <div className="px-6 py-4.5 sm:py-5 flex flex-col justify-center hover:bg-white/5 transition-colors cursor-pointer group">
              <label
                htmlFor="budget-input"
                className="text-sm sm:text-base font-semibold text-white tracking-wide cursor-pointer"
              >
                Budget
              </label>
              <input
                id="budget-input"
                type="text"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="$0-$3000"
                className="mt-0.5 text-xs sm:text-sm text-white/80 placeholder:text-white/60 bg-transparent border-none outline-none focus:text-white p-0"
              />
            </div>

            {/* Filter 4: People */}
            <div className="px-6 py-4.5 sm:py-5 flex flex-col justify-center hover:bg-white/5 transition-colors cursor-pointer group">
              <label
                htmlFor="people-input"
                className="text-sm sm:text-base font-semibold text-white tracking-wide cursor-pointer"
              >
                People
              </label>
              <input
                id="people-input"
                type="text"
                value={people}
                onChange={(e) => setPeople(e.target.value)}
                placeholder="5-10"
                className="mt-0.5 text-xs sm:text-sm text-white/80 placeholder:text-white/60 bg-transparent border-none outline-none focus:text-white p-0"
              />
            </div>

            {/* Search Submit Button */}
            <div className="p-0 flex items-stretch">
              <button
                type="submit"
                className="w-full h-full min-h-[64px] bg-[#14a1bf] hover:bg-[#108fa9] text-white text-base sm:text-lg font-medium tracking-wide flex items-center justify-center transition-all cursor-pointer active:brightness-95"
              >
                Search
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}


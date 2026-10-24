"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Calendar, ArrowUpRight, ChevronDown, PlusCircle } from "lucide-react";
import { DestinationsSkeleton } from "@/components/destinations-skeleton";
import type { Destination } from "@/types/destination";

export type DestinationItem = Destination;

export function AllDestinations() {
  const [destinations, setDestinations] = React.useState<Destination[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = React.useState<string>("ALL");
  const [selectedPriceRange, setSelectedPriceRange] = React.useState<string>("ALL");
  const [selectedSort, setSelectedSort] = React.useState<string>("DEFAULT");

  // Fetch destinations from backend API
  React.useEffect(() => {
    let isMounted = true;
    const baseUrl =
      process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:8000";

    const fetchDestinations = async () => {
      try {
        // 1. Next.js proxy
        let res = await fetch("/api/proxy/destinations", {
          headers: { "Content-Type": "application/json" },
        }).catch(() => null);

        // 2. Direct fallback
        if (!res || !res.ok) {
          res = await fetch(`${baseUrl}/destinations`, {
            headers: { "Content-Type": "application/json" },
          }).catch(() => null);
        }

        if (res && res.ok) {
          const data = await res.json();
          const items: Destination[] = Array.isArray(data)
            ? data
            : Array.isArray(data?.data)
            ? data.data
            : Array.isArray(data?.destinations)
            ? data.destinations
            : [];

          if (isMounted) {
            setDestinations(items);
          }
        }
      } catch (err) {
        console.warn("Could not fetch /destinations from backend:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchDestinations();

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter and sort items (React Compiler manages memoization)
  let list = [...destinations];

  // Filter by Category
  if (selectedCategory !== "ALL") {
    list = list.filter((item) => {
      const cat = item.category?.toLowerCase() || "";
      return cat === selectedCategory.toLowerCase();
    });
  }

  // Filter by Price Range
  if (selectedPriceRange === "UNDER_1500") {
    list = list.filter((item) => Number(item.price || 0) < 1500);
  } else if (selectedPriceRange === "1500_3000") {
    list = list.filter((item) => {
      const price = Number(item.price || 0);
      return price >= 1500 && price <= 3000;
    });
  } else if (selectedPriceRange === "ABOVE_3000") {
    list = list.filter((item) => Number(item.price || 0) > 3000);
  }

  // Sort items
  if (selectedSort === "PRICE_ASC") {
    list.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
  } else if (selectedSort === "PRICE_DESC") {
    list.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
  } else if (selectedSort === "RATING_DESC") {
    list.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
  }

  const filteredDestinations = list;

  // If data is loading, show the clean skeleton with Suspense layout
  if (isLoading) {
    return <DestinationsSkeleton />;
  }

  return (
    <section className="w-full bg-white py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-5xl md:text-[52px] font-normal text-gray-900 tracking-tight leading-tight">
            Explore All Destinations
          </h1>
          <p className="mt-2.5 text-sm sm:text-base text-gray-500 font-normal leading-relaxed">
            Find your perfect travel experience from our curated collection
          </p>
        </div>

        {/* 3-Part Filter and Sort Bar */}
        <div className="w-full border border-gray-300 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-300">
          {/* Category Dropdown */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full h-12 px-4 appearance-none bg-transparent text-xs sm:text-sm font-medium tracking-wider text-gray-700 uppercase outline-none cursor-pointer pr-10"
            >
              <option value="ALL">CATEGORY</option>
              <option value="Beach">Beach</option>
              <option value="Mountain">Mountain</option>
              <option value="City">City</option>
              <option value="Adventure">Adventure</option>
              <option value="Cultural">Cultural</option>
              <option value="Safari">Safari</option>
              <option value="Island">Island</option>
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none stroke-[2]" />
          </div>

          {/* Price Range Dropdown */}
          <div className="relative">
            <select
              value={selectedPriceRange}
              onChange={(e) => setSelectedPriceRange(e.target.value)}
              className="w-full h-12 px-4 appearance-none bg-transparent text-xs sm:text-sm font-medium tracking-wider text-gray-700 uppercase outline-none cursor-pointer pr-10"
            >
              <option value="ALL">PRICE RANGE</option>
              <option value="UNDER_1500">Under $1,500</option>
              <option value="1500_3000">$1,500 - $3,000</option>
              <option value="ABOVE_3000">Above $3,000</option>
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none stroke-[2]" />
          </div>

          {/* Sort By Dropdown */}
          <div className="relative">
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="w-full h-12 px-4 appearance-none bg-transparent text-xs sm:text-sm font-medium tracking-wider text-gray-700 uppercase outline-none cursor-pointer pr-10"
            >
              <option value="DEFAULT">SORT BY</option>
              <option value="PRICE_ASC">Price: Low to High</option>
              <option value="PRICE_DESC">Price: High to Low</option>
              <option value="RATING_DESC">Highest Rated</option>
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none stroke-[2]" />
          </div>
        </div>

        {/* Showing Count Indicator */}
        <p className="mt-4 mb-8 sm:mb-10 text-xs sm:text-sm text-gray-500 font-normal">
          Showing {filteredDestinations.length} destination{filteredDestinations.length === 1 ? "" : "s"}
        </p>

        {/* Empty State */}
        {filteredDestinations.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-gray-200 rounded-lg">
            <h3 className="text-lg font-medium text-gray-800">No destinations found</h3>
            <p className="text-sm text-gray-500 mt-1">
              Start by adding your first travel package to the platform.
            </p>
            <Link
              href="/add-destination"
              className="mt-5 inline-flex items-center gap-2 bg-[#14a1bf] hover:bg-[#108fa9] text-white px-5 py-2.5 rounded-md text-sm font-medium transition-colors cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Destination</span>
            </Link>
          </div>
        ) : (
          /* 3-Column Destinations Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {filteredDestinations.map((item, index) => {
              const id = item._id || item.id || String(index);
              const name = item.destinationName || item.name || item.title || "Travel Destination";
              const country = item.country || "Global";
              const price = item.price ?? 0;
              const duration = item.duration || "Flexible";
              const rating = item.rating ?? 4.9;
              const imageUrl =
                item.imageUrl ||
                item.image ||
                "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80";

              return (
                <Link
                  key={id}
                  href={`/destinations/${id}`}
                  className="flex flex-col h-full bg-white group cursor-pointer block"
                >
                  {/* Image Container with Rating Badge */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
                    <Image
                      src={imageUrl}
                      alt={name}
                      fill
                      unoptimized
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Rating Badge */}
                    <div className="absolute top-3.5 right-3.5 bg-white/95 backdrop-blur-xs px-2.5 py-1 text-xs font-semibold text-gray-900 rounded-xs shadow-xs flex items-center gap-1">
                      <span>{rating}</span>
                      <span className="text-black text-[11px]">★</span>
                    </div>
                  </div>

                  {/* Card Details */}
                  <div className="pt-4 pb-2 flex flex-col justify-between flex-1">
                    {/* Location Country */}
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 font-normal">
                      <MapPin className="w-3.5 h-3.5 stroke-[1.75]" />
                      <span>{country}</span>
                    </div>

                    {/* Title & Price */}
                    <div className="mt-1 flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl sm:text-2xl font-normal text-gray-900 tracking-tight leading-snug group-hover:text-[#14a1bf] transition-colors">
                          {name}
                        </h3>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 font-normal mt-1">
                          <Calendar className="w-3.5 h-3.5 stroke-[1.75]" />
                          <span>{duration}</span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xl sm:text-2xl font-normal text-gray-900 tracking-tight">
                          ${price}
                        </span>
                        <span className="text-xs text-gray-500 font-normal ml-0.5">
                          /Person
                        </span>
                      </div>
                    </div>

                    {/* Book Now Indicator */}
                    <div className="mt-4 pt-1">
                      <span className="text-[#14a1bf] group-hover:text-[#108fa9] font-medium text-xs tracking-wider uppercase inline-flex items-center gap-1.5 transition-colors">
                        <span>BOOK NOW</span>
                        <ArrowUpRight className="w-4 h-4 stroke-[2] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

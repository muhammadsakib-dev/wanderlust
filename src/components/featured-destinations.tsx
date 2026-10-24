"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Calendar, ArrowUpRight, ArrowLeft, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import type { Destination } from "@/types/destination";

export type { Destination };

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80";

export function FeaturedDestinations() {
  const [destinations, setDestinations] = React.useState<Destination[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState<number>(1);
  const [count, setCount] = React.useState<number>(0);

  // Fetch destinations from API
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

  // Update carousel counter and total slides
  React.useEffect(() => {
    if (!api) return;

    const updateState = () => {
      setCurrent(api.selectedScrollSnap() + 1);
      setCount(api.scrollSnapList().length || destinations.length);
    };

    api.on("select", updateState);
    api.on("reInit", updateState);

    const timer = setTimeout(updateState, 0);

    return () => {
      clearTimeout(timer);
      api.off("select", updateState);
      api.off("reInit", updateState);
    };
  }, [api, destinations.length]);

  const progressPercentage = count > 0 ? (current / count) * 100 : 20;

  return (
    <section className="w-full bg-white py-18 sm:py-22 lg:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header: Title & Subtitle on Left, All Destinations button on Right */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-2">
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-[44px] font-normal text-gray-900 tracking-tight leading-tight">
              Featured Destinations
            </h2>
            <p className="mt-2.5 text-sm sm:text-base text-gray-500 font-normal leading-relaxed">
              Handpicked travel experiences for the adventure seekers
            </p>
          </div>

          <div className="self-start sm:self-auto">
            <Link
              href="/destinations"
              className="border border-[#14a1bf] text-[#14a1bf] hover:bg-[#14a1bf] hover:text-white px-5 py-2.5 text-xs font-semibold tracking-widest uppercase transition-colors inline-flex items-center gap-2 rounded-none cursor-pointer"
            >
              <span>ALL DESTINATIONS</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2]" />
            </Link>
          </div>
        </div>

        {/* Loading Skeleton */}
        {isLoading ? (
          <div className="mt-10 sm:mt-12 space-y-10 sm:space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="flex flex-col h-full bg-white space-y-3">
                  <Skeleton className="relative aspect-[16/10] w-full rounded-xs bg-gray-100" />
                  <div className="pt-2 space-y-2.5">
                    <Skeleton className="h-3.5 w-20 bg-gray-200" />
                    <div className="flex items-start justify-between gap-4 pt-1">
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-6 w-3/4 bg-gray-200" />
                        <Skeleton className="h-3.5 w-28 bg-gray-100" />
                      </div>
                      <Skeleton className="h-6 w-20 bg-gray-200" />
                    </div>
                    <div className="pt-2">
                      <Skeleton className="h-4 w-24 bg-gray-100" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between gap-4">
              <Skeleton className="h-5 w-10 bg-gray-200" />
              <div className="flex-1 h-0.5 bg-gray-100 relative mx-4 sm:mx-6 rounded-full overflow-hidden">
                <Skeleton className="h-full w-1/4 bg-gray-300" />
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="w-11 h-11 rounded-full bg-gray-100" />
                <Skeleton className="w-11 h-11 rounded-full bg-gray-100" />
              </div>
            </div>
          </div>
        ) : destinations.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-gray-500 text-base">No destinations found.</p>
          </div>
        ) : (
          <Carousel
            setApi={setApi}
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            {/* Carousel Track with Destination Cards */}
            <CarouselContent className="-ml-6 mt-10 sm:mt-12">
              {destinations.map((item, index) => {
                const id = item._id || item.id || String(index);
                const name = item.destinationName || item.name || item.title || "Bali Paradise";
                const country = item.country || "Indonesia";
                const price = item.price ?? 2700;
                const duration = item.duration || "7 Days/6 Nights";
                const rating = item.rating ?? 4.5;
                const imageUrl = item.imageUrl || item.image || FALLBACK_IMAGE;

                return (
                  <CarouselItem
                    key={id}
                    className="pl-6 basis-full sm:basis-[85%] md:basis-[48%] lg:basis-[48%]"
                  >
                    <Link
                      href={`/destinations/${id}`}
                      className="flex flex-col h-full bg-white group select-none cursor-pointer block"
                    >
                      {/* Card Image Container with Rating Badge */}
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
                        <Image
                          src={imageUrl}
                          alt={name}
                          fill
                          unoptimized
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 45vw"
                          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        />
                        {/* Rating Badge */}
                        <div className="absolute top-3.5 right-3.5 bg-white/95 backdrop-blur-xs px-2.5 py-1 text-xs font-semibold text-gray-900 rounded-xs shadow-xs flex items-center gap-1">
                          <span>{rating}</span>
                          <span className="text-black text-[11px]">★</span>
                        </div>
                      </div>

                      {/* Card Information */}
                      <div className="pt-4 pb-2 flex flex-col justify-between flex-1">
                        {/* Country Location */}
                        <div className="flex items-center gap-1.5 text-xs text-gray-500 font-normal">
                          <MapPin className="w-3.5 h-3.5 stroke-[1.75]" />
                          <span>{country}</span>
                        </div>

                        {/* Destination Name, Duration & Price Row */}
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

                          {/* Price */}
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
                  </CarouselItem>
                );
              })}
            </CarouselContent>

            {/* Bottom Progress Bar & Navigation Controls */}
            <div className="mt-10 sm:mt-12 flex items-center justify-between gap-4">
              {/* Counter */}
              <div className="text-base sm:text-lg font-normal text-gray-800 tracking-wider shrink-0 min-w-10">
                {current}/{count || destinations.length || 1}
              </div>

              {/* Horizontal Progress Line */}
              <div className="flex-1 h-0.5 bg-gray-200 relative mx-4 sm:mx-6 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gray-800 transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>

              {/* Arrow Navigation Buttons */}
              <div className="flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => api?.scrollPrev()}
                  aria-label="Previous destination"
                  className="w-11 h-11 rounded-full border border-gray-300 hover:border-gray-800 text-gray-400 hover:text-gray-900 flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-95"
                >
                  <ArrowLeft className="w-4 h-4 stroke-[1.75]" />
                </button>
                <button
                  type="button"
                  onClick={() => api?.scrollNext()}
                  aria-label="Next destination"
                  className="w-11 h-11 rounded-full border border-gray-300 hover:border-gray-800 text-gray-400 hover:text-gray-900 flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-95"
                >
                  <ArrowRight className="w-4 h-4 stroke-[1.75]" />
                </button>
              </div>
            </div>
          </Carousel>
        )}
      </div>
    </section>
  );
}

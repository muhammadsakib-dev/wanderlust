import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function DestinationDetailsSkeleton() {
  return (
    <section className="w-full bg-white py-8 sm:py-10 lg:py-12 px-4 sm:px-6 lg:px-12">
      <div className="max-w-6xl mx-auto">
        {/* Navigation Bar Skeleton */}
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-5 w-40 bg-gray-200" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-20 bg-gray-100" />
            <Skeleton className="h-9 w-20 bg-gray-100" />
          </div>
        </div>

        {/* Hero Banner Skeleton */}
        <Skeleton className="w-full aspect-[21/9] sm:aspect-[2.2/1] rounded-xs bg-gray-200 mb-8" />

        {/* Content Skeleton: 2 Columns */}
        <div className="pt-2 border-t border-gray-100 grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12 items-start">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-3">
              <Skeleton className="h-4 w-28 bg-gray-200" />
              <Skeleton className="h-10 sm:h-12 w-3/4 bg-gray-200" />
              <div className="flex gap-4 pt-1">
                <Skeleton className="h-4 w-32 bg-gray-100" />
                <Skeleton className="h-4 w-32 bg-gray-100" />
              </div>
            </div>

            <div className="space-y-3">
              <Skeleton className="h-6 w-32 bg-gray-200" />
              <Skeleton className="h-4 w-full bg-gray-100" />
              <Skeleton className="h-4 w-5/6 bg-gray-100" />
            </div>

            <div className="space-y-3">
              <Skeleton className="h-6 w-32 bg-gray-200" />
              <Skeleton className="h-4 w-full bg-gray-100" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-4 w-48 bg-gray-100" />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-md p-6 sm:p-7 space-y-4">
              <Skeleton className="h-3.5 w-24 bg-gray-100" />
              <Skeleton className="h-10 w-32 bg-gray-200" />
              <Skeleton className="h-3 w-20 bg-gray-100" />
              <Skeleton className="h-11 w-full bg-gray-100" />
              <Skeleton className="h-12 w-full bg-gray-200" />
              <div className="space-y-2 pt-4 border-t border-gray-100">
                <Skeleton className="h-3 w-44 bg-gray-100" />
                <Skeleton className="h-3 w-40 bg-gray-100" />
                <Skeleton className="h-3 w-36 bg-gray-100" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


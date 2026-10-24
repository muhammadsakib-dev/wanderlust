import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function DestinationsSkeleton() {
  return (
    <section className="w-full bg-white py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header Skeleton */}
        <div className="mb-8 sm:mb-10 space-y-3">
          <Skeleton className="h-10 sm:h-12 w-80 max-w-full bg-gray-200" />
          <Skeleton className="h-4 w-96 max-w-full bg-gray-100" />
        </div>

        {/* Filter Bar Skeleton */}
        <div className="w-full border border-gray-200 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-200 h-12 bg-gray-50/50">
          <div className="flex items-center px-4">
            <Skeleton className="h-4 w-24 bg-gray-200" />
          </div>
          <div className="flex items-center px-4">
            <Skeleton className="h-4 w-28 bg-gray-200" />
          </div>
          <div className="flex items-center px-4">
            <Skeleton className="h-4 w-20 bg-gray-200" />
          </div>
        </div>

        {/* Counter Skeleton */}
        <div className="mt-4 mb-8 sm:mb-10">
          <Skeleton className="h-4 w-36 bg-gray-100" />
        </div>

        {/* 3-Column Destination Cards Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col h-full bg-white space-y-3">
              {/* Image Skeleton */}
              <Skeleton className="relative aspect-[16/10] w-full rounded-xs bg-gray-100" />

              {/* Details Skeleton */}
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
      </div>
    </section>
  );
}


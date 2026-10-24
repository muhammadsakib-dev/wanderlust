import { Suspense } from "react";
import { AllDestinations } from "@/components/all-destinations";
import { DestinationsSkeleton } from "@/components/destinations-skeleton";

export const metadata = {
  title: "Destinations - Wanderlust",
  description: "Explore all handpicked travel destinations and experiences.",
};

export default function DestinationsPage() {
  return (
    <Suspense fallback={<DestinationsSkeleton />}>
      <AllDestinations />
    </Suspense>
  );
}

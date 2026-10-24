import type { Metadata } from "next";
import { MyBookings } from "@/components/my-bookings";

export const metadata: Metadata = {
  title: "My Bookings | Wanderlust",
  description: "Manage and view your upcoming travel plans and reservations with Wanderlust.",
};

export default function BookingsPage() {
  return (
    <main className="min-h-[calc(100vh-140px)] bg-slate-50/50">
      <MyBookings />
    </main>
  );
}


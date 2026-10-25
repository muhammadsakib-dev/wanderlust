"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  Trash2,
  Eye,
  CheckCircle2,
  Clock,
  XCircle,
  RefreshCw,
  PlaneTakeoff,
  LogIn,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import type { Booking } from "@/types/booking";

export type UserBooking = Booking;

export function MyBookings() {
  const { data: session, isPending: isSessionLoading } = useSession();
  const [bookings, setBookings] = React.useState<Booking[]>([]);
  const [isFetching, setIsFetching] = React.useState(false);
  const userEmail = session?.user?.email;

  React.useEffect(() => {
    let isMounted = true;
    if (!userEmail) return;

    const fetchBookings = async () => {
      setIsFetching(true);
      try {
        const baseUrl =
          process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:8000";
        const emailQuery = encodeURIComponent(userEmail);

        // Fetch user's bookings through proxy
        let res = await fetch(`/api/proxy/bookings?email=${emailQuery}`, {
          headers: { "Content-Type": "application/json" },
        }).catch(() => null);

        if (!res || !res.ok) {
          res = await fetch(`${baseUrl}/bookings?email=${emailQuery}`, {
            headers: { "Content-Type": "application/json" },
          }).catch(() => null);
        }

        if (isMounted && res && res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setBookings(data);
          }
        }
      } catch (err) {
        console.warn("Could not fetch user bookings:", err);
      } finally {
        if (isMounted) {
          setIsFetching(false);
        }
      }
    };

    fetchBookings();

    return () => {
      isMounted = false;
    };
  }, [userEmail]);

  const isLoading = isSessionLoading || (Boolean(userEmail) && isFetching);

  const handleCancelBooking = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to cancel your booking for "${name}"?`)) {
      return;
    }

    // Immediately update local state to Cancelled
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "Cancelled" } : b))
    );

    try {
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:8000";
      const res = await fetch(`/api/proxy/bookings/${id}`, {
        method: "DELETE",
      }).catch(() => null);

      if (!res || !res.ok) {
        await fetch(`${baseUrl}/bookings/${id}`, {
          method: "DELETE",
        }).catch(() => null);
      }
    } catch (err) {
      console.warn("Failed to delete booking on backend:", err);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Title & Subtitle */}
      <div className="mb-8 sm:mb-10">
        <h1 className="text-3xl sm:text-4xl md:text-[42px] font-normal text-gray-900 tracking-tight leading-tight">
          My Bookings
        </h1>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-2">
          <p className="text-sm sm:text-base text-gray-500 font-normal">
            Manage and view your upcoming travel plans
          </p>
          {session?.user && (
            <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 border border-gray-200 w-fit">
              Account: <strong className="text-gray-800">{session.user.email}</strong>
            </span>
          )}
        </div>
      </div>

      {isSessionLoading || isLoading ? (
        <div className="py-20 text-center text-gray-500">
          <RefreshCw className="w-5 h-5 animate-spin mx-auto text-[#14a1bf] mb-2" />
          <span>Loading your bookings...</span>
        </div>
      ) : !session?.user ? (
        /* Not Logged In State */
        <div className="bg-white border border-gray-200 p-12 text-center space-y-4 max-w-md mx-auto shadow-xs">
          <PlaneTakeoff className="w-12 h-12 text-[#14a1bf] mx-auto stroke-[1.5]" />
          <h2 className="text-2xl font-normal text-gray-900 tracking-tight">
            Sign In to View Your Bookings
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            Please sign in with your Wanderlust account to view and manage your travel bookings.
          </p>
          <div className="pt-2">
            <Link
              href="/login?callbackUrl=/bookings"
              className="inline-flex items-center gap-2 bg-[#14a1bf] hover:bg-[#108fa9] text-white px-6 py-2.5 text-xs sm:text-sm font-medium tracking-wide uppercase transition-colors"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In to Account</span>
            </Link>
          </div>
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-white border border-gray-200 p-12 text-center space-y-4 shadow-xs">
          <PlaneTakeoff className="w-12 h-12 text-gray-400 mx-auto stroke-[1.5]" />
          <h3 className="text-xl font-normal text-gray-900">No active bookings yet</h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            You haven&apos;t booked any travel packages yet under{" "}
            <strong>{session.user.email}</strong>. Explore our curated destinations and start your next adventure!
          </p>
          <div className="pt-2">
            <Link
              href="/destinations"
              className="inline-flex items-center gap-2 bg-[#14a1bf] hover:bg-[#108fa9] text-white px-6 py-2.5 text-xs sm:text-sm font-medium tracking-wide uppercase transition-colors"
            >
              <span>Explore Destinations</span>
            </Link>
          </div>
        </div>
      ) : (
        /* Vertical List of Booking Cards */
        <div className="space-y-6">
          {bookings.map((booking) => {
            const isCompleted =
              booking.status === "Completed" || booking.status === "Complete";
            const isConfirmed = booking.status === "Confirmed";
            const isPending = booking.status === "Pending";
            const isCancelled = booking.status === "Cancelled";

            return (
              <div
                key={booking.id}
                className="bg-white border border-gray-200 shadow-xs p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all hover:shadow-sm"
              >
                {/* Left: Destination Thumbnail */}
                <div className="relative w-full md:w-70 lg:w-[320px] aspect-16/10 overflow-hidden bg-gray-100 shrink-0">
                  <Image
                    src={
                      booking.imageUrl ||
                      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80"
                    }
                    alt={booking.destinationName}
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 100vw, 320px"
                    className="object-cover"
                  />
                </div>

                {/* Middle: Details */}
                <div className="flex-1 min-w-0">
                  {/* Status Pill Badge */}
                  <div>
                    {isCompleted && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
                        <CheckCircle2 className="w-3.5 h-3.5 stroke-2" />
                        <span>Completed</span>
                      </span>
                    )}

                    {isConfirmed && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#eaf8ee] text-[#16a34a] border border-[#bbf7d0]">
                        <CheckCircle2 className="w-3.5 h-3.5 stroke-2" />
                        <span>Confirmed</span>
                      </span>
                    )}

                    {isPending && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#fff8eb] text-[#d97706] border border-[#fef3c7]">
                        <Clock className="w-3.5 h-3.5 stroke-2" />
                        <span>Pending</span>
                      </span>
                    )}

                    {isCancelled && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-600 border border-red-200">
                        <XCircle className="w-3.5 h-3.5 stroke-2" />
                        <span>Cancelled</span>
                      </span>
                    )}
                  </div>

                  {/* Destination Title */}
                  <h2 className="text-2xl sm:text-[28px] font-normal text-gray-900 tracking-tight mt-2.5">
                    {booking.destinationName}
                  </h2>

                  {/* Departure Date */}
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 mt-2">
                    <Calendar className="w-3.5 h-3.5 text-gray-400 stroke-[1.75]" />
                    <span>Departure: {booking.departureDate}</span>
                  </div>

                  {/* Booking ID */}
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 stroke-[1.75]" />
                    <span>Booking ID: {booking.id}</span>
                  </div>

                  {/* Price */}
                  <div className="text-2xl sm:text-3xl font-semibold text-[#14a1bf] tracking-tight mt-3">
                    ${booking.price}
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-3 shrink-0 self-end md:self-center mt-2 md:mt-0">
                  {/* Cancel Button */}
                  {!isCancelled && (
                    <button
                      type="button"
                      onClick={() =>
                        handleCancelBooking(booking.id, booking.destinationName)
                      }
                      className="border border-red-300 hover:border-red-500 hover:bg-red-50 text-red-500 px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-medium transition-colors flex items-center gap-2 rounded-none cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4 stroke-[1.75]" />
                      <span>Cancel</span>
                    </button>
                  )}

                  {/* View Details Button */}
                  <Link
                    href={`/destinations/${booking.destinationId || "1"}`}
                    className="bg-[#14a1bf] hover:bg-[#108fa9] text-white px-5 py-2 sm:px-6 sm:py-2.5 text-xs sm:text-sm font-medium transition-colors flex items-center gap-2 rounded-none cursor-pointer"
                  >
                    <Eye className="w-4 h-4 stroke-2" />
                    <span>View</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

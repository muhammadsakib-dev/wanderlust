"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Mail,
  Calendar,
  Plane,
  Globe,
  TrendingUp,
  DollarSign,
  User,
  LogIn,
  UserPlus,
  RefreshCw,
  Compass,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import type { Booking } from "@/types/booking";

const DEFAULT_AVATAR = "https://ik.imagekit.io/muhammadsakib/image.png";

export function ProfileView() {
  const { data: session, isPending: isSessionLoading } = useSession();

  // 1. Loading State
  if (isSessionLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center text-gray-500">
        <RefreshCw className="w-5 h-5 animate-spin mx-auto text-[#14a1bf] mb-2" />
        <span className="text-sm">Loading your profile...</span>
      </div>
    );
  }

  // 2. Unauthenticated State (Prompt to Sign In or Sign Up)
  if (!session?.user) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="bg-white border border-gray-200 p-8 sm:p-14 text-center space-y-4 max-w-lg mx-auto shadow-xs">
          <div className="w-14 h-14 rounded-full bg-[#14a1bf]/10 text-[#14a1bf] flex items-center justify-center mx-auto">
            <User className="w-7 h-7 stroke-[1.75]" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-normal text-gray-900 tracking-tight">
            Sign In to View Your Profile
          </h2>
          <p className="text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
            Please sign in with your account or create a new one to access your
            personal profile, bookings, and travel statistics.
          </p>
          <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/login?callbackUrl=/profile"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#14a1bf] hover:bg-[#108fa9] text-white px-6 py-2.5 text-xs sm:text-sm font-medium tracking-wide uppercase transition-colors"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </Link>
            <Link
              href="/signup?callbackUrl=/profile"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-2.5 text-xs sm:text-sm font-medium tracking-wide uppercase transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              <span>Create Account</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. Authenticated Profile View
  return <AuthenticatedProfile user={session.user} key={session.user.email} />;
}

interface AuthenticatedUser {
  name?: string | null;
  email: string;
  image?: string | null;
  createdAt?: string | Date | null;
}

function AuthenticatedProfile({ user }: { user: AuthenticatedUser }) {
  const userEmail = user.email;
  const userName = user.name || "Traveler";
  const userAvatar = user.image || DEFAULT_AVATAR;

  // Format member-since date
  let memberSince = "2026";
  if (user.createdAt) {
    try {
      const date = new Date(user.createdAt);
      memberSince = date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });
    } catch {
      memberSince = "2026";
    }
  }

  // Real user bookings from MongoDB
  const [bookings, setBookings] = React.useState<Booking[]>([]);
  const [isBookingsLoading, setIsBookingsLoading] = React.useState(false);

  React.useEffect(() => {
    let isMounted = true;
    if (!userEmail) return;

    const fetchUserBookings = async () => {
      setIsBookingsLoading(true);
      try {
        const res = await fetch(
          `/api/proxy/bookings?email=${encodeURIComponent(userEmail)}`,
          {
            headers: { "Content-Type": "application/json" },
          },
        );

        if (isMounted && res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setBookings(data);
          }
        }
      } catch (err) {
        console.warn("Could not fetch user booking statistics:", err);
      } finally {
        if (isMounted) {
          setIsBookingsLoading(false);
        }
      }
    };

    fetchUserBookings();

    return () => {
      isMounted = false;
    };
  }, [userEmail]);

  // Compute travel statistics:
  // 1. Total Bookings: All bookings made by this user
  const totalBookings = bookings.length;

  // 2. Completed Bookings: Only bookings with status "Completed" or "Complete"
  const completedBookings = bookings.filter(
    (b) => b.status === "Completed" || b.status === "Complete",
  );

  // 3. Upcoming Trips: Active bookings awaiting travel (Confirmed or Pending)
  const upcomingTrips = bookings.filter(
    (b) => b.status === "Confirmed" || b.status === "Pending",
  ).length;

  // 4. Total Spent: Sum ONLY from completed bookings
  const totalSpent = completedBookings.reduce(
    (sum, b) => sum + (Number(b.price || b.totalPrice) || 0),
    0,
  );

  // 5. Destinations Visited: Unique destinations where trip was completed
  const destinationsVisited = new Set(
    completedBookings.map((b) => b.destinationName).filter(Boolean),
  ).size;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Page Title & Subtitle */}
      <div className="mb-8 sm:mb-10">
        <h1 className="text-3xl sm:text-4xl md:text-[42px] font-normal text-gray-900 tracking-tight leading-tight">
          My Profile
        </h1>
        <p className="mt-2 text-sm sm:text-base text-gray-500 font-normal">
          Manage your account settings and travel preferences
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: User Profile Card */}
        <div className="lg:col-span-4 w-full">
          <div className="bg-white border border-gray-100 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.05)] p-6 sm:p-7">
            {/* User Avatar */}
            <div className="relative w-32 h-32 mx-auto">
              <div className="w-full h-full rounded-full overflow-hidden bg-gray-100 relative border-2 border-gray-100">
                <Image
                  src={userAvatar}
                  alt={userName}
                  fill
                  unoptimized
                  sizes="128px"
                  className="object-cover object-center"
                />
              </div>
            </div>

            {/* User Name & Status */}
            <div className="text-center mt-4">
              <h2 className="text-lg sm:text-xl font-normal text-gray-900 tracking-tight">
                {userName}
              </h2>
              <span className="inline-block mt-1 text-[11px] font-medium tracking-wider uppercase bg-[#e6f7fa] text-[#14a1bf] px-2.5 py-0.5 rounded-full border border-[#14a1bf]/20">
                Active Traveler
              </span>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100 my-5" />

            {/* Account Details */}
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 font-normal flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-gray-400" />
                  Email
                </span>
                <span className="font-medium text-gray-800 truncate max-w-[180px]">
                  {userEmail}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-400 font-normal flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  Member since
                </span>
                <span className="font-semibold text-gray-800">
                  {memberSince}
                </span>
              </div>
            </div>

            {/* Action Link to Bookings */}
            <Link
              href="/bookings"
              className="w-full mt-6 bg-[#14a1bf] hover:bg-[#108fa9] text-white py-2.5 sm:py-3 px-4 text-xs sm:text-sm font-medium tracking-wide transition-colors flex items-center justify-center gap-2"
            >
              <Compass className="w-4 h-4 stroke-[1.75]" />
              <span>View My Bookings</span>
            </Link>
          </div>
        </div>

        {/* Right Column: Travel Statistics */}
        <div className="lg:col-span-8 w-full">
          <div className="flex items-center justify-between mb-4 sm:mb-5">
            <h2 className="text-lg sm:text-xl font-medium text-gray-900">
              Travel Statistics
            </h2>
            {isBookingsLoading && (
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <RefreshCw className="w-3 h-3 animate-spin text-[#14a1bf]" />
                Syncing data...
              </span>
            )}
          </div>

          {/* 2x2 Stat Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {/* Stat 1: Total Bookings */}
            <div className="bg-white border border-gray-100 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] p-5 sm:p-6 flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-500 font-normal">
                  Total Bookings
                </p>
                <p className="text-2xl sm:text-3xl font-semibold text-gray-900 mt-2">
                  {totalBookings}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#e6f7fa] text-[#14a1bf] flex items-center justify-center shrink-0">
                <Plane className="w-5 h-5 stroke-[1.75]" />
              </div>
            </div>

            {/* Stat 2: Destinations Visited (Completed Trips) */}
            <div className="bg-white border border-gray-100 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] p-5 sm:p-6 flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-500 font-normal">
                  Destinations Visited
                </p>
                <p className="text-2xl sm:text-3xl font-semibold text-gray-900 mt-2">
                  {destinationsVisited}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#ecfdf5] text-[#16a34a] flex items-center justify-center shrink-0">
                <Globe className="w-5 h-5 stroke-[1.75]" />
              </div>
            </div>

            {/* Stat 3: Upcoming Trips */}
            <div className="bg-white border border-gray-100 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] p-5 sm:p-6 flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-500 font-normal">
                  Upcoming Trips
                </p>
                <p className="text-2xl sm:text-3xl font-semibold text-gray-900 mt-2">
                  {upcomingTrips}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#fff7ed] text-[#ea580c] flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5 stroke-[1.75]" />
              </div>
            </div>

            {/* Stat 4: Total Spent (Completed Trips Only) */}
            <div className="bg-white border border-gray-100 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] p-5 sm:p-6 flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-500 font-normal">
                  Total Spent
                </p>
                <p className="text-2xl sm:text-3xl font-semibold text-gray-900 mt-2">
                  ${totalSpent.toLocaleString()}
                </p>
                <span className="text-[11px] text-gray-400 block mt-0.5">
                  Completed trips only
                </span>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#fdf4ff] text-[#c026d3] flex items-center justify-center shrink-0">
                <DollarSign className="w-5 h-5 stroke-[1.75]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

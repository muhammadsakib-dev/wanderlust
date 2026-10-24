"use client";

import * as React from "react";
import Image from "next/image";
import {
  MapPin,
  Camera,
  SquarePen,
  Plane,
  Globe,
  TrendingUp,
  DollarSign,
  X,
  Check,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";

interface UserProfileData {
  name: string;
  location: string;
  memberSince: string;
  nationality: string;
  avatar: string;
}

const DEFAULT_PROFILE: UserProfileData = {
  name: "Sarah Mitchell",
  location: "San Francisco, CA",
  memberSince: "Mar 2024",
  nationality: "United States",
  avatar:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
};

export function ProfileView() {
  const { data: session } = useSession();

  const [profile, setProfile] = React.useState<UserProfileData>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("wanderlust_user_profile");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // ignore error
        }
      }
    }
    return DEFAULT_PROFILE;
  });

  // Derive active profile merging authenticated session data when default
  const activeProfile: UserProfileData = {
    ...profile,
    name:
      profile.name !== DEFAULT_PROFILE.name
        ? profile.name
        : session?.user?.name || DEFAULT_PROFILE.name,
    avatar:
      profile.avatar !== DEFAULT_PROFILE.avatar
        ? profile.avatar
        : session?.user?.image || DEFAULT_PROFILE.avatar,
  };

  // Real user booking statistics from MongoDB
  const [userBookings, setUserBookings] = React.useState<
    { price?: number | string; status?: string }[] | null
  >(null);

  React.useEffect(() => {
    let isMounted = true;
    if (!session?.user?.email) return;

    const loadStats = async () => {
      try {
        const baseUrl =
          process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:8000";
        const emailQuery = encodeURIComponent(session.user.email);
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
            setUserBookings(data);
          }
        }
      } catch (err) {
        console.warn("Failed to load user booking stats:", err);
      }
    };

    loadStats();
    return () => {
      isMounted = false;
    };
  }, [session?.user?.email]);

  const totalBookings =
    userBookings !== null ? userBookings.length : 12;
  const upcomingTrips =
    userBookings !== null
      ? userBookings.filter((b) => b.status !== "Cancelled").length
      : 2;
  const totalSpent =
    userBookings !== null
      ? userBookings.reduce((sum, b) => sum + (Number(b.price) || 0), 0)
      : 15750;
  const countriesVisited =
    userBookings !== null ? userBookings.length : 18;

  // Modal edit state
  const [isEditing, setIsEditing] = React.useState(false);
  const [formData, setFormData] = React.useState<UserProfileData>(profile);
  const [saveSuccess, setSaveSuccess] = React.useState(false);

  const handleOpenEdit = () => {
    setFormData(activeProfile);
    setIsEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(formData);
    if (typeof window !== "undefined") {
      localStorage.setItem("wanderlust_user_profile", JSON.stringify(formData));
    }
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setIsEditing(false);
    }, 600);
  };

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

      {/* Main Content: Left Column Profile Card, Right Column Travel Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-4 w-full">
          <div className="bg-white border border-gray-100 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.05)] p-6 sm:p-7">
            {/* Avatar with Camera badge */}
            <div className="relative w-32 h-32 mx-auto">
              <div className="w-full h-full rounded-full overflow-hidden bg-gray-100 relative">
                <Image
                  src={activeProfile.avatar}
                  alt={activeProfile.name}
                  fill
                  unoptimized
                  sizes="128px"
                  className="object-cover object-center"
                />
              </div>
              <button
                type="button"
                onClick={handleOpenEdit}
                aria-label="Change profile photo"
                className="absolute bottom-0.5 right-0.5 w-8 h-8 rounded-full bg-[#14a1bf] hover:bg-[#108fa9] text-white flex items-center justify-center border-2 border-white shadow-xs cursor-pointer transition-colors"
              >
                <Camera className="w-4 h-4 stroke-[1.75]" />
              </button>
            </div>

            {/* User Name & Location */}
            <div className="text-center mt-4">
              <h2 className="text-lg sm:text-xl font-normal text-gray-900 tracking-tight">
                {activeProfile.name}
              </h2>
              <div className="flex items-center justify-center gap-1.5 text-xs sm:text-sm text-gray-500 mt-1">
                <MapPin className="w-3.5 h-3.5 text-gray-400 stroke-[1.75]" />
                <span>{activeProfile.location}</span>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100 my-5" />

            {/* Metadata Rows */}
            <div className="space-y-2.5 text-xs sm:text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 font-normal">Member since</span>
                <span className="font-semibold text-gray-800">{activeProfile.memberSince}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 font-normal">Nationality</span>
                <span className="font-semibold text-gray-800">{activeProfile.nationality}</span>
              </div>
            </div>

            {/* Edit Profile Button */}
            <button
              type="button"
              onClick={handleOpenEdit}
              className="w-full mt-6 bg-[#14a1bf] hover:bg-[#108fa9] text-white py-2.5 sm:py-3 px-4 text-xs sm:text-sm font-medium tracking-wide transition-colors flex items-center justify-center gap-2 rounded-none cursor-pointer"
            >
              <SquarePen className="w-4 h-4 stroke-[1.75]" />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>

        {/* Right Column: Travel Statistics */}
        <div className="lg:col-span-8 w-full">
          <h2 className="text-lg sm:text-xl font-medium text-gray-900 mb-4 sm:mb-5">
            Travel Statistics
          </h2>

          {/* 2x2 Stat Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {/* Stat 1: Total Bookings */}
            <div className="bg-white border border-gray-100 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] p-5 sm:p-6 flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-500 font-normal">Total Bookings</p>
                <p className="text-2xl sm:text-3xl font-semibold text-gray-900 mt-2">
                  {totalBookings}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#e6f7fa] text-[#14a1bf] flex items-center justify-center shrink-0">
                <Plane className="w-5 h-5 stroke-[1.75]" />
              </div>
            </div>

            {/* Stat 2: Countries Visited */}
            <div className="bg-white border border-gray-100 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] p-5 sm:p-6 flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-500 font-normal">Countries Visited</p>
                <p className="text-2xl sm:text-3xl font-semibold text-gray-900 mt-2">
                  {countriesVisited}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#ecfdf5] text-[#16a34a] flex items-center justify-center shrink-0">
                <Globe className="w-5 h-5 stroke-[1.75]" />
              </div>
            </div>

            {/* Stat 3: Upcoming Trips */}
            <div className="bg-white border border-gray-100 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] p-5 sm:p-6 flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-500 font-normal">Upcoming Trips</p>
                <p className="text-2xl sm:text-3xl font-semibold text-gray-900 mt-2">
                  {upcomingTrips}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#fff7ed] text-[#ea580c] flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5 stroke-[1.75]" />
              </div>
            </div>

            {/* Stat 4: Total Spent */}
            <div className="bg-white border border-gray-100 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] p-5 sm:p-6 flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-500 font-normal">Total Spent</p>
                <p className="text-2xl sm:text-3xl font-semibold text-gray-900 mt-2">
                  ${totalSpent.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#fdf4ff] text-[#c026d3] flex items-center justify-center shrink-0">
                <DollarSign className="w-5 h-5 stroke-[1.75]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal (z-top + bg-low-blur) */}
      {isEditing && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-200"
        >
          <div className="bg-white max-w-md w-full border border-gray-200 shadow-xl p-6 sm:p-8 relative">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 cursor-pointer p-1"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5 stroke-[1.75]" />
            </button>

            <h3 className="text-xl sm:text-2xl font-normal text-gray-900 tracking-tight">
              Edit Profile
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Update your personal information and preferences
            </p>

            <form onSubmit={handleSave} className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="edit-name"
                  className="block text-xs font-medium text-gray-700 mb-1"
                >
                  Full Name
                </label>
                <input
                  id="edit-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-300 focus:outline-none focus:border-[#14a1bf] transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="edit-location"
                  className="block text-xs font-medium text-gray-700 mb-1"
                >
                  Location
                </label>
                <input
                  id="edit-location"
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, location: e.target.value }))
                  }
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-300 focus:outline-none focus:border-[#14a1bf] transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="edit-nationality"
                  className="block text-xs font-medium text-gray-700 mb-1"
                >
                  Nationality
                </label>
                <input
                  id="edit-nationality"
                  type="text"
                  value={formData.nationality}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, nationality: e.target.value }))
                  }
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-300 focus:outline-none focus:border-[#14a1bf] transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="edit-avatar"
                  className="block text-xs font-medium text-gray-700 mb-1"
                >
                  Avatar Image URL
                </label>
                <input
                  id="edit-avatar"
                  type="url"
                  value={formData.avatar}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, avatar: e.target.value }))
                  }
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-300 focus:outline-none focus:border-[#14a1bf] transition-colors"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs sm:text-sm font-medium text-white bg-[#14a1bf] hover:bg-[#108fa9] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  {saveSuccess ? (
                    <>
                      <Check className="w-4 h-4 stroke-[2]" />
                      <span>Saved</span>
                    </>
                  ) : (
                    <span>Save Changes</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

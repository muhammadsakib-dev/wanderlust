"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  RefreshCw,
  Search,
  Eye,
  Pencil,
  Trash2,
  MapPin,
  Calendar,
  X,
  Check,
  Package,
  Layers,
  DollarSign,
  Users,
  Compass,
  Shield,
  LogOut,
} from "lucide-react";
import type { Destination } from "@/types/destination";
import type { Booking } from "@/types/booking";
import { logoutAdminAction } from "@/app/admin/actions";

export type AdminDestinationItem = Destination;
export type BookingItem = Booking;

export function AdminDashboard() {
  const router = useRouter();
  const [destinations, setDestinations] = React.useState<Destination[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState("ALL");
  const [activeTab, setActiveTab] = React.useState<
    "destinations" | "bookings" | "overview"
  >("destinations");
  const [bookings, setBookings] = React.useState<Booking[]>([]);

  const handleAdminLogout = async () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("wanderlust_admin_session");
      document.cookie =
        "wanderlust_admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
    await logoutAdminAction();
    router.push("/admin/login");
    router.refresh();
  };

  // Edit Modal State
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [editingItem, setEditingItem] =
    React.useState<AdminDestinationItem | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);
  const [editSuccess, setEditSuccess] = React.useState(false);

  // Form State
  const [editFormData, setEditFormData] = React.useState({
    destinationName: "",
    country: "",
    category: "Beach",
    price: "",
    duration: "",
    departureDate: "",
    imageUrl: "",
    description: "",
  });

  const [refreshTrigger, setRefreshTrigger] = React.useState(0);

  React.useEffect(() => {
    let isMounted = true;
    const baseUrl =
      process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:8000";

    const loadData = async () => {
      try {
        // 1. Try Next.js proxy rewrite first
        let res = await fetch("/api/proxy/destinations", {
          headers: { "Content-Type": "application/json" },
        }).catch(() => null);

        // 2. Fallback to direct backend URL if proxy isn't reached
        if (!res || !res.ok) {
          res = await fetch(`${baseUrl}/destinations`, {
            headers: { "Content-Type": "application/json" },
          }).catch(() => null);
        }

        if (isMounted && res && res.ok) {
          const data = await res.json();
          const items = Array.isArray(data)
            ? data
            : Array.isArray(data?.data)
              ? data.data
              : Array.isArray(data?.destinations)
                ? data.destinations
                : [];
          setDestinations(items);
        }

        // 3. Fetch real bookings from MongoDB
        let bRes = await fetch("/api/proxy/bookings", {
          headers: { "Content-Type": "application/json" },
        }).catch(() => null);

        if (!bRes || !bRes.ok) {
          bRes = await fetch(`${baseUrl}/bookings`, {
            headers: { "Content-Type": "application/json" },
          }).catch(() => null);
        }

        if (isMounted && bRes && bRes.ok) {
          const bData = await bRes.json();
          if (Array.isArray(bData)) {
            const formatted: BookingItem[] = bData.map(
              (b: {
                id?: string;
                _id?: string;
                userName?: string;
                customerName?: string;
                userEmail?: string;
                customerEmail?: string;
                destinationName?: string;
                departureDate?: string;
                travelDate?: string;
                guests?: number;
                price?: number | string;
                totalPrice?: number | string;
                status?: "Confirmed" | "Pending" | "Cancelled";
              }) => ({
                id: b.id || b._id || "B-unknown",
                customerName: b.userName || b.customerName || "Traveler",
                customerEmail:
                  b.userEmail || b.customerEmail || "guest@wanderlust.com",
                destinationName: b.destinationName || "Tour Package",
                travelDate: b.departureDate || b.travelDate || "Flexible",
                guests: b.guests || 1,
                totalPrice: Number(b.price || b.totalPrice) || 1299,
                status: b.status || "Confirmed",
              }),
            );
            setBookings(formatted);
          }
        }
      } catch (err) {
        console.warn("Error fetching destinations in admin:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [refreshTrigger]);

  const handleRefresh = () => {
    setIsLoading(true);
    setRefreshTrigger((prev) => prev + 1);
  };

  // Handle Edit Action
  const handleOpenEdit = (item: AdminDestinationItem) => {
    setEditingItem(item);
    setEditFormData({
      destinationName: item.destinationName || item.name || item.title || "",
      country: item.country || "",
      category: item.category || "Beach",
      price: item.price ? String(item.price) : "",
      duration: item.duration || "",
      departureDate: item.departureDate || "",
      imageUrl: item.imageUrl || item.image || "",
      description: item.description || item.overview || "",
    });
    setEditSuccess(false);
    setIsEditOpen(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setIsSaving(true);
    const idToUpdate = editingItem._id || editingItem.id;
    const baseUrl =
      process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:8000";

    const payload = {
      destinationName: editFormData.destinationName,
      country: editFormData.country,
      category: editFormData.category,
      price: Number(editFormData.price) || editFormData.price,
      duration: editFormData.duration,
      departureDate: editFormData.departureDate,
      imageUrl: editFormData.imageUrl,
      description: editFormData.description,
    };

    try {
      // 1. Try Next.js proxy
      let res = await fetch(`/api/proxy/destinations/${idToUpdate}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch(() => null);

      // 2. Fallback direct backend
      if (!res || !res.ok) {
        res = await fetch(`${baseUrl}/destinations/${idToUpdate}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }).catch(() => null);
      }

      // Update state locally
      setDestinations((prev) =>
        prev.map((dest) => {
          const destId = dest._id || dest.id;
          if (destId === idToUpdate) {
            return { ...dest, ...payload };
          }
          return dest;
        }),
      );

      setEditSuccess(true);
      setTimeout(() => {
        setIsEditOpen(false);
        setEditSuccess(false);
      }, 600);
    } catch (err) {
      console.warn("Failed to update destination:", err);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Cancel / Delete Action
  const handleDelete = async (item: AdminDestinationItem) => {
    const idToDelete = item._id || item.id;
    const name = item.destinationName || item.name || "this destination";

    if (
      !confirm(
        `Are you sure you want to cancel / remove "${name}" from the system?`,
      )
    ) {
      return;
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:8000";

    try {
      // 1. Try Next.js proxy
      let res = await fetch(`/api/proxy/destinations/${idToDelete}`, {
        method: "DELETE",
      }).catch(() => null);

      // 2. Fallback direct
      if (!res || !res.ok) {
        res = await fetch(`${baseUrl}/destinations/${idToDelete}`, {
          method: "DELETE",
        }).catch(() => null);
      }

      setDestinations((prev) =>
        prev.filter((dest) => {
          const destId = dest._id || dest.id;
          return destId !== idToDelete;
        }),
      );
    } catch (err) {
      console.warn("Error deleting destination:", err);
    }
  };

  // Toggle booking status with MongoDB persistence
  const handleToggleBookingStatus = async (id: string) => {
    const current = bookings.find((b) => b.id === id);
    if (!current) return;

    const nextStatus: "Confirmed" | "Completed" | "Cancelled" | "Pending" =
      current.status === "Pending"
        ? "Confirmed"
        : current.status === "Confirmed"
          ? "Completed"
          : current.status === "Completed" || current.status === "Complete"
            ? "Cancelled"
            : "Pending";

    // Optimistically update local state
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: nextStatus } : b)),
    );

    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:8000";
      const res = await fetch(`/api/proxy/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      }).catch(() => null);

      if (!res || !res.ok) {
        await fetch(`${baseUrl}/bookings/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: nextStatus }),
        }).catch(() => null);
      }
    } catch (err) {
      console.warn("Failed to persist booking status:", err);
    }
  };

  // Filtered destinations
  const filteredDestinations = destinations.filter((item) => {
    const name = (item.destinationName || item.name || "").toLowerCase();
    const country = (item.country || "").toLowerCase();
    const q = searchQuery.toLowerCase();
    const matchesSearch = name.includes(q) || country.includes(q);

    const matchesCategory =
      categoryFilter === "ALL" ||
      (item.category || "").toLowerCase() === categoryFilter.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  // Calculate dynamic stats
  const totalCount = destinations.length;
  const categoriesCount = new Set(
    destinations.map((d) => (d.category || "General").toLowerCase()),
  ).size;
  const avgPrice =
    totalCount > 0
      ? Math.round(
          destinations.reduce((acc, d) => acc + (Number(d.price) || 0), 0) /
            totalCount,
        )
      : 0;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      {/* Header with Title and Action Buttons */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-gray-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold tracking-wider uppercase text-[#14a1bf]">
              Management Console
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Shield className="w-3 h-3" />
              <span>Admin Active</span>
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-[42px] font-normal text-gray-900 tracking-tight leading-tight">
            Admin Management
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-500 font-normal">
            Manage travel packages, update details, handle cancellations, and
            monitor bookings
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleRefresh}
            className="flex items-center gap-2 border border-gray-300 hover:border-gray-800 text-gray-700 px-3.5 py-2 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
          >
            <RefreshCw
              className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
            />
            <span>Refresh</span>
          </button>

          <Link
            href="/add-destination"
            className="flex items-center gap-2 bg-[#14a1bf] hover:bg-[#108fa9] text-white px-4 py-2 text-xs sm:text-sm font-medium tracking-wide transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2]" />
            <span>Add Destination</span>
          </Link>

          <button
            type="button"
            onClick={handleAdminLogout}
            title="Log out of administrator session"
            className="flex items-center gap-1.5 border border-red-200 text-red-600 hover:bg-red-50 px-3 py-2 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 stroke-[1.75]" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-8">
        <div className="bg-white border border-gray-100 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] p-5 sm:p-6 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
              Total Destinations
            </p>
            <p className="text-2xl sm:text-3xl font-semibold text-gray-900 mt-1.5">
              {totalCount}
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#e6f7fa] text-[#14a1bf] flex items-center justify-center shrink-0">
            <Package className="w-5 h-5 stroke-[1.75]" />
          </div>
        </div>

        <div className="bg-white border border-gray-100 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] p-5 sm:p-6 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
              Active Categories
            </p>
            <p className="text-2xl sm:text-3xl font-semibold text-gray-900 mt-1.5">
              {categoriesCount || 1}
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#ecfdf5] text-[#16a34a] flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5 stroke-[1.75]" />
          </div>
        </div>

        <div className="bg-white border border-gray-100 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] p-5 sm:p-6 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
              Avg. Package Price
            </p>
            <p className="text-2xl sm:text-3xl font-semibold text-gray-900 mt-1.5">
              ${avgPrice.toLocaleString()}
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#fff7ed] text-[#ea580c] flex items-center justify-center shrink-0">
            <DollarSign className="w-5 h-5 stroke-[1.75]" />
          </div>
        </div>

        <div className="bg-white border border-gray-100 shadow-[0_2px_12px_-3px_rgba(0,0,0,0.04)] p-5 sm:p-6 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">
              Bookings Recorded
            </p>
            <p className="text-2xl sm:text-3xl font-semibold text-gray-900 mt-1.5">
              {bookings.length}
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#fdf4ff] text-[#c026d3] flex items-center justify-center shrink-0">
            <Users className="w-5 h-5 stroke-[1.75]" />
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="mt-10 border-b border-gray-200 flex items-center gap-8">
        <button
          type="button"
          onClick={() => setActiveTab("destinations")}
          className={`pb-3 text-sm sm:text-base font-medium tracking-wide transition-colors cursor-pointer border-b-2 flex items-center gap-2 ${
            activeTab === "destinations"
              ? "border-[#14a1bf] text-[#14a1bf]"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <span>Destinations Manager</span>
          <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-700">
            {destinations.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("bookings")}
          className={`pb-3 text-sm sm:text-base font-medium tracking-wide transition-colors cursor-pointer border-b-2 flex items-center gap-2 ${
            activeTab === "bookings"
              ? "border-[#14a1bf] text-[#14a1bf]"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <span>Travel Bookings</span>
          <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-700">
            {bookings.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("overview")}
          className={`pb-3 text-sm sm:text-base font-medium tracking-wide transition-colors cursor-pointer border-b-2 ${
            activeTab === "overview"
              ? "border-[#14a1bf] text-[#14a1bf]"
              : "border-transparent text-gray-500 hover:text-gray-900"
          }`}
        >
          <span>System Overview</span>
        </button>
      </div>

      {/* TAB 1: DESTINATIONS MANAGER */}
      {activeTab === "destinations" && (
        <div className="mt-8">
          {/* Search & Filter Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 stroke-[1.75]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search destination name or country..."
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-200 focus:outline-none focus:border-[#14a1bf] transition-colors"
              />
            </div>

            <div className="flex items-center gap-3">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-[#14a1bf] cursor-pointer"
              >
                <option value="ALL">All Categories</option>
                <option value="beach">Beach</option>
                <option value="mountain">Mountain</option>
                <option value="adventure">Adventure</option>
                <option value="cultural">Cultural</option>
                <option value="city">City</option>
                <option value="cruise">Cruise</option>
                <option value="safari">Safari</option>
              </select>

              <span className="text-xs text-gray-500 whitespace-nowrap">
                Showing {filteredDestinations.length} of {destinations.length}
              </span>
            </div>
          </div>

          {/* Destinations Table */}
          <div className="bg-white border border-gray-200 overflow-x-auto shadow-xs">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-200 text-xs font-semibold uppercase text-gray-600 tracking-wider">
                <tr>
                  <th scope="col" className="px-5 py-3.5">
                    Package
                  </th>
                  <th scope="col" className="px-5 py-3.5">
                    Location
                  </th>
                  <th scope="col" className="px-5 py-3.5">
                    Category
                  </th>
                  <th scope="col" className="px-5 py-3.5">
                    Price
                  </th>
                  <th scope="col" className="px-5 py-3.5">
                    Rating
                  </th>
                  <th scope="col" className="px-5 py-3.5 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-gray-500">
                      <RefreshCw className="w-5 h-5 animate-spin mx-auto text-[#14a1bf] mb-2" />
                      <span>Loading destinations from MongoDB...</span>
                    </td>
                  </tr>
                ) : filteredDestinations.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-gray-500">
                      No destinations found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredDestinations.map((item, index) => {
                    const id = item._id || item.id || String(index);
                    const name =
                      item.destinationName ||
                      item.name ||
                      item.title ||
                      "Bali Paradise";
                    const country = item.country || "Indonesia";
                    const category = item.category || "Beach";
                    const price = item.price ?? 2700;
                    const duration = item.duration || "7 Days/6 Nights";
                    const rating = item.rating ?? 4.8;
                    const imageUrl =
                      item.imageUrl ||
                      item.image ||
                      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80";

                    return (
                      <tr
                        key={id}
                        className="hover:bg-gray-50/70 transition-colors group"
                      >
                        {/* Package Info */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-14 h-11 shrink-0 overflow-hidden bg-gray-100 border border-gray-100">
                              <Image
                                src={imageUrl}
                                alt={name}
                                fill
                                unoptimized
                                sizes="56px"
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <Link
                                href={`/destinations/${id}`}
                                className="font-medium text-gray-900 group-hover:text-[#14a1bf] transition-colors"
                              >
                                {name}
                              </Link>
                              <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
                                <Calendar className="w-3 h-3 text-gray-400 stroke-[1.75]" />
                                <span>{duration}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Location */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1.5 text-gray-700">
                            <MapPin className="w-3.5 h-3.5 text-gray-400 stroke-[1.75]" />
                            <span>{country}</span>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-5 py-4">
                          <span className="inline-block px-2.5 py-0.5 text-xs font-medium uppercase tracking-wider bg-gray-100 text-gray-700 border border-gray-200">
                            {category}
                          </span>
                        </td>

                        {/* Price */}
                        <td className="px-5 py-4 font-semibold text-gray-900">
                          ${price}{" "}
                          <span className="text-xs font-normal text-gray-500">
                            /person
                          </span>
                        </td>

                        {/* Rating */}
                        <td className="px-5 py-4 text-gray-700">
                          <div className="flex items-center gap-1 text-xs">
                            <span className="font-semibold text-gray-900">
                              {rating}
                            </span>
                            <span className="text-amber-500">★</span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* View Details */}
                            <Link
                              href={`/destinations/${id}`}
                              title="View Details Page"
                              className="p-1.5 text-gray-500 hover:text-[#14a1bf] hover:bg-gray-100 transition-colors"
                            >
                              <Eye className="w-4 h-4 stroke-[1.75]" />
                            </Link>

                            {/* Edit Modal Button */}
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(item)}
                              title="Edit Destination"
                              className="p-1.5 text-gray-500 hover:text-[#14a1bf] hover:bg-gray-100 transition-colors cursor-pointer"
                            >
                              <Pencil className="w-4 h-4 stroke-[1.75]" />
                            </button>

                            {/* Cancel / Delete Button */}
                            <button
                              type="button"
                              onClick={() => handleDelete(item)}
                              title="Cancel / Delete Package"
                              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4 stroke-[1.75]" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: BOOKINGS MANAGER */}
      {activeTab === "bookings" && (
        <div className="mt-8">
          <div className="bg-white border border-gray-200 overflow-x-auto shadow-xs">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-200 text-xs font-semibold uppercase text-gray-600 tracking-wider">
                <tr>
                  <th scope="col" className="px-5 py-3.5">
                    Booking ID
                  </th>
                  <th scope="col" className="px-5 py-3.5">
                    Customer
                  </th>
                  <th scope="col" className="px-5 py-3.5">
                    Destination
                  </th>
                  <th scope="col" className="px-5 py-3.5">
                    Date & Guests
                  </th>
                  <th scope="col" className="px-5 py-3.5">
                    Total
                  </th>
                  <th scope="col" className="px-5 py-3.5">
                    Status
                  </th>
                  <th scope="col" className="px-5 py-3.5 text-right">
                    Toggle Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-gray-500">
                      No customer bookings recorded yet in MongoDB.
                    </td>
                  </tr>
                ) : (
                  bookings.map((b) => (
                    <tr
                      key={b.id}
                      className="hover:bg-gray-50/70 transition-colors"
                    >
                      <td className="px-5 py-4 font-mono text-xs text-gray-500 font-medium">
                        {b.id}
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-medium text-gray-900">
                          {b.customerName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {b.customerEmail}
                        </div>
                      </td>
                      <td className="px-5 py-4 font-medium text-gray-800">
                        {b.destinationName}
                      </td>
                      <td className="px-5 py-4 text-xs text-gray-600">
                        <div>{b.travelDate}</div>
                        <div className="text-gray-400">{b.guests} Guests</div>
                      </td>
                      <td className="px-5 py-4 font-semibold text-gray-900">
                        $
                        {(
                          Number(b.totalPrice ?? b.price) || 0
                        ).toLocaleString()}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 text-xs font-medium uppercase tracking-wider ${
                            b.status === "Completed" || b.status === "Complete"
                              ? "bg-purple-50 text-purple-700 border border-purple-200"
                              : b.status === "Confirmed"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : b.status === "Pending"
                                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                                  : "bg-red-50 text-red-700 border border-red-200"
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleToggleBookingStatus(b.id)}
                          className="text-xs font-medium text-[#14a1bf] hover:underline cursor-pointer"
                        >
                          Change Status
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: SYSTEM OVERVIEW */}
      {activeTab === "overview" && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white border border-gray-200 p-6 shadow-xs">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Category Distribution
            </h3>
            <div className="space-y-4">
              {Array.from(
                new Set(destinations.map((d) => d.category || "General")),
              ).map((cat) => {
                const count = destinations.filter(
                  (d) => (d.category || "General") === cat,
                ).length;
                const percentage =
                  totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;

                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-medium text-gray-700">
                      <span>{cat}</span>
                      <span>
                        {count} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 overflow-hidden">
                      <div
                        className="h-full bg-[#14a1bf]"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white border border-gray-200 p-6 shadow-xs">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Quick Shortcuts
            </h3>
            <div className="space-y-3">
              <Link
                href="/add-destination"
                className="block p-3 border border-gray-100 hover:border-[#14a1bf] hover:bg-gray-50 transition-colors"
              >
                <div className="font-medium text-sm text-gray-900">
                  + Add a New Travel Destination
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  Insert fresh travel packages directly into MongoDB
                </div>
              </Link>
              <Link
                href="/destinations"
                className="block p-3 border border-gray-100 hover:border-[#14a1bf] hover:bg-gray-50 transition-colors"
              >
                <div className="font-medium text-sm text-gray-900">
                  Browse All Public Destinations
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  See how travelers experience the catalog with filter bars
                </div>
              </Link>
              <Link
                href="/"
                className="block p-3 border border-gray-100 hover:border-[#14a1bf] hover:bg-gray-50 transition-colors"
              >
                <div className="font-medium text-sm text-gray-900">
                  Visit Wanderlust Homepage
                </div>
                <div className="text-xs text-gray-500 mt-0.5">
                  Check the featured carousel and promotional sections
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* IN-PAGE EDIT MODAL (z-[100] + bg-black/40 backdrop-blur-xs) */}
      {isEditOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-200 overflow-y-auto"
        >
          <div className="bg-white max-w-lg w-full border border-gray-200 shadow-2xl p-6 sm:p-8 relative my-8">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsEditOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 cursor-pointer p-1"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5 stroke-[1.75]" />
            </button>

            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-[#14a1bf]" />
              <h3 className="text-xl sm:text-2xl font-normal text-gray-900 tracking-tight">
                Edit Destination Package
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Changes update immediately on the database and public listing
            </p>

            <form onSubmit={handleSaveEdit} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-900 mb-1">
                  Destination Name
                </label>
                <input
                  type="text"
                  value={editFormData.destinationName}
                  onChange={(e) =>
                    setEditFormData((prev) => ({
                      ...prev,
                      destinationName: e.target.value,
                    }))
                  }
                  required
                  className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#14a1bf] focus:bg-white transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-900 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    value={editFormData.country}
                    onChange={(e) =>
                      setEditFormData((prev) => ({
                        ...prev,
                        country: e.target.value,
                      }))
                    }
                    required
                    className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#14a1bf] focus:bg-white transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-900 mb-1">
                    Category
                  </label>
                  <select
                    value={editFormData.category}
                    onChange={(e) =>
                      setEditFormData((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#14a1bf] focus:bg-white transition-colors cursor-pointer"
                  >
                    <option value="Beach">Beach</option>
                    <option value="Mountain">Mountain</option>
                    <option value="City">City</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Cruise">Cruise</option>
                    <option value="Safari">Safari</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-900 mb-1">
                    Price (USD)
                  </label>
                  <input
                    type="number"
                    value={editFormData.price}
                    onChange={(e) =>
                      setEditFormData((prev) => ({
                        ...prev,
                        price: e.target.value,
                      }))
                    }
                    required
                    className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#14a1bf] focus:bg-white transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-900 mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={editFormData.duration}
                    onChange={(e) =>
                      setEditFormData((prev) => ({
                        ...prev,
                        duration: e.target.value,
                      }))
                    }
                    placeholder="7 Days/6 Nights"
                    required
                    className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#14a1bf] focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-900 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={editFormData.imageUrl}
                  onChange={(e) =>
                    setEditFormData((prev) => ({
                      ...prev,
                      imageUrl: e.target.value,
                    }))
                  }
                  required
                  className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#14a1bf] focus:bg-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-900 mb-1">
                  Description
                </label>
                <textarea
                  value={editFormData.description}
                  onChange={(e) =>
                    setEditFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={4}
                  className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-200 focus:outline-none focus:border-[#14a1bf] focus:bg-white transition-colors resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 text-xs sm:text-sm font-medium text-white bg-[#14a1bf] hover:bg-[#108fa9] transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : editSuccess ? (
                    <>
                      <Check className="w-4 h-4 stroke-[2]" />
                      <span>Updated</span>
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

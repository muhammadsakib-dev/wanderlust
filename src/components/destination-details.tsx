"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Edit,
  Trash2,
  MapPin,
  Calendar,
  Star,
  Check,
  ArrowRight,
  X,
  Save,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DestinationDetailsSkeleton } from "@/components/destination-details-skeleton";

export interface DestinationDetailData {
  _id?: string;
  id?: string | number;
  slug?: string;
  destinationName?: string;
  name?: string;
  title?: string;
  country?: string;
  category?: string;
  price?: number | string;
  duration?: string;
  departureDate?: string;
  imageUrl?: string;
  image?: string;
  description?: string;
  rating?: number | string;
  reviewsCount?: number | string;
  overview?: string;
  highlights?: string[];
}

const fallbackDestinationsMap: Record<string, DestinationDetailData> = {
  "1": {
    id: "1",
    destinationName: "Bali Paradise",
    country: "Nepal",
    category: "Beach",
    price: 2700,
    duration: "7 Days / 6 Nights",
    rating: 4.9,
    reviewsCount: 234,
    departureDate: "2026-05-15",
    imageUrl:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=80",
    overview:
      "Discover the magic of Bali with pristine beaches, ancient temples, and vibrant culture. Experience luxury resorts, tropical landscapes, and unforgettable sunsets.",
    description:
      "Discover the magic of Bali with pristine beaches, ancient temples, and vibrant culture. Experience luxury resorts, tropical landscapes, and unforgettable sunsets.",
    highlights: [
      "Luxury beachfront accommodation",
      "Visit Uluwatu Temple at sunset",
      "Traditional Balinese spa treatment",
      "Private beach dinner experience",
      "Sunrise trek to Mount Batur",
    ],
  },
  "2": {
    id: "2",
    destinationName: "Bali Paradise",
    country: "Indonesia",
    category: "Beach",
    price: 2700,
    duration: "7 Days / 6 Nights",
    rating: 4.8,
    reviewsCount: 189,
    departureDate: "2026-06-10",
    imageUrl:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80",
    overview:
      "Immerse yourself in overwater villas perched above crystal blue lagoons. Experience morning yoga over the water, fresh tropical dining, and private lagoon dips.",
    description:
      "Immerse yourself in overwater villas perched above crystal blue lagoons. Experience morning yoga over the water, fresh tropical dining, and private lagoon dips.",
    highlights: [
      "Overwater private bungalow stay",
      "Direct ocean lagoon access",
      "Daily sunset cocktail cruise",
      "Gourmet seafood dining",
      "Scuba diving excursion",
    ],
  },
  "3": {
    id: "3",
    destinationName: "Bali Paradise",
    country: "Nepal",
    category: "Mountain",
    price: 2700,
    duration: "7 Days / 6 Nights",
    rating: 4.9,
    reviewsCount: 312,
    departureDate: "2026-07-01",
    imageUrl:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80",
    overview:
      "Ascend to breathtaking cloud-kissed mountain valleys with panoramic terrace views. Perfect for nature lovers looking for serene meditation, fresh highland air, and scenic valley trekking.",
    description:
      "Ascend to breathtaking cloud-kissed mountain valleys with panoramic terrace views. Perfect for nature lovers looking for serene meditation, fresh highland air, and scenic valley trekking.",
    highlights: [
      "Panoramic mountain net relaxation",
      "Guided highland valley trek",
      "Organic farm-to-table cuisine",
      "Mountain sunrise photography",
      "Campfire stargazing evening",
    ],
  },
  "4": {
    id: "4",
    destinationName: "Bali Paradise",
    country: "Nepal",
    category: "Cultural",
    price: 2700,
    duration: "7 Days / 6 Nights",
    rating: 4.7,
    reviewsCount: 156,
    departureDate: "2026-08-15",
    imageUrl:
      "https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=1600&q=80",
    overview:
      "Walk among ancient stone citadel ruins, mist-shrouded green terraces, and ancient archaeological wonders with expert historians and cultural storytellers.",
    description:
      "Walk among ancient stone citadel ruins, mist-shrouded green terraces, and ancient archaeological wonders with expert historians and cultural storytellers.",
    highlights: [
      "Ancient mountain citadel tour",
      "Exclusive early access pass",
      "Expert local historian guide",
      "Scenic panoramic rail ride",
      "Traditional cultural dinner",
    ],
  },
  "5": {
    id: "5",
    destinationName: "Bali Paradise",
    country: "Nepal",
    category: "Beach",
    price: 2700,
    duration: "7 Days / 6 Nights",
    rating: 4.9,
    reviewsCount: 275,
    departureDate: "2026-09-05",
    imageUrl:
      "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1600&q=80",
    overview:
      "Lounge along powder-white sands fringed by swaying coconut palms and tranquil aquamarine surf. An idyllic getaway for sun seekers, swimmers, and seaside leisure.",
    description:
      "Lounge along powder-white sands fringed by swaying coconut palms and tranquil aquamarine surf. An idyllic getaway for sun seekers, swimmers, and seaside leisure.",
    highlights: [
      "Private beachfront cabana",
      "Catamaran sailing trip",
      "Fresh tropical smoothie bar",
      "Stand-up paddleboarding",
      "Seaside bonfire night",
    ],
  },
  "6": {
    id: "6",
    destinationName: "Bali Paradise",
    country: "Nepal",
    category: "Adventure",
    price: 2700,
    duration: "7 Days / 6 Nights",
    rating: 4.8,
    reviewsCount: 142,
    departureDate: "2026-10-12",
    imageUrl:
      "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1600&q=80",
    overview:
      "Venture through giant cactus landscapes where dramatic golden sunsets melt into shimmering waters. Experience desert off-roading, stargazing, and wilderness bliss.",
    description:
      "Venture through giant cactus landscapes where dramatic golden sunsets melt into shimmering waters. Experience desert off-roading, stargazing, and wilderness bliss.",
    highlights: [
      "Giant cactus trail expedition",
      "Desert sunset safari",
      "Astronomy & telescope session",
      "Campfire barbecue feast",
      "Wilderness eco-lodge stay",
    ],
  },
};

function getInitialDestination(slug: string): DestinationDetailData {
  if (fallbackDestinationsMap[slug]) {
    return fallbackDestinationsMap[slug];
  }
  return fallbackDestinationsMap["1"];
}

interface DestinationDetailsProps {
  slug: string;
}

export function DestinationDetails({ slug }: DestinationDetailsProps) {
  const router = useRouter();
  const [destination, setDestination] = React.useState<DestinationDetailData>(() =>
    getInitialDestination(slug)
  );
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [selectedDate, setSelectedDate] = React.useState<string>("2026-05-15");
  const [isBooking, setIsBooking] = React.useState<boolean>(false);
  const [isDeleting, setIsDeleting] = React.useState<boolean>(false);

  // Edit Modal State
  const [isEditOpen, setIsEditOpen] = React.useState<boolean>(false);
  const [isSaving, setIsSaving] = React.useState<boolean>(false);
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

  // Fetch destination by slug / ID from backend
  React.useEffect(() => {
    let isMounted = true;
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:8000";

    const fetchDetail = async () => {
      try {
        // 1. First try single destination endpoint: /destinations/:id
        const res = await fetch(`${baseUrl}/destinations/${slug}`, {
          headers: { "Content-Type": "application/json" },
        });

        if (res.ok) {
          const data = await res.json();
          const item = data?.data || data?.destination || data;
          if (isMounted && item && typeof item === "object") {
            setDestination((prev) => ({
              ...prev,
              ...item,
              id: item._id || item.id || slug,
              destinationName:
                item.destinationName || item.name || item.title || prev.destinationName,
              country: item.country || prev.country,
              price: item.price ?? prev.price,
              duration: item.duration || prev.duration,
              rating: item.rating ?? prev.rating ?? 4.9,
              imageUrl: item.imageUrl || item.image || prev.imageUrl,
              overview:
                item.description || item.overview || prev.overview || prev.description,
            }));
            if (item.departureDate) {
              setSelectedDate(item.departureDate);
            }
            return;
          }
        }

        // 2. Fallback: try querying /destinations list and matching id or _id
        const listRes = await fetch(`${baseUrl}/destinations`, {
          headers: { "Content-Type": "application/json" },
        });

        if (listRes.ok) {
          const listData = await listRes.json();
          const items: DestinationDetailData[] = Array.isArray(listData)
            ? listData
            : Array.isArray(listData?.data)
            ? listData.data
            : [];

          const matched = items.find(
            (it) =>
              String(it._id) === slug ||
              String(it.id) === slug ||
              it.destinationName?.toLowerCase().replace(/\s+/g, "-") === slug.toLowerCase()
          );

          if (isMounted && matched) {
            setDestination((prev) => ({
              ...prev,
              ...matched,
              id: matched._id || matched.id || slug,
              destinationName:
                matched.destinationName || matched.name || matched.title || prev.destinationName,
              country: matched.country || prev.country,
              price: matched.price ?? prev.price,
              duration: matched.duration || prev.duration,
              rating: matched.rating ?? prev.rating ?? 4.9,
              imageUrl: matched.imageUrl || matched.image || prev.imageUrl,
              overview:
                matched.description || matched.overview || prev.overview || prev.description,
            }));
            if (matched.departureDate) {
              setSelectedDate(matched.departureDate);
            }
            return;
          }
        }

        // 3. If backend doesn't have it, look up in local fallback map
        if (isMounted && fallbackDestinationsMap[slug]) {
          setDestination(fallbackDestinationsMap[slug]);
          if (fallbackDestinationsMap[slug].departureDate) {
            setSelectedDate(fallbackDestinationsMap[slug].departureDate!);
          }
        }
      } catch (err) {
        console.warn("Could not reach backend, displaying card details:", err);
        if (isMounted && fallbackDestinationsMap[slug]) {
          setDestination(fallbackDestinationsMap[slug]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    if (slug) {
      fetchDetail();
    }

    return () => {
      isMounted = false;
    };
  }, [slug]);

  // Open Edit Modal with current destination data populated
  const handleOpenEdit = () => {
    setEditFormData({
      destinationName: destination.destinationName || destination.name || "",
      country: destination.country || "",
      category: destination.category || "Beach",
      price: destination.price ? String(destination.price) : "",
      duration: destination.duration || "",
      departureDate: destination.departureDate || selectedDate || "",
      imageUrl: destination.imageUrl || destination.image || "",
      description: destination.overview || destination.description || "",
    });
    setIsEditOpen(true);
  };

  // Submit Edit updates to backend and local state
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:8000";
      const idToUpdate = destination._id || destination.id || slug;

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

      const res = await fetch(`${baseUrl}/destinations/${idToUpdate}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        console.warn("Backend update returned status:", res.status);
      }

      // Update local destination state immediately
      setDestination((prev) => ({
        ...prev,
        ...payload,
        overview: payload.description,
      }));

      if (payload.departureDate) {
        setSelectedDate(payload.departureDate);
      }

      setIsEditOpen(false);
    } catch (err) {
      console.warn("Failed to update on backend, updating locally:", err);
      setDestination((prev) => ({
        ...prev,
        destinationName: editFormData.destinationName,
        country: editFormData.country,
        category: editFormData.category,
        price: Number(editFormData.price) || editFormData.price,
        duration: editFormData.duration,
        departureDate: editFormData.departureDate,
        imageUrl: editFormData.imageUrl,
        overview: editFormData.description,
        description: editFormData.description,
      }));
      setIsEditOpen(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleBookNow = () => {
    setIsBooking(true);
    setTimeout(() => {
      setIsBooking(false);
      alert(
        `Booking confirmed for ${destination.destinationName || "Travel Package"} on ${selectedDate}!`
      );
    }, 600);
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to cancel / remove this travel package?")) {
      setIsDeleting(true);
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:8000";
        const idToDelete = destination._id || destination.id || slug;
        await fetch(`${baseUrl}/destinations/${idToDelete}`, {
          method: "DELETE",
        });
      } catch (err) {
        console.warn("Delete request error:", err);
      } finally {
        router.push("/destinations");
      }
    }
  };

  const name = destination.destinationName || destination.name || "Bali Paradise";
  const country = destination.country || "Indonesia";
  const price = destination.price ?? 2700;
  const duration = destination.duration || "7 Days / 6 Nights";
  const rating = destination.rating ?? 4.9;
  const reviews = destination.reviewsCount ?? 234;
  const imageUrl =
    destination.imageUrl ||
    destination.image ||
    fallbackDestinationsMap["1"].imageUrl!;
  const overview =
    destination.overview ||
    destination.description ||
    fallbackDestinationsMap["1"].overview!;
  const highlights =
    destination.highlights && destination.highlights.length > 0
      ? destination.highlights
      : fallbackDestinationsMap["1"].highlights!;

  if (isLoading) {
    return <DestinationDetailsSkeleton />;
  }

  return (
    <section className="w-full bg-white py-8 sm:py-10 lg:py-12 px-4 sm:px-6 lg:px-12 relative">
      <div className="max-w-6xl mx-auto">
        {/* Top Navigation & Action Buttons Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <Link
            href="/destinations"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Destinations</span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleOpenEdit}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-800 bg-white border border-gray-300 hover:border-gray-800 rounded-md transition-colors cursor-pointer"
            >
              <Edit className="w-4 h-4" />
              <span>Edit</span>
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-500 bg-white border border-red-300 hover:bg-red-50 rounded-md transition-colors cursor-pointer active:scale-98 disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
              <span>{isDeleting ? "Deleting..." : "Cancel"}</span>
            </button>
          </div>
        </div>

        {/* Hero Banner Image */}
        <div className="relative w-full aspect-[21/9] sm:aspect-[2.2/1] overflow-hidden bg-gray-100 rounded-xs mb-8">
          <Image
            src={imageUrl}
            alt={name}
            fill
            unoptimized
            priority
            sizes="(max-width: 1200px) 100vw, 1152px"
            className="object-cover object-center"
          />
        </div>

        {/* Content Section: 2 Columns */}
        <div className="pt-2 border-t border-gray-100 grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12 items-start">
          {/* Left Column: Details, Overview & Highlights (Span 2) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Location & Title */}
            <div>
              <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-500 font-normal">
                <MapPin className="w-3.5 h-3.5 stroke-[1.75]" />
                <span>{country}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-[46px] font-normal text-gray-900 tracking-tight leading-tight mt-1.5 mb-3">
                {name}
              </h1>

              {/* Rating & Duration Meta Info */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-gray-700">
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-green-600 text-green-600" />
                  <span className="font-semibold text-gray-900">{rating}</span>
                  <span className="text-gray-500 font-normal">({reviews} reviews)</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-gray-500 stroke-[1.75]" />
                  <span className="font-semibold text-gray-900">{duration}</span>
                </div>
              </div>
            </div>

            {/* Overview Section */}
            <div>
              <h2 className="text-xl sm:text-2xl font-normal text-gray-900 tracking-tight mb-3">
                Overview
              </h2>
              <p className="text-sm sm:text-base text-gray-600 font-light leading-relaxed">
                {overview}
              </p>
            </div>

            {/* Highlights Section */}
            <div>
              <h2 className="text-xl sm:text-2xl font-normal text-gray-900 tracking-tight mb-3">
                Highlights
              </h2>
              <p className="text-sm sm:text-base text-gray-600 font-light leading-relaxed mb-4">
                {overview}
              </p>

              {/* Highlights 2-column checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5 pt-1">
                {highlights.map((point) => (
                  <div key={point} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-teal-600 shrink-0 mt-0.5 stroke-[2.5]" />
                    <span className="text-xs sm:text-sm text-gray-700 font-normal">
                      {point}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200/90 rounded-md p-6 sm:p-7 shadow-xs sticky top-24">
              <span className="text-xs sm:text-sm text-gray-400 font-normal">
                Starting from
              </span>
              <div className="mt-0.5 flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-semibold text-[#14a1bf] tracking-tight">
                  ${price}
                </span>
              </div>
              <span className="text-xs text-gray-500 font-normal block mt-0.5 mb-6">
                per person
              </span>

              {/* Date Input */}
              <div className="mb-5">
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-gray-50/80 border border-gray-200 px-3.5 py-3 text-sm text-gray-800 rounded-none outline-none focus:border-[#14a1bf] transition-colors"
                />
              </div>

              {/* Book Now Button */}
              <button
                type="button"
                onClick={handleBookNow}
                disabled={isBooking}
                className="w-full bg-[#14a1bf] hover:bg-[#108fa9] text-white py-3.5 px-4 font-medium text-sm tracking-wide flex items-center justify-center gap-2 transition-colors cursor-pointer rounded-none mb-6 active:scale-[0.99] disabled:opacity-75"
              >
                <span>{isBooking ? "Booking..." : "Book Now"}</span>
                <ArrowRight className="w-4 h-4 stroke-[2]" />
              </button>

              {/* Guarantees Checklist */}
              <div className="space-y-2.5 pt-2 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-teal-600 shrink-0 stroke-[2.5]" />
                  <span className="text-xs text-gray-600 font-normal">
                    Free cancellation up to 7 days
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-teal-600 shrink-0 stroke-[2.5]" />
                  <span className="text-xs text-gray-600 font-normal">
                    Travel insurance included
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-teal-600 shrink-0 stroke-[2.5]" />
                  <span className="text-xs text-gray-600 font-normal">
                    24/7 customer support
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal Overlay: z-top + bg-low-blur */}
      {isEditOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto border border-gray-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-normal text-gray-900 tracking-tight">
                  Edit Travel Package
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Update package details and save directly on this page.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditOpen(false)}
                className="text-gray-400 hover:text-gray-700 p-1.5 rounded-md transition-colors cursor-pointer"
                aria-label="Close edit modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveEdit} className="space-y-5">
              {/* Destination Name */}
              <div className="space-y-1.5">
                <Label htmlFor="edit-destinationName" className="text-sm font-semibold text-gray-900">
                  Destination Name
                </Label>
                <Input
                  id="edit-destinationName"
                  value={editFormData.destinationName}
                  onChange={(e) =>
                    setEditFormData((prev) => ({ ...prev, destinationName: e.target.value }))
                  }
                  required
                  className="h-10 rounded-md border-gray-200 bg-gray-50 px-3 text-sm focus-visible:border-[#14a1bf] focus-visible:ring-[#14a1bf]/20"
                />
              </div>

              {/* Country & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="edit-country" className="text-sm font-semibold text-gray-900">
                    Country
                  </Label>
                  <Input
                    id="edit-country"
                    value={editFormData.country}
                    onChange={(e) =>
                      setEditFormData((prev) => ({ ...prev, country: e.target.value }))
                    }
                    required
                    className="h-10 rounded-md border-gray-200 bg-gray-50 px-3 text-sm focus-visible:border-[#14a1bf] focus-visible:ring-[#14a1bf]/20"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="edit-category" className="text-sm font-semibold text-gray-900">
                    Category
                  </Label>
                  <select
                    id="edit-category"
                    value={editFormData.category}
                    onChange={(e) =>
                      setEditFormData((prev) => ({ ...prev, category: e.target.value }))
                    }
                    className="w-full h-10 rounded-md border border-gray-200 bg-gray-50 px-3 text-sm outline-none focus:border-[#14a1bf] cursor-pointer"
                  >
                    <option value="Beach">Beach</option>
                    <option value="Mountain">Mountain</option>
                    <option value="City">City</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Cruise">Cruise</option>
                    <option value="Safari">Safari</option>
                    <option value="Island">Island</option>
                  </select>
                </div>
              </div>

              {/* Price & Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="edit-price" className="text-sm font-semibold text-gray-900">
                    Price (USD)
                  </Label>
                  <Input
                    id="edit-price"
                    type="number"
                    min="0"
                    value={editFormData.price}
                    onChange={(e) =>
                      setEditFormData((prev) => ({ ...prev, price: e.target.value }))
                    }
                    required
                    className="h-10 rounded-md border-gray-200 bg-gray-50 px-3 text-sm focus-visible:border-[#14a1bf] focus-visible:ring-[#14a1bf]/20"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="edit-duration" className="text-sm font-semibold text-gray-900">
                    Duration
                  </Label>
                  <Input
                    id="edit-duration"
                    value={editFormData.duration}
                    onChange={(e) =>
                      setEditFormData((prev) => ({ ...prev, duration: e.target.value }))
                    }
                    required
                    placeholder="e.g., 7 Days/6 Nights"
                    className="h-10 rounded-md border-gray-200 bg-gray-50 px-3 text-sm focus-visible:border-[#14a1bf] focus-visible:ring-[#14a1bf]/20"
                  />
                </div>
              </div>

              {/* Departure Date */}
              <div className="space-y-1.5">
                <Label htmlFor="edit-departureDate" className="text-sm font-semibold text-gray-900">
                  Departure Date
                </Label>
                <Input
                  id="edit-departureDate"
                  type="date"
                  value={editFormData.departureDate}
                  onChange={(e) =>
                    setEditFormData((prev) => ({ ...prev, departureDate: e.target.value }))
                  }
                  className="h-10 rounded-md border-gray-200 bg-gray-50 px-3 text-sm focus-visible:border-[#14a1bf] focus-visible:ring-[#14a1bf]/20"
                />
              </div>

              {/* Image URL */}
              <div className="space-y-1.5">
                <Label htmlFor="edit-imageUrl" className="text-sm font-semibold text-gray-900">
                  Image URL
                </Label>
                <Input
                  id="edit-imageUrl"
                  type="url"
                  value={editFormData.imageUrl}
                  onChange={(e) =>
                    setEditFormData((prev) => ({ ...prev, imageUrl: e.target.value }))
                  }
                  required
                  placeholder="https://example.com/image.jpg"
                  className="h-10 rounded-md border-gray-200 bg-gray-50 px-3 text-sm focus-visible:border-[#14a1bf] focus-visible:ring-[#14a1bf]/20"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <Label htmlFor="edit-description" className="text-sm font-semibold text-gray-900">
                  Description / Overview
                </Label>
                <Textarea
                  id="edit-description"
                  value={editFormData.description}
                  onChange={(e) =>
                    setEditFormData((prev) => ({ ...prev, description: e.target.value }))
                  }
                  rows={4}
                  className="rounded-md border-gray-200 bg-gray-50 px-3 py-2 text-sm focus-visible:border-[#14a1bf] focus-visible:ring-[#14a1bf]/20 resize-none"
                />
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-md transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 text-sm font-medium text-white bg-[#14a1bf] hover:bg-[#108fa9] rounded-md transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSaving ? "Saving..." : "Save Changes"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

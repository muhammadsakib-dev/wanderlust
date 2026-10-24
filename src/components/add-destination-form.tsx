"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Trash2, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const categories = [
  "Beach",
  "Mountain",
  "City",
  "Adventure",
  "Cultural",
  "Cruise",
  "Safari",
  "Island",
];

export interface DestinationFormData {
  destinationName: string;
  country: string;
  category: string;
  price: string;
  duration: string;
  departureDate: string;
  imageUrl: string;
  description: string;
}

export function AddDestinationForm() {
  const router = useRouter();

  const [formData, setFormData] = React.useState<DestinationFormData>({
    destinationName: "",
    country: "",
    category: "",
    price: "",
    duration: "",
    departureDate: "",
    imageUrl: "",
    description: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string | null) => {
    setFormData((prev) => ({ ...prev, category: value ?? "" }));
  };

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitError, setSubmitError] = React.useState("");
  const [submitSuccess, setSubmitSuccess] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    const payload = {
      ...formData,
      price: Number(formData.price) || formData.price,
    };

    try {
      // 1. Try Next.js proxy route first
      let res = await fetch("/api/proxy/add-destination", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // 2. If proxy route is not reachable, fallback to direct backend URL
      if (!res.ok) {
        const directBase =
          process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:8000";
        res = await fetch(`${directBase}/add-destination`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      setSubmitSuccess(true);
      setTimeout(() => {
        router.push("/admin");
      }, 700);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to add destination.";
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {submitError && (
        <div className="p-3 bg-red-50 border border-red-200 text-xs sm:text-sm text-red-600 rounded-md">
          {submitError}
        </div>
      )}

      {submitSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-emerald-700 rounded-md">
          Destination created successfully! Redirecting to Admin...
        </div>
      )}
      {/* Destination Name */}
      <div className="space-y-2">
        <Label htmlFor="destinationName" className="text-sm font-semibold text-gray-900">
          Destination Name
        </Label>
        <Input
          id="destinationName"
          name="destinationName"
          value={formData.destinationName}
          onChange={handleChange}
          placeholder="Bali Paradise"
          className="h-10 rounded-md border-gray-200 bg-gray-50 px-3 text-sm placeholder:text-gray-400 focus-visible:border-[#14a1bf] focus-visible:ring-[#14a1bf]/20"
        />
      </div>

      {/* Country & Category Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor="country" className="text-sm font-semibold text-gray-900">
            Country
          </Label>
          <Input
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="Indonesia"
            className="h-10 rounded-md border-gray-200 bg-gray-50 px-3 text-sm placeholder:text-gray-400 focus-visible:border-[#14a1bf] focus-visible:ring-[#14a1bf]/20"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-semibold text-gray-900">Category</Label>
          <Select value={formData.category} onValueChange={handleCategoryChange}>
            <SelectTrigger className="h-10 w-full rounded-md border-gray-200 bg-gray-50 px-3 text-sm data-placeholder:text-gray-400 focus-visible:border-[#14a1bf] focus-visible:ring-[#14a1bf]/20">
              <SelectValue placeholder="Beach" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat.toLowerCase()}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Price & Duration Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor="price" className="text-sm font-semibold text-gray-900">
            Price (USD)
          </Label>
          <Input
            id="price"
            name="price"
            type="number"
            min="0"
            value={formData.price}
            onChange={handleChange}
            placeholder="e.g., 1299"
            className="h-10 rounded-md border-gray-200 bg-gray-50 px-3 text-sm placeholder:text-gray-400 focus-visible:border-[#14a1bf] focus-visible:ring-[#14a1bf]/20"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration" className="text-sm font-semibold text-gray-900">
            Duration
          </Label>
          <Input
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            placeholder="e.g., 7 Days/6 Nights"
            className="h-10 rounded-md border-gray-200 bg-gray-50 px-3 text-sm placeholder:text-gray-400 focus-visible:border-[#14a1bf] focus-visible:ring-[#14a1bf]/20"
          />
        </div>
      </div>

      {/* Departure Date */}
      <div className="space-y-2">
        <Label htmlFor="departureDate" className="text-sm font-semibold text-gray-900">
          Departure Date
        </Label>
        <Input
          id="departureDate"
          name="departureDate"
          type="date"
          value={formData.departureDate}
          onChange={handleChange}
          placeholder="mm/dd/yyyy"
          className="h-10 rounded-md border-gray-200 bg-gray-50 px-3 text-sm placeholder:text-gray-400 focus-visible:border-[#14a1bf] focus-visible:ring-[#14a1bf]/20"
        />
      </div>

      {/* Image URL */}
      <div className="space-y-2">
        <Label htmlFor="imageUrl" className="text-sm font-semibold text-gray-900">
          Image URL
        </Label>
        <Input
          id="imageUrl"
          name="imageUrl"
          type="url"
          value={formData.imageUrl}
          onChange={handleChange}
          placeholder="https://example.com/image.jpg"
          className="h-10 rounded-md border-gray-200 bg-gray-50 px-3 text-sm placeholder:text-gray-400 focus-visible:border-[#14a1bf] focus-visible:ring-[#14a1bf]/20"
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-semibold text-gray-900">
          Description
        </Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe the travel experience..."
          rows={5}
          className="rounded-md border-gray-200 bg-gray-50 px-3 py-2.5 text-sm placeholder:text-gray-400 focus-visible:border-[#14a1bf] focus-visible:ring-[#14a1bf]/20 resize-none"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-4 pt-4">
        <button
          type="button"
          onClick={handleCancel}
          className="flex items-center gap-2 border border-red-400 text-red-500 hover:bg-red-50 px-6 py-2.5 text-sm font-medium transition-colors rounded-md cursor-pointer active:scale-[0.98]"
        >
          <Trash2 className="w-4 h-4" />
          <span>Cancel</span>
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 bg-[#14a1bf] hover:bg-[#108fa9] text-white px-6 py-2.5 text-sm font-medium transition-colors rounded-md cursor-pointer active:scale-[0.98] disabled:opacity-60"
        >
          <Save className="w-4 h-4" />
          <span>{isSubmitting ? "Adding..." : "Add Travel Package"}</span>
        </button>
      </div>
    </form>
  );
}

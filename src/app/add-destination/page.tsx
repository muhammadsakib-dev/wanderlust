import type { Metadata } from "next";
import { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AddDestinationForm } from "@/components/add-destination-form";

export const metadata: Metadata = {
  title: "Add Destination | Admin Wanderlust",
  description: "Create and publish a new travel package.",
};

async function AddDestinationProtectedForm() {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get("wanderlust_admin_session")?.value === "true";

  if (!isAdmin) {
    redirect("/admin/login?callbackUrl=/add-destination");
  }

  return <AddDestinationForm />;
}

export default function AddDestinationPage() {
  return (
    <section className="w-full bg-white py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Page Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-[44px] font-normal text-gray-900 tracking-tight leading-tight mb-10 sm:mb-12">
          Add New Travel Package
        </h1>

        {/* Form Card */}
        <div className="bg-white border border-gray-200/80 rounded-lg shadow-xs p-6 sm:p-8 md:p-10">
          <Suspense
            fallback={
              <div className="py-12 text-center text-sm text-gray-400">
                Loading destination form...
              </div>
            }
          >
            <AddDestinationProtectedForm />
          </Suspense>
        </div>
      </div>
    </section>
  );
}


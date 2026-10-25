// Completed

// Import Essential Modules and Components
import { Hero } from "@/components/hero";
import { FeaturedDestinations } from "@/components/featured-destinations";
import { WhyChooseUs } from "@/components/why-choose-us";
import { Testimonials } from "@/components/testimonials";
import { CtaSection } from "@/components/cta-section";

// Home Page Component
export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedDestinations />
      <WhyChooseUs />
      <Testimonials />
      <CtaSection />
    </>
  );
}

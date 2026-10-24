import Image from "next/image";

interface FeatureCard {
  icon: string;
  title: string;
  description: string;
  alt: string;
}

const features: FeatureCard[] = [
  {
    icon: "/images/ShieldCheck.png",
    title: "Safe & Secure",
    description:
      "Your safety is our priority with comprehensive travel insurance and 24/7 support.",
    alt: "Safe and secure shield check icon",
  },
  {
    icon: "/images/MapTrifold.png",
    title: "Expert Guides",
    description:
      "Local experts who bring destinations to life with authentic cultural insights.",
    alt: "Expert guides map icon",
  },
  {
    icon: "/images/Headset.png",
    title: "24/7 Support",
    description:
      "Round-the-clock customer service to assist you wherever your journey takes you.",
    alt: "24/7 customer support headset icon",
  },
];

export function WhyChooseUs() {
  return (
    <section className="w-full bg-[#edf8fa] py-20 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Section Heading & Subtitle */}
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-[44px] font-normal text-gray-900 tracking-tight leading-tight">
            Why Choose Wanderlust
          </h2>
          <p className="mt-3.5 text-sm sm:text-base text-gray-500 font-normal leading-relaxed">
            Your trusted partner for exceptional travel experiences
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-white p-8 sm:p-10 flex flex-col items-start transition-all duration-200 hover:-translate-y-1 hover:shadow-lg shadow-xs"
            >
              {/* Feature Icon */}
              <div className="w-10 h-10 mb-6 flex items-center justify-start">
                <Image
                  src={feature.icon}
                  alt={feature.alt}
                  width={44}
                  height={44}
                  className="w-10 h-10 object-contain"
                />
              </div>

              {/* Feature Title */}
              <h3 className="text-xl sm:text-[22px] font-normal sm:font-medium text-gray-900 tracking-tight mb-3">
                {feature.title}
              </h3>

              {/* Feature Description */}
              <p className="text-sm text-gray-500 font-normal leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


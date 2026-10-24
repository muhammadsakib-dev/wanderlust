"use client";

import * as React from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

interface Testimonial {
  id: number;
  quote: string;
  author: string;
  location: string;
  image: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    quote:
      '"The Bali Trip Was Absolutely Magical! Every Detail Was Perfectly Planned. The Resorts Were Luxurious And The Cultural Experiences Were Unforgettable."',
    author: "Michael Chen",
    location: "Singapore",
    image: "/images/person1.png",
  },
  {
    id: 2,
    quote:
      '"Swiss Alps Adventure Exceeded All Expectations. The Mountain Views Were Breathtaking And Our Guide Was Incredibly Knowledgeable. Highly Recommend!"',
    author: "Sarah Johnson",
    location: "New York, USA",
    image: "/images/person2.png",
  },
  {
    id: 3,
    quote:
      '"Exploring The Wonders Of Kyoto Was A Dream Come True. The Local Guides Provided Deep Authentic Cultural Connections We Could Never Find Alone."',
    author: "David Miller",
    location: "London, UK",
    image: "/images/person1.png",
  },
  {
    id: 4,
    quote:
      '"Our Mediterranean Cruise And Amalfi Coast Tour Was Seamless From Start To Finish. The Customer Support Team Was Attentive And Outstanding."',
    author: "Elena Rostova",
    location: "Milan, Italy",
    image: "/images/person2.png",
  },
];

export function Testimonials() {
  const [api, setApi] = React.useState<CarouselApi>();

  const handlePrev = () => {
    api?.scrollPrev();
  };

  const handleNext = () => {
    api?.scrollNext();
  };

  return (
    <section className="w-full bg-white py-20 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          {/* Section Header: Title + Subtitle on Left, Carousel Controls on Right */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-2">
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-[44px] font-normal text-gray-900 tracking-tight leading-tight">
                What Travelers Say
              </h2>
              <p className="mt-3 text-sm sm:text-base text-gray-500 font-normal leading-relaxed">
                Real experiences from our happy travelers
              </p>
            </div>

            {/* Navigation Arrow Controls */}
            <div className="flex items-center gap-3 self-start sm:self-auto">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous testimonials"
                className="w-11 h-11 rounded-full border border-gray-300 hover:border-gray-800 text-gray-400 hover:text-gray-900 flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-95"
              >
                <ArrowLeft className="w-4 h-4 stroke-[1.75]" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next testimonials"
                className="w-11 h-11 rounded-full border border-gray-300 hover:border-gray-800 text-gray-400 hover:text-gray-900 flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-95"
              >
                <ArrowRight className="w-4 h-4 stroke-[1.75]" />
              </button>
            </div>
          </div>

          {/* Carousel Track with shadcn CarouselContent & CarouselItem */}
          <CarouselContent className="-ml-6 mt-12 sm:mt-14">
            {testimonials.map((item) => (
              <CarouselItem
                key={item.id}
                className="pl-6 basis-full lg:basis-1/2"
              >
                <div className="h-full border border-gray-200/90 bg-white p-6 sm:p-8 flex flex-col sm:flex-row justify-between gap-6 hover:border-gray-300 transition-all duration-200 select-none">
                  {/* Left Column: Quote & Author details */}
                  <div className="flex-1 flex flex-col justify-between pr-0 sm:pr-2">
                    <p className="text-base sm:text-[17px] text-gray-900 font-normal leading-relaxed tracking-normal">
                      {item.quote}
                    </p>

                    <div className="mt-8 sm:mt-10">
                      <p className="text-sm sm:text-[15px] font-medium text-[#14a1bf] tracking-wide">
                        — {item.author}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-400 font-normal mt-0.5">
                        {item.location}
                      </p>
                    </div>
                  </div>

                  {/* Right Column: Author Portrait Image */}
                  <div className="w-full sm:w-40 md:w-44 shrink-0 aspect-[4/5] relative overflow-hidden self-center sm:self-start">
                    <Image
                      src={item.image}
                      alt={`${item.author} testimonial`}
                      fill
                      sizes="(max-width: 640px) 100vw, 180px"
                      className="object-cover object-center pointer-events-none"
                    />
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}

"use client";

import { Hero } from "@/components/home/hero";
import { Features } from "@/components/home/features";
import { ArtistTypes } from "@/components/home/artist-types";
import { Testimonials } from "@/components/home/testimonials";
import { Pricing } from "@/components/home/pricing";
import { CTA } from "@/components/home/cta";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <Hero />
      <Features />
      <ArtistTypes />
      <Testimonials />
      <Pricing />
      <CTA />
    </div>
  );
}
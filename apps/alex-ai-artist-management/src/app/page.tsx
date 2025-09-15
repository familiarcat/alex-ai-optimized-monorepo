"use client";

import { Hero } from "@/components/home/hero";
import { Features } from "@/components/home/features";
import { ArtistTypes } from "@/components/home/artist-types";
import { Testimonials } from "@/components/home/testimonials";
import { Pricing } from "@/components/home/pricing";
import { CTA } from "@/components/home/cta";
import { useStyles } from "@/hooks/useStyles";

export default function HomePage() {
  const styles = useStyles('page');
  
  return (
    <div className={styles.container}>
      <Hero />
      <Features />
      <ArtistTypes />
      <Testimonials />
      <Pricing />
      <CTA />
    </div>
  );
}
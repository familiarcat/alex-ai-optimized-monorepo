import { PricingPage } from "@/components/pricing/pricing-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing - Alex AI Artist Management",
  description: "Choose the perfect plan for your artistic career. Transparent pricing with no hidden fees.",
};

export default function Pricing() {
  return <PricingPage />;
}

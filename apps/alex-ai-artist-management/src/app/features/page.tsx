import { FeaturesPage } from "@/components/features/features-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Features - Alex AI Artist Management",
  description: "Discover all the powerful features and tools available in Alex AI Artist Management Platform",
};

export default function FeaturesPageRoute() {
  return <FeaturesPage />;
}

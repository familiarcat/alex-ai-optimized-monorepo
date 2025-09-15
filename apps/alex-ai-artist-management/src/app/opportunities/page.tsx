import { Opportunities } from "@/components/opportunities/opportunities";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Opportunities - Alex AI Artist Management",
  description: "Discover and apply to performance opportunities that match your artistic profile",
};

export default function OpportunitiesPage() {
  return <Opportunities />;
}

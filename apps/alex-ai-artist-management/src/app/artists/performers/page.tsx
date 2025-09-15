import { PerformersPage } from "@/components/artists/performers-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "For Performers - Alex AI Artist Management",
  description: "Comprehensive tools for performers, actors, dancers, and live entertainment artists to manage their performance careers",
};

export default function PerformersPageRoute() {
  return <PerformersPage />;
}

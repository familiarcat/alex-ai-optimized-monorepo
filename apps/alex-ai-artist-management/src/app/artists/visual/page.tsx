import { VisualArtistsPage } from "@/components/artists/visual-artists-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "For Visual Artists - Alex AI Artist Management",
  description: "Comprehensive tools for visual artists, painters, sculptors, and digital artists to showcase their work and manage gallery exhibitions",
};

export default function VisualArtistsPageRoute() {
  return <VisualArtistsPage />;
}

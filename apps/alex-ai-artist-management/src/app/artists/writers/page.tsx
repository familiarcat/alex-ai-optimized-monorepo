import { WritersPage } from "@/components/artists/writers-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "For Writers - Alex AI Artist Management",
  description: "Tools and features for writers, poets, authors, and literary artists to manage their writing career and book readings",
};

export default function WritersPageRoute() {
  return <WritersPage />;
}

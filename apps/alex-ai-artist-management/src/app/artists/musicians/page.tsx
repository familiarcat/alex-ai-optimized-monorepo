import { MusiciansPage } from "@/components/artists/musicians-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "For Musicians - Alex AI Artist Management",
  description: "Comprehensive tools and features designed specifically for musicians and bands to manage their careers, bookings, and performances",
};

export default function MusiciansPageRoute() {
  return <MusiciansPage />;
}

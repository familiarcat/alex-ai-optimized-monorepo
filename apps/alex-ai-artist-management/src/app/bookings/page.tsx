import { Bookings } from "@/components/bookings/bookings";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bookings - Alex AI Artist Management",
  description: "Manage your performance bookings and scheduling",
};

export default function BookingsPage() {
  return <Bookings />;
}

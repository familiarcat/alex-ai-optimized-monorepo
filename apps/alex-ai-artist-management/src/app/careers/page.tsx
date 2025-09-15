import { CareersPage } from "@/components/careers/careers-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers - Alex AI Artist Management",
  description: "Join our team and help build the future of artist management. Explore open positions and career opportunities.",
};

export default function Careers() {
  return <CareersPage />;
}

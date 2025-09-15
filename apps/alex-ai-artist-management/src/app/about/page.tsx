import { AboutPage } from "@/components/about/about-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us - Alex AI Artist Management",
  description: "Learn about Alex AI Artist Management Platform and our mission to empower artists worldwide",
};

export default function AboutPageRoute() {
  return <AboutPage />;
}

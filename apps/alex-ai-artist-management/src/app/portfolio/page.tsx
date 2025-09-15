import { Portfolio } from "@/components/portfolio/portfolio";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio - Alex AI Artist Management",
  description: "Showcase your work and build your professional artistic brand",
};

export default function PortfolioPage() {
  return <Portfolio />;
}

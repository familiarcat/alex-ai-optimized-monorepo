import { Analytics } from "@/components/analytics/analytics";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Analytics - Alex AI Artist Management",
  description: "Track your career performance and gain insights into your artistic growth",
};

export default function AnalyticsPage() {
  return <Analytics />;
}

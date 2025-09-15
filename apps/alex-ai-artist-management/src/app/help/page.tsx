import { HelpPage } from "@/components/help/help-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Help Center - Alex AI Artist Management",
  description: "Get help and support for Alex AI Artist Management. Find answers, tutorials, and contact our support team.",
};

export default function Help() {
  return <HelpPage />;
}

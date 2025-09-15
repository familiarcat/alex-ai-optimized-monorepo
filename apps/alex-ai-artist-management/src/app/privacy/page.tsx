import { PrivacyPage } from "@/components/privacy/privacy-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - Alex AI Artist Management",
  description: "Learn how Alex AI Artist Management protects and handles your personal information.",
};

export default function Privacy() {
  return <PrivacyPage />;
}

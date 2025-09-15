import { TermsPage } from "@/components/terms/terms-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - Alex AI Artist Management",
  description: "Read our terms of service for Alex AI Artist Management platform.",
};

export default function Terms() {
  return <TermsPage />;
}

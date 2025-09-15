import { ApiPage } from "@/components/api/api-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "API - Alex AI Artist Management",
  description: "Powerful API for integrating Alex AI Artist Management into your applications.",
};

export default function Api() {
  return <ApiPage />;
}

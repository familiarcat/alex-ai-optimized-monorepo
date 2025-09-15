import { DocsPage } from "@/components/docs/docs-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Documentation - Alex AI Artist Management",
  description: "Complete documentation for Alex AI Artist Management. Learn how to use all features and integrations.",
};

export default function Docs() {
  return <DocsPage />;
}

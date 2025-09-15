import { CookiesPage } from "@/components/cookies/cookies-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy - Alex AI Artist Management",
  description: "Learn about how Alex AI Artist Management uses cookies and similar technologies.",
};

export default function Cookies() {
  return <CookiesPage />;
}

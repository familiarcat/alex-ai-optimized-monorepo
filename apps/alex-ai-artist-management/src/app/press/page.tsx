import { PressPage } from "@/components/press/press-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Press - Alex AI Artist Management",
  description: "Latest news, press releases, and media coverage about Alex AI Artist Management.",
};

export default function Press() {
  return <PressPage />;
}

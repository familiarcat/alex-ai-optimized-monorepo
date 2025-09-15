import { CommunityPage } from "@/components/community/community-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community - Alex AI Artist Management",
  description: "Join the Alex AI Artist Management community. Connect with other artists, share experiences, and get support.",
};

export default function Community() {
  return <CommunityPage />;
}

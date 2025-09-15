import { BlogPage } from "@/components/blog/blog-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog - Alex AI Artist Management",
  description: "Latest news, tips, and insights for artists. Learn how to grow your career and make the most of Alex AI.",
};

export default function Blog() {
  return <BlogPage />;
}

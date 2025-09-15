import { ContactPage } from "@/components/contact/contact-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us - Alex AI Artist Management",
  description: "Get in touch with the Alex AI team for support, partnerships, or general inquiries",
};

export default function ContactPageRoute() {
  return <ContactPage />;
}

"use client";

import { Shield, Lock, Eye, UserCheck } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function PrivacyPage() {
  const privacyPrinciples = [
    {
      icon: Shield,
      title: "Data Protection",
      description: "We use industry-standard encryption and security measures to protect your data."
    },
    {
      icon: Lock,
      title: "Secure Storage",
      description: "Your information is stored in secure, encrypted databases with limited access."
    },
    {
      icon: Eye,
      title: "Transparency",
      description: "We clearly explain how we collect, use, and share your information."
    },
    {
      icon: UserCheck,
      title: "Your Control",
      description: "You have full control over your data and can delete it at any time."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Privacy Policy
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Last updated: January 14, 2025
            </p>
          </div>
        </div>
      </div>

      {/* Privacy Principles */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Our Privacy Principles
          </h2>
          <p className="text-gray-600">
            We're committed to protecting your privacy and being transparent about our practices
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {privacyPrinciples.map((principle, index) => (
            <Card key={index} className="text-center">
              <CardContent className="pt-6">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <principle.icon className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {principle.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {principle.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Privacy Policy Content */}
      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Information We Collect</h2>
            <p className="text-gray-600 mb-6">
              We collect information you provide directly to us, such as when you create an account, 
              use our services, or contact us for support. This includes:
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-8 space-y-2">
              <li>Account information (name, email, password)</li>
              <li>Profile information (bio, portfolio, contact details)</li>
              <li>Booking and event information</li>
              <li>Payment and billing information</li>
              <li>Communications with us</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">How We Use Your Information</h2>
            <p className="text-gray-600 mb-6">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-8 space-y-2">
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>Send technical notices and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Develop new products and services</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">Information Sharing</h2>
            <p className="text-gray-600 mb-6">
              We do not sell, trade, or otherwise transfer your personal information to third parties 
              without your consent, except as described in this policy. We may share your information:
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-8 space-y-2">
              <li>With your consent</li>
              <li>To comply with legal obligations</li>
              <li>To protect our rights and safety</li>
              <li>In connection with a business transfer</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">Data Security</h2>
            <p className="text-gray-600 mb-8">
              We implement appropriate security measures to protect your personal information against 
              unauthorized access, alteration, disclosure, or destruction. This includes encryption, 
              secure servers, and regular security audits.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Rights</h2>
            <p className="text-gray-600 mb-6">
              You have the right to:
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-8 space-y-2">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Delete your account and data</li>
              <li>Opt out of marketing communications</li>
              <li>Data portability</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Us</h2>
            <p className="text-gray-600 mb-6">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-900 font-medium">Alex AI Artist Management</p>
              <p className="text-gray-600">Email: privacy@alex-ai.com</p>
              <p className="text-gray-600">Phone: +1 (555) 123-4567</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

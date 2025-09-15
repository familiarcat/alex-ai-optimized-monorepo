"use client";

export function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Terms of Service
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Last updated: January 14, 2025
            </p>
          </div>
        </div>
      </div>

      {/* Terms Content */}
      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">1. Acceptance of Terms</h2>
            <p className="text-gray-600 mb-8">
              By accessing and using Alex AI Artist Management, you accept and agree to be bound by the terms and provision of this agreement.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">2. Use License</h2>
            <p className="text-gray-600 mb-6">
              Permission is granted to temporarily download one copy of Alex AI Artist Management per device for personal, 
              non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-8 space-y-2">
              <li>modify or copy the materials</li>
              <li>use the materials for any commercial purpose or for any public display</li>
              <li>attempt to reverse engineer any software contained on the website</li>
              <li>remove any copyright or other proprietary notations from the materials</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">3. User Accounts</h2>
            <p className="text-gray-600 mb-6">
              When you create an account with us, you must provide information that is accurate, complete, and current at all times. 
              You are responsible for safeguarding the password and for all activities that occur under your account.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">4. Content</h2>
            <p className="text-gray-600 mb-6">
              Our service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, 
              or other material. You are responsible for the content that you post to the service.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">5. Prohibited Uses</h2>
            <p className="text-gray-600 mb-6">
              You may not use our service:
            </p>
            <ul className="list-disc list-inside text-gray-600 mb-8 space-y-2">
              <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
              <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
              <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
              <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
              <li>To submit false or misleading information</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">6. Termination</h2>
            <p className="text-gray-600 mb-8">
              We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, 
              including without limitation if you breach the Terms.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">7. Disclaimer</h2>
            <p className="text-gray-600 mb-8">
              The information on this website is provided on an "as is" basis. To the fullest extent permitted by law, 
              this Company excludes all representations, warranties, conditions and terms relating to our website and the use of this website.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">8. Limitations</h2>
            <p className="text-gray-600 mb-8">
              In no event shall Alex AI Artist Management or its suppliers be liable for any damages (including, without limitation, 
              damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on our website.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">9. Governing Law</h2>
            <p className="text-gray-600 mb-8">
              These terms and conditions are governed by and construed in accordance with the laws of the United States and you irrevocably 
              submit to the exclusive jurisdiction of the courts in that state or location.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">10. Changes to Terms</h2>
            <p className="text-gray-600 mb-8">
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, 
              we will try to provide at least 30 days notice prior to any new terms taking effect.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
            <p className="text-gray-600 mb-6">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-900 font-medium">Alex AI Artist Management</p>
              <p className="text-gray-600">Email: legal@alex-ai.com</p>
              <p className="text-gray-600">Phone: +1 (555) 123-4567</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

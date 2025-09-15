'use client'

import { useState } from 'react'
import { CheckIcon, StarIcon } from '@heroicons/react/24/outline'

interface PricingTier {
  id: string
  name: string
  price: number
  description: string
  features: string[]
  popular?: boolean
  ethicalNotes: string
  crewOversight: string[]
}

const pricingTiers: PricingTier[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: 99,
    description: 'Perfect for individuals starting their AI journey',
    features: [
      'Basic job matching with AI',
      '5 applications per month',
      'Email support',
      'Basic analytics dashboard',
      'Standard AI recommendations'
    ],
    ethicalNotes: 'Affordable entry point for all users',
    crewOversight: ['Counselor Troi - User Experience', 'Dr. Crusher - Health & Safety']
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 299,
    description: 'Advanced AI features for serious professionals',
    features: [
      'Advanced AI matching algorithms',
      'Unlimited applications',
      'Priority support',
      'Advanced analytics dashboard',
      'Custom AI training',
      'API access (limited)',
      'Real-time notifications'
    ],
    popular: true,
    ethicalNotes: 'Clear value proposition with transparent pricing',
    crewOversight: ['Commander Data - Technical Analysis', 'Captain Picard - Strategic Leadership']
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 999,
    description: 'Full AI platform for organizations',
    features: [
      'Custom AI model training',
      'Full API access',
      'Dedicated support team',
      'Advanced analytics & reporting',
      'White-label options',
      'Custom integrations',
      'SLA guarantees',
      'On-premise deployment options'
    ],
    ethicalNotes: 'Enterprise-grade service with full transparency',
    crewOversight: ['All Crew Members - Full Oversight']
  }
]

export default function PricingTiers() {
  const [selectedTier, setSelectedTier] = useState<string>('premium')

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600">
            Ethical AI Pricing
          </h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Transparent Pricing with Crew Oversight
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Our pricing is designed with ethical guidelines and crew oversight to ensure 
            fair value for all users while maintaining sustainable business practices.
          </p>
        </div>

        {/* Ethical Guidelines */}
        <div className="mt-16 bg-green-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-800 mb-4">
            🛡️ Ethical Guidelines
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-green-700">
            <div>• Full transparency in all pricing</div>
            <div>• Maximum 30% profit margin</div>
            <div>• No hidden fees or charges</div>
            <div>• User welfare over profit maximization</div>
            <div>• Regular ethical compliance reviews</div>
            <div>• Continuous user feedback integration</div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {pricingTiers.map((tier) => (
            <div
              key={tier.id}
              className={`relative rounded-2xl border p-8 ${
                tier.popular
                  ? 'border-indigo-600 ring-2 ring-indigo-600'
                  : 'border-gray-200'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center rounded-full bg-indigo-600 px-4 py-1 text-sm font-medium text-white">
                    <StarIcon className="h-4 w-4 mr-1" />
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900">{tier.name}</h3>
                <p className="mt-4 text-sm text-gray-600">{tier.description}</p>
                <p className="mt-6 flex items-baseline justify-center">
                  <span className="text-5xl font-bold tracking-tight text-gray-900">
                    ${tier.price}
                  </span>
                  <span className="ml-1 text-xl font-semibold">/month</span>
                </p>
              </div>

              <ul className="mt-8 space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <CheckIcon className="h-5 w-5 text-indigo-600 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Ethical Notes */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Ethical Note:</strong> {tier.ethicalNotes}
                </p>
              </div>

              {/* Crew Oversight */}
              <div className="mt-4 p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-purple-800">
                  <strong>Crew Oversight:</strong>
                </p>
                <ul className="mt-2 text-xs text-purple-700">
                  {tier.crewOversight.map((crew, index) => (
                    <li key={index}>• {crew}</li>
                  ))}
                </ul>
              </div>

              <button
                className={`mt-8 w-full rounded-md px-3 py-2 text-center text-sm font-semibold ${
                  tier.popular
                    ? 'bg-indigo-600 text-white hover:bg-indigo-500'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
                onClick={() => setSelectedTier(tier.id)}
              >
                {selectedTier === tier.id ? 'Selected' : 'Select Plan'}
              </button>
            </div>
          ))}
        </div>

        {/* Quark's Restraints */}
        <div className="mt-16 bg-yellow-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-4">
            🖖 Quark's Ethical Restraints
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-yellow-700">
            <div>• No aggressive upselling tactics</div>
            <div>• No data exploitation without consent</div>
            <div>• No price gouging or hidden fees</div>
            <div>• Helpful recommendations only</div>
            <div>• Fair pricing based on value delivered</div>
            <div>• Complete transparency in all pricing</div>
          </div>
        </div>

        {/* Additional Services */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Additional Services
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white border rounded-lg p-6 text-center">
              <h4 className="font-semibold text-gray-900">API Calls</h4>
              <p className="text-3xl font-bold text-indigo-600 mt-2">$0.01</p>
              <p className="text-sm text-gray-600 mt-2">Per API call for external integrations</p>
            </div>
            <div className="bg-white border rounded-lg p-6 text-center">
              <h4 className="font-semibold text-gray-900">Data Analytics</h4>
              <p className="text-3xl font-bold text-indigo-600 mt-2">$50</p>
              <p className="text-sm text-gray-600 mt-2">Per advanced analytics report</p>
            </div>
            <div className="bg-white border rounded-lg p-6 text-center">
              <h4 className="font-semibold text-gray-900">AI Optimization</h4>
              <p className="text-3xl font-bold text-indigo-600 mt-2">$200</p>
              <p className="text-sm text-gray-600 mt-2">Per AI model optimization service</p>
            </div>
            <div className="bg-white border rounded-lg p-6 text-center">
              <h4 className="font-semibold text-gray-900">Consulting</h4>
              <p className="text-3xl font-bold text-indigo-600 mt-2">$500</p>
              <p className="text-sm text-gray-600 mt-2">Per hour of AI consulting services</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}












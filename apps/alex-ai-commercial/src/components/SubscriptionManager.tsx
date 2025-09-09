'use client'

import { useState, useEffect } from 'react'
import { CreditCardIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'

interface Subscription {
  id: string
  tier: 'basic' | 'premium' | 'enterprise'
  status: 'active' | 'cancelled' | 'past_due' | 'trialing'
  currentPeriodStart: string
  currentPeriodEnd: string
  cancelAtPeriodEnd: boolean
  price: number
  features: string[]
}

interface UsageStats {
  apiCalls: number
  apiCallsLimit: number
  applications: number
  applicationsLimit: number
  analyticsReports: number
  aiOptimizations: number
}

export default function SubscriptionManager() {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading subscription data
    setTimeout(() => {
      setSubscription({
        id: 'sub_1234567890',
        tier: 'premium',
        status: 'active',
        currentPeriodStart: '2025-09-01',
        currentPeriodEnd: '2025-10-01',
        cancelAtPeriodEnd: false,
        price: 299,
        features: [
          'Advanced AI matching algorithms',
          'Unlimited applications',
          'Priority support',
          'Advanced analytics dashboard',
          'Custom AI training',
          'API access (limited)',
          'Real-time notifications'
        ]
      })

      setUsageStats({
        apiCalls: 1250,
        apiCallsLimit: 10000,
        applications: 45,
        applicationsLimit: -1, // unlimited
        analyticsReports: 3,
        aiOptimizations: 1
      })

      setLoading(false)
    }, 1000)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100'
      case 'cancelled':
        return 'text-red-600 bg-red-100'
      case 'past_due':
        return 'text-yellow-600 bg-yellow-100'
      case 'trialing':
        return 'text-blue-600 bg-blue-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getUsagePercentage = (used: number, limit: number) => {
    if (limit === -1) return 0 // unlimited
    return Math.min((used / limit) * 100, 100)
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            <div className="h-3 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Subscription Management
            </h2>
            <p className="text-sm text-gray-600">
              Manage your Alex AI subscription and usage
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(subscription?.status || '')}`}>
              {subscription?.status?.replace('_', ' ').toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Current Plan */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Current Plan</h3>
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-xl font-semibold text-gray-900 capitalize">
                  {subscription?.tier} Plan
                </h4>
                <p className="text-2xl font-bold text-indigo-600">
                  ${subscription?.price}/month
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Next billing date</p>
                <p className="font-medium text-gray-900">
                  {subscription?.currentPeriodEnd ? new Date(subscription.currentPeriodEnd).toLocaleDateString() : ''}
                </p>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
              {subscription?.features.map((feature, index) => (
                <div key={index} className="flex items-center text-sm text-gray-600">
                  <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  {feature}
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex space-x-4">
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                Upgrade Plan
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50">
                Manage Billing
              </button>
              {subscription?.cancelAtPeriodEnd ? (
                <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                  Reactivate Subscription
                </button>
              ) : (
                <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                  Cancel Subscription
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Usage Statistics */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Usage Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* API Calls */}
            <div className="bg-white border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-900">API Calls</h4>
                <CreditCardIcon className="h-5 w-5 text-gray-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {usageStats?.apiCalls.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">
                of {usageStats?.apiCallsLimit === -1 ? '∞' : usageStats?.apiCallsLimit.toLocaleString()} calls
              </div>
              {usageStats?.apiCallsLimit !== -1 && (
                <div className="mt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{ width: `${getUsagePercentage(usageStats?.apiCalls || 0, usageStats?.apiCallsLimit || 0)}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Applications */}
            <div className="bg-white border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-900">Applications</h4>
                <CheckCircleIcon className="h-5 w-5 text-gray-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {usageStats?.applications}
              </div>
              <div className="text-sm text-gray-600">
                {usageStats?.applicationsLimit === -1 ? 'Unlimited' : `of ${usageStats?.applicationsLimit} applications`}
              </div>
            </div>

            {/* Analytics Reports */}
            <div className="bg-white border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-900">Analytics Reports</h4>
                <ExclamationTriangleIcon className="h-5 w-5 text-gray-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {usageStats?.analyticsReports}
              </div>
              <div className="text-sm text-gray-600">
                $50 each
              </div>
            </div>

            {/* AI Optimizations */}
            <div className="bg-white border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-900">AI Optimizations</h4>
                <ExclamationTriangleIcon className="h-5 w-5 text-gray-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {usageStats?.aiOptimizations}
              </div>
              <div className="text-sm text-gray-600">
                $200 each
              </div>
            </div>
          </div>
        </div>

        {/* Ethical Guidelines */}
        <div className="bg-green-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-800 mb-4">
            🛡️ Ethical Subscription Guidelines
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-green-700">
            <div>• Transparent pricing with no hidden fees</div>
            <div>• Fair usage limits with clear communication</div>
            <div>• Easy cancellation and plan changes</div>
            <div>• Pro-rated refunds for unused time</div>
            <div>• No automatic renewals without consent</div>
            <div>• Regular ethical compliance reviews</div>
          </div>
        </div>

        {/* Quark's Restraints */}
        <div className="mt-6 bg-yellow-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-4">
            🖖 Quark's Ethical Restraints
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-yellow-700">
            <div>• No surprise charges or hidden fees</div>
            <div>• No aggressive upselling tactics</div>
            <div>• No data exploitation without consent</div>
            <div>• Helpful recommendations only</div>
            <div>• Fair pricing based on value delivered</div>
            <div>• Complete transparency in all billing</div>
          </div>
        </div>
      </div>
    </div>
  )
}

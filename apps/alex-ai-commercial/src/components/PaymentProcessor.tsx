'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { CreditCardIcon, LockClosedIcon } from '@heroicons/react/24/outline'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface PaymentFormProps {
  tier: 'basic' | 'premium' | 'enterprise'
  price: number
  onSuccess: () => void
  onError: (error: string) => void
}

function PaymentForm({ tier, price, onSuccess, onError }: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setLoading(true)
    setError(null)

    const cardElement = elements.getElement(CardElement)

    if (!cardElement) {
      setError('Card element not found')
      setLoading(false)
      return
    }

    try {
      // Create payment method
      const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      })

      if (pmError) {
        setError(pmError.message || 'Payment method creation failed')
        setLoading(false)
        return
      }

      // Create subscription
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentMethodId: paymentMethod.id,
          tier,
          price,
        }),
      })

      const { error: subscriptionError, subscription } = await response.json()

      if (subscriptionError) {
        setError(subscriptionError)
        setLoading(false)
        return
      }

      // Confirm payment
      const { error: confirmError } = await stripe.confirmCardPayment(
        subscription.client_secret
      )

      if (confirmError) {
        setError(confirmError.message || 'Payment confirmation failed')
        setLoading(false)
        return
      }

      onSuccess()
    } catch (err) {
      setError('An unexpected error occurred')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Information
        </label>
        <div className="border border-gray-300 rounded-md p-3">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-900">Plan</span>
          <span className="text-sm text-gray-600 capitalize">{tier}</span>
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-900">Price</span>
          <span className="text-sm text-gray-600">${price}/month</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-900">Billing</span>
          <span className="text-sm text-gray-600">Monthly</span>
        </div>
      </div>

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
        ) : (
          <CreditCardIcon className="h-4 w-4 mr-2" />
        )}
        {loading ? 'Processing...' : `Subscribe for $${price}/month`}
      </button>

      <div className="flex items-center justify-center text-xs text-gray-500">
        <LockClosedIcon className="h-4 w-4 mr-1" />
        Secure payment powered by Stripe
      </div>
    </form>
  )
}

interface PaymentProcessorProps {
  tier: 'basic' | 'premium' | 'enterprise'
  price: number
  onSuccess: () => void
  onError: (error: string) => void
}

export default function PaymentProcessor({ tier, price, onSuccess, onError }: PaymentProcessorProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Complete Your Subscription
        </h2>
        <p className="text-gray-600">
          Join thousands of professionals using Alex AI
        </p>
      </div>

      <Elements stripe={stripePromise}>
        <PaymentForm
          tier={tier}
          price={price}
          onSuccess={onSuccess}
          onError={onError}
        />
      </Elements>

      {/* Ethical Guidelines */}
      <div className="mt-6 bg-green-50 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-green-800 mb-2">
          🛡️ Ethical Payment Guarantee
        </h3>
        <ul className="text-xs text-green-700 space-y-1">
          <li>• No hidden fees or charges</li>
          <li>• Cancel anytime with 30-day money-back guarantee</li>
          <li>• Transparent pricing with full disclosure</li>
          <li>• Secure payment processing with Stripe</li>
        </ul>
      </div>

      {/* Quark's Restraints */}
      <div className="mt-4 bg-yellow-50 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-yellow-800 mb-2">
          🖖 Quark's Ethical Restraints
        </h3>
        <ul className="text-xs text-yellow-700 space-y-1">
          <li>• No aggressive upselling tactics</li>
          <li>• Fair pricing based on value delivered</li>
          <li>• Complete transparency in all transactions</li>
          <li>• User welfare over profit maximization</li>
        </ul>
      </div>
    </div>
  )
}




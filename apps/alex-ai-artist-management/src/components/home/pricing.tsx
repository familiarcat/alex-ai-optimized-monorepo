import { Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Pricing() {
  const plans = [
    {
      name: "Starter",
      price: "Free",
      description: "Perfect for emerging artists getting started",
      features: [
        "Basic profile and portfolio",
        "Up to 5 booking requests per month",
        "Basic analytics dashboard",
        "Email support",
        "Mobile app access"
      ],
      cta: "Get Started",
      popular: false
    },
    {
      name: "Professional",
      price: "$29",
      period: "/month",
      description: "Ideal for active artists building their career",
      features: [
        "Advanced profile and portfolio",
        "Unlimited booking requests",
        "Advanced analytics and insights",
        "Priority support",
        "Calendar integration",
        "Payment processing",
        "AI-powered recommendations",
        "Custom branding"
      ],
      cta: "Start Free Trial",
      popular: true
    },
    {
      name: "Enterprise",
      price: "$99",
      period: "/month",
      description: "For established artists and collectives",
      features: [
        "Everything in Professional",
        "Team collaboration tools",
        "Advanced financial tracking",
        "Custom integrations",
        "Dedicated account manager",
        "White-label options",
        "API access",
        "Custom reporting"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent
            <span className="block text-blue-600">Pricing</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the plan that fits your artistic career stage. 
            Upgrade or downgrade anytime as your needs change.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl p-8 border-2 transition-all duration-300 ${
                plan.popular
                  ? "border-blue-500 shadow-xl scale-105"
                  : "border-gray-200 hover:border-gray-300 hover:shadow-lg"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center space-x-1">
                    <Star className="w-4 h-4" />
                    <span>Most Popular</span>
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <div className="flex items-baseline justify-center mb-4">
                  <span className="text-4xl font-bold text-gray-900">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-gray-600 ml-1">{plan.period}</span>
                  )}
                </div>
                <p className="text-gray-600">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start space-x-3">
                    <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full ${
                  plan.popular
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-900 hover:bg-gray-800"
                }`}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="bg-white rounded-xl p-8 border border-gray-200 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Need a custom solution?
            </h3>
            <p className="text-gray-600 mb-6">
              We offer custom plans for large collectives, educational institutions, 
              and organizations managing multiple artists.
            </p>
            <Button variant="outline" size="lg">
              Contact Our Sales Team
            </Button>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            All plans include a 14-day free trial. No credit card required to start.
            Cancel anytime.
          </p>
        </div>
      </div>
    </section>
  );
}

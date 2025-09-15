import { 
  Calendar, 
  Users, 
  TrendingUp, 
  Shield, 
  Smartphone, 
  Zap,
  BarChart3,
  Globe,
  MessageSquare,
  CreditCard
} from "lucide-react";

export function Features() {
  const features = [
    {
      icon: Calendar,
      title: "Smart Booking System",
      description: "AI-powered matching that finds opportunities that align with your art and values. No more endless applications to venues that don't get it."
    },
    {
      icon: Users,
      title: "Portfolio That Shines",
      description: "Showcase your work in a way that's authentic to your artistic vision. Clean, professional, and uniquely yours."
    },
    {
      icon: TrendingUp,
      title: "Meaningful Analytics",
      description: "Track what actually matters: real bookings, genuine engagement, and the impact your art has on people's lives."
    },
    {
      icon: Shield,
      title: "Reliable Payments",
      description: "Secure, on-time payments with transparent tracking. Focus on your art, not chasing down payments."
    },
    {
      icon: Smartphone,
      title: "Art on the Go",
      description: "Manage your entire artistic career from anywhere. Because inspiration strikes when it wants to, not when you're at your desk."
    },
    {
      icon: Zap,
      title: "AI That Understands Art",
      description: "Machine learning designed by artists, for artists. Recommendations that actually make sense for your creative journey."
    },
    {
      icon: BarChart3,
      title: "Financial Clarity",
      description: "Simple, clear financial tracking that helps you understand your income and plan for your future as an artist."
    },
    {
      icon: Globe,
      title: "Global Community",
      description: "Connect with venues, artists, and opportunities worldwide. Your art deserves to be seen everywhere."
    },
    {
      icon: MessageSquare,
      title: "Direct Communication",
      description: "Connect directly with venues, fans, and collaborators. Build real relationships, not just transactions."
    },
    {
      icon: CreditCard,
      title: "Fair Pricing",
      description: "Plans that grow with your career. Free for emerging artists, fair rates for established ones. We're in this together."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to
            <span className="block text-blue-600">Thrive as an Artist</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Built by artists who understand the struggle. Tools that actually work, 
            community that actually supports, and opportunities that actually pay.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {feature.title}
                </h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-700 px-6 py-3 rounded-full">
            <Zap className="w-5 h-5" />
            <span className="font-medium">
              Powered by Alex AI - Built for artists, by artists
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

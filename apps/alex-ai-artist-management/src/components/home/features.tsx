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
      title: "Smart Booking Management",
      description: "AI-powered booking system that matches you with perfect opportunities and automates the entire booking process."
    },
    {
      icon: Users,
      title: "Artist Portfolio Showcase",
      description: "Create stunning portfolios that adapt to your art form, from music samples to visual galleries and written works."
    },
    {
      icon: TrendingUp,
      title: "Career Analytics",
      description: "Track your growth with detailed analytics on bookings, revenue, audience engagement, and career milestones."
    },
    {
      icon: Shield,
      title: "Secure Payments",
      description: "Handle all financial transactions securely with integrated payment processing and automated invoicing."
    },
    {
      icon: Smartphone,
      title: "Mobile-First Design",
      description: "Access your career management tools anywhere with our responsive mobile app and offline capabilities."
    },
    {
      icon: Zap,
      title: "AI-Powered Insights",
      description: "Get personalized recommendations for opportunities, pricing strategies, and career development paths."
    },
    {
      icon: BarChart3,
      title: "Financial Tracking",
      description: "Comprehensive financial management with expense tracking, tax preparation, and revenue forecasting."
    },
    {
      icon: Globe,
      title: "Global Opportunities",
      description: "Access to international booking opportunities and connect with venues and promoters worldwide."
    },
    {
      icon: MessageSquare,
      title: "Communication Hub",
      description: "Streamlined communication with venues, fans, and collaborators through integrated messaging and notifications."
    },
    {
      icon: CreditCard,
      title: "Flexible Pricing",
      description: "Choose from free, premium, and enterprise plans that scale with your career and artistic needs."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to
            <span className="block text-blue-600">Manage Your Art Career</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our comprehensive platform provides all the tools artists need to 
            succeed, from booking management to financial tracking and career growth.
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
              Powered by Alex AI - The future of artist management
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

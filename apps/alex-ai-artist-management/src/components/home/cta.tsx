import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Calendar, TrendingUp } from "lucide-react";

export function CTA() {
  const stats = [
    { icon: Users, value: "10,000+", label: "Active Artists" },
    { icon: Calendar, value: "50,000+", label: "Bookings Made" },
    { icon: TrendingUp, value: "150%", label: "Avg. Revenue Growth" }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to Transform Your
            <span className="block">Artistic Career?</span>
          </h2>
          
          <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto">
            Join thousands of artists who are already using Alex AI to manage their careers, 
            book gigs, and grow their artistic presence. Start your journey today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4"
            >
              Start Your Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-4"
            >
              Schedule a Demo
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-3">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-blue-100">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-blue-100">
            <p className="text-sm">
              Join artists from 50+ countries • No credit card required • Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

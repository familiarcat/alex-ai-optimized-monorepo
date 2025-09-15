import { Star, Quote } from "lucide-react";

export function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Jazz Pianist",
      location: "New York, NY",
      content: "Alex AI Artist Management has revolutionized how I book gigs. The AI recommendations have helped me discover venues I never knew existed, and my booking success rate has increased by 300%.",
      rating: 5,
      avatar: "SC"
    },
    {
      name: "Marcus Rodriguez",
      role: "Visual Artist",
      location: "Los Angeles, CA",
      content: "The portfolio management features are incredible. I can showcase my work professionally and book gallery shows with ease. The financial tracking has made my business so much more organized.",
      rating: 5,
      avatar: "MR"
    },
    {
      name: "Emily Watson",
      role: "Poet & Author",
      location: "Portland, OR",
      content: "As a writer, I never thought I'd find a platform that understood my needs. The reading booking system and literary event management have opened doors I didn't know were there.",
      rating: 5,
      avatar: "EW"
    },
    {
      name: "David Kim",
      role: "DJ & Producer",
      location: "Miami, FL",
      content: "The club booking system is game-changing. I can track my performance data, manage my music library, and connect with promoters seamlessly. My bookings have doubled since joining.",
      rating: 5,
      avatar: "DK"
    },
    {
      name: "Lisa Thompson",
      role: "Photographer",
      location: "Chicago, IL",
      content: "The client management and shoot booking features have streamlined my entire business. I can focus on what I love - taking photos - while the platform handles the business side.",
      rating: 5,
      avatar: "LT"
    },
    {
      name: "James Wilson",
      role: "Theater Performer",
      location: "Seattle, WA",
      content: "The audition management and performance tracking tools are exactly what I needed. I can manage my entire performing career from one platform, and the AI insights help me make better career decisions.",
      rating: 5,
      avatar: "JW"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Loved by Artists
            <span className="block text-blue-600">Worldwide</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how Alex AI Artist Management is transforming careers across all artistic disciplines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              
              <Quote className="w-8 h-8 text-blue-200 mb-4" />
              
              <p className="text-gray-700 mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>
              
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {testimonial.role}
                  </p>
                  <p className="text-sm text-gray-500">
                    {testimonial.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Join thousands of successful artists
            </h3>
            <p className="text-gray-600 mb-6">
              Start your journey with Alex AI Artist Management today and see why artists worldwide trust us with their careers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                Start Free Trial
              </button>
              <button className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors">
                View Success Stories
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

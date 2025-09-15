import { Music, Palette, BookOpen, Mic, Camera, Scissors, Theater, Code } from "lucide-react";

export function ArtistTypes() {
  const artistTypes = [
    {
      icon: Music,
      title: "Musicians & Bands",
      description: "Book gigs, manage setlists, track royalties, and connect with venues worldwide.",
      features: ["Live Performance Booking", "Music Distribution", "Fan Management", "Revenue Tracking"]
    },
    {
      icon: Palette,
      title: "Visual Artists",
      description: "Showcase your work, book gallery shows, manage commissions, and sell your art.",
      features: ["Portfolio Showcase", "Gallery Bookings", "Commission Management", "Art Sales"]
    },
    {
      icon: BookOpen,
      title: "Writers & Poets",
      description: "Book readings, manage publications, track royalties, and build your literary presence.",
      features: ["Reading Bookings", "Publication Management", "Literary Events", "Writing Submissions"]
    },
    {
      icon: Mic,
      title: "DJs & Electronic Artists",
      description: "Book club nights, manage music library, connect with promoters, and track performance data.",
      features: ["Club Bookings", "Music Library", "Event Management", "Performance Analytics"]
    },
    {
      icon: Camera,
      title: "Photographers",
      description: "Book shoots, manage galleries, handle licensing, and build your photography business.",
      features: ["Shoot Bookings", "Gallery Management", "Licensing", "Client Portals"]
    },
    {
      icon: Theater,
      title: "Performers",
      description: "Book performances, manage auditions, track gigs, and grow your performing career.",
      features: ["Performance Bookings", "Audition Management", "Talent Agencies", "Performance Tracking"]
    },
    {
      icon: Scissors,
      title: "Artisan Craftspeople",
      description: "Book craft shows, manage workshops, sell products, and build your artisan business.",
      features: ["Craft Show Bookings", "Workshop Management", "Product Sales", "Skill Showcase"]
    },
    {
      icon: Code,
      title: "Digital Artists",
      description: "Manage commissions, showcase digital work, book speaking engagements, and monetize your skills.",
      features: ["Commission Management", "Digital Portfolio", "Speaking Engagements", "Skill Monetization"]
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Built for Every Type of
            <span className="block text-purple-600">Creative Professional</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Whether you're a musician, visual artist, writer, or any other type of creative professional, 
            our platform adapts to your unique needs and career goals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {artistTypes.map((type, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <type.icon className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {type.title}
                </h3>
              </div>
              
              <p className="text-gray-600 mb-4 text-sm">
                {type.description}
              </p>
              
              <ul className="space-y-2">
                {type.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center space-x-2 text-sm text-gray-500">
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Don't see your art form?
            </h3>
            <p className="text-gray-600 mb-6">
              Our platform is designed to be flexible and adaptable. Contact us to learn 
              how we can customize the experience for your specific artistic discipline.
            </p>
            <button className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors">
              Request Customization
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

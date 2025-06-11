import { ShieldCheckIcon, ChartBarIcon, CubeTransparentIcon } from '@heroicons/react/24/outline';

export default function About() {
  const features = [
    {
      icon: ShieldCheckIcon,
      title: "Trusted Solutions",
      description: "With over a decade of experience, we've helped hundreds of companies optimize their supply chain operations."
    },
    {
      icon: ChartBarIcon,
      title: "Data-Driven Decisions",
      description: "Our analytics-powered platform helps you make informed decisions based on real-time supply chain data."
    },
    {
      icon: CubeTransparentIcon,
      title: "End-to-End Visibility",
      description: "Get complete visibility into your supply chain from manufacturers to end customers."
    }
  ];

  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            About <span className="text-blue-600">ChainFlow</span>
          </h1>
          <p className="text-xl text-gray-600">
            We're revolutionizing supply chain management through innovative 
            technology solutions and expert consultation.
          </p>
        </div>

        {/* Mission Statement */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed">
            At ChainFlow, our mission is to empower businesses with intelligent supply chain 
            solutions that drive efficiency, reduce costs, and promote sustainability. 
            We believe in creating transparent, resilient, and adaptable supply chains 
            that help businesses thrive in today's dynamic global market.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <feature.icon className="h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Company Stats */}
        <div className="bg-blue-600 rounded-lg shadow-md p-8 text-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-100">Clients Worldwide</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10+</div>
              <div className="text-blue-100">Years Experience</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">Support Available</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
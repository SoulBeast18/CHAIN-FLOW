function Blog() {
  const blogPosts = [
    {
      title: "Digital Supply Chain Transformation in 2025",
      excerpt: "Discover how AI and blockchain are revolutionizing supply chain operations and driving efficiency.",
      imageUrl: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&q=80",
      author: "Sarah Johnson",
      date: "May 1, 2025",
      link: "https://www.supplychaindigital.com/articles"
    },
    {
      title: "Sustainable Supply Chain Practices",
      excerpt: "Learn how companies are implementing eco-friendly practices in their supply chain operations.",
      imageUrl: "https://images.unsplash.com/photo-1473876988266-ca0860a443b8?auto=format&fit=crop&q=80",
      author: "Michael Chen",
      date: "April 28, 2025",
      link: "https://www.logisticsmgmt.com/articles"
    },
    {
      title: "Risk Management in Global Supply Chains",
      excerpt: "Strategies for identifying and mitigating risks in international supply chain operations.",
      imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80",
      author: "Emily Roberts",
      date: "April 25, 2025",
      link: "https://www.scmr.com/articles"
    }
  ];

  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Latest Insights from <span className="text-blue-600">ChainFlow</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <a 
              key={index} 
              href={post.link}
              target="_blank"
              rel="noopener noreferrer" 
              className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative h-48">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {post.excerpt}
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <span>{post.author}</span>
                  <span className="mx-2">•</span>
                  <span>{post.date}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Blog;
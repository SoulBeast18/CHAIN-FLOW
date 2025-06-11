import { useState } from 'react';
import { EnvelopeIcon, UserIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';

export default function Contact() {
  const [emailFormData, setEmailFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [feedbackFormData, setFeedbackFormData] = useState({
    rating: '5',
    category: 'general',
    feedback: ''
  });

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    console.log('Email inquiry:', emailFormData);
    alert('Thank you for your email! We will get back to you soon.');
    setEmailFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    console.log('Feedback submission:', feedbackFormData);
    alert('Thank you for your feedback! We appreciate your input.');
    setFeedbackFormData({ rating: '5', category: 'general', feedback: '' });
  };

  const handleEmailChange = (e) => {
    setEmailFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleFeedbackChange = (e) => {
    setFeedbackFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
            Contact Us
          </h1>
          <p className="text-center text-gray-600 mb-12">
            Have questions or feedback? We'd love to hear from you.
          </p>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Get in Touch</h2>
              <div className="space-y-4">
                <p className="flex items-center text-gray-600">
                  <EnvelopeIcon className="h-5 w-5 mr-2" />
                  contact@chainflow.com
                </p>
                <p className="flex items-center text-gray-600">
                  <ChatBubbleLeftIcon className="h-5 w-5 mr-2" />
                  +1 (555) 123-4567
                </p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Office Location</h2>
              <p className="text-gray-600">
                123 Business Street<br />
                New York, NY 10001<br />
                United States
              </p>
            </div>
          </div>

          {/* Two Forms Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Email Inquiry Form */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-6 text-gray-900">Send us an Email</h2>
              <form onSubmit={handleEmailSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name
                  </label>
                  <div className="relative">
                    <UserIcon className="h-5 w-5 text-gray-400 absolute top-3 left-3" />
                    <input
                      type="text"
                      name="name"
                      id="name"
                      required
                      className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="John Doe"
                      value={emailFormData.name}
                      onChange={handleEmailChange}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400 absolute top-3 left-3" />
                    <input
                      type="email"
                      name="email"
                      id="email"
                      required
                      className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="john@example.com"
                      value={emailFormData.email}
                      onChange={handleEmailChange}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    id="subject"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="How can we help?"
                    value={emailFormData.subject}
                    onChange={handleEmailChange}
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    name="message"
                    id="message"
                    required
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your message..."
                    value={emailFormData.message}
                    onChange={handleEmailChange}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Send Email
                </button>
              </form>
            </div>

            {/* Feedback Form */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-6 text-gray-900">Share Your Feedback</h2>
              <form onSubmit={handleFeedbackSubmit} className="space-y-6">
                <div>
                  <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">
                    Rating
                  </label>
                  <select
                    name="rating"
                    id="rating"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={feedbackFormData.rating}
                    onChange={handleFeedbackChange}
                  >
                    <option value="5">★★★★★ Excellent</option>
                    <option value="4">★★★★☆ Good</option>
                    <option value="3">★★★☆☆ Average</option>
                    <option value="2">★★☆☆☆ Fair</option>
                    <option value="1">★☆☆☆☆ Poor</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    name="category"
                    id="category"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={feedbackFormData.category}
                    onChange={handleFeedbackChange}
                  >
                    <option value="general">General</option>
                    <option value="product">Product</option>
                    <option value="service">Service</option>
                    <option value="support">Support</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Feedback
                  </label>
                  <textarea
                    name="feedback"
                    id="feedback"
                    required
                    rows="8"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Please share your experience with us..."
                    value={feedbackFormData.feedback}
                    onChange={handleFeedbackChange}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Submit Feedback
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Users, Calendar } from 'lucide-react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      alert('Thank you for your message! We\'ll get back to you within 24 hours.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setSubmitting(false);
    }, 1000);
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-200 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Contact Us
          </h1>
          <p className="text-xl text-gray-600">
            Have questions? We'd love to hear from you and help you get started.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Get in Touch
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Whether you have questions about our classes, want to learn more about our approach, or need help with registration, we're here to help. Reach out and we'll get back to you as soon as possible.
                </p>
              </div>

              {/* Contact Details */}
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-blue-100 p-3 rounded-lg mr-4">
                    <Mail className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Email</h3>
                    <p className="text-gray-600">gallantgaveliers@gmail.com</p>
                    <p className="text-sm text-gray-500 mt-1">We typically respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-orange-100 p-3 rounded-lg mr-4">
                    <MessageSquare className="h-6 w-6 text-secondary-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">General Questions</h3>
                    <p className="text-gray-600">Ask about classes, schedules, or our programs</p>
                    <p className="text-sm text-gray-500 mt-1">Perfect for getting started</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-green-100 p-3 rounded-lg mr-4">
                    <MapPin className="h-6 w-6 text-accent-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Location</h3>
                    <p className="text-gray-600">Classes offered both in-person and online</p>
                    <p className="text-sm text-gray-500 mt-1">Flexible options to fit your needs</p>
                  </div>
                </div>
              </div>

              {/* Office Hours */}
              <div className="bg-primary-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Response Times</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">General inquiries:</span>
                    <span className="font-medium">Within 24 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Registration support:</span>
                    <span className="font-medium">Same day</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Urgent matters:</span>
                    <span className="font-medium">Within 4 hours</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Your full name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Select a topic...</option>
                    <option value="general">General Information</option>
                    <option value="classes">Class Information</option>
                    <option value="registration">Registration Help</option>
                    <option value="one-on-one">1-on-1 Coaching</option>
                    <option value="events">Events & Workshops</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
                >
                  {submitting ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Send className="h-5 w-5 mr-2" />
                  )}
                  {submitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">
              Quick answers to common questions
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <Users className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center">How do I register for classes?</h3>
              <p className="text-gray-600">Visit our Register page, select your preferred class, complete the form, and proceed to payment. You'll receive confirmation within minutes.</p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md">
              <Calendar className="h-12 w-12 text-secondary-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center">What age groups do you serve?</h3>
              <p className="text-gray-600">We offer programs for children (4-5 PM classes) and youth through high school (5:30-6:45 PM classes). Each program is age-appropriate.</p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md">
              <MessageSquare className="h-12 w-12 text-accent-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center">Are classes offered online?</h3>
              <p className="text-gray-600">Yes! We offer both in-person and online options. Wednesday classes are via Zoom, while others are primarily in-person with online alternatives available.</p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md">
              <Mail className="h-12 w-12 text-neutral-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center">What's your refund policy?</h3>
              <p className="text-gray-600">Full refund available up to 24 hours before the first class. After that, refunds are pro-rated based on remaining sessions.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
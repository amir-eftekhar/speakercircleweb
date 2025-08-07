import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Mail, Calendar, ArrowRight } from 'lucide-react';

const Confirmation: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Success Header */}
      <section className="bg-gradient-to-br from-green-50 to-blue-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Registration Submitted!
          </h1>
          <p className="text-xl text-gray-600">
            Thank you for registering with SpeakersCircle. We'll be in touch soon!
          </p>
        </div>
      </section>

      {/* Next Steps */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-50 rounded-xl p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">What Happens Next?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Confirmation Email</h4>
                <p className="text-sm text-gray-600">
                  You'll receive a confirmation email with next steps and payment instructions within 24 hours.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Class Schedule</h4>
                <p className="text-sm text-gray-600">
                  We'll send you the class schedule and meeting information once payment is confirmed.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Start Learning</h4>
                <p className="text-sm text-gray-600">
                  Begin your journey to becoming a confident communicator and leader!
                </p>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="text-center mt-8">
            <p className="text-gray-600 mb-4">
              Questions about your registration? We're here to help!
            </p>
            <div className="space-x-4">
              <Link
                to="/contact"
                className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors inline-flex items-center"
              >
                Contact Us
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                to="/"
                className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Return Home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Confirmation;
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, BookOpen, Clock, MessageSquare, CheckCircle, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

const OneOnOneInterest: React.FC = () => {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    student_name: '',
    parent_name: '',
    parent_email: '',
    student_email: '',
    preferred_subject: '',
    goals: '',
    availability: '',
    preferred_mode: '',
    additional_notes: ''
  });

  const subjects = [
    'English',
    'Coding',
    'Debate',
    'Interview Prep',
    'Resume Boost',
    'College Counseling'
  ];

  const modes = [
    'In-person',
    'Zoom',
    'Either'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Validate required fields
      const requiredFields = ['student_name', 'parent_name', 'parent_email', 'student_email', 'preferred_subject', 'goals', 'availability', 'preferred_mode'];
      for (const field of requiredFields) {
        if (!formData[field as keyof typeof formData].trim()) {
          throw new Error(`${field.replace('_', ' ')} is required`);
        }
      }

      console.log('Creating 1-on-1 request with data:', formData);

      // Create 1-on-1 request record
      const { error } = await supabase
        .from('one_on_one_requests')
        .insert([{
          student_name: formData.student_name.trim(),
          parent_name: formData.parent_name.trim(),
          parent_email: formData.parent_email.trim(),
          student_email: formData.student_email.trim(),
          preferred_subject: formData.preferred_subject,
          goals: formData.goals.trim(),
          availability: formData.availability.trim(),
          preferred_mode: formData.preferred_mode,
          additional_notes: formData.additional_notes.trim() || null,
          status: 'pending'
        }]);

      if (error) {
        console.error('1-on-1 request creation error:', error);
        throw new Error(`Database error: ${error.message}. Details: ${JSON.stringify(error)}`);
      }

      console.log('1-on-1 request created successfully');
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting 1-on-1 request:', error);
      alert(error instanceof Error ? error.message : 'There was an error submitting your request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white min-h-screen">
        {/* Success Header */}
        <section className="bg-gradient-to-br from-green-50 to-blue-50 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Interest Form Submitted!
            </h1>
            <p className="text-xl text-gray-600">
              Thank you for your interest in 1-on-1 coaching. We'll review your request and contact you within 24-48 hours.
            </p>
          </div>
        </section>

        {/* Next Steps */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-blue-50 rounded-xl p-8 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">What Happens Next?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Review & Contact</h4>
                  <p className="text-sm text-gray-600">
                    We'll review your request and contact you within 24-48 hours to discuss your goals and schedule.
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Schedule Session</h4>
                  <p className="text-sm text-gray-600">
                    We'll work with your availability to schedule your first 1-on-1 coaching session.
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="h-6 w-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Start Learning</h4>
                  <p className="text-sm text-gray-600">
                    Begin your personalized learning journey with customized instruction tailored to your goals.
                  </p>
                </div>
              </div>
            </div>

            {/* Request Summary */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Request Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Student Information</h4>
                  <p className="text-gray-600">Name: {formData.student_name}</p>
                  <p className="text-gray-600">Email: {formData.student_email}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Parent/Guardian</h4>
                  <p className="text-gray-600">Name: {formData.parent_name}</p>
                  <p className="text-gray-600">Email: {formData.parent_email}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Session Details</h4>
                  <p className="text-gray-600">Subject: {formData.preferred_subject}</p>
                  <p className="text-gray-600">Mode: {formData.preferred_mode}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Availability</h4>
                  <p className="text-gray-600">{formData.availability}</p>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                Questions about your request? We're here to help!
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
  }

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-200 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            1-on-1 Coaching Interest Form
          </h1>
          <p className="text-xl text-gray-600">
            Tell us about your learning goals and we'll create a personalized coaching plan
          </p>
        </div>
      </section>

      {/* Interest Form */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Interest Form
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Student Information */}
                <div className="border-b pb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <User className="h-5 w-5 mr-2 text-primary-600" />
                    Student Information
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="student_name" className="block text-sm font-medium text-gray-700 mb-2">
                        Student Name *
                      </label>
                      <input
                        type="text"
                        id="student_name"
                        name="student_name"
                        required
                        value={formData.student_name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Enter student's full name"
                      />
                    </div>

                    <div>
                      <label htmlFor="student_email" className="block text-sm font-medium text-gray-700 mb-2">
                        Student Email *
                      </label>
                      <input
                        type="email"
                        id="student_email"
                        name="student_email"
                        required
                        value={formData.student_email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="student@example.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Parent Information */}
                <div className="border-b pb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <User className="h-5 w-5 mr-2 text-secondary-600" />
                    Parent/Guardian Information
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="parent_name" className="block text-sm font-medium text-gray-700 mb-2">
                        Parent/Guardian Name *
                      </label>
                      <input
                        type="text"
                        id="parent_name"
                        name="parent_name"
                        required
                        value={formData.parent_name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Enter parent/guardian full name"
                      />
                    </div>

                    <div>
                      <label htmlFor="parent_email" className="block text-sm font-medium text-gray-700 mb-2">
                        Parent/Guardian Email *
                      </label>
                      <input
                        type="email"
                        id="parent_email"
                        name="parent_email"
                        required
                        value={formData.parent_email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="parent@example.com"
                      />
                    </div>
                  </div>
                </div>

                {/* Session Preferences */}
                <div className="border-b pb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <BookOpen className="h-5 w-5 mr-2 text-accent-600" />
                    Session Preferences
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="preferred_subject" className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Subject *
                      </label>
                      <select
                        id="preferred_subject"
                        name="preferred_subject"
                        required
                        value={formData.preferred_subject}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="">Select a subject...</option>
                        {subjects.map(subject => (
                          <option key={subject} value={subject}>
                            {subject}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="preferred_mode" className="block text-sm font-medium text-gray-700 mb-2">
                        Preferred Mode *
                      </label>
                      <select
                        id="preferred_mode"
                        name="preferred_mode"
                        required
                        value={formData.preferred_mode}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        <option value="">Select mode...</option>
                        {modes.map(mode => (
                          <option key={mode} value={mode}>
                            {mode}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="goals" className="block text-sm font-medium text-gray-700 mb-2">
                        Learning Goals *
                      </label>
                      <textarea
                        id="goals"
                        name="goals"
                        required
                        rows={4}
                        value={formData.goals}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                        placeholder="What do you hope to learn or improve? Be specific about your goals..."
                      />
                    </div>

                    <div>
                      <label htmlFor="availability" className="block text-sm font-medium text-gray-700 mb-2">
                        Availability *
                      </label>
                      <input
                        type="text"
                        id="availability"
                        name="availability"
                        required
                        value={formData.availability}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="e.g., Weekdays after 4pm, weekends 10-12pm"
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Notes */}
                <div>
                  <label htmlFor="additional_notes" className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    id="additional_notes"
                    name="additional_notes"
                    rows={3}
                    value={formData.additional_notes}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                    placeholder="Any additional information or special requirements..."
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
                    <CheckCircle className="h-5 w-5 mr-2" />
                  )}
                  {submitting ? 'Submitting...' : 'Submit Interest Form'}
                </button>
              </form>
            </div>

            {/* Info Sidebar */}
            <div className="space-y-6">
              {/* Subjects Available */}
              <div className="bg-primary-50 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Subjects Available
                </h3>
                <div className="space-y-3">
                  {subjects.map(subject => (
                    <div key={subject} className="flex items-center">
                      <BookOpen className="h-4 w-4 text-primary-600 mr-2" />
                      <span className="text-gray-700">{subject}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Process Steps */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">How It Works</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="bg-primary-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                      1
                    </div>
                    <span className="text-gray-700">Submit interest form</span>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-secondary-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                      2
                    </div>
                    <span className="text-gray-700">We review and contact you</span>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-accent-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                      3
                    </div>
                    <span className="text-gray-700">Schedule your sessions</span>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-neutral-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                      4
                    </div>
                    <span className="text-gray-700">Start personalized learning</span>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Questions?</h3>
                <p className="text-gray-600 mb-4">
                  If you have any questions about our 1-on-1 coaching or this form, feel free to reach out.
                </p>
                <div className="flex items-center text-primary-600">
                  <Mail className="h-4 w-4 mr-2" />
                  <a href="mailto:gallantgaveliers@gmail.com" className="hover:underline">
                    gallantgaveliers@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OneOnOneInterest;
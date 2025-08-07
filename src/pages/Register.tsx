import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { User, Mail, MessageSquare, CheckCircle, AlertCircle, Users, CreditCard } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Register: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    parentName: '',
    parentEmail: '',
    studentName: '',
    studentEmail: '',
    comments: '',
    hasPaid: false
  });

  useEffect(() => {
    fetchClasses();
    
    // Check URL parameters
    const classId = searchParams.get('class');
    if (classId) {
      setSelectedClass(classId);
    }
  }, [searchParams]);

  const fetchClasses = async () => {
    try {
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .eq('active', true)
        .order('name');
      
      if (error) throw error;
      setClasses(data || []);
    } catch (error) {
      console.error('Error fetching classes:', error);
      alert('Error loading classes. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const getSelectedClassInfo = () => {
    return classes.find(c => c.id === selectedClass);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Validate required fields
      if (!formData.parentName.trim()) {
        throw new Error('Parent name is required');
      }
      if (!formData.parentEmail.trim()) {
        throw new Error('Parent email is required');
      }
      if (!formData.studentName.trim()) {
        throw new Error('Student name is required');
      }
      if (!formData.studentEmail.trim()) {
        throw new Error('Student email is required');
      }
      if (!selectedClass) {
        throw new Error('Please select a class');
      }

      // Create student record with pending status
      const { data: createdStudent, error: studentError } = await supabase
        .from('students')
        .insert([{
          name: formData.studentName.trim(),
          parent_email: formData.parentEmail.trim(),
          parent_name: formData.parentName.trim(),
          student_email: formData.studentEmail.trim(),
          comments: formData.comments.trim() || null,
          class_id: selectedClass,
          status: 'pending' // Always pending for admin approval
        }])
        .select();

      if (studentError) {
        console.error('Student creation error:', studentError);
        console.error('Error details:', JSON.stringify(studentError, null, 2));
        
        // More specific error messages with updated email
        if (studentError.code === '42501') {
          throw new Error('Registration system is temporarily unavailable. Please contact us directly at gallantgaveliers@gmail.com');
        } else if (studentError.code === '23505') {
          throw new Error('A registration with this information already exists. Please contact gallantgaveliers@gmail.com if you need assistance.');
        } else {
          throw new Error(`Registration failed: ${studentError.message}. Please contact gallantgaveliers@gmail.com or try again.`);
        }
      }

      console.log('Student created successfully:', createdStudent);

      // Show success message
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting registration:', error);
      alert(error instanceof Error ? error.message : 'There was an error submitting your registration. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading registration form...</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    const selectedClassInfo = getSelectedClassInfo();
    
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
              Your registration is pending approval. We'll contact you within 24 hours.
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
                  <h4 className="font-semibold text-gray-900 mb-2">Review & Approval</h4>
                  <p className="text-sm text-gray-600">
                    We'll review your registration and contact you within 24 hours with approval and next steps.
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CreditCard className="h-6 w-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Payment Required</h4>
                  <p className="text-sm text-gray-600">
                    {formData.hasPaid 
                      ? "We'll verify your payment and confirm your spot."
                      : "You'll need to complete payment to secure your spot in the class."
                    }
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="h-6 w-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Start Learning</h4>
                  <p className="text-sm text-gray-600">
                    Once approved and payment is confirmed, you'll receive class details and can begin!
                  </p>
                </div>
              </div>
            </div>

            {/* Registration Summary */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Registration Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Student Information</h4>
                  <p className="text-gray-600">Name: {formData.studentName}</p>
                  <p className="text-gray-600">Email: {formData.studentEmail}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Parent/Guardian</h4>
                  <p className="text-gray-600">Name: {formData.parentName}</p>
                  <p className="text-gray-600">Email: {formData.parentEmail}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Selected Class</h4>
                  <p className="text-gray-600">{selectedClassInfo?.name}</p>
                  <p className="text-gray-600">Price: ${selectedClassInfo?.price}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Payment Status</h4>
                  <p className={`font-medium ${formData.hasPaid ? 'text-green-600' : 'text-orange-600'}`}>
                    {formData.hasPaid ? '✓ Payment Completed' : '⚠ Payment Required'}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Link */}
            {!formData.hasPaid && selectedClassInfo?.payment_link && (
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 mb-8">
                <h3 className="text-lg font-semibold text-orange-900 mb-3">Complete Your Payment</h3>
                <p className="text-orange-700 mb-4">
                  To secure your spot in {selectedClassInfo.name}, please complete your payment of ${selectedClassInfo.price}.
                </p>
                <a
                  href={selectedClassInfo.payment_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors inline-flex items-center"
                >
                  <CreditCard className="h-5 w-5 mr-2" />
                  Pay ${selectedClassInfo.price} with Stripe
                </a>
              </div>
            )}

            {/* Contact Info */}
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                Questions about your registration? We're here to help!
              </p>
              <div className="space-x-4">
                <Link
                  to="/contact"
                  className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors inline-flex items-center"
                >
                  Contact Us
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

  const selectedClassInfo = getSelectedClassInfo();

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-200 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Register for Classes
          </h1>
          <p className="text-xl text-gray-600">
            Submit your registration and we'll contact you within 24 hours for approval
          </p>
        </div>
      </section>

      {/* Registration Form */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Registration Information
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Parent Information */}
                <div className="border-b pb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Users className="h-5 w-5 mr-2 text-primary-600" />
                    Parent/Guardian Information
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="parentName" className="block text-sm font-medium text-gray-700 mb-2">
                        Parent/Guardian Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          id="parentName"
                          name="parentName"
                          required
                          value={formData.parentName}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="Enter parent/guardian full name"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="parentEmail" className="block text-sm font-medium text-gray-700 mb-2">
                        Parent/Guardian Email *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                          type="email"
                          id="parentEmail"
                          name="parentEmail"
                          required
                          value={formData.parentEmail}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="parent@example.com"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Student Information */}
                <div className="border-b pb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <User className="h-5 w-5 mr-2 text-secondary-600" />
                    Student Information
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="studentName" className="block text-sm font-medium text-gray-700 mb-2">
                        Student Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          id="studentName"
                          name="studentName"
                          required
                          value={formData.studentName}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="Enter student's full name"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="studentEmail" className="block text-sm font-medium text-gray-700 mb-2">
                        Student Email *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                          type="email"
                          id="studentEmail"
                          name="studentEmail"
                          required
                          value={formData.studentEmail}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          placeholder="student@example.com"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Class Selection */}
                <div className="border-b pb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Class Selection
                  </h3>
                  
                  <div>
                    <label htmlFor="classSelection" className="block text-sm font-medium text-gray-700 mb-2">
                      Select Class *
                    </label>
                    <select
                      id="classSelection"
                      name="classSelection"
                      required
                      value={selectedClass}
                      onChange={(e) => setSelectedClass(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Choose a class...</option>
                      {classes.map(classItem => (
                        <option key={classItem.id} value={classItem.id}>
                          {classItem.name} - ${classItem.price}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Payment Status */}
                <div className="border-b pb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Payment Information
                  </h3>
                  
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-orange-600 mr-2 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-orange-800">Payment Required</p>
                        <p className="text-sm text-orange-700">
                          Payment is required for your registration to be accepted. You can pay now or after submitting this form.
                        </p>
                      </div>
                    </div>
                  </div>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="hasPaid"
                      checked={formData.hasPaid}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      I have completed the payment for this class
                    </span>
                  </label>
                </div>

                {/* Comments */}
                <div>
                  <label htmlFor="comments" className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Comments
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <textarea
                      id="comments"
                      name="comments"
                      rows={4}
                      value={formData.comments}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                      placeholder="Any specific goals, questions, or information we should know?"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting || !selectedClass}
                  className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
                >
                  {submitting ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  ) : (
                    <CheckCircle className="h-5 w-5 mr-2" />
                  )}
                  {submitting ? 'Submitting...' : 'Submit Registration'}
                </button>
              </form>
            </div>

            {/* Summary */}
            <div className="space-y-6">
              {/* Selected Class Info */}
              {selectedClassInfo && (
                <div className="bg-primary-50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Selected Class:
                  </h3>
                  <div className="space-y-3">
                    <h4 className="text-lg font-semibold text-primary-600">
                      {selectedClassInfo.name}
                    </h4>
                    <p className="text-gray-600">{selectedClassInfo.description}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Schedule:</span>
                        <p className="text-gray-600">{selectedClassInfo.schedule}</p>
                      </div>
                      <div>
                        <span className="font-medium">Price:</span>
                        <p className="text-gray-600">${selectedClassInfo.price}</p>
                      </div>
                    </div>
                    
                    {/* Payment Link */}
                    {selectedClassInfo.payment_link && (
                      <div className="mt-4 pt-4 border-t border-primary-200">
                        <a
                          href={selectedClassInfo.payment_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors inline-flex items-center"
                        >
                          <CreditCard className="h-4 w-4 mr-2" />
                          Pay ${selectedClassInfo.price} Now
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Process Steps */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Registration Process</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="bg-primary-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                      1
                    </div>
                    <span className="text-gray-700">Submit registration form</span>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-secondary-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                      2
                    </div>
                    <span className="text-gray-700">Admin reviews and approves</span>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-accent-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                      3
                    </div>
                    <span className="text-gray-700">Complete payment (if not done)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-neutral-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                      4
                    </div>
                    <span className="text-gray-700">Receive class details and start!</span>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Questions?</h3>
                <p className="text-gray-600 mb-4">
                  If you have any questions about our classes or the registration process, feel free to reach out.
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

export default Register;
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { CreditCard, User, DollarSign, Info, CheckCircle } from 'lucide-react';

const Payment: React.FC = () => {
  const { user } = useAuth();
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [siteSettings, setSiteSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSiteSettings();
  }, []);

  const fetchSiteSettings = async () => {
    try {
      // Temporarily disable payment script functionality
      setSiteSettings({ payment_script_url: null });
    } catch (error) {
      console.error('Failed to fetch site settings:', error);
    } finally {
      setLoading(false);
    }
  };



  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in to access payments</h2>
          <p className="text-gray-600">You need to be logged in as a parent to make payments.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payment configuration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-200 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Payment Portal
          </h1>
          <p className="text-xl text-gray-600">
            Welcome back, {user.name}! Manage payments for your students.
          </p>
        </div>
      </section>

      {/* Payment Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Account Summary */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Summary</h3>
              
              <div className="space-y-4">
                <div className="border-b pb-3">
                  <h4 className="font-medium text-gray-900">Parent Information</h4>
                  <p className="text-gray-600">{user.name}</p>
                  <p className="text-gray-600">{user.email}</p>
                  {user.phone && <p className="text-gray-600">{user.phone}</p>}
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Enrolled Students</h4>
                  {user.students && user.students.length > 0 ? (
                    user.students.map((student) => (
                      <div key={student.id} className="bg-white p-3 rounded-lg mb-2">
                        <p className="font-medium text-gray-900">{student.name}</p>
                        <p className="text-sm text-gray-600">Status: {student.status}</p>
                        {student.class_id && <p className="text-sm text-gray-500">Class ID: {student.class_id}</p>}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600">No students enrolled yet.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Payment Form */}
            <div className="lg:col-span-2">
              {!showPaymentForm ? (
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <div className="text-center mb-8">
                    <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CreditCard className="h-8 w-8 text-primary-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Setup</h2>
                    <p className="text-gray-600">Secure payment for Speakers Circle programs</p>
                  </div>

                  <form className="space-y-6">
                    {/* Student Selection */}
                    <div>
                      <label htmlFor="student" className="block text-sm font-medium text-gray-700 mb-2">
                        Select Student
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <select
                          id="student"
                          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          required
                        >
                          <option value="">Select a student</option>
                          {user.students && user.students.map((student) => (
                            <option key={student.id} value={student.id}>
                              {student.name} ({student.status})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Payment Amount */}
                    <div>
                      <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                        Payment Amount
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <DollarSign className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="number"
                          id="amount"
                          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          placeholder="0.00"
                          min="1"
                          step="0.01"
                          required
                        />
                      </div>
                    </div>

                    {/* Payment Script Status */}
                    <div className="p-4 rounded-lg bg-yellow-50">
                      <div className="flex items-start">
                        <Info className="h-5 w-5 mr-3 mt-0.5 text-yellow-600" />
                        <div>
                          <h3 className="text-sm font-medium mb-1 text-yellow-900">
                            Payment System Temporarily Unavailable
                          </h3>
                          <p className="text-sm text-yellow-700">
                            Payment functionality is temporarily disabled while the database schema is being updated. 
                            Please contact the administrator for payment assistance.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="button"
                      disabled={true}
                      className="w-full py-4 px-6 rounded-lg text-lg font-semibold transition-colors duration-200 flex items-center justify-center bg-gray-400 text-gray-200 cursor-not-allowed"
                    >
                      <CreditCard className="h-6 w-6 mr-3" />
                      Payment Temporarily Unavailable
                    </button>
                  </form>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Payment Processor Loaded</h3>
                    <p className="text-gray-600 mb-6">
                      The payment script has been loaded successfully. You can now proceed with secure payment processing.
                    </p>
                  </div>

                  {/* Payment Form Container */}
                  <div id="payment-form-container" className="min-h-[400px] p-6 border-2 border-dashed border-gray-300 rounded-lg">
                    <div className="text-center">
                      <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">
                        Payment form will be rendered here by the loaded payment script.
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        Integrated with: {siteSettings?.payment_script_url}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-center">
                    <button
                      onClick={() => setShowPaymentForm(false)}
                      className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Back to Payment Setup
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Payment Structure Information */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Payment Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Payment Schedule</h3>
              </div>
              <ul className="space-y-2 text-gray-600">
                <li>• Monthly payments continue year-round</li>
                <li>• Automatic billing available</li>
                <li>• Flexible payment options</li>
                <li>• Secure processing with Stripe</li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <Info className="h-6 w-6 text-blue-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Breaks & Holidays</h3>
              </div>
              <ul className="space-y-2 text-gray-600">
                <li>• Breaks during long weekends</li>
                <li>• Spring break pause</li>
                <li>• Winter break pause</li>
                <li>• Summer program available</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 text-center">
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg inline-block">
              <p className="text-yellow-800">
                <strong>Need help?</strong> Contact us for payment assistance: 
                <a href="tel:925-895-9573" className="font-medium hover:underline ml-1">925-895-9573</a>
                {' | '}
                <a href="mailto:gallantgaveliers@gmail.com" className="font-medium hover:underline">gallantgaveliers@gmail.com</a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Payment;
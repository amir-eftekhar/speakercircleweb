import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, DollarSign, MapPin, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Classes: React.FC = () => {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .eq('active', true)
        .order('created_at');
      
      if (error) throw error;
      setClasses(data || []);
    } catch (error) {
      console.error('Error fetching classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAvailabilityColor = (current: number, limit: number) => {
    const percentage = (current / limit) * 100;
    if (percentage >= 90) return 'text-red-600 bg-red-50';
    if (percentage >= 70) return 'text-orange-600 bg-orange-50';
    return 'text-green-600 bg-green-50';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading classes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-200 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Our Classes
          </h1>
          <p className="text-xl text-gray-600">
            Choose from our comprehensive programs designed to develop communication and leadership skills
          </p>
        </div>
      </section>

      {/* Classes Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {classes.map((classItem) => {
              const spotsLeft = classItem.group_limit - classItem.current_enrolled;
              const isFull = spotsLeft <= 0;
              
              return (
                <div key={classItem.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200">
                  <div className="p-8">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-2xl font-bold text-gray-900">
                        {classItem.name}
                      </h3>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${getAvailabilityColor(classItem.current_enrolled, classItem.group_limit)}`}>
                        {isFull ? 'Full' : `${spotsLeft} spots left`}
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {classItem.description}
                    </p>

                    <div className="space-y-4 mb-6">
                      <div className="flex items-center text-gray-700">
                        <Clock className="h-5 w-5 mr-3 text-primary-600" />
                        <span>{classItem.schedule}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <Users className="h-5 w-5 mr-3 text-accent-600" />
                        <span>
                          {classItem.current_enrolled}/{classItem.group_limit} enrolled
                          {classItem.waitlist_enabled && isFull && ` (${classItem.waitlist_count} on waitlist)`}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <DollarSign className="h-5 w-5 mr-3 text-secondary-600" />
                        <span>${classItem.price}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <MapPin className="h-5 w-5 mr-3 text-neutral-600" />
                        <span>In-person & Online options available</span>
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      {isFull ? (
                        <div className="text-center">
                          <p className="text-gray-600 mb-4">This class is currently full</p>
                          {classItem.waitlist_enabled && (
                            <Link
                              to={`/register?class=${classItem.id}&waitlist=true`}
                              className="bg-secondary-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-secondary-600 transition-colors duration-200 inline-flex items-center"
                            >
                              Join Waitlist
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                          )}
                        </div>
                      ) : (
                        <Link
                          to={`/register?class=${classItem.id}`}
                          className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors duration-200 inline-flex items-center justify-center"
                        >
                          Register for This Class
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Additional Info */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Registration Process
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-primary-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-primary-600">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Choose Class</h3>
              <p className="text-sm text-gray-600">Select the class that best fits your schedule and goals</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-secondary-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-secondary-600">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Register</h3>
              <p className="text-sm text-gray-600">Complete the registration form with your information</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-accent-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-accent-600">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Payment</h3>
              <p className="text-sm text-gray-600">Secure payment processing to confirm your spot</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="bg-neutral-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-neutral-600">4</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Confirmation</h3>
              <p className="text-sm text-gray-600">Receive confirmation email with class details</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Classes;
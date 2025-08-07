import React, { useEffect, useState } from 'react';
import { Users, Calendar, DollarSign, BookOpen, TrendingUp, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalClasses: 0,
    totalRevenue: 0,
    upcomingEvents: 0,
    enrollmentTrend: '+12%',
    waitlistCount: 0
  });
  const [recentRegistrations, setRecentRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch all data in parallel
      const [
        studentsResponse,
        classesResponse,
        paymentsResponse,
        eventsResponse,
        registrationsResponse
      ] = await Promise.all([
        supabase.from('students').select('*', { count: 'exact' }),
        supabase.from('classes').select('*').eq('active', true),
        supabase.from('payments').select('amount').eq('status', 'paid'),
        supabase.from('events').select('*', { count: 'exact' }).gte('date', new Date().toISOString()),
        supabase.from('registrations')
          .select(`
            *,
            students(name, parent_email),
            classes(name)
          `)
          .order('timestamp', { ascending: false })
          .limit(5)
      ]);

      // Calculate stats
      const totalStudents = studentsResponse.count || 0;
      const totalClasses = classesResponse.data?.length || 0;
      const totalRevenue = paymentsResponse.data?.reduce((sum, payment) => sum + payment.amount, 0) || 0;
      const upcomingEvents = eventsResponse.count || 0;
      
      // Calculate waitlist count
      const waitlistCount = classesResponse.data?.reduce((sum, cls) => sum + cls.waitlist_count, 0) || 0;

      setStats({
        totalStudents,
        totalClasses,
        totalRevenue,
        upcomingEvents,
        enrollmentTrend: '+12%', // This would be calculated based on historical data
        waitlistCount
      });

      setRecentRegistrations(registrationsResponse.data || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with SpeakersCircle.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalStudents}</p>
                <p className="text-sm text-accent-600 flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  {stats.enrollmentTrend} from last month
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-primary-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Classes</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalClasses}</p>
                <p className="text-sm text-gray-500 mt-1">Currently running</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <BookOpen className="h-6 w-6 text-secondary-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
                <p className="text-sm text-gray-500 mt-1">All time</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-accent-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Upcoming Events</p>
                <p className="text-3xl font-bold text-gray-900">{stats.upcomingEvents}</p>
                <p className="text-sm text-gray-500 mt-1">This month</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Calendar className="h-6 w-6 text-neutral-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Registrations */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Registrations</h3>
            <div className="space-y-4">
              {recentRegistrations.map((registration) => (
                <div key={registration.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{registration.students?.name}</p>
                    <p className="text-sm text-gray-600">{registration.classes?.name}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(registration.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      registration.payment_status === 'paid' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {registration.payment_status}
                    </span>
                  </div>
                </div>
              ))}
              {recentRegistrations.length === 0 && (
                <p className="text-gray-500 text-center py-4">No recent registrations</p>
              )}
            </div>
          </div>

          {/* Quick Actions & Alerts */}
          <div className="space-y-6">
            {/* Alerts */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Alerts & Notifications</h3>
              <div className="space-y-3">
                {stats.waitlistCount > 0 && (
                  <div className="flex items-center p-3 bg-orange-50 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-secondary-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-secondary-900">
                        {stats.waitlistCount} students on waitlists
                      </p>
                      <p className="text-xs text-secondary-700">Consider opening additional class slots</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-primary-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-primary-900">
                      Next event in 5 days
                    </p>
                    <p className="text-xs text-primary-700">Navigating STEM Internships Workshop</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-4">
                <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg text-center transition-colors">
                  <BookOpen className="h-6 w-6 text-primary-600 mx-auto mb-2" />
                  <span className="text-sm font-medium text-primary-900">Add Class</span>
                </button>
                <button className="p-4 bg-secondary-50 hover:bg-secondary-100 rounded-lg text-center transition-colors">
                  <Calendar className="h-6 w-6 text-secondary-600 mx-auto mb-2" />
                  <span className="text-sm font-medium text-secondary-900">New Event</span>
                </button>
                <button className="p-4 bg-accent-50 hover:bg-accent-100 rounded-lg text-center transition-colors">
                  <Users className="h-6 w-6 text-accent-600 mx-auto mb-2" />
                  <span className="text-sm font-medium text-accent-900">Manage Students</span>
                </button>
                <button className="p-4 bg-neutral-50 hover:bg-neutral-100 rounded-lg text-center transition-colors">
                  <DollarSign className="h-6 w-6 text-neutral-600 mx-auto mb-2" />
                  <span className="text-sm font-medium text-neutral-900">View Reports</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
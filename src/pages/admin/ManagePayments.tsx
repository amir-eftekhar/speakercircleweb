import React, { useEffect, useState } from 'react';
import { DollarSign, Download, Eye, Search, Filter, Plus, ExternalLink } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const ManagePayments: React.FC = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showManualPayment, setShowManualPayment] = useState(false);
  const [manualPaymentData, setManualPaymentData] = useState({
    user_email: '',
    amount: '',
    student_id: '',
    class_id: '',
    stripe_payment_id: '',
    receipt_url: ''
  });
  const [students, setStudents] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    pendingPayments: 0,
    successfulPayments: 0,
    failedPayments: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [paymentsResponse, studentsResponse, classesResponse] = await Promise.all([
        supabase
          .from('payments')
          .select(`
            *,
            students(name, parent_email),
            classes(name)
          `)
          .order('created_at', { ascending: false }),
        supabase.from('students').select('*'),
        supabase.from('classes').select('*')
      ]);
      
      if (paymentsResponse.error) throw paymentsResponse.error;
      if (studentsResponse.error) throw studentsResponse.error;
      if (classesResponse.error) throw classesResponse.error;
      
      setPayments(paymentsResponse.data || []);
      setStudents(studentsResponse.data || []);
      setClasses(classesResponse.data || []);
      
      // Calculate stats
      const data = paymentsResponse.data || [];
      const totalRevenue = data.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
      const pendingPayments = data.filter(p => p.status === 'pending').length;
      const successfulPayments = data.filter(p => p.status === 'paid').length;
      const failedPayments = data.filter(p => p.status === 'failed').length;
      
      setStats({
        totalRevenue,
        pendingPayments,
        successfulPayments,
        failedPayments
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.students?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.classes?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const exportPayments = () => {
    const csvContent = [
      ['Date', 'Student', 'Email', 'Class', 'Amount', 'Status', 'Payment ID'].join(','),
      ...filteredPayments.map(payment => [
        new Date(payment.created_at).toLocaleDateString(),
        payment.students?.name || 'N/A',
        payment.user_email,
        payment.classes?.name || 'N/A',
        `$${payment.amount}`,
        payment.status,
        payment.stripe_payment_id || 'N/A'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payments-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleManualPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('payments')
        .insert([{
          user_email: manualPaymentData.user_email,
          amount: parseFloat(manualPaymentData.amount),
          student_id: manualPaymentData.student_id || null,
          class_id: manualPaymentData.class_id || null,
          stripe_payment_id: manualPaymentData.stripe_payment_id || `manual_${Date.now()}`,
          receipt_url: manualPaymentData.receipt_url || null,
          status: 'paid'
        }]);
      
      if (error) throw error;
      
      await fetchData();
      setShowManualPayment(false);
      setManualPaymentData({
        user_email: '',
        amount: '',
        student_id: '',
        class_id: '',
        stripe_payment_id: '',
        receipt_url: ''
      });
      alert('Manual payment recorded successfully!');
    } catch (error) {
      console.error('Error recording manual payment:', error);
      alert('Error recording payment. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading payments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Payment Management</h1>
              <p className="text-gray-600 mt-2">Track and manage all payments and transactions</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={exportPayments}
                className="bg-secondary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-secondary-700 transition-colors flex items-center"
              >
                <Download className="h-5 w-5 mr-2" />
                Export CSV
              </button>
              <button
                onClick={() => setShowManualPayment(true)}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Manual Payment
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Manual Payment Modal */}
        {showManualPayment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Record Manual Payment</h3>
              <form onSubmit={handleManualPayment} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    value={manualPaymentData.user_email}
                    onChange={(e) => setManualPaymentData(prev => ({ ...prev, user_email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={manualPaymentData.amount}
                    onChange={(e) => setManualPaymentData(prev => ({ ...prev, amount: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Student</label>
                  <select
                    value={manualPaymentData.student_id}
                    onChange={(e) => setManualPaymentData(prev => ({ ...prev, student_id: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Select student (optional)</option>
                    {students.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                  <select
                    value={manualPaymentData.class_id}
                    onChange={(e) => setManualPaymentData(prev => ({ ...prev, class_id: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">Select class (optional)</option>
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment ID</label>
                  <input
                    type="text"
                    value={manualPaymentData.stripe_payment_id}
                    onChange={(e) => setManualPaymentData(prev => ({ ...prev, stripe_payment_id: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="Leave blank for auto-generated ID"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Receipt URL</label>
                  <input
                    type="url"
                    value={manualPaymentData.receipt_url}
                    onChange={(e) => setManualPaymentData(prev => ({ ...prev, receipt_url: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    placeholder="https://..."
                  />
                </div>
                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Record Payment
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowManualPayment(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Successful</p>
                <p className="text-3xl font-bold text-gray-900">{stats.successfulPayments}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-gray-900">{stats.pendingPayments}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Failed</p>
                <p className="text-3xl font-bold text-gray-900">{stats.failedPayments}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <DollarSign className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by email, student, or class..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Statuses</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Student</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Class</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Payment ID</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(payment.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">
                          {payment.students?.name || 'N/A'}
                        </div>
                        <div className="text-sm text-gray-600">{payment.user_email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {payment.classes?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      ${payment.amount}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {payment.stripe_payment_id ? (
                        <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                          {payment.stripe_payment_id.slice(-8)}
                        </code>
                      ) : (
                        'N/A'
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {payment.receipt_url && (
                          <a
                            href={payment.receipt_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 text-primary-600 hover:bg-primary-50 rounded transition-colors"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredPayments.length === 0 && (
            <div className="text-center py-16">
              <DollarSign className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Payments Found</h3>
              <p className="text-gray-600">
                {payments.length === 0 
                  ? 'No payments have been processed yet.'
                  : 'No payments match your current filters.'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagePayments;
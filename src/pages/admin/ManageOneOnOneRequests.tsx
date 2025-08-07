import React, { useEffect, useState } from 'react';
import { Search, Filter, Eye, Check, X, Mail, User, BookOpen, Clock } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const ManageOneOnOneRequests: React.FC = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);

  const subjects = ['English', 'Coding', 'Debate', 'Interview Prep', 'Resume Boost', 'College Counseling'];

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('one_on_one_requests')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching 1-on-1 requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.parent_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.parent_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    const matchesSubject = subjectFilter === 'all' || request.preferred_subject === subjectFilter;
    
    return matchesSearch && matchesStatus && matchesSubject;
  });

  const updateRequestStatus = async (requestId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('one_on_one_requests')
        .update({ status: newStatus })
        .eq('id', requestId);
      
      if (error) throw error;
      
      await fetchRequests();
      
      // Show success message
      const statusText = newStatus === 'approved' ? 'approved' : 'rejected';
      alert(`Request ${statusText} successfully! ${newStatus === 'approved' ? 'You should now contact the family to schedule sessions.' : ''}`);
    } catch (error) {
      console.error('Error updating request status:', error);
      alert('Error updating request status. Please try again.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const viewDetails = (request: any) => {
    setSelectedRequest(request);
    setShowDetails(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading 1-on-1 requests...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">1-on-1 Coaching Requests</h1>
              <p className="text-gray-600 mt-2">Review and manage 1-on-1 coaching interest forms</p>
            </div>
            <div className="text-sm text-gray-600">
              {filteredRequests.length} of {requests.length} requests
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Details Modal */}
        {showDetails && selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Request Details</h3>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Student Info */}
                <div className="border-b pb-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Student Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Name:</span>
                      <p className="text-gray-600">{selectedRequest.student_name}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Email:</span>
                      <p className="text-gray-600">{selectedRequest.student_email}</p>
                    </div>
                  </div>
                </div>

                {/* Parent Info */}
                <div className="border-b pb-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Parent/Guardian Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Name:</span>
                      <p className="text-gray-600">{selectedRequest.parent_name}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Email:</span>
                      <p className="text-gray-600">{selectedRequest.parent_email}</p>
                    </div>
                  </div>
                </div>

                {/* Session Details */}
                <div className="border-b pb-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Session Preferences</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Subject:</span>
                      <p className="text-gray-600">{selectedRequest.preferred_subject}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Mode:</span>
                      <p className="text-gray-600">{selectedRequest.preferred_mode}</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <span className="font-medium text-gray-700">Availability:</span>
                    <p className="text-gray-600">{selectedRequest.availability}</p>
                  </div>
                </div>

                {/* Goals */}
                <div className="border-b pb-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Learning Goals</h4>
                  <p className="text-gray-600 whitespace-pre-wrap">{selectedRequest.goals}</p>
                </div>

                {/* Additional Notes */}
                {selectedRequest.additional_notes && (
                  <div className="border-b pb-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Additional Notes</h4>
                    <p className="text-gray-600 whitespace-pre-wrap">{selectedRequest.additional_notes}</p>
                  </div>
                )}

                {/* Status and Actions */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Status & Actions</h4>
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedRequest.status)}`}>
                      {selectedRequest.status}
                    </span>
                    {selectedRequest.status === 'pending' && (
                      <div className="flex space-x-3">
                        <button
                          onClick={() => {
                            updateRequestStatus(selectedRequest.id, 'approved');
                            setShowDetails(false);
                          }}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Approve
                        </button>
                        <button
                          onClick={() => {
                            updateRequestStatus(selectedRequest.id, 'rejected');
                            setShowDetails(false);
                          }}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contact Actions */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Quick Contact</h4>
                  <div className="flex space-x-3">
                    <a
                      href={`mailto:${selectedRequest.parent_email}?subject=1-on-1 Coaching Request - ${selectedRequest.student_name}&body=Dear ${selectedRequest.parent_name},%0D%0A%0D%0AThank you for your interest in 1-on-1 coaching for ${selectedRequest.student_name}.%0D%0A%0D%0ABest regards,%0D%0AGallant Gaveliers%0D%0ASpeakersCircle`}
                      className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center text-sm"
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Email Parent
                    </a>
                    <a
                      href={`mailto:${selectedRequest.student_email}?subject=1-on-1 Coaching Opportunity&body=Hi ${selectedRequest.student_name},%0D%0A%0D%0AThank you for your interest in 1-on-1 coaching.%0D%0A%0D%0ABest regards,%0D%0AGallant Gaveliers%0D%0ASpeakersCircle`}
                      className="bg-secondary-600 text-white px-4 py-2 rounded-lg hover:bg-secondary-700 transition-colors flex items-center text-sm"
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Email Student
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
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
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Subject Filter */}
            <div>
              <select
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Subjects</option>
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Requests List */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Student</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Subject</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Mode</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Submitted</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="bg-blue-100 p-2 rounded-full mr-3">
                          <User className="h-5 w-5 text-primary-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{request.student_name}</div>
                          <div className="text-sm text-gray-600">{request.parent_name}</div>
                          <div className="text-xs text-gray-500">{request.parent_email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <BookOpen className="h-4 w-4 text-accent-600 mr-2" />
                        <span className="text-sm text-gray-900">{request.preferred_subject}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {request.preferred_mode}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(request.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => viewDetails(request)}
                          className="p-1 text-primary-600 hover:bg-primary-50 rounded transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        {request.status === 'pending' && (
                          <>
                            <button
                              onClick={() => updateRequestStatus(request.id, 'approved')}
                              className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                              title="Approve"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => updateRequestStatus(request.id, 'rejected')}
                              className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Reject"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </>
                        )}

                        <a
                          href={`mailto:${request.parent_email}?subject=1-on-1 Coaching Request - ${request.student_name}&body=Dear Parent/Guardian,%0D%0A%0D%0AThank you for your interest in 1-on-1 coaching.%0D%0A%0D%0ABest regards,%0D%0AGallant Gaveliers`}
                          className="p-1 text-secondary-600 hover:bg-secondary-50 rounded transition-colors"
                          title="Email Parent"
                        >
                          <Mail className="h-4 w-4" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredRequests.length === 0 && (
            <div className="text-center py-16">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Requests Found</h3>
              <p className="text-gray-600">
                {requests.length === 0 
                  ? 'No 1-on-1 coaching requests have been submitted yet.'
                  : 'No requests match your current filters.'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageOneOnOneRequests;
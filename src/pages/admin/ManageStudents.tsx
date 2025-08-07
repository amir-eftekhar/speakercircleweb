import React, { useEffect, useState } from 'react';
import { Search, Filter, Edit, Trash2, Mail, User, AlertCircle, Plus } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const ManageStudents: React.FC = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [classFilter, setClassFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    parent_name: '',
    parent_email: '',
    student_email: '',
    class_id: '',
    status: 'active',
    comments: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [studentsResponse, classesResponse] = await Promise.all([
        supabase
          .from('students')
          .select(`
            *,
            classes(name)
          `)
          .order('created_at', { ascending: false }),
        supabase
          .from('classes')
          .select('*')
          .eq('active', true)
      ]);

      if (studentsResponse.error) throw studentsResponse.error;
      if (classesResponse.error) throw classesResponse.error;

      setStudents(studentsResponse.data || []);
      setClasses(classesResponse.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.parent_email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
    const matchesClass = classFilter === 'all' || student.class_id === classFilter;
    
    return matchesSearch && matchesStatus && matchesClass;
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const studentData = {
        name: formData.name,
        parent_name: formData.parent_name,
        parent_email: formData.parent_email,
        student_email: formData.student_email,
        class_id: formData.class_id || null,
        status: formData.status,
        comments: formData.comments || null
      };

      if (editingStudent) {
        const { error } = await supabase
          .from('students')
          .update(studentData)
          .eq('id', editingStudent.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('students')
          .insert([studentData]);
        
        if (error) throw error;
      }

      await fetchData();
      setShowForm(false);
      setEditingStudent(null);
      setFormData({
        name: '',
        parent_name: '',
        parent_email: '',
        student_email: '',
        class_id: '',
        status: 'active',
        comments: ''
      });
    } catch (error) {
      console.error('Error saving student:', error);
      alert('Error saving student. Please try again.');
    }
  };

  const handleEdit = (student: any) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      parent_name: student.parent_name || '',
      parent_email: student.parent_email,
      student_email: student.student_email || '',
      class_id: student.class_id || '',
      status: student.status,
      comments: student.comments || ''
    });
    setShowForm(true);
  };

  const updateStudentStatus = async (studentId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('students')
        .update({ status: newStatus })
        .eq('id', studentId);
      
      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error updating student status:', error);
      alert('Error updating student status. Please try again.');
    }
  };

  const moveStudent = async (studentId: string, newClassId: string) => {
    try {
      const { error } = await supabase
        .from('students')
        .update({ class_id: newClassId || null })
        .eq('id', studentId);
      
      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error moving student:', error);
      alert('Error moving student. Please try again.');
    }
  };

  const deleteStudent = async (studentId: string) => {
    if (!confirm('Are you sure you want to delete this student?')) return;

    try {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', studentId);
      
      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Error deleting student:', error);
      alert('Error deleting student. Please try again.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'waitlist':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading students...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Manage Students</h1>
              <p className="text-gray-600 mt-2">View and manage student enrollments</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                {filteredStudents.length} of {students.length} students
              </div>
              <button
                onClick={() => {
                  setEditingStudent(null);
                  setFormData({
                    name: '',
                    parent_name: '',
                    parent_email: '',
                    student_email: '',
                    class_id: '',
                    status: 'active',
                    comments: ''
                  });
                  setShowForm(true);
                }}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Student
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Add/Edit Student Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingStudent ? 'Edit Student' : 'Add New Student'}
            </h2>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Student Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter student's full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parent/Guardian Name *
                </label>
                <input
                  type="text"
                  name="parent_name"
                  required
                  value={formData.parent_name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter parent/guardian name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parent/Guardian Email *
                </label>
                <input
                  type="email"
                  name="parent_email"
                  required
                  value={formData.parent_email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="parent@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Student Email *
                </label>
                <input
                  type="email"
                  name="student_email"
                  required
                  value={formData.student_email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="student@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assign to Class
                </label>
                <select
                  name="class_id"
                  value={formData.class_id}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">No class assigned</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status *
                </label>
                <select
                  name="status"
                  required
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="pending">Pending Approval</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="waitlist">Waitlist</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comments
                </label>
                <textarea
                  name="comments"
                  rows={3}
                  value={formData.comments}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  placeholder="Additional notes or comments..."
                />
              </div>

              <div className="md:col-span-2 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  {editingStudent ? 'Update Student' : 'Add Student'}
                </button>
              </div>
            </form>
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
                placeholder="Search students..."
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
                <option value="pending">Pending Approval</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="waitlist">Waitlist</option>
              </select>
            </div>

            {/* Class Filter */}
            <div>
              <select
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Classes</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Students List */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Student</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Class</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Enrolled</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="bg-blue-100 p-2 rounded-full mr-3">
                          <User className="h-5 w-5 text-primary-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{student.name}</div>
                          <div className="text-sm text-gray-600 flex items-center">
                            <span className="mr-2">{student.parent_name || 'N/A'}</span>
                            <Mail className="h-4 w-4 mr-1" />
                            {student.parent_email}
                          </div>
                          {student.student_email && (
                            <div className="text-xs text-gray-500">
                              Student: {student.student_email}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {student.classes?.name || 'No class assigned'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(student.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {/* Status Change */}
                        <select
                          value={student.status}
                          onChange={(e) => updateStudentStatus(student.id, e.target.value)}
                          className="text-xs border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="pending">Pending</option>
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="waitlist">Waitlist</option>
                        </select>

                        {/* Move to Class */}
                        <select
                          value={student.class_id || ''}
                          onChange={(e) => moveStudent(student.id, e.target.value)}
                          className="text-xs border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="">No class</option>
                          {classes.map((cls) => (
                            <option key={cls.id} value={cls.id}>
                              {cls.name}
                            </option>
                          ))}
                        </select>

                        <button
                          onClick={() => handleEdit(student)}
                          className="p-1 text-primary-600 hover:bg-primary-50 rounded transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => deleteStudent(student.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredStudents.length === 0 && (
            <div className="text-center py-16">
              <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Students Found</h3>
              <p className="text-gray-600">
                {students.length === 0 
                  ? 'No students have registered yet.'
                  : 'No students match your current filters.'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageStudents;
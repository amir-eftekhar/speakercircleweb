import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Users, Clock, DollarSign, ExternalLink, Copy } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { isValidPaymentLink } from '../../lib/stripe-payment-links';

const ManageClasses: React.FC = () => {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingClass, setEditingClass] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    schedule: '',
    price: '',
    description: '',
    group_limit: '',
    payment_link: '',
    active: true
  });

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setClasses(data || []);
    } catch (error) {
      console.error('Error fetching classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate payment link if provided
    if (formData.payment_link && !isValidPaymentLink(formData.payment_link)) {
      alert('Please enter a valid Stripe payment link (must start with https://buy.stripe.com/ or https://checkout.stripe.com/)');
      return;
    }
    
    try {
      const classData = {
        name: formData.name,
        schedule: formData.schedule,
        price: parseFloat(formData.price),
        description: formData.description,
        group_limit: parseInt(formData.group_limit),
        payment_link: formData.payment_link || null,
        active: formData.active
      };

      if (editingClass) {
        const { error } = await supabase
          .from('classes')
          .update(classData)
          .eq('id', editingClass.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('classes')
          .insert([{ ...classData, current_enrolled: 0, waitlist_count: 0 }]);
        
        if (error) throw error;
      }

      await fetchClasses();
      setShowForm(false);
      setEditingClass(null);
      setFormData({
        name: '',
        schedule: '',
        price: '',
        description: '',
        group_limit: '',
        payment_link: '',
        active: true
      });
    } catch (error) {
      console.error('Error saving class:', error);
      alert('Error saving class. Please try again.');
    }
  };

  const handleEdit = (classItem: any) => {
    setEditingClass(classItem);
    setFormData({
      name: classItem.name,
      schedule: classItem.schedule,
      price: classItem.price.toString(),
      description: classItem.description,
      group_limit: classItem.group_limit.toString(),
      payment_link: classItem.payment_link || '',
      active: classItem.active
    });
    setShowForm(true);
  };

  const handleDelete = async (classId: string) => {
    if (!confirm('Are you sure you want to delete this class?')) return;

    try {
      const { error } = await supabase
        .from('classes')
        .delete()
        .eq('id', classId);
      
      if (error) throw error;
      await fetchClasses();
    } catch (error) {
      console.error('Error deleting class:', error);
      alert('Error deleting class. Please try again.');
    }
  };

  const copyPaymentLink = (link: string) => {
    navigator.clipboard.writeText(link).then(() => {
      alert('Payment link copied to clipboard!');
    }).catch(() => {
      prompt('Copy this payment link:', link);
    });
  };

  const testPaymentLink = (link: string) => {
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading classes...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Manage Classes</h1>
              <p className="text-gray-600 mt-2">Create and manage your class offerings with Stripe payment links</p>
            </div>
            <button
              onClick={() => {
                setEditingClass(null);
                setFormData({
                  name: '',
                  schedule: '',
                  price: '',
                  description: '',
                  group_limit: '',
                  payment_link: '',
                  active: true
                });
                setShowForm(true);
              }}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add New Class
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showForm && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingClass ? 'Edit Class' : 'Add New Class'}
            </h2>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Class Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Youth Leadership Circle"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Schedule *
                </label>
                <input
                  type="text"
                  name="schedule"
                  required
                  value={formData.schedule}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Mondays 5:30-6:45PM"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price ($) *
                </label>
                <input
                  type="number"
                  name="price"
                  required
                  step="0.01"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="150.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Group Limit *
                </label>
                <input
                  type="number"
                  name="group_limit"
                  required
                  value={formData.group_limit}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="18"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stripe Payment Link
                </label>
                <input
                  type="url"
                  name="payment_link"
                  value={formData.payment_link}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="https://buy.stripe.com/..."
                />
                <p className="text-sm text-gray-500 mt-1">
                  Optional: Custom Stripe payment link for this class. If not provided, system will try to auto-match based on class name and price.
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  required
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  placeholder="Describe the class curriculum and benefits..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="active"
                    checked={formData.active}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700">Active (visible to students)</span>
                </label>
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
                  {editingClass ? 'Update Class' : 'Create Class'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Classes List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((classItem) => (
            <div key={classItem.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-gray-900 line-clamp-2">
                    {classItem.name}
                  </h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(classItem)}
                      className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(classItem.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {classItem.description}
                </p>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-700">
                    <Clock className="h-4 w-4 mr-2 text-primary-600" />
                    <span>{classItem.schedule}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <DollarSign className="h-4 w-4 mr-2 text-accent-600" />
                    <span>${classItem.price}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Users className="h-4 w-4 mr-2 text-secondary-600" />
                    <span>
                      {classItem.current_enrolled}/{classItem.group_limit} enrolled
                      {classItem.waitlist_count > 0 && ` (+${classItem.waitlist_count} waitlist)`}
                    </span>
                  </div>
                </div>

                {/* Payment Link Section */}
                {classItem.payment_link && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Payment Link:</span>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => copyPaymentLink(classItem.payment_link)}
                          className="p-1 text-gray-500 hover:text-primary-600 transition-colors"
                          title="Copy link"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => testPaymentLink(classItem.payment_link)}
                          className="p-1 text-gray-500 hover:text-primary-600 transition-colors"
                          title="Test link"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded font-mono break-all">
                      {classItem.payment_link}
                    </div>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t">
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                    classItem.active
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {classItem.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {classes.length === 0 && (
          <div className="text-center py-16">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Classes Yet</h3>
            <p className="text-gray-600">Create your first class to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageClasses;
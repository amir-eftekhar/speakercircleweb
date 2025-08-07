import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Calendar, Clock, MapPin, ExternalLink, Copy } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const ManageEvents: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    duration: '',
    location: '',
    registration_link: ''
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const eventData = {
        title: formData.title,
        description: formData.description,
        date: new Date(formData.date).toISOString(),
        duration: formData.duration,
        location: formData.location,
        registration_link: formData.registration_link || null
      };

      if (editingEvent) {
        const { error } = await supabase
          .from('events')
          .update(eventData)
          .eq('id', editingEvent.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('events')
          .insert([eventData]);
        
        if (error) throw error;
      }

      await fetchEvents();
      setShowForm(false);
      setEditingEvent(null);
      setFormData({
        title: '',
        description: '',
        date: '',
        duration: '',
        location: '',
        registration_link: ''
      });
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Error saving event. Please try again.');
    }
  };

  const handleEdit = (event: any) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      date: new Date(event.date).toISOString().slice(0, 16),
      duration: event.duration,
      location: event.location,
      registration_link: event.registration_link || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);
      
      if (error) throw error;
      await fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Error deleting event. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const copyRegistrationLink = (link: string) => {
    navigator.clipboard.writeText(link).then(() => {
      alert('Registration link copied to clipboard!');
    }).catch(() => {
      prompt('Copy this registration link:', link);
    });
  };

  const testRegistrationLink = (link: string) => {
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading events...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Manage Events</h1>
              <p className="text-gray-600 mt-2">Create and manage workshops, contests, and special events</p>
            </div>
            <button
              onClick={() => {
                setEditingEvent(null);
                setFormData({
                  title: '',
                  description: '',
                  date: '',
                  duration: '',
                  location: '',
                  registration_link: ''
                });
                setShowForm(true);
              }}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add New Event
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showForm && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingEvent ? 'Edit Event' : 'Add New Event'}
            </h2>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Event Title *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Navigating STEM Internships Workshop"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date & Time *
                </label>
                <input
                  type="datetime-local"
                  name="date"
                  required
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration *
                </label>
                <input
                  type="text"
                  name="duration"
                  required
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., 2 hours per session"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Fremont, CA or Online"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Registration Link
                </label>
                <input
                  type="url"
                  name="registration_link"
                  value={formData.registration_link}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="https://..."
                />
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
                  placeholder="Describe the event, what participants will learn, and any requirements..."
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
                  {editingEvent ? 'Update Event' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Events List */}
        <div className="space-y-6">
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {event.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {event.description}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center text-gray-700">
                        <Calendar className="h-4 w-4 mr-2 text-primary-600" />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <Clock className="h-4 w-4 mr-2 text-secondary-600" />
                        <span>{event.duration}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <MapPin className="h-4 w-4 mr-2 text-accent-600" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                    
                    {/* Registration Link Section */}
                    {event.registration_link && (
                      <div className="mt-4 pt-4 border-t">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">Registration Link:</span>
                          <div className="flex space-x-1">
                            <button
                              onClick={() => copyRegistrationLink(event.registration_link)}
                              className="p-1 text-gray-500 hover:text-primary-600 transition-colors"
                              title="Copy link"
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => testRegistrationLink(event.registration_link)}
                              className="p-1 text-gray-500 hover:text-primary-600 transition-colors"
                              title="Test link"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded font-mono break-all">
                          {event.registration_link}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleEdit(event)}
                      className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {events.length === 0 && (
          <div className="text-center py-16">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Events Yet</h3>
            <p className="text-gray-600">Create your first event to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageEvents;
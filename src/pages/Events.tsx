import React, { useEffect, useState } from 'react';
import { Calendar, Clock, MapPin, Users, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Events: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });
      
      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const isUpcoming = (dateString: string) => {
    return new Date(dateString) > new Date();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-orange-50 py-16">
      </section>
      <section className="bg-gradient-to-br from-primary-50 to-secondary-200 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Upcoming Events
          </h1>
          <p className="text-xl text-gray-600">
            Join our workshops, contests, and special events to enhance your skills
          </p>
        </div>
      </section>

      {/* Events List */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {events.length === 0 ? (
            <div className="text-center py-16">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Events Scheduled</h3>
              <p className="text-gray-600">Check back soon for upcoming workshops and events!</p>
            </div>
          ) : (
            <div className="space-y-8">
              {events.map((event) => (
                <div key={event.id} className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200 ${!isUpcoming(event.date) ? 'opacity-75' : ''}`}>
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-0">
                    <div className="lg:col-span-1 bg-gradient-to-br from-primary-500 to-primary-600 p-8 text-white">
                      <div className="text-center">
                        <Calendar className="h-8 w-8 mx-auto mb-3" />
                        <div className="text-3xl font-bold">
                          {new Date(event.date).getDate()}
                        </div>
                        <div className="text-sm opacity-90">
                          {new Date(event.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        </div>
                        <div className="mt-3 text-sm">
                          {formatTime(event.date)}
                        </div>
                        {!isUpcoming(event.date) && (
                          <div className="mt-3 bg-gray-600 px-3 py-1 rounded-full text-xs">
                            Past Event
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="lg:col-span-3 p-8">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-2xl font-bold text-gray-900">
                          {event.title}
                        </h3>
                        {isUpcoming(event.date) && (
                          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                            Upcoming
                          </span>
                        )}
                      </div>
                      
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        {event.description}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="flex items-center text-gray-700">
                          <Calendar className="h-5 w-5 mr-3 text-primary-600" />
                          <div>
                            <div className="font-medium">{formatDate(event.date)}</div>
                            <div className="text-sm text-gray-500">{formatTime(event.date)}</div>
                          </div>
                        </div>
                        <div className="flex items-center text-gray-700">
                          <Clock className="h-5 w-5 mr-3 text-secondary-600" />
                          <span>{event.duration}</span>
                        </div>
                        <div className="flex items-center text-gray-700">
                          <MapPin className="h-5 w-5 mr-3 text-accent-600" />
                          <span>{event.location}</span>
                        </div>
                      </div>

                      {event.registration_link && isUpcoming(event.date) && (
                        <div className="border-t pt-6">
                          <a
                            href={event.registration_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors duration-200 inline-flex items-center"
                          >
                            Register for Event
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Stay Updated on Future Events
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Don't miss out on our workshops, contests, and special programming designed to enhance your communication and leadership skills.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <Users className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Workshops</h3>
              <p className="text-gray-600">Intensive learning sessions on specialized topics like STEM internships and career preparation.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <Calendar className="h-12 w-12 text-secondary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Competitions</h3>
              <p className="text-gray-600">Opportunities to showcase your skills and compete with peers in communication and leadership challenges.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Events;
import React, { useEffect, useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, MapPin } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [classSchedules, setClassSchedules] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [eventsResponse, classesResponse] = await Promise.all([
        supabase.from('events').select('*').order('date'),
        supabase.from('classes').select('*').eq('active', true)
      ]);

      setEvents(eventsResponse.data || []);
      setClasses(classesResponse.data || []);
      
      // Generate recurring class schedules for the current month
      generateClassSchedules(classesResponse.data || [], currentDate);
    } catch (error) {
      console.error('Error fetching calendar data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateClassSchedules = (classesData: any[], date: Date) => {
    const schedules: any[] = [];
    const year = date.getFullYear();
    const month = date.getMonth();
    
    // Get all days in the current month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    classesData.forEach(classItem => {
      const schedule = classItem.schedule.toLowerCase();
      
      // Parse the schedule to determine which days
      let dayOfWeek = -1;
      if (schedule.includes('monday')) dayOfWeek = 1;
      else if (schedule.includes('tuesday')) dayOfWeek = 2;
      else if (schedule.includes('wednesday')) dayOfWeek = 3;
      else if (schedule.includes('thursday')) dayOfWeek = 4;
      else if (schedule.includes('friday')) dayOfWeek = 5;
      else if (schedule.includes('saturday')) dayOfWeek = 6;
      else if (schedule.includes('sunday')) dayOfWeek = 0;
      
      if (dayOfWeek !== -1) {
        // Find all occurrences of this day in the month
        for (let day = 1; day <= daysInMonth; day++) {
          const currentDay = new Date(year, month, day);
          if (currentDay.getDay() === dayOfWeek) {
            schedules.push({
              id: `${classItem.id}-${day}`,
              title: classItem.name,
              date: currentDay,
              type: 'class',
              classInfo: classItem
            });
          }
        }
      }
    });
    
    setClassSchedules(schedules);
  };

  const getClassSchedulesForDate = (date: Date) => {
    if (!date) return [];
    
    const dateString = date.toDateString();
    return classSchedules.filter(schedule => 
      schedule.date.toDateString() === dateString
    );
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getEventsForDate = (date: Date) => {
    if (!date) return [];
    
    const dateString = date.toISOString().split('T')[0];
    return events.filter(event => {
      const eventDate = new Date(event.date).toISOString().split('T')[0];
      return eventDate === dateString;
    });
  };

  const hasEventsOnDate = (date: Date) => {
    return getEventsForDate(date).length > 0 || getClassSchedulesForDate(date).length > 0;
  };

  const formatMonth = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
    // Regenerate class schedules for the new month
    generateClassSchedules(classes, newDate);
  };

  const isToday = (date: Date) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const days = getDaysInMonth(currentDate);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading calendar...</p>
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
            Calendar
          </h1>
          <p className="text-xl text-gray-600">
            Stay up to date with class schedules and upcoming events
          </p>
        </div>
      </section>

      {/* Calendar Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Calendar Grid */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Calendar Header */}
                <div className="bg-primary-600 text-white p-6">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => navigateMonth('prev')}
                      className="p-2 hover:bg-primary-700 rounded-lg transition-colors"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <h2 className="text-2xl font-bold">{formatMonth(currentDate)}</h2>
                    <button
                      onClick={() => navigateMonth('next')}
                      className="p-2 hover:bg-primary-700 rounded-lg transition-colors"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Days of Week */}
                <div className="grid grid-cols-7 border-b">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="p-3 text-center font-semibold text-gray-700 bg-gray-50">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7">
                  {days.map((day, index) => (
                    <div
                      key={index}
                      className={`min-h-[100px] p-2 border-b border-r ${
                        day ? 'bg-white' : 'bg-gray-50'
                      } ${isToday(day) ? 'bg-blue-50' : ''}`}
                    >
                      {day && (
                        <>
                          <div className={`text-sm font-medium mb-2 ${
                            isToday(day) ? 'text-primary-600 font-bold' : 'text-gray-900'
                          }`}>
                              {getClassSchedulesForDate(day).map(schedule => (
                                <div
                                  key={schedule.id}
                                  className="bg-primary-100 text-primary-800 text-xs p-1 rounded mb-1 truncate"
                                  title={`${schedule.title} - ${schedule.classInfo.schedule}`}
                                >
                                  {schedule.title}
                                </div>
                              ))}
                            {day.getDate()}
                          </div>
                          {hasEventsOnDate(day) && (
                            <div className="space-y-1">
                              {getEventsForDate(day).map(event => (
                                <div
                                  key={event.id}
                                  className="bg-secondary-100 text-secondary-800 text-xs p-1 rounded truncate"
                                  title={event.title}
                                >
                                  {event.title}
                                </div>
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Class Schedules */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <CalendarIcon className="h-5 w-5 mr-2 text-primary-600" />
                  Regular Class Schedule
                </h3>
                <div className="space-y-4">
                  {classes.map(classItem => (
                    <div key={classItem.id} className="border-l-4 border-primary-500 pl-4">
                      <h4 className="font-semibold text-gray-900">{classItem.name}</h4>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <Clock className="h-4 w-4 mr-1" />
                        {classItem.schedule}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        ${classItem.price} • {classItem.current_enrolled}/{classItem.group_limit} enrolled
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming Events */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <CalendarIcon className="h-5 w-5 mr-2 text-secondary-600" />
                  Upcoming Events
                </h3>
                <div className="space-y-4">
                  {events
                    .filter(event => new Date(event.date) >= new Date())
                    .slice(0, 3)
                    .map(event => (
                      <div key={event.id} className="border-l-4 border-secondary-500 pl-4">
                        <h4 className="font-semibold text-gray-900">{event.title}</h4>
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          {new Date(event.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-1" />
                          {event.location}
                        </div>
                      </div>
                    ))}
                  {events.filter(event => new Date(event.date) >= new Date()).length === 0 && (
                    <p className="text-gray-500 text-sm">No upcoming events scheduled</p>
                  )}
                </div>
              </div>

              {/* Google Calendar Integration */}
              <div className="bg-primary-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Subscribe to Our Calendar
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Add our calendar to your Google Calendar to never miss a class or event.
                </p>
                <button className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
                  Subscribe to Calendar
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Calendar;
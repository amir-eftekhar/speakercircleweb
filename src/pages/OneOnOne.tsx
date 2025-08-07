import React, { useEffect, useState } from 'react';
import { Mail, BookOpen, Code, Briefcase, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const OneOnOne: React.FC = () => {
  const [oneOnOneInfo, setOneOnOneInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOneOnOneInfo();
  }, []);

  const fetchOneOnOneInfo = async () => {
    try {
      const { data, error } = await supabase
        .from('one_on_one')
        .select('*')
        .eq('active', true)
        .single();
      
      if (error) throw error;
      setOneOnOneInfo(data);
    } catch (error) {
      console.error('Error fetching one-on-one info:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading information...</p>
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
            1-on-1 Coaching
          </h1>
          <p className="text-xl text-gray-600">
            Personalized learning tailored to your specific goals and interests
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Customized Learning Experience
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                {oneOnOneInfo?.description || 'Speakers Circle one on one classes available on request. Subjects: English, coding, interview prep with customized projects for tech careers.'}
              </p>
            </div>
            <div>
              <img 
                src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg" 
                alt="One-on-one tutoring session" 
                className="w-full h-64 object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Subjects Offered */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Subjects Available
            </h2>
            <p className="text-lg text-gray-600">
              Specialized instruction tailored to your learning goals
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">English</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Grammar and composition</li>
                <li>• Reading comprehension</li>
                <li>• Essay writing</li>
                <li>• Literature analysis</li>
                <li>• Public speaking</li>
              </ul>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="bg-secondary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Code className="h-8 w-8 text-secondary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Coding</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Programming fundamentals</li>
                <li>• Web development</li>
                <li>• Project-based learning</li>
                <li>• Problem-solving skills</li>
                <li>• Career preparation</li>
              </ul>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="bg-accent-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Briefcase className="h-8 w-8 text-accent-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Interview Prep</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Mock interviews</li>
                <li>• Resume building</li>
                <li>• Communication skills</li>
                <li>• Confidence building</li>
                <li>• Tech career guidance</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose 1-on-1 Coaching?
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Flexible Scheduling</h3>
              <p className="text-gray-600">Sessions scheduled around your availability</p>
            </div>
            <div className="text-center">
              <div className="bg-secondary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-secondary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Personalized Curriculum</h3>
              <p className="text-gray-600">Learning plan tailored to your specific needs</p>
            </div>
            <div className="text-center">
              <div className="bg-accent-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="h-8 w-8 text-accent-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Career Focus</h3>
              <p className="text-gray-600">Direct application to your career goals</p>
            </div>
            <div className="text-center">
              <div className="bg-neutral-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-neutral-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Direct Access</h3>
              <p className="text-gray-600">One-on-one attention from experienced instructor</p>
            </div>
          </div>
        </div>
      </section>

      {/* Instructions Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            How to Get Started
          </h2>
          <p className="text-xl mb-8">
            Follow these simple steps to request 1-on-1 coaching:
          </p>
          
          <div className="bg-white bg-opacity-10 p-8 rounded-lg mb-8">
            <div className="space-y-6">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-white bg-opacity-20 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <span className="text-2xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-semibold">Submit the 1-on-1 Form</h3>
              </div>
              
              <a
                href="https://forms.gle/nZFP27LfatMvjcWF8"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors duration-200 inline-flex items-center"
              >
                Fill Out 1-on-1 Google Form
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="bg-white bg-opacity-10 p-8 rounded-lg">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-white bg-opacity-20 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold">Contact Us</h3>
            </div>
            
            <p className="text-lg mb-6">
              Once submitted, email gallantgaveliers@gmail.com, or message Shalini at 925-895-9573
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a
                href="mailto:gallantgaveliers@gmail.com"
                className="bg-white bg-opacity-20 text-white px-6 py-3 rounded-lg hover:bg-opacity-30 transition-colors inline-flex items-center justify-center"
              >
                <Mail className="h-5 w-5 mr-2" />
                Send Email
              </a>
              <a
                href="tel:925-895-9573"
                className="bg-white bg-opacity-20 text-white px-6 py-3 rounded-lg hover:bg-opacity-30 transition-colors inline-flex items-center justify-center"
              >
                📱 Text: 925-895-9573
              </a>
            </div>
            
            <p className="mt-6 text-primary-200">
              We'll respond within 24 hours to discuss your specific needs and schedule.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OneOnOne;
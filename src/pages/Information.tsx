import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Clock, Users, BookOpen, Star } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Information: React.FC = () => {
  const [pageContent, setPageContent] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPageContent();
  }, []);

  const fetchPageContent = async () => {
    try {
      const { data } = await supabase
        .from('pages')
        .select('*')
        .in('slug', ['program-pathway', 'skills-developed', 'additional-classes']);
      
      if (data) {
        const content = data.reduce((acc, page) => {
          acc[page.slug] = page;
          return acc;
        }, {});
        setPageContent(content);
      }
    } catch (error) {
      console.error('Error fetching page content:', error);
    } finally {
      setLoading(false);
    }
  };

  const defaultSkills = [
    'Confidence in public speaking',
    'Effective communication',
    'Leadership abilities',
    'Critical thinking',
    'Team collaboration',
    'Time management',
    'Emotional intelligence',
    'Professional presentation skills'
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-200 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Program Information
          </h1>
          <p className="text-xl text-gray-600">
            Discover our comprehensive pathway to developing communication and leadership skills
          </p>
        </div>
      </section>

      {/* Speakers Circle Program Pathway */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Speakers Circle Program Pathway
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {pageContent['program-pathway']?.content || 'A structured journey designed to build your communication and leadership skills step by step.'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Step 1: Youth Leadership Circle */}
            <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-primary-200">
              <div className="flex items-center mb-6">
                <div className="bg-primary-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <span className="text-2xl font-bold text-primary-600">1</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Youth Leadership Circle (YLC)</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center text-gray-700">
                  <Clock className="h-5 w-5 mr-3 text-primary-600" />
                  <span className="font-medium">6–8 weeks</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-3 text-green-600 mt-0.5" />
                    <span className="text-gray-700">Attend meetings</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-3 text-green-600 mt-0.5" />
                    <span className="text-gray-700">Deliver 2 speeches</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-3 text-green-600 mt-0.5" />
                    <span className="text-gray-700">Do evaluations</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-3 text-green-600 mt-0.5" />
                    <span className="text-gray-700">Gain firsthand public speaking and leadership experience</span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <a
                  href="http://tinyurl.com/SpeakersCircleYLP"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors duration-200 inline-flex items-center"
                >
                  Register for YLC
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Step 2: Gavel Club */}
            <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-secondary-200">
              <div className="flex items-center mb-6">
                <div className="bg-secondary-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <span className="text-2xl font-bold text-secondary-600">2</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Gavel Club</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center text-gray-700">
                  <Users className="h-5 w-5 mr-3 text-secondary-600" />
                  <span className="font-medium">After completing YLC</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-3 text-green-600 mt-0.5" />
                    <span className="text-gray-700">Monthly public speaking practice</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-3 text-green-600 mt-0.5" />
                    <span className="text-gray-700">Leadership development activities</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-3 text-green-600 mt-0.5" />
                    <span className="text-gray-700">Advanced skill building</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 mr-3 text-green-600 mt-0.5" />
                    <span className="text-gray-700">Mentorship opportunities</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Developed */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Skills Developed
            </h2>
            <p className="text-lg text-gray-600">
              {pageContent['skills-developed']?.content || 'Through our programs, students develop essential life skills that serve them in all areas of their personal and professional lives.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {defaultSkills.map((skill, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-accent-600 mr-3" />
                  <span className="text-gray-800 font-medium">{skill}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Classes */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Additional Classes
            </h2>
            <p className="text-lg text-gray-600">
              {pageContent['additional-classes']?.content || 'Specialized programs designed for different age groups and skill levels.'}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              <div className="md:col-span-1">
                <div className="bg-accent-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-10 w-10 text-accent-600" />
                </div>
              </div>
              <div className="md:col-span-2">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  CICC – Elementary Interpersonal Communication Camp
                </h3>
                <div className="space-y-2 text-gray-700">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-3 text-accent-600" />
                    <span><strong>Audience:</strong> Elementary Students</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-3 text-accent-600" />
                    <span><strong>Time:</strong> Mondays 3:45–4:45 PM</span>
                  </div>
                </div>
                <p className="text-gray-600 mt-4">
                  A fun and interactive program designed to help elementary students develop basic communication skills, confidence, and social interaction abilities in a supportive environment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Begin Your Journey?
          </h2>
          <p className="text-xl mb-8">
            Start with our Youth Leadership Circle and discover your voice as a leader.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="http://tinyurl.com/SpeakersCircleYLP"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors duration-200 inline-flex items-center justify-center"
            >
              Register for YLC
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
            <Link
              to="/contact"
              className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors duration-200"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Information;
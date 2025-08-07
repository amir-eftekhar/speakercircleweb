import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Award, Calendar, MessageSquare } from 'lucide-react';
import { supabase } from '../lib/supabase';
import SignupTest from '../components/SignupTest';

const Home: React.FC = () => {
  const [siteSettings, setSiteSettings] = useState<any>(null);
  const [homeContent, setHomeContent] = useState<any>(null);

  useEffect(() => {
    fetchSiteSettings();
    fetchHomeContent();
  }, []);

  const fetchSiteSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .single();
      
      if (error) {
        console.error('Error fetching site settings:', error);
        return;
      }
      
      setSiteSettings(data);
    } catch (error) {
      console.error('Failed to fetch site settings:', error);
    }
  };

  const fetchHomeContent = async () => {
    try {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', 'home')
        .single();
      
      if (error) {
        console.error('Error fetching home content:', error);
        return;
      }
      
      setHomeContent(data);
    } catch (error) {
      console.error('Failed to fetch home content:', error);
    }
  };

  return (
    <div className="bg-white">
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-br from-blue-50 to-orange-50 py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-secondary-100"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <img 
                src="https://i.imgur.com/Uqxojaz.png" 
                alt="SpeakersCircle Logo" 
                className="h-16 w-16 mr-4"
              />
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
                Your Voice is Your Superpower
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              A Leadership & Communication Program by Speakers Circle
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="http://tinyurl.com/SpeakersCircleYLP"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-primary-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary-700 transition-colors duration-200 inline-flex items-center justify-center"
              >
                Register for YLC
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
              <Link
                to="/information"
                className="bg-accent-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-accent-700 transition-colors duration-200 inline-flex items-center justify-center"
              >
                Explore our Programs
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Stay Connected
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            {homeContent?.content || 'Keep up with the latest news, events, and student achievements from Speakers Circle.'}
          </p>
          <div className="bg-primary-50 p-8 rounded-xl">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Check out this month's newsletter!
            </h3>
            <p className="text-gray-600 mb-6">
              Get the latest updates on student achievements, upcoming events, and program highlights.
            </p>
            <button className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors duration-200 inline-flex items-center">
              Check out this month's newsletter!
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Students Say
            </h2>
            <p className="text-lg text-gray-600">
              Hear from young leaders who've transformed their communication skills
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <div className="bg-primary-100 w-12 h-12 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary-600" />
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900">Sarah M.</h4>
                  <p className="text-sm text-gray-600">YLC Graduate</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "Speakers Circle helped me find my voice and confidence. I went from being afraid to speak up in class to leading presentations at school!"
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <div className="bg-secondary-100 w-12 h-12 rounded-full flex items-center justify-center">
                  <Award className="h-6 w-6 text-secondary-600" />
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900">Alex P.</h4>
                  <p className="text-sm text-gray-600">Gavel Club Member</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "The leadership skills I learned here helped me become student body president. The program truly changes lives!"
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex items-center mb-4">
                <div className="bg-accent-100 w-12 h-12 rounded-full flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-accent-600" />
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900">Emily R.</h4>
                  <p className="text-sm text-gray-600">Parent</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "My daughter has grown so much in confidence and communication skills. Shalini's teaching approach is exceptional!"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <blockquote className="text-2xl md:text-3xl font-medium leading-relaxed">
            "Empowering youth with the confidence to speak, the clarity to lead, and the courage to inspire—because your voice is your superpower."
          </blockquote>
          <cite className="block mt-6 text-xl text-primary-200">
            — Shalini Suravarjjala, Founder & Director
          </cite>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to Unlock Your Voice?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join our community of young leaders and start your journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-accent-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-accent-700 transition-colors duration-200 inline-flex items-center justify-center"
            >
              Register for Classes
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/contact"
              className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:border-gray-400 hover:bg-gray-50 transition-colors duration-200"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
      
      {/* Development Test Component */}
      {import.meta.env.DEV && <SignupTest />}
    </div>
  );
};

export default Home;
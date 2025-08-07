import React, { useEffect, useState } from 'react';
import { Heart, Target, Lightbulb } from 'lucide-react';
import { supabase } from '../lib/supabase';

const About: React.FC = () => {
  const [pageContent, setPageContent] = useState<any>({});

  useEffect(() => {
    fetchPageContent();
  }, []);

  const fetchPageContent = async () => {
    const { data } = await supabase
      .from('pages')
      .select('*')
      .in('slug', ['mission', 'vision', 'founder-bio']);
    
    if (data) {
      const content = data.reduce((acc, page) => {
        acc[page.slug] = page;
        return acc;
      }, {});
      setPageContent(content);
    }
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-200 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About SpeakersCircle
          </h1>
          <p className="text-xl text-gray-600">
            Empowering the next generation of leaders through communication excellence
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-6">
                <Target className="h-8 w-8 text-primary-600 mr-3" />
                <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
              </div>
              <p className="text-lg text-gray-600 leading-relaxed">
                {pageContent['mission']?.content || 'At SpeakersCircle, we believe that your voice is your superpower. By fostering strong communication, leadership, and life skills, we help individuals unlock their full potential, build meaningful connections, and create a lasting impact in their personal and professional lives.'}
              </p>
            </div>
            <div className="bg-primary-50 p-8 rounded-lg">
              <img 
                src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg" 
                alt="Students in discussion" 
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <img 
                src="https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg" 
                alt="Youth leadership" 
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
            <div className="order-1 lg:order-2">
              <div className="flex items-center mb-6">
                <Lightbulb className="h-8 w-8 text-accent-600 mr-3" />
                <h2 className="text-3xl font-bold text-gray-900">Our Vision</h2>
              </div>
              <p className="text-lg text-gray-600 leading-relaxed">
                {pageContent['vision']?.content || 'SpeakersCircle is dedicated to equipping youth with essential communication skills—verbal, non-verbal, email, and phone etiquette, social media presence—while helping them build strong personal and professional networks.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <Heart className="h-8 w-8 text-primary-600 mr-3" />
              <h2 className="text-3xl font-bold text-gray-900">Meet Our Founder</h2>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <img 
                  src="https://i.imgur.com/pQZ4zdf.jpeg" 
                  alt="Shalini Suravarjjala" 
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
              <div className="md:col-span-2">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Shalini Suravarjjala</h3>
                <p className="text-lg text-primary-600 mb-4">Director and Founder of SpeakersCircle</p>
                <div className="text-gray-600 space-y-4">
                  <p>
                    {pageContent['founder-bio']?.content || 'I am a software engineer by profession. I teach youth to communicate confidently and effectively in speech, conversations, emails, phone calls, and social media. Helping them lead in their clubs, schools, job searches, interviews, and beyond.'}
                  </p>
                  <p>
                    I am a positive inspiration to both my own children and the youth students. My ability to teach through relatable analogies and examples. I work with patience and adaptability in teaching communication, leadership, and technology.
                  </p>
                  <p>
                    I encourage students to express their opinions and feelings confidently with clarity, support them to embrace their unique voices, and pay it forward by mentoring others. I am deeply committed to making a difference in the lives of youth.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <blockquote className="text-2xl md:text-3xl font-medium leading-relaxed mb-8">
            "I empower youth to unlock their potential by educating them to communicate confidently, lead effectively, and inspire others in their personal, professional, and community lives."
          </blockquote>
          <div className="border-t border-primary-400 pt-8">
            <h3 className="text-xl font-semibold mb-4">Power of Mentorship</h3>
            <p className="text-lg leading-relaxed">
              The most important lesson is that every individual has the power to make a positive impact if they embrace their voice, believe in themselves, and focus on lifting others. Small acts of mentorship and encouragement can create a ripple effect of growth and transformation.
            </p>
            <cite className="block mt-4 text-primary-200">— Shalini Suravarjjala</cite>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
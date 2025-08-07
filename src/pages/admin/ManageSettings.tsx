import React, { useEffect, useState } from 'react';
import { Save, Settings, Globe, Mail, Image } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const ManageSettings: React.FC = () => {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    logo_url: '',
    slogan: '',
    hero_text: '',
    footer_text: '',
    contact_email: ''
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setSettings(data);
        setFormData({
          logo_url: data.logo_url || '',
          slogan: data.slogan || '',
          hero_text: data.hero_text || '',
          footer_text: data.footer_text || '',
          contact_email: data.contact_email || ''
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
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
    setSaving(true);
    
    try {
      const settingsData = {
        logo_url: formData.logo_url,
        slogan: formData.slogan,
        hero_text: formData.hero_text,
        footer_text: formData.footer_text,
        contact_email: formData.contact_email,
        updated_at: new Date().toISOString()
      };

      if (settings) {
        const { error } = await supabase
          .from('site_settings')
          .update(settingsData)
          .eq('id', settings.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('site_settings')
          .insert([settingsData]);
        
        if (error) throw error;
      }

      await fetchSettings();
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading settings...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Site Settings</h1>
              <p className="text-gray-600 mt-2">Manage global website settings and configuration</p>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Settings className="h-4 w-4 mr-2" />
              Last updated: {settings?.updated_at ? new Date(settings.updated_at).toLocaleDateString() : 'Never'}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Branding Section */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <Image className="h-6 w-6 text-primary-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Branding</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo URL
                </label>
                <input
                  type="url"
                  name="logo_url"
                  value={formData.logo_url}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="https://example.com/logo.png"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Current logo: https://i.imgur.com/Uqxojaz.png
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Site Slogan
                </label>
                <input
                  type="text"
                  name="slogan"
                  value={formData.slogan}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Your Voice is your Superpower"
                />
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <Globe className="h-6 w-6 text-secondary-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Website Content</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hero Text
                </label>
                <textarea
                  name="hero_text"
                  rows={3}
                  value={formData.hero_text}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  placeholder="Empowering youth with the confidence to speak, the clarity to lead, and the courage to inspire."
                />
                <p className="text-sm text-gray-500 mt-1">
                  This text appears on the homepage hero section
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Footer Text
                </label>
                <input
                  type="text"
                  name="footer_text"
                  value={formData.footer_text}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="© 2025 SpeakersCircle. All rights reserved."
                />
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <Mail className="h-6 w-6 text-accent-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Contact Information</h2>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Email
              </label>
              <input
                type="email"
                name="contact_email"
                value={formData.contact_email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="shalini@speakerscircle.com"
              />
              <p className="text-sm text-gray-500 mt-1">
                This email will be used for contact forms and general inquiries
              </p>
            </div>
          </div>

          {/* Stripe Configuration */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <Settings className="h-6 w-6 text-neutral-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Payment Configuration</h2>
            </div>
            
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-6">
              <h3 className="font-semibold text-primary-900 mb-3">Stripe Integration Status</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-primary-700">Payment Method:</span>
                  <span className="font-mono text-primary-900">Payment Links</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-primary-700">Environment:</span>
                  <span className="text-primary-900">Stripe Dashboard</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-primary-700">Status:</span>
                  <span className="text-yellow-600 font-medium">⚠ Configure Links</span>
                </div>
              </div>
              <p className="text-primary-700 text-sm mt-4">
                Configure Stripe Payment Links in src/lib/stripe-payment-links.ts for each class.
              </p>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center"
            >
              {saving ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              ) : (
                <Save className="h-5 w-5 mr-2" />
              )}
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManageSettings;
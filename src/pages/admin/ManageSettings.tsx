import React, { useEffect, useState } from 'react';
import { Save, Settings, Globe, Mail, Image, Lock, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { hashPassword, verifyPassword, DEFAULT_ADMIN_PASSWORD } from '../../lib/auth-utils';

const ManageSettings: React.FC = () => {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    logo_url: '',
    slogan: '',
    hero_text: '',
    footer_text: '',
    contact_email: '',
    payment_script_url: ''
  });
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

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
          contact_email: data.contact_email || '',
          payment_script_url: data.payment_script_url || ''
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

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.new_password !== passwordData.confirm_password) {
      alert('New passwords do not match');
      return;
    }

    if (passwordData.new_password.length < 6) {
      alert('New password must be at least 6 characters long');
      return;
    }

    setPasswordLoading(true);

    try {
      // Check current password - it could be the temporary password or a database-stored one
      let currentPasswordValid = false;
      
      if (settings?.admin_password_hash) {
        // Verify against database-stored password
        currentPasswordValid = await verifyPassword(passwordData.current_password, settings.admin_password_hash);
      } else {
        // Verify against temporary password
        currentPasswordValid = passwordData.current_password === DEFAULT_ADMIN_PASSWORD;
      }

      if (!currentPasswordValid) {
        alert('Current password is incorrect');
        return;
      }

      // Hash new password
      const newPasswordHash = await hashPassword(passwordData.new_password);

      // Update password in database
      const updateData = {
        admin_password_hash: newPasswordHash,
        updated_at: new Date().toISOString()
      };

      if (settings) {
        const { error } = await supabase
          .from('site_settings')
          .update(updateData)
          .eq('id', settings.id);
        
        if (error) throw error;
      } else {
        // Create new settings record
        const { error } = await supabase
          .from('site_settings')
          .insert([{
            slogan: 'Your Voice is your Superpower',
            hero_text: 'Empowering youth with the confidence to speak, the clarity to lead, and the courage to inspire.',
            footer_text: '© 2025 SpeakersCircle. All rights reserved.',
            contact_email: 'shalini@speakerscircle.com',
            ...updateData
          }]);
        
        if (error) throw error;
      }

      alert('Admin password updated successfully! The temporary password is no longer valid.');
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
      await fetchSettings();
    } catch (error) {
      console.error('Error updating password:', error);
      alert('Error updating password. Please make sure the database schema has been updated.');
    } finally {
      setPasswordLoading(false);
    }
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
        payment_script_url: formData.payment_script_url,
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

          {/* Payment Configuration */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <Settings className="h-6 w-6 text-neutral-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Payment Configuration</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Script URL
                </label>
                <input
                  type="url"
                  name="payment_script_url"
                  value={formData.payment_script_url}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="https://buy.stripe.com/xxx or https://js.stripe.com/v3/"
                />
                <p className="text-sm text-gray-500 mt-1">
                  <strong>For Stripe Payment Links:</strong> Use the direct Payment Link URL (https://buy.stripe.com/xxx) - it will be embedded or opened in a new tab.<br/>
                  <strong>For Stripe.js or other processors:</strong> Use the script URL (https://js.stripe.com/v3/ or similar).
                </p>
              </div>
              
              <div className="bg-primary-50 border border-primary-200 rounded-lg p-6">
                <h3 className="font-semibold text-primary-900 mb-3">Current Payment Setup</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-primary-700">Payment Method:</span>
                    <span className="font-mono text-primary-900">
                      {formData.payment_script_url?.includes('buy.stripe.com') 
                        ? 'Stripe Payment Link' 
                        : 'Custom Script/API'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-primary-700">Script URL:</span>
                    <span className="text-primary-900 break-all">
                      {formData.payment_script_url || 'Not configured'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-primary-700">Status:</span>
                    <span className={`font-medium ${formData.payment_script_url ? 'text-green-600' : 'text-yellow-600'}`}>
                      {formData.payment_script_url ? '✅ Configured' : '⚠ Configure Script URL'}
                    </span>
                  </div>
                </div>
                <p className="text-primary-700 text-sm mt-4">
                  {formData.payment_script_url?.includes('buy.stripe.com')
                    ? 'Stripe Payment Links will be embedded directly in the payment page or opened in a new tab for seamless checkout.'
                    : 'The payment page will load this script to handle payment processing. Use your payment processor\'s JavaScript SDK URL.'
                  }
                </p>
                <div className="mt-4 space-y-3">
                  {!formData.payment_script_url && (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                      <p className="text-sm text-yellow-700">
                        <strong>Note:</strong> Make sure to update the database schema first by adding the required columns.
                      </p>
                    </div>
                  )}
                  
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                    <h4 className="text-sm font-semibold text-blue-900 mb-2">Examples:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li><strong>Stripe Payment Link:</strong> https://buy.stripe.com/test_xxx</li>
                      <li><strong>Stripe.js SDK:</strong> https://js.stripe.com/v3/</li>
                      <li><strong>PayPal SDK:</strong> https://www.paypal.com/sdk/js?client-id=xxx</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Admin Security */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <Lock className="h-6 w-6 text-red-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Admin Security</h2>
            </div>
            
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-blue-900 mb-2">Change Admin Password</h3>
                <p className="text-sm text-blue-700">
                  {settings?.admin_password_hash 
                    ? 'Update your secure admin password. Your current database-stored password will be replaced.'
                    : 'Set a secure admin password. Currently using temporary password: SCAdmin2025'
                  }
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      name="current_password"
                      value={passwordData.current_password}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter current password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      name="new_password"
                      value={passwordData.new_password}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter new password"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirm_password"
                      value={passwordData.confirm_password}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Confirm new password"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center"
                >
                  {passwordLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Lock className="h-5 w-5 mr-2" />
                  )}
                  {passwordLoading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
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
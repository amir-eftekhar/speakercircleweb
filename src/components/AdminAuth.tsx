import React, { useState, useEffect } from 'react';
import { Shield, Eye, EyeOff } from 'lucide-react';
import { DEFAULT_ADMIN_PASSWORD } from '../lib/auth-utils';

interface AdminAuthProps {
  children: React.ReactNode;
}

const AdminAuth: React.FC<AdminAuthProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    initializeAdminAuth();
  }, []);

  const initializeAdminAuth = async () => {
    try {
      // Check if already authenticated
      const authStatus = localStorage.getItem('sc_admin_auth');
      if (authStatus === 'true') {
        setIsAuthenticated(true);
      }

      // Initialize admin password if not exists
      await ensureAdminPasswordExists();
    } catch (error) {
      console.error('Error initializing admin auth:', error);
    } finally {
      setIsInitializing(false);
    }
  };

  const ensureAdminPasswordExists = async () => {
    try {
      // For now, we'll just use the default password since the database 
      // might not have the admin_password_hash column yet
      console.log('Admin authentication initialized with default password');
    } catch (error) {
      console.error('Error ensuring admin password exists:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // For now, use the hardcoded password until database is updated
      if (passcode === DEFAULT_ADMIN_PASSWORD) {
        setIsAuthenticated(true);
        localStorage.setItem('sc_admin_auth', 'true');
        setError('');
      } else {
        setError('Invalid passcode. Please try again.');
        setPasscode('');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setError('Authentication failed. Please try again.');
      setPasscode('');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('sc_admin_auth');
    setPasscode('');
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Initializing admin authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-primary-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Access</h1>
            <p className="text-gray-600">Enter the admin passcode to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="passcode" className="block text-sm font-medium text-gray-700 mb-2">
                Passcode
              </label>
              <div className="relative">
                <input
                  type={showPasscode ? 'text' : 'password'}
                  id="passcode"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter admin passcode"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPasscode(!showPasscode)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPasscode ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-semibold transition-colors duration-200 ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-primary-600 hover:bg-primary-700'
              } text-white`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Verifying...
                </div>
              ) : (
                'Access Admin Panel'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-sm text-primary-600 hover:text-primary-700 transition-colors"
            >
              ← Back to Website
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Logout button in admin panel */}
      <div className="hidden" id="admin-logout">
        <button
          onClick={handleLogout}
          className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          Logout
        </button>
      </div>
      {children}
    </div>
  );
};

export default AdminAuth;
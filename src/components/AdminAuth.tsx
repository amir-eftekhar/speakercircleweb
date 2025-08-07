import React, { useState, useEffect } from 'react';
import { Shield, Eye, EyeOff } from 'lucide-react';

interface AdminAuthProps {
  children: React.ReactNode;
}

const AdminAuth: React.FC<AdminAuthProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if already authenticated
    const authStatus = localStorage.getItem('sc_admin_auth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === 'SCAdmin2025') {
      setIsAuthenticated(true);
      localStorage.setItem('sc_admin_auth', 'true');
      setError('');
    } else {
      setError('Invalid passcode. Please try again.');
      setPasscode('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('sc_admin_auth');
    setPasscode('');
  };

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
              className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors duration-200"
            >
              Access Admin Panel
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
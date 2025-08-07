import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/information', label: 'Information' },
    { path: '/events', label: 'Events' },
    { path: '/payment', label: 'Payment' },
    { path: '/1on1', label: '1-on-1' },
  ];

  const isActive = (path: string) => location.pathname === path;


  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="https://i.imgur.com/Uqxojaz.png" 
                alt="SpeakersCircle Logo" 
                className="h-8 w-8"
              />
              <span className="text-xl font-bold text-gray-900">SpeakersCircle</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <nav className="flex space-x-8">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                      isActive(item.path)
                        ? 'text-primary-600 border-b-2 border-primary-600'
                        : 'text-gray-700 hover:text-primary-600'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              
              {/* User Authentication */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors duration-200"
                  >
                    <User className="h-4 w-4" />
                    <span>{user.name}</span>
                  </button>
                  
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                      <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                        <div className="font-medium">{user.name}</div>
                        <div className="text-gray-500">{user.email}</div>
                      </div>
                      <Link
                        to="/payment"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Make Payment
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="text-primary-600 hover:text-primary-700 px-3 py-2 text-sm font-medium transition-colors duration-200"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors duration-200"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>


            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-primary-600 focus:outline-none focus:text-primary-600"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`block px-3 py-2 text-base font-medium transition-colors duration-200 ${
                    isActive(item.path)
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              
              {/* Mobile User Authentication */}
              {user ? (
                <div className="px-3 py-2 border-t border-gray-200 mt-2">
                  <div className="text-sm text-gray-600 mb-2">
                    <div className="font-medium">{user.name}</div>
                    <div className="text-gray-500">{user.email}</div>
                  </div>
                  <Link
                    to="/payment"
                    className="block px-3 py-2 text-base font-medium text-primary-600 hover:bg-primary-50 transition-colors duration-200 rounded-lg mb-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Make Payment
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 transition-colors duration-200 rounded-lg flex items-center"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="px-3 py-2 border-t border-gray-200 mt-2 space-y-2">
                  <Link
                    to="/login"
                    className="block px-3 py-2 text-base font-medium text-primary-600 hover:bg-primary-50 transition-colors duration-200 rounded-lg text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="block px-3 py-2 text-base font-medium bg-primary-600 text-white hover:bg-primary-700 transition-colors duration-200 rounded-lg text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img 
                  src="https://i.imgur.com/Uqxojaz.png" 
                  alt="SpeakersCircle Logo" 
                  className="h-6 w-6"
                />
                <span className="text-lg font-bold">Speakers Circle</span>
              </div>
              <p className="text-gray-400">
                A Leadership & Communication Program
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Social Links</h3>
              <ul className="space-y-2">
                <li>
                  <a 
                    href="#" 
                    className="text-gray-400 hover:text-white transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Instagram
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">About</Link></li>
                <li><Link to="/events" className="text-gray-400 hover:text-white transition-colors">Events</Link></li>
                <li><Link to="/payment" className="text-gray-400 hover:text-white transition-colors">Payment</Link></li>
                <li><Link to="/admin" className="text-gray-400 hover:text-white transition-colors">Admin</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <p className="text-gray-400 mb-2">
                Email: <a href="mailto:gallantgaveliers@gmail.com" className="hover:text-white transition-colors">gallantgaveliers@gmail.com</a>
              </p>
              <p className="text-gray-400 mb-4">
                Phone (Weekdays 9–5): <a href="tel:925-895-9573" className="hover:text-white transition-colors">925-895-9573</a>
              </p>
              
              <div className="mt-6 pt-4 border-t border-gray-700">
                <div className="flex flex-col space-y-2 text-sm">
                  <div className="flex space-x-4">
                    <span className="text-gray-400 hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
                    <span className="text-gray-400">|</span>
                    <span className="text-gray-400 hover:text-white transition-colors cursor-pointer">Terms of Use</span>
                  </div>
                  <p className="text-gray-500">
                    © 2025 Speakers Circle. All rights reserved.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
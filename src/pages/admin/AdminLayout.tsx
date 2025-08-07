import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Calendar, 
  FileText, 
  Settings, 
  CreditCard,
  UserCheck,
  LogOut
} from 'lucide-react';
import AdminAuth from '../../components/AdminAuth';

const AdminLayout: React.FC = () => {
  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { path: '/admin/students', label: 'Students', icon: Users },
    { path: '/admin/classes', label: 'Classes', icon: BookOpen },
    { path: '/admin/one-on-one-requests', label: '1-on-1 Requests', icon: UserCheck },
    { path: '/admin/events', label: 'Events', icon: Calendar },
    { path: '/admin/pages', label: 'Pages', icon: FileText },
    { path: '/admin/payments', label: 'Payments', icon: CreditCard },
    { path: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  const handleLogout = () => {
    localStorage.removeItem('sc_admin_auth');
    window.location.href = '/';
  };

  return (
    <AdminAuth>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg">
          <div className="p-6 border-b">
            <div className="flex items-center space-x-2">
              <img 
                src="https://i.imgur.com/Uqxojaz.png" 
                alt="SpeakersCircle Logo" 
                className="h-8 w-8"
              />
              <span className="text-xl font-bold text-gray-900">Admin Panel</span>
            </div>
          </div>
          
          <nav className="mt-6">
            <div className="px-4 space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.exact}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`
                  }
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.label}
                </NavLink>
              ))}
            </div>
          </nav>

          {/* Footer */}
          <div className="absolute bottom-0 w-64 p-4 border-t bg-gray-50 space-y-2">
            <NavLink
              to="/"
              className="flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
              ← Back to Website
            </NavLink>
            <button
              onClick={handleLogout}
              className="flex items-center text-sm text-red-600 hover:text-red-700 transition-colors"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </AdminAuth>
  );
};

export default AdminLayout;
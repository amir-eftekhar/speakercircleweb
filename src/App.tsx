import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import About from './pages/About';
import Information from './pages/Information';
import OneOnOne from './pages/OneOnOne';
import Events from './pages/Events';
import Payment from './pages/Payment';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Confirmation from './pages/Confirmation';
import Contact from './pages/Contact';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import ManageClasses from './pages/admin/ManageClasses';
import ManageStudents from './pages/admin/ManageStudents';
import ManageOneOnOneRequests from './pages/admin/ManageOneOnOneRequests';
import ManagePages from './pages/admin/ManagePages';
import ManageEvents from './pages/admin/ManageEvents';
import ManagePayments from './pages/admin/ManagePayments';
import ManageSettings from './pages/admin/ManageSettings';
import OneOnOneInterest from './pages/OneOnOneInterest';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/about" element={<Layout><About /></Layout>} />
          <Route path="/information" element={<Layout><Information /></Layout>} />
          <Route path="/events" element={<Layout><Events /></Layout>} />
          <Route path="/1on1" element={<Layout><OneOnOne /></Layout>} />
          <Route path="/one-on-one-interest" element={<Layout><OneOnOneInterest /></Layout>} />
          <Route path="/confirmation" element={<Layout><Confirmation /></Layout>} />
          <Route path="/contact" element={<Layout><Contact /></Layout>} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected Routes */}
          <Route path="/payment" element={<Layout><ProtectedRoute><Payment /></ProtectedRoute></Layout>} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="classes" element={<ManageClasses />} />
            <Route path="students" element={<ManageStudents />} />
            <Route path="one-on-one-requests" element={<ManageOneOnOneRequests />} />
            <Route path="pages" element={<ManagePages />} />
            <Route path="events" element={<ManageEvents />} />
            <Route path="payments" element={<ManagePayments />} />
            <Route path="settings" element={<ManageSettings />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
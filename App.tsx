import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import AdminLogin from './pages/admin/Login';
import AdminLayout from './components/layouts/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import AdminSettingsPage from './pages/admin/Settings';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Home />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="settings" element={<AdminSettingsPage />} />
          
          {/* Placeholder routes for nav items */}
          <Route path="users" element={<div className="text-slate-400">User Management Module Coming Soon</div>} />
          <Route path="analytics" element={<div className="text-slate-400">Analytics Module Coming Soon</div>} />
          <Route path="content" element={<div className="text-slate-400">Content Management Module Coming Soon</div>} />
          <Route path="announcements" element={<div className="text-slate-400">Announcements Module Coming Soon (Use Settings)</div>} />
          <Route path="*" element={<div className="text-slate-400">Page not found</div>} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;
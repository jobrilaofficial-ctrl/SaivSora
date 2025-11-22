import React, { useEffect } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { AdminAuth } from '../../services/adminAuth';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  BarChart, 
  LogOut, 
  DownloadCloud,
  Shield,
  FileText,
  Megaphone
} from 'lucide-react';

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const admin = AdminAuth.getAdminUser();

  useEffect(() => {
    if (!AdminAuth.isAuthenticated()) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    AdminAuth.logout();
    navigate('/admin/login');
  };

  if (!admin) return null;

  const navItems = [
    { icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: <Users className="w-5 h-5" />, label: 'Users', path: '/admin/users' },
    { icon: <BarChart className="w-5 h-5" />, label: 'Analytics', path: '/admin/analytics' },
    { icon: <FileText className="w-5 h-5" />, label: 'Content', path: '/admin/content' },
    { icon: <Megaphone className="w-5 h-5" />, label: 'Announcements', path: '/admin/announcements' },
    { icon: <Settings className="w-5 h-5" />, label: 'Settings', path: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex text-slate-200">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col fixed h-full z-10">
        <div className="p-6 flex items-center gap-2 border-b border-slate-800">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <DownloadCloud className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-lg text-white tracking-tight">Admin Panel</span>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-blue-600/10 text-blue-400 font-medium' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-500">
              <Shield className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{admin.email}</p>
              <p className="text-xs text-slate-500">Super Admin</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64">
        <header className="h-16 bg-slate-900/50 border-b border-slate-800 backdrop-blur-sm sticky top-0 z-20 px-8 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">
            {navItems.find(i => i.path === location.pathname)?.label || 'Overview'}
          </h2>
          <div className="flex items-center gap-4">
             <Link to="/" target="_blank" className="text-sm text-slate-400 hover:text-blue-400 flex items-center gap-1">
               Visit Site <span className="text-xs">↗</span>
             </Link>
          </div>
        </header>
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
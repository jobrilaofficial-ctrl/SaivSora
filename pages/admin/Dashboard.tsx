import React from 'react';
import { Users, Download, TrendingUp, DollarSign, Activity } from 'lucide-react';

const StatCard: React.FC<{ title: string; value: string; trend: string; icon: React.ReactNode }> = ({ title, value, trend, icon }) => (
  <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl">
    <div className="flex items-start justify-between mb-4">
      <div className="p-2 bg-slate-800 rounded-lg text-slate-300">
        {icon}
      </div>
      <span className={`text-xs font-medium px-2 py-1 rounded-full ${trend.startsWith('+') ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
        {trend}
      </span>
    </div>
    <h3 className="text-slate-400 text-sm font-medium mb-1">{title}</h3>
    <p className="text-2xl font-bold text-white">{value}</p>
  </div>
);

const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Platform Overview</h1>
        <div className="text-sm text-slate-400">Last updated: Just now</div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Users" 
          value="12,345" 
          trend="+12.5%" 
          icon={<Users className="w-5 h-5" />} 
        />
        <StatCard 
          title="Total Downloads" 
          value="843.2K" 
          trend="+8.2%" 
          icon={<Download className="w-5 h-5" />} 
        />
        <StatCard 
          title="Revenue (Mo)" 
          value="$14,290" 
          trend="+23.1%" 
          icon={<DollarSign className="w-5 h-5" />} 
        />
        <StatCard 
          title="Active Sessions" 
          value="1,204" 
          trend="+4.5%" 
          icon={<Activity className="w-5 h-5" />} 
        />
      </div>

      {/* Placeholder for Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-96 flex items-center justify-center">
        <div className="text-center">
          <TrendingUp className="w-12 h-12 text-slate-700 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-1">Activity Analytics</h3>
          <p className="text-slate-500 text-sm">Chart visualization coming in next update</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
import React, { useState, useEffect } from 'react';
import { Users, UserCheck, Briefcase, DollarSign, AlertCircle, TrendingUp, ShieldCheck } from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import api from '@/services/api';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import ChartTooltip from '@/components/common/ChartTooltip';
import { formatCurrency } from '@/utils/formatters';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/stats');
        setStats(res.data.data);
      } catch (error) {
        toast.error('Failed to load admin analytics');
        setStats(null);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="h-8 w-48 bg-slate-200 dark:bg-navy-800 rounded animate-pulse mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 bg-slate-200 dark:bg-navy-800 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const userGrowthMap = {};
  if (Array.isArray(stats?.userGrowth)) {
    stats.userGrowth.forEach(item => {
      if (item._id && item._id.month) {
        const key = monthNames[((item._id.month || 1) - 1) % 12];
        if (!userGrowthMap[key]) userGrowthMap[key] = { month: key, freelancers: 0, clients: 0 };
        if (item._id.role === 'freelancer') userGrowthMap[key].freelancers += item.count;
        if (item._id.role === 'client') userGrowthMap[key].clients += item.count;
      } else if (item.month) {
        userGrowthMap[item.month] = item;
      }
    });
  }
  const userGrowth = Object.values(userGrowthMap);

  const revenueData = Array.isArray(stats?.monthlyRevenue)
    ? stats.monthlyRevenue.map(item => ({
        month: monthNames[((item._id?.month || 1) - 1) % 12],
        revenue: item.revenue || 0
      }))
    : (Array.isArray(stats?.revenueData) ? stats.revenueData : []);

  const categoryColors = ['#0A84FF', '#2FA8FF', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4'];
  const categoryData = Array.isArray(stats?.jobCategories)
    ? stats.jobCategories.map((item, idx) => ({
        name: item._id || 'General',
        count: item.count,
        color: categoryColors[idx % categoryColors.length]
      }))
    : (Array.isArray(stats?.categoryBreakdown) ? stats.categoryBreakdown : []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="text-indigo-600 dark:text-indigo-400" size={24} />
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Platform Administration</h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Workstation platform ecosystem analytics, user activity, and moderation.
          </p>
        </div>
        <div className="flex gap-3">
          <Link to="/dashboard/admin/users">
            <Button variant="outline" size="sm">Manage Users</Button>
          </Link>
          <Link to="/dashboard/admin/jobs">
            <Button variant="outline" size="sm">Moderate Jobs</Button>
          </Link>
          <Link to="/dashboard/admin/reports">
            <Button variant="primary" size="sm">View Reports</Button>
          </Link>
        </div>
      </div>

      {/* 6 Top KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <Card className="p-4 border-l-4 border-l-[#0A84FF]">
          <p className="text-xs font-medium text-slate-500">Total Users</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {stats?.totalUsers ?? 0}
          </h3>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-0.5">
            <TrendingUp size={12} /> Registered
          </p>
        </Card>

        <Card className="p-4 border-l-4 border-l-[#2FA8FF]">
          <p className="text-xs font-medium text-slate-500">Freelancers</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {stats?.totalFreelancers ?? 0}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {stats?.totalUsers ? Math.round(((stats.totalFreelancers || 0) / stats.totalUsers) * 100) : 0}% of userbase
          </p>
        </Card>

        <Card className="p-4 border-l-4 border-l-emerald-500">
          <p className="text-xs font-medium text-slate-500">Clients</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {stats?.totalClients ?? 0}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {stats?.totalUsers ? Math.round(((stats.totalClients || 0) / stats.totalUsers) * 100) : 0}% of userbase
          </p>
        </Card>

        <Card className="p-4 border-l-4 border-l-amber-500">
          <p className="text-xs font-medium text-slate-500">Active Projects</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {stats?.activeJobs ?? 0}
          </h3>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">Active on board</p>
        </Card>

        <Card className="p-4 border-l-4 border-l-teal-500">
          <p className="text-xs font-medium text-slate-500">Platform Revenue</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
            {formatCurrency(stats?.totalRevenue ?? 0)}
          </h3>
          <p className="text-xs text-slate-400 mt-1">10% Platform fee</p>
        </Card>

        <Card className="p-4 border-l-4 border-l-rose-500">
          <p className="text-xs font-medium text-slate-500">Pending Reports</p>
          <h3 className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1">
            {stats?.pendingReports ?? 0}
          </h3>
          <p className="text-xs text-slate-400 mt-1">Requires review</p>
        </Card>
      </div>

      {/* Primary Charts: User Growth & Revenue */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">User Growth Analytics</h3>
              <p className="text-xs text-slate-400">Monthly breakdown: Freelancers vs Clients</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-medium">
              Registered Activity
            </span>
          </div>
          <div className="h-72">
            {userGrowth.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={userGrowth}>
                  <defs>
                    <linearGradient id="colorFreelancers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0A84FF" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#0A84FF" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorClients" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#CBD5E1" opacity={0.4} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 12 }} />
                  <Tooltip content={<ChartTooltip />} />
                  <Legend />
                  <Area type="monotone" name="Freelancers" dataKey="freelancers" stroke="#0A84FF" strokeWidth={2.5} fill="url(#colorFreelancers)" />
                  <Area type="monotone" name="Clients" dataKey="clients" stroke="#10B981" strokeWidth={2.5} fill="url(#colorClients)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <Users size={36} className="text-slate-300 dark:text-slate-600 mb-2" />
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">No user growth history yet</p>
                <p className="text-xs text-slate-400 mt-1">User registrations over time will appear here.</p>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Platform Revenue & Volume</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Monthly net fee revenue (₹)</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-medium border border-emerald-200 dark:border-emerald-800/40">
              INR Escrow
            </span>
          </div>
          <div className="h-72">
            {revenueData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#CBD5E1" opacity={0.4} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 12 }} tickFormatter={(val) => `₹${val / 1000}k`} />
                  <Tooltip content={<ChartTooltip formatter={(value) => [formatCurrency(value), 'Platform Revenue']} />} />
                  <Bar dataKey="revenue" name="Platform Revenue" fill="#0A84FF" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <DollarSign size={36} className="text-slate-300 dark:text-slate-600 mb-2" />
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">No platform fee revenue recorded yet</p>
                <p className="text-xs text-slate-400 mt-1">Completed escrow payments will populate this chart.</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Secondary Charts: Project Categories & Quick Moderation Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Project Categories</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Distribution of active projects</p>
          {categoryData.length > 0 ? (
            <>
              <div className="h-56 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey="count"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={4}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color || '#0A84FF'} />
                      ))}
                    </Pie>
                    <Tooltip content={<ChartTooltip formatter={(val, name) => [`${val} projects`, name]} />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                {categoryData.map((cat) => (
                  <div key={cat.name} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color || '#0A84FF' }} />
                    <span className="text-slate-600 dark:text-slate-300 truncate">{cat.name}: <strong className="font-semibold text-navy-900 dark:text-white">{cat.count}</strong></span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-56 flex flex-col items-center justify-center text-center p-4 text-slate-400">
              <Briefcase size={36} className="text-slate-300 dark:text-slate-600 mb-2" />
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">No project categories yet</p>
              <p className="text-xs text-slate-400 mt-1">Category breakdown will appear as projects are posted.</p>
            </div>
          )}
        </Card>

        <Card className="lg:col-span-2 p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Moderation & Platform Shortcuts</h3>
              <p className="text-xs text-slate-400">Quick management hubs for Workstation</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link to="/dashboard/admin/users" className="block p-4 rounded-xl border border-slate-200 dark:border-navy-700 hover:border-indigo-500 transition-colors bg-slate-50 dark:bg-navy-900/40">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                  <Users size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white text-sm">User Moderation</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Suspend/activate users, verify KYC badges</p>
                </div>
              </div>
            </Link>

            <Link to="/dashboard/admin/jobs" className="block p-4 rounded-xl border border-slate-200 dark:border-navy-700 hover:border-indigo-500 transition-colors bg-slate-50 dark:bg-navy-900/40">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                  <Briefcase size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white text-sm">Job Moderation</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Review flagged projects and spam listings</p>
                </div>
              </div>
            </Link>

            <Link to="/dashboard/admin/payments" className="block p-4 rounded-xl border border-slate-200 dark:border-navy-700 hover:border-indigo-500 transition-colors bg-slate-50 dark:bg-navy-900/40">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                  <DollarSign size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white text-sm">Payment Analytics</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Track escrow deposits, releases & dispute refunds</p>
                </div>
              </div>
            </Link>

            <Link to="/dashboard/admin/reports" className="block p-4 rounded-xl border border-slate-200 dark:border-navy-700 hover:border-indigo-500 transition-colors bg-slate-50 dark:bg-navy-900/40">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400">
                  <AlertCircle size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white text-sm">Reports & Disputes</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{stats?.pendingReports ?? 0} pending dispute tickets</p>
                </div>
              </div>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

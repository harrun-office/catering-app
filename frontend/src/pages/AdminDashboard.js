import React, { useState, useEffect, useMemo } from 'react';
import { adminAPI } from '../utils/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { BarChart3, Users, ShoppingBag, TrendingUp, Clock3, ShieldCheck, Star, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const formatCurrency = (value = 0) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value || 0);

const StatCard = ({ title, value, trend = '', icon: Icon, accent = 'bg-purple-100 text-purple-700', pill }) => (
  <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-md">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm uppercase tracking-wide text-slate-400">{title}</p>
        <p className="mt-2 text-3xl font-semibold text-slate-800">{value}</p>
        {trend && (
          <p className="mt-1 text-xs font-semibold text-emerald-600 flex items-center gap-1">
            <ArrowUpRight size={14} /> {trend}
          </p>
        )}
        {pill && <span className="mt-2 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">{pill}</span>}
      </div>
      <span className={`rounded-2xl p-3 ${accent}`}>
        <Icon size={24} />
      </span>
    </div>
  </div>
);

const ActivityItem = ({ label, sublabel, time }) => (
  <div className="flex items-start gap-3">
    <span className="mt-1 h-2 w-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500" />
    <div className="flex-1">
      <p className="text-sm font-semibold text-slate-800">{label}</p>
      <p className="text-xs text-slate-500">{sublabel}</p>
    </div>
    <span className="text-xs text-slate-400">{time}</span>
  </div>
);

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminAPI.getDashboardStats();
        setStats(response.data.stats);
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const quickStats = useMemo(
    () => [
      {
        title: 'Total Orders',
        value: stats?.total_orders ?? 0,
        trend: stats?.orders_trend ?? '↑ steady growth',
        icon: ShoppingBag,
        accent: 'bg-purple-100 text-purple-700',
        pill: `${stats?.pending_orders ?? 0} pending`,
      },
      {
        title: 'Total Revenue',
        value: formatCurrency(stats?.revenue ?? 0),
        trend: stats?.revenue_trend ?? '+12% vs last week',
        icon: TrendingUp,
        accent: 'bg-emerald-100 text-emerald-700',
      },
      {
        title: 'Active Users',
        value: stats?.total_users ?? 0,
        trend: stats?.users_trend ?? '+18 new this week',
        icon: Users,
        accent: 'bg-blue-100 text-blue-700',
      },
      {
        title: 'Avg. Prep Time',
        value: `${stats?.avg_prep_time ?? 32} mins`,
        trend: stats?.prep_trend ?? 'within SLA',
        icon: Clock3,
        accent: 'bg-amber-100 text-amber-700',
      },
    ],
    [stats]
  );

  const activityFeed = [
    {
      label: 'Menu updated',
      sublabel: 'Added new Mandhi variants',
      time: '2h ago',
    },
    {
      label: 'Order #CH-2045 delivered',
      sublabel: 'Delivered to Rohit Sharma',
      time: '3h ago',
    },
    {
      label: 'New user registered',
      sublabel: 'keerthi@example.com',
      time: '5h ago',
    },
  ];

  if (loading) {
    return <LoadingSpinner size="lg" text="Preparing insights..." />;
  }

  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-gradient-to-r from-purple-700 via-indigo-600 to-blue-600 p-6 text-white shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-white/60">Dashboard</p>
            <h1 className="text-3xl font-semibold">Daily Ops Snapshot</h1>
            <p className="mt-1 text-white/80">Keep a pulse on orders, customers, and revenue at a glance.</p>
          </div>
          <div className="rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold backdrop-blur">
            <ShieldCheck size={18} className="inline mr-2" /> Service uptime 99.9%
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">{quickStats.map((stat) => <StatCard key={stat.title} {...stat} />)}</div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-400">Order health</p>
              <h2 className="text-xl font-semibold text-slate-800">Live status overview</h2>
            </div>
            <span className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">
              <BarChart3 size={14} /> {stats?.pending_orders ?? 0} pending
            </span>
          </div>
          <div className="mt-6 space-y-4">
            {['pending', 'preparing', 'out_for_delivery', 'delivered'].map((status) => {
              const value = stats?.[`orders_${status}`] ?? 0;
              const total = stats?.total_orders || 1;
              const progress = Math.min(100, Math.round((value / total) * 100));
              return (
                <div key={status}>
                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <span className="font-semibold capitalize text-slate-700">{status.replace(/_/g, ' ')}</span>
                    <span>{value}</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-slate-100">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-400">Recent activity</p>
              <h2 className="text-xl font-semibold text-slate-800">Team timeline</h2>
            </div>
            <Link to="/admin/orders" className="text-sm font-semibold text-purple-600 hover:text-purple-700">
              View all
            </Link>
          </div>
          <div className="mt-6 space-y-5">
            {activityFeed.map((item) => (
              <ActivityItem key={item.label + item.time} {...item} />
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-400">Revenue pulse</p>
              <h2 className="text-xl font-semibold text-slate-800">Weekly performance</h2>
            </div>
            <span className="flex items-center gap-1 text-sm font-semibold text-emerald-600">
              <ArrowUpRight size={16} /> {stats?.revenue_trend ?? '+12%'}
            </span>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-gradient-to-br from-purple-600 to-purple-800 p-4 text-white shadow-lg">
              <p className="text-xs uppercase tracking-widest text-white/70">This week</p>
              <p className="mt-2 text-3xl font-semibold">{formatCurrency(stats?.revenue_week ?? stats?.revenue ?? 0)}</p>
              <p className="mt-1 text-sm text-white/70">vs last week {stats?.revenue_week_trend ?? '+9%'}</p>
            </div>
            <div className="rounded-2xl border border-dashed border-slate-200 p-4">
              <p className="text-sm font-semibold text-slate-700">Top performer</p>
              <p className="mt-1 text-2xl text-purple-600">{stats?.top_dish ?? 'Hyderabadi Biryani'}</p>
              <p className="mt-2 text-xs text-slate-500">Top customer: {stats?.top_customer ?? 'N/A'}</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-400">Engagement</p>
              <h2 className="text-xl font-semibold text-slate-800">Customer satisfaction</h2>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-600">
              <Star size={14} /> {stats?.avg_rating ?? 4.8} / 5
            </span>
          </div>
          <div className="mt-6 space-y-4">
            {['Service quality', 'Packaging', 'Delivery time'].map((label, index) => (
              <div key={label} className="rounded-2xl border border-slate-100 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-700">{label}</p>
                    <p className="text-xs text-slate-400">Customer happiness metric</p>
                  </div>
                  <span className={`flex items-center gap-1 text-sm font-semibold ${index === 2 ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {index === 2 ? <ArrowDownRight size={16} /> : <ArrowUpRight size={16} />}
                    {stats?.satisfaction?.[label] ?? (index === 2 ? '-2%' : '+4%')}
                  </span>
                </div>
                <div className="mt-3 h-2 rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full ${index === 2 ? 'bg-gradient-to-r from-amber-400 to-orange-500' : 'bg-gradient-to-r from-emerald-400 to-teal-500'}`}
                    style={{ width: `${stats?.satisfaction_progress?.[label] ?? (index === 2 ? 62 : 84)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-400">Quick actions</p>
            <h2 className="text-xl font-semibold text-slate-800">Stay ahead of tasks</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/admin/orders" className="rounded-2xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-purple-700">
              Manage orders
            </Link>
            <Link to="/admin/menu" className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Update menu
            </Link>
            <Link to="/admin/users" className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Review users
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

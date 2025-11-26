import React, { useState, useEffect } from 'react';
import { adminAPI } from '../utils/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { BarChart3, Users, ShoppingBag, TrendingUp } from 'lucide-react';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

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

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading dashboard..." />;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Total Orders */}
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-2">Total Orders</p>
              <p className="text-3xl font-bold text-gray-800">{stats?.total_orders || 0}</p>
            </div>
            <ShoppingBag className="text-purple-600" size={40} />
          </div>
        </div>

        {/* Revenue */}
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-2">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-800">₹{(stats?.revenue || 0).toFixed(2)}</p>
            </div>
            <TrendingUp className="text-green-600" size={40} />
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-2">Pending Orders</p>
              <p className="text-3xl font-bold text-gray-800">{stats?.pending_orders || 0}</p>
            </div>
            <BarChart3 className="text-yellow-600" size={40} />
          </div>
        </div>

        {/* Total Users */}
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-2">Total Users</p>
              <p className="text-3xl font-bold text-gray-800">{stats?.total_users || 0}</p>
            </div>
            <Users className="text-blue-600" size={40} />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/admin/orders" className="btn-primary text-center">
            View All Orders
          </a>
          <a href="/admin/menu" className="btn-primary text-center">
            Manage Menu
          </a>
          <a href="/admin/users" className="btn-primary text-center">
            Manage Users
          </a>
          <a href="/admin/analytics" className="btn-primary text-center">
            View Analytics
          </a>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect, useMemo } from 'react';
import { adminAPI } from '../utils/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Alert } from '../components/Alert';
import { Lock, Unlock, Search, UserCircle } from 'lucide-react';

export const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllUsers({ page, limit: 12 });
      setUsers(response.data.users || []);
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId) => {
    try {
      await adminAPI.toggleUserStatus(userId);
      setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, is_active: !user.is_active } : user)));
    } catch (err) {
      setError('Failed to update user status');
    }
  };

  const stats = useMemo(() => {
    const active = users.filter((user) => user.is_active).length;
    const blocked = users.length - active;
    return { active, blocked };
  }, [users]);

  const filteredUsers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return users;
    return users.filter((user) => {
      const fullName = `${user.first_name || ''} ${user.last_name || ''}`.toLowerCase();
      return (
        fullName.includes(term) ||
        user.email?.toLowerCase().includes(term) ||
        user.phone?.toLowerCase().includes(term)
      );
    });
  }, [users, searchTerm]);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">People</p>
          <h1 className="text-3xl font-semibold text-slate-900">Customer Directory</h1>
          <p className="text-sm text-slate-500">Manage access, review activity, and keep profiles up to date.</p>
        </div>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
          <p className="text-xs uppercase tracking-widest text-slate-400">Total users</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{users.length}</p>
          <p className="text-xs text-slate-500">All registered customers</p>
        </div>
        <div className="rounded-3xl bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-[#FF6A28] p-5 shadow-lg">
          <p className="text-xs uppercase tracking-widest text-[#FF6A28] font-semibold">Active</p>
          <p className="mt-2 text-3xl font-semibold text-gray-800">{stats.active}</p>
          <p className="text-xs text-gray-600">Currently allowed to place orders</p>
        </div>
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
          <p className="text-xs uppercase tracking-widest text-slate-400">Blocked</p>
          <p className="mt-2 text-3xl font-semibold text-rose-600">{stats.blocked}</p>
          <p className="text-xs text-slate-500">Users needing review</p>
        </div>
        <div className="rounded-3xl border border-dashed border-slate-200 p-5">
          <p className="text-xs uppercase tracking-widest text-slate-400">Page</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">#{page}</p>
          <p className="text-xs text-slate-500">Showing {filteredUsers.length} results</p>
        </div>
      </div>

      <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[220px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, phone"
              className="w-full rounded-2xl border border-orange-200 bg-orange-50 py-2 pl-10 pr-4 text-sm text-gray-700 focus:border-[#FF6A28] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6A28]/20"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              className="rounded-2xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 disabled:opacity-40"
            >
              Prev
            </button>
            <button
              onClick={() => setPage((prev) => prev + 1)}
              className="rounded-2xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner size="lg" text="Loading users..." />
      ) : filteredUsers.length === 0 ? (
        <div className="rounded-3xl bg-white p-12 text-center shadow-sm ring-1 ring-slate-100">
          <p className="text-lg font-semibold text-slate-700">No users found</p>
          <p className="text-sm text-slate-500">Try a different search or refresh.</p>
        </div>
      ) : (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredUsers.map((user) => (
            <div key={user.id} className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF6A28] to-[#FF8B4A] text-white">
                  <UserCircle size={20} />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-widest text-slate-400">{user.role || 'user'}</p>
                  <h3 className="text-lg font-semibold text-slate-900">
                    {user.first_name} {user.last_name}
                  </h3>
                  <p className="text-xs text-slate-500">Joined {new Date(user.created_at).toLocaleDateString()}</p>
                </div>
                <div className="ml-auto">{user.is_active ? <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">Active</span> : <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-600">Blocked</span>}</div>
              </div>

              <div className="mt-4 space-y-2 text-sm text-slate-600">
                <p className="truncate">{user.email}</p>
                <p className="text-slate-500">{user.phone || 'No phone added'}</p>
              </div>

              <button
                onClick={() => handleToggleStatus(user.id)}
                className={`mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                  user.is_active ? 'bg-rose-100 text-rose-700 hover:bg-rose-200' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                }`}
              >
                {user.is_active ? <Lock size={16} /> : <Unlock size={16} />}
                {user.is_active ? 'Block access' : 'Activate user'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

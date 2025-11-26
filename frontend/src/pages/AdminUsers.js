import React, { useState, useEffect } from 'react';
import { adminAPI } from '../utils/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Alert } from '../components/Alert';
import { Lock, Unlock } from 'lucide-react';

export const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllUsers({ page, limit: 10 });
      setUsers(response.data.users);
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId) => {
    try {
      await adminAPI.toggleUserStatus(userId);
      setUsers(users.map((u) => (u.id === userId ? { ...u, is_active: !u.is_active } : u)));
    } catch (err) {
      setError('Failed to update user status');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">User Management</h1>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {loading ? (
        <LoadingSpinner size="lg" text="Loading users..." />
      ) : users.length === 0 ? (
        <div className="text-center bg-white rounded-lg p-12">
          <p className="text-gray-600 text-lg">No users found</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Name</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Email</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Phone</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Joined</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Status</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50 transition">
                  <td className="px-6 py-3 font-semibold text-gray-800">
                    {user.first_name} {user.last_name}
                  </td>
                  <td className="px-6 py-3 text-gray-700">{user.email}</td>
                  <td className="px-6 py-3 text-gray-700">{user.phone || 'N/A'}</td>
                  <td className="px-6 py-3 text-gray-700">{new Date(user.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-3">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                        user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {user.is_active ? 'Active' : 'Blocked'}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <button
                      onClick={() => handleToggleStatus(user.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${
                        user.is_active
                          ? 'bg-red-100 text-red-800 hover:bg-red-200'
                          : 'bg-green-100 text-green-800 hover:bg-green-200'
                      }`}
                    >
                      {user.is_active ? (
                        <>
                          <Lock size={16} />
                          Block
                        </>
                      ) : (
                        <>
                          <Unlock size={16} />
                          Unblock
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

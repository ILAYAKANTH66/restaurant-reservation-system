import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Building2, Calendar, TrendingUp, UserCheck, UserX } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRestaurants: 0,
    totalReservations: 0,
    activeUsers: 0
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setStats({
        totalUsers: 1250,
        totalRestaurants: 89,
        totalReservations: 3456,
        activeUsers: 1180
      });
      
      setRecentUsers([
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'customer', isActive: true, createdAt: new Date() },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'restaurant_owner', isActive: true, createdAt: new Date() },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'customer', isActive: false, createdAt: new Date() }
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getRoleDisplay = (role) => {
    switch (role) {
      case 'customer': return 'Customer';
      case 'restaurant_owner': return 'Restaurant Owner';
      case 'admin': return 'Administrator';
      default: return role;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">System overview and management</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <Building2 className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Restaurants</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalRestaurants}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Reservations</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalReservations}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeUsers}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Users */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Users</h2>
          <div className="space-y-4">
            {recentUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    {user.isActive ? (
                      <UserCheck className="h-8 w-8 text-green-500" />
                    ) : (
                      <UserX className="h-8 w-8 text-red-500" />
                    )}
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    <p className="text-xs text-gray-400">{getRoleDisplay(user.role)}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.isActive 
                      ? 'text-green-600 bg-green-100' 
                      : 'text-red-600 bg-red-100'
                  }`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="space-y-4">
            <button className="w-full btn-primary text-left">
              Manage Users
            </button>
            <button className="w-full btn-secondary text-left">
              Manage Restaurants
            </button>
            <button className="w-full btn-secondary text-left">
              View All Reservations
            </button>
            <button className="w-full btn-secondary text-left">
              System Settings
            </button>
            <button className="w-full btn-secondary text-left">
              Generate Reports
            </button>
          </div>
        </div>
      </div>

      {/* System Health */}
      <div className="mt-8">
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-6">System Health</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">99.9%</div>
              <p className="text-sm text-gray-600">Uptime</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">2.3s</div>
              <p className="text-sm text-gray-600">Average Response Time</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">1.2K</div>
              <p className="text-sm text-gray-600">Active Sessions</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

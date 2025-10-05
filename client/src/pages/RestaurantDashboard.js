import React, { useState, useEffect } from 'react';
import { restaurantsAPI, reservationsAPI } from '../services/api';
import { Building2, Calendar, Users, TrendingUp, Plus, Edit, Eye, BarChart3, Settings, Check, X as XIcon, Clock } from 'lucide-react';
import RestaurantEditForm from '../components/RestaurantEditForm';
import CreateRestaurantForm from '../components/CreateRestaurantForm';
import toast from 'react-hot-toast';
import Modal from '../components/Modal';

const RestaurantDashboard = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [recentReservations, setRecentReservations] = useState([]);
  const [allReservations, setAllReservations] = useState([]);
  const [stats, setStats] = useState({
    totalRestaurants: 0,
    totalReservations: 0,
    pendingReservations: 0,
    confirmedReservations: 0
  });
  const [loading, setLoading] = useState(true);
  const [editingRestaurant, setEditingRestaurant] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [isAllReservationsOpen, setIsAllReservationsOpen] = useState(false);
  const [reservationsFilter, setReservationsFilter] = useState('all');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch restaurants owned by the user
      const restaurantsResponse = await restaurantsAPI.getByOwner();
      setRestaurants(restaurantsResponse.data);
      
      // Fetch real reservations for all restaurants
      let allReservations = [];
      let totalReservations = 0;
      let pendingReservations = 0;
      let confirmedReservations = 0;

      for (const restaurant of restaurantsResponse.data) {
        try {
          const reservationsResponse = await reservationsAPI.getByRestaurant(restaurant._id);
          const restaurantReservations = reservationsResponse.data;
          allReservations = [...allReservations, ...restaurantReservations];
          
          totalReservations += restaurantReservations.length;
          pendingReservations += restaurantReservations.filter(r => r.status === 'pending').length;
          confirmedReservations += restaurantReservations.filter(r => r.status === 'confirmed').length;
        } catch (error) {
          console.error(`Error fetching reservations for restaurant ${restaurant._id}:`, error);
        }
      }

      setStats({
        totalRestaurants: restaurantsResponse.data.length,
        totalReservations,
        pendingReservations,
        confirmedReservations
      });

      // Normalize and set recent reservations (last 5 by createdAt desc if available)
      const sorted = [...allReservations].sort((a, b) => {
        const aTime = new Date(a.createdAt || a.date).getTime();
        const bTime = new Date(b.createdAt || b.date).getTime();
        return bTime - aTime;
      });
      setRecentReservations(sorted.slice(0, 5));
      setAllReservations(sorted);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleEditRestaurant = (restaurant) => {
    setEditingRestaurant(restaurant);
  };

  const handleUpdateRestaurant = () => {
    fetchDashboardData(); // Refresh the data
  };

  const handleCreateRestaurant = () => {
    setShowCreateForm(true);
  };

  const handleRestaurantCreated = () => {
    fetchDashboardData(); // Refresh the data
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'view-reservations':
        setIsAllReservationsOpen(true);
        break;
      case 'settings': {
        if (restaurants.length === 0) {
          toast.error('No restaurants to configure');
          return;
        }
        setEditingRestaurant(restaurants[0]);
        break;
      }
      case 'reports':
        exportReservationsCSV();
        break;
      default:
        toast.error('Action not implemented yet');
    }
  };

  const exportReservationsCSV = () => {
    if (!allReservations || allReservations.length === 0) {
      toast.error('No reservations to export');
      return;
    }
    const headers = ['Reservation ID','Restaurant','Guest','Email','Phone','Date','Time','Party Size','Status'];
    const rows = allReservations.map(r => [
      r._id || r.id,
      (r.restaurant && (r.restaurant.name || r.restaurant)) || '',
      (r.user && r.user.name) || r.contactName || '',
      (r.user && r.user.email) || '',
      (r.user && r.user.phone) || r.contactPhone || '',
      new Date(r.date).toLocaleDateString(),
      r.time,
      r.partySize,
      r.status
    ]);
    const csv = [headers, ...rows]
      .map(row => row.map(cell => {
        const str = String(cell ?? '');
        const needsQuotes = /[",\n]/.test(str);
        const escaped = str.replace(/"/g, '""');
        return needsQuotes ? `"${escaped}"` : escaped;
      }).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'reservations.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Report exported');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'confirmed': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      case 'completed': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'confirmed': return 'Confirmed';
      case 'cancelled': return 'Cancelled';
      case 'completed': return 'Completed';
      default: return status;
    }
  };

  const openManageReservation = (reservation) => {
    setSelectedReservation(reservation);
    setIsManageOpen(true);
  };

  const closeManageReservation = () => {
    setIsManageOpen(false);
    setSelectedReservation(null);
  };

  const handleReservationAction = async (reservationId, nextStatus) => {
    try {
      setActionLoading(true);
      await reservationsAPI.updateStatus(reservationId, nextStatus);
      toast.success(`Reservation ${nextStatus}`);
      closeManageReservation();
      await fetchDashboardData();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update reservation';
      toast.error(message);
    } finally {
      setActionLoading(false);
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Restaurant Dashboard</h1>
        <p className="text-gray-600">Manage your restaurants and reservations</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">My Restaurants</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalRestaurants}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Reservations</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalReservations}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Users className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingReservations}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Confirmed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.confirmedReservations}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* My Restaurants */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">My Restaurants</h2>
            <button 
              onClick={handleCreateRestaurant}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Restaurant
            </button>
          </div>
          
          {restaurants.length === 0 ? (
            <div className="text-center py-8">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No restaurants yet</h3>
              <p className="text-gray-600 mb-4">Start by adding your first restaurant</p>
              <button 
                onClick={handleCreateRestaurant}
                className="btn-primary"
              >
                Add Restaurant
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {restaurants.map((restaurant) => (
                <div key={restaurant._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">{restaurant.name}</h3>
                    <p className="text-sm text-gray-600">{restaurant.cuisine}</p>
                    <p className="text-xs text-gray-500">
                      {restaurant.address?.city}, {restaurant.address?.state}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="btn-secondary flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      View
                    </button>
                    <button 
                      onClick={() => handleEditRestaurant(restaurant)}
                      className="btn-secondary flex items-center gap-1"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Reservations */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Reservations</h2>
          
          {recentReservations.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No reservations yet</h3>
              <p className="text-gray-600">Reservations will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
                {recentReservations.map((reservation) => (
                <div key={reservation._id || reservation.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">{reservation.user?.name || reservation.contactName || 'Customer'}</h3>
                    <p className="text-sm text-gray-600">{reservation.restaurant?.name || ''}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(reservation.date).toLocaleDateString()} at {reservation.time} • {reservation.partySize} people
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}>
                      {getStatusText(reservation.status)}
                    </span>
                    <button onClick={() => openManageReservation(reservation)} className="btn-secondary text-xs">
                      Manage
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <button 
              onClick={() => handleQuickAction('view-reservations')}
              className="btn-primary text-left flex items-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              View All Reservations
            </button>
            <button 
              onClick={() => handleQuickAction('settings')}
              className="btn-secondary text-left flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Restaurant Settings
            </button>
            <button 
              onClick={() => handleQuickAction('reports')}
              className="btn-secondary text-left flex items-center gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              Generate Reports
            </button>
          </div>
        </div>
      </div>

      {/* Edit Restaurant Modal */}
      {editingRestaurant && (
        <RestaurantEditForm
          restaurant={editingRestaurant}
          onClose={() => setEditingRestaurant(null)}
          onUpdate={handleUpdateRestaurant}
        />
      )}

      {/* Create Restaurant Modal */}
      {showCreateForm && (
        <CreateRestaurantForm
          onClose={() => setShowCreateForm(false)}
          onSuccess={handleRestaurantCreated}
        />
      )}

      {/* All Reservations Modal */}
      <Modal isOpen={isAllReservationsOpen} onClose={() => setIsAllReservationsOpen(false)} title="All Reservations" size="xl">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <label className="text-sm text-gray-700">Status</label>
              <select
                value={reservationsFilter}
                onChange={(e) => setReservationsFilter(e.target.value)}
                className="input-field"
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <button onClick={exportReservationsCSV} className="btn-secondary">Export CSV</button>
          </div>

          <div className="divide-y divide-gray-200 border border-gray-200 rounded-lg">
            {(allReservations || [])
              .filter(r => reservationsFilter === 'all' ? true : r.status === reservationsFilter)
              .map((r) => (
              <div key={r._id || r.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{r.user?.name || r.contactName}</p>
                  <p className="text-sm text-gray-600">{r.restaurant?.name || ''}</p>
                  <p className="text-xs text-gray-500">{new Date(r.date).toLocaleDateString()} at {r.time} • {r.partySize} people</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(r.status)}`}>{getStatusText(r.status)}</span>
                  <button onClick={() => openManageReservation(r)} className="btn-secondary text-xs">Manage</button>
                </div>
              </div>
            ))}
            {allReservations && allReservations.filter(r => reservationsFilter === 'all' ? true : r.status === reservationsFilter).length === 0 && (
              <div className="p-6 text-center text-gray-600">No reservations found</div>
            )}
          </div>
        </div>
      </Modal>

      {/* Manage Reservation Modal */}
      <Modal isOpen={isManageOpen} onClose={closeManageReservation} title="Manage Reservation" size="md">
        {selectedReservation && (
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Guest</p>
                  <p className="font-medium text-gray-900">{selectedReservation.user?.name || selectedReservation.contactName}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedReservation.status)}`}>
                  {getStatusText(selectedReservation.status)}
                </span>
              </div>
              <div className="text-sm text-gray-700">
                {new Date(selectedReservation.date).toLocaleDateString()} at {selectedReservation.time} • {selectedReservation.partySize} people
              </div>
              {selectedReservation.specialRequests && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium text-gray-700">Requests: </span>{selectedReservation.specialRequests}
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                disabled={actionLoading}
                onClick={() => handleReservationAction(selectedReservation._id || selectedReservation.id, 'confirmed')}
                className="btn-primary flex items-center gap-2 disabled:opacity-50"
              >
                <Check className="h-4 w-4" /> Accept
              </button>
              <button
                disabled={actionLoading}
                onClick={() => handleReservationAction(selectedReservation._id || selectedReservation.id, 'cancelled')}
                className="btn-danger flex items-center gap-2 disabled:opacity-50"
              >
                <XIcon className="h-4 w-4" /> Reject
              </button>
              {selectedReservation.status === 'confirmed' && (
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Confirmed
                </span>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default RestaurantDashboard;

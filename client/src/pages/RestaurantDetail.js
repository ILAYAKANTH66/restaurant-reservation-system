import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useForm } from 'react-hook-form';
import { restaurantsAPI, reservationsAPI } from '../services/api';
import { 
  MapPin, 
  Star, 
  IndianRupee, 
  Phone, 
  Mail, 
  Globe, 
  Clock, 
  Users,
  Calendar,
  Clock as TimeIcon,
  ArrowLeft
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getPriceRangeLabel } from '../constants/priceRanges';

const formatPrice = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2
  }).format(Number(value) || 0);

const RestaurantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  useEffect(() => {
    fetchRestaurant();
  }, [id]);

  const fetchRestaurant = async () => {
    try {
      setLoading(true);
      const response = await restaurantsAPI.getById(id);
      setRestaurant(response.data);
    } catch (error) {
      console.error('Error fetching restaurant:', error);
      toast.error('Failed to load restaurant details');
      navigate('/restaurants');
    } finally {
      setLoading(false);
    }
  };

  const onSubmitBooking = async (data) => {
    if (!isAuthenticated) {
      toast.error('Please login to make a reservation');
      navigate('/login');
      return;
    }

    setBookingLoading(true);
    try {
      const bookingData = {
        restaurant: id,
        date: data.date,
        time: data.time,
        partySize: parseInt(data.partySize),
        contactName: data.contactName,
        contactPhone: data.contactPhone,
        specialRequests: data.specialRequests || ''
      };

      const response = await reservationsAPI.create(bookingData);
      toast.success('Reservation created successfully!');
      setShowBookingForm(false);
      reset();
      // Small delay to ensure the success message is seen
      setTimeout(() => {
        navigate('/my-reservations');
      }, 1000);
    } catch (error) {
      console.error('Error creating reservation:', error);
      toast.error(error.response?.data?.message || 'Failed to create reservation');
    } finally {
      setBookingLoading(false);
    }
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading restaurant details...</p>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Restaurant not found</h2>
          <p className="text-gray-600">The restaurant you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          Back
        </button>
      </div>
      
      {/* Restaurant Header */}
      <div className="mb-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Restaurant Images */}
          <div className="space-y-4">
            {restaurant.images && restaurant.images.length > 0 ? (
              <img
                src={restaurant.images[0]}
                alt={restaurant.name}
                className="w-full h-80 object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-80 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center">
                <span className="text-primary-600 text-xl font-medium">No Image Available</span>
              </div>
            )}
          </div>

          {/* Restaurant Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{restaurant.name}</h1>
              <div className="flex items-center gap-4 text-gray-600">
                <div className="flex items-center gap-1">
                  <MapPin className="h-5 w-5" />
                  <span>
                    {restaurant.address?.street}, {restaurant.address?.city}, {restaurant.address?.state}
                  </span>
                </div>
              </div>
            </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(restaurant.rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="ml-2 text-gray-600">{restaurant.rating.toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-1">
              <IndianRupee className="h-5 w-5 text-gray-500" />
              <span className="text-gray-600">{getPriceRangeLabel(restaurant.priceRange)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-5 w-5 text-gray-500" />
              <span className="text-gray-600">Capacity: {restaurant.capacity}</span>
            </div>
          </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-gray-500" />
                <span className="text-gray-600">{restaurant.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-gray-500" />
                <span className="text-gray-600">{restaurant.email}</span>
              </div>
              {restaurant.website && (
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-gray-500" />
                  <a 
                    href={restaurant.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700"
                  >
                    Visit Website
                  </a>
                </div>
              )}
            </div>

            <div className="pt-4">
              <button
                onClick={() => setShowBookingForm(true)}
                className="btn-primary text-lg px-8 py-3"
              >
                Book a Table
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Restaurant Details */}
      <div className="grid md:grid-cols-3 gap-8 mb-8">
        {/* Description */}
        <div className="md:col-span-2">
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
            <p className="text-gray-600 leading-relaxed">{restaurant.description}</p>
          </div>
        </div>

        {/* Quick Info */}
        <div className="space-y-6">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Info</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Cuisine:</span>
                <span className="text-sm text-gray-600">{restaurant.cuisine}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Price Range:</span>
                <span className="text-sm text-gray-600">
                  {getPriceRangeLabel(restaurant.priceRange)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Capacity:</span>
                <span className="text-sm text-gray-600">{restaurant.capacity} people</span>
              </div>
            </div>
          </div>

          {/* Opening Hours */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Opening Hours</h3>
            <div className="space-y-2">
              {Object.entries(restaurant.openingHours || {}).map(([day, hours]) => (
                <div key={day} className="flex justify-between text-sm">
                  <span className="font-medium text-gray-700 capitalize">{day}</span>
                  <span className="text-gray-600">
                    {hours.open && hours.close ? `${hours.open} - ${hours.close}` : 'Closed'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          {restaurant.features && restaurant.features.length > 0 && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Features</h3>
              <div className="flex flex-wrap gap-2">
                {restaurant.features.map((feature) => (
                  <span
                    key={feature}
                    className="px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full"
                  >
                    {feature.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Menu */}
          {restaurant.menu && restaurant.menu.length > 0 && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Menu</h3>
              <div className="space-y-3">
                {restaurant.menu.map((item, index) => (
                  <div key={index} className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-600">{item.description}</p>
                      <span className="text-xs text-primary-600 bg-primary-100 px-2 py-1 rounded">
                        {item.category}
                      </span>
                    </div>
                    <span className="font-semibold text-gray-900 ml-4">
                      {formatPrice(item.price)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Booking Form Modal */}
      {showBookingForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Book a Table</h2>
                <button
                  onClick={() => setShowBookingForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmitBooking)} className="space-y-4">
                <div>
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    {...register('date', { required: 'Date is required' })}
                    min={new Date().toISOString().split('T')[0]}
                    className="input-field"
                  />
                  {errors.date && (
                    <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
                  )}
                </div>

                <div>
                  <label className="form-label">Time</label>
                  <select
                    {...register('time', { required: 'Time is required' })}
                    className="input-field"
                  >
                    <option value="">Select time</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="11:30">11:30 AM</option>
                    <option value="12:00">12:00 PM</option>
                    <option value="12:30">12:30 PM</option>
                    <option value="13:00">1:00 PM</option>
                    <option value="13:30">1:30 PM</option>
                    <option value="14:00">2:00 PM</option>
                    <option value="17:00">5:00 PM</option>
                    <option value="17:30">5:30 PM</option>
                    <option value="18:00">6:00 PM</option>
                    <option value="18:30">6:30 PM</option>
                    <option value="19:00">7:00 PM</option>
                    <option value="19:30">7:30 PM</option>
                    <option value="20:00">8:00 PM</option>
                    <option value="20:30">8:30 PM</option>
                    <option value="21:00">9:00 PM</option>
                  </select>
                  {errors.time && (
                    <p className="mt-1 text-sm text-red-600">{errors.time.message}</p>
                  )}
                </div>

                <div>
                  <label className="form-label">Party Size</label>
                  <select
                    {...register('partySize', { required: 'Party size is required' })}
                    className="input-field"
                  >
                    <option value="">Select party size</option>
                    {[...Array(10)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1} {i === 0 ? 'person' : 'people'}</option>
                    ))}
                  </select>
                  {errors.partySize && (
                    <p className="mt-1 text-sm text-red-600">{errors.partySize.message}</p>
                  )}
                </div>

                <div>
                  <label className="form-label">Contact Name</label>
                  <input
                    type="text"
                    {...register('contactName', { required: 'Contact name is required' })}
                    className="input-field"
                    placeholder="Your name"
                  />
                  {errors.contactName && (
                    <p className="mt-1 text-sm text-red-600">{errors.contactName.message}</p>
                  )}
                </div>

                <div>
                  <label className="form-label">Contact Phone</label>
                  <input
                    type="tel"
                    {...register('contactPhone', { required: 'Contact phone is required' })}
                    className="input-field"
                    placeholder="Your phone number"
                  />
                  {errors.contactPhone && (
                    <p className="mt-1 text-sm text-red-600">{errors.contactPhone.message}</p>
                  )}
                </div>

                <div>
                  <label className="form-label">Special Requests (Optional)</label>
                  <textarea
                    {...register('specialRequests')}
                    className="input-field"
                    rows="3"
                    placeholder="Any special requests or dietary requirements"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowBookingForm(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={bookingLoading}
                    className="btn-primary flex-1 disabled:opacity-50"
                  >
                    {bookingLoading ? 'Booking...' : 'Confirm Booking'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantDetail;

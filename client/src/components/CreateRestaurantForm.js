import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { restaurantsAPI } from '../services/api';
import { X, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const CreateRestaurantForm = ({ onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [menuItems, setMenuItems] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  const addMenuItem = () => {
    setMenuItems([...menuItems, { name: '', description: '', price: 0, category: '' }]);
  };

  const removeMenuItem = (index) => {
    setMenuItems(menuItems.filter((_, i) => i !== index));
  };

  const updateMenuItem = (index, field, value) => {
    const updated = [...menuItems];
    updated[index][field] = value;
    setMenuItems(updated);
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      
      const restaurantData = {
        ...data,
        menu: menuItems.filter(item => item.name.trim() !== ''),
        features: data.features || []
      };

      await restaurantsAPI.create(restaurantData);
      toast.success('Restaurant created successfully!');
      onSuccess();
      onClose();
      reset();
      setMenuItems([]);
    } catch (error) {
      console.error('Error creating restaurant:', error);
      toast.error(error.response?.data?.message || 'Failed to create restaurant');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Create New Restaurant</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Restaurant Name *</label>
                <input
                  type="text"
                  {...register('name', { required: 'Name is required' })}
                  className="input-field"
                  placeholder="Enter restaurant name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="form-label">Cuisine Type *</label>
                <input
                  type="text"
                  {...register('cuisine', { required: 'Cuisine is required' })}
                  className="input-field"
                  placeholder="e.g., Italian, Japanese, American"
                />
                {errors.cuisine && (
                  <p className="mt-1 text-sm text-red-600">{errors.cuisine.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="form-label">Description *</label>
              <textarea
                {...register('description', { required: 'Description is required' })}
                className="input-field"
                rows="3"
                placeholder="Describe your restaurant..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            {/* Contact Information */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Phone *</label>
                <input
                  type="tel"
                  {...register('phone', { required: 'Phone is required' })}
                  className="input-field"
                  placeholder="+1 (555) 123-4567"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <label className="form-label">Email *</label>
                <input
                  type="email"
                  {...register('email', { required: 'Email is required' })}
                  className="input-field"
                  placeholder="restaurant@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="form-label">Website</label>
              <input
                type="url"
                {...register('website')}
                className="input-field"
                placeholder="https://example.com"
              />
            </div>

            {/* Address */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Address</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Street</label>
                  <input
                    type="text"
                    {...register('address.street')}
                    className="input-field"
                    placeholder="123 Main Street"
                  />
                </div>

                <div>
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    {...register('address.city')}
                    className="input-field"
                    placeholder="New York"
                  />
                </div>

                <div>
                  <label className="form-label">State</label>
                  <input
                    type="text"
                    {...register('address.state')}
                    className="input-field"
                    placeholder="NY"
                  />
                </div>

                <div>
                  <label className="form-label">Zip Code</label>
                  <input
                    type="text"
                    {...register('address.zipCode')}
                    className="input-field"
                    placeholder="10001"
                  />
                </div>

                <div>
                  <label className="form-label">Country</label>
                  <input
                    type="text"
                    {...register('address.country')}
                    className="input-field"
                    placeholder="USA"
                  />
                </div>
              </div>
            </div>

            {/* Restaurant Details */}
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="form-label">Price Range *</label>
                <select
                  {...register('priceRange', { required: 'Price range is required' })}
                  className="input-field"
                >
                  <option value="">Select price range</option>
                  <option value="$">$ - Budget</option>
                  <option value="$$">$$ - Moderate</option>
                  <option value="$$$">$$$ - Expensive</option>
                  <option value="$$$$">$$$$ - Very Expensive</option>
                </select>
                {errors.priceRange && (
                  <p className="mt-1 text-sm text-red-600">{errors.priceRange.message}</p>
                )}
              </div>

              <div>
                <label className="form-label">Capacity *</label>
                <input
                  type="number"
                  {...register('capacity', { required: 'Capacity is required', min: 1 })}
                  className="input-field"
                  placeholder="50"
                />
                {errors.capacity && (
                  <p className="mt-1 text-sm text-red-600">{errors.capacity.message}</p>
                )}
              </div>
            </div>

            {/* Opening Hours */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Opening Hours</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => (
                  <div key={day} className="flex items-center gap-2">
                    <label className="w-20 text-sm font-medium text-gray-700 capitalize">
                      {day}
                    </label>
                    <input
                      type="time"
                      {...register(`openingHours.${day}.open`)}
                      className="input-field flex-1"
                    />
                    <span className="text-gray-500">to</span>
                    <input
                      type="time"
                      {...register(`openingHours.${day}.close`)}
                      className="input-field flex-1"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Features</h3>
              <div className="grid md:grid-cols-3 gap-2">
                {['wifi', 'parking', 'delivery', 'takeout', 'outdoor_seating', 'private_rooms'].map((feature) => (
                  <label key={feature} className="flex items-center">
                    <input
                      type="checkbox"
                      value={feature}
                      {...register('features')}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700 capitalize">
                      {feature.replace('_', ' ')}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Menu Items */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Menu Items (Optional)</h3>
                <button
                  type="button"
                  onClick={addMenuItem}
                  className="btn-secondary flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Item
                </button>
              </div>

              {menuItems.map((item, index) => (
                <div key={index} className="grid md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => updateMenuItem(index, 'name', e.target.value)}
                      className="input-field"
                      placeholder="Item name"
                    />
                  </div>

                  <div>
                    <label className="form-label">Description</label>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateMenuItem(index, 'description', e.target.value)}
                      className="input-field"
                      placeholder="Item description"
                    />
                  </div>

                  <div>
                    <label className="form-label">Category</label>
                    <input
                      type="text"
                      value={item.category}
                      onChange={(e) => updateMenuItem(index, 'category', e.target.value)}
                      className="input-field"
                      placeholder="e.g., Appetizer"
                    />
                  </div>

                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <label className="form-label">Price</label>
                      <input
                        type="number"
                        value={item.price}
                        onChange={(e) => updateMenuItem(index, 'price', parseFloat(e.target.value) || 0)}
                        className="input-field"
                        placeholder="0.00"
                        step="0.01"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeMenuItem(index)}
                      className="btn-secondary p-2 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-1 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Restaurant'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateRestaurantForm;

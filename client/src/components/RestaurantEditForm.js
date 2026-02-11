import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { restaurantsAPI } from '../services/api';
import { X, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { priceRangeOptions } from '../constants/priceRanges';

const RestaurantEditForm = ({ restaurant, onClose, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [menuItems, setMenuItems] = useState(restaurant.menu || []);
  const [imageUrls, setImageUrls] = useState(
    restaurant.images && restaurant.images.length > 0 ? restaurant.images : ['']
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm({
    defaultValues: {
      name: restaurant.name,
      description: restaurant.description,
      cuisine: restaurant.cuisine,
      phone: restaurant.phone,
      email: restaurant.email,
      website: restaurant.website || '',
      priceRange: restaurant.priceRange,
      capacity: restaurant.capacity,
      'address.street': restaurant.address?.street || '',
      'address.city': restaurant.address?.city || '',
      'address.state': restaurant.address?.state || '',
      'address.zipCode': restaurant.address?.zipCode || '',
      'address.country': restaurant.address?.country || '',
      features: restaurant.features || []
    }
  });

  const addMenuItem = () => {
    setMenuItems([...menuItems, { name: '', description: '', price: 0, category: '' }]);
  };

  const addImageField = () => {
    setImageUrls([...imageUrls, '']);
  };

  const updateImageField = (index, value) => {
    const updated = [...imageUrls];
    updated[index] = value;
    setImageUrls(updated);
  };

  const removeImageField = (index) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
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
      
      const updateData = {
        ...data,
        menu: menuItems.filter(item => item.name.trim() !== ''),
        features: data.features || [],
        images: imageUrls.map((url) => url.trim()).filter(Boolean)
      };

      await restaurantsAPI.update(restaurant._id, updateData);
      toast.success('Restaurant updated successfully!');
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error updating restaurant:', error);
      toast.error(error.response?.data?.message || 'Failed to update restaurant');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Edit Restaurant</h2>
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
                <label className="form-label">Restaurant Name</label>
                <input
                  type="text"
                  {...register('name', { required: 'Name is required' })}
                  className="input-field"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="form-label">Cuisine Type</label>
                <input
                  type="text"
                  {...register('cuisine', { required: 'Cuisine is required' })}
                  className="input-field"
                />
                {errors.cuisine && (
                  <p className="mt-1 text-sm text-red-600">{errors.cuisine.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="form-label">Description</label>
              <textarea
                {...register('description', { required: 'Description is required' })}
                className="input-field"
                rows="3"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            {/* Contact Information */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Phone</label>
                <input
                  type="tel"
                  {...register('phone', { required: 'Phone is required' })}
                  className="input-field"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <label className="form-label">Email</label>
                <input
                  type="email"
                  {...register('email', { required: 'Email is required' })}
                  className="input-field"
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
                  />
                </div>

                <div>
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    {...register('address.city')}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="form-label">State</label>
                  <input
                    type="text"
                    {...register('address.state')}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="form-label">Zip Code</label>
                  <input
                    type="text"
                    {...register('address.zipCode')}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="form-label">Country</label>
                  <input
                    type="text"
                    {...register('address.country')}
                    className="input-field"
                  />
                </div>
              </div>
            </div>

            {/* Restaurant Details */}
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="form-label">Price Range</label>
                <select
                  {...register('priceRange', { required: 'Price range is required' })}
                  className="input-field"
                >
                  {priceRangeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.priceRange && (
                  <p className="mt-1 text-sm text-red-600">{errors.priceRange.message}</p>
                )}
              </div>

              <div>
                <label className="form-label">Capacity</label>
                <input
                  type="number"
                  {...register('capacity', { required: 'Capacity is required', min: 1 })}
                  className="input-field"
                />
                {errors.capacity && (
                  <p className="mt-1 text-sm text-red-600">{errors.capacity.message}</p>
                )}
              </div>
            </div>

            {/* Images */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Images</h3>
                <button
                  type="button"
                  onClick={addImageField}
                  className="btn-secondary flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Image
                </button>
              </div>
              <p className="text-sm text-gray-500">
                Update the gallery by providing direct image URLs (first image appears in listings).
              </p>
              {imageUrls.map((url, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => updateImageField(index, e.target.value)}
                    className="input-field flex-1"
                    placeholder="https://example.com/restaurant-image.jpg"
                  />
                  {imageUrls.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeImageField(index)}
                      className="btn-secondary whitespace-nowrap"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Menu Items */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Menu Items</h3>
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
                {loading ? 'Updating...' : 'Update Restaurant'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RestaurantEditForm;

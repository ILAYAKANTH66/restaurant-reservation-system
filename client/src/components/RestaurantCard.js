import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, DollarSign } from 'lucide-react';

const RestaurantCard = ({ restaurant }) => {
  return (
    <Link
      to={`/restaurants/${restaurant._id}`}
      className="card hover:shadow-lg transition-shadow duration-200 group"
    >
      <div className="aspect-w-16 aspect-h-9 mb-4 bg-gray-200 rounded-lg overflow-hidden">
        {restaurant.images && restaurant.images.length > 0 ? (
          <img
            src={restaurant.images[0]}
            alt={restaurant.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
            <span className="text-primary-600 text-lg font-medium">No Image</span>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
            {restaurant.name}
          </h3>
          <div className="flex items-center gap-1">
            <DollarSign className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">{restaurant.priceRange}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="h-4 w-4" />
          <span>
            {restaurant.address?.city}, {restaurant.address?.state}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(restaurant.rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">
            {restaurant.rating.toFixed(1)} ({restaurant.rating > 0 ? 'Good' : 'No ratings'})
          </span>
        </div>

        <p className="text-gray-600 text-sm line-clamp-2">
          {restaurant.description}
        </p>

        <div className="flex items-center justify-between pt-2">
          <span className="text-sm font-medium text-primary-600">
            {restaurant.cuisine}
          </span>
          <span className="text-sm text-gray-500">
            Capacity: {restaurant.capacity}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;

import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { priceRangeOptions } from '../constants/priceRanges';

const SearchAndFilter = ({ 
  searchTerm, 
  onSearchChange, 
  filters, 
  onFilterChange, 
  onClearFilters,
  cuisineOptions = [],
  showCuisineFilter = true,
  showPriceFilter = true,
  showRatingFilter = true
}) => {
  const ratingOptions = [4, 3, 2, 1];

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search restaurants, cuisines, or descriptions..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filters:</span>
        </div>

        {showCuisineFilter && (
          <select
            value={filters.cuisine || ''}
            onChange={(e) => onFilterChange({ ...filters, cuisine: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Cuisines</option>
            {cuisineOptions.map(cuisine => (
              <option key={cuisine} value={cuisine}>{cuisine}</option>
            ))}
          </select>
        )}

        {showPriceFilter && (
          <select
            value={filters.priceRange || ''}
            onChange={(e) => onFilterChange({ ...filters, priceRange: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Prices</option>
            {priceRangeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}

        {showRatingFilter && (
          <select
            value={filters.rating || ''}
            onChange={(e) => onFilterChange({ ...filters, rating: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All Ratings</option>
            {ratingOptions.map(rating => (
              <option key={rating} value={rating}>{rating}+ Stars</option>
            ))}
          </select>
        )}

        <button
          onClick={onClearFilters}
          className="flex items-center gap-1 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 underline"
        >
          <X className="h-4 w-4" />
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default SearchAndFilter;

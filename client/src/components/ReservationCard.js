import React from 'react';
import { Calendar, Clock, Users, MapPin, Phone } from 'lucide-react';
import { format } from 'date-fns';

const ReservationCard = ({ reservation, onStatusUpdate, showActions = true }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className="card hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {reservation.restaurant?.name || 'Restaurant'}
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
            <MapPin className="h-4 w-4" />
            <span>
              {reservation.restaurant?.address?.street}, {reservation.restaurant?.address?.city}
            </span>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}>
          {getStatusText(reservation.status)}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          <span>{format(new Date(reservation.date), 'MMM dd, yyyy')}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock className="h-4 w-4" />
          <span>{reservation.time}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Users className="h-4 w-4" />
          <span>{reservation.partySize} people</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Phone className="h-4 w-4" />
          <span>{reservation.contactPhone}</span>
        </div>
      </div>

      {reservation.specialRequests && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-1">Special Requests:</h4>
          <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
            {reservation.specialRequests}
          </p>
        </div>
      )}

      {reservation.notes && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-1">Notes:</h4>
          <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
            {reservation.notes}
          </p>
        </div>
      )}

      {reservation.tableNumber && (
        <div className="mb-4">
          <span className="text-sm text-gray-600">
            Table: {reservation.tableNumber}
          </span>
        </div>
      )}

      {showActions && onStatusUpdate && (
        <div className="flex gap-2 pt-4 border-t border-gray-200">
          {reservation.status === 'pending' && (
            <>
              <button
                onClick={() => onStatusUpdate(reservation._id, 'confirmed')}
                className="btn-primary text-sm py-1 px-3"
              >
                Confirm
              </button>
              <button
                onClick={() => onStatusUpdate(reservation._id, 'cancelled')}
                className="btn-danger text-sm py-1 px-3"
              >
                Cancel
              </button>
            </>
          )}
          {reservation.status === 'confirmed' && (
            <button
              onClick={() => onStatusUpdate(reservation._id, 'completed')}
              className="btn-primary text-sm py-1 px-3"
            >
              Mark Complete
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ReservationCard;

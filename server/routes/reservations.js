const express = require('express');
const { body } = require('express-validator');
const Reservation = require('../models/Reservation');
const Restaurant = require('../models/Restaurant');
const { auth, authorize } = require('../middleware/auth');
const { handleValidationErrors, formatResponse } = require('../utils/helpers');

const router = express.Router();

// Create reservation
router.post('/', auth, [
  body('restaurant').isMongoId().withMessage('Valid restaurant ID is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('time').notEmpty().withMessage('Time is required'),
  body('partySize').isInt({ min: 1, max: 20 }).withMessage('Party size must be between 1 and 20'),
  body('contactName').trim().isLength({ min: 2 }).withMessage('Contact name is required'),
  body('contactPhone').notEmpty().withMessage('Contact phone is required')
], async (req, res) => {
  try {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return validationError;

    const { restaurant: restaurantId, date, time, partySize, specialRequests, contactName, contactPhone } = req.body;

    // Check if restaurant exists and is active
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant || !restaurant.isActive) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Check if date is in the future
    const reservationDate = new Date(date);
    if (reservationDate < new Date()) {
      return res.status(400).json({ message: 'Reservation date must be in the future' });
    }

    // Check if restaurant has capacity
    const existingReservations = await Reservation.find({
      restaurant: restaurantId,
      date: reservationDate,
      time,
      status: { $in: ['pending', 'confirmed'] }
    });

    const totalReserved = existingReservations.reduce((sum, res) => sum + res.partySize, 0);
    if (totalReserved + partySize > restaurant.capacity) {
      return res.status(400).json({ message: 'Restaurant is at full capacity for this time' });
    }

    // Create reservation
    const reservation = new Reservation({
      restaurant: restaurantId,
      user: req.user._id,
      date: reservationDate,
      time,
      partySize,
      specialRequests,
      contactName,
      contactPhone
    });

    await reservation.save();
    await reservation.populate('restaurant', 'name address');

    res.status(201).json({
      message: 'Reservation created successfully',
      reservation
    });
  } catch (error) {
    console.error('Create reservation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's reservations
router.get('/my-reservations', auth, async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user._id })
      .populate('restaurant', 'name address phone')
      .sort({ date: -1, time: -1 });

    res.json(reservations);
  } catch (error) {
    console.error('Get user reservations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get reservation by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id)
      .populate('restaurant', 'name address phone')
      .populate('user', 'name email');

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    // Check if user is authorized to view this reservation
    if (req.user.role !== 'admin' && 
        req.user.role !== 'restaurant_owner' && 
        reservation.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this reservation' });
    }

    res.json(reservation);
  } catch (error) {
    console.error('Get reservation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update reservation status (restaurant owner or admin only)
router.patch('/:id/status', auth, authorize('restaurant_owner', 'admin'), [
  body('status').isIn(['pending', 'confirmed', 'cancelled', 'completed']).withMessage('Valid status is required')
], async (req, res) => {
  try {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return validationError;

    const reservation = await Reservation.findById(req.params.id)
      .populate('restaurant', 'owner');

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    // Check if user is authorized to update this reservation
    if (req.user.role !== 'admin' && 
        reservation.restaurant.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this reservation' });
    }

    reservation.status = req.body.status;
    if (req.body.tableNumber) {
      reservation.tableNumber = req.body.tableNumber;
    }
    if (req.body.notes) {
      reservation.notes = req.body.notes;
    }

    await reservation.save();
    await reservation.populate('restaurant', 'name address');
    await reservation.populate('user', 'name email');

    res.json({
      message: 'Reservation status updated successfully',
      reservation
    });
  } catch (error) {
    console.error('Update reservation status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel reservation (user can cancel their own reservations)
router.patch('/:id/cancel', auth, async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    // Check if user is authorized to cancel this reservation
    if (req.user.role !== 'admin' && 
        req.user.role !== 'restaurant_owner' && 
        reservation.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to cancel this reservation' });
    }

    // Check if reservation can be cancelled
    if (reservation.status === 'cancelled' || reservation.status === 'completed') {
      return res.status(400).json({ message: 'Reservation cannot be cancelled' });
    }

    reservation.status = 'cancelled';
    await reservation.save();

    res.json({
      message: 'Reservation cancelled successfully',
      reservation
    });
  } catch (error) {
    console.error('Cancel reservation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get restaurant reservations (restaurant owner or admin only)
router.get('/restaurant/:restaurantId', auth, authorize('restaurant_owner', 'admin'), async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.restaurantId);
    
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Check if user is authorized to view this restaurant's reservations
    if (req.user.role !== 'admin' && restaurant.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this restaurant\'s reservations' });
    }

    const { date, status } = req.query;
    const filter = { restaurant: req.params.restaurantId };

    if (date) {
      const filterDate = new Date(date);
      filter.date = {
        $gte: filterDate,
        $lt: new Date(filterDate.getTime() + 24 * 60 * 60 * 1000)
      };
    }

    if (status) {
      filter.status = status;
    }

    const reservations = await Reservation.find(filter)
      .populate('user', 'name email phone')
      .sort({ date: 1, time: 1 });

    res.json(reservations);
  } catch (error) {
    console.error('Get restaurant reservations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

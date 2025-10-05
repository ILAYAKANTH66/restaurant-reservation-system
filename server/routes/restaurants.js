const express = require('express');
const { body } = require('express-validator');
const Restaurant = require('../models/Restaurant');
const { auth, authorize } = require('../middleware/auth');
const { handleValidationErrors, formatResponse } = require('../utils/helpers');

const router = express.Router();

// Get all restaurants (public)
router.get('/', async (req, res) => {
  try {
    const { cuisine, city, priceRange, rating } = req.query;
    const filter = { isActive: true };

    if (cuisine) filter.cuisine = cuisine;
    if (city) filter['address.city'] = city;
    if (priceRange) filter.priceRange = priceRange;
    if (rating) filter.rating = { $gte: parseFloat(rating) };

    const restaurants = await Restaurant.find(filter)
      .populate('owner', 'name email')
      .sort({ rating: -1, name: 1 });

    res.json(restaurants);
  } catch (error) {
    console.error('Get restaurants error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get restaurant by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id)
      .populate('owner', 'name email phone');

    if (!restaurant || !restaurant.isActive) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    res.json(restaurant);
  } catch (error) {
    console.error('Get restaurant error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create restaurant (restaurant owner or admin only)
router.post('/', auth, authorize('restaurant_owner', 'admin'), [
  body('name').trim().isLength({ min: 2 }).withMessage('Restaurant name is required'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('cuisine').notEmpty().withMessage('Cuisine type is required'),
  body('phone').notEmpty().withMessage('Phone number is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('capacity').isInt({ min: 1 }).withMessage('Capacity must be at least 1')
], async (req, res) => {
  try {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return validationError;

    const restaurant = new Restaurant({
      ...req.body,
      owner: req.user._id
    });

    await restaurant.save();
    await restaurant.populate('owner', 'name email');

    res.status(201).json({
      message: 'Restaurant created successfully',
      restaurant
    });
  } catch (error) {
    console.error('Create restaurant error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update restaurant (owner or admin only)
router.put('/:id', auth, authorize('restaurant_owner', 'admin'), [
  body('name').optional().trim().isLength({ min: 2 }),
  body('description').optional().trim().isLength({ min: 10 }),
  body('email').optional().isEmail()
], async (req, res) => {
  try {
    const validationError = handleValidationErrors(req, res);
    if (validationError) return validationError;

    const restaurant = await Restaurant.findById(req.params.id);
    
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Check if user is owner or admin
    if (req.user.role !== 'admin' && restaurant.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this restaurant' });
    }

    const updatedRestaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('owner', 'name email');

    res.json({
      message: 'Restaurant updated successfully',
      restaurant: updatedRestaurant
    });
  } catch (error) {
    console.error('Update restaurant error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete restaurant (owner or admin only)
router.delete('/:id', auth, authorize('restaurant_owner', 'admin'), async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Check if user is owner or admin
    if (req.user.role !== 'admin' && restaurant.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this restaurant' });
    }

    // Soft delete
    restaurant.isActive = false;
    await restaurant.save();

    res.json({ message: 'Restaurant deleted successfully' });
  } catch (error) {
    console.error('Delete restaurant error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get restaurants by owner
router.get('/owner/my-restaurants', auth, authorize('restaurant_owner', 'admin'), async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ 
      owner: req.user._id,
      isActive: true 
    }).sort({ createdAt: -1 });

    res.json(restaurants);
  } catch (error) {
    console.error('Get owner restaurants error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

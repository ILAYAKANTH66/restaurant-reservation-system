const { validationResult } = require('express-validator');

// Handle validation errors
const handleValidationErrors = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const details = errors.array();
    const firstMessage = details[0]?.msg || 'Validation failed';
    return res.status(400).json({ 
      success: false,
      message: firstMessage,
      errors: details
    });
  }
  return null;
};

// Format response
const formatResponse = (success, message, data = null, errors = null) => {
  return {
    success,
    message,
    ...(data && { data }),
    ...(errors && { errors })
  };
};

// Generate random string
const generateRandomString = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Format date for display
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Format time for display
const formatTime = (time) => {
  return time;
};

// Check if date is in the future
const isDateInFuture = (date) => {
  return new Date(date) > new Date();
};

// Calculate time difference in hours
const getTimeDifference = (date1, date2) => {
  const diffTime = Math.abs(new Date(date2) - new Date(date1));
  const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
  return diffHours;
};

module.exports = {
  handleValidationErrors,
  formatResponse,
  generateRandomString,
  formatDate,
  formatTime,
  isDateInFuture,
  getTimeDifference
};

const validator = require('validator');

const validateEmail = (email) => {
  return validator.isEmail(email);
};

const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

const validatePhone = (phone) => {
  return validator.isMobilePhone(phone, 'any', { strictMode: false });
};

const validateUserData = (data) => {
  const errors = {};

  if (!data.first_name || data.first_name.trim().length === 0) {
    errors.first_name = 'First name is required';
  }

  if (!data.last_name || data.last_name.trim().length === 0) {
    errors.last_name = 'Last name is required';
  }

  if (!validateEmail(data.email)) {
    errors.email = 'Valid email is required';
  }

  if (!validatePassword(data.password)) {
    errors.password = 'Password must be at least 8 characters with uppercase, lowercase, and numbers';
  }

  if (data.phone && !validatePhone(data.phone)) {
    errors.phone = 'Valid phone number is required';
  }

  return errors;
};

const validateMenuItem = (data) => {
  const errors = {};

  if (!data.name || data.name.trim().length === 0) {
    errors.name = 'Menu item name is required';
  }

  if (!data.category_id || isNaN(data.category_id)) {
    errors.category_id = 'Valid category is required';
  }

  if (!data.price || isNaN(data.price) || data.price <= 0) {
    errors.price = 'Valid price is required';
  }

  return errors;
};

const validateOrder = (data) => {
  const errors = {};

  if (!data.delivery_date) {
    errors.delivery_date = 'Delivery date is required';
  }

  if (!data.delivery_address || data.delivery_address.trim().length === 0) {
    errors.delivery_address = 'Delivery address is required';
  }

  if (!Array.isArray(data.items) || data.items.length === 0) {
    errors.items = 'At least one item is required';
  }

  return errors;
};

module.exports = {
  validateEmail,
  validatePassword,
  validatePhone,
  validateUserData,
  validateMenuItem,
  validateOrder,
};

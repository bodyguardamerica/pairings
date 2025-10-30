const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getProfile,
  registerValidation,
  loginValidation
} = require('../core/auth/authController');
const { authenticate } = require('../middleware/auth');
const { validateContent } = require('../middleware/contentFilter');

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', registerValidation, validateContent(['username', 'email']), register);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', loginValidation, login);

/**
 * @route   GET /api/auth/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/profile', authenticate, getProfile);

module.exports = router;

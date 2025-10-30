const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { authenticate, authorize } = require('../middleware/auth');
const {
  getAllUsers,
  updateUserRole,
  deleteUser,
  getSystemStats,
  getUserById
} = require('../core/admin/adminController');

// All routes require admin role
router.use(authenticate);
router.use(authorize('admin'));

/**
 * @route   GET /api/admin/users
 * @desc    Get all users with filtering and pagination
 * @access  Admin only
 * @query   role - Filter by role (player, to, admin)
 * @query   search - Search by username or email
 * @query   limit - Results per page (default: 50)
 * @query   offset - Pagination offset (default: 0)
 */
router.get('/users', getAllUsers);

/**
 * @route   GET /api/admin/users/:userId
 * @desc    Get detailed information about a specific user
 * @access  Admin only
 */
router.get('/users/:userId', getUserById);

/**
 * @route   PUT /api/admin/users/:userId/role
 * @desc    Update user's role
 * @access  Admin only
 * @body    role - New role (player, to, admin)
 */
router.put(
  '/users/:userId/role',
  [
    body('role')
      .notEmpty()
      .withMessage('Role is required')
      .isIn(['player', 'to', 'admin'])
      .withMessage('Invalid role. Must be player, to, or admin')
  ],
  updateUserRole
);

/**
 * @route   DELETE /api/admin/users/:userId
 * @desc    Delete a user account
 * @access  Admin only
 */
router.delete('/users/:userId', deleteUser);

/**
 * @route   GET /api/admin/stats
 * @desc    Get system-wide statistics
 * @access  Admin only
 */
router.get('/stats', getSystemStats);

module.exports = router;

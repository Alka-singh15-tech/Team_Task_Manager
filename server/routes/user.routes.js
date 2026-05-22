const express = require('express');
const router = express.Router();
const { getUsers, getUserById } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/', authorize('admin'), getUsers);
router.get('/:id', getUserById);

module.exports = router;

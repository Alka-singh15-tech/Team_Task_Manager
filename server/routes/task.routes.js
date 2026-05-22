const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');
const { body, param } = require('express-validator');

const taskValidation = [
  body('projectId').isUUID().withMessage('projectId must be a UUID'),
  body('title').notEmpty().withMessage('Title required'),
  body('description').optional().isString(),
  body('dueDate').optional().isISO8601(),
  body('status').optional().isIn(['todo', 'in-progress', 'done', 'overdue']),
  body('priority').optional().isIn(['low', 'medium', 'high']),
  body('assigneeId').optional().isUUID(),
];

router.use(protect);

router.post('/', authorize('admin'), taskValidation, createTask);
router.get('/', getTasks);
router.get('/:id', param('id').isUUID(), getTaskById);
router.put('/:id', param('id').isUUID(), updateTask);
router.delete('/:id', param('id').isUUID(), authorize('admin'), deleteTask);

module.exports = router;

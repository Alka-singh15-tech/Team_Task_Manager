const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');
const { addMember, removeMember } = require('../controllers/membershipController');
const { body, param } = require('express-validator');

const projectValidation = [
  body('name').notEmpty().withMessage('Project name required'),
  body('description').optional().isString(),
  body('deadline').optional().isISO8601(),
  body('status').optional().isIn(['active', 'completed', 'on-hold']),
];

router.use(protect);

router.post('/', authorize('admin'), projectValidation, createProject);
router.get('/', getProjects);
router.get('/:id', param('id').isUUID(), getProject);
router.put('/:id', param('id').isUUID(), projectValidation, updateProject);
router.delete('/:id', param('id').isUUID(), deleteProject);

// Member management
router.post('/:projectId/members', authorize('admin'), addMember);
router.delete('/:projectId/members/:userId', authorize('admin'), removeMember);

module.exports = router;

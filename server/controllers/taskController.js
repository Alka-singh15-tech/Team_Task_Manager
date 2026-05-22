const { Task, Project, ProjectMember, User } = require('../models');
const { validationResult } = require('express-validator');

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private/Admin
exports.createTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    const { projectId, title, description, dueDate, status, priority, assigneeId } = req.body;

    // Verify project exists and requester is admin/owner
    const project = await Project.findByPk(projectId);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    if (req.user.role !== 'admin' && project.ownerId !== req.user.id) {
       return res.status(403).json({ success: false, message: 'Admin rights required to create tasks' });
    }

    const task = await Task.create({
      projectId,
      title,
      description,
      dueDate,
      status,
      priority,
      assigneeId
    });

    res.status(201).json({
      success: true,
      data: task,
      message: 'Task created successfully'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
exports.getTasks = async (req, res, next) => {
  try {
    const { projectId, status, assigneeId } = req.query;
    const where = {};
    if (projectId) where.projectId = projectId;
    if (status) where.status = status;
    if (assigneeId) where.assigneeId = assigneeId;

    const tasks = await Task.findAll({
      where,
      include: [
        { model: Project, as: 'project', attributes: ['id', 'name'] },
        { model: User, as: 'assignee', attributes: ['id', 'name', 'email'] }
      ]
    });

    res.json({
      success: true,
      data: tasks,
      message: 'Tasks fetched successfully'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get task by ID
// @route   GET /api/tasks/:id
// @access  Private
exports.getTaskById = async (req, res, next) => {
    try {
      const task = await Task.findByPk(req.params.id, {
        include: [
          { model: Project, as: 'project', attributes: ['id', 'name'] },
          { model: User, as: 'assignee', attributes: ['id', 'name', 'email'] }
        ]
      });

      if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

      res.json({
        success: true,
        data: task,
        message: 'Task fetched successfully'
      });
    } catch (err) {
      next(err);
    }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await Task.findByPk(id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    const project = await Project.findByPk(task.projectId);

    // Admin/Owner can update everything. Member can only update status.
    const isOwnerOrAdmin = req.user.role === 'admin' || project.ownerId === req.user.id;
    const isAssignee = task.assigneeId === req.user.id;

    if (!isOwnerOrAdmin && !isAssignee) {
        return res.status(403).json({ success: false, message: 'Not authorized to update this task' });
    }

    const { title, description, dueDate, status, priority, assigneeId } = req.body;

    if (isOwnerOrAdmin) {
        await task.update({ title, description, dueDate, status, priority, assigneeId });
    } else {
        // Only update status
        await task.update({ status });
    }

    res.json({
      success: true,
      data: task,
      message: 'Task updated successfully'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private/Admin
exports.deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const task = await Task.findByPk(id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

    const project = await Project.findByPk(task.projectId);
    if (req.user.role !== 'admin' && project.ownerId !== req.user.id) {
       return res.status(403).json({ success: false, message: 'Not authorized to delete this task' });
    }

    await task.destroy();
    res.json({
      success: true,
      data: {},
      message: 'Task deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};

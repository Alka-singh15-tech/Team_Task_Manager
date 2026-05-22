const { Project, User, ProjectMember, Task } = require('../models');
const { validationResult } = require('express-validator');

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private/Admin
exports.createProject = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

    const { name, description, deadline, status } = req.body;

    const project = await Project.create({
      name,
      description,
      deadline,
      status,
      ownerId: req.user.id
    });

    // creator also becomes member as admin
    await ProjectMember.create({ userId: req.user.id, projectId: project.id, role: 'admin' });

    res.status(201).json({
      success: true,
      data: project,
      message: 'Project created successfully'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
exports.getProjects = async (req, res, next) => {
  try {
    let projects;
    if (req.user.role === 'admin') {
      // Admin sees ALL projects
      projects = await Project.findAll({
        include: [
          { model: User, as: 'owner', attributes: ['id', 'name', 'email'] },
          { model: User, as: 'members', attributes: ['id', 'name', 'email', 'role'] }
        ]
      });
    } else {
      // Member sees projects they belong to
      projects = await req.user.getProjects({
        include: [
          { model: User, as: 'owner', attributes: ['id', 'name', 'email'] },
          { model: User, as: 'members', attributes: ['id', 'name', 'email', 'role'] }
        ]
      });
    }
    res.json({
      success: true,
      data: projects,
      message: 'Projects fetched successfully'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single project details
// @route   GET /api/projects/:id
// @access  Private
exports.getProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const project = await Project.findByPk(id, {
      include: [
        { model: Task, as: 'tasks', include: [{ model: User, as: 'assignee', attributes: ['id', 'name'] }] },
        { model: User, as: 'members', attributes: ['id', 'name', 'email', 'role'] },
        { model: User, as: 'owner', attributes: ['id', 'name', 'email'] }
      ]
    });

    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    // ensure user is member or admin
    const isMember = await ProjectMember.findOne({ where: { userId: req.user.id, projectId: id } });
    if (!isMember && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    res.json({
      success: true,
      data: project,
      message: 'Project details fetched successfully'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private/Admin
exports.updateProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, status, deadline } = req.body;

    const project = await Project.findByPk(id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    if (req.user.role !== 'admin' && project.ownerId !== req.user.id) {
       return res.status(403).json({ success: false, message: 'Not authorized to update this project' });
    }

    await project.update({ name, description, status, deadline });
    res.json({
      success: true,
      data: project,
      message: 'Project updated successfully'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
exports.deleteProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const project = await Project.findByPk(id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    if (req.user.role !== 'admin' && project.ownerId !== req.user.id) {
       return res.status(403).json({ success: false, message: 'Not authorized to delete this project' });
    }

    await project.destroy();
    res.json({
      success: true,
      data: {},
      message: 'Project deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};

const { ProjectMember, Project, User } = require('../models');

// @desc    Add a user to a project
// @route   POST /api/projects/:projectId/members
// @access  Private/Admin
exports.addMember = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { userId, role } = req.body;

    const project = await Project.findByPk(projectId);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    // Admin/Owner check
    if (req.user.role !== 'admin' && project.ownerId !== req.user.id) {
       return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const [member, created] = await ProjectMember.findOrCreate({
      where: { projectId, userId },
      defaults: { role: role || 'member' }
    });

    if (!created && role) {
      member.role = role;
      await member.save();
    }

    res.status(201).json({
      success: true,
      data: member,
      message: 'Member added successfully'
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Remove a user from a project
// @route   DELETE /api/projects/:projectId/members/:userId
// @access  Private/Admin
exports.removeMember = async (req, res, next) => {
  try {
    const { projectId, userId } = req.params;

    const project = await Project.findByPk(projectId);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    if (req.user.role !== 'admin' && project.ownerId !== req.user.id) {
       return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const member = await ProjectMember.findOne({ where: { projectId, userId } });
    if (!member) return res.status(404).json({ success: false, message: 'Member not found' });

    await member.destroy();
    res.json({
      success: true,
      data: {},
      message: 'Member removed successfully'
    });
  } catch (err) {
    next(err);
  }
};

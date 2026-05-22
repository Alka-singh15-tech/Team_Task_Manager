const { sequelize } = require('../config/db');
const User = require('./User');
const Project = require('./Project');
const Task = require('./Task');
const ProjectMember = require('./ProjectMember');

// Associations
// User - Project (via ProjectMember)
User.belongsToMany(Project, { through: ProjectMember, as: 'projects', foreignKey: 'userId' });
Project.belongsToMany(User, { through: ProjectMember, as: 'members', foreignKey: 'projectId' });

// Project - Owner (User)
Project.belongsTo(User, { as: 'owner', foreignKey: 'ownerId' });
User.hasMany(Project, { as: 'ownedProjects', foreignKey: 'ownerId' });

// Project - Task
Project.hasMany(Task, { as: 'tasks', foreignKey: 'projectId', onDelete: 'CASCADE' });
Task.belongsTo(Project, { as: 'project', foreignKey: 'projectId' });

// Task - Assignee (User)
Task.belongsTo(User, { as: 'assignee', foreignKey: 'assigneeId' });
User.hasMany(Task, { as: 'assignedTasks', foreignKey: 'assigneeId' });

module.exports = {
  sequelize,
  User,
  Project,
  Task,
  ProjectMember,
};

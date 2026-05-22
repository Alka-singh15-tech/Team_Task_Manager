const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const ProjectMember = sequelize.define('ProjectMember', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  role: {
    type: DataTypes.ENUM('admin', 'member'),
    defaultValue: 'member',
  },
}, {
  timestamps: true,
  tableName: 'project_members',
});

module.exports = ProjectMember;

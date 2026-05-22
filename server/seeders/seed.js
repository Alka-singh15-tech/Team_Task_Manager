const { User, Project, Task, ProjectMember, sequelize } = require('../models');
const bcrypt = require('bcryptjs');

const seedData = async () => {
  try {
    // Clear existing data
    await sequelize.sync({ force: true });
    console.log('Database cleared.');

    // Create Users
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    const memberPassword = await bcrypt.hash('member123', salt);

    const users = await User.bulkCreate([
      { name: 'Admin One', email: 'admin1@example.com', password: adminPassword, role: 'admin' },
      { name: 'Admin Two', email: 'admin2@example.com', password: adminPassword, role: 'admin' },
      { name: 'Member One', email: 'member1@example.com', password: memberPassword, role: 'member' },
      { name: 'Member Two', email: 'member2@example.com', password: memberPassword, role: 'member' },
      { name: 'Member Three', email: 'member3@example.com', password: memberPassword, role: 'member' },
    ]);

    console.log('Users seeded.');

    // Create Projects
    const projects = await Project.bulkCreate([
      { name: 'E-commerce Site', description: 'Building a modern e-commerce platform.', deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), ownerId: users[0].id },
      { name: 'Mobile App', description: 'Developing a fitness tracking app.', deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), ownerId: users[1].id },
      { name: 'Marketing Campaign', description: 'Launching Summer 2024 campaign.', deadline: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), ownerId: users[0].id }, // Overdue
    ]);

    console.log('Projects seeded.');

    // Assign Members
    await ProjectMember.bulkCreate([
      { projectId: projects[0].id, userId: users[0].id, role: 'admin' },
      { projectId: projects[0].id, userId: users[2].id, role: 'member' },
      { projectId: projects[0].id, userId: users[3].id, role: 'member' },
      { projectId: projects[1].id, userId: users[1].id, role: 'admin' },
      { projectId: projects[1].id, userId: users[2].id, role: 'member' },
      { projectId: projects[2].id, userId: users[0].id, role: 'admin' },
      { projectId: projects[2].id, userId: users[4].id, role: 'member' },
    ]);

    console.log('Project members seeded.');

    // Create Tasks
    await Task.bulkCreate([
      { title: 'Setup Database', description: 'Configure Postgres', status: 'done', priority: 'high', projectId: projects[0].id, assigneeId: users[0].id, dueDate: new Date() },
      { title: 'Home Page UI', description: 'Design implementation', status: 'in-progress', priority: 'medium', projectId: projects[0].id, assigneeId: users[2].id, dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) },
      { title: 'Payment Integration', description: 'Stripe setup', status: 'todo', priority: 'high', projectId: projects[0].id, assigneeId: users[3].id, dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000) },
      { title: 'Login Screen', description: 'React Auth', status: 'done', priority: 'medium', projectId: projects[1].id, assigneeId: users[1].id, dueDate: new Date() },
      { title: 'Connect to API', description: 'Axios setup', status: 'in-progress', priority: 'medium', projectId: projects[1].id, assigneeId: users[2].id, dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) },
      { title: 'Create Ad Banner', description: 'Canva design', status: 'overdue', priority: 'medium', projectId: projects[2].id, assigneeId: users[4].id, dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
      { title: 'Social Media Post', description: 'Schedule on Buffer', status: 'todo', priority: 'low', projectId: projects[2].id, assigneeId: users[0].id, dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) },
      { title: 'Task 8', description: 'Desc 8', status: 'todo', priority: 'low', projectId: projects[0].id, assigneeId: users[2].id, dueDate: new Date() },
      { title: 'Task 9', description: 'Desc 9', status: 'in-progress', priority: 'medium', projectId: projects[0].id, assigneeId: users[3].id, dueDate: new Date() },
      { title: 'Task 10', description: 'Desc 10', status: 'todo', priority: 'high', projectId: projects[1].id, assigneeId: users[1].id, dueDate: new Date() },
    ]);

    console.log('Tasks seeded.');
    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();

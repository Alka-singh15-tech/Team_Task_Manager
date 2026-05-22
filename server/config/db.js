const { Sequelize } = require('sequelize');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      logging: false,
      dialectOptions: isProduction ? {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      } : {}
    })
  : new Sequelize(
      `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
      {
        dialect: 'postgres',
        logging: false,
      }
    );

module.exports = { sequelize };

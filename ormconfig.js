require('dotenv').config();
const path = require('path');
module.exports = {
  type: 'sqlite',
  database: path.join(__dirname, './db.sqlite'),
  logging: true,
  entities: ['src/entity/**/*.ts'],
  migrations: ['src/migrations/**/*.ts'],
  subscribers: ['src/subscriber/**/*.ts'],
  cli: {
    entitiesDir: 'src/entity',
    migrationsDir: 'src/migrations',
    subscribersDir: 'src/subscriber',
  },
};

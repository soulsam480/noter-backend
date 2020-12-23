require('dotenv').config();
module.exports = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DBNAME,
  logging: true,
  entities:
    process.env.NODE_ENV === 'dev'
      ? ['src/entity/**/*.ts']
      : ['./entity/*'],
  migrations:
    process.env.NODE_ENV === 'dev'
      ? ['src/migration/**/*.ts']
      : ['./migrations/*'],
  subscribers: ['src/subscriber/**/*.ts'],
  cli: {
    entitiesDir: 'src/entity',
    migrationsDir: 'src/migration',
    subscribersDir: 'src/subscriber',
  },
};

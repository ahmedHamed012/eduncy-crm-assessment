import * as dotenv from 'dotenv';

dotenv.config();
console.log(process.env.DATABASE_URL);
const knexConfig = {
  client: 'pg', // PostgreSQL
  useNullAsDefault: true, // 👈 Fix for default values in SQLite
  // connection:
  //   'postgresql://postgres:hamed@localhost:5432/eduncy_crm?schema=crm',
  connection: {
    host: process.env.DATABASE_HOST || 'localhost',
    port: Number(process.env.DATABASE_PORT) || 5432,
    user: process.env.DATABASE_USER || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'hamed',
    database: process.env.DATABASE_NAME || 'eduncy_crm',
  },
  pool: { min: 2, max: 10 },
  migrations: {
    tableName: 'knex_migrations',
    directory: '../../database/migrations',
  },
  seeds: {
    directory: '../../database/seeds',
  },
};

export default knexConfig;

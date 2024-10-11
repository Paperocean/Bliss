const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres_user',
  host: 'localhost',
  database: 'my_database',
  password: 'password',
  port: 5432,
});

module.exports = pool;

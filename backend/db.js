const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgre_user',
  host: 'localhost',
  database: 'project',
  password: 'npassword',
  port: 5432,
});

module.exports = pool;

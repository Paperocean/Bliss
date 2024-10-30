require('dotenv').config();
const { Pool } = require('pg');

// Data base connection config
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

// Connection check
pool.connect((err) => {
  if (err) {
    console.error('Error connecting with database:', err);
  } else {
    console.log('Connected to PG database.');
  }
});

module.exports = pool;

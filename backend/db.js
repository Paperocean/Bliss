require('dotenv').config();
const { Pool } = require('pg');

// Konfiguracja połączenia z bazą danych
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

// Sprawdzanie połączenia
pool.connect((err) => {
  if (err) {
    console.error('Błąd połączenia z bazą danych:', err);
  } else {
    console.log('Połączono z bazą danych PostgreSQL');
  }
});

module.exports = pool;

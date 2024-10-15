const { Pool } = require('pg');
require('dotenv').config(); // ładowanie zmiennych z pliku .env

exports.handler = async (event) => {
    const pool = new Pool({
      user: process.env.PGUSER,
      host: process.env.PGHOST,
      database: process.env.PGDATABASE,
      password: process.env.PGPASSWORD,
      port: process.env.PGPORT,
      ssl: {
        rejectUnauthorized: false, // dla bazy danych RDS, wymaga SSL
    }
    });

  module.exports = pool;


    await client.connect();

    const { email, password } = JSON.parse(event.body);
    let response = {
        statusCode: 200,
        body: JSON.stringify({ success: false, message: 'Unknown error' }),
    };

    try {
        if (event.path === '/login') {
            const res = await client.query('SELECT * FROM users WHERE email = $1', [email]);
            if (res.rows.length > 0 && res.rows[0].password === password) {
                response.body = JSON.stringify({ success: true });
            } else {
                response.body = JSON.stringify({ success: false, message: 'Invalid credentials' });
            }
        } else if (event.path === '/register') {
            const res = await client.query('INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *', [email, password]);
            response.body = JSON.stringify({ success: true, user: res.rows[0] });
        }
    } catch (err) {
        response.body = JSON.stringify({ success: false, message: err.message });
    } finally {
        await client.end();
    }

    return response;
};
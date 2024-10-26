-- This init.sql file initializes the database schema and seeds initial data for the app.
-- It contains SQL commands to create necessary tables and, in the future, insert initial records, enabling database to be ready for use upon startup.

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100),
    email VARCHAR(100) UNIQUE
);

INSERT INTO users (username, email) VALUES
    ('john_doe', 'john@example.com');

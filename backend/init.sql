-- This init.sql file initializes the database schema and seeds initial data for the ticket selling app.
-- It contains SQL commands to create necessary tables and, in the future, insert initial records, enabling the database to be ready for use upon startup.

-- Drop tables if they already exist to prevent errors during reinitialization
DROP TABLE IF EXISTS public.transactions CASCADE;
DROP TABLE IF EXISTS public.tickets CASCADE;
DROP TABLE IF EXISTS public.events CASCADE;
DROP TABLE IF EXISTS public.event_categories CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

CREATE TABLE public.users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'buyer', -- 'buyer' or 'organizer'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM public.users WHERE username = 'john_doe') THEN
        INSERT INTO public.users (username, email, password_hash, role) 
        VALUES ('john_doe', 'john@example.com', 'example_password', 'organizer');
    END IF;
END $$;

CREATE TABLE public.event_categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

INSERT INTO public.event_categories (name)
VALUES 
    ('Rock'),
    ('Pop'),
    ('Party'),
    ('Hip-Hop'),
    ('Rap'),
    ('Jazz'),
    ('Sports'),
    ('Theater'),
    ('Conference')
ON CONFLICT DO NOTHING;

INSERT INTO public.event_categories (name)
VALUES ('Music'), ('Sports'), ('Theater'), ('Conference')
ON CONFLICT DO NOTHING;

CREATE TABLE public.events (
    event_id SERIAL PRIMARY KEY,
    organizer_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255) NOT NULL,
    category_id INT REFERENCES event_categories(category_id) ON DELETE SET NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    capacity INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.tickets (
    ticket_id SERIAL PRIMARY KEY,
    event_id INT REFERENCES events(event_id) ON DELETE CASCADE,
    user_id INT REFERENCES users(user_id) ON DELETE SET NULL,
    purchase_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'available', -- 'available', 'sold', 'cancelled'
    seat_label VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.transactions (
    transaction_id SERIAL PRIMARY KEY,
    ticket_id INT REFERENCES tickets(ticket_id) ON DELETE CASCADE,
    buyer_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    event_id INT REFERENCES events(event_id) ON DELETE CASCADE,
    payment_status VARCHAR(20) DEFAULT 'completed', -- 'completed', 'pending', 'failed'
    amount DECIMAL(10, 2) NOT NULL,
    transaction_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
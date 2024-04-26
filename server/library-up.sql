-- Create the table for books
CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    isbn VARCHAR(30) UNIQUE NOT NULL,
    genre VARCHAR(20),
    publication_date DATE,
    availability_status VARCHAR(20) DEFAULT 'available', -- possible values are available, checked_out
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
);

-- Create the table for users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    contact_details VARCHAR(15) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the table for book transactions
CREATE TABLE book_transactions (
    id SERIAL PRIMARY KEY,
    book_id INTEGER REFERENCES books(id),
    user_id INTEGER REFERENCES users(id),
    transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('check_out', 'check_in', 'reserve')),
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reserve_date TIMESTAMP,
    checkout_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    return_date TIMESTAMP,
    CONSTRAINT unique_transaction UNIQUE (book_id, user_id, transaction_type)
);

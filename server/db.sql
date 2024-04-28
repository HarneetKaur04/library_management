-- Dumped from database version 14.5 (Homebrew)
-- Dumped by pg_dump version 14.5 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;

SET default_tablespace = '';

--
-- Name: books; Type: TABLE; Schema: public; Owner: postgres
--
-- Create the table for books
CREATE TABLE IF NOT EXISTS public.books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    isbn VARCHAR(30) UNIQUE NOT NULL,
    genre VARCHAR(20),
    publication_date DATE,
    availability_status VARCHAR(20) DEFAULT 'available', -- possible values are available, checked_out
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the table for users
CREATE TABLE IF NOT EXISTS public.users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    contact_details VARCHAR(15) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- -- Create the table for book transactions and circulation
CREATE TABLE IF NOT EXISTS public.book_transactions (
    id SERIAL PRIMARY KEY,
    book_id INTEGER REFERENCES public.books(id),
    user_id INTEGER REFERENCES public.users(id),
    transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('check_out', 'check_in', 'reserve')),
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reserve_date TIMESTAMP,
    checkout_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    return_date TIMESTAMP,
    CONSTRAINT unique_transaction UNIQUE (book_id, user_id, transaction_type)
);

-- Create the table for checked out books
CREATE TABLE IF NOT EXISTS public.checked_out_books (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES public.users(id),
    book_id INTEGER REFERENCES public.books(id),
    CONSTRAINT unique_checked_out UNIQUE (user_id, book_id)
);

-- Create the table for favorite books
CREATE TABLE IF NOT EXISTS public.favorite_books (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES public.users(id),
    book_id INTEGER REFERENCES public.books(id),
    CONSTRAINT unique_favorite UNIQUE (user_id, book_id)
);

-- Data for books table
COPY public.books (title, author, isbn, genre, publication_date, availability_status, created_at, updated_at) FROM stdin with delimiter ',';
Mockingjay,Suzanne Collins,9780439023511,Fiction,2010-08-24,available,2022-04-10 00:00:00,2022-04-10 00:00:00
To Kill a Mockingbird,Harper Lee,9780061120084,Fiction,1960-07-11,available,2022-04-10 00:00:00,2022-04-10 00:00:00
1984,George Orwell,9780141036144,Fiction,1949-06-08,available,2022-04-10 00:00:00,2022-04-10 00:00:00
Pride and Prejudice,Jane Austen,9780141439518,Fiction,1813-01-28,available,2022-04-10 00:00:00,2022-04-10 00:00:00
The Great Gatsby,F. Scott Fitzgerald,9780743273565,Fiction,1925-04-10,available,2022-04-10 00:00:00,2022-04-10 00:00:00
The Catcher in the Rye,J.D. Salinger,9780316769488,Fiction,1951-07-16,available,2022-04-10 00:00:00,2022-04-10 00:00:00
The Hobbit,J.R.R. Tolkien,9780547928227,Fantasy,1937-09-21,available,2022-04-10 00:00:00,2022-04-10 00:00:00
The Lord of the Rings,J.R.R. Tolkien,9780544003415,Fantasy,1954-07-29,available,2022-04-10 00:00:00,2022-04-10 00:00:00
Harry Potter and the Sorcerers Stone,J.K. Rowling,9780590353427,Fantasy,1997-06-26,available,2022-04-10 00:00:00,2022-04-10 00:00:00
The Hunger Games,Suzanne Collins,9780439023481,Science Fiction,2008-09-14,available,2022-04-10 00:00:00,2022-04-10 00:00:00
The Da Vinci Code,Dan Brown,9780307474278,Thriller,2003-03-18,available,2022-04-10 00:00:00,2022-04-10 00:00:00
The Alchemist,Paulo Coelho,9780061122415,Fiction,1988-01-01,available,2022-04-10 00:00:00,2022-04-10 00:00:00
\.


-- -- Data for users table
COPY public.users (username, email, password, contact_details, created_at, updated_at) FROM stdin with delimiter ',';
admin,admin@test.com,$2b$10$DDXQlfDYICViIH9p//qw5ujqt3Y6kEGWstNFRMpFnKfGjGGzsca2u,222-222-2222,2022-04-10 09:00:00,2022-04-10 09:00:00
Joey Tribbiani,joey@tribbiani.com,$2b$10$fENHhHndVA.tdY3PTDQpJ.7LngcrVT5VS1sg6pKr0eySh.gCILVQi,43434343434,2024-04-27 19:31:06.801,2024-04-27 19:28:04.055
Homer Simpson,homer@simpson.com,$2b$10$c42rgKSN.0lV54mvBOkPU.ECzztSCy2kJ/5n5uTVqtFHfcmcs4OvW,11212121212,2024-04-27 19:31:06.801,2024-04-27 19:31:06.801
Barney Stinson,barney@stinson.com,$2b$10$.I7XGEI3iOfYpopE3KOOLO470wK1YLf8/YxSHzwKhBokU8uAKFxbO,999999999,2024-04-27 19:37:27.356,2024-04-27 19:37:27.356
Patrick Star,patrick@star.com,$2b$10$pLAJ4IDchwZAZXSjY2NjJ.y4iGtQr0RnKa4pRlN/S/nlhYAhswray,3748349283,2024-04-28 19:39:12.676,2024-04-28 19:39:12.676
Chandler Bing,chandler@bing.com,$2b$10$Dod3yge69Di/J8kZOsutIOl8Dp1Pwb5HXeh5s2XMZ5o0DQp2E2vHe,924824249,2024-04-29 19:39:57.637,2024-04-29 19:39:57.637
\.
--
-- PostgreSQL database dump complete
--```

-- PostgreSQL database dump
--

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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the table for users
CREATE TABLE IF NOT EXISTS public.users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the table for borrowing history
CREATE TABLE IF NOT EXISTS public.borrow_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES public.users(id),
    book_id INTEGER REFERENCES public.books(id),
    borrow_date DATE NOT NULL,
    return_date DATE,
    returned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Data for books table
COPY public.books (title, author, isbn, genre, publication_date, created_at, updated_at) FROM stdin with delimiter ',';
Mockingbird,Harper,9780061120084,Fiction,1960-07-11,2022-04-10 09:00:00,2022-04-10 09:00:00
1984,George,9780141036144,Fiction,1949-06-08,2022-04-10 09:00:00,2022-04-10 09:00:00
Pride,Jane,9780141439518,Fiction,1813-01-28,2022-04-10 09:00:00,2022-04-10 09:00:00
\.

-- Data for users table
COPY public.users (id, username, email, password, created_at, updated_at) FROM stdin with delimiter ',';
user1,user1@example.com,password1,2022-04-10 09:00:00,2022-04-10 09:00:00
user2,user2@example.com,password2,2022-04-10 09:00:00,2022-04-10 09:00:00
user3,user3@example.com,password3,2022-04-10 09:00:00,2022-04-10 09:00:00
\.


-- -- Set sequence values
-- SELECT pg_catalog.setval('public.books_id_seq', 3, true);
-- SELECT pg_catalog.setval('public.users_id_seq', 3, true);

-- -- Set sequence ownership
-- ALTER SEQUENCE public.books_id_seq OWNED BY public.books.id;
-- ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;

-- -- Add primary key constraints
-- ALTER TABLE ONLY public.books ADD CONSTRAINT books_pkey PRIMARY KEY (id);
-- ALTER TABLE ONLY public.users ADD CONSTRAINT users_pkey PRIMARY KEY (id);
--
-- PostgreSQL database dump complete
--

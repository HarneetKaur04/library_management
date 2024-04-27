const db = require("../config/db-connection.js");
const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
dotenv.config();
const bcrypt = require('bcrypt');

// Get all users
router.get("/", async (req, res) => {
  try {
    const query = "SELECT * FROM users";
    const users = await db.query(query);
    res.status(200).json(users);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Register or Add a new user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, contact } = req.body;
    
    // Check if the email is already registered
    console.log(req.body)
    const existingUser = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    console.log(existingUser, existingUser, "check rows")
    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("hashedPassword", hashedPassword)

    // Insert the new user into the database
    await db.query('INSERT INTO users (username, email, password, contact_details) VALUES ($1, $2, $3, $4)', [username, email, hashedPassword, contact]);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a specific user by ID
router.get("/:id", async (req, res) => {
  try {
      const userId = req.params.id;
      const query = "SELECT * FROM users WHERE id = $1";
      const values = [userId];
      const user = await db.query(query, values);
      if (user.length === 0) {
      res.status(404).json({ message: "User not found" });
      } else {
      res.status(200).json(user[0]);
      }
  } catch (error) {
      console.error("Error:", error.message);
      res.status(500).json({ error: "Internal server error" });
  }
});

// User login
router.post('/login', async (req, res) => {
  try {
    console.log(req.body)
    const { email, password } = req.body;

    // Check if the user exists
    const userQueryResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    console.log(userQueryResult[0].password, password)
    const user = userQueryResult[0]; // Extract the user from the query result

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log(await bcrypt.compare(password, user.password), "passcheck")

    // Compare passwords
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Successful login
    res.status(200).json({ user });
  } catch (error) {
    console.error('Error authenticating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete user account
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    await db.query("DELETE FROM book_transactions WHERE user_id = $1", [userId]);

    // Check if the user exists
    const user = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
    if (user.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete the user from the database
    await db.query('DELETE FROM users WHERE id = $1', [userId]);

    res.status(200).json({ message: 'User account deleted successfully' });
  } catch (error) {
    console.error('Error deleting user account:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Edit a user information
router.put('/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const { username, email } = req.body;

    // Check if the user exists
    const user = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
    if (user.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update the user's information in the database
    await db.query('UPDATE users SET username = $1, email = $2 WHERE id = $3', [username, email, userId]);

    res.status(200).json({ message: 'User information updated successfully' });
  } catch (error) {
    console.error('Error updating user information:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add Book to Read Later List

// route to get all favorited books
router.get('/:userId/favorite-books', async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch all favorite books for the user from the database
    const favoriteBooks = await db.query('SELECT * FROM favorite_books WHERE user_id = $1', [userId]);
    
    res.status(200).json({ favoriteBooks });
  } catch (error) {
    console.error('Error fetching favorite books:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//route to add new book as favorite
router.post('/:userId/favorite-books', async (req, res) => {
  const { userId } = req.params;
  const { bookId } = req.body;

  try {
    // Insert the book into the user's favorite_books table
    await db.query('INSERT INTO favorite_books (user_id, book_id) VALUES ($1, $2)', [userId, bookId]);
    
    res.status(200).json({ message: 'Book added to Read Later list successfully' });
  } catch (error) {
    console.error('Error adding book to Read Later list:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Remove Book from favorite list
router.delete('/:userId/favorite-books/:bookId', async (req, res) => {
  const { userId, bookId } = req.params;

  try {
    // Delete the book from the user's favorite_books table
    await db.query('DELETE FROM favorite_books WHERE user_id = $1 AND book_id = $2', [userId, bookId]);
    
    res.status(200).json({ message: 'Book removed from Read Later list successfully' });
  } catch (error) {
    console.error('Error removing book from Read Later list:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;


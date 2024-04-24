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

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
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
    await db.query('INSERT INTO users (username, email, password) VALUES ($1, $2, $3)', [username, email, hashedPassword]);

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
router.delete('/delete', async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the user exists
    const user = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Delete the user from the database
    await db.query('DELETE FROM users WHERE email = $1', [email]);

    res.status(200).json({ message: 'User account deleted successfully' });
  } catch (error) {
    console.error('Error deleting user account:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

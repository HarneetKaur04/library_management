const db = require("../config/db-connection.js");
const cors = require("cors");
const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
dotenv.config();

// CORS middleware
router.use(cors());

// POST route to handle user registration
router.post('/', async (req, res) => {
  try {
    // Extract user data from request body
    const { username, email, password} = req.body;

    // Check if the user already exists in the database
    const queryEmail = 'SELECT * FROM users WHERE email=$1 LIMIT 1';
    const valuesEmail = [email];
    const resultsEmail = await db.query(queryEmail, valuesEmail);

    if (resultsEmail[0]) {
      // User already exists
      res.status(200).json({ message: `Welcome back, ${resultsEmail[0].username}!` });
    } else {
      // User does not exist, insert new user into the database
      const query = 'INSERT INTO users(username, email, password) VALUES($1, $2, $3) RETURNING *';
      const values = [username, email, password]; // Replace '' with password if applicable
      const result = await db.query(query, values);
      res.status(201).json(result[0]);
    }
  } catch (error) {
    // Handle errors
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
const pgPromise = require('pg-promise');
const { config } = require('dotenv');

// Load environment variables from .env file
config();

// Initialize pg-promise
const pgp = pgPromise();

// Create a database connection
const db = pgp({
  connectionString: process.env.DATABASE_URL,
});

// Event handler for connection errors
db.connect()
  .catch(error => {
    console.error('Error connecting to the database:', error);
  });

module.exports = db;

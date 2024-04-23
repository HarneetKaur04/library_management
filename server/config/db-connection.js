const pgPromise = require('pg-promise');
const { config } = require('dotenv');
config();

const pgp = pgPromise();
const db = pgp({
  connectionString: process.env.DATABASE_URL,
});

module.exports = db;
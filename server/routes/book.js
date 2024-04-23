const db = require("../config/db-connection.js");
const cors = require("cors");
const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
dotenv.config();

// CORS middleware
router.use(cors());

// Get all books
router.get("/", async (req, res) => {
    try {
      const query = "SELECT * FROM books";
      const books = await db.query(query);
      console.log(res.status)
      res.status(200).json(books);
    } catch (error) {
      console.error("Error:", error.message);
      res.status(500).json({ error: "Internal server error..." });
    }
});

// Get a specific book by ID
router.get("/:id", async (req, res) => {
try {
    const bookId = req.params.id;
    const query = "SELECT * FROM books WHERE id = $1";
    const values = [bookId];
    const book = await db.query(query, values);
    if (book.length === 0) {
    res.status(404).json({ message: "Book not found" });
    } else {
    res.status(200).json(book[0]);
    }
} catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal server error" });
}
});

// Add a new book
router.post("/", async (req, res) => {
try {
    const { title, author, isbn, publication_date, genre } = req.body;
    const query =
    "INSERT INTO books (title, author, isbn, publication_date, genre) VALUES ($1, $2, $3, $4, $5) RETURNING *";
    const values = [title, author, isbn, publication_date, genre];
    const newBook = await db.query(query, values);
    res.status(201).json(newBook[0]);
} catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal server error" });
}
});

// Update a book
router.put("/:id", async (req, res) => {
try {
    const bookId = req.params.id;
    const { title, author, isbn, publication_date, genre } = req.body;
    const query =
    "UPDATE books SET title=$1, author=$2, isbn=$3, publication_date=$4, genre=$5 WHERE id=$6 RETURNING *";
    const values = [title, author, isbn, publication_date, genre, bookId];
    const updatedBook = await db.query(query, values);
    if (updatedBook.length === 0) {
    res.status(404).json({ message: "Book not found" });
    } else {
    res.status(200).json(updatedBook[0]);
    }
} catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal server error" });
}
});

// Delete a book
router.delete("/:id", async (req, res) => {
try {
    const bookId = req.params.id;
    const query = "DELETE FROM books WHERE id = $1 RETURNING *";
    const values = [bookId];
    const deletedBook = await db.query(query, values);
    if (deletedBook.length === 0) {
    res.status(404).json({ message: "Book not found" });
    } else {
    res.status(200).json({ message: "Book deleted successfully" });
    }
} catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal server error" });
}
});

module.exports = router;
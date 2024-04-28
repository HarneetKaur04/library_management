const db = require("../config/db-connection.js");
const cors = require("cors");
const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
dotenv.config();

// CORS middleware
router.use(cors());

// Endpoint to check out a book
router.post('/check-out', async (req, res) => {
    const { bookId, userId } = req.body;

    try {
      // Check if the book is available for check-out
      const book = await db.query('SELECT * FROM books WHERE id = $1 AND availability_status = $2', [bookId, 'available']);
      if (book.length === 0) {
        return res.status(400).json({ error: 'The book is not available for immediate check-out. Please check the reserve tab to see if its available for next reservation' });
      }

      // Check if the combination of user_id and book_id already exists in checked_out_books
      const existingCheckout = await db.query('SELECT * FROM checked_out_books WHERE book_id = $1 AND user_id = $2', [bookId, userId]);
      // If the combination already exists, do not insert the entry again
      if (existingCheckout.length > 0) {
      console.log('Book already checked out by the user');
      } else {
      // Insert the entry into checked_out_books
      await db.query('INSERT INTO checked_out_books (book_id, user_id) VALUES ($1, $2)', [bookId, userId]);
      }

      // Calculate return date (4 days from current timestamp)
      const returnDate = new Date();
      returnDate.setDate(returnDate.getDate() + 4);
  
      // Insert transaction record for check-out
      await db.query('INSERT INTO book_transactions (book_id, user_id, transaction_type, transaction_date, checkout_date, return_date) VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, $4)', [bookId, userId, 'check_out', returnDate]);

      // Update book availability status to checked out
      await db.query('UPDATE books SET availability_status = $1 WHERE id = $2', ['checked_out', bookId]);

      res.status(200).json({ message: 'Book checked out successfully' });
    } catch (error) {
      console.error('Error checking out book:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
});

// Endpoint to check in a book
router.post('/check-in', async (req, res) => {
  const { bookId, userId } = req.body;
  console.log(req.body)

  try {
    // Remove the previous transaction where this book was checked out
    await db.query('DELETE FROM book_transactions WHERE book_id = $1 AND user_id = $2 AND transaction_type = $3', [bookId, userId, 'check_out']);

    // Insert transaction record
    await db.query('INSERT INTO book_transactions (book_id, user_id, transaction_type, return_date) VALUES ($1, $2, $3, CURRENT_TIMESTAMP)', [bookId, userId, 'check_in']);

    // Check if there are users who have reserved the book
    const reservedUsers = await db.query('SELECT * FROM book_transactions WHERE book_id = $1 AND transaction_type = $2 AND reserve_date <= CURRENT_TIMESTAMP', [bookId, 'reserve']);
    console.log(reservedUsers, "when user does check-in")

    // Perform check-out process for users who have reserved those books
    if (reservedUsers.length> 0) {
        for (const reservedUser of reservedUsers) {
            const { book_id: reservedBookId, user_id: reservedUserId } = reservedUser;
               
            // Calculate return date (4 days from current timestamp)
            const returnDate = new Date();
            returnDate.setDate(returnDate.getDate() + 4);

            // delete the reserve record
            await db.query('DELETE FROM book_transactions WHERE book_id = $1 AND user_id = $2 AND transaction_type = $3', [reservedBookId, reservedUserId, 'reserve']);
            // Insert transaction record for check-out
            await db.query('INSERT INTO book_transactions (book_id, user_id, transaction_type, transaction_date, checkout_date, return_date) VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, $4)', [reservedBookId, reservedUserId, 'check_out', returnDate]);
            // Check if the combination of user_id and book_id already exists in checked_out_books
            const existingCheckout = await db.query('SELECT * FROM checked_out_books WHERE book_id = $1 AND user_id = $2', [reservedBookId, reservedUserId]);
            // If the combination already exists, do not insert the entry again
            if (existingCheckout.length > 0) {
            console.log('Book already checked out by the user');
            } else {
            // Insert the entry into checked_out_books
            await db.query('INSERT INTO checked_out_books (book_id, user_id) VALUES ($1, $2)', [reservedBookId, reservedUserId]);
            }
            // Update book availability status to checked out
            await db.query('UPDATE books SET availability_status = $1 WHERE id = $2', ['checked_out', reservedBookId]);
        } 
    } else {
            // Update book availability status to available
            await db.query('UPDATE books SET availability_status = $1 WHERE id = $2', ['available', bookId]);
    }
    res.status(200).json({ message: 'Book checked in successfully' });
  } catch (error) {
    console.error('Error checking in book:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to get all books with availability_status as checked_out and not reserved
router.get('/checked-out-books', async (req, res) => {
    try {
        // Fetch all books with availability_status as checked_out and not reserved
        const checkedOutBooks = await db.query(`
            SELECT * 
            FROM books 
            WHERE availability_status = $1
            AND id NOT IN (
                SELECT book_id
                FROM book_transactions
                WHERE transaction_type = 'reserve'
            )
        `, ['checked_out']);
        console.log(checkedOutBooks, "checkedOutBooks")
      
        res.status(200).json({ checkedOutBooks });
    } catch (error) {
        console.error('Error fetching checked out books:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Endpoint to get all books with reserved status
router.get('/reserved-books', async (req, res) => {
    try {
        // Fetch all books with availability_status as checked_out and not reserved
        const reservedBooks = await db.query(`
            SELECT books.*, book_transactions.user_id
            FROM books
            INNER JOIN book_transactions ON books.id = book_transactions.book_id
            WHERE books.availability_status = 'checked_out'
            AND book_transactions.transaction_type = 'reserve';
        `);
        res.status(200).json({ reservedBooks });
    } catch (error) {
        console.error('Error fetching reserved books:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Endpoint to reserve a book
router.post('/reserve', async (req, res) => {
  const { bookId, userId } = req.body;

  try {
    // Check if the book is checked out by other user to make reservation
    const book = await db.query('SELECT * FROM books WHERE id = $1 AND availability_status = $2', [bookId, 'checked_out']);
    if (book.length === 0) {
      return res.status(400).json({ error: 'The book is available immediately to check out. Please move to check-in/check-out tab' });
    }

    // Insert transaction record for reservation
    await db.query('INSERT INTO book_transactions (book_id, user_id, transaction_type, reserve_date) VALUES ($1, $2, $3, CURRENT_TIMESTAMP)', [bookId, userId, 'reserve']);

    res.status(200).json({ message: 'Book reserved successfully' });
  } catch (error) {
    console.error('Error reserving book:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to update tables for automated checkin based on return_date as well as assign books to reserved users
router.get("/update_books_availability", async (req, res) => {
    console.log("Hit this endpoint")
    try {
        // Find reserved books that are now available
        const overdueBooks = await db.query('SELECT * FROM book_transactions WHERE transaction_type = $1 AND return_date <= CURRENT_TIMESTAMP', ['check_out']);
        console.log(overdueBooks, "overdue")
    
        for (const bookTransaction of overdueBooks) {
          const { book_id: bookId, user_id: userId } = bookTransaction;
    
          // Perform check-in process for books that are overdue

          await db.query('DELETE FROM book_transactions WHERE book_id = $1 AND user_id = $2 AND transaction_type = $3', [bookId, userId, 'check_out']);
    
          // Add a check-in transaction record
          await db.query('INSERT INTO book_transactions (book_id, user_id, transaction_type, return_date) VALUES ($1, $2, $3, CURRENT_TIMESTAMP)', [bookId, userId, 'check_in']);

          await db.query('UPDATE books SET availability_status = $1 WHERE id = $2', ['available', bookId]);

          console.log("executed")
    
          // Check if there are users who have reserved the book
          const reservedUsers = await db.query('SELECT * FROM book_transactions WHERE book_id = $1 AND transaction_type = $2 AND reserve_date <= CURRENT_TIMESTAMP', [bookId, 'reserve']);
          console.log(reservedUsers, "reservedUser check1")
    
          // Perform check-out process for users who have reserved those books
          for (const reservedUser of reservedUsers) {
            const { book_id: reservedBookId, user_id: reservedUserId } = reservedUser;
            console.log(reservedUser, "reservedUser")

            // Check if the combination of user_id and book_id already exists in checked_out_books
            const existingCheckout = await db.query('SELECT * FROM checked_out_books WHERE book_id = $1 AND user_id = $2', [reservedBookId, reservedUserId]);
            // If the combination already exists, do not insert the entry again
            if (existingCheckout.length > 0) {
            console.log('Book already checked out by the user');
            } else {
            // Insert the entry into checked_out_books
            await db.query('INSERT INTO checked_out_books (book_id, user_id) VALUES ($1, $2)', [reservedBookId, reservedUserId]);
            }
               
            // Calculate return date (4 days from current timestamp)
            const returnDate = new Date();
            returnDate.setDate(returnDate.getDate() + 4);

            // delete the reserve record
            await db.query('DELETE FROM book_transactions WHERE book_id = $1 AND user_id = $2 AND transaction_type = $3', [reservedBookId, reservedUserId, 'reserve']);
            console.log("// delete the reserve record")
            // Insert transaction record for check-out
            await db.query('INSERT INTO book_transactions (book_id, user_id, transaction_type, transaction_date, checkout_date, return_date) VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, $4)', [reservedBookId, reservedUserId, 'check_out', returnDate]);
            // Update book availability status to checked out
            await db.query('UPDATE books SET availability_status = $1 WHERE id = $2', ['checked_out', reservedBookId]);
        }
        }
        res.status(200).json({ message: 'Books availability updated successfully' });
      } catch (error) {
        console.error('Error updating books availability:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
  });
  

// Endpoint to fetch books with user information
router.get('/fetchBooksInfo', async (req, res) => {
    try {
        // Fetch all books currently checked out by all users
        const checkedOutBooksByAllUsers = await db.query(`
            SELECT 
                b.id AS book_id,
                b.title AS book_title,
                b.author AS book_author,
                b.isbn AS book_isbn,
                b.genre AS book_genre,
                bt.transaction_type,
                u.id AS user_id,
                u.username AS username,
                bt.checkout_date,
                bt.return_date
            FROM 
                books b 
            INNER JOIN 
                book_transactions bt ON b.id = bt.book_id
            INNER JOIN 
                users u ON bt.user_id = u.id
            WHERE 
                bt.transaction_type = 'check_out'
        `);

        // Fetch all books with available status
        const allAvailableBooks = await db.query(`
            SELECT * 
            FROM books 
            WHERE availability_status = $1
        `, ['available']);

        res.status(200).json({ checkedOutBooksByAllUsers, allAvailableBooks });
    } catch (error) {
        console.error('Error fetching books information:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route to fetch all read books of users
router.get('/read-books/:userId', async (req, res) => {
    const userId = req.params.userId;
  
    try {
      // Query the database to get all favorite books of the user
      const readBooks = await db.query(
        'SELECT books.* FROM checked_out_books JOIN books ON checked_out_books.book_id = books.id WHERE checked_out_books.user_id = $1',
        [userId]
      );
  
      res.json(readBooks); // Send the readBooks books as JSON response
    } catch (error) {
      console.error('Error fetching favorite books:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });



  
  

module.exports = router;

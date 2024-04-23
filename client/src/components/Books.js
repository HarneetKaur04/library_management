import React, { useState, useEffect } from 'react';
import BookDetails from './BookDetails';

function Books() {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    // Fetch books data from API
    fetch('/api/books')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setBooks(data); // Set books data to state
      })
      .catch(error => {
        console.error('Error fetching books:', error);
      });
  }, []); // Empty dependency array ensures useEffect runs only once on component mount

  const handleBookClick = (bookId) => {
    setSelectedBook(bookId); // Set the selected book id
  };

  return (
    <div className="all-books">
      <h2>All Books</h2>
      <ul>
        {books.map(book => (
          <li key={book.id} onClick={() => handleBookClick(book.id)}>{book.title}</li>
        ))}
      </ul>
      {selectedBook && <BookDetails bookId={selectedBook} />} {/* Render BookDetails if a book is selected */}
    </div>
  );
}

export default Books;

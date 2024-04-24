import React, { useState, useEffect } from 'react';

function BookDetails({ bookId }) {
  const [bookDetails, setBookDetails] = useState(null);

  useEffect(() => {
    // Fetch book details data from API based on bookId
    fetch(`http://localhost:5000/api/books/${bookId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setBookDetails(data); // Set book details data to state
      })
      .catch(error => {
        console.error('Error fetching book details:', error);
      });
  }, [bookId]); // Re-fetch book details when bookId changes

  if (!bookDetails) {
    return <div>Loading...</div>; // Show loading indicator while fetching book details
  }

  return (
    <div className="book-details">
      <h2>{bookDetails.title}</h2>
      <p><strong>Author:</strong> {bookDetails.author}</p>
      <p><strong>ISBN:</strong> {bookDetails.isbn}</p>
      <p><strong>Genre:</strong> {bookDetails.genre}</p>
    </div>
  );
}

export default BookDetails;
